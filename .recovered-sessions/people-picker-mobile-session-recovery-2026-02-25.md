# 恢复会话：选人组件兼容手机端

## 恢复结论
- 已成功定位到目标会话。
- 主会话 ID：`bd954686-a050-440b-b7c6-c2d3b2f61161`
- 关联会话 ID：`2a82454c-9879-4916-953d-db9e7d8843f1`
- 主题命中：`选人组件`、`手机端`、`邮箱显示`、`已选排序交互`、`onMoveUser/onReorderUsers`

## 关键用户诉求（已恢复）
1. PC 端人员列表显示姓名+邮箱，手机端未显示邮箱，是否应统一。
2. 手机端多选已选列表使用上下按钮排序，UI 不够好，期望更符合移动端规范。
3. 希望参考主流移动端体验（飞书/钉钉/iOS）优化选人弹窗。

## 会话中已执行/提及的关键上下文
- 历史提交被定位到：`40c0d9b9`
- 提交信息：`fix: 修复移动端选人组件滚动加载、状态同步及交互规范问题`
- 影响文件：
  - `packages/@steedos-widgets/amis-object/src/components/MobileDrawerContent.tsx`
  - `packages/@steedos-widgets/amis-object/src/components/SteedosUserSelector.tsx`

## 会话里曾出现的实现方向（用于续做）
- 手机端人员卡片补充第 3 行信息：`email || mobile || username`
- 已选区排序交互从“上下按钮”向更移动端友好的方案演进（拖拽/更轻量交互）
- 期间出现过网络中断（`net::ERR_CONNECTION_CLOSED`），导致执行被打断，存在“做了一半”的情况

## 建议的续做起点（从当前代码接续）
1. 先检查 `MobileDrawerContent.tsx` 是否仍存在 `onMoveUser` 与上下箭头按钮分支。
2. 对齐 `SteedosUserSelector.tsx` 与 `MobileDrawerContent.tsx` 的接口定义（`onMoveUser`/`onReorderUsers`）。
3. 统一手机端用户卡片字段展示（姓名 + 组织/职位 + 邮箱/手机号/用户名）。
4. 本地跑一轮构建验证，避免网络中断期间产生的半改状态。

## 备注
- 本文档由本机 chat session 落盘数据恢复整理，目的是快速恢复工作上下文与执行线索。