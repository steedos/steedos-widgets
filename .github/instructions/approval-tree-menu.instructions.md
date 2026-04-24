---
applyTo: "**/ApprovalTreeMenu*"
description: "Use when modifying, testing, or debugging the ApprovalTreeMenu component (审批中心左侧菜单树). Covers node topology, URL routing rules, two-pane vs three-pane mode differences, and regression test matrix."
---

# ApprovalTreeMenu 审批中心左侧菜单 — 开发指南

## 组件位置

`packages/@steedos-widgets/amis-object/src/components/ApprovalTreeMenu.tsx`

## 节点拓扑

菜单数据由 API 返回，结构固定。**6 个根节点**分属 2 个对象：

| 根节点 | 对象 | listviewId | 可有子节点 |
|--------|------|------------|-----------|
| 待审核 | `instance_tasks` | `inbox` | 是（分类 L2 → 流程 L3）|
| 已审核 | `instance_tasks` | `outbox` | 否 |
| 监控箱 | `instances` | `monitor` | 是（分类 L2 → 流程 L3）|
| 草稿 | `instances` | `draft` | 否 |
| 进行中 | `instances` | `pending` | 否 |
| 已完成 | `instances` | `completed` | 否 |

### 特殊节点

- **"我的文件"**：纯折叠容器，无 URL，点击不跳转。它不算根节点，其下的草稿/进行中/已完成才是根节点。
- **子节点层级**：有子节点的根节点一定有两层——L2（分类 `category`）和 L3（流程 `flow`）。

### 节点 URL 格式（API 返回的原始格式，均为三栏 view 格式）

```
根节点:
  /app/approve_workflow/{objectName}/view/none?side_object={objectName}&side_listview_id={listviewId}&additionalFilters=

L2 分类节点:
  /app/approve_workflow/{objectName}/view/none?side_object={objectName}&side_listview_id={listviewId}&additionalFilters=['category','=','{categoryId}']&flowId=&categoryId={categoryId}

L3 流程节点:
  /app/approve_workflow/{objectName}/view/none?side_object={objectName}&side_listview_id={listviewId}&additionalFilters=['flow','=','{flowId}']&flowId={flowId}&categoryId={categoryId}
```

## URL 路由规则

路由格式参见 `packages/@steedos-widgets/steedos-lib/src/ui/router.jsx`：

```
列表页 (grid):  /app/{appId}/{objectName}/grid/{listViewName}
详情页 (view):  /app/{appId}/{objectName}/view/{recordId}
```

### 二栏模式 vs 三栏模式

| 维度 | 二栏 (grid) | 三栏 (view) |
|------|------------|------------|
| 列表 URL | `/app/approve_workflow/{obj}/grid/{listviewId}?display=grid&additionalFilters=...` | `/app/approve_workflow/{obj}/view/none?side_object={obj}&side_listview_id={listviewId}&additionalFilters=...` |
| 详情 URL | `/app/approve_workflow/{obj}/view/{recordId}`（无 display=grid）| URL 中 recordId 从 `none` 变为实际 ID |
| 必须含参数 | `display=grid` | `side_object`, `side_listview_id` |
| 不应含参数 | `side_object`, `side_listview_id` | 无 `display=grid` |
| 详情页返回 | 左上角有返回按钮 | 无返回按钮，只能通过菜单切换 |

### 关键函数

- `isGridMode()`: 检测当前是否二栏上下文。
  - 列表页：严格匹配 `/app/{appId}/{objectName}/grid/{listViewName}` 即返回 true
  - 详情页（`/app/{appId}/{objectName}/view/{recordId}`）：在 pathname 不是 grid 时回查 `sessionStorage.steedos_last_list_url`，若该值是同 app+object 的 `/grid/` URL，也视为二栏上下文（用于"二栏详情页点其他菜单 → 应回到二栏列表而不是翻三栏"的修复，依赖 platform 的 sessionStorage 写入与三栏/离开页面时的清理）
- `viewUrlToGridUrl(url)`: 将三栏 URL 转为二栏 grid URL，保留过滤参数，移除 `side_object`/`side_listview_id`，添加 `display=grid`
- `handleSelect()`: 菜单点击处理，核心导航逻辑。区分同根节点（replaceState）和跨根节点（navigate）

### URL 转换安全降级

`viewUrlToGridUrl` 有 3 层安全降级：
1. URL 不含 `/app/.../view/...` → 返回原值
2. 无 `side_listview_id` 参数 → 返回原值
3. 任何异常 → catch 返回原值

## 行为约束

