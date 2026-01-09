# Code Examples - 代码示例集

本文档提供常见场景的完整代码示例，帮助 AI 快速理解和生成代码。

## 目录

1. [基础组件示例](#基础组件示例)
2. [表单组件示例](#表单组件示例)
3. [数据展示组件示例](#数据展示组件示例)
4. [高级功能示例](#高级功能示例)
5. [集成示例](#集成示例)

## 基础组件示例

### 1. 简单按钮组件

#### 组件实现

```typescript
// src/components/SimpleButton.tsx
import React from 'react';
import './SimpleButton.css';

export interface SimpleButtonProps {
  label?: string;
  type?: 'primary' | 'default' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  classnames?: (...args: any[]) => string;
}

export const SimpleButton: React.FC<SimpleButtonProps> = (props) => {
  const {
    label = 'Button',
    type = 'default',
    disabled = false,
    onClick,
    className,
    classnames: cx
  } = props;
  
  const btnClass = cx 
    ? cx('SimpleButton', `SimpleButton--${type}`, className, { disabled })
    : `SimpleButton SimpleButton--${type} ${className || ''}`;
  
  return (
    <button
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

#### 样式文件

```css
/* src/components/SimpleButton.css */
.SimpleButton {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.SimpleButton:hover:not(:disabled) {
  opacity: 0.8;
}

.SimpleButton:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.SimpleButton--primary {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.SimpleButton--danger {
  background-color: #ff4d4f;
  color: white;
  border-color: #ff4d4f;
}
```

#### 元数据配置

```typescript
// src/metas/SimpleButton.tsx
const config: any = {
  componentName: "SimpleButton",
  title: 'Simple Button',
  group: 'Basic',
  npm: {
    package: "@steedos-widgets/example",
    version: "{{version}}",
    exportName: "SimpleButton",
    destructuring: true
  },
  preview: {
    label: 'Click Me',
    type: 'primary'
  },
  amis: {
    name: 'simple-button',
    icon: "fa fa-hand-pointer"
  }
};

export default {
  ...config,
  snippets: [{
    title: config.title,
    schema: {
      componentName: config.componentName,
      props: config.preview
    }
  }],
  amis: {
    render: {
      type: config.amis.name,
      framework: "react"
    },
    plugin: {
      rendererName: config.amis.name,
      name: config.title,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        label: 'Button',
        type: 'primary'
      },
      panelControls: [{
        type: 'tabs',
        tabs: [{
          title: 'General',
          body: [
            {
              type: 'input-text',
              name: 'label',
              label: 'Button Label',
              value: 'Button'
            },
            {
              type: 'select',
              name: 'type',
              label: 'Button Type',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Primary', value: 'primary' },
                { label: 'Danger', value: 'danger' }
              ],
              value: 'default'
            },
            {
              type: 'switch',
              name: 'disabled',
              label: 'Disabled'
            }
          ]
        }]
      }]
    }
  }
};
```

## 表单组件示例

### 2. 评分组件

#### 组件实现

```typescript
// src/components/Rating.tsx
import React, { useState } from 'react';
import './Rating.css';

export interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  allowHalf?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = (props) => {
  const {
    value = 0,
    onChange,
    max = 5,
    disabled = false,
    allowHalf = false,
    className
  } = props;
  
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const handleClick = (index: number) => {
    if (disabled) return;
    onChange?.(index + 1);
  };
  
  const handleMouseEnter = (index: number) => {
    if (disabled) return;
    setHoverValue(index + 1);
  };
  
  const handleMouseLeave = () => {
    setHoverValue(null);
  };
  
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  return (
    <div className={`Rating ${className || ''} ${disabled ? 'disabled' : ''}`}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < displayValue;
        return (
          <span
            key={index}
            className={`Rating-star ${filled ? 'filled' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
```

#### 样式文件

```css
/* src/components/Rating.css */
.Rating {
  display: inline-flex;
  gap: 4px;
  font-size: 24px;
}

.Rating-star {
  color: #d9d9d9;
  cursor: pointer;
  transition: color 0.2s;
}

.Rating-star.filled {
  color: #fadb14;
}

.Rating-star:hover:not(.Rating.disabled .Rating-star) {
  color: #ffd666;
}

.Rating.disabled .Rating-star {
  cursor: not-allowed;
}
```

### 3. 自动完成输入框

#### 组件实现

```typescript
// src/components/AutoComplete.tsx
import React, { useState, useRef, useEffect } from 'react';
import './AutoComplete.css';

export interface AutoCompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  source?: string;
  options?: Array<{ label: string; value: string }>;
  env?: {
    fetcher: (config: any) => Promise<any>;
  };
}

export const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  const {
    value = '',
    onChange,
    placeholder = '请输入',
    source,
    options: staticOptions = [],
    env
  } = props;
  
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 加载数据源
  useEffect(() => {
    if (source && env?.fetcher) {
      setLoading(true);
      env.fetcher({ url: source, method: 'get' })
        .then(res => {
          setSuggestions(res.data || res.items || []);
        })
        .catch(err => {
          console.error('Failed to load suggestions:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSuggestions(staticOptions);
    }
  }, [source, staticOptions, env]);
  
  // 过滤建议
  const filteredSuggestions = suggestions.filter(item =>
    item.label?.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setShowDropdown(true);
  };
  
  const handleSelectSuggestion = (item: any) => {
    setInputValue(item.label);
    onChange?.(item.value);
    setShowDropdown(false);
  };
  
  return (
    <div className="AutoComplete">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder}
        className="AutoComplete-input"
      />
      {showDropdown && filteredSuggestions.length > 0 && (
        <div className="AutoComplete-dropdown">
          {loading ? (
            <div className="AutoComplete-loading">Loading...</div>
          ) : (
            filteredSuggestions.map((item, index) => (
              <div
                key={index}
                className="AutoComplete-item"
                onClick={() => handleSelectSuggestion(item)}
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
```

## 数据展示组件示例

### 4. 卡片列表组件

#### 组件实现

```typescript
// src/components/CardList.tsx
import React from 'react';
import './CardList.css';

export interface CardListProps {
  items?: any[];
  source?: string;
  cardTemplate?: string;
  columns?: number;
  gap?: number;
  render?: (schema: any, props?: any, scope?: any) => React.ReactNode;
  env?: any;
}

export const CardList: React.FC<CardListProps> = (props) => {
  const {
    items = [],
    cardTemplate,
    columns = 3,
    gap = 16,
    render
  } = props;
  
  return (
    <div
      className="CardList"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {items.map((item, index) => (
        <div key={index} className="CardList-card">
          {cardTemplate && render ? (
            render('card', {
              type: 'tpl',
              tpl: cardTemplate
            }, { data: item, index })
          ) : (
            <div className="CardList-default">
              <h3>{item.title || 'Untitled'}</h3>
              <p>{item.description || 'No description'}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

#### 样式文件

```css
/* src/components/CardList.css */
.CardList {
  width: 100%;
}

.CardList-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 16px;
  transition: box-shadow 0.3s;
}

.CardList-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.CardList-default h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.CardList-default p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
```

### 5. 时间线组件

#### 组件实现

```typescript
// src/components/Timeline.tsx
import React from 'react';
import './Timeline.css';

export interface TimelineItem {
  time?: string;
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface TimelineProps {
  items?: TimelineItem[];
  mode?: 'left' | 'right' | 'alternate';
  pending?: boolean;
  pendingText?: string;
}

export const Timeline: React.FC<TimelineProps> = (props) => {
  const {
    items = [],
    mode = 'left',
    pending = false,
    pendingText = '加载中...'
  } = props;
  
  return (
    <div className={`Timeline Timeline--${mode}`}>
      {items.map((item, index) => (
        <div key={index} className="Timeline-item">
          <div className="Timeline-tail" />
          <div
            className="Timeline-dot"
            style={{ backgroundColor: item.color || '#1890ff' }}
          >
            {item.icon && <span>{item.icon}</span>}
          </div>
          <div className="Timeline-content">
            {item.time && (
              <div className="Timeline-time">{item.time}</div>
            )}
            {item.title && (
              <div className="Timeline-title">{item.title}</div>
            )}
            {item.description && (
              <div className="Timeline-description">{item.description}</div>
            )}
          </div>
        </div>
      ))}
      {pending && (
        <div className="Timeline-item Timeline-item--pending">
          <div className="Timeline-dot Timeline-dot--pending" />
          <div className="Timeline-content">{pendingText}</div>
        </div>
      )}
    </div>
  );
};
```

## 高级功能示例

### 6. 可拖拽排序列表

#### 组件实现

```typescript
// src/components/SortableList.tsx
import React, { useState } from 'react';
import './SortableList.css';

export interface SortableListProps {
  items?: any[];
  onChange?: (items: any[]) => void;
  itemRender?: (item: any, index: number) => React.ReactNode;
  disabled?: boolean;
}

export const SortableList: React.FC<SortableListProps> = (props) => {
  const {
    items: initialItems = [],
    onChange,
    itemRender,
    disabled = false
  } = props;
  
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const handleDragStart = (index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    onChange?.(items);
  };
  
  return (
    <div className="SortableList">
      {items.map((item, index) => (
        <div
          key={index}
          className={`SortableList-item ${
            draggedIndex === index ? 'dragging' : ''
          }`}
          draggable={!disabled}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <span className="SortableList-handle">☰</span>
          <div className="SortableList-content">
            {itemRender ? itemRender(item, index) : JSON.stringify(item)}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 7. 虚拟滚动表格

#### 组件实现

```typescript
// src/components/VirtualTable.tsx
import React, { useState, useRef, useEffect } from 'react';
import './VirtualTable.css';

export interface Column {
  key: string;
  title: string;
  width?: number;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

export interface VirtualTableProps {
  columns?: Column[];
  dataSource?: any[];
  rowHeight?: number;
  height?: number;
}

export const VirtualTable: React.FC<VirtualTableProps> = (props) => {
  const {
    columns = [],
    dataSource = [],
    rowHeight = 50,
    height = 400
  } = props;
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const visibleCount = Math.ceil(height / rowHeight);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, dataSource.length);
  const visibleData = dataSource.slice(startIndex, endIndex);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  
  return (
    <div className="VirtualTable">
      <div className="VirtualTable-header">
        {columns.map((col) => (
          <div
            key={col.key}
            className="VirtualTable-header-cell"
            style={{ width: col.width }}
          >
            {col.title}
          </div>
        ))}
      </div>
      <div
        ref={containerRef}
        className="VirtualTable-body"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div style={{ height: dataSource.length * rowHeight }}>
          <div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
            {visibleData.map((record, index) => (
              <div
                key={startIndex + index}
                className="VirtualTable-row"
                style={{ height: rowHeight }}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className="VirtualTable-cell"
                    style={{ width: col.width }}
                  >
                    {col.render
                      ? col.render(record[col.key], record, startIndex + index)
                      : record[col.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 集成示例

### 8. 与 Amis Service 集成

```typescript
// Schema 配置
{
  "type": "service",
  "api": {
    "url": "/api/users",
    "method": "get"
  },
  "body": {
    "type": "card-list",
    "source": "${items}",
    "cardTemplate": `
      <div class="user-card">
        <h3>\${name}</h3>
        <p>\${email}</p>
        <span class="badge">\${role}</span>
      </div>
    `,
    "columns": 3
  }
}
```

### 9. 表单联动示例

```typescript
// Schema 配置
{
  "type": "form",
  "body": [
    {
      "type": "select",
      "name": "country",
      "label": "Country",
      "options": [
        { "label": "China", "value": "cn" },
        { "label": "USA", "value": "us" }
      ]
    },
    {
      "type": "select",
      "name": "city",
      "label": "City",
      "source": "/api/cities?country=${country}",
      "visibleOn": "this.country"
    }
  ]
}
```

### 10. 事件响应示例

```typescript
// 组件实现
export const EventButton: React.FC<any> = (props) => {
  const { dispatchEvent, data } = props;
  
  const handleClick = () => {
    // 触发自定义事件
    dispatchEvent('customEvent', {
      data: { ...data, clicked: true }
    });
  };
  
  return <button onClick={handleClick}>Click Me</button>;
};

// Schema 配置
{
  "type": "event-button",
  "onEvent": {
    "customEvent": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msg": "Button clicked!"
          }
        },
        {
          "actionType": "ajax",
          "args": {
            "api": "/api/log",
            "data": "${event.data}"
          }
        }
      ]
    }
  }
}
```

## 常用代码片段

### Props 接口模板

```typescript
export interface ComponentProps {
  // 基础属性
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  
  // Amis 相关
  render?: (schema: any, props?: any, scope?: any) => React.ReactNode;
  env?: any;
  scope?: any;
  data?: any;
  classnames?: (...args: any[]) => string;
  
  // 表单相关
  name?: string;
  label?: string;
  required?: boolean;
  validations?: any;
  
  // 数据相关
  source?: string;
  api?: string;
  
  // 自定义属性
  // ...
}
```

### 组件模板

```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Component.css';

export interface ComponentProps {
  // Props 定义
}

export const Component: React.FC<ComponentProps> = (props) => {
  const {
    value,
    onChange,
    // ... 解构 props
  } = props;
  
  // State
  const [state, setState] = useState(initialState);
  
  // Effects
  useEffect(() => {
    // 副作用
  }, [dependencies]);
  
  // Callbacks
  const handleChange = useCallback((newValue) => {
    onChange?.(newValue);
  }, [onChange]);
  
  // Memoized values
  const computed = useMemo(() => {
    return computeValue(state);
  }, [state]);
  
  // Render
  return (
    <div className="Component">
      {/* 组件内容 */}
    </div>
  );
};

export default Component;
```

### Meta 配置模板

```typescript
const config: any = {
  componentName: "ComponentName",
  title: 'Component Title',
  group: 'Group Name',
  npm: {
    package: "@steedos-widgets/package-name",
    version: "{{version}}",
    exportName: "ComponentName",
    destructuring: true
  },
  preview: {
    // 预览属性
  },
  amis: {
    name: 'component-name',
    icon: "fa fa-icon"
  }
};

export default {
  ...config,
  snippets: [/* ... */],
  amis: {
    render: {
      type: config.amis.name,
      framework: "react"
    },
    plugin: {
      rendererName: config.amis.name,
      name: config.title,
      icon: config.amis.icon,
      scaffold: {/* ... */},
      panelControls: [/* ... */]
    }
  }
};
```

## 总结

本文档提供了常见场景的完整代码示例，涵盖：

1. **基础组件**: 按钮、输入框等
2. **表单组件**: 评分、自动完成等
3. **数据展示**: 卡片列表、时间线等
4. **高级功能**: 拖拽排序、虚拟滚动等
5. **集成示例**: Service、表单联动、事件等

使用这些示例作为起点，可以快速开发新组件。
