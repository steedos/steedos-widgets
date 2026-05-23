# 修改计划：OrgSelector 移动端多选拖拽排序（含布局改造）

> 关联 issue: `steedos/steedos-plugins#787`
> 同一 PR 分支: `feat/org-selector-drag-reorder-787`
> PR: https://github.com/steedos/steedos-widgets/pull/664

## 决策摘要（已与用户确认）

- ✅ 只抽一个 `useTouchSort` Hook（封装 touch 拖拽算法），UI 各自内联
- ✅ 不抽 `MobileBottomBar` / `MobileSelectedPanel` 组件（diff 大、props 膨胀，不划算）
- ✅ OrgSelector 单选移动端：保持现状（80% Drawer，不动）
- ✅ OrgSelector 多选移动端：升级到全屏 Drawer + 底部 pill + 全屏覆盖层 + touch 拖拽
- ✅ PC 端零改动（一期 PR #664 的 HTML5 drag 保留）
- ✅ 选人组件 (UserSelector) 行为零变化 — 只是把内联 touch 代码替换为 Hook 调用

## 现状对比

| 维度 | UserSelector 移动端（已实现） | OrgSelector 移动端（现状） |
|---|---|---|
| Drawer 高度 | 全屏 `100dvh` | 80% |
| 已选展示 | 底部 pill + 全屏覆盖层 | PC 右侧 180px 面板内嵌 |
| 拖拽 | 原生 touch + DOM clone（iOS 可用） | HTML5 drag（iOS 不可用） |

根因：HTML5 drag 在 iOS Safari 不触发，所以一期 PC PR 在手机上无效。

## 改动清单

### Step 1 — 新增 `useTouchSort` Hook
路径：`packages/@steedos-widgets/amis-object/src/hooks/useTouchSort.ts`

API：
```ts
useTouchSort({ items, onReorder, excludeSelector?, vibrate? })
  -> { bind(index), dragActiveIndex, dropTargetIndex }
```

封装 `MobileDrawerContent.tsx` L271-360 的算法：dragState ref、DOM clone 浮层、`opacity:0.3` / `border-top: 2px solid #1890ff`、`navigator.vibrate`、`e.preventDefault()`。

### Step 2 — 重构 `MobileDrawerContent.tsx`
删 L271-360 内联 handlers，改用 `useTouchSort`。行为 100% 一致。

### Step 3 — 改造 `SteedosOrgSelector.tsx` 移动端
仅 `isMobile && multiple` 启用新布局；单选保持 80% Drawer 不动。

a. 多选 Drawer 高度 `100dvh`
b. 主面板只渲染左侧组织树（去掉右侧 180px 已选面板）
c. 内联底部 pill `已选 N 个 ▲/▼` + 确定
d. 内联全屏覆盖层（标题/返回/清空全部/长按提示/列表）
e. 列表项用 `useTouchSort.bind(index)` 接入拖拽
f. item renderer 自定义（拖拽手柄 + 部门名 + 父级路径 + 删除）

## 风险与边界

| 风险 | 处理 |
|---|---|
| PC | `isMobile` 严格隔离 |
| 单选 | 显式跳过新布局 |
| UserSelector 回归 | 算法搬家，MCP 跑 5 项关键路径 |
| iOS Safari | 算法不重写，仅封装 |

## 验证流程（Chrome MCP, iPhone SE）

改前基线 → Step 2 后回归选人 → Step 3 后验证选部门：
- F. 多选 Drawer 全屏
- G. 底部 pill `已选 N 个 ▲`
- H. 点击 pill → 覆盖层
- I. touch 拖拽生效
- J. 单选回归：无 pill、80% Drawer
- K. PC 回归：HTML5 drag 仍正常
- L. 保存 → 刷新 → 顺序持久化

## 提交粒度

1. `refactor: 抽取 useTouchSort Hook`
2. `refactor: UserSelector 改用 useTouchSort（行为零变化）`
3. `feat: OrgSelector 移动端多选改用全屏 pill + 覆盖层 + touch 拖拽`

## 不在范围

- 不照搬钻入式导航
- 不引入第三方库
- 不动单选 / 后端 / 保存序列化
