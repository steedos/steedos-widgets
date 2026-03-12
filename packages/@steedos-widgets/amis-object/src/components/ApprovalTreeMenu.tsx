import React, { useEffect, useState, useCallback, useRef } from 'react';
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
   * - 'router': 使用 window.navigate 进行 SPA 路由跳转（默认）
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

    // 有 children 的节点是分组（浅色）；叶子节点是可点击菜单项（加粗深色）
    const isGroup = !isLeaf;
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

/**
 * 对 URL 中 additionalFilters 参数的值做 encodeURIComponent 编码。
 *
 * nav 接口返回的 URL 包含未编码的 additionalFilters（如 "['flow','=','xxx']"），
 * 其中的单引号、方括号、等号等在浏览器中会导致 amis requestAdaptor eval 报错。
 * 通过 encodeURIComponent 编码后，PageObject 的 getUrlParams 会用
 * decodeURIComponent 正确还原值，与平台其他地方处理 additionalFilters 的方式一致
 * （参见 approve.js、fields/table.js 中的 encodeURIComponent 用法）。
 *
 * 注意：不使用 URLSearchParams 解析，因为未编码的 additionalFilters 值包含 '='
 * 字符，URLSearchParams 会错误拆分。
 */
function encodeFilterParams(url: string): string {
  try {
    const questionMarkIdx = url.indexOf('?');
    if (questionMarkIdx === -1) return url;

    const path = url.substring(0, questionMarkIdx);
    const queryString = url.substring(questionMarkIdx + 1);

    // 手动解析每个参数（只按第一个 '=' 拆分 key/value）
    const encodedParams = queryString.split('&').map(param => {
      const eqIdx = param.indexOf('=');
      if (eqIdx === -1) return param;
      const key = param.substring(0, eqIdx);
      const value = param.substring(eqIdx + 1);
      if (key === 'additionalFilters' && value) {
        return `${key}=${encodeURIComponent(value)}`;
      }
      return param;
    });

    return `${path}?${encodedParams.join('&')}`;
  } catch {
    return url;
  }
}

/**
 * 从 URL 中移除 additionalFilters / flowId / categoryId 查询参数，
 * 返回干净的 URL（用于 URL 匹配时比较）
 */
function stripFilterParams(url: string): string {
  try {
    const questionMarkIdx = url.indexOf('?');
    if (questionMarkIdx === -1) return url;

    const path = url.substring(0, questionMarkIdx);
    const queryString = url.substring(questionMarkIdx + 1);

    const params = queryString.split('&').filter(param => {
      const key = param.split('=')[0];
      return key !== 'additionalFilters' && key !== 'flowId' && key !== 'categoryId';
    });

    return params.length > 0 ? `${path}?${params.join('&')}` : path;
  } catch {
    return url;
  }
}

/**
 * 根据当前 URL 匹配菜单项，返回匹配到的节点 key
 * 匹配规则：先精确匹配 (pathname + search)，再 fallback 到 pathname-only 匹配
 */
function findKeyByCurrentUrl(items: NavItem[], currentUrl: string, parentKey = ''): string | null {
  // 1. 精确匹配（含 query string）
  const exactMatch = findKeyByUrlExact(items, currentUrl, parentKey);
  if (exactMatch) return exactMatch;

  // 2. 降级到 pathname-only 匹配
  const pathname = currentUrl.split('?')[0];
  if (pathname !== currentUrl) {
    return findKeyByUrlExact(items, pathname, parentKey);
  }
  return null;
}

