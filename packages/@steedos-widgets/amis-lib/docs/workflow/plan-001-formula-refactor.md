# Plan 001: 表单公式兼容性重构

## 日期
2026-02-12

## 概述
将 `flow.js` 中的 `getSafeCode`、`getTableFieldMap`、`mapFormula` 三个纯函数提取到独立模块 `formula-utils.js`，并修复 4 个公式转换兼容性缺陷。

## 背景
老版本审批王工作流表单公式语法（如 `{fieldName}`、`sum({col})`）需要转换为 amis-formula 引擎兼容的表达式（如 `${fieldName}`、`${SUM(ARRAYMAP(...))}`）。`mapFormula` 函数负责此转换，但存在部分场景未兼容。

## 规则文档
https://github.com/steedos/steedos-platform/blob/2.7/docs/workflow-formula-rules.md

## 修复的 Bug

| Bug | 问题 | 输入示例 | 修复前输出 | 修复后输出 |
|-----|------|---------|-----------|-----------|
| Bug 1 | `{approver}` 未作为上下文变量 | `{approver}.name` | `${approver__expand.name}` | `${approver.name}` |
| Bug 2 | `{now}` 在复合表达式中未转换 | `{date} - {now}` | `${date - now}` | `${date - NOW()}` |
| Bug 3 | 简单引用未对中文字符 getSafeCode | `{合计（元）}` | `${合计（元）}` (无效) | `${合计_元}` |
| Bug 4 | 简单引用未 trim 空白 | `{ amount }` | `${ amount }` | `${amount}` |

## 修复方式

### Bug 1
新增 `isContextVariable()` 函数，同时识别 `applicant` 和 `approver`：
```javascript
const isContextVariable = (code) => {
  return code === 'applicant' || code === 'approver';
};
```
在两处 replace 回调（`{code}.` 和 `{code.sub}`）中判断，上下文变量不加 `__expand` 后缀。

### Bug 2
在第二个 replace 回调（`{([^{}]+)}`）中添加：
```javascript
if (code === 'now') { return 'NOW()'; }
```

### Bug 3 + 4
在简单引用 fallback 分支，提取花括号内内容后先 `trim()` 再 `getSafeCode()`：
```javascript
const innerCode = newFormula.trim().slice(1, -1).trim();
const safeCode = getSafeCode(innerCode);
return `\${${safeCode}}`;
```

## 变更文件

| 文件 | 操作 |
|------|------|
| `src/workflow/formula-utils.js` | 新建 — 提取纯函数并修复 |
| `src/workflow/flow.js` | 修改 — 删除原函数，改为 import |
| `src/workflow/__tests__/formula-utils.test.js` | 新建 — 35 个测试用例 |
| `jest.config.js` | 新建 — Jest 配置 |

## 测试结果
35 passed, 0 failed

## 状态
✅ 已完成
