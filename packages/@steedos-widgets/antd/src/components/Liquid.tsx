'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Liquid, Context } from 'liquidjs';

// --- 类型定义 ---
type SchemaObject = Record<string, any>;

interface LiquidTemplateProps {
  template: string; 
  data: Record<string, any>; 
  $schema?: Record<string, string | object>; 
  partials?: Record<string, string | object>; 
  className?: string;
  render: (region: string, schema: SchemaObject, props?: any) => React.ReactNode;
}

// --- 工具函数 ---
const generateId = () => `amis-inline-${Math.random().toString(36).substr(2, 9)}`;

const looseJsonParse = (str: string): any => {
  if (!str) return null;
  let cleanStr = str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  cleanStr = cleanStr.replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u2028\u2029\u202f\u205f\u3000]/g, ' ');

  try {
    return JSON.parse(cleanStr);
  } catch (e) {
    try {
      return new Function("return " + cleanStr)();
    } catch (e2) {
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
  
  // 用于存储脚本清理函数的引用，以便在组件卸载或更新时清理副作用
  const scriptCleanupsRef = useRef<Function[]>([]);

  const finalPartials = useMemo(() => ({ ...($schema || {}), ...propsPartials }), [$schema, propsPartials]);
  const partialsRef = useRef(finalPartials);
  partialsRef.current = finalPartials;
  
  const inlineSchemasRef = useRef<Record<string, SchemaObject>>({});

  // 1. 初始化 Liquid Engine
  const engine = useMemo(() => {
    const liq = new Liquid({
      fs: {
        readFileSync: (file) => {
          const content = partialsRef.current[file];
          if (typeof content === 'object' && content !== null) {
            return `<div data-amis-partial="${file}"></div>`;
          }
          return typeof content === 'string' ? content : `[Template '${file}' not found]`;
        },
        existsSync: (file) => Object.prototype.hasOwnProperty.call(partialsRef.current, file),
        exists: async (file) => Object.prototype.hasOwnProperty.call(partialsRef.current, file),
        resolve: (root, file) => file,
        readFile: async (file) => {
           const content = partialsRef.current[file];
           if (typeof content === 'object' && content !== null) {
             return `<div data-amis-partial="${file}"></div>`;
           }
           return typeof content === 'string' ? content : '';
        }
      }
    });

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
        const chunks = this.templates.map((tpl: any) => tpl.str); 
        const rawStr = chunks.join('').trim();
        if (!rawStr) return '';
        if (rawStr.includes('[object Object]')) {
           return `<div class="text-red-500 border border-red-500 p-2 text-sm bg-red-50">Error: [object Object] detected. Use | json filter.</div>`;
        }
        try {
          const schema = looseJsonParse(rawStr);
          const id = generateId();
          let register = ctx.get(['__registerInlineSchema']);
          if (!register && (ctx as any).environments) {
             register = (ctx as any).environments['__registerInlineSchema'];
          }
          if (typeof register === 'function') {
            register(id, schema);
            return `<div data-amis-partial="${id}" style="display: contents;"></div>`;
          } else {
            return ``;
          }
        } catch (e) {
          return `<div style="color:red">JSON Parse Error: ${(e as Error).message}</div>`;
        }
      }
    });
    return liq;
  }, []);

  const dataFingerprint = JSON.stringify(data);
  const partialsFingerprint = JSON.stringify(finalPartials);

  // 2. Liquid 渲染 HTML
  useEffect(() => {
    let isMounted = true;
    inlineSchemasRef.current = {}; 

    const contextData = {
      ...data,
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
        if (isMounted) console.error("Liquid Render Error:", err);
      });

    return () => { isMounted = false; };
  }, [engine, template, dataFingerprint, partialsFingerprint]);

  // 3. Portals 挂载检测
  useEffect(() => {
    if (!containerRef.current) return;
    const nodes: Record<string, HTMLElement> = {};
    const elements = containerRef.current.querySelectorAll('[data-amis-partial]');
    let hasChanges = false;
    elements.forEach((el) => {
      const key = el.getAttribute('data-amis-partial');
      if (key && (inlineSchemasRef.current[key] || partialsRef.current[key])) {
        nodes[key] = el as HTMLElement;
        hasChanges = true;
      }
    });
    if (hasChanges) setMountNodes(nodes);
  }, [html]);

  // 4. 创建 Portals
  const portals = useMemo(() => {
     return Object.keys(mountNodes).map((key) => {
        const domNode = mountNodes[key];
        const schema = inlineSchemasRef.current[key] || partialsRef.current[key] as SchemaObject;
        if (!schema || !domNode) return null;
        try {
          return createPortal(amisRender(`partial-${key}`, schema, { data }), domNode);
        } catch(e) { return null; }
     });
  }, [mountNodes, partialsFingerprint, dataFingerprint, amisRender, data]);


  // ==================================================================================
  // 5. 核心逻辑：执行脚本 (新增功能)
  // ==================================================================================
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. 先清理上一次执行留下的副作用（如果有返回清理函数）
    scriptCleanupsRef.current.forEach(cleanup => cleanup && cleanup());
    scriptCleanupsRef.current = [];

    // 2. 查找容器内所有的 script 标签
    const scripts = containerRef.current.querySelectorAll('script');

    scripts.forEach((scriptNode) => {
      // 防止重复执行 (虽然每次 html 变动都会重置 DOM，但加上标记更保险)
      if (scriptNode.dataset.executed) return;

      const code = scriptNode.innerHTML;
      if (!code) return;

      try {
        // --- 构造沙箱环境 ---
        
        // 赋予脚本唯一名字，方便在 Chrome DevTools -> Sources -> Page 面板中调试
        // 格式: steedos-script-{随机ID}.js
        const debugName = `steedos-liquid-${Math.random().toString(36).slice(2)}.js`;
        const debuggableCode = code + `\n//# sourceURL=${debugName}`;

        // 构造函数
        // 参数1: context (数据域)
        // 参数2: dom (当前 script 的父节点，方便局部操作 DOM)
        // 参数3: React/Amis 工具 (可选)
        const func = new Function('context', 'dom', debuggableCode);

        // --- 执行 ---
        // 我们将 data 传入，脚本里可以直接用 `context.user.name` 访问
        // 我们将 scriptNode.parentElement 传入，脚本可以用 `dom.style.color = 'red'` 操作局部
        const cleanupResult = func(data, scriptNode.parentElement);

        // 如果脚本返回了一个函数，我们把它作为 cleanup 函数保存
        if (typeof cleanupResult === 'function') {
          scriptCleanupsRef.current.push(cleanupResult);
        }

        // 标记已执行
        scriptNode.dataset.executed = "true";

      } catch (err) {
        console.error("Liquid Script Execution Error:", err);
        console.warn("Faulty Script:", code);
        // 可选：在页面上显式报错
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.innerText = `Script Error: ${(err as Error).message}`;
        scriptNode.parentNode?.insertBefore(errorDiv, scriptNode.nextSibling);
      }
    });

    // 组件卸载时清理
    return () => {
      scriptCleanupsRef.current.forEach(cleanup => cleanup && cleanup());
    };
  }, [html, dataFingerprint]); // 当 HTML 结构变化或数据变化时，重新扫描执行


  return (
    <div className={`liquid-amis-container ${className || ''}`} ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {portals}
    </div>
  );
};