'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Liquid, Context } from 'liquidjs';
import { isEqual } from 'lodash';

// --- 类型定义 ---
type SchemaObject = Record<string, any>;

interface LiquidTemplateProps {
  template: string; 
  tpl: string; 
  data: Record<string, any>; 
  $schema?: Record<string, string | object>; 
  partials?: Record<string, string | object>; 
  className?: string;
  dispatchEvent: any,
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

function extractObjectChain(value) {
  const result = value ? [value] : [];
  const visited = new Set(); // 用于存储已遍历的对象引用

  if (value) visited.add(value);

  let current = value;
  while (current?.__super) {
    const next = current.__super;

    // 检查是否已经访问过该对象
    if (visited.has(next)) {
      console.warn("检测到循环引用，已自动截断链条", next);
      break; 
    }

    result.unshift(next);
    visited.add(next);
    current = next;
  }
  
  return result;
}

/**
 * 安全地将链条属性合并到顶层
 */
function flattenObjectChain(obj) {
  if (!obj) return {};

  // 1. 调用上方带 Set 检查的提取函数
  const chain = extractObjectChain(obj);

  // 2. 扁平化合并
  // 遵循“就近原则”：数组后面的对象属性覆盖前面的
  const flattened = chain.reduce((acc, current) => {
    // 建议：如果不需要合并原型链上的属性，仅合并自身属性
    // 使用 Object.assign 仅拷贝可枚举的自有属性
    return Object.assign(acc, current);
  }, {});

  // 3. 清理标记位，避免干扰结果
  delete flattened.__super;

  return flattened;
}

// --- 组件实现 ---

// --- 错误边界组件 ---
class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode, children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Liquid Component ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了 fallback 则使用 fallback，否则不显示（静默失败，符合“不影响整体显示”的要求）
      // 但对于顶层错误，可能需要显示。这里用于 amisRender 的局部包裹。
      return this.props.fallback || null; 
    }
    return this.props.children;
  }
}

// --- 错误显示组件 ---
const ErrorDisplay = ({ error }: { error: Error }) => {
  const [expanded, setExpanded] = useState(false);
  if (!error) return null;
  return (
    <div className="border border-red-500 bg-red-50 text-red-700 p-4 rounded mb-4 text-sm font-mono">
      <div className="flex justify-between items-start">
        <div className="font-bold">Template Render Error</div>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-blue-600 hover:underline text-xs ml-4 whitespace-nowrap"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className="mt-1">{error.message}</div>
      {expanded && (
        <div className="mt-2 pt-2 border-t border-red-200 text-xs overflow-auto max-h-60">
          <pre>{error.stack}</pre>
        </div>
      )}
    </div>
  );
};

