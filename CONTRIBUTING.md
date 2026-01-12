# 贡献指南 / Contributing Guide

感谢你考虑为 Steedos Widgets 做出贡献！

Thank you for considering contributing to Steedos Widgets!

## 目录 / Table of Contents

1. [行为准则 / Code of Conduct](#行为准则--code-of-conduct)
2. [开始之前 / Before You Start](#开始之前--before-you-start)
3. [开发流程 / Development Process](#开发流程--development-process)
4. [代码规范 / Code Standards](#代码规范--code-standards)
5. [提交规范 / Commit Guidelines](#提交规范--commit-guidelines)
6. [Pull Request 流程 / Pull Request Process](#pull-request-流程--pull-request-process)
7. [测试要求 / Testing Requirements](#测试要求--testing-requirements)

---

## 行为准则 / Code of Conduct

### 我们的承诺 / Our Pledge

我们致力于为每个人提供友好、安全和包容的环境，无论经验水平、性别认同和表达、性取向、残疾、外貌、体型、种族、民族、年龄、宗教或国籍如何。

We are committed to providing a friendly, safe and welcoming environment for all, regardless of level of experience, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### 基本准则 / Basic Guidelines

- 使用友好和包容的语言 / Use welcoming and inclusive language
- 尊重不同的观点和经验 / Respect differing viewpoints and experiences
- 优雅地接受建设性批评 / Gracefully accept constructive criticism
- 专注于对社区最有利的事情 / Focus on what is best for the community

---

## 开始之前 / Before You Start

### 1. 了解项目 / Understand the Project

阅读以下文档：
- [README.md](./README.md) - 项目概述
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构文档
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发指南
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始

### 2. 搭建开发环境 / Set Up Development Environment

```bash
# 克隆仓库
git clone https://github.com/steedos/steedos-widgets.git
cd steedos-widgets

# 安装依赖（需要 Node.js 18.x）
yarn install

# 启动开发服务器
yarn dev
```

### 3. 检查现有 Issues / Check Existing Issues

在开始工作之前，检查是否已有相关的 Issue。如果没有，请创建一个新的 Issue 描述你想要做的工作。

Before starting work, check if there is already a related issue. If not, create a new issue describing the work you want to do.

---

## 开发流程 / Development Process

### 1. Fork 和 Clone

```bash
# Fork 项目到你的账号
# 然后克隆你的 fork
git clone https://github.com/YOUR_USERNAME/steedos-widgets.git
cd steedos-widgets

# 添加上游仓库
git remote add upstream https://github.com/steedos/steedos-widgets.git
```

### 2. 创建分支 / Create Branch

```bash
# 从主分支创建功能分支
git checkout -b feature/your-feature-name

# 或修复分支
git checkout -b fix/bug-description
```

分支命名规范 / Branch Naming Convention:
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建、依赖等

### 3. 进行开发 / Make Changes

```bash
# 启动开发服务器
yarn dev

# 进行代码修改
# ...

# 运行代码检查
yarn lint

# 运行格式化
yarn format

# 类型检查
yarn type-check
```

### 4. 提交更改 / Commit Changes

使用规范的提交信息（见下文）。

### 5. 推送和创建 PR / Push and Create PR

```bash
# 推送到你的 fork
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

---

## 代码规范 / Code Standards

### TypeScript 规范

#### ✅ 推荐做法 / Recommended

```typescript
// 1. 使用明确的类型定义
interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// 2. 使用函数重载处理不同参数
function formatValue(value: string): string;
function formatValue(value: number): string;
function formatValue(value: string | number): string {
  return String(value);
}

// 3. 使用泛型提高复用性
function createArray<T>(items: T[]): T[] {
  return [...items];
}

// 4. 避免 any，使用 unknown
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}
```

#### ❌ 不推荐做法 / Not Recommended

```typescript
// 1. 使用 any
function process(data: any) {
  return data.value;
}

// 2. 隐式 any
function getValue(obj) {
  return obj.value;
}

// 3. 过度使用类型断言
const value = someValue as any as MyType;
```

### React 规范

#### ✅ 推荐做法 / Recommended

```typescript
import React, { memo, useCallback, useMemo } from 'react';

// 1. 使用函数式组件和 hooks
interface Props {
  users: User[];
  onSelect: (id: string) => void;
}

export const UserList = memo<Props>(({ users, onSelect }) => {
  // 2. 使用 useCallback 缓存回调
  const handleClick = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect]
  );

  // 3. 使用 useMemo 缓存计算结果
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );

  // 4. 正确的 key prop
  return (
    <ul>
      {sortedUsers.map((user) => (
        <li key={user.id} onClick={() => handleClick(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
});

// 5. 设置 displayName 便于调试
UserList.displayName = 'UserList';
```

### 样式规范

```tsx
// 1. 优先使用 Tailwind CSS
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
  Click me
</button>

// 2. 复杂样式使用类名组合
const buttonClasses = classNames(
  'px-4 py-2 rounded transition-colors',
  {
    'bg-blue-500 hover:bg-blue-600': variant === 'primary',
    'bg-gray-500 hover:bg-gray-600': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled,
  }
);

// 3. 必要时使用 CSS Modules
import styles from './Component.module.css';
```

### 文件组织规范

```
ComponentName/
├── index.ts              # 导出
├── ComponentName.tsx     # 组件实现
├── types.ts              # TypeScript 类型
├── utils.ts              # 工具函数（如果需要）
├── hooks.ts              # 自定义 hooks（如果需要）
└── __tests__/            # 测试文件
    └── ComponentName.test.tsx
```

---

## 提交规范 / Commit Guidelines

### Conventional Commits

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

格式 / Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 / Types

- `feat`: 新功能 / New feature
- `fix`: Bug 修复 / Bug fix
- `docs`: 文档更新 / Documentation
- `style`: 代码格式（不影响功能）/ Code style
- `refactor`: 重构 / Refactoring
- `test`: 测试相关 / Tests
- `chore`: 构建、依赖等 / Build, dependencies

### 示例 / Examples

```bash
# 新功能
git commit -m "feat(amis-object): add new DatePicker component"

# Bug 修复
git commit -m "fix(reactflow): resolve node positioning issue"

# 文档
git commit -m "docs(readme): update installation instructions"

# 重构
git commit -m "refactor(utils): simplify date formatting logic"

# 破坏性更改（在 footer 中说明）
git commit -m "feat(api): change response format

BREAKING CHANGE: API now returns data in new format"
```

### 提交信息最佳实践

1. **使用祈使句** / Use imperative mood: "add" not "added"
2. **首字母小写** / Lowercase first letter
3. **不要以句号结尾** / No period at the end
4. **简明扼要** / Be concise but descriptive
5. **使用英文** / Use English for commit messages

---

## Pull Request 流程 / Pull Request Process

### 1. PR 标题 / PR Title

使用与提交信息相同的格式：

```
feat(package-name): add new feature
fix(package-name): resolve specific issue
```

### 2. PR 描述 / PR Description

使用以下模板：

```markdown
## 描述 / Description
简要描述这个 PR 的目的和内容。
Brief description of what this PR does.

## 变更类型 / Type of Change
- [ ] 新功能 / New feature
- [ ] Bug 修复 / Bug fix
- [ ] 破坏性更改 / Breaking change
- [ ] 文档更新 / Documentation update
- [ ] 代码重构 / Code refactoring
- [ ] 性能优化 / Performance improvement

## 相关 Issue / Related Issues
Fixes #123
Related to #456

## 测试 / Testing
描述如何测试这些更改。
Describe how to test these changes.

## 截图 / Screenshots
如果适用，添加截图。
If applicable, add screenshots.

## 检查清单 / Checklist
- [ ] 代码遵循项目规范 / Code follows project standards
- [ ] 已运行 lint 检查 / Linting passes
- [ ] 已添加/更新测试 / Tests added/updated
- [ ] 已更新文档 / Documentation updated
- [ ] 所有测试通过 / All tests pass
```

### 3. Code Review

- 响应审查意见 / Respond to review comments
- 进行必要的修改 / Make necessary changes
- 保持礼貌和专业 / Be polite and professional

### 4. 合并要求 / Merge Requirements

PR 需要满足以下条件才能合并：

- [ ] 至少一个维护者批准 / At least one maintainer approval
- [ ] 所有 CI 检查通过 / All CI checks pass
- [ ] 没有合并冲突 / No merge conflicts
- [ ] 代码符合规范 / Code follows standards

---

## 测试要求 / Testing Requirements

### 单元测试 / Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" onClick={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 测试覆盖率 / Test Coverage

- 关键功能应有测试覆盖 / Critical features should have test coverage
- 目标：主要代码路径覆盖率 > 70%
- 不要为了覆盖率而测试 / Don't test just for coverage

---

## 发布流程 / Release Process

（仅适用于维护者 / For maintainers only）

```bash
# 1. 确保所有测试通过
yarn test

# 2. 更新版本号
lerna version [patch|minor|major]

# 3. 构建
yarn build

# 4. 发布
lerna publish from-git
```

---

## 获取帮助 / Getting Help

### 途径 / Channels

1. **GitHub Issues** - 报告 bug 或请求功能
2. **GitHub Discussions** - 提问和讨论
3. **文档** - 查看项目文档

### 提问技巧 / How to Ask Questions

好的问题包含：
1. 清晰的问题描述 / Clear problem description
2. 重现步骤 / Steps to reproduce
3. 期望行为 / Expected behavior
4. 实际行为 / Actual behavior
5. 环境信息 / Environment information
6. 相关代码或错误信息 / Relevant code or error messages

---

## 致谢 / Acknowledgments

感谢所有贡献者的努力！你们的贡献让这个项目变得更好。

Thanks to all contributors for your efforts! Your contributions make this project better.

### 如何成为维护者 / How to Become a Maintainer

持续贡献高质量代码和帮助社区的贡献者可能会被邀请成为维护者。

Contributors who consistently provide high-quality code and help the community may be invited to become maintainers.

---

## 许可证 / License

通过向本项目贡献，你同意你的贡献将按照 MIT 许可证进行授权。

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**感谢你的贡献！/ Thank you for contributing!** 🎉
