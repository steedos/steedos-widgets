import React, { useEffect, useState, useCallback } from 'react';
import { Tree, Badge, Spin } from 'antd';
import type { TreeProps } from 'antd';

import './ApprovalTreeMenu.css';

// ===================== 类型定义 =====================

/**
 * 接口返回的原始菜单项数据结构（来自 /api/approve_workflow/workflow/nav）
 *
 * 接口实际返回字段：
 * - label  → 节点显示名称
 * - tag    → 角标数字
 * - value  → 路由地址（同时也用作节点唯一 key）
 * - options.to → 备用路由地址
 * - icon, unfolded, children 字段名与代码一致
 */
export interface NavItem {
  /** 节点显示名称（接口字段） */
  label?: string;
  /** 角标数字（接口字段） */
  tag?: number;
  /** 路由地址，同时作为节点唯一标识（接口字段） */
  value?: string;
  /** 扩展选项，含备用路由 to 等（接口字段） */
  options?: { to?: string; level?: number; value?: string; name?: string; [key: string]: any };
  /** 图标类型（FontAwesome类名或自定义类型字符串） */
  icon?: string;
  /** 是否默认展开 */
  unfolded?: boolean;
  /** 子菜单项 */
  children?: NavItem[];
  // 以下为兼容旧字段，保持向后兼容
  /** @deprecated 使用 label 代替 */
  name?: string;
  /** @deprecated 使用 tag 代替 */
  badge?: number;
  /** @deprecated 使用 value 代替 */
  url?: string;
  /** @deprecated 使用 value 代替 */
  _id?: string;
  /** 角标颜色：'red' | 'blue' | 'gray' */
  badgeColor?: 'red' | 'blue' | 'gray';
  /** 节点类型（group/category/workflow/leaf等） */
  type?: string;
  /** 其他额外字段 */
  [key: string]: any;
}

/**
 * onSelect 回调函数参数
 */
export interface SelectInfo {
  /** 选中的路由地址 */
  url: string;
  /** 原始菜单项数据 */
  data: NavItem;
  /** 选中的 key */
  key: string;
}

/**
 * ApprovalTreeMenu 组件 Props
 */
export interface ApprovalTreeMenuProps {
  /**
   * 接口地址，默认为 /api/approve_workflow/workflow/nav
   */
  apiUrl?: string;
  /**
   * 外部控制的选中项 key（唯一标识）
   */
  selectedKey?: string;
  /**
   * 选中节点时的回调，返回路由地址和原始数据
   */
  onSelect?: (info: SelectInfo) => void;
  /**
   * 路由跳转方式：
   * - 'location': 使用 window.location.href 跳转
   * - 'router': 使用 SteedosUI.router.go 跳转（默认）
   * - 'postMessage': 通过 window.postMessage 通知父框架
   * - 'none': 不自动跳转，仅触发 onSelect 回调
   */
  navigateMode?: 'location' | 'router' | 'postMessage' | 'none';
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 自定义 className
   */
  className?: string;
  /**
   * 自定义请求头，用于认证（可选，默认会自动从 Builder.settings 或 localStorage 读取）
   */
  headers?: Record<string, string>;
  // amis 相关 props（当作为 amis 渲染器使用时传入）
  data?: any;
  env?: any;
}

// ===================== 工具函数 =====================

/**
 * 从 Builder.settings 或 localStorage 获取认证 token
 */
function getAuthToken(): string | null {
  try {
    // 优先使用 Builder.settings（steedos 平台注入）
    const builderSettings = (window as any)?.Builder?.settings;
    if (builderSettings?.authToken) return builderSettings.authToken;
    if (builderSettings?.['X-Auth-Token']) return builderSettings['X-Auth-Token'];
    // 其次使用 localStorage
    const localToken = localStorage.getItem('Meteor.loginToken') || localStorage.getItem('X-Auth-Token');
    if (localToken) return localToken;
  } catch {
    // ignore
  }
  return null;
}

/**
 * 从 Builder.settings 或 localStorage 获取 userId
 */