export const LiquidComponent: React.FC<LiquidTemplateProps> = (props) => {
  let { 
    template, 
    tpl,
    data,
    className,
    $schema,
    render: amisRender,
    dispatchEvent,
    partials: propsPartials,
    ...rest
  } = props;
  const doAction = data._scoped?.doAction;

  // 支持 tpl 作为 template 的别名
  if (tpl && !template) {
    template = tpl;
  }

  if(!template){
    template = props.$schema.template as any;
  }
  // console.log('template =============>', template, props);
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [parsedTemplates, setParsedTemplates] = useState<any[]>([]);
  const [mountNodes, setMountNodes] = useState<Record<string, HTMLElement>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 防抖的数据状态，用于减少 HTML 重建频率
  // 保持最新 data 的引用，供脚本使用
  const dataRef = useRef(data);
  dataRef.current = data;
  
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
        this.id = generateId();
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
          const id = this.id;
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

  // Track previous values for comparison (初始化为 undefined 以确保首次渲染)
  const prevPartialsRef = useRef<Record<string, string | object> | undefined>(undefined);
  const prevParsedTemplatesRef = useRef<any[] | undefined>(undefined);

  useEffect(() => {
    // console.log('template', template)
    let isMounted = true;
    try {
      if (!template) {
        if (isMounted) {
          setParsedTemplates([]);
          setError(null);
        }
        return;
      }
      const tpl = engine.parse(template);
      if (isMounted) {
        setParsedTemplates(tpl);
        setError(null);
      }
    } catch (e) {
      console.error("Liquid Parse Error:", e);
      if (isMounted) {
        setError(e as Error);
        setParsedTemplates(null as any); 
      }
    }
    return () => { isMounted = false; };
  }, [engine, template]);

  // 2. Liquid 渲染 HTML（仅在模板或 partials 变化时，不在数据变化时重新渲染）
  useEffect(() => {
    // 跳过空模板或未解析的模板（parsedTemplates 为 null、undefined 或空数组时）
    if (!parsedTemplates || parsedTemplates.length === 0) return;
    
    // 检查 parsedTemplates 是否发生变化（模板重新解析时需要强制渲染）
    const templatesChanged = prevParsedTemplatesRef.current !== parsedTemplates;
    
    // 只在 partials 实际变化时才重新渲染
    // 但如果 parsedTemplates 变化了（模板重新解析），必须渲染
    // 注意：不再依赖 data 变化来重新渲染 HTML，data 变化只更新 Portal 组件
    if (!templatesChanged && 
        isEqual(prevPartialsRef.current, finalPartials)) {
      return;
    }
    
    prevPartialsRef.current = finalPartials;
    prevParsedTemplatesRef.current = parsedTemplates;

    let isMounted = true;
    // Don't clear schemas here - let them accumulate and be overwritten
    // Clearing causes race conditions with Portal detection
    // inlineSchemasRef.current = {}; 

    // 使用当前 data 进行初始渲染 - HTML 结构不会因为数据变化而重新渲染
    // Portal 组件会通过 props 获取实时数据更新
    const contextData = {
      ...flattenObjectChain(data),
      __registerInlineSchema: (id: string, schema: SchemaObject) => {
        inlineSchemasRef.current[id] = schema;
      }
    };

    engine.render(parsedTemplates, contextData)
      .then((result) => {
        if (isMounted) {
          setHtml(result); // Always set to ensure Portal detection runs with fresh schemas
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Liquid Render Error:", err);
          setError(err);
        }
      });

    return () => { isMounted = false; };
  }, [engine, parsedTemplates, finalPartials]); // 移除 data 依赖，只在模板变化时重新渲染

  // 3. Portals 挂载检测
  useEffect(() => {
    if (!containerRef.current) return;
    const nodes: Record<string, HTMLElement> = {};
    const elements = containerRef.current.querySelectorAll('[data-amis-partial]');
    
    elements.forEach((el) => {
      const key = el.getAttribute('data-amis-partial');
      const hasInlineSchema = key && inlineSchemasRef.current[key];
      const hasPartialSchema = key && partialsRef.current[key];
      if (key && (hasInlineSchema || hasPartialSchema)) {
        nodes[key] = el as HTMLElement;
      }
    });

    // 每次 html 变化都需要更新 DOM 节点引用，因为 dangerouslySetInnerHTML 会销毁并重建节点
    // 但仅在节点实际变化时更新，避免不必要的 Portal 重新创建
    setMountNodes(prev => {
        const prevKeys = Object.keys(prev).sort().join(',');
        const newKeys = Object.keys(nodes).sort().join(',');
        const keysChanged = prevKeys !== newKeys;
        
        // 仅在 keys 实际变化时更新（新增或删除了 Portal 挂载点）
        if (keysChanged) {
          return nodes;
        }
        // Keys 相同但 html 变了，需要更新 DOM 节点引用（dangerouslySetInnerHTML 销毁重建了节点）
        // 但不能创建新对象，否则会触发 Portal useMemo 重新执行
        // 所以我们更新 prev 对象中的节点引用
        Object.keys(nodes).forEach(key => {
          if (prev[key] !== nodes[key]) {
            prev[key] = nodes[key];
          }
        });
        return prev; 
    });
  }, [html]);

  // 4. 创建 Portals
  const portals = useMemo(() => {
     return Object.keys(mountNodes).map((key) => {
        const domNode = mountNodes[key];
        const schema = inlineSchemasRef.current[key] || partialsRef.current[key] as SchemaObject;
        
        if (!schema || !domNode) {
          return null;
        }
        
        try {
          return createPortal(
            <ErrorBoundary fallback={null}>
              {amisRender(`partial-${key}`, schema, { data: dataRef.current })}
            </ErrorBoundary>, 
            domNode,
            key // 使用稳定的 key 基于 Partial ID
          );
        } catch(e) { 
          console.error('[Liquid] Portal creation error:', { key, error: e });
          return null; 
        }
     });
  }, [mountNodes, finalPartials, amisRender]); // Removed data dependency - use dataRef to avoid Portal recreation on data changes

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
                // console.log(`[Liquid] Script already loaded: ${src}`);
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
                // console.log(`[Liquid] Loaded: ${src}`);
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
                    const func = new Function('data', 'dom', 'doAction', 'dispatchEvent', debuggableCode);
                    // 使用 dataRef.current 获取最新的 data
                    const cleanupResult = func(dataRef.current, scriptNode.parentElement, doAction, dispatchEvent);
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
  }, [html]); // 仅依赖 html 变化，不依赖 data 变化

  if (error) {
    return (
       <div className={`liquid-amis-container flex flex-col w-full overflow-auto p-4 ${className || ''}`}>
         <ErrorDisplay error={error} />
       </div>
    );
  }

  return (
    <>
      <div 
        className={`liquid-amis-container flex flex-col h-full w-full overflow-hidden ${className || ''}`} 
        ref={containerRef} 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
      {portals}
    </>
  );
};