/**
 * ApprovalTreeMenu - 审批中心左侧树菜单组件
 *
 * 功能说明：
 * - 通过 /api/approve_workflow/workflow/nav 接口动态获取菜单数据并渲染树形菜单
 * - 支持多层树结构（分组、部门、流程/分类、叶子节点）
 * - 支持图标显示（FontAwesome 映射到 antd 图标）
 * - 支持角标数字，颜色支持红色、蓝色、灰色
 * - 支持选中高亮、折叠展开、hover/active 状态
 * - 支持三种路由跳转方式：window.location、SteedosUI.router.go、postMessage
 *
 * @example
 * // 基础用法
 * <ApprovalTreeMenu />
 *
 * @example
 * // 完整用法
 * <ApprovalTreeMenu
 *   selectedKey="pending"
 *   rootUrl="https://your-steedos-instance.com"
 *   navMode="router"
 *   onSelect={(key, data) => console.log('selected:', key, data)}
 * />
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Spin, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/lib/tree';
import {
  AuditOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  HomeOutlined,
  InboxOutlined,
  RightCircleOutlined,
  SendOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './ApprovalTreeMenu.less';

// ─── Type Definitions ──────────────────────────────────────────────

/**
 * 菜单项数据结构（来自 /api/approve_workflow/workflow/nav 接口）
 */
export interface NavItem {
  /** 节点唯一 ID */
  _id: string;
  /** 显示名称 */
  name: string;
  /** FontAwesome 图标名称，如 "fa-inbox"、"fa-file-text" */
  icon?: string;
  /** 角标数量 */
  count?: number;
  /** 角标数量字符串（优先级低于 count） */
  count_str?: string;
  /** 是否默认展开 */
  unfolded?: boolean;
  /** 跳转路径（叶子节点使用） */
  url?: string;
  /** 子节点 */
  children?: NavItem[];
  /** 节点类型 */
  type?: string;
  /** 额外的自定义数据 */
  [key: string]: any;
}

/**
 * ApprovalTreeMenu 组件 Props
 */
export interface ApprovalTreeMenuProps {
  /**
   * 当前选中项的 key（对应 NavItem._id）
   */
  selectedKey?: string;

  /**
   * 选中节点时的回调
   * @param key 节点的 _id
   * @param data 原始节点数据
   */
  onSelect?: (key: string, data: NavItem) => void;

  /**
   * 路由跳转方式
   * - 'window': 使用 window.location.href
   * - 'router': 使用 SteedosUI.router.go（需要 SteedosUI 全局变量）
   * - 'postMessage': 使用 window.postMessage
   * @default 'window'
   */
  navMode?: 'window' | 'router' | 'postMessage';

  /**
   * 自定义 CSS class
   */
  className?: string;

  /**
   * 自定义内联样式
   */
  style?: React.CSSProperties;

  /**
   * 后端接口根 URL，不设置时自动从 Builder.settings 或 localStorage 读取
   */
  rootUrl?: string;

  /**
   * 认证 token，不设置时自动从 Builder.settings 或 localStorage 读取
   */
  authToken?: string;

  /**
   * 租户 ID，不设置时自动从 Builder.settings 或 localStorage 读取
   */
  tenantId?: string;
}

// ─── FontAwesome → antd Icon 映射 ───────────────────────────────────

/**
 * FontAwesome 图标名称到 antd Icon 组件的映射表
 * 支持 "fa-xxx" 和 "fa fa-xxx" 两种格式
 */
const FA_ICON_MAP: Record<string, React.ComponentType<any>> = {
  // 下载
  'fa-download': CloudDownloadOutlined,
  'fa-cloud-download': CloudDownloadOutlined,
  // 草稿/编辑
  'fa-pencil': EditOutlined,
  'fa-edit': EditOutlined,
  'fa-pencil-square-o': EditOutlined,
  // 勾选/确认
  'fa-check': CheckOutlined,
  'fa-check-circle': CheckCircleOutlined,
  'fa-check-circle-o': CheckCircleOutlined,
  // 眼睛/查看
  'fa-eye': EyeOutlined,
  'fa-eye-open': EyeOutlined,
  // 文件
  'fa-file': FileOutlined,
  'fa-file-o': FileOutlined,
  'fa-file-text': FileTextOutlined,
  'fa-file-text-o': FileTextOutlined,
  // 点/圆圈
  'fa-circle': RightCircleOutlined,
  'fa-circle-o': RightCircleOutlined,
  'fa-dot-circle-o': RightCircleOutlined,
  // 收件箱
  'fa-inbox': InboxOutlined,
  // 发送
  'fa-send': SendOutlined,
  'fa-paper-plane': SendOutlined,
  'fa-paper-plane-o': SendOutlined,
  // 审核
  'fa-gavel': AuditOutlined,
  'fa-legal': AuditOutlined,
  // 时钟
  'fa-clock-o': ClockCircleOutlined,
  'fa-clock': ClockCircleOutlined,
  // 关闭/撤回
  'fa-times-circle': CloseCircleOutlined,
  'fa-times-circle-o': CloseCircleOutlined,
  'fa-ban': CloseCircleOutlined,
  // 文件夹
  'fa-folder': FolderOutlined,
  'fa-folder-o': FolderOutlined,
  'fa-folder-open': FolderOpenOutlined,
  'fa-folder-open-o': FolderOpenOutlined,
  // 用户/组织
  'fa-user': UserOutlined,
  'fa-users': TeamOutlined,
  'fa-group': TeamOutlined,
  'fa-building': BankOutlined,
  'fa-building-o': BankOutlined,
  // 主页
  'fa-home': HomeOutlined,
  // 星标
  'fa-star': StarOutlined,
  'fa-star-o': StarOutlined,
};

/**
 * 根据 FontAwesome 图标名称获取对应的 antd Icon 组件
 */
function getAntdIcon(iconName?: string): React.ComponentType<any> | null {
  if (!iconName) return null;
  // 支持 "fa fa-xxx" 格式，提取 "fa-xxx" 部分
  const normalized = iconName
    .trim()
    .replace(/^fa\s+/, '')
    .toLowerCase();
  return FA_ICON_MAP[normalized] || FileOutlined;
}

// ─── Auth Helper ──────────────────────────────────────────────────

/**
 * 从 Builder.settings 或 localStorage 获取认证信息
 */
function getBuilderContext(): Record<string, any> {
  try {
    if (typeof window === 'undefined') return {};
    const b = (window as any).Builder;
    if (!b) return {};
    return b.settings?.context ? b.settings.context : b.settings || {};
  } catch {
    return {};
  }
}

function resolveRootUrl(propRootUrl?: string): string {
  if (propRootUrl) return propRootUrl;
  const ctx = getBuilderContext();
  if (ctx.rootUrl) return ctx.rootUrl;
  try {
    return window.localStorage.getItem('steedos:rootUrl') || '';
  } catch {
    return '';
  }
}

function resolveAuthorization(
  propAuthToken?: string,
  propTenantId?: string,
): string | null {
  const ctx = getBuilderContext();
  const tenantId = propTenantId || ctx.tenantId;
  const authToken =
    propAuthToken ||
    ctx.authToken ||
    (() => {
      try {
        return window.localStorage.getItem('steedos:token');
      } catch {
        return null;
      }
    })();
  if (!tenantId || !authToken) return null;
  // Steedos 自定义 Bearer token 格式：Bearer <tenantId>,<authToken>
  // 这是 Steedos 平台的标准认证格式，后端校验时会拆分 tenantId 和 authToken
  return `Bearer ${tenantId},${authToken}`;
}

// ─── Badge Color Rules ───────────────────────────────────────────

/**
 * 根据节点数据判断角标颜色
 * - 红色：待办/待审批（紧急）
 * - 蓝色：一般提醒（已阅/抄送）
 * - 灰色：草稿/已完成等中性状态
 */
function getBadgeColor(item: NavItem): string | undefined {
  const id = (item._id || '').toLowerCase();
  const type = (item.type || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  // 红色：待审批、待办
  if (
    id.includes('pending') ||
    id.includes('todo') ||
    id.includes('inbox') ||
    type === 'pending' ||
    name.includes('待审') ||
    name.includes('待办')
  ) {
    return '#ff4d4f';
  }

  // 灰色：草稿、已完成、已归档
  if (
    id.includes('draft') ||
    id.includes('done') ||
    id.includes('archive') ||
    id.includes('complete') ||
    type === 'draft' ||
    name.includes('草稿') ||
    name.includes('已完成') ||
    name.includes('归档')
  ) {
    return '#8c8c8c';
  }

  // 蓝色：默认（已阅、抄送等）
  return '#1890ff';
}

// ─── Tree Node Builder ───────────────────────────────────────────

/**
 * 将 NavItem 转换为 antd Tree 的 DataNode
 */
function buildTreeNode(item: NavItem): DataNode & { rawData: NavItem } {
  const IconComponent = getAntdIcon(item.icon);
  // 优先使用 count，其次使用 count_str 转换为数字
  const badgeCount = item.count ?? (item.count_str ? parseInt(item.count_str, 10) || 0 : 0);
  const badgeColor = getBadgeColor(item);

  const titleNode = (
    <span className="approval-tree-menu__item-title">
      {IconComponent && (
        <IconComponent className="approval-tree-menu__item-icon" />
      )}
      <span className="approval-tree-menu__item-label">{item.name}</span>
      {badgeCount > 0 && (
        <Badge
          count={badgeCount}
          overflowCount={999}
          style={{
            backgroundColor: badgeColor,
            marginLeft: 6,
            fontSize: 11,
          }}
        />
      )}
    </span>
  );

  const children =
    item.children && item.children.length > 0
      ? item.children.map(buildTreeNode)
      : undefined;

  return {
    key: item._id,
    title: titleNode,
    isLeaf: !children || children.length === 0,
    children,
    rawData: item,
  };
}

/**
 * 从树形数据中提取所有默认展开的节点 key
 */
function collectExpandedKeys(items: NavItem[]): string[] {
  const keys: string[] = [];
  items.forEach((item) => {
    if (item.unfolded && item.children && item.children.length > 0) {
      keys.push(item._id);
      keys.push(...collectExpandedKeys(item.children));
    }
  });
  return keys;
}

/**
 * 根据 key 从树形数据中查找节点
 */
function findNodeByKey(items: NavItem[], key: string): NavItem | null {
  for (const item of items) {
    if (item._id === key) return item;
    if (item.children) {
      const found = findNodeByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

// ─── Navigation Helpers ──────────────────────────────────────────

/**
 * 执行页面跳转
 * @param url 目标 URL
 * @param mode 跳转方式
 */
function navigate(url: string, mode: ApprovalTreeMenuProps['navMode']): void {
  if (!url) return;

  switch (mode) {
    case 'router':
      // 使用 SteedosUI.router.go 跳转（需全局 SteedosUI 对象）
      try {
        (window as any).SteedosUI?.router?.go(url);
      } catch {
        window.location.href = url;
      }
      break;
    case 'postMessage':
      // 通过 postMessage 通知父框架跳转
      window.postMessage(
        { type: 'APPROVAL_NAV', url },
        window.location.origin,
      );
      break;
    case 'window':
    default:
      window.location.href = url;
      break;
  }
}

// ─── Main Component ──────────────────────────────────────────────

/**
 * ApprovalTreeMenu - 审批中心左侧树菜单组件
 *
 * @example
 * <ApprovalTreeMenu
 *   selectedKey="pending"
 *   onSelect={(key, data) => console.log(key, data)}
 *   navMode="window"
 * />
 */
export const ApprovalTreeMenu: React.FC<ApprovalTreeMenuProps> = ({
  selectedKey: externalSelectedKey,
  onSelect,
  navMode = 'window',
  className = '',
  style,
  rootUrl: propRootUrl,
  authToken: propAuthToken,
  tenantId: propTenantId,
}) => {
  const [treeData, setTreeData] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(
    externalSelectedKey ? [externalSelectedKey] : [],
  );

  // 同步外部 selectedKey
  useEffect(() => {
    if (externalSelectedKey !== undefined) {
      setSelectedKeys([externalSelectedKey]);
    }
  }, [externalSelectedKey]);

  // 获取菜单数据
  useEffect(() => {
    const fetchNavData = async () => {
      setLoading(true);
      setError(null);
      try {
        const rootUrl = resolveRootUrl(propRootUrl);
        const authorization = resolveAuthorization(propAuthToken, propTenantId);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (authorization) {
          headers['Authorization'] = authorization;
        }

        const res = await fetch(
          `${rootUrl}/api/approve_workflow/workflow/nav`,
          { headers, credentials: 'include' },
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        // 接口可能返回 { data: [...] } 或直接返回数组
        let items: NavItem[];
        if (Array.isArray(json)) {
          items = json;
        } else if (Array.isArray(json.data)) {
          items = json.data;
        } else if (Array.isArray(json.items)) {
          items = json.items;
        } else {
          console.warn('[ApprovalTreeMenu] Unexpected API response structure:', json);
          items = [];
        }

        setTreeData(items);

        // 根据 unfolded 字段设置默认展开节点
        const defaultExpanded = collectExpandedKeys(items);
        setExpandedKeys(defaultExpanded);
      } catch (err: any) {
        console.error('[ApprovalTreeMenu] Failed to fetch nav data:', err);
        setError(err?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchNavData();
  }, [propRootUrl, propAuthToken, propTenantId]);

  // 构建 antd Tree 节点数据
  const antdTreeData = useMemo(
    () => treeData.map(buildTreeNode),
    [treeData],
  );

  // 处理节点选中
  const handleSelect: TreeProps['onSelect'] = useCallback(
    (keys, info) => {
      const key = keys[0] as string;
      if (!key) return;

      setSelectedKeys(keys);

      const rawData = findNodeByKey(treeData, key);

      if (onSelect && rawData) {
        onSelect(key, rawData);
      }

      // 叶子节点触发路由跳转
      if (info.node.isLeaf && rawData?.url) {
        navigate(rawData.url, navMode);
      }
    },
    [treeData, onSelect, navMode],
  );

  // 处理展开/折叠
  const handleExpand: TreeProps['onExpand'] = useCallback((keys) => {
    setExpandedKeys(keys);
  }, []);

  return (
    <div
      className={`approval-tree-menu ${className}`.trim()}
      style={style}
    >
      {loading && (
        <div className="approval-tree-menu__loading">
          <Spin size="small" />
        </div>
      )}
      {error && (
        <div className="approval-tree-menu__error">{error}</div>
      )}
      {!loading && !error && (
        <Tree
          className="approval-tree-menu__tree"
          treeData={antdTreeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={handleSelect}
          onExpand={handleExpand}
          blockNode
          showIcon={false}
        />
      )}
    </div>
  );
};

export default ApprovalTreeMenu;
