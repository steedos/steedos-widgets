# Steedos Widgets - AI Developer Guide

## 项目概述 (Project Overview)

Steedos Widgets 是华炎魔方（Steedos）的前端资产包项目。本项目提供可重用的 UI 组件，这些组件可以集成到华炎魔方的页面构建器中，支持可视化配置和编辑。

### 核心目标
- 开发可在华炎魔方页面构建器中使用的自定义组件
- 将组件打包为 UMD 格式，通过 CDN 或 NPM 分发
- 提供组件的元数据配置，支持可视化编辑器
- 集成到 Amis 等微页面引擎中

### 技术栈
- **语言**: TypeScript, React 18.2.0
- **构建工具**: Rollup (打包为 UMD 格式)
- **包管理**: Lerna (Monorepo), Yarn Workspaces
- **UI 库**: Ant Design 5, Amis 6.3.0
- **样式**: CSS, Less, PostCSS, Tailwind CSS

## 项目结构 (Project Structure)

```
steedos-widgets/
├── packages/                          # Monorepo 包目录
│   └── @steedos-widgets/             # 所有组件包的命名空间
│       ├── antd/                     # Ant Design 组件包
│       │   ├── src/
│       │   │   ├── components/       # React 组件实现
│       │   │   ├── metas/           # 组件元数据配置（编辑器集成）
│       │   │   ├── assets.json      # 资产包配置（生产环境）
│       │   │   ├── index.ts         # 主入口（导出组件）
│       │   │   └── meta.ts          # 元数据入口
│       │   ├── rollup.config.ts     # Rollup 打包配置
│       │   ├── tsconfig.json        # TypeScript 配置
│       │   └── package.json         # 包配置
│       ├── amis-object/             # Amis 对象组件（核心业务组件）
│       ├── amis-lib/                # Amis 公共库
│       ├── steedos-lib/             # Steedos 公共库
│       ├── reactflow/               # React Flow 图形组件
│       ├── fullcalendar/            # 日历组件
│       ├── fullcalendar-scheduler/  # 日历调度组件
│       ├── devextreme/              # DevExtreme 组件
│       ├── liveblocks/              # 实时协作组件
│       ├── ckeditor/                # 富文本编辑器
│       ├── sortable/                # 拖拽排序组件
│       ├── ag-grid/                 # AG Grid 表格组件
│       └── example/                 # 示例组件包（仅供参考）
├── lerna.json                        # Lerna 配置
├── package.json                      # 根 package.json
├── unpkg-local.js                    # 本地开发服务器
└── README.md                         # 项目说明文档
```

## 核心概念 (Core Concepts)

### 1. 资产包 (Asset Package)

资产包是一个 JSON 配置文件（`assets.json`），定义了组件的静态资源访问地址。

**结构示例**:
```json
{
  "packages": [
    {
      "package": "@steedos-widgets/antd",
      "urls": [
        "https://unpkg.com/@steedos-widgets/antd@{{version}}/dist/antd.umd.js",
        "https://unpkg.com/@steedos-widgets/antd@{{version}}/dist/antd.umd.css"
      ],
      "library": "BuilderAntd"
    }
  ],
  "components": [
    {
      "exportName": "BuilderAntdMeta",
      "npm": { "package": "@steedos-widgets/antd" },
      "url": "https://unpkg.com/@steedos-widgets/antd@{{version}}/dist/meta.js",
      "urls": {
        "default": "https://unpkg.com/@steedos-widgets/antd@{{version}}/dist/meta.js",
        "design": "https://unpkg.com/@steedos-widgets/antd@{{version}}/dist/meta.js"
      }
    }
  ]
}
```

**关键字段**:
- `packages`: 定义组件资源包
  - `package`: NPM 包名
  - `urls`: UMD 格式的 JS/CSS 文件地址
  - `library`: UMD 导出的全局变量名
- `components`: 定义组件元数据
  - `exportName`: 元数据导出的全局变量名
  - `npm.package`: NPM 包名
  - `url/urls`: 元数据文件地址

### 2. 组件 (Component)

组件是实际的 React 组件实现，位于 `src/components/` 目录。

**示例** (`src/components/Select.tsx`):
```typescript
import React from 'react';
import { Select } from 'antd';

interface AntdSelectProps {
  value?: any;
  onChange: (value: any) => void;
  options?: any[];
  placeholder?: string;
  // ... 其他属性
}

const AntdSelect: React.FC<AntdSelectProps> = (props) => {
  const { value, onChange, options, placeholder } = props;
  
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      style={{ width: '100%' }}
    />
  );
};

export { AntdSelect };
```

### 3. 元数据 (Meta)

元数据配置文件定义组件在可视化编辑器中的行为，位于 `src/metas/` 目录。

