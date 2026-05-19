---
applyTo: "**/input_table.js,**/AmisInputTable*"
description: "Use when modifying the print-mode rendering of子表 (input-table) in print pages — getPrintInputTableSchema, buildPrintCellSchema, AmisInputTable.less print styles. Covers rollback procedure, field-type coverage, CSS layout design decisions."
---

# 子表打印模式 (`getPrintInputTableSchema`) — 开发指南

## 背景

issue [steedos/steedos-plugins#744](https://github.com/steedos/steedos-plugins/issues/744) 修复"子表打印时边框线失真"。
issue [steedos/steedos-widgets#651](https://github.com/steedos/steedos-widgets/issues/651) 将打印 cell 格式化改为**复用 amis `static-*` renderer**，移除原来 hand-port 的 lodash template 路径。

打印路径：`input_table.js` → `getPrintInputTableSchema` → amis `service + table-view` schema → `buildPrintCellSchema`（`printInputTableCell.js`）

打印开关（任一触发）：
- `props.print === true` —— 生产路径，plugins 端构造 schema 时写入
- `localStorage.STEEDOS_PRINT_INPUT_TABLE === '1'` —— 调试 / 灰度兜底，在普通审批查看页临时开启


## 1. 架构总览

```
input_table.js L1710
    │ isPrintInputTableEnabled(props) === true
    │
    ▼
getPrintInputTableSchema(props)
    │
    ├─ 表头：fields[] → table-view headerTds（纯 tpl 字符串）
    │
    └─ 返回 amis schema 结构：
         control → service(dataProvider) → table-view(trs=${__printTrs})

dataProvider（运行时）：
    │
    ├─ data[tableName] → rows[]
    ├─ 遍历 rows × fieldSpecs
    │      └─ buildPrintCellSchema(spec, val, disp) → amis cell schema
    └─ setData({ __printTrs: [headerRow, ...bodyTrs] })
```

核心设计：**cell body 是标准 amis schema**（static-number / static-date / tpl 等），由 amis renderer 运行时格式化，与非打印态共用格式化逻辑。

### 关键文件

| 文件 | 职责 |
|------|------|
| `packages/@steedos-widgets/amis-lib/src/lib/input_table.js` | 入口 `isPrintInputTableEnabled` + `getPrintInputTableSchema`（L1590-1710） |
| `packages/@steedos-widgets/amis-lib/src/lib/printInputTableCell.js` | `buildPrintCellSchema` 纯函数 + `normalizeFieldSpecForPrint` |
| `packages/@steedos-widgets/amis-object/src/amis/AmisInputTable.less` | 打印态 CSS 布局规则 |
| `packages/@steedos-widgets/amis-lib/src/lib/__tests__/printInputTable.reuseAmis.test.js` | 52 个单测覆盖全字段类型 |

## 2. 字段类型覆盖矩阵

所有字段类型映射集中在 `buildPrintCellSchema` 的 switch 分支：

| Steedos 字段类型 | amis cell type | 说明 |
|---|---|---|
| text / textarea / autonumber | `tpl` | 原值字符串 |
| number / currency / percent | `static-number` | precision / prefix / suffix 透传 |
| date / datetime | `static-date` | format 透传，毫秒戳用 valueFormat:"x" |
| boolean | `static-mapping` | ✓ / ✗ |
| select / lookup / master_detail / user / group | `tpl` | display 优先 → options 反查 → value 原值，多值 join(", ") |
| image / avatar | `tpl` (img 标签) | normalizeFiles → `<img class="steedos-print-input-table__img">` |
| file | `tpl` (a 标签) | normalizeFiles → `<a class="steedos-print-input-table__file">` |
| email | `tpl` (mailto) | `<a href="mailto:...">` |
| url | `tpl` (link) | `<a href="..." target="_blank">` |
| html | `tpl` | 原样输出 |
| markdown | `static-markdown` | amis 原生渲染 |
| code | `static-code` | amis 原生渲染 |
| formula / summary | `static-number` 或 `tpl` | 有 display 用 display，否则看是否 number |
| password | `tpl` | 固定 `******` |

### 未覆盖（低优）

| 类型 | 说明 |
|---|---|
| color | 应走 `static-color`，当前 fallback 原值字符串 |

## 3. CSS 布局设计决策

### 3.1 三层容器结构

```
.steedos-print-input-table-host   ← contain: inline-size; max-width: 100%
  └─ .steedos-print-input-table-wrap  ← overflow-x: auto（屏幕+打印态统一）
       └─ .steedos-print-input-table  ← table-layout: auto; min-width: max-content
```

### 3.2 设计原理

- **host**：`contain: inline-size` 切断子表 max-content 向父级反撑（否则会把外层审批单撑宽出页面级横向滚动条）
- **wrap**：`overflow-x: auto` 产生子表级水平滚动条，超宽列被裁切在 wrap 内部
- **table**：`min-width: max-content` 确保列宽按内容自然分配，不被压缩导致文字竖排

### 3.3 打印态与 Platform 全局 CSS 的冲突处理

Platform 有全局规则：
```css
.steedos-instance-related-view-wrapper .antd-Wrapper { overflow: visible !important }
```

会覆盖 wrap 的 `overflow-x: auto`。解法：用三重 class + `!important` 提升优先级：
```less
.steedos-print-input-table-wrap.steedos-print-input-table-wrap.steedos-print-input-table-wrap {
    @media print { overflow-x: auto !important; }
}
```

### 3.4 超 A4 子表处理

**方案**：wrap 裁切右侧列（与主分支 antd `.antd-Table-content { overflow-x: auto }` 行为等价）。
**用户操作**：屏幕态将 wrap 滚动条拖到右侧，再按 Cmd+P 打印第二张 A4，两张拼出完整内容。

## 4. 临时回滚方案

如遇线上问题需紧急回滚：

```js
// input_table.js L1710 — 注释此行即可跳过打印路径，回退到 amis input-table 原始渲染
// return getPrintInputTableSchema(props);
```

调试开关：
```js
// 在浏览器 console 执行，关闭打印路径
localStorage.removeItem("STEEDOS_PRINT_INPUT_TABLE");
```

## 5. 验证流程

修改 `input_table.js`、`printInputTableCell.js` 或 `AmisInputTable.less` 后**必须**：

```bash
# 在仓库根目录执行（切勿进入子包目录）
yarn build-object
```

### 单测

```bash
cd packages/@steedos-widgets/amis-lib
npx jest src/lib/__tests__/printInputTable.reuseAmis.test.js
```

### 浏览器验证

1. 禁用浏览器缓存 + 硬刷新
2. 打开打印页：`/app/approve_workflow/page/page_instance_print?recordId=<ID>`
3. DevTools → Rendering → Emulate CSS media: print 确认效果
4. Cmd+P 真打印预览确认

### 回归矩阵

| 代号 | recordId | 验收点 |
|---|---|---|
| T0 | `6a0426c5ddaead2b9baa6f6c` | 6 列 3 行基线 |
| T1 | `69c3e2b5d17fcb69e263b8f1` | 单行最简 |
| T2 | `69e97878674a33474159967a` | 多子表 |
| T3 | `69d8becdb7df097f875a4bec` | 长文本不竖排 |
| T4 | `69dced421f5fd36df3a218cc` | 数字千分位 + 不强加小数位 |
| T5 | `69dce2bd1f5fd36df3a218b9` | 超多列 28 不失真 |
| T6 | `69dce8af1f5fd36df3a218c3` | 超多列 + 多行 |

## 6. 维护约束

### 新增字段类型时

1. 在 `printInputTableCell.js` 的 switch 中添加 case
2. 在单测文件中添加对应 test case
3. 更新本文档 §2 矩阵
4. 运行 `npx jest` 确认全量通过

### 修改 CSS 布局时

1. 确认理解 §3 的三层容器关系
2. 修改后用 Emulate CSS media: print 验证
3. 真打印预览 Cmd+P 验证
4. 窄屏（iPhone SE）验证

### PR review 必查

- [ ] `buildPrintCellSchema` 新分支是否有对应单测
- [ ] CSS 修改是否同时验证了屏幕态 + 打印态
- [ ] 是否影响非打印路径（`isPrintInputTableEnabled` 为 false 时不应有任何副作用）

## 7. 已知限制

| 类别 | 说明 |
|---|---|
| 行级 `visible_on` / `hidden_on` | 打印路径未实现表达式求值，配置了的行/列可能仍显示 |
| 树形子表 `enable_tree` | 未实现父子展开结构 |
| 行样式 `rowClassName` | 未实现 |
| 自动列（checkbox / 操作列） | `getPrintInputTableSchema` 只取 `props.fields`，不含运行时注入列 |

## 8. 历史演进

| 阶段 | 方案 | 状态 |
|---|---|---|
| v0 | amis input-table → antd Table 原生渲染 | 线条失真（#744） |
| v1 (staging) | hand-port：lodash template 两阶段模型 + `_printTableFormatCell` | 已废弃 |
| v2 (当前) | 复用 amis static-* renderer：`service + table-view + buildPrintCellSchema` | ✅ 生产 |

v1 的 `_printTableFormatCell`、`_printTableEvalFieldTpl`、`window.__steedosPrintFieldTpls`、`_printTplImports` 等均已移除，不再存在于代码中。
