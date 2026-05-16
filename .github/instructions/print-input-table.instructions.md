---
applyTo: "**/input_table.js,**/AmisInputTable*"
description: "Use when modifying the print-mode rendering of子表 (input-table) in print pages — getPrintInputTableSchema, _printTableFormatCell, AmisInputTable.less print styles. Covers rule-source-of-truth principle, tpl pipeline safety, and field-type coverage."
---

# 子表打印模式 (`getPrintInputTableSchema`) — 开发指南

## 背景

issue [steedos/steedos-plugins#744](https://github.com/steedos/steedos-plugins/issues/744) 修复"子表打印时边框线失真"。方案是为打印路径单独走一条**纯静态 HTML 表格 + lodash template** 的渲染（`getPrintInputTableSchema`），绕开 amis input-table / antd Table 的运行时渲染。

入口：[`packages/@steedos-widgets/amis-lib/src/lib/input_table.js`](../../packages/@steedos-widgets/amis-lib/src/lib/input_table.js) → `getPrintInputTableSchema(props)`

打印开关三条件任一：
- `props.print === true`
- `window.location.pathname` 匹配 `/page/page_instance_print`
- `localStorage.STEEDOS_PRINT_INPUT_TABLE === '1'`

## 核心原则

### 1. 规则来源 — 严禁从 UI 反推

子表单元格只读渲染的"规则"**不在本仓库**，分布在三层：

1. **amis 上游 renderer**（最终行为）：`node_modules/amis/src/renderers/{Static,InputNumber,Date,Select,File,Image,…}.tsx` 的 `static: true` 分支。
2. **AmisSteedosField 中间层**：[`packages/@steedos-widgets/amis-object/src/amis/AmisSteedosField.tsx`](../../packages/@steedos-widgets/amis-object/src/amis/AmisSteedosField.tsx)（`getAmisStaticFieldType()` 把 Steedos 字段类型派生为 amis 子 schema 的 type）。
3. **Steedos 字段转 amis schema**：[`packages/@steedos-widgets/amis-lib/src/lib/converter/amis/fields/index.js`](../../packages/@steedos-widgets/amis-lib/src/lib/converter/amis/fields/index.js)（普通表单字段路径，**子表 cell 不走这里**）。

**新增/修改字段类型的打印格式化规则时，必须按以下顺序确认**：

1. **看源码先**：先在 `AmisSteedosField.tsx` 找到该 Steedos 字段类型派生出的 amis 子 schema（type / static / precision / format / pipeIn 等）。
2. **看 amis renderer**：再在 `node_modules/amis/src/renderers/<对应 type>.tsx` 的 static 分支，看它实际生成什么 DOM / 文本。
3. **翻译到打印 tpl**：在 `_printTableFormatCell` 或 `_printTableEvalFieldTpl` 里实现等价输出，**注释里必须指明源码路径 + 行号**。
4. **UI 实测验证**：打开非打印态 `page_instance_view` 同一记录，对比单元格 textContent，必须 1:1 一致。

> ⚠️ **UI 实测只是验证，不是规则来源。** 之前的 commit 历史里有过"按 UI 表现反推规则"的尝试（例如把数量列也加上千分位），最终都因偏离 amis renderer 真实行为被回退。

### 2. 共用源码不可行的原因

理论上最干净的做法是把 `AmisSteedosField` 的只读分支抽成纯函数，给打印路径直接调用。**目前不可行**：

- `AmisSteedosField` 输出的是 amis 中间 schema，**最终格式化仍由 amis renderer 运行时**完成（如 `input-number static` 的千分位）。
- 打印路径是 lodash template 编译期产物，**无法在 tpl 字符串内嵌 amis 运行时**。
- 因此现实做法只能是 hand-port amis renderer 的 static 行为到打印 tpl，并在注释里指向源码。

如果未来 amis 升级导致 renderer 行为变化，**必须**回归本指南 §3 的字段类型覆盖矩阵。

## 3. 为什么不用"点打印时 copy amis DOM"方案

历史上讨论过另一个方案 B：预览页面保留 amis 原生子表，点击打印按钮时把 amis 渲染出的子表 DOM clone 到打印视图。**已放弃**，原因：

| 维度 | 方案 A（当前）：预览态直接静态化 | 方案 B：点打印时 copy DOM |
|---|---|---|
| 解决线条失真 | ✅ 根治（绕开 amis/antd 渲染管线） | ❌ **不能解决** — 失真根因就在 amis input-table → antd Table 渲染产物（virtual list、sticky 列、内部 scroll 容器分页错乱），不管在哪个时机 copy 这个 DOM，chrome 打印引擎都还是会失真 |
| 字段类型覆盖 | ⚠️ 需要 hand-port 每种类型 | ✅ 天然 100% |
| 预览所见即所得 | ❌ 预览页面是静态表，与非打印 view 有视觉差 | ✅ 完全一致 |
| 维护成本 | 中 | 低 |

**结论**：方案 A 是被迫的最小可行解 — 不绕开 amis/antd 渲染管线就解决不了线条失真。

## 4. 字段类型覆盖矩阵

### 已覆盖（commit `d239709f8` 起）

| Steedos 字段类型 | amis 中间 type | 打印态处理 | 实现位置 |
|---|---|---|---|
| text / textarea / autonumber / url / email / password | `static` | 原值 | `_printTableFormatCell` 默认分支 |
| number / currency / percent | `input-number` (`static:true`) | `_printTableFormatNumber` 按原始小数位千分位 | `_printTableFormatCell` 数字分支 |
| select / boolean / lookup（schema 含 `tpl` 的） | 带 `tpl` 的 `static` | `_printTableEvalFieldTpl` 预编译求值 | `lodashTemplate(f.tpl, {variable:'data', interpolate:/<%=([\s\S]+?)%>/g})` 缓存到 `window.__steedosPrintFieldTpls` |
| boolean（无 tpl 兜底） | — | "是" / "否" | `_printTableFormatCell` |
| 数组 / 对象 | — | `join(', ')` 或 `name/label/value` 取值 | `_printTableFormatCell` |

### 未覆盖（follow-up，需按 §1 原则补全）

| Steedos 字段类型 | amis 中间 type | 应有行为（参考 amis renderer） | 优先级 |
|---|---|---|---|
| date / datetime / time | `static-date` / `static-datetime` | 按字段 `format` 格式化（`Date.tsx`） | 高 |
| multi-select（multiple:true） | `static-mapping` | 映射为 label 数组 | 高 |
| image | `static-image(s)` | 渲染缩略图（`Image.tsx`） | 中 |
| file | `static` + file ref | 文件名 + 下载链接（`File.tsx`） | 中 |
| formula / summary | 依赖服务端 `_display` 回填 | 取 `row._display[name]` 兜底已实现，需验证 | 中 |
| master_detail | `static` lookup | 关联记录 name | 中 |
| html / markdown | `static-html` / `static-markdown` | 渲染为 DOM | 低 |
| color | `static-color` | 渲染色块 | 低 |

## 5. tpl 字符串安全约束（务必遵守）

打印 tpl 是 lodash template + amis tpl 双引擎环境，有几个**致命陷阱**：

### 4.1 严禁裸 `$`

amis 内置 tpl 引擎（`tpl-builtin`）会优先匹配带 `$` 的模板，从而**抢占 lodash 引擎**，导致 `<% %>` 块完全被忽略，最终返回空。

```js
// ❌ 错误：裸 $ 会被 amis builtin 引擎抢占
const tpl = '<td>$<%= row.amount %></td>';

// ✅ 正确：用 HTML entity 或避免
const tpl = '<td><%= row.amount %></td>';
```

### 4.2 严禁在 `+` 拼接的行尾写 `//` 注释

```js
// ❌ 错误：`+ //` 会让下一行的 `+'string'` 退化为一元 +，把字符串转成 NaN
const tpl = ''
  + '<% var x = 1; %>'  // 这里有注释
  + '<%- x %>';

// ✅ 正确：注释独占一行，放在拼接表达式上方
const tpl = ''
  // 计算 x
  + '<% var x = 1; %>'
  + '<%- x %>';
```

### 4.3 lodash template 选项约定

`_printTableEvalFieldTpl` 编译字段 `tpl` 时统一使用：

```js
lodashTemplate(f.tpl, {
  variable: 'data',
  interpolate: /<%=([\s\S]+?)%>/g,
});
```

- `variable: 'data'` 避免 `with` 性能问题
- 自定义 `interpolate` 只匹配 `<%= %>` 不匹配 `${ }`（防止与 amis tpl 冲突）

## 6. 验证流程

修改 `input_table.js` 或 `AmisInputTable.less` 后**必须**：

```bash
# 1. 重建 amis-lib（dist 是被 unpkg 引用的产物）
cd packages/@steedos-widgets/amis-lib && yarn build

# 2. 重建 amis-object（依赖 amis-lib 的 dist）
cd ../amis-object && yarn build

# 3. 浏览器硬刷新（ignoreCache）打印页：
#    http://127.0.0.1:5100/app/approve_workflow/page/page_instance_print?recordId=<ID>
```

### 回归矩阵

| 代号 | recordId | 验收点 |
|---|---|---|
| T0 | `6a0426c5ddaead2b9baa6f6c` | 6 列 3 行基线不退化 |
| T1 | `69c3e2b5d17fcb69e263b8f1` | 单行最简不退化 |
| T2 | `69e97878674a33474159967a` | 多子表不退化 |
| T3 | `69d8becdb7df097f875a4bec` | 长文本不竖排 |
| T4 | `69dced421f5fd36df3a218cc` | 数字千分位 + 不强加小数位 |
| T5 | `69dce2bd1f5fd36df3a218b9` | 超多列 28 不出现失真线 |
| T6 | `69dce8af1f5fd36df3a218c3` | 超多列 + 多行不退化 |

### grep 同步检查（改动后必跑）

```bash
# 确认改动没有破坏其它使用方
grep -rn "getPrintInputTableSchema\|_printTableFormatCell\|_printTableEvalFieldTpl\|__steedosPrintFieldTpls" \
  packages/@steedos-widgets/amis-lib/src \
  packages/@steedos-widgets/amis-object/src
```

## 7. 已知坑位（commit 历史教训）

- `78660e12d` — 修复 NaN 注入（`+ // 注释 + 'string'`）
- `33bcbf7a4` — 移除按 value 正则判定数字的逻辑（误把电话号码格式化为千分位）
- `afd4bc016` — 移除按 className 含 `steedos-field-number-readonly` 判定数字（数量列被错误加千分位）
- `d239709f8` — 收敛为 `type === 'input-number'` 判定 + 移除自加的 `__nowrap`（对齐非打印态行为）

新改动若偏离上述任一结论，**必须**在 commit message 里说明理由。

## 8. 已知 / 潜在"兜不住"的地方

方案 A 绕开了 amis input-table，但代价是预览页面失去了 antd Table 的一些原生能力。改打印渲染前务必评估以下风险点：

### 8.1 已知 / 已修

| 类别 | 现象 | 处理 |
|---|---|---|
| **超宽子表 horizontal scroll** | 25 列超宽子表会把外层审批单一路撑宽 → 最外层页面级横向滚动条 | `.steedos-print-input-table-host` 加 `contain: inline-size; max-width: 100%` 切断"子树 max-content → 父 td 列宽"反向传递；`.steedos-print-input-table-wrap` 加 `overflow-x: scroll` 由 wrap 自身出横向滚动条 |
| **打印态文字按字符竖排** | 之前给打印态加 `@media print { contain:none; min-width:0 }` 让 chrome 按 A4 压缩 → 25 列被等比挤到 30px/列 → 表头竖排 | 删除全部 `@media print` overrides，打印态与屏幕态完全统一：`contain:inline-size + min-width:max-content`；超 A4 由 chrome 自然截断 |
| **真打印预览看不到右侧截断指示** | 子表超 A4 时打印预览只看到左侧 ~10 列，无任何提示右侧还有 15 列被截断 | wrap 用 `overflow-x: scroll`（非 auto）+ 自定义 `::-webkit-scrollbar` 样式 → chrome 打印预览也会渲染滚动条 track 作为视觉指示 |
| **A4 物理极限** | 超长字段 / 超多列总宽 > A4 → 内容溢出右侧被截断 | web 打印硬性物理极限，无法绕过。用户解法：系统打印对话框切换"横向 / A3 / 缩放比例"，或在屏幕态把 wrap 滚到右侧再点打印（chrome 按当前 scroll 位置截取） |
| **预览页面视觉差异** | 子表是静态 HTML，无 amis 排序 / popover / 操作列等交互 | 设计取舍：打印场景本不需要 |

### 8.2 设计决策记录

#### 决策 D1：打印态与屏幕态视觉**完全一致**（当前实现）

**现状**：删除全部 `@media print` overrides，打印态与屏幕态用同一套规则：
- `wrap`: `overflow-x: scroll`
- `host`: `contain: inline-size; max-width: 100%`
- `table`: `min-width: max-content`

**效果**：
- 列宽按内容 max-content 自然分配（如 25 列 ~77px/列），文字单行清晰
- 超 A4 部分被 chrome 物理截断到纸张右侧
- 真打印预览同时显示横向滚动条 track 作为"右侧还有内容"的视觉指示

**舍弃的对照方案 D2：跟进主分支让打印态压缩列宽塞下全部列**

主分支（旧 antd Table 渲染）打印态强制 `.instance-form-view { table-layout: fixed; width: 100% }` + 子表 `width: 100%`，让所有列等比挤进 A4 配合 `white-space: normal` 允许表头换行。**已舍弃**，原因：

1. 25 列 / ~750px = 30px/列时表头按字符竖排（实测 commit `bff02ad64` 的截图证据），用户看不清
2. 数字短串如 "23232" 也会被错切，与 PR #650 主线想消除的"打印失真"目标冲突
3. 屏幕预览（假打印）与真打印效果完全不一致，违反"所见即所得"原则
4. chrome 系统打印对话框自带"横向 / A3 / 缩放比例"三个原生选项，是更合理的"塞下更多列"解法

**如果未来需要切换到 D2**，技术实现（约 5 行 CSS）：

```less
// 给 .steedos-print-input-table-host 加：
@media print {
  contain: none;
  max-width: none;
}
// 给 .steedos-print-input-table 加：
@media print {
  min-width: 0;
  table-layout: fixed;
}
.steedos-print-input-table thead th {
  @media print {
    word-break: break-all;  // 允许按字符断行塞下
  }
}
```

⚠️ 切换前必须重新验证 T0-T6 矩阵，预期数字短串错切问题会回归（这是 D1 vs D2 的根本权衡）。

### 8.3 潜在风险（未实测，新增字段类型前务必验证）

| 类别 | 风险描述 | 验证方法 |
|---|---|---|
| **行级 `visible_on` / `hidden_on` 表达式** | 静态表编译期没求值 → 该隐藏的行/列可能仍显示 | 找一个用了 `visible_on` 的子表对比非打印态 |
| **自动列** | `_id` / checkbox / 操作列 / drag 列由 amis 运行时注入；`getPrintInputTableSchema` 只取 `props.fields`，列数可能不一致 | 对比 `<th>` 数量与非打印态 |
| **行样式 `rowClassName` / `rowExpression`** | amis 行样式表达式静态表没实现 | 找配置了 rowClassName 的子表对比 |
| **`enable_tree` 树形子表** | 父子关系、展开/折叠静态表完全没实现 | 树形子表打印是否需求？需求确认后再补 |
| **`enable_drag` 拖动排序** | 静态表无 drag handle 列 | 同上，确认是否打印场景需要 |
| **服务端 `_display` 字段** | 部分字段（lookup / formula / summary）依赖 `row._display[name]` | `_printTableFormatCell` 已优先取 `_display`，但未全字段验证 |

### 8.4 验收清单（新改动后必跑）

除 §6 的 T0–T6 PDF 矩阵外，还需在浏览器**预览态 + 真打印预览**确认：

1. ✅ 子表过宽时，**子表自身**出水平滚动条；外层审批单不撑宽（对齐非打印态）
2. ✅ 真打印预览（Cmd+P）也能看到子表底部的横向滚动条 track（D1 决策的视觉指示）
3. ⏳ `visible_on` / `hidden_on` 行列正确隐藏
4. ⏳ 自动列（checkbox / 操作列）数量与非打印态一致
5. ⏳ `rowClassName` 行样式生效
6. ⏳ 树形子表父子关系（若适用）

