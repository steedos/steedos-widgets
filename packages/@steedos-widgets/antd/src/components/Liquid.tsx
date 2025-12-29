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
  // 5. 核心逻辑：顺序加载器 (等待外部脚本加载完再执行内联脚本)
  // ==================================================================================
  useEffect(() => {
    if (!containerRef.current) return;

    // 清理旧副作用
    scriptCleanupsRef.current.forEach(cleanup => cleanup && cleanup());
    scriptCleanupsRef.current = [];

    const allScriptNodes = Array.from(containerRef.current.querySelectorAll('script'));
    
    // 如果没有脚本，直接返回
    if (allScriptNodes.length === 0) return;

    // 1. 分类：找出需要加载的外部脚本 和 需要执行的内联脚本
    const externalNodes: HTMLScriptElement[] = [];
    const inlineNodes: HTMLScriptElement[] = [];

    allScriptNodes.forEach(node => {
        if (node.dataset.executed) return; // 跳过已处理的
        if (node.src) {
            externalNodes.push(node);
        } else {
            inlineNodes.push(node);
        }
    });

    // 2. 定义加载外部脚本的函数（返回 Promise）
    const loadExternalScript = (scriptNode: HTMLScriptElement): Promise<void> => {
        return new Promise((resolve) => {
            const src = scriptNode.getAttribute('src');
            if (!src) { resolve(); return; }

            const newScriptUrl = new URL(src, window.location.href).href;

            // --- 查重逻辑：检查全局是否已存在该脚本（排除自身） ---
            let isGlobalLoaded = false;
            const allDocScripts = document.getElementsByTagName('script');
            for (let i = 0; i < allDocScripts.length; i++) {
                const s = allDocScripts[i];
                if (s.src === newScriptUrl && s !== scriptNode) {
                    isGlobalLoaded = true;
                    break;
                }
            }

            // 标记当前节点已处理，防止下次 render 重复
            scriptNode.dataset.executed = "true";

            if (isGlobalLoaded) {
                console.log(`[Liquid] Script already loaded: ${src}`);
                resolve(); // 已存在，直接视为成功
                return;
            }

            // --- 创建新脚本加载 ---
            const newScript = document.createElement('script');
            newScript.src = src;
            newScript.async = false; // 尝试保持顺序，虽然动态插入通常默认 async
            
            // 复制属性
            Array.from(scriptNode.attributes).forEach(attr => {
                if (attr.name !== 'src' && attr.name !== 'data-executed') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });

            newScript.onload = () => {
                console.log(`[Liquid] Loaded: ${src}`);
                resolve();
            };

            newScript.onerror = () => {
                console.error(`[Liquid] Failed to load: ${src}`);
                // 即使失败也 resolve，避免阻塞后续内联脚本执行（或者你可以选择 reject 来阻断）
                resolve(); 
            };

            document.body.appendChild(newScript);
        });
    };

    // 3. 定义执行内联脚本的函数
    const runInlineScripts = () => {
        inlineNodes.forEach(scriptNode => {
            // 双重检查，防止重入
            if (scriptNode.dataset.executed) return;

            const code = scriptNode.innerHTML;
            if (code) {
                try {
                    const debugName = `steedos-liquid-${Math.random().toString(36).slice(2)}.js`;
                    const debuggableCode = code + `\n//# sourceURL=${debugName}`;
                    const func = new Function('context', 'dom', debuggableCode);
                    const cleanupResult = func(data, scriptNode.parentElement);
                    if (typeof cleanupResult === 'function') {
                        scriptCleanupsRef.current.push(cleanupResult);
                    }
                } catch (err) {
                    console.error("[Liquid] Inline Script Error:", err);
                }
            }
            scriptNode.dataset.executed = "true";
        });
    };

    // 4. 执行流程：先并行加载所有外部脚本 -> 全部完成后 -> 执行内联脚本
    const loadingPromises = externalNodes.map(loadExternalScript);

    Promise.all(loadingPromises).then(() => {
        // 所有外部脚本（src）都已加载完毕（或失败），现在执行内联代码
        runInlineScripts();
    });

    return () => {
        scriptCleanupsRef.current.forEach(cleanup => cleanup && cleanup());
    };
  }, [html, dataFingerprint]);

  return (
    <div className={`liquid-amis-container ${className || ''}`} ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {portals}
    </div>
  );
};