**示例** (`src/metas/Select.tsx`):
```typescript
const config: any = {
  group: 'General',
  componentName: "AntdSelect",
  title: 'Select',
  npm: {
    package: "@steedos-widgets/antd",
    version: "{{version}}",
    exportName: "AntdSelect",
    destructuring: true
  },
  preview: {
    placeholder: "Please select",
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]
  },
  targets: ["steedos__RecordPage", "steedos__AppPage"],
  engines: ["amis"],
  amis: {
    name: 'antd-select',
    icon: "fa-fw fas fa-caret-square-down"
  }
};

export default {
  ...config,
  snippets: [
    {
      title: config.title,
      schema: {
        componentName: config.componentName,
        props: config.preview
      }
    }
  ],
  amis: {
    render: {
      type: config.amis.name,
      usage: "formitem",
      weight: 1,
      framework: "react"
    },
    plugin: {
      rendererName: config.amis.name,
      name: config.title,
      tags: [config.group],
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        label: config.title,
        name: 'select_field',
        options: [
          { label: 'Option One', value: 'one' }
        ]
      },
      panelControls: [
        // 编辑器面板控件配置
        {
          type: 'tabs',
          tabs: [
            {
              title: 'General',
              body: [
                { type: 'switch', name: 'allowClear', label: 'Allow Clear' },
                // ... 更多控件
              ]
            }
          ]
        }
      ]
    }
  }
};
```

**关键配置**:
- `componentName`: 组件唯一标识
- `npm`: NPM 包信息
- `preview`: 预览配置
- `targets`: 适用的页面类型
- `engines`: 支持的微页面引擎
- `amis.render`: Amis 渲染器配置
- `amis.plugin`: Amis 编辑器插件配置
- `panelControls`: 属性面板控件

### 4. 打包输出 (Build Output)

每个包构建后输出到 `dist/` 目录：

```
dist/
├── [package-name].umd.js        # UMD 格式的组件包（全局变量）
├── [package-name].umd.css       # 组件样式
├── meta.js                      # UMD 格式的元数据包
├── types/                       # TypeScript 类型定义
└── assets.json (or assets-dev.json)  # 资产包配置
```

## 开发工作流 (Development Workflow)

### 环境要求
- Node.js 18.x
- Yarn 1.22.22+

### 1. 安装依赖

```bash
# 根目录安装所有依赖
yarn
```

### 2. 开发新组件

#### 步骤 A: 创建组件文件

在 `packages/@steedos-widgets/[package-name]/src/components/` 创建组件：

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export { MyComponent };
```

#### 步骤 B: 导出组件

在 `src/components/index.tsx` 导出：

```typescript
export * from './MyComponent';
```

#### 步骤 C: 创建元数据配置

在 `src/metas/MyComponent.tsx` 创建：

```typescript
const config: any = {
  componentName: "MyComponent",
  title: 'My Component',
  group: 'Custom',
  npm: {
    package: "@steedos-widgets/[package-name]",
    version: "{{version}}",
    exportName: "MyComponent",
    destructuring: true
  },
  amis: {
    name: 'my-component',
    icon: "fa fa-cube"
  }
};

export default {
  ...config,
  snippets: [/* ... */],
  amis: {
    render: { type: config.amis.name, framework: "react" },
    plugin: {
      rendererName: config.amis.name,
      name: config.title,
      scaffold: {
        type: config.amis.name,
        title: 'Default Title',
        content: 'Default Content'
      },
      panelControls: [
        {
          type: 'tabs',
          tabs: [
            {
              title: 'General',
              body: [
                { type: 'input-text', name: 'title', label: 'Title' },
                { type: 'textarea', name: 'content', label: 'Content' }
              ]
            }
          ]
        }
      ]
    }
  }
};
```

#### 步骤 D: 注册元数据

在 `src/meta.ts` 注册：

```typescript
import MyComponent from "./metas/MyComponent";

const components = [MyComponent];
export default { components };
```

### 3. 本地开发和调试

```bash
# 编译资产包
yarn build

# 启动本地 unpkg 服务（端口 8080）
yarn unpkg
```

本地服务启动后，可以在华炎魔方项目中配置环境变量：

```bash
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/antd/dist/assets.json
```

### 4. 构建

```bash
# 构建所有包
yarn build

# 构建特定包
cd packages/@steedos-widgets/antd
yarn build
```

### 5. 发布

```bash
# 发布到 NPM
lerna publish
```

## 关键开发模式 (Key Development Patterns)

### 1. 组件属性透传

当组件基于第三方库（如 Ant Design）时，应支持透传属性：

```typescript
interface AntdSelectProps extends React.ComponentProps<any> {
  value?: any;
  onChange: (value: any) => void;
  selectProps?: any;  // 第三方库特定属性
}