- 点击当前所在节点不执行任何操作（二栏和三栏均如此）
- 同根节点内的子节点切换使用 `replaceState`（静默更新 URL）
- 跨根节点切换使用 `navigate`（触发 react-router 重新加载）
- `additionalFilters` 参数值包含未编码的 `=`（如 `['category','=','xxx']`），这是已有设计，不使用 `URLSearchParams` 解析

## 详情页返回按钮（依赖 platform）

二栏模式下，列表行是 react-router `<Link>`（直接 `pushState`，**不走** platform 的 `mergedEnv.jumpTo`），导致 platform 中只在 `jumpTo` 内递增的 `window._appNavCount` 不被更新。详情页点返回时 `goBack` 走 fallback，旧版 fallback 只截 pathname 会丢掉 `?additionalFilters=...` 与 `/grid/{listview}` 段。

修复方案位于 platform 侧（`builder6/webapp/src/components/AmisRender.tsx`）：
- 模块顶层 patch `history.pushState/replaceState/popstate`，凡 pathname 形如 `/app/{app}/{obj}/grid/{listview}` 即把 `pathname+search` 写入 `sessionStorage.steedos_last_list_url`
- `goBack` fallback 优先消费该值（带 origin/path 前缀校验防脏值），命中即 `navigate(lastListUrl)` 恢复完整 filters；命中失败回落到正则截 pathname 兜底（正则同时匹配 `/view|grid/`）

**本组件无需配合**——只要二栏列表 URL 含 `/grid/`，platform 自动记录。如果未来该 sessionStorage key 名或机制变更，本组件也不需要改动。


## 功能点

每个功能点对应独立的测试文件，命名规则：`approval-tree-menu-{功能点}.test.js`（单元测试）+ `approval-tree-menu-{功能点}-e2e.js`（浏览器E2E）。

### 功能点 1: url-utils — 菜单点击 URL 转换与过滤参数

- **Issue**: [steedos-widgets#619](https://github.com/steedos/steedos-widgets/issues/619)、[steedos-plugins#428](https://github.com/steedos/steedos-plugins/issues/428)
- **源文件**: `approval-tree-menu-url-utils.js`（纯函数）、`ApprovalTreeMenu.tsx` 中的 `handleSelect()`
- **关键函数**: `isGridModePath()`, `viewUrlToGridUrl()`
- **单元测试**: `__tests__/approval-tree-menu-url-utils.test.js`（Jest）
- **E2E 测试**: `__tests__/approval-tree-menu-url-utils-e2e.js`（Chrome F12 / MCP）
- **验证点**: 二栏/三栏模式下菜单点击后 URL 格式正确、过滤参数 `additionalFilters` 保留、`display=grid` 正确添加/移除

### 功能点 2: stress — 菜单随机操作压力测试

- **Issue**: [steedos-plugins#491](https://github.com/steedos/steedos-plugins/issues/491)、[steedos-widgets#594](https://github.com/steedos/steedos-widgets/issues/594)
- **E2E 测试**: `__tests__/approval-tree-menu-stress.js`（Chrome F12）
- **验证点**: 重复分类检测、选中态一致性、URL 幂等性、随机展开/折叠

> 后续新增功能点（如菜单高亮、节点徽章等）按同样模式添加。

## 变更同步规则

修改本组件代码时，**必须**检查以下同步项：

1. **改了 `approval-tree-menu-url-utils.js` 中的函数逻辑** → 更新 `__tests__/approval-tree-menu-url-utils.test.js` 中对应的单元测试用例
2. **改了 `handleSelect()` 中的导航/URL 逻辑** → 运行 `__tests__/approval-tree-menu-url-utils-e2e.js` 验证，必要时更新 E2E 脚本中的断言
3. **新增了函数或行为约束** → 在本文档的"关键函数"或"行为约束"章节补充说明
4. **新增了独立功能点** → 在"功能点"章节按模板添加条目，创建对应的 `approval-tree-menu-{功能点}.test.js` 和/或 `-e2e.js`

**原则：代码、测试、文档三者同步提交，不允许只改代码不更新测试。**

## 回归测试

测试矩阵覆盖以下维度的交叉组合：
- **起点状态**: 列表页 / 详细页
- **目标层级**: 根节点(L1) / 分类(L2) / 流程(L3)
- **对象切换**: 同对象 / 跨对象 (`instance_tasks` ↔ `instances`)
- **根节点归属**: 同根 / 跨根
- **显示模式**: 二栏 / 三栏

详细测试流程见 skill: `approval-menu-e2e-test`
