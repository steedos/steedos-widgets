# Plan 002: 静态默认值被误判为公式

## 日期
2026-02-12

## 概述
当字段默认值是纯静态文本但包含 `*`、`-`、`/`、`+` 等字符时，`mapFormula` 将其误判为运算符公式，导致默认值不生效。

## 规则文档
https://github.com/steedos/steedos-platform/blob/2.7/docs/workflow-formula-rules.md

## 根因

```javascript
// 修复前：只要字符串包含 +-*/ 就认为是运算符公式
const isOperator = newFormula.match(/[\+\-\*\/]/) && newFormula.indexOf("}.") < 0;
```

不含 `{字段引用}` 的文本中出现运算符字符即触发误判，例如 `某某公司***工厂` 中的 `*` 被当作乘法运算符。

## 修复方式

在运算符检测中增加 `hasFieldRef` 守卫——只有同时含有 `{字段引用}` 和运算符字符时，才判定为运算符公式：

```javascript
// 修复后
const hasFieldRef = newFormula.match(/\{[^{}]+\}/);
const isOperator = newFormula.match(/[\+\-\*\/]/) && hasFieldRef && newFormula.indexOf("}.") < 0;
```

## 影响的场景

| 输入 | 误匹配字符 | 修复前 | 修复后 |
|------|-----------|--------|--------|
| `某某公司***工厂` | `*` | `${某某公司***工厂}` (无效) | `null` (静态文本) |
| `2024-01-01` | `-` | `${2024-01-01}` (= 2022) | `null` |
| `部门/科室` | `/` | `${部门/科室}` | `null` |
| `C++开发` | `+` | `${C++开发}` | `null` |
| `100 * 2` | `*` | `${100 * 2}` | `null` |
| `{amount} * 2` | `*` | `${amount * 2}` ✅ | `${amount * 2}` ✅ (不受影响) |

## 变更文件

| 文件 | 操作 |
|------|------|
| `src/workflow/formula-utils.js` | 修改 — 添加 hasFieldRef 守卫 (2 行) |
| `src/workflow/__tests__/formula-utils.test.js` | 修改 — 新增 8 个测试用例 |

## 测试结果
43 passed, 0 failed

## 状态
✅ 已完成
