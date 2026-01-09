# Architecture Overview - 架构概览

本文档描述 Steedos Widgets 项目的整体架构、设计理念和技术决策。

## 目录

1. [系统架构](#系统架构)
2. [组件生命周期](#组件生命周期)
3. [构建流程](#构建流程)
4. [运行时架构](#运行时架构)
5. [集成机制](#集成机制)
6. [设计模式](#设计模式)

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Steedos Platform                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Page Builder / Designer                 │    │
│  │  ┌───────────────┐  ┌──────────────┐               │    │
│  │  │  Amis Editor  │  │  Widget      │               │    │
│  │  │               │  │  Palette     │               │    │
│  │  └───────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Widget Asset Loader                          │    │
│  │  ┌───────────┐  ┌───────────┐  ┌──────────────┐    │    │
│  │  │ assets.json│→│UMD Loader │→│ meta.js      │    │    │
│  │  └───────────┘  └───────────┘  └──────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Amis Renderer                           │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Custom Widget Components (React)            │   │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │   │    │
│  │  │  │  Antd    │ │  Amis    │ │   React     │  │   │    │
│  │  │  │  Select  │ │  Object  │ │   Flow      │  │   │    │
│  │  │  └──────────┘ └──────────┘ └─────────────┘  │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               Development Environment                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Monorepo (Lerna + Yarn Workspaces)         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │ Widget   │  │ Widget   │  │   Widget N       │  │    │
│  │  │ Package  │  │ Package  │  │   Package        │  │    │
│  │  │    1     │  │    2     │  │                  │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  │       ↓             ↓                 ↓             │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │         Rollup Build Pipeline                │  │    │
│  │  │  TypeScript → Babel → UMD + CSS              │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │       ↓             ↓                 ↓             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │ dist/    │  │ dist/    │  │   dist/          │  │    │
│  │  │ *.umd.js │  │ *.umd.js │  │   *.umd.js       │  │    │
│  │  │ meta.js  │  │ meta.js  │  │   meta.js        │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │      Local unpkg Server (Development)               │    │
│  │      OR NPM/unpkg.com (Production)                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 核心层次

1. **开发层 (Development Layer)**
   - Monorepo 工作区
   - TypeScript/React 组件开发
   - Rollup 构建系统

2. **分发层 (Distribution Layer)**
   - NPM 包管理
   - CDN 资源分发 (unpkg.com)
   - 本地开发服务器

3. **加载层 (Loading Layer)**
   - 资产包加载器
   - UMD 模块加载
   - 元数据解析

4. **运行层 (Runtime Layer)**
   - Amis 渲染引擎
   - React 组件运行时
   - 事件和数据流

## 组件生命周期

### 开发时

```
1. 创建组件
   ├── src/components/MyWidget.tsx    (React 组件)
   ├── src/metas/MyWidget.tsx         (元数据配置)
   └── src/components/MyWidget.css    (样式文件)
                 ↓
2. 导出组件
   ├── src/index.ts                   (导出组件)
   └── src/meta.ts                    (导出元数据)
                 ↓
3. 构建打包
   └── yarn build
       ├── TypeScript 编译
       ├── Babel 转换
       ├── Rollup 打包
       └── PostCSS 处理
                 ↓
4. 生成产物
   ├── dist/my-widget.umd.js         (组件 UMD 包)
   ├── dist/my-widget.umd.css        (样式文件)
   ├── dist/meta.js                  (元数据 UMD 包)
   └── dist/assets.json              (资产清单)
                 ↓
5. 发布分发
   └── npm publish
       └── unpkg.com 自动同步
```

### 运行时

```
1. 页面加载
   └── Steedos Platform 初始化
                 ↓
2. 资产加载
   ├── 读取 STEEDOS_PUBLIC_PAGE_ASSETURLS
   ├── 下载 assets.json
   └── 解析资产清单
                 ↓
3. 依赖注入
   ├── 加载外部依赖 (React, Ant Design, etc.)
   ├── 加载组件 UMD 包 (my-widget.umd.js)
   ├── 加载样式文件 (my-widget.umd.css)
   └── 加载元数据 (meta.js)
                 ↓
4. 组件注册
   ├── 从 window.BuilderMyWidget 获取组件
   ├── 从 window.BuilderMyWidgetMeta 获取元数据
   └── 注册到 Amis 渲染器和编辑器
                 ↓
5. 编辑器集成
   ├── 组件出现在组件面板
   ├── 支持拖拽到画布
   └── 属性面板可配置
                 ↓
6. 渲染器执行
   ├── 解析页面 Schema
   ├── 创建 React 组件实例
   ├── 渲染到 DOM
   └── 响应用户交互
```

## 构建流程

### Rollup 构建管道

```typescript
// 构建流程详解

输入 (Input)
  ↓
src/index.ts (组件入口)
src/meta.ts (元数据入口)
  ↓
TypeScript 编译
  ↓ (.d.ts)
类型定义生成 → dist/types/
  ↓
Babel 转换
  ↓ (ES5)
代码兼容性处理
  ↓
Rollup 打包
  ├── 模块解析 (@rollup/plugin-node-resolve)
  ├── CommonJS 转换 (@rollup/plugin-commonjs)
  ├── 外部依赖排除 (external)
  └── UMD 包装 (format: 'umd')
  ↓
PostCSS 处理
  ├── 变量处理 (postcss-simple-vars)
  ├── 嵌套处理 (postcss-nested)
  └── CSS 提取 (extract: true)
  ↓
资产生成
  ├── assets.json (版本替换)
  └── assets-dev.json
  ↓
输出 (Output)
  ├── dist/my-widget.umd.js     (UMD 组件包)
  ├── dist/my-widget.umd.css    (样式文件)
  ├── dist/meta.js              (UMD 元数据)
  ├── dist/types/               (TypeScript 类型)
  ├── dist/assets.json          (生产资产清单)
  └── dist/assets-dev.json      (开发资产清单)
```

### 外部依赖管理

```typescript
// rollup.config.ts

// 外部依赖配置
const external = [
  "react",           // React 核心
  "react-dom",       // React DOM
  "lodash",          // 工具库
  "antd",            // Ant Design
  "amis-core"        // Amis 核心
];

// 全局变量映射
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'lodash': '_',
  'antd': 'antd',
  'amis-core': 'AmisCore'
};

// 为什么需要 external?
// 1. 减小包体积：公共库不重复打包
// 2. 版本一致性：使用平台提供的统一版本
// 3. 性能优化：浏览器缓存共享依赖
```

## 运行时架构

### UMD 模块加载

```javascript
// UMD 包结构

(function (global, factory) {
  // CommonJS
  typeof exports === 'object' && typeof module !== 'undefined' 
    ? factory(exports, require('react'), require('antd'))
  
  // AMD
  : typeof define === 'function' && define.amd 
    ? define(['exports', 'react', 'antd'], factory)
  
  // Browser globals
  : (global = global || self, 
     factory(global.BuilderMyWidget = {}, global.React, global.antd));
     
}(this, function (exports, React, antd) {
  'use strict';
  
  // 组件实现
  exports.MyWidget = function MyWidget(props) {
    return React.createElement('div', null, 'My Widget');
  };
}));
```

### Amis 渲染器注册

```typescript
// 组件在 Amis 中的注册流程

// 1. 定义渲染器
@Renderer({
  type: 'my-widget',
  framework: 'react'
})
class MyWidgetRenderer extends React.Component {
  render() {
    return <MyWidget {...this.props} />;
  }
}

// 2. 定义编辑器插件
class MyWidgetPlugin extends BasePlugin {
  rendererName = 'my-widget';
  name = 'My Widget';
  icon = 'fa fa-cube';
  
  scaffold = {
    type: 'my-widget',
    label: 'My Widget'
  };
  
  panelControls = [
    // 属性配置
  ];
}

// 3. 注册到 Amis
registerRenderer(MyWidgetRenderer);
registerEditorPlugin(MyWidgetPlugin);
```

### 数据流

```
用户交互
    ↓
组件事件处理 (onChange, onClick, etc.)
    ↓
更新组件状态 (setState)
    ↓
触发 Amis 数据更新
    ↓
Schema 变更
    ↓
重新渲染组件
    ↓
UI 更新
```

### 事件机制

```typescript
// Amis 事件系统

// 1. 组件触发事件
class MyWidget extends React.Component {
  handleClick = () => {
    // 触发 Amis 事件
    this.props.dispatchEvent('click', {
      data: this.props.data,
      value: this.state.value
    });
  };
}

// 2. Schema 中配置事件
{
  type: 'my-widget',
  onEvent: {
    click: {
      actions: [
        {
          actionType: 'toast',
          args: {
            msg: 'Clicked!'
          }
        }
      ]
    }
  }
}

// 3. 事件传播
Component Event → Amis Event System → Actions → UI Updates
```

## 集成机制

### 与 Amis 的集成

```typescript
// 集成层次

// Layer 1: 组件层 (Component Layer)
export const MyWidget: React.FC<MyWidgetProps> = (props) => {
  // 组件实现
};

// Layer 2: 渲染器层 (Renderer Layer)
@Renderer({
  type: 'my-widget'
})
class MyWidgetRenderer extends React.Component {
  render() {
    return <MyWidget {...this.props} />;
  }
}

// Layer 3: 编辑器层 (Editor Layer)
class MyWidgetPlugin extends BasePlugin {
  // 编辑器配置
}

// Layer 4: Schema 层 (Schema Layer)
{
  type: 'my-widget',
  label: 'Label',
  value: '${fieldValue}'
}
```

### 模板渲染集成

```typescript
// Amis 模板引擎集成

// 1. 组件接收模板
interface Props {
  itemTemplate?: string;
  render?: (schema: any, props?: any) => React.ReactNode;
  data?: any;
}

// 2. 使用 render 函数渲染模板
const MyWidget: React.FC<Props> = ({ itemTemplate, render, data }) => {
  if (itemTemplate && render) {
    return render('body', {
      type: 'tpl',
      tpl: itemTemplate
    }, { data });
  }
  
  return <div>{JSON.stringify(data)}</div>;
};

// 3. Schema 配置
{
  type: 'my-widget',
  itemTemplate: '<div>${name}: ${value}</div>',
  data: {
    name: 'Field',
    value: 'Value'
  }
}
```

### API 集成

```typescript
// 数据 API 集成

// 1. Service 包装
{
  type: 'service',
  api: '/api/data',
  body: {
    type: 'my-widget',
    source: '${items}'
  }
}

// 2. 组件接收数据
interface Props {
  source?: any[];  // 来自 Service 的数据
  api?: string;    // 直接 API 地址
  env?: {
    fetcher: (config: any) => Promise<any>;
  };
}

const MyWidget: React.FC<Props> = ({ source, api, env }) => {
  const [data, setData] = useState(source);
  
  useEffect(() => {
    if (api && env?.fetcher) {
      env.fetcher({ url: api }).then(res => {
        setData(res.data);
      });
    }
  }, [api, env]);
  
  return <div>{/* 渲染 data */}</div>;
};
```

## 设计模式

### 1. 组合模式 (Composition Pattern)

```typescript
// 组件组合

// Container 组件
export const MyContainer: React.FC<Props> = ({ render, body }) => {
  return (
    <div className="container">
      <header>Header</header>
      <main>
        {/* 渲染子 Schema */}
        {render('body', body)}
      </main>
      <footer>Footer</footer>
    </div>
  );
};

// Schema
{
  type: 'my-container',
  body: [
    { type: 'input-text', name: 'field1' },
    { type: 'input-text', name: 'field2' }
  ]
}
```

### 2. 工厂模式 (Factory Pattern)

```typescript
// 组件工厂

export function createWidget(type: string, config: any) {
  switch (type) {
    case 'select':
      return <AntdSelect {...config} />;
    case 'input':
      return <AntdInput {...config} />;
    default:
      return null;
  }
}
```

### 3. HOC 模式 (Higher-Order Component)

```typescript
// 增强组件功能

function withLoading<P>(
  Component: React.ComponentType<P>
): React.FC<P & { loading?: boolean }> {
  return (props) => {
    if (props.loading) {
      return <Spin />;
    }
    return <Component {...props} />;
  };
}

// 使用
const MyWidgetWithLoading = withLoading(MyWidget);
```

### 4. 渲染属性模式 (Render Props)

```typescript
// 渲染属性

interface Props {
  renderItem?: (item: any, index: number) => React.ReactNode;
  items?: any[];
}

export const MyList: React.FC<Props> = ({ items, renderItem }) => {
  return (
    <ul>
      {items?.map((item, index) => (
        <li key={index}>
          {renderItem ? renderItem(item, index) : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
};
```

### 5. 观察者模式 (Observer Pattern)

```typescript
// 事件订阅

class EventBus {
  private listeners: Map<string, Function[]> = new Map();
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}

// 使用
const eventBus = new EventBus();
eventBus.on('dataChange', (data) => console.log(data));
eventBus.emit('dataChange', { value: 'new' });
```

## 性能优化

### 1. 代码分割

```typescript
// 动态导入

const HeavyComponent = React.lazy(() => 
  import('./HeavyComponent')
);

export const MyWidget = () => (
  <Suspense fallback={<Spin />}>
    <HeavyComponent />
  </Suspense>
);
```

### 2. Memo 优化

```typescript
// React.memo

export const MyWidget = React.memo<MyWidgetProps>((props) => {
  // 组件实现
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.value === nextProps.value;
});

// useMemo & useCallback
const MyWidget: React.FC = (props) => {
  const computed = useMemo(() => {
    return heavyCalculation(props.data);
  }, [props.data]);
  
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, []);
  
  return <div onClick={handleClick}>{computed}</div>;
};
```

### 3. 虚拟滚动

```typescript
// 大列表优化

import { FixedSizeList } from 'react-window';

export const MyList: React.FC<Props> = ({ items }) => {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
};
```

## 安全性

### 1. XSS 防护

```typescript
// 避免 dangerouslySetInnerHTML

// ❌ 不安全
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 安全
<div>{userInput}</div>

// 如果必须使用 HTML，进行清理
import DOMPurify from 'dompurify';

const safeHTML = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: safeHTML }} />
```

### 2. 数据验证

```typescript
// Props 验证

interface Props {
  value?: string;
  max?: number;
}

export const MyWidget: React.FC<Props> = ({ value, max = 100 }) => {
  // 验证输入
  const safeValue = value?.slice(0, max) || '';
  
  return <div>{safeValue}</div>;
};
```

## 扩展性

### 插件系统

```typescript
// 组件插件机制

interface Plugin {
  name: string;
  init: (widget: any) => void;
  destroy: () => void;
}

class MyWidget extends React.Component {
  plugins: Plugin[] = [];
  
  registerPlugin(plugin: Plugin) {
    plugin.init(this);
    this.plugins.push(plugin);
  }
  
  componentWillUnmount() {
    this.plugins.forEach(p => p.destroy());
  }
}
```

## 总结

Steedos Widgets 架构设计遵循以下原则：

1. **模块化**: Monorepo 管理多个独立包
2. **可扩展**: 插件化的组件系统
3. **可维护**: 清晰的层次结构
4. **高性能**: 外部依赖共享、代码分割
5. **易集成**: 标准的 UMD 格式、Amis 集成
6. **类型安全**: TypeScript 类型系统

通过理解这些架构设计，AI 开发者可以更好地：
- 设计新组件
- 优化性能
- 解决集成问题
- 扩展功能
