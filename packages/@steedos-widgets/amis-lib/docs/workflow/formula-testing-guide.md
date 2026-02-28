# 工作流表单公式 - 单元测试执行指南

## 概述

`formula-utils.js` 中的公式转换函数有完整的 Jest 单元测试覆盖。
测试依赖未写入 `package.json`，需临时安装后执行。

## 执行步骤

```bash
# 1. 进入包目录
cd packages/@steedos-widgets/amis-lib

# 2. 临时安装测试依赖（不修改 package.json）
npm install --no-save jest babel-jest @babel/core @babel/preset-env

# 3. 运行所有测试
npx jest --verbose

# 4. 只运行某个测试组（可选）
npx jest --verbose -t "Bug 5"
```

## 预期输出

```
Test Suites: 1 passed, 1 total
Tests:       49 passed, 49 total
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `src/workflow/formula-utils.js` | 被测模块（纯函数，零外部依赖） |
| `src/workflow/__tests__/formula-utils.test.js` | 测试用例 |
| `jest.config.js` | Jest 配置（含 Babel 转换） |

## 测试组

| 测试组 | 覆盖内容 | 用例数 |
|--------|---------|--------|
| 回归测试 | 已兼容的基本转换 | 17 |
| Bug 1 | `{approver}` 上下文变量 | 5 |
| Bug 2 | `{now}` 复合表达式 | 2 |
| Bug 3 | 简单引用中文字符 | 3 |
| Bug 4 | 简单引用空白 trim | 2 |
| Bug 5 | 静态文本误判为公式 | 8 |
| Bug 6 | 字段名含半角括号 | 4 |
| getSafeCode | 辅助函数 | 4 |
| getTableFieldMap | 辅助函数 | 3 |

## 添加新测试

在 `src/workflow/__tests__/formula-utils.test.js` 末尾追加：

```javascript
describe('mapFormula - Bug N: [描述]', () => {
  test('[输入] 应返回 [预期]', () => {
    expect(mapFormula('[输入]', null)).toBe('[预期]');
  });
});
```

然后重新执行 `npx jest --verbose` 验证。

## 清理（可选）

```bash
rm -rf node_modules
yarn install
```

## 注意事项

- 测试依赖故意不写入 `package.json`，避免影响生产构建
- AI Agent（如 GitHub Copilot）可直接用 `npx jest` 执行，无需额外配置
- 如多人协作需要频繁运行测试，可考虑将依赖加入 `devDependencies`
