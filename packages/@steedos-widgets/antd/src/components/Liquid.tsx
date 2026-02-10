'use client';

import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
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
    console.error(e, cleanStr)
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

// --- Portal 渲染器（React.memo 防止不必要的 remount）---
// amisRender 执行后可能窃取焦点，需要在每次 Portal 渲染后恢复焦点
const PortalRenderer = React.memo(function PortalItem({
  portalKey, schema, domNode, amisRenderRef, dataRef
}: {
  portalKey: string;
  schema: SchemaObject;
  domNode: HTMLElement;
  amisRenderRef: React.MutableRefObject<any>;
  dataRef: React.MutableRefObject<any>;
}) {
  // 记录焦点恢复定时器，确保组件卸载时清理
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // render 阶段捕获当前焦点（在 amisRender 执行前）
  const savedFocusRef = useRef<{ element: Element | null; selectionStart: number | null; selectionEnd: number | null }>({ element: null, selectionStart: null, selectionEnd: null });
  
  const active = document.activeElement;
  if (active && active instanceof HTMLElement && active !== document.body) {
    savedFocusRef.current = {
      element: active,
      selectionStart: (active as any).selectionStart ?? null,
      selectionEnd: (active as any).selectionEnd ?? null,
    };
  }

  // amisRender 执行（可能会窃取焦点）
  const rendered = amisRenderRef.current(`partial-${portalKey}`, schema, { data: dataRef.current });

  // DOM 更新后恢复焦点（延迟 10ms，等待 amis 内部异步 DOM 操作完成）
  useLayoutEffect(() => {
    const { element, selectionStart, selectionEnd } = savedFocusRef.current;
    if (!element || !(element instanceof HTMLElement)) return;

    // 清理上一次未执行的定时器
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
    }

    focusTimerRef.current = setTimeout(() => {
      focusTimerRef.current = null;
      // 焦点已不在原元素上，且原元素仍在 DOM 中
      if (document.activeElement !== element && document.body.contains(element)) {
        element.focus();
        // 恢复光标位置（input/textarea）
        try {
          if (selectionStart !== null && 'setSelectionRange' in element) {
            (element as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd ?? selectionStart);
          }
        } catch (_) { /* 某些 input type 不支持 setSelectionRange */ }
      }
    }, 10);
  });

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  return createPortal(
    <ErrorBoundary fallback={null}>
      {rendered}
    </ErrorBoundary>,
    domNode,
    portalKey
  );
}, (prev, next) =>
  // 仅在 portalKey、DOM 节点或 schema 内容变化时才重新渲染
  prev.portalKey === next.portalKey &&
  prev.domNode === next.domNode &&
  isEqual(prev.schema, next.schema)
);

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
  
  // 焦点保护：跟踪当前聚焦元素，防止 re-render 导致焦点丢失
  const focusInfoRef = useRef<{ element: Element | null; inContainer: boolean }>({ element: null, inContainer: false });
  
  // 防抖的数据状态，用于减少 HTML 重建频率
  // 保持最新 data 的引用，供脚本使用
  const dataRef = useRef(data);
  dataRef.current = data;

  // 稳定引用 amisRender，防止因父组件 re-render 产生新函数引用导致 portals 重建
  const amisRenderRef = useRef(amisRender);
  amisRenderRef.current = amisRender;
  
  // 用于存储脚本清理函数的引用，以便在组件卸载或更新时清理副作用
  const scriptCleanupsRef = useRef<Function[]>([]);

  const finalPartials = useMemo(() => ({ ...($schema || {}), ...propsPartials }), [$schema, propsPartials]);
  const partialsRef = useRef(finalPartials);
  partialsRef.current = finalPartials;
  
  const inlineSchemasRef = useRef<Record<string, SchemaObject>>({});

  // 深比较稳定的 finalPartials 引用，防止 $schema 每次 render 产生新引用导致 portals 不必要重建
  const stableFinalPartialsRef = useRef(finalPartials);
  if (!isEqual(stableFinalPartialsRef.current, finalPartials)) {
    stableFinalPartialsRef.current = finalPartials;
  }
  const stableFinalPartials = stableFinalPartialsRef.current;

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
          console.error(e)
          return `<div style="color:red">JSON Parse Error: ${(e as Error).message}</div>`;
        }
      }
    });
    return liq;
  }, []);

  // 用于处理异步渲染竞态条件的计数器，确保只应用最新一次渲染的结果
  const renderIdRef = useRef(0);

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

  // 2. Liquid 渲染 HTML（当模板、partials 或数据变化时重新渲染）
  useEffect(() => {
    // 跳过空模板或未解析的模板（parsedTemplates 为 null、undefined 或空数组时）
    if (!parsedTemplates || parsedTemplates.length === 0) return;

    let isMounted = true;
    const currentRenderId = ++renderIdRef.current;

    const contextData = {
      ...flattenObjectChain(data),
      __registerInlineSchema: (id: string, schema: SchemaObject) => {
        inlineSchemasRef.current[id] = schema;
      }
    };

    engine.render(parsedTemplates, contextData)
      .then((result) => {
        // 仅应用最新一次渲染的结果，丢弃过期的异步结果（处理竞态条件）
        if (isMounted && currentRenderId === renderIdRef.current) {
          // 仅在渲染结果真正变化时才更新 state，避免不必要的 DOM 重建
          setHtml(prev => prev === result ? prev : result);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted && currentRenderId === renderIdRef.current) {
          console.error("Liquid Render Error:", err);
          setError(err);
        }
      });

    return () => { isMounted = false; };
  }, [engine, parsedTemplates, finalPartials, data]); // data 变化时重新渲染模板

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

  // 3.5 阻止容器内原生表单的默认提交行为
  // 防止在 input 中按回车键时触发浏览器默认的表单 submit，导致页面刷新、所有表单值丢失
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 拦截 form submit 事件（覆盖显式提交和 Enter 键隐式提交）
    const handleSubmit = (e: Event) => {
      e.preventDefault();
    };

    // 拦截 input 中的 Enter 键，防止触发外层 form 的隐式提交
    // （适用于 form 在容器之上的情况，此时 submit 事件无法在容器层拦截）
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      const target = e.target as HTMLElement;
      // 仅拦截单行 input，不影响 textarea 的换行行为
      if (target.tagName === 'INPUT') {
        const form = target.closest('form');
        if (form) {
          e.preventDefault();
        }
      }
    };

    container.addEventListener('submit', handleSubmit);
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('submit', handleSubmit);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [html]);

  // 4. 创建 Portals
  // 使用 PortalRenderer (React.memo) 包裹每个 Portal，确保只有 schema 实际变化的 Portal 才会重新渲染
  // 移除 amisRender 依赖（使用 ref），避免父组件 re-render 导致所有 Portal 被销毁重建
  const portals = useMemo(() => {
     return Object.keys(mountNodes).map((key) => {
        const domNode = mountNodes[key];
        const schema = inlineSchemasRef.current[key] || partialsRef.current[key] as SchemaObject;
        
        if (!schema || !domNode) {
          return null;
        }
        
        return <PortalRenderer
          key={key}
          portalKey={key}
          schema={schema}
          domNode={domNode}
          amisRenderRef={amisRenderRef}
          dataRef={dataRef}
        />;
     });
  }, [mountNodes, stableFinalPartials]); // 使用稳定引用，避免不必要的 Portal 重建

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

  // ==================================================================================
  // 6. 焦点保护机制
  // 在 render 阶段捕获当前焦点状态，在 DOM 更新后延迟恢复意外丢失的焦点
  // ==================================================================================
  const outerFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (containerRef.current) {
    const active = document.activeElement;
    focusInfoRef.current = {
      element: active,
      inContainer: !!active && containerRef.current.contains(active)
    };
  } else {
    focusInfoRef.current = { element: null, inContainer: false };
  }

  useLayoutEffect(() => {
    const { element, inContainer } = focusInfoRef.current;
    if (!inContainer || !element || !(element instanceof HTMLElement)) return;

    if (outerFocusTimerRef.current) {
      clearTimeout(outerFocusTimerRef.current);
    }

    outerFocusTimerRef.current = setTimeout(() => {
      outerFocusTimerRef.current = null;
      if (document.activeElement !== element &&
          (document.activeElement === document.body || document.activeElement === null) &&
          document.body.contains(element)) {
        element.focus();
      }
    }, 10);
  });

  // 组件卸载时清理外层焦点定时器
  useEffect(() => {
    return () => {
      if (outerFocusTimerRef.current) {
        clearTimeout(outerFocusTimerRef.current);
      }
    };
  }, []);

  // 7. 缓存容器元素，避免 data 变化时 React 对 dangerouslySetInnerHTML div 进行不必要的协调
  const innerHtml = useMemo(() => ({ __html: html }), [html]);
  const containerElement = useMemo(() => (
    <div 
      className={`liquid-amis-container flex flex-col h-full w-full overflow-hidden ${className || ''}`} 
      ref={containerRef} 
      dangerouslySetInnerHTML={innerHtml} 
    />
  ), [innerHtml, className]);

  if (error) {
    return (
       <div className={`liquid-amis-container flex flex-col w-full overflow-auto p-4 ${className || ''}`}>
         <ErrorDisplay error={error} />
       </div>
    );
  }

  return (
    <>
      {containerElement}
      {portals}
    </>
  );
};