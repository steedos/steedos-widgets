'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Liquid } from 'liquidjs';

interface LiquidTemplateProps {
  template: string;
  data: Record<string, any>;
  className?: string; // 增加样式扩展能力
}

export const LiquidComponent: React.FC<LiquidTemplateProps> = ({ 
  template, 
  data,
  className 
}) => {
  const [html, setHtml] = useState<string>('');

  // 1. 性能优化：缓存 Liquid 实例，避免每次渲染都 new
  const engine = useMemo(() => {
    return new Liquid({
      // 可以在这里配置 liquid 选项，比如 cache: true
    });
  }, []);

  useEffect(() => {
    let isMounted = true; // 2. 防止组件卸载后更新状态

    const renderTemplate = async () => {
      try {
        const result = await engine.parseAndRender(template, data); 
        if (isMounted) {
          setHtml(result);
        }
      } catch (error) {
        console.error('Liquid render error:', error);
        if (isMounted) {
          setHtml('');
        }
      }
    };

    renderTemplate();

    // 清理函数
    return () => {
      isMounted = false;
    };
  }, [engine, template, data]);

  // 3. 使用标准 React 属性渲染 HTML，移除手动的 DOM 操作
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};