function getUserId(): string | null {
  try {
    const builderSettings = (window as any)?.Builder?.settings;
    if (builderSettings?.userId) return builderSettings.userId;
    const localUserId = localStorage.getItem('Meteor.userId');
    if (localUserId) return localUserId;
  } catch {
    // ignore
  }
  return null;
}

/**
 * FontAwesome icon 名称映射到图标 React 节点
 * 使用 FontAwesome 类名（Steedos 平台已全局加载 FontAwesome）
 * 未匹配时回退到通用文件图标
 */
function mapIconToAntd(icon?: string): React.ReactNode {
  // 如果传入的是 FA 类名（如 "fa fa-file"、"fas fa-check"），直接使用
  if (icon && (icon.startsWith('fa ') || icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fal '))) {
    return <i className={icon} aria-hidden="true" />;
  }

  if (!icon) return null;

  const lowerIcon = icon.toLowerCase();

  // 下载/草稿
  if (lowerIcon.includes('download') || lowerIcon.includes('draft')) {
    return <i className="fa fa-download" aria-hidden="true" />;
  }
  // 勾选/已批准
  if (lowerIcon.includes('check-circle') || lowerIcon.includes('approve')) {
    return <i className="fa fa-check-circle" aria-hidden="true" />;
  }
  if (lowerIcon.includes('check') && !lowerIcon.includes('circle')) {
    return <i className="fa fa-check" aria-hidden="true" />;
  }
  // 眼睛/查看
  if (lowerIcon.includes('eye')) return <i className="fa fa-eye" aria-hidden="true" />;
  // 编辑
  if (lowerIcon.includes('edit') || lowerIcon.includes('pencil')) {
    return <i className="fa fa-edit" aria-hidden="true" />;
  }
  // 团队/部门
  if (lowerIcon.includes('team') || lowerIcon.includes('users') || lowerIcon.includes('group')) {
    return <i className="fa fa-users" aria-hidden="true" />;
  }
  // 组织架构
  if (lowerIcon.includes('sitemap') || lowerIcon.includes('org')) {
    return <i className="fa fa-sitemap" aria-hidden="true" />;
  }
  // 文件夹
  if (lowerIcon.includes('folder-open')) return <i className="fa fa-folder-open" aria-hidden="true" />;
  if (lowerIcon.includes('folder')) return <i className="fa fa-folder" aria-hidden="true" />;
  // 时钟
  if (lowerIcon.includes('clock') || lowerIcon.includes('time') || lowerIcon.includes('hourglass')) {
    return <i className="fa fa-clock-o" aria-hidden="true" />;
  }
  // 关闭/拒绝
  if (lowerIcon.includes('times') || lowerIcon.includes('close') || lowerIcon.includes('reject')) {
    return <i className="fa fa-times" aria-hidden="true" />;
  }
  // 圆点
  if (lowerIcon.includes('circle') || lowerIcon.includes('dot')) {
    return <i className="fa fa-circle" aria-hidden="true" />;
  }
  // 默认：文件
  return <i className="fa fa-file" aria-hidden="true" />;
}

/**
 * 根据角标数值和上下文决定颜色
 * - badgeColor 字段优先
 * - 没有则根据 badge/tag 数值判断（>0红色，否则灰色）
 */
function getBadgeColor(item: NavItem): string {
  if (item.badgeColor === 'blue') return '#1677ff';
  if (item.badgeColor === 'gray') return '#8c8c8c';
  if (item.badgeColor === 'red') return '#ff4d4f';
  // 默认规则：有未读数量显示红色，否则灰色
  const count = item.tag ?? item.badge;
  if (count && count > 0) return '#ff4d4f';
  return '#8c8c8c';
}

// ===================== 树形数据转换 =====================

interface TreeNode {
  key: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
  isLeaf?: boolean;
  data: NavItem; // 保存原始数据
  url?: string;
}

/**
 * 将接口数据转换为 antd Tree 所需的 treeData 格式
 *
 * 字段映射：
 * - key:   item.value || item._id || 自动生成
 * - title: item.label || item.name
 * - badge: item.tag ?? item.badge
 * - url:   item.value || item.options?.to || item.url
 */
function convertToTreeNodes(items: NavItem[], parentKey = ''): TreeNode[] {
  return (items || []).map((item, index) => {
    // 使用 value（路由地址）作为唯一 key，兼容旧 _id 字段
    const key = item.value || item._id || `${parentKey}-${index}`;
    const isLeaf = !item.children || item.children.length === 0;

    // 兼容 tag（新）和 badge（旧）字段
    const badgeCount = item.tag ?? item.badge;
    const badgeColor = getBadgeColor(item);

    // 兼容 label（新）和 name（旧）字段
    const displayName = item.label || item.name;

    // 一级分组节点（level === 1 或无父节点）使用较浅颜色；叶子/可点击节点使用深色
    const isGroup = item.options?.level === 1 || parentKey === '';
    const labelClassName = `approval-tree-menu__label${isGroup ? ' approval-tree-menu__label--group' : ' approval-tree-menu__label--item'}`;

    const titleNode = (
      <span className="approval-tree-menu__title-wrap">
        <span className={labelClassName}>{displayName}</span>
        {badgeCount != null && badgeCount > 0 && (
          <Badge
            count={badgeCount}
            size="small"
            style={{ backgroundColor: badgeColor, fontSize: 10 }}
            overflowCount={999}
          />
        )}
        {badgeCount === 0 && (item.tag !== undefined || item.badge !== undefined) && (
          <Badge
            count={0}
            showZero
            size="small"
            style={{ backgroundColor: badgeColor, fontSize: 10 }}
          />
        )}
      </span>
    );

    // 兼容 value（新）、options.to（新备用）和 url（旧）字段
    const nodeUrl = item.value || item.options?.to || item.url;

    const node: TreeNode = {
      key,
      title: titleNode,
      icon: mapIconToAntd(item.icon),
      isLeaf,
      data: item,
      url: nodeUrl,
    };

    if (!isLeaf && item.children) {
      node.children = convertToTreeNodes(item.children, key);
    }

    return node;
  });
}

/**
 * 递归收集默认展开的 key
 * - unfolded=true 的节点展开
 * - 第一层节点默认展开
 *
 * key 生成逻辑与 convertToTreeNodes 完全一致：item.value || item._id || `${parentKey}-${index}`
 */
function collectDefaultExpandedKeys(items: NavItem[], parentKey = ''): string[] {
  const keys: string[] = [];
  (items || []).forEach((item, index) => {
    // key 生成逻辑与 convertToTreeNodes 保持一致
    const key = item.value || item._id || `${parentKey}-${index}`;
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren && (item.unfolded || parentKey === '')) {
      keys.push(key);
      // 递归处理子节点，传入当前 key 作为 parentKey
      const childKeys = collectDefaultExpandedKeys(item.children || [], key);
      keys.push(...childKeys);
    }
  });
  return keys;
}

