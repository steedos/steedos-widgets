# Plan 003: 字段名含半角括号未安全化

## 日期
2026-02-28

## 概述
字段名中包含半角括号（如 `工程应预估支出(3)`）时，`getSafeCode` 未将其替换为安全字符，导致生成的 amis 表达式中半角括号被当作函数调用语法，公式解析失败。

## 规则文档
https://github.com/steedos/steedos-platform/blob/2.7/docs/workflow-formula-rules.md

## 根因

```javascript
// 修复前：只处理中文全角括号，未处理半角括号
export const getSafeCode = (code) => {
  return code.replace(/（/g, '_').replace(/）/g, '').replace(/、/g, '_').replace(/，/g, '_');
};
```

`getSafeCode('工程应预估支出(3)')` 返回 `'工程应预估支出(3)'`（未变），在 amis 表达式 `${工程应预估支出(3)}` 中被解析为函数调用。

## 修复方式

在 `getSafeCode` 中增加半角括号处理（`(` → `_`，`)` → 移除）：

```javascript
// 修复后
export const getSafeCode = (code) => {
  return code
    .replace(/（/g, '_').replace(/）/g, '')     // 全角括号
    .replace(/\(/g, '_').replace(/\)/g, '')     // 半角括号
    .replace(/、/g, '_').replace(/，/g, '_');    // 中文标点
};
```

## 影响的场景

| 输入公式 | 修复前输出 | 修复后输出 |
|---------|-----------|-----------|
| `{工程应预估支出(3)}/{合同金额(1)}*100` | `${工程应预估支出(3)/合同金额(1)*100}` (解析失败) | `${工程应预估支出_3/合同金额_1*100}` |
| `{费用合计(1)}` | `${费用合计(1)}` (解析失败) | `${费用合计_1}` |
| `{金额（元）} + {数量(2)}` | `${金额_元 + 数量(2)}` (部分失败) | `${金额_元 + 数量_2}` |

## 变更文件

| 文件 | 操作 |
|------|------|
| `src/workflow/formula-utils.js` | 修改 — getSafeCode 增加半角括号处理 |
| `src/workflow/__tests__/formula-utils.test.js` | 修改 — 新增测试组 7（4 个用例） |

## 测试结果
49 passed, 0 failed

## 状态
✅ 已完成
