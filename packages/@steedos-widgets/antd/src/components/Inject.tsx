import React, { useEffect } from 'react';

// 定义资源类型
export type AssetType = 'css' | 'js';
export type AssetLocation = 'start' | 'end';

// 定义单个资源项的接口
export interface AssetItem {
  type: AssetType;        // 'css' 或 'js'
  id?: string;            // 唯一标识 (强烈建议填写，用于去重和清理)
  src?: string;           // 外部链接 (css用href, js用src)
  content?: string;       // 内联代码内容
  location?: AssetLocation; // 挂载位置：head的 'start'(最前) 或 'end'(最后)
}

// 组件 Props
interface InjectProps extends React.ComponentProps<any> {
  assets?: AssetItem[]; // 资源列表
  body?: any;           // 子组件 Schema
  
  // Amis 方法
  render: (region: string, schema: any, props?: any) => React.ReactNode;
}

const Inject: React.FC<InjectProps> = (props) => {
  const {
    assets = [],
    body,
    render,
    children,
    // 排除不需要透传的属性
    className, classnames, env, scope, ...rest
  } = props;

  useEffect(() => {
    // 记录本次渲染创建的所有 tag ID，以便卸载时清理
    // 如果用户没传 ID，我们生成临时的，但建议用户传 ID
    const mountedIds: string[] = [];

    const injectOne = (item: AssetItem, index: number) => {
      const { type, src, content, location = 'start' } = item;
      // 如果没有 id，生成一个临时的（注意：这种临时 ID 在组件更新时可能会导致资源重新加载）
      const id = item.id || `amis-inject-${type}-${index}-${Date.now()}`;
      
      mountedIds.push(id);

      // 1. 清理旧资源 (避免重复或更新内容)
      const oldElement = document.getElementById(id);
      if (oldElement) {
        oldElement.remove();
      }

      // 2. 创建 DOM 节点
      let newTag: HTMLElement | null = null;

      if (type === 'css') {
        // --- CSS 处理 ---
        if (src) {
          const link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = src;
          newTag = link;
        } else if (content) {
          const style = document.createElement('style');
          style.id = id;
          style.type = 'text/css';
          style.appendChild(document.createTextNode(content));
          newTag = style;
        }
      } else if (type === 'js') {
        // --- JS 处理 ---
        const script = document.createElement('script');
        script.id = id;
        script.type = 'text/javascript';
        
        if (src) {
          script.src = src;
          script.async = false; // 保持按顺序执行
        } else if (content) {
          script.text = content;
        }
        newTag = script;
      }

      // 3. 挂载节点
      // CSS 始终挂载到 head
      // JS 通常也可以挂载到 head，或者 body (这里为了统一管理，默认操作 head，如需 body 可自行扩展逻辑)
      if (newTag) {
        if (location === 'end') {
          document.head.appendChild(newTag);
        } else {
          document.head.prepend(newTag);
        }
      }
    };

    // 批量执行注入
    if (Array.isArray(assets)) {
      assets.forEach((asset, index) => injectOne(asset, index));
    }

    // 4. 组件卸载时的清理函数
    return () => {
      mountedIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [JSON.stringify(assets)]); // 使用 JSON.stringify 深度监听数组变化

  // --- 渲染子组件 (无外层 DIV) ---
  if (!body) return null;

  return <>{children}{render('body', body, {})}</>;
};

export { Inject };