# @steedos-widgets/approval

审批中心左侧树菜单组件（ApprovalTreeMenu），基于 Ant Design Tree 实现，适用于 steedos-widgets 审批中心模块。

## 安装

该包通过 steedos-widgets monorepo 进行管理，无需单独安装。

## 组件：ApprovalTreeMenu

### 功能说明

- 通过 `/api/approve_workflow/workflow/nav` 接口实时获取并动态渲染菜单数据
- 支持多层树结构（分组、部门、流程/分类、叶子节点）
- FontAwesome 图标名称自动映射到 antd 图标组件
- 角标数字支持红色（待审批）、蓝色（一般提醒）、灰色（草稿/已完成）三种颜色
- 支持选中高亮、折叠展开、hover/active 状态
- 根据接口数据 `unfolded` 字段自动展开主要节点
- 支持三种路由跳转方式

### Props API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selectedKey` | `string` | - | 当前选中项的 key（对应 NavItem._id） |
| `onSelect` | `(key: string, data: NavItem) => void` | - | 选中节点时的回调，返回节点 key 和原始数据 |
| `navMode` | `'window' \| 'router' \| 'postMessage'` | `'window'` | 叶子节点点击后的路由跳转方式 |
| `className` | `string` | - | 自定义 CSS class |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `rootUrl` | `string` | 自动读取 | 后端接口根 URL，不设置时自动从 `Builder.settings` 或 `localStorage.steedos:rootUrl` 读取 |
| `authToken` | `string` | 自动读取 | 认证 token，不设置时自动从 `Builder.settings` 读取 |
| `tenantId` | `string` | 自动读取 | 租户 ID，不设置时自动从 `Builder.settings` 读取 |

### NavItem 数据结构

接口 `/api/approve_workflow/workflow/nav` 应返回以下结构的数据（数组或包含 `data`/`items` 字段的对象）：

```typescript
interface NavItem {
  _id: string;         // 节点唯一 ID（作为 Tree key）
  name: string;        // 显示名称
  icon?: string;       // FontAwesome 图标名，如 "fa-inbox"、"fa-file-text"
  count?: number;      // 角标数量（> 0 时显示）
  unfolded?: boolean;  // 是否默认展开（有子节点时有效）
  url?: string;        // 叶子节点的跳转路径
  type?: string;       // 节点类型（影响角标颜色）
  children?: NavItem[]; // 子节点
}
```

示例数据：

```json
[
  {
    "_id": "pending",
    "name": "待审批",
    "icon": "fa-inbox",
    "count": 5,
    "unfolded": true,
    "type": "pending",
    "children": [
      {
        "_id": "dept-tech",
        "name": "技术部",
        "icon": "fa-building",
        "count": 3,
        "unfolded": true,
        "children": [
          {
            "_id": "flow-travel",
            "name": "出差申请",
            "icon": "fa-file-text",
            "count": 2,
            "url": "/app/approve-center/pending?flow=flow-travel"
          }
        ]
      }
    ]
  },
  {
    "_id": "draft",
    "name": "草稿",
    "icon": "fa-pencil",
    "count": 2,
    "type": "draft",
    "url": "/app/approve-center/draft"
  }
]
```

### 路由跳转方式

#### 方式一：`window`（默认）

使用 `window.location.href` 进行整页跳转：

```tsx
<ApprovalTreeMenu navMode="window" />
```

#### 方式二：`router`

使用 `SteedosUI.router.go` 进行 SPA 路由跳转（需全局 `SteedosUI` 对象）：

```tsx
<ApprovalTreeMenu navMode="router" />
```

#### 方式三：`postMessage`

通过 `window.postMessage` 通知父框架跳转，适用于 iframe 嵌入场景：

```tsx
<ApprovalTreeMenu navMode="postMessage" />

// 父框架监听消息
window.addEventListener('message', (e) => {
  if (e.data?.type === 'APPROVAL_NAV') {
    router.push(e.data.url);
  }
});
```

### 使用示例

#### 基础用法

```tsx
import { ApprovalTreeMenu } from '@steedos-widgets/approval';

export default function ApprovalLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 240, borderRight: '1px solid #f0f0f0' }}>
        <ApprovalTreeMenu />
      </aside>
      <main style={{ flex: 1 }}>
        {/* 审批内容区域 */}
      </main>
    </div>
  );
}
```

#### 受控选中 + 自定义跳转回调

```tsx
import { useState } from 'react';
import { ApprovalTreeMenu, NavItem } from '@steedos-widgets/approval';

export default function ApprovalSidebar() {
  const [selectedKey, setSelectedKey] = useState('pending');

  const handleSelect = (key: string, data: NavItem) => {
    console.log('选中节点:', key, data);
    setSelectedKey(key);
    // 自定义导航逻辑
    if (data.url) {
      history.pushState(null, '', data.url);
    }
  };

  return (
    <ApprovalTreeMenu
      selectedKey={selectedKey}
      onSelect={handleSelect}
      navMode="window"
      style={{ padding: '8px' }}
    />
  );
}
```

#### 自定义样式

```tsx
<ApprovalTreeMenu
  className="my-approval-menu"
  style={{ background: '#f5f5f5', borderRadius: 8 }}
/>
```

对应 CSS：

```css
.my-approval-menu .approval-tree-menu__item-label {
  font-weight: 500;
}
```

### 图标映射表

组件内置了常用的 FontAwesome → antd 图标映射：

| FontAwesome | antd 图标 | 场景 |
|-------------|-----------|------|
| `fa-download` | `CloudDownloadOutlined` | 下载 |
| `fa-pencil`, `fa-edit` | `EditOutlined` | 草稿/编辑 |
| `fa-check`, `fa-check-circle` | `CheckOutlined` | 已审批/已完成 |
| `fa-eye` | `EyeOutlined` | 已阅/查看 |
| `fa-file`, `fa-file-text` | `FileOutlined` | 文件/申请 |
| `fa-circle`, `fa-dot-circle-o` | `RightCircleOutlined` | 分类/圆点 |
| `fa-inbox` | `InboxOutlined` | 收件箱/待办 |
| `fa-paper-plane` | `SendOutlined` | 已发送 |
| `fa-folder`, `fa-folder-open` | `FolderOutlined` | 文件夹 |
| `fa-building` | `BankOutlined` | 部门 |
| `fa-user` | `UserOutlined` | 用户 |
| `fa-users` | `TeamOutlined` | 团队/部门 |
| `fa-clock-o` | `ClockCircleOutlined` | 计时/等待 |

不在映射表中的图标名将默认显示为 `FileOutlined`。

## 样式覆盖

使用 CSS 变量（Less 变量）可定制主题：

| Less 变量 | 默认值 | 说明 |
|-----------|--------|------|
| `@approval-menu-bg` | `#fff` | 背景色 |
| `@approval-menu-hover-bg` | `#f0f7ff` | hover 背景 |
| `@approval-menu-active-bg` | `#e6f4ff` | 选中背景 |
| `@approval-menu-active-color` | `#1677ff` | 选中文字/图标颜色 |
| `@approval-menu-text-color` | `#333` | 普通文字颜色 |
| `@approval-menu-icon-color` | `#8c8c8c` | 普通图标颜色 |
| `@approval-menu-item-height` | `36px` | 节点行高 |
| `@approval-menu-font-size` | `13px` | 字体大小 |

## 开发

```bash
# 监听开发模式
cd packages/@steedos-widgets/approval
yarn watch

# 构建
yarn build
```
