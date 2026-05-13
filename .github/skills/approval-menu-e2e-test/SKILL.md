---
name: approval-menu-e2e-test
description: "Run ApprovalTreeMenu regression tests for the approval center left sidebar menu. Use when: testing approval menu, verifying approval tree navigation, regression testing ApprovalTreeMenu, validating menu filter parameters, debugging menu URL routing in two-pane or three-pane mode, 测试审批菜单, 回归审批菜单, 验证审批中心左侧菜单."
---

# ApprovalTreeMenu 回归测试

## When to Use

- 修改 `ApprovalTreeMenu.tsx` 后需要回归验证
- 修改 `approval-tree-menu-url-utils.js` 后需要验证 URL 转换
- 审批中心菜单导航行为异常时排查
- PR 合并前的功能验证

## 环境要求

- 浏览器已打开审批中心页面（`/app/approve_workflow/...`）
- 已登录有审批数据的账号
- "待审核"下有分类和流程子节点（用于测试 L2/L3 子节点场景）
- MCP Chrome 已连接（如通过 Copilot 执行）

## 测试执行流程

### Step 1: 运行单元测试

```bash
cd <workspace>/steedos-widgets
npx jest --config jest.config.js packages/@steedos-widgets/amis-object/src/components/__tests__/approval-tree-menu-url-utils.test.js
```

验证 `isGridModePath` 和 `viewUrlToGridUrl` 纯函数的所有 URL 转换逻辑。

### Step 2: 二栏模式 E2E 测试

1. 在浏览器中打开二栏模式页面（URL 含 `/grid/`）
2. 在 F12 控制台粘贴运行 [E2E 测试脚本](./approval-tree-menu-url-utils-e2e.js)
3. 或通过 MCP Chrome `evaluate_script` 执行脚本内容
4. 查看控制台输出的测试报告

**二栏模式 URL 验证规则：**
- 路径格式：`/app/approve_workflow/{objectName}/grid/{listviewId}`
- 必须含 `display=grid`
- 不含 `side_object=` 和 `side_listview_id=`
- 子节点点击后 `additionalFilters` 非空

### Step 3: 三栏模式 E2E 测试

1. 在浏览器中打开三栏模式页面（URL 含 `/view/`）
2. 同样运行 `approval-tree-menu-url-utils-e2e.js` 脚本
3. 验证三栏模式行为未被改变

**三栏模式 URL 验证规则：**
- 路径格式：`/app/approve_workflow/{objectName}/view/{recordId或none}`
- 必须含 `side_object=` 和 `side_listview_id=`
- 子节点点击后 `additionalFilters` 非空

### Step 4: 补充手动测试（E2E 脚本未覆盖的场景）

| 场景 | 操作 | 验证 |
|------|------|------|
| F5 刷新 | 在过滤状态下刷新页面 | 过滤条件保留 |
| URL 分享 | 复制含过滤参数的 URL 在新标签打开 | 过滤条件生效 |
| 快速点击 | 快速连续点击不同节点 | 最终停留在正确节点 |
| 详情页返回 | 二栏模式点击记录后用返回按钮 | 回到列表页 |

## 测试矩阵

### 节点拓扑

| 根节点 | 对象 | listviewId | 可有子节点 |
|--------|------|------------|-----------|
| 待审核 | `instance_tasks` | `inbox` | 是 |
| 已审核 | `instance_tasks` | `outbox` | 否 |
| 监控箱 | `instances` | `monitor` | 是 |
| 草稿 | `instances` | `draft` | 否 |
| 进行中 | `instances` | `pending` | 否 |
| 已完成 | `instances` | `completed` | 否 |

### 关键路径覆盖

| ID | 起点 | 目标 | 类型 |
|----|------|------|------|
| A1 | 待审核 | 已审核 | 同对象根→根 |
| A2 | 已审核 | 草稿 | 跨对象根→根 |
| A3 | 草稿 | 进行中 | 同对象根→根 |
| A4 | 进行中 | 监控箱 | 同对象根→根 |
| A5 | 监控箱 | 待审核 | 跨对象根→根 |
| B1 | 待审核 | 待审核/分类(L2) | 同根根→子 |
| D2 | 分类(L2) | 流程(L3) | 同根 L2→L3 |
| D3 | 流程(L3) | 分类(L2) | 同根 L3→L2 |
| C1 | 分类(L2) | 已审核 | 跨根子→根（同对象） |
| D5 | 已审核 | 监控箱/分类(L2) | 跨根跨对象根→子 |
| E | 二栏列表→详情→返回按钮 | goBack 保留 filter | 详情页返回（依赖 platform sessionStorage）|
| F | 二栏列表→详情→点其他菜单 | 回到二栏列表保留 filter | 详情页跨菜单（本次修复主回归）|
| G | 三栏点根节点 | 保持 /view/ 不翻二栏 | 三栏防回归（stale sessionStorage）|
| H | 二栏分类列表→点击行进入详情 | 详情页菜单仍高亮当前分类子节点（即使 URL 仅含 additionalFilters，无 flowId/categoryId） | tpl.js 通用 URL + stripBackendOnlyParams 联动 |
| I | 通用对象（非审批）列表→点行进入详情 | URL 干净，不出现 `&additionalFilters=&flowId=&categoryId=` 空尾巴 | tpl.js 通用层不污染 |

## 结果判断

- **全部 PASS**：修复验证通过
- **任何 FAIL**：查看失败用例的实际/期望 URL，分析 `handleSelect` 中的路由逻辑
- **节点未找到**：环境缺少测试数据（无分类/流程），需补充数据后重测
