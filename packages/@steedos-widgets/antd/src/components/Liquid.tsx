'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Liquid } from 'liquidjs';

interface LiquidTemplateProps {
  template: string;
  data: Record<string, any>;
  $schema: Record<string, any>;
  partials?: Record<string, any>;
  className?: string;
  render: (region: string, schema: any, props?: any) => React.ReactNode;
}

export const LiquidComponent: React.FC<LiquidTemplateProps> = ({ 
  template, 
  data,
  className,
  $schema,
  render: amisRender,
  ...rest
}) => {
  console.log('LiquidComponent props:', { template, data, $schema, ...rest });
  const [html, setHtml] = useState<string>('');
  const [mountNodes, setMountNodes] = useState<Record<string, HTMLElement>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const partials = $schema;

  // 【优化1】使用 Ref 存储 partials，打破 Engine 的依赖循环
  // 这样无论 partials 怎么变，engine 实例都不需要重建
  const partialsRef = useRef(partials);
  partialsRef.current = partials;

  // 【优化2】Engine 只创建一次
  const engine = useMemo(() => {
    return new Liquid({
      fs: {
        readFileSync: (file) => {
          // 直接从 Ref 读取最新值
          const content = partialsRef.current[file];
          if (typeof content === 'object' && content !== null) {
            return `<div data-amis-partial="${file}"></div>`;
          }
          return content || `[Template '${file}' not found]`;
        },
        existsSync: (file) => {
          return Object.prototype.hasOwnProperty.call(partialsRef.current, file);
        },
        exists: async (file) => {
          return Object.prototype.hasOwnProperty.call(partialsRef.current, file);
        },
        resolve: (root, file) => file,
        sep: '/', 
        readFile: async (file) => {
           const content = partialsRef.current[file];
           if (typeof content === 'object' && content !== null) {
             return `<div data-amis-partial="${file}"></div>`;
           }
           return content || '';
        }
      }
    });
  }, []); // 依赖数组为空，永远不重建

  // 【优化3】生成数据指纹，防止引用变化导致的死循环
  // 只有当 template 字符串变化，或 data/partials 的 JSON 内容变化时才渲染
  const dataFingerprint = JSON.stringify(data);
  const partialsFingerprint = JSON.stringify(partials);

  useEffect(() => {
    let isMounted = true;
    
    // 开始渲染
    engine.parseAndRender(template, data).then((result) => {
      if (isMounted) {
        // 【关键】只有当 HTML 真正改变时才更新状态
        setHtml(prev => (prev !== result ? result : prev));
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setHtml(`Render Error: ${err.message}`);
    });

    return () => { isMounted = false; };
  }, [engine, template, dataFingerprint, partialsFingerprint]); // 使用指纹作为依赖

  // 监听 HTML 变化查找挂载点 (保持不变，因为 setHtml 被优化了，这里很安全)
  useEffect(() => {
    if (!containerRef.current) return;
    const nodes: Record<string, HTMLElement> = {};
    const elements = containerRef.current.querySelectorAll('[data-amis-partial]');
    let hasChanges = false;

    elements.forEach((el) => {
      const key = el.getAttribute('data-amis-partial');
      if (key && partials[key]) {
        nodes[key] = el as HTMLElement;
        hasChanges = true;
      }
    });

    if (hasChanges) {
        setMountNodes(nodes);
    }
  }, [html]); // 只依赖 html 变化

  // 渲染 Portals
  const portals = useMemo(() => {
     return Object.keys(mountNodes).map((key) => {
        const domNode = mountNodes[key];
        const schema = partials[key];
        
        // 渲染 AMIS 组件
        const component = amisRender(`partial-${key}`, schema, { data });
        return createPortal(component, domNode);
      });
  }, [mountNodes, partialsFingerprint, dataFingerprint]); // 同样依赖指纹

  return (
    <div className={className} ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {portals}
    </div>
  );
};