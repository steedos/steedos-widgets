'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Liquid, Context } from 'liquidjs';

// --- 类型定义 ---
type SchemaObject = Record<string, any>;

interface LiquidTemplateProps {
  template: string; // Liquid 模板字符串
  data: Record<string, any>; // 数据域
  $schema?: Record<string, string | object>; // 用于定义 Partials (文件名 -> 内容)
  partials?: Record<string, string | object>; // 额外的 Partials
  className?: string;
  // AMIS 渲染函数签名
  render: (region: string, schema: SchemaObject, props?: any) => React.ReactNode;
}

// --- 工具函数 ---

const generateId = () => `amis-inline-${Math.random().toString(36).substr(2, 9)}`;

/**
 * 宽松 JSON 解析器
 * 允许无引号 Key、单引号 String，并自动修复 HTML 转义字符。
 * 注意：使用 new Function 有安全风险，仅适用于受信任的模板来源。
 */
const looseJsonParse = (str: string): any => {
  if (!str) return null;

  // 1. 基础清洗：修复 HTML 转义
  let cleanStr = str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // 2. 清洗隐形字符 (Web 复制粘贴常见问题)
  cleanStr = cleanStr.replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u2028\u2029\u202f\u205f\u3000]/g, ' ');

  try {
    // 优先尝试标准 JSON 解析 (性能最好)
    return JSON.parse(cleanStr);
  } catch (e) {
    try {
      // 降级策略: 使用 Function 解析 (支持 {key: 'value'} 写法)
      // 如果你的环境支持，推荐替换为 'json5' 库以获得更安全的解析
      return new Function("return " + cleanStr)();
    } catch (e2) {
      // 抛出原始错误以便上层捕获显示
      throw new Error(`JSON Parse Error: ${(e as Error).message}`);
    }
  }
};

// --- 组件实现 ---

export const LiquidComponent: React.FC<LiquidTemplateProps> = ({ 
  template, 
  data,
  className,
  $schema,
  render: amisRender,
  partials: propsPartials,
}) => {
  const [html, setHtml] = useState<string>('');
  const [mountNodes, setMountNodes] = useState<Record<string, HTMLElement>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 合并 Partials (优先 props 传入的，其次是 schema 定义的)
  const finalPartials = useMemo(() => ({ ...($schema || {}), ...propsPartials }), [$schema, propsPartials]);
  
  // 使用 Ref 保持 Partials 最新引用，避免 engine 重建
  const partialsRef = useRef(finalPartials);
  partialsRef.current = finalPartials;
  
  // 存储内联解析出来的 Schema，用于 Portal 渲染
  const inlineSchemasRef = useRef<Record<string, SchemaObject>>({});

  // 2. 初始化 Liquid Engine (单次初始化)
  const engine = useMemo(() => {
    const liq = new Liquid({
      // 自定义文件系统以支持内存 Partials
      fs: {
        readFileSync: (file) => {
          const content = partialsRef.current[file];
          if (typeof content === 'object' && content !== null) {
            // 如果 Partial 是对象，说明是 AMIS Schema，直接占位
            return `<div data-amis-partial="${file}"></div>`;
          }
          return typeof content === 'string' ? content : `[Template '${file}' not found]`;
        },
        existsSync: (file) => Object.prototype.hasOwnProperty.call(partialsRef.current, file),
        exists: async (file) => Object.prototype.hasOwnProperty.call(partialsRef.current, file),
        resolve: (root, file) => file,
        sep: '/',
        readFile: async (file) => {
           const content = partialsRef.current[file];
           if (typeof content === 'object' && content !== null) {
             return `<div data-amis-partial="${file}"></div>`;
           }
           return typeof content === 'string' ? content : '';
        }
      }
    });

    // 注册自定义标签 {% amis %}
    liq.registerTag('amis', {
      parse: function(tagToken, remainTokens) {
        this.templates = [];
        const stream = liq.parser.parseStream(remainTokens);
        stream.on('tag:endamis', () => stream.stop())
              .on('template', (tpl: any) => this.templates.push(tpl))
              .on('text', (tpl: any) => this.templates.push(tpl))
              .start();
      },
      render: async function(ctx: Context) {
        // 获取 Block 内部的原始字符串
        const chunks = this.templates.map((tpl: any) => tpl.str); // 获取原始 token 字符串
        const rawStr = chunks.join('').trim();
        
        if (!rawStr) return '';

        // 开发者体验优化：检测 [object Object]
        if (rawStr.includes('[object Object]')) {
           return `<div class="text-red-500 border border-red-500 p-2 text-sm bg-red-50">
             <strong>Error:</strong> Detected "[object Object]" in schema. 
             Did you forget to use the <code>| json</code> filter?
           </div>`;
        }

        try {
          const schema = looseJsonParse(rawStr);
          const id = generateId();

          // 将解析后的 Schema 注册到 React 上下文中
          // 这里的 __registerInlineSchema 是通过 Context 注入的
          let register = ctx.get(['__registerInlineSchema']);
          // 兼容性处理：防止 Liquid 版本差异导致 get 获取不到
          if (!register && (ctx as any).environments) {
             register = (ctx as any).environments['__registerInlineSchema'];
          }

          if (typeof register === 'function') {
            register(id, schema);
            // 返回占位符 DIV
            return `<div data-amis-partial="${id}" style="display: contents;"></div>`;
          } else {
            console.warn('LiquidAMIS: __registerInlineSchema hook not found in context.');
            return ``;
          }
        } catch (e) {
          console.error("Liquid Inline AMIS Parse Error:", e, "\nSource:", rawStr);
          // 错误 UI
          return `<div style="border:2px solid red; background:#fff0f0; padding:8px; font-family:monospace; border-radius: 4px; font-size: 12px;">
            <strong style="color:#d32f2f;">JSON Parse Failed</strong>
            <div style="margin-top:4px; white-space:pre-wrap; background:white; border:1px solid #ddd; padding:4px; color:#333;">${rawStr.replace(/</g, '&lt;')}</div>
            <div style="color:#d32f2f; margin-top:4px;">${(e as Error).message}</div>
          </div>`;
        }
      }
    });

    return liq;
  }, []); // 依赖为空，确保 Engine 只初始化一次

  // 用于触发重渲染的指纹
  const dataFingerprint = JSON.stringify(data);
  const partialsFingerprint = JSON.stringify(finalPartials);

  // 3. 执行 Liquid 渲染
  useEffect(() => {
    let isMounted = true;
    inlineSchemasRef.current = {}; // 重置内联 Schema 缓存

    const contextData = {
      ...data,
      // 注入回调函数，允许 Liquid 标签内部向 React 组件回传数据
      __registerInlineSchema: (id: string, schema: SchemaObject) => {
        inlineSchemasRef.current[id] = schema;
      }
    };

    engine.parseAndRender(template, contextData)
      .then((result) => {
        if (isMounted) {
          setHtml(prev => (prev !== result ? result : prev));
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Liquid Render Error:", err);
          setHtml(`<div style="color:red; padding:10px; border:1px solid red;">Global Render Error: ${err.message}</div>`);
        }
      });

    return () => { isMounted = false; };
  }, [engine, template, dataFingerprint, partialsFingerprint]);

  // 4. DOM 挂载检测 (查找占位符)
  useEffect(() => {
    if (!containerRef.current) return;

    const nodes: Record<string, HTMLElement> = {};
    const elements = containerRef.current.querySelectorAll('[data-amis-partial]');
    let hasChanges = false;

    elements.forEach((el) => {
      const key = el.getAttribute('data-amis-partial');
      if (key) {
        // 确保我们有这个 key 对应的 Schema (不管是内联的还是 props 传入的)
        const hasSchema = inlineSchemasRef.current[key] || partialsRef.current[key];
        if (hasSchema) {
          nodes[key] = el as HTMLElement;
          hasChanges = true;
        }
      }
    });

    // 只有当节点数量或引用变化时才更新状态，避免无限渲染
    // 这里简化处理，只要检测到有效节点就更新。React 的 diff 算法会处理多余的 render
    if (hasChanges) {
      setMountNodes(nodes);
    }
  }, [html]); // 当 HTML 字符串变化后，重新扫描 DOM

  // 5. 创建 React Portals
  const portals = useMemo(() => {
     return Object.keys(mountNodes).map((key) => {
        const domNode = mountNodes[key];
        // 优先取内联 Schema，其次取 Partials 定义的 Schema
        const schema = inlineSchemasRef.current[key] || partialsRef.current[key] as SchemaObject;
        
        if (!schema || !domNode) return null;

        try {
          // 使用 createPortal 将 AMIS 组件挂载到 Liquid 生成的 div 中
          // 传递 data 作为 props，确保 AMIS 能获取到数据
          return createPortal(
            amisRender(`partial-${key}`, schema, { data }), 
            domNode
          );
        } catch(e) {
          console.error(`Portal Render Error for key ${key}:`, e);
          return null; 
        }
     });
  }, [mountNodes, partialsFingerprint, dataFingerprint, amisRender, data]);

  return (
    <div className={`liquid-amis-container ${className || ''}`} ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {/* Portals 实际上不会渲染在当前 DOM 树的这个位置，而是挂载到 targetNode */}
      {portals}
    </div>
  );
};