function findKeyByUrlExact(items: NavItem[], targetUrl: string, parentKey = ''): string | null {
  for (let i = 0; i < (items || []).length; i++) {
    const item = items[i];
    const itemKey = item.value || item._id || `${parentKey}-${i}`;
    const nodeUrl = item.value || item.options?.to || item.url;

    if (nodeUrl && (targetUrl === nodeUrl || targetUrl === stripFilterParams(nodeUrl))) {
      return itemKey;
    }

    if (item.children && item.children.length > 0) {
      const found = findKeyByUrlExact(item.children, targetUrl, itemKey);
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
 * - 支持 SPA 路由跳转（window.navigate）
 * - 支持根据当前 URL 自动匹配选中菜单项
 * - 支持监听 ROUTE_CHANGE postMessage 实现路由变化同步选中
 * - 支持监听 approval-tree-menu:reload postMessage 外部触发数据刷新
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

  // 保存 navItems 的 ref，以便在 postMessage listener 中使用最新值
  const navItemsRef = useRef<NavItem[]>([]);
  navItemsRef.current = navItems;

  // 同步外部 selectedKey
  useEffect(() => {
    if (externalSelectedKey !== undefined) {
      setSelectedKeys([externalSelectedKey]);
    }
  }, [externalSelectedKey]);

  /**
   * 获取当前 URL 字符串（pathname + decoded search），用于菜单项匹配
   */
  const getCurrentUrl = useCallback((): string => {
    let search = window.location.search;
    try {
      search = decodeURIComponent(search);
    } catch {
      // fallback to raw search if decodeURIComponent fails on malformed encoding
    }
    return window.location.pathname + search;
  }, []);

  /**
   * 根据当前 URL 自动匹配并选中菜单项
   */
  const syncSelectionByUrl = useCallback((items: NavItem[]) => {
    const currentUrl = getCurrentUrl();
    const matchedKey = findKeyByCurrentUrl(items, currentUrl);
    if (matchedKey) {
      setSelectedKeys([matchedKey]);
    }
  }, [getCurrentUrl]);

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

      // 根据当前 URL 自动匹配选中项（仅在没有外部 selectedKey 控制时）
      if (externalSelectedKey === undefined) {
        syncSelectionByUrl(items);
      }
    } catch (err) {
      console.error('[ApprovalTreeMenu] Failed to fetch nav data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, customHeaders, externalSelectedKey, syncSelectionByUrl]);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  // 监听 postMessage 事件：ROUTE_CHANGE（URL 同步选中）和 approval-tree-menu:reload（外部刷新）
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object') return;

      if (msg.type === 'ROUTE_CHANGE') {
        // 路由变化时，根据最新的 navItems 自动匹配选中项
        syncSelectionByUrl(navItemsRef.current);
      } else if (msg.type === 'approval-tree-menu:reload') {
        // 外部触发数据刷新
        fetchNav();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [syncSelectionByUrl, fetchNav]);

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
      const level = itemData.options?.level ?? 0;
      const filterName = itemData.options?.name;   // 'category' | 'flow'
      const filterValue = itemData.options?.value; // ObjectId

      const hasFilter = level >= 2 && filterName && filterValue;
      // 对 URL 中 additionalFilters 的值做 encodeURIComponent 编码，
      // 避免单引号等特殊字符导致 amis requestAdaptor eval 报错，
      // 同时保证 URL 与当前页面不同（不会被 react-router blocker 拦截）
      const navUrl = encodeFilterParams(url);

      // 对叶子节点（level >= 2），设置 sessionStorage 并广播过滤参数
      if (hasFilter) {
        try {
          if (filterName === 'flow') {
            sessionStorage.setItem('flowId', filterValue);
          } else {
            sessionStorage.removeItem('flowId');
          }
          if (filterName === 'category') {
            sessionStorage.setItem('categoryId', filterValue);
          } else {
            sessionStorage.removeItem('categoryId');
          }
        } catch {
          // sessionStorage 不可用时忽略
        }

        // 通过 postMessage 广播过滤参数，供外部组件监听
        window.postMessage({
          type: 'approval-tree-menu:filter',
          additionalFilters: [filterName, '=', filterValue],
          flowId: filterName === 'flow' ? filterValue : '',
          categoryId: filterName === 'category' ? filterValue : '',
        }, '*');
      }

      // 叶子节点和根节点统一走路由跳转。
      // 叶子节点的 navUrl 已通过 encodeFilterParams 编码了 additionalFilters，
      // amis 列表组件会从 URL 中解析过滤参数，只产生一次请求。
      // 不再通过 scope.doAction setValue 传递过滤数据（那会额外触发一次请求）。
      switch (navigateMode) {
        case 'location':
          window.location.href = navUrl;
          break;
        case 'router': {
          const navigate = (window as any).navigate;
          if (navigate) {
            navigate(navUrl);
          } else {
            console.warn('[ApprovalTreeMenu] window.navigate not available, falling back to window.location.href');
            window.location.href = navUrl;
          }
          break;
        }
        case 'postMessage':
          window.postMessage({ type: 'approval-tree-menu:navigate', url: navUrl, data: itemData }, '*');
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
