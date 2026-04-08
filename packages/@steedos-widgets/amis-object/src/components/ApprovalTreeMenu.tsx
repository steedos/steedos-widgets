import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Tree, Badge, Spin, Tooltip, Input } from 'antd';
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
   * 当前应用 ID（可选）。用于跨应用集成时，将菜单 URL 中的 approve_workflow 替换为当前应用 code。
   *
   * 取值优先级：
   * 1. 显式传入的 appId prop（优先级最高）
   * 2. amis 作用域自动注入的 data.context.appId（推荐，无需额外配置）
   *
   * 如果都未提供，则不做 URL 替换，保持原有行为。
   * 仅在非审批中心应用中集成时才会触发 URL 替换逻辑。
   */
  appId?: string;
  /**
   * 接口地址（可选）。
   * 推荐不配置，组件会自动根据 resolvedAppId 拼接：`/api/${appId}/workflow/nav`
   * @deprecated 组件内部会自动根据 appId 拼接，无需手动传入
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
 * 根据节点层级和角标数值决定角标样式
 * - level === 1（根节点）→ 红色背景白色文字
 * - level === 2（分组节点）→ 灰色背景黑色文字
 * - level === 3（叶子节点）→ 纯文字无背景
 * - badgeColor 字段优先（向后兼容）
 */
interface BadgeStyle {
  backgroundColor: string;
  color: string;
  boxShadow?: string;
}

const BADGE_TEXT_COLOR = 'rgba(0,0,0,0.65)';

function getBadgeStyle(item: NavItem): BadgeStyle {
  // badgeColor 字段优先（向后兼容）
  if (item.badgeColor === 'blue') return { backgroundColor: '#1677ff', color: '#fff' };
  if (item.badgeColor === 'gray') return { backgroundColor: '#8c8c8c', color: '#fff' };
  if (item.badgeColor === 'red') return { backgroundColor: '#ff4d4f', color: '#fff' };

  const level = item.options?.level;
  if (level === 2) {
    // 分组节点：灰色背景黑色文字
    return { backgroundColor: '#f0f0f0', color: BADGE_TEXT_COLOR };
  }
  if (level !== null && level !== undefined && level >= 3) {
    // 叶子节点：纯文字无背景
    return { backgroundColor: 'transparent', color: BADGE_TEXT_COLOR, boxShadow: 'none' };
  }
  // 默认（根节点 level===1 或 level 未定义）：红色背景
  const count = item.tag ?? item.badge;
  if (count && count > 0) return { backgroundColor: '#ff4d4f', color: '#fff' };
  return { backgroundColor: '#8c8c8c', color: '#fff' };
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
 * EllipsisTooltip — 仅在文字实际被截断（scrollWidth > clientWidth）时才显示 antd Tooltip。
 * 通过 labelRef 检测内层 label 是否溢出，通过 open prop 控制 Tooltip 显示。
 * Tooltip 包裹整个容器，这样 hover 在 padding 区域和角标上也能触发。
 */
const EllipsisTooltip: React.FC<{
  title: React.ReactNode;
  labelRef: React.RefObject<HTMLElement>;
  children: React.ReactElement;
}> = ({ title, labelRef, children }) => {
  const [visible, setVisible] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    const el = labelRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setVisible(true);
    }
  }, [labelRef]);

  const handleMouseLeave = React.useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Tooltip
      title={title}
      placement="right"
      mouseEnterDelay={0.3}
      overlayClassName="approval-tree-menu-tooltip"
      open={visible}
    >
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
    </Tooltip>
  );
};

/**
 * TreeNodeTitle — 单个树节点的标题渲染组件。
 * 封装为 React 组件以便使用 useRef 来检测文字溢出。
 */
const TreeNodeTitle: React.FC<{
  displayName: string;
  labelClassName: string;
  badgeCount?: number;
  badgeStyle: BadgeStyle;
}> = ({ displayName, labelClassName, badgeCount, badgeStyle }) => {
  const labelRef = React.useRef<HTMLSpanElement>(null);

  return (
    <EllipsisTooltip title={displayName} labelRef={labelRef}>
      <span className="approval-tree-menu__title-wrap">
        <span ref={labelRef} className={labelClassName}>{displayName}</span>
        {badgeCount != null && badgeCount > 0 && (
          <Badge
            count={badgeCount}
            size="small"
            style={{ ...badgeStyle, fontSize: 10 }}
            overflowCount={999}
          />
        )}
      </span>
    </EllipsisTooltip>
  );
};

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
    const badgeStyle = getBadgeStyle(item);

    // 兼容 label（新）和 name（旧）字段
    const displayName = item.label || item.name;

    // 有 children 的节点是分组（浅色）；叶子节点是可点击菜单项（加粗深色）
    const isGroup = !isLeaf;
    const labelClassName = `approval-tree-menu__label${isGroup ? ' approval-tree-menu__label--group' : ' approval-tree-menu__label--item'}`;

    const titleNode = (
      <TreeNodeTitle
        displayName={displayName}
        labelClassName={labelClassName}
        badgeCount={badgeCount}
        badgeStyle={badgeStyle}
      />
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
 * - 只展开 unfolded=true 的节点（与旧版 input-tree 行为一致）
 *
 * key 生成逻辑与 convertToTreeNodes 完全一致：item.value || item._id || `${parentKey}-${index}`
 */
function collectDefaultExpandedKeys(items: NavItem[], parentKey = ''): string[] {
  const keys: string[] = [];
  (items || []).forEach((item, index) => {
    // key 生成逻辑与 convertToTreeNodes 保持一致
    const key = item.value || item._id || `${parentKey}-${index}`;
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren && item.unfolded) {
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
 * 将 URL 中的 /app/approve_workflow/ 替换为 /app/{resolvedAppId}/
 * 仅在 resolvedAppId 有效且不是 'approve_workflow' 时执行替换
 */
function rewriteAppUrl(url: string, resolvedAppId: string | undefined): string {
  if (!resolvedAppId || resolvedAppId === 'approve_workflow') return url;
  const rewritten = url.replace(/\/app\/approve_workflow\//g, `/app/${resolvedAppId}/`);
  if (rewritten !== url) {
    console.debug('[ApprovalTreeMenu] URL rewritten:', url, '->', rewritten);
  }
  return rewritten;
}

/**
 * 根据当前 URL 匹配菜单项，返回匹配到的节点 key
 * 匹配规则：先精确匹配 (pathname + search)，再 fallback 到去掉 additionalFilters/flowId/categoryId 后匹配
 * 当 resolvedAppId 有效时，会对菜单项 URL 做 appId 替换后再匹配
 */
function findKeyByCurrentUrl(items: NavItem[], currentUrl: string, parentKey = '', resolvedAppId?: string): string | null {
  // 1. 精确匹配（含 query string）
  const exactMatch = findKeyByUrlExact(items, currentUrl, parentKey, resolvedAppId);
  if (exactMatch) return exactMatch;

  // 2. 降级：去掉 additionalFilters/flowId/categoryId 后再匹配（保留 side_object、side_listview_id）
  const strippedUrl = stripFilterParams(currentUrl);
  if (strippedUrl !== currentUrl) {
    return findKeyByUrlExact(items, strippedUrl, parentKey, resolvedAppId);
  }
  return null;
}

function findKeyByUrlExact(items: NavItem[], targetUrl: string, parentKey = '', resolvedAppId?: string): string | null {
  for (let i = 0; i < (items || []).length; i++) {
    const item = items[i];
    const itemKey = item.value || item._id || `${parentKey}-${i}`;
    const rawUrl = item.value || item.options?.to || item.url;
    const nodeUrl = rawUrl ? rewriteAppUrl(rawUrl, resolvedAppId) : rawUrl;

    if (nodeUrl && (targetUrl === nodeUrl || targetUrl === stripFilterParams(nodeUrl))) {
      return itemKey;
    }

    if (item.children && item.children.length > 0) {
      const found = findKeyByUrlExact(item.children, targetUrl, itemKey, resolvedAppId);
      if (found) return found;
    }
  }
  return null;
}

// ===================== 搜索过滤 =====================

/**
 * 递归过滤树节点，保留匹配项及其祖先路径
 * 匹配逻辑：叶子节点 label 包含关键字，或子节点中有匹配项
 */
function filterNavItems(items: NavItem[], keyword: string): NavItem[] {
  if (!keyword) return items;
  const lower = keyword.toLowerCase();
  return (items || []).reduce<NavItem[]>((acc, item) => {
    const label = (item.label || item.name || '').toLowerCase();
    const childMatches = item.children ? filterNavItems(item.children, keyword) : [];
    if (label.includes(lower) || childMatches.length > 0) {
      acc.push({
        ...item,
        children: childMatches.length > 0 ? childMatches : item.children,
      });
    }
    return acc;
  }, []);
}

/**
 * 收集所有非叶子节点的 key（用于搜索时全部展开）
 */
function collectAllParentKeys(items: NavItem[], parentKey = ''): string[] {
  const keys: string[] = [];
  (items || []).forEach((item, index) => {
    const key = item.value || item._id || `${parentKey}-${index}`;
    if (item.children && item.children.length > 0) {
      keys.push(key);
      keys.push(...collectAllParentKeys(item.children, key));
    }
  });
  return keys;
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
  appId: propsAppId,
  apiUrl,
  selectedKey: externalSelectedKey,
  onSelect,
  navigateMode = 'router',
  style,
  className = '',
  headers: customHeaders,
  data: amisData,
  env,
}) => {
  // 解析 appId：优先 props.appId，其次 amisData.context.appId
  const resolvedAppId = useMemo(() => {
    let appId: string | undefined = propsAppId;
    if (!appId) {
      appId = amisData?.context?.appId;
    }
    if (appId) {
      console.debug('[ApprovalTreeMenu] appId resolved:', appId, 'source:', propsAppId ? 'props' : 'amisData.context.appId');
    } else {
      console.debug('[ApprovalTreeMenu] appId not available, skipping URL rewrite');
    }
    return appId;
  }, [propsAppId, amisData?.context?.appId]);

  // 自动根据 resolvedAppId 拼接接口地址，不再依赖外部传入 apiUrl
  // 如果外部仍传了 apiUrl（向后兼容），则优先使用外部值
  const actualApiUrl = useMemo(() => {
    if (apiUrl) return apiUrl;
    const appCode = resolvedAppId || 'approve_workflow';
    return `/api/${appCode}/workflow/nav`;
  }, [apiUrl, resolvedAppId]);

  const [loading, setLoading] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    externalSelectedKey ? [externalSelectedKey] : []
  );
  const [searchValue, setSearchValue] = useState('');

  // 是否显示搜索框：通过 window.steedos_approval_tree_menu_searchable 控制，默认不显示
  const showSearch = !!(window as any).steedos_approval_tree_menu_searchable;

  // 根据搜索词过滤后的树数据
  const filteredTreeData = useMemo(() => {
    if (!searchValue) return treeData;
    const filtered = filterNavItems(navItems, searchValue);
    return convertToTreeNodes(filtered);
  }, [searchValue, navItems, treeData]);

  // 搜索时自动展开所有匹配路径的父节点
  const displayExpandedKeys = useMemo(() => {
    if (!searchValue) return expandedKeys;
    const filtered = filterNavItems(navItems, searchValue);
    return collectAllParentKeys(filtered);
  }, [searchValue, navItems, expandedKeys]);

  // 保存 navItems 的 ref，以便在 postMessage listener 中使用最新值
  const navItemsRef = useRef<NavItem[]>([]);
  navItemsRef.current = navItems;

  // 用 ref 包装 fetchNav 和 syncSelectionByUrl，让 postMessage listener
  // 的 useEffect 依赖为空数组 []，只挂载一次，避免因引用变化导致反复卸载/重装丢失消息
  const fetchNavRef = useRef<() => Promise<void>>();
  const syncSelectionByUrlRef = useRef<(items: NavItem[]) => void>();

  // 标记是否为首次加载，仅首次加载时设置默认展开状态
  const isInitialLoadRef = useRef(true);

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
    const matchedKey = findKeyByCurrentUrl(items, currentUrl, '', resolvedAppId);
    if (matchedKey) {
      setSelectedKeys([matchedKey]);
    }
  }, [getCurrentUrl, resolvedAppId]);

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

      const res = await fetch(actualApiUrl, { headers: reqHeaders });
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

      // 计算默认展开的 keys（仅首次加载时设置，后续刷新保留用户当前的展开/折叠状态）
      if (isInitialLoadRef.current) {
        const defaultExpanded = collectDefaultExpandedKeys(items);
        setExpandedKeys(defaultExpanded);
        isInitialLoadRef.current = false;
      }

      // 根据当前 URL 自动匹配选中项（仅在没有外部 selectedKey 控制时）
      if (externalSelectedKey === undefined) {
        syncSelectionByUrl(items);
      }
    } catch (err) {
      console.error('[ApprovalTreeMenu] Failed to fetch nav data:', err);
    } finally {
      setLoading(false);
    }
  }, [actualApiUrl, customHeaders, externalSelectedKey, syncSelectionByUrl]);

  // 每次 render 时更新 ref，让 postMessage listener 始终调用最新版本
  fetchNavRef.current = fetchNav;
  syncSelectionByUrlRef.current = syncSelectionByUrl;

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  // 监听 postMessage 事件：ROUTE_CHANGE（URL 同步选中）和 approval-tree-menu:reload（外部刷新）
  // 使用 ref 间接调用，依赖为空数组 []，listener 只挂载一次，
  // 不会因 fetchNav/syncSelectionByUrl 引用变化而反复卸载/重装丢失消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object') return;

      if (msg.type === 'ROUTE_CHANGE') {
        // 路由变化时，根据最新的 navItems 自动匹配选中项
        syncSelectionByUrlRef.current?.(navItemsRef.current);
      } else if (msg.type === 'approval-tree-menu:reload') {
        // 外部触发数据刷新
        fetchNavRef.current?.();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 处理节点选中
  const handleSelect: TreeProps['onSelect'] = (keys, info) => {
    const selectedKey = keys[0] as string;
    if (!selectedKey) return;

    setSelectedKeys([selectedKey]);

    // Clean up monitor search flow state on any menu click.
    // The monitor listview requestAdaptor will re-set these when a new search is submitted.
    try {
      var prevMonitorFlowId = sessionStorage.getItem('monitor_search_flow_id');
      sessionStorage.removeItem('monitor_search_flow_id');
      console.log('[ApprovalTreeMenu] cleanup monitor_search_flow_id, prev value:', prevMonitorFlowId);
    } catch(e) {}
    try {
      window.postMessage({
        type: 'page.dataProvider.setData',
        data: { monitorSearchFlowId: '' }
      }, '*');
      console.log('[ApprovalTreeMenu] cleanup postMessage monitorSearchFlowId: empty');
    } catch(e) {}

    // 找到对应节点数据
    const itemData = findNodeByKey(navItems, selectedKey);
    if (!itemData) return;

    // 兼容 value（新）、options.to（新备用）和 url（旧）字段
    const rawUrl = itemData.value || itemData.options?.to || itemData.url || '';
    // 跨应用集成时，将 URL 中的 approve_workflow 替换为当前应用 code
    const url = rewriteAppUrl(rawUrl, resolvedAppId);

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

      if (hasFilter) {
        // 对叶子节点（level >= 2），设置 sessionStorage 并广播过滤参数
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

        // 判断是否在同一个根节点（基础列表视图）下切换
        // 使用 stripFilterParams 去掉 additionalFilters/flowId/categoryId 后比较基础路径
        const currentBaseUrl = stripFilterParams(getCurrentUrl());
        const targetBaseUrl = stripFilterParams(url);

        console.debug('[ApprovalTreeMenu] currentBaseUrl:', currentBaseUrl);
        console.debug('[ApprovalTreeMenu] targetBaseUrl:', targetBaseUrl);

        if (currentBaseUrl === targetBaseUrl) {
          // 同一根节点下的叶子切换：走 postMessage + replaceState
          // PageObject 的 dataProvider 监听 'page.dataProvider.setData' 消息，
          // 收到后调用 amis 的 setData 更新最外层 service 的数据域。
          // 这是 amis 内部数据更新，不触发 react-router 重新渲染，
          // PageObject 不重新执行，_reloadKey 不变，CRUD 不 remount，只发一次请求。
          const filterString = `['${filterName}','=','${filterValue}']`;
          console.debug('[ApprovalTreeMenu] same base URL, posting page.dataProvider.setData, additionalFilters:', filterString);
          window.postMessage({
            type: 'page.dataProvider.setData',
            data: {
              additionalFilters: filterString,
              flowId: filterName === 'flow' ? filterValue : '',
              categoryId: filterName === 'category' ? filterValue : '',
            }
          }, '*');

          // 用 replaceState 静默更新浏览器地址栏（不触发 react-router）
          // 这样用户刷新页面或分享链接时能恢复到正确的过滤状态
          window.history.replaceState(null, '', navUrl);
          console.debug('[ApprovalTreeMenu] replaceState done, navUrl:', navUrl);
        } else {
          // 跨根节点切换：objectName 或 listviewId 不同，必须走 navigate
          // 让 react-router 加载新的列表视图（remount 是正确行为）
          console.debug('[ApprovalTreeMenu] different base URL, using navigate');
          const navigate = (window as any).navigate;
          if (navigate) {
            navigate(navUrl);
          } else {
            console.warn('[ApprovalTreeMenu] window.navigate not available, falling back to window.location.href');
            window.location.href = navUrl;
          }
        }
      } else {
        // 根节点：走路由跳转（navigate）。
        // 根节点切换时 URL 的 pathname 和 objectName 可能不同，
        // 需要完整的 react-router 导航。根节点 URL 中 additionalFilters 为空，
        // _reloadKey 中的 additionalFilters 部分不变，不存在 remount 问题。
        switch (navigateMode) {
          case 'location':
            window.location.href = navUrl;
            break;
          case 'router': {
            const navigate = (window as any).navigate;
            if (navigate) {
              console.debug('[ApprovalTreeMenu] root node navigate:', navUrl);
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
    }
  };

  // 展开/折叠
  const handleExpand: TreeProps['onExpand'] = (keys) => {
    setExpandedKeys(keys as string[]);
  };

  return (
    <div
      className={`approval-tree-menu ${className}`}
      style={{
        ...style,
        width: '100%',
        padding: '4px 0',
        overflow: 'visible',
        minHeight: '100%',
      }}
    >
      {showSearch && (
        <div className="approval-tree-menu__search">
          <Input.Search
            placeholder="搜索菜单"
            allowClear
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      )}
      <Spin spinning={loading} size="small">
        <Tree
          className="approval-tree-menu__tree"
          showIcon
          indent={16}
          treeData={filteredTreeData}
          expandedKeys={displayExpandedKeys}
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
          onExpand={searchValue ? undefined : handleExpand}
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
