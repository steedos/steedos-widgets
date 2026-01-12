# Steedos Widgets 架构文档 / Architecture Documentation

## 目录 / Table of Contents

1. [项目概述 / Project Overview](#项目概述--project-overview)
2. [技术栈 / Technology Stack](#技术栈--technology-stack)
3. [项目结构 / Project Structure](#项目结构--project-structure)
4. [核心概念 / Core Concepts](#核心概念--core-concepts)
5. [构建系统 / Build System](#构建系统--build-system)
6. [开发工作流 / Development Workflow](#开发工作流--development-workflow)
7. [代码组织 / Code Organization](#代码组织--code-organization)
8. [最佳实践 / Best Practices](#最佳实践--best-practices)

---

## 项目概述 / Project Overview

Steedos Widgets 是一个基于 Lerna 的 Monorepo 项目，包含了多个可重用的 UI 组件包，用于华炎魔方（Steedos）平台。

Steedos Widgets is a Lerna-based monorepo project containing multiple reusable UI component packages for the Steedos platform.

### 核心目标 / Core Goals

- **模块化设计** / Modular Design: 独立的包便于维护和复用
- **类型安全** / Type Safety: 使用 TypeScript 确保代码质量
- **高性能** / High Performance: 优化的构建输出和运行时性能
- **开发体验** / Developer Experience: 热重载和快速迭代

---

## 技术栈 / Technology Stack

### 核心技术 / Core Technologies

- **Lerna** `^6.6.2` - Monorepo 管理工具
- **TypeScript** `^4.6.2+` - 类型系统
- **React** `^17.0.0+` - UI 框架
- **Rollup** `^2.70.1` - 打包工具

### 构建工具 / Build Tools

- **Babel** `^7.18.13` - JavaScript 编译器
- **PostCSS** `^8.1.10` - CSS 处理器
- **Tailwind CSS** `^3.2.4` - 实用工具优先的 CSS 框架

### 开发工具 / Development Tools

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks
- **lint-staged** - 暂存文件检查
- **Commitlint** - 提交信息规范

---

## 项目结构 / Project Structure

```
steedos-widgets/
├── .github/                    # GitHub 配置和 CI/CD
│   ├── copilot-instructions.md # AI 辅助编程指南
│   └── workflows/              # GitHub Actions 工作流
│
├── apps/                       # 应用示例
│   ├── builder6/              # Builder 应用
│   ├── experience/            # Experience 应用
│   └── storybook/             # Storybook 组件文档
│
├── packages/@steedos-widgets/ # 组件包
│   ├── amis-object/           # AMIS 对象组件（核心包）
│   ├── amis-lib/              # AMIS 库共享代码
│   ├── reactflow/             # React Flow 集成
│   ├── liveblocks/            # 协作功能
│   ├── ag-grid/               # AG Grid 集成
│   ├── devextreme/            # DevExtreme 集成
│   ├── fullcalendar/          # 日历组件
│   ├── ckeditor/              # 富文本编辑器
│   ├── sortable/              # 拖拽排序
│   ├── steedos-lib/           # Steedos 库
│   └── example/               # 示例包
│
├── .eslintrc.js               # ESLint 配置
├── .prettierrc.js             # Prettier 配置
├── .editorconfig              # 编辑器配置
├── tsconfig.json              # TypeScript 配置
├── lerna.json                 # Lerna 配置
├── package.json               # 根包配置
│
├── dev-server.js              # 开发服务器
├── unpkg-local.js             # 本地 unpkg 服务
│
└── 文档 / Documentation
    ├── README.md              # 项目概述
    ├── ARCHITECTURE.md        # 架构文档（本文件）
    ├── DEVELOPMENT.md         # 开发指南
    ├── QUICKSTART.md          # 快速开始
    └── CONTRIBUTING.md        # 贡献指南
```

---

## 核心概念 / Core Concepts

### 1. Monorepo 架构

使用 Lerna + Yarn Workspaces 管理多包仓库：

**优势 / Advantages:**
- 统一的依赖管理
- 包之间共享代码
- 原子化提交
- 简化的构建流程

**工作原理 / How it works:**
```bash
# Lerna 管理包版本和发布
# Yarn Workspaces 处理依赖安装和链接
```

### 2. UMD 模块格式

所有包都构建为 UMD (Universal Module Definition) 格式：

**支持的使用方式 / Supported Usage:**
- `<script>` 标签直接引入
- AMD 模块加载器
- CommonJS (require)
- ES Modules (import)

**示例 / Example:**
```html
<!-- 通过 unpkg CDN 使用 -->
<script src="http://localhost:8080/@steedos-widgets/amis-object/dist/amis-object.umd.js"></script>
```

### 3. 资产包系统

通过 `assets-dev.json` 清单文件加载组件：

```json
{
  "version": "6.3.17-beta.4",
  "name": "@steedos-widgets/amis-object",
  "publicPath": "/dist/",
  "assets": {
    "js": ["amis-object.umd.js"],
    "css": ["tailwind-base.css"]
  }
}
```

---

## 构建系统 / Build System

### Rollup 配置

每个包都有独立的 `rollup.config.ts`：

```typescript
// 典型的 Rollup 配置
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/package.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/package.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/package.umd.js',
      format: 'umd',
      name: 'PackageName',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss(),
    babel(),
  ],
};
```

### 构建输出 / Build Output

每个包生成以下文件：

```
dist/
├── package.cjs.js          # CommonJS 格式
├── package.esm.js          # ES Module 格式
├── package.umd.js          # UMD 格式（主要使用）
├── package.cjs.js.map      # Source map
├── package.esm.js.map
├── package.umd.js.map
├── index.d.ts              # TypeScript 类型定义
└── assets-dev.json         # 资产清单
```

### TypeScript 编译

使用 Project References 优化编译性能：

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "references": [
    { "path": "../amis-lib" }
  ]
}
```

---

## 开发工作流 / Development Workflow

### 推荐流程 / Recommended Workflow

```bash
# 1. 安装依赖
yarn install

# 2. 启动开发服务器（包含 watch 模式）
yarn dev

# 3. 在 Steedos 项目中配置环境变量
# .env.local:
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json

# 4. 编辑代码，自动重新编译
# 修改 packages/@steedos-widgets/*/src 下的文件
# 保存后自动触发重新编译

# 5. 刷新浏览器查看更改
```

### 包管理命令 / Package Management

```bash
# 为所有包安装依赖
lerna bootstrap

# 清理所有包的 node_modules 和 dist
lerna clean

# 运行特定包的脚本
lerna run build --scope=@steedos-widgets/amis-object

# 并行构建所有包
lerna run build --parallel

# 发布新版本
lerna publish
```

### 代码质量检查 / Code Quality

```bash
# 运行 ESLint 检查
yarn lint

# 自动修复 ESLint 问题
yarn lint:fix

# 检查代码格式
yarn format:check

# 格式化代码
yarn format

# TypeScript 类型检查
yarn type-check
```

---

## 代码组织 / Code Organization

### 包的标准结构

```
@steedos-widgets/package-name/
├── src/                    # 源代码
│   ├── components/        # React 组件
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── Button.tsx
│   │   │   └── types.ts
│   │   └── ...
│   ├── hooks/             # 自定义 hooks
│   ├── utils/             # 工具函数
│   ├── types/             # TypeScript 类型
│   ├── styles/            # 样式文件
│   │   └── tailwind-base.css
│   └── index.ts           # 公共 API 导出
│
├── dist/                  # 构建输出（gitignored）
├── __tests__/            # 测试文件
├── package.json
├── tsconfig.json
├── rollup.config.ts
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

### 导出规范 / Export Conventions

**公共 API (`src/index.ts`):**
```typescript
// 导出所有公共组件
export { Button } from './components/Button';
export { Input } from './components/Input';

// 导出类型
export type { ButtonProps } from './components/Button/types';
export type { InputProps } from './components/Input/types';

// 导出工具函数
export { formatDate, parseDate } from './utils';
```

**组件导出 (`components/Button/index.tsx`):**
```typescript
export { default as Button } from './Button';
export type { ButtonProps } from './types';
```

---

## 最佳实践 / Best Practices

### 1. TypeScript 使用

✅ **推荐 / Recommended:**
```typescript
// 使用 interface 定义 props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// 明确的返回类型
function Button({ label, onClick, disabled }: ButtonProps): JSX.Element {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

❌ **不推荐 / Not Recommended:**
```typescript
// 使用 any
function Button(props: any) {
  return <button>{props.label}</button>;
}
```

### 2. React 组件

✅ **推荐 / Recommended:**
```typescript
// 函数式组件 + hooks
import React, { memo, useCallback } from 'react';

interface Props {
  data: Data[];
  onSelect: (id: string) => void;
}

export const List = memo<Props>(({ data, onSelect }) => {
  const handleClick = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <ul>
      {data.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});
```

### 3. 样式管理

✅ **推荐 / Recommended:**
```tsx
// 使用 Tailwind 类
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>

// 或使用 CSS Modules（如需要）
import styles from './Button.module.css';

<button className={styles.button}>Click me</button>
```

### 4. 性能优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存回调函数
- 按需导入，避免全量导入
- 使用 Code Splitting（动态 import）

### 5. 依赖管理

```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "dependencies": {
    // 只包含真正需要打包的依赖
    "@steedos-widgets/amis-lib": "workspace:*"
  },
  "devDependencies": {
    // 构建工具和类型定义
  }
}
```

### 6. 版本控制

使用语义化版本：
- **Major**: 破坏性更改
- **Minor**: 新功能（向后兼容）
- **Patch**: Bug 修复

```bash
# Lerna 自动管理版本
lerna version patch
lerna version minor
lerna version major
```

### 7. 文档规范

```typescript
/**
 * Button component for user interactions
 * 
 * @example
 * ```tsx
 * <Button 
 *   label="Click me" 
 *   onClick={() => console.log('clicked')}
 *   variant="primary"
 * />
 * ```
 */
export function Button(props: ButtonProps): JSX.Element {
  // implementation
}
```

---

## AI 辅助开发建议 / AI-Assisted Development Tips

### 提供充分上下文 / Provide Sufficient Context

当使用 GitHub Copilot 或其他 AI 助手时：

1. **明确包名**: 说明在哪个包中工作
2. **参考现有代码**: 让 AI 遵循现有模式
3. **提供类型定义**: TypeScript 类型帮助 AI 理解意图
4. **添加注释**: 描述复杂逻辑的意图

### 最佳提示词示例 / Example Prompts

```typescript
// 好的提示：提供上下文和类型
// Create a React component for displaying user profiles
// Should accept UserProfile type and render avatar, name, email
// Use Tailwind CSS for styling

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Copilot 将生成相应的组件
```

---

## 常见问题 / FAQ

### Q1: 如何添加新的组件包？

```bash
# 1. 创建新目录
mkdir -p packages/@steedos-widgets/new-package

# 2. 复制模板文件
cp -r packages/@steedos-widgets/example/* packages/@steedos-widgets/new-package/

# 3. 更新 package.json 中的包名
# 4. 在根 tsconfig.json 添加路径映射
# 5. 实现功能
```

### Q2: 如何调试构建问题？

```bash
# 1. 清理并重新构建
lerna clean
lerna bootstrap
lerna run build

# 2. 查看详细输出
lerna run build --scope=@steedos-widgets/package-name --stream

# 3. 使用 rollup 的可视化工具
# 在 rollup.config.ts 中添加 visualizer 插件
```

### Q3: 如何优化构建速度？

- 使用 `watch` 模式而非完整 build
- 启用 Rollup 缓存
- 使用 TypeScript project references
- 并行构建: `lerna run build --parallel`

---

## 相关资源 / Related Resources

- [Lerna 官方文档](https://lerna.js.org/)
- [Rollup 官方文档](https://rollupjs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [React 官方文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

## 维护者 / Maintainers

如有问题或建议，请联系项目维护者或提交 GitHub Issue。

---

**最后更新 / Last Updated**: 2026-01-12