const AntdSelect: React.FC<AntdSelectProps> = (props) => {
  const { value, onChange, selectProps = {}, ...restProps } = props;
  
  return (
    <Select
      value={value}
      onChange={onChange}
      {...selectProps}  // 透传第三方库属性
      {...restProps}
    />
  );
};
```

### 2. Amis 模板渲染

组件可以支持 Amis 模板语法：

```typescript
const AntdSelect: React.FC<AntdSelectProps> = (props) => {
  const { render, options, selectProps } = props;
  const { optionTpl } = selectProps;
  
  const formattedOptions = options.map((item, index) => {
    let label = item.label;
    
    if (optionTpl && typeof optionTpl === 'string') {
      // 使用 Amis 渲染器渲染模板
      label = render('body', { type: 'tpl', tpl: optionTpl }, { data: item, key: index });
    }
    
    return { ...item, label };
  });
  
  return <Select options={formattedOptions} />;
};
```

### 3. 国际化 (i18n)

使用全局 i18n 函数：

```typescript
const t = (window as any).steedosI18next.t;

const config = {
  title: t('widgets-meta:my-component_title', 'My Component'),
  // ...
};
```

### 4. 样式处理

支持多种样式方案：

```typescript
// CSS 模块
import './MyComponent.css';

// Less
import './styles/component.less';

// 内联样式
const styles = { width: '100%', padding: '10px' };

// Tailwind CSS 类名
<div className="min-w-[240px] p-4">...</div>
```

### 5. 外部依赖处理

在 `rollup.config.ts` 中配置 external：

```typescript
const external = [
  "react",
  "react-dom",
  "lodash",
  "antd",
  "amis-core"
];

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'lodash': '_',
  'antd': 'antd',
  'amis-core': 'AmisCore'
};
```

## 常见组件类型 (Common Component Types)

### 1. Amis Schema 组件

直接导出 Amis Schema 配置：

```typescript
export const AmisObjectTable = {
  type: 'service',
  api: '/api/objects/${objectApiName}/records',
  body: {
    type: 'table',
    columns: '${columns}'
  }
};
```

### 2. React 自定义渲染器

需要自定义 UI 逻辑：

```typescript
export const CustomRenderer: React.FC<any> = (props) => {
  // 自定义渲染逻辑
  return <div>...</div>;
};
```

### 3. 混合组件

结合 Schema 和自定义渲染：

```typescript
export const HybridComponent: React.FC<any> = (props) => {
  const { render, schema } = props;
  
  return (
    <div>
      <CustomHeader />
      {render('body', schema)}
    </div>
  );
};
```

## 调试技巧 (Debugging Tips)

### 1. 使用 assets-dev.json

在开发时使用 `assets-dev.json` 指向本地资源：

```json
{
  "packages": [{
    "package": "@steedos-widgets/antd",
    "urls": [
      "http://127.0.0.1:8080/@steedos-widgets/antd/dist/antd.umd.js"
    ],
    "library": "BuilderAntd"
  }]
}
```

### 2. 使用浏览器开发工具

- 在浏览器控制台检查全局变量：`window.BuilderAntd`
- 检查组件渲染：React DevTools
- 检查网络请求：Network 面板

### 3. 本地 unpkg 服务

`unpkg-local.js` 提供本地 CDN 服务，模拟 unpkg.com：

```javascript
// 支持 scoped packages
// http://localhost:8080/@steedos-widgets/antd/dist/antd.umd.js
```

### 4. 快速迭代

```bash
# 监听文件变化并重新构建
yarn watch

