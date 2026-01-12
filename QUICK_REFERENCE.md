# 快速参考 / Quick Reference

## 📋 常用命令 / Common Commands

### 开发 / Development
```bash
yarn dev              # 启动开发服务器（推荐）
yarn watch            # 监听所有包
yarn build            # 构建所有包
yarn unpkg            # 启动 unpkg 服务
```

### 代码质量 / Code Quality
```bash
yarn lint             # ESLint 检查
yarn lint:fix         # 自动修复 ESLint 问题
yarn format           # 格式化代码
yarn format:check     # 检查格式
yarn type-check       # TypeScript 类型检查
```

### 包管理 / Package Management
```bash
# 安装依赖
yarn install

# 清理
lerna clean

# Bootstrap（安装并链接包）
lerna bootstrap

# 运行特定包命令
lerna run build --scope=@steedos-widgets/amis-object

# 并行运行
lerna run watch --parallel

# 发布（仅维护者）
lerna publish
```

---

## 🎯 开发工作流 / Development Workflow

### 1. 启动项目
```bash
# 克隆仓库
git clone https://github.com/steedos/steedos-widgets.git
cd steedos-widgets

# 安装依赖
yarn install

# 启动开发服务器
yarn dev
```

### 2. 配置 Steedos
在华炎魔方项目的 `.env.local` 文件中：
```env
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

### 3. 开发流程
```bash
# 1. 创建功能分支
git checkout -b feature/your-feature

# 2. 编辑代码（自动监听和重新编译）
# 编辑 packages/@steedos-widgets/*/src

# 3. 检查代码质量
yarn lint:fix
yarn type-check

# 4. 提交
git add .
git commit -m "feat: add new feature"

# 5. 推送
git push origin feature/your-feature

# 6. 创建 PR
```

---

## 📝 提交规范 / Commit Convention

### 格式
```
<type>(<scope>): <subject>
```

### 类型 / Types
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建、依赖等

### 示例 / Examples
```bash
git commit -m "feat(amis-object): add DatePicker component"
git commit -m "fix(reactflow): resolve node positioning"
git commit -m "docs(readme): update installation guide"
```

---

## 🔧 配置文件 / Configuration Files

### TypeScript
- `tsconfig.json` - 根配置
- `packages/*/tsconfig.json` - 包配置

### Linting
- `.eslintrc.js` - ESLint 规则
- `.prettierrc.js` - Prettier 规则
- `.editorconfig` - 编辑器配置

### Git
- `.gitignore` - Git 忽略文件
- `commitlint.config.js` - 提交信息规范

### Build
- `lerna.json` - Lerna 配置
- `package.json` - 根包配置
- `rollup.config.ts` - Rollup 配置（各包）

---

## 🎨 代码风格 / Code Style

### TypeScript
```typescript
// ✅ 推荐
interface Props {
  name: string;
  age?: number;
}

function greet({ name, age }: Props): string {
  return `Hello, ${name}`;
}

// ❌ 不推荐
function greet(props: any) {
  return `Hello, ${props.name}`;
}
```

### React
```tsx
// ✅ 推荐
import React, { memo, useCallback } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = memo<ButtonProps>(({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
});

// ❌ 不推荐
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### 导入顺序
```typescript
// 1. React
import React from 'react';

// 2. 第三方库
import lodash from 'lodash';
import moment from 'moment';

// 3. 内部包
import { Component } from '@steedos-widgets/amis-lib';

// 4. 相对导入
import { utils } from './utils';
import styles from './styles.css';
```

---

## 🐛 调试 / Debugging

### 查看构建输出
```bash
# 查看详细构建日志
lerna run build --scope=@steedos-widgets/amis-object --stream

# 查看特定包的构建
cd packages/@steedos-widgets/amis-object
yarn build
```

### 检查类型错误
```bash
# 全局类型检查
yarn type-check

# 特定包
cd packages/@steedos-widgets/amis-object
npx tsc --noEmit
```

### 查看 unpkg 服务内容
```bash
# 浏览器访问
http://localhost:8080/@steedos-widgets/amis-object/dist/

# 查看 assets manifest
http://localhost:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

---

## 🚨 常见问题 / Common Issues

### 问题 1: 修改代码后没有效果
```bash
# 检查开发服务器是否运行
# 应该看到 "watching for changes..."

# 检查编译是否成功
# 控制台应该显示 "created dist/..."

# 刷新浏览器
# Ctrl+Shift+R (硬刷新)
```

### 问题 2: 类型错误
```bash
# 运行类型检查查看具体错误
yarn type-check

# 暂时忽略（不推荐）
// @ts-ignore
const value = someValue;

# 正确做法：添加类型定义
interface SomeValue {
  property: string;
}
const value: SomeValue = someValue;
```

### 问题 3: Linting 错误
```bash
# 自动修复大部分问题
yarn lint:fix

# 手动修复剩余问题
yarn lint
# 根据提示修复

# 特殊情况禁用规则（不推荐）
// eslint-disable-next-line rule-name
const code = something();
```

### 问题 4: 依赖冲突
```bash
# 清理并重新安装
lerna clean
rm -rf node_modules
yarn install
```

---

## 📚 文档链接 / Documentation Links

### 项目文档
- [README.md](./README.md) - 项目概述
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发文档
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构文档
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) - 优化实施指南

### 外部资源
- [Lerna 文档](https://lerna.js.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [React 文档](https://react.dev/)
- [Rollup 文档](https://rollupjs.org/)

---

## 🔑 快捷键 / Keyboard Shortcuts

### VSCode
- `Ctrl+Shift+P` - 命令面板
- `Ctrl+P` - 快速打开文件
- `Ctrl+Shift+F` - 全局搜索
- `F2` - 重命名符号
- `Alt+Shift+F` - 格式化文档
- `Ctrl+.` - 快速修复

### Git
```bash
# 查看状态
git status

# 查看差异
git diff

# 查看历史
git log --oneline --graph

# 撤销修改
git checkout -- <file>
```

---

## 💡 最佳实践提示 / Best Practice Tips

### 开发时
1. ✅ 使用 `yarn dev` 而不是手动 `build`
2. ✅ 保存前让 VSCode 自动格式化
3. ✅ 提交前运行 `yarn lint:fix`
4. ✅ 使用有意义的变量名
5. ✅ 添加必要的注释

### 使用 AI 助手时
1. ✅ 提供清晰的上下文
2. ✅ 使用 TypeScript 类型
3. ✅ 参考现有代码模式
4. ✅ 验证生成的代码
5. ✅ 查看 `.github/copilot-instructions.md`

### 提交时
1. ✅ 遵循提交规范
2. ✅ 一个提交做一件事
3. ✅ 写清晰的提交信息
4. ✅ 包含必要的测试
5. ✅ 更新相关文档

---

## 📞 获取帮助 / Getting Help

### 在哪里提问
1. **技术问题** → 团队频道
2. **Bug 报告** → GitHub Issues
3. **功能请求** → GitHub Discussions
4. **紧急问题** → 联系维护者

### 如何提问
1. 描述问题和期望行为
2. 提供复现步骤
3. 包含错误信息
4. 说明环境信息（Node 版本等）

---

**保持这个文档在手边，快速查找常用命令和技巧！**

**最后更新**: 2026-01-12