/**
 * 根据 key 找到节点（key 生成逻辑与 convertToTreeNodes 保持一致）
 */
function findNodeByKey(items: NavItem[], key: string, parentKey = ''): NavItem | null {
  for (let i = 0; i < (items || []).length; i++) {
    const item = items[i];
    const itemKey = item.value || item._id || `${parentKey}-${i}`;
    if (itemKey === key) return item;
    if (item.children && item.children.length > 0) {
      const found = findNodeByKey(item.children, key, itemKey);
      if (found) return found;
    }
  }
  return null;
}

// ===================== 主组件 =====================

/**
 * ApprovalTreeMenu - 审批中心左侧树菜单组件
 *
 * 功能：
 * - 从接口 /api/approve_workflow/workflow/nav 动态获取菜单数据
 * - 使用 antd Tree 组件渲染，支持多层嵌套结构
 * - 图标支持 FontAwesome icon 名称映射到 antd icon
 * - 角标数字，颜色支持红色、蓝色、灰色
 * - 支持选中高亮、折叠展开
 * - 支持外部 selectedKey 控制选中项
 * - 支持 onSelect 回调（返回路由地址和原始数据）
 * - 支持三种路由跳转方式
 *
 * @example
 * ```tsx
 * <ApprovalTreeMenu
 *   onSelect={({ url, data }) => console.log('selected:', url, data)}
 *   navigateMode="router"
 * />
 * ```
 */