# 在另一个终端启动 unpkg 服务
yarn unpkg
```

## 最佳实践 (Best Practices)

### 1. 组件设计

- **单一职责**: 每个组件只做一件事
- **可配置性**: 通过 props 提供灵活配置
- **可扩展性**: 支持透传属性和自定义渲染
- **类型安全**: 使用 TypeScript 定义完整的类型

### 2. 元数据配置

- **清晰的属性面板**: 使用 Tabs 组织属性
- **合理的默认值**: 提供良好的开箱体验
- **条件显示**: 使用 `visibleOn` 根据条件显示控件
- **文档说明**: 为每个属性添加 `description`

### 3. 性能优化

- **外部依赖**: 常用库（React, Lodash）配置为 external
- **代码分割**: 按需加载大型组件
- **Memo 优化**: 使用 `useMemo`, `useCallback` 避免重复渲染
- **懒加载**: 大型资源使用动态 import

### 4. 版本管理

- **语义化版本**: 遵循 semver 规范
- **变更日志**: 记录每个版本的变更
- **兼容性**: 保持向后兼容或提供迁移指南

### 5. 测试

- **单元测试**: 测试组件核心逻辑
- **集成测试**: 测试组件在 Amis 中的集成
- **手动测试**: 在实际页面中验证组件

## 故障排查 (Troubleshooting)

### 问题 1: 组件未在编辑器中显示

**可能原因**:
- meta.ts 未导出
- assets.json 配置错误
- 环境变量未设置

**解决方案**:
1. 检查 `src/meta.ts` 是否导出了组件元数据
2. 验证 `assets.json` 中的 URL 可访问
3. 确认环境变量 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 正确

### 问题 2: 组件样式未加载

**可能原因**:
- CSS 文件未导入
- assets.json 未包含 CSS URL

**解决方案**:
1. 在组件中导入样式文件
2. 确保 `assets.json` 的 `urls` 包含 CSS 文件

### 问题 3: TypeScript 编译错误

**可能原因**:
- 类型定义缺失
- tsconfig.json 配置错误

**解决方案**:
1. 安装缺失的 `@types/*` 包
2. 检查 `tsconfig.json` 配置
3. 为第三方库添加类型声明

### 问题 4: Rollup 打包失败

**可能原因**:
- 依赖未安装
- 配置错误

**解决方案**:
1. 运行 `yarn` 安装依赖
2. 检查 `rollup.config.ts` 配置
3. 确保 external 和 globals 配置正确

## 高级主题 (Advanced Topics)

### 1. 自定义构建流程

修改 `rollup.config.ts` 自定义打包：

```typescript
export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/bundle.umd.js', format: 'umd', name: 'MyLib' },
      { file: 'dist/bundle.esm.js', format: 'esm' },
      { file: 'dist/bundle.cjs.js', format: 'cjs' }
    ],
    plugins: [
      typescript(),
      postcss({ extract: true }),
      terser()  // 压缩
    ]
  }
];
```

### 2. 多引擎支持

支持多个微页面引擎：

```typescript
const config = {
  engines: ["amis", "lowcode-engine"],
  amis: { /* Amis 配置 */ },
  lowcodeEngine: { /* 低代码引擎配置 */ }
};
```

### 3. 动态资源加载

按需加载大型依赖：

```typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

export const MyComponent = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
);
```

### 4. 服务端渲染 (SSR)

确保组件支持 SSR：

```typescript
const MyComponent: React.FC = (props) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <div>...</div>;
};
```

## 相关资源 (Related Resources)

### 官方文档
- [Amis 官方文档](https://aisuda.bce.baidu.com/amis/zh-CN/docs/index)
- [Amis 编辑器 Demo](https://github.com/aisuda/amis-editor-demo)
- [Amis Widget 开发](https://github.com/aisuda/amis-widget)
- [Ant Design](https://ant.design/)
- [Rollup 文档](https://rollupjs.org/)

### 示例项目
- [with-amis-custom-components](https://github.com/steedos/steedos-examples/tree/main/with-amis-custom-components)

### 包管理
- [Lerna](https://lerna.js.org/)
- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

## 快速参考 (Quick Reference)

### 常用命令

```bash
# 安装依赖
yarn

# 构建所有包
yarn build

# 构建对象包
yarn build-object

# 构建应用包
yarn build-app

# 监听文件变化
yarn watch

# 启动本地 unpkg 服务
yarn unpkg

# 启动 Storybook
yarn start

# 发布到 NPM
lerna publish

# 同步到 CNPM
yarn cnpm-sync
```

### 文件命名约定

- 组件文件: `PascalCase.tsx` (如 `MyComponent.tsx`)
- 元数据文件: 与组件同名 (如 `MyComponent.tsx`)
- 样式文件: 与组件同名 (如 `MyComponent.css`)
- 工具函数: `camelCase.ts` (如 `formatData.ts`)

### 导出约定

- 组件: 命名导出 `export { MyComponent }`
- 默认导出: 用于元数据配置 `export default config`
- 类型: 命名导出 `export type { MyComponentProps }`

## 总结 (Summary)

Steedos Widgets 项目通过 Monorepo 结构管理多个可重用的 UI 组件包。每个包包含：

1. **React 组件** (`src/components/`): 实际的 UI 实现
2. **元数据配置** (`src/metas/`): 编辑器集成配置
3. **资产包配置** (`src/assets.json`): 静态资源地址
4. **构建配置** (`rollup.config.ts`): 打包为 UMD 格式

开发流程：创建组件 → 配置元数据 → 本地调试 → 构建 → 发布

关键技术：TypeScript + React + Rollup + Amis

遵循本指南，AI 开发者可以快速理解项目结构，并高效地开发、调试和维护组件包。