export const ApprovalTreeMenu: React.FC<ApprovalTreeMenuProps> = ({
  apiUrl = '/api/approve_workflow/workflow/nav',
  selectedKey: externalSelectedKey,
  onSelect,
  navigateMode = 'router',
  style,
  className = '',
  headers: customHeaders,
  data: amisData,
  env,
}) => {
  const [loading, setLoading] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    externalSelectedKey ? [externalSelectedKey] : []
  );

  // 同步外部 selectedKey
  useEffect(() => {
    if (externalSelectedKey !== undefined) {
      setSelectedKeys([externalSelectedKey]);
    }
  }, [externalSelectedKey]);

  // 获取数据
  const fetchNav = useCallback(async () => {
    setLoading(true);
    try {
      // 构建请求头
      const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      // 自动注入认证信息
      const token = getAuthToken();
      const userId = getUserId();
      if (token) reqHeaders['X-Auth-Token'] = token;
      if (userId) reqHeaders['X-User-Id'] = userId;

      const res = await fetch(apiUrl, { headers: reqHeaders });
      const json = await res.json();

      // 接口返回结构：{ data: { options: [...] }, status: 0, msg: "" }
      // 兼容多种格式：data.options 数组、data 数组、根数组
      let items: NavItem[];
      if (Array.isArray(json)) {
        items = json;
      } else if (Array.isArray(json?.data?.options)) {
        items = json.data.options;
      } else if (Array.isArray(json?.data)) {
        items = json.data;
      } else if (Array.isArray(json?.rows)) {
        items = json.rows;
      } else {
        items = [];
      }
      setNavItems(items);

      // 转换为树形数据
      const nodes = convertToTreeNodes(items);
      setTreeData(nodes);

      // 计算默认展开的 keys
      const defaultExpanded = collectDefaultExpandedKeys(items);
      setExpandedKeys(defaultExpanded);
    } catch (err) {
      console.error('[ApprovalTreeMenu] Failed to fetch nav data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, customHeaders]);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  // 处理节点选中
  const handleSelect: TreeProps['onSelect'] = (keys, info) => {
    const selectedKey = keys[0] as string;
    if (!selectedKey) return;

    setSelectedKeys([selectedKey]);

    // 找到对应节点数据
    const itemData = findNodeByKey(navItems, selectedKey);
    if (!itemData) return;

    // 兼容 value（新）、options.to（新备用）和 url（旧）字段
    const url = itemData.value || itemData.options?.to || itemData.url || '';

    // 触发外部回调
    onSelect?.({ url, data: itemData, key: selectedKey });

    // 路由跳转
    if (url) {
      switch (navigateMode) {
        case 'location':
          window.location.href = url;
          break;
        case 'router': {
          // 尝试使用 SteedosUI.router.go
          const steedosUI = (window as any)?.SteedosUI;
          if (steedosUI?.router?.go) {
            steedosUI.router.go(url);
          } else {
            // 降级到 window.location
            window.location.href = url;
          }
          break;
        }
        case 'postMessage':
          window.postMessage({ type: 'approval-tree-menu:navigate', url, data: itemData }, '*');
          break;
        case 'none':
        default:
          break;
      }
    }
  };

  // 展开/折叠
  const handleExpand: TreeProps['onExpand'] = (keys) => {
    setExpandedKeys(keys as string[]);
  };

  return (
    <div
      className={`approval-tree-menu ${className}`}
      style={style}
    >
      <Spin spinning={loading} size="small">
        <Tree
          className="approval-tree-menu__tree"
          showIcon
          treeData={treeData}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
          onExpand={handleExpand}
          blockNode
          switcherIcon={({ expanded }: { expanded: boolean }) =>
            expanded
              ? <i className="fa fa-angle-down" style={{ fontSize: 12 }} aria-hidden="true" />
              : <i className="fa fa-angle-right" style={{ fontSize: 12 }} aria-hidden="true" />
          }
        />
      </Spin>
    </div>
  );
};

export default ApprovalTreeMenu;
