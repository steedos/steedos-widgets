import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, Tree, Input, Spin, Empty, Space, Button, Tag, Avatar, Drawer, Badge } from 'antd';
import { SearchOutlined, UserOutlined, CloseOutlined, CheckOutlined, PlusOutlined, ApartmentOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';
import { MobileDrawerContent } from './MobileDrawerContent';

// 分批渲染 Hook（IntersectionObserver，零依赖）
function useInfiniteScroll(totalCount: number, batchSize: number = 50, deps: any[] = []) {
  const [visibleCount, setVisibleCount] = React.useState(batchSize);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  // 关键修复：deps 增加 totalCount，确保 users 变化时重置 visibleCount
  React.useEffect(() => { setVisibleCount(batchSize); }, [...deps, totalCount]);
  React.useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!sentinelRef.current || visibleCount >= totalCount) return;
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisibleCount(prev => Math.min(prev + batchSize, totalCount)); },
      { threshold: 0.1 }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [totalCount, batchSize, visibleCount]);
  return { visibleCount, sentinelRef };
}

// 移动端检测 Hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

interface DataNode {
  title: string;
  value: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

// 移动端获取直属成员（不递归子部门）
async function defaultFetchDirectUsers(organizationId: string): Promise<any[]> {
  const filters = [
    [["user_accepted", "=", true]],
    "and",
    [["organization", "=", organizationId]]
  ];
  const query = `{rows:space_users(filters: [${filters.map(f => typeof f === 'string' ? `"${f}"` : JSON.stringify(f)).join(',')}], top: 1000, skip: 0, sort: "sort_no desc,name asc"){_id,user,space,name,mobile,email,position,sort_no,username,avatar,organization,_display:_ui{sort_no,organization}}}`;
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return (data.data?.rows || []).map((user: any) => ({
    _id: user._id, user: user.user, name: user.name, email: user.email,
    mobile: user.mobile, position: user.position, username: user.username,
    avatar: user.avatar, organization: user.organization
  }));
}

// 默认用户数据获取方法
async function defaultFetchUsers(organizationId?: string, keyword?: string): Promise<any[]> {
  if (!organizationId && !keyword) {
    // 返回空列表，用户需要先选择部门
    return [];
  }

  let filters = [];
  
  // 用户已接受条件
  filters.push([['user_accepted', '=', true]]);
  filters.push('and');
  
  if (keyword) {
    // 按姓名、邮箱或用户名全局搜索
    filters.push([[['name', 'contains', keyword], 'or', ['email', 'contains', keyword]], 'or', ['username', 'contains', keyword]]);
  } else if (organizationId) {
    // 按部门浏览（与关键字搜索互斥）
    filters.push([['organizations_parents', 'in', [organizationId]]]);
  }

  const query = `{rows:space_users(filters: [${filters.map(f => typeof f === 'string' ? `"${f}"` : JSON.stringify(f)).join(',')}], top: 1000, skip: 0, sort: "sort_no desc,name asc"){_id,user,space,name,mobile,email,position,sort_no,username,avatar,organization,_display:_ui{sort_no,organization}},count:space_users__count(filters:[${filters.map(f => typeof f === 'string' ? `"${f}"` : JSON.stringify(f)).join(',')}])}`;
  
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  const data = await res.json();
  return (data.data?.rows || []).map((user: any) => ({
    _id: user._id,
    user: user.user,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    position: user.position,
    username: user.username,
    avatar: user.avatar,
    organization: user.organization
  }));
}

// 获取部门树
async function defaultFetchDeptTree(parentId?: string, keyword?: string): Promise<any[]> {
  if (keyword) {
    // 服务端检索部门
    const query = `{rows:organizations(filters: [["name","contains","${keyword}"]], top: 1000, skip: 0, sort: "sort_no desc"){_id,space,name,fullname,sort_no,parent,children}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const rows = data.data?.rows || [];
    return rows.map(org => ({
      title: org.fullname || org.name,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined
    }));
  } else if (!parentId) {
    // 获取第一层
    const res = await fetch('/service/api/organizations/root');
    const data = await res.json();
    const rows = data.data?.rows || data.rows || [];
    return rows.map(org => ({
      title: org.name,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined
    }));
  } else {
    // 获取子层
    const query = `{rows:organizations(filters: [["parent","=","${parentId}"]], top: 5000, skip: 0, sort: "sort_no desc"){_id,space,name,sort_no,parent,children}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const rows = data.data?.rows || [];
    return rows.map(org => ({
      title: org.name,
      value: String(org._id),
      key: String(org._id),
      // 修复：如果有children数组且长度大于0，则不是叶子节点
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      // 修复：确保children初始化为undefined，触发懒加载
      children: undefined
    }));
  }
}

interface UserSelectorProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  fetchUsers?: (organizationId?: string, keyword?: string) => Promise<any[]>;
  fetchDeptTree?: (parentId?: string, keyword?: string) => Promise<any[]>;
  style?: React.CSSProperties;
  dispatchEvent?: (eventName: string, data: any, ref: any) => Promise<void>;
  data?: any;
  clearable?: boolean;
  [key: string]: any;
}

export const SteedosUserSelector: React.FC<UserSelectorProps> = (props) => {
  const {
    value,
    onChange,
    multiple = false,
    placeholder = '请选择人员',
    fetchUsers = defaultFetchUsers,
    fetchDeptTree = defaultFetchDeptTree,
    style,
    dispatchEvent,
    data,
    clearable = true
  } = props;

  // console.log('SteedosUserSelector. props', props)
  const [visible, setVisible] = useState(false);
  const [deptTree, setDeptTree] = useState<DataNode[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInputValue, setSearchInputValue] = useState(''); // 搜索框即时值（解耦输入与防抖查询）
  const [deptSearchKeyword, setDeptSearchKeyword] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [inputHovered, setInputHovered] = useState(false);
  const [treeKey, setTreeKey] = useState(0); // 增加 treeKey 状态
  const [singleSelectHighlightId, setSingleSelectHighlightId] = useState<string | null>(null); // 单选高亮反馈
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const deptSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastDragTimeRef = useRef<number>(0);
  const ref = useRef<any>();

  // 移动端状态
  const isMobile = useIsMobile();
  const [mobileActiveTab, setMobileActiveTab] = useState<'dept' | 'users' | 'selected'>('dept');
  const [selectedDeptName, setSelectedDeptName] = useState<string>('');
  // 移动端钻入式导航状态
  const [deptPath, setDeptPath] = useState<Array<{id: string, name: string}>>([]);
  const [currentLevelDepts, setCurrentLevelDepts] = useState<any[]>([]);
  const [showSelectedPanel, setShowSelectedPanel] = useState(false);
  const [rootDeptInfo, setRootDeptInfo] = useState<{ id: string; name: string } | null>(null);

  // PC端分批渲染
  const { visibleCount: pcVisibleCount, sentinelRef: pcSentinelRef } = useInfiniteScroll(users.length, 50, [selectedDept, searchKeyword]);

  // 确保 ref.current.props 等于传入的完整 props
  ref.current = { props };

  // 初始化已选择的用户
  useEffect(() => {
    const initValue = Array.isArray(value) ? value.map(String) : (value ? [String(value)] : []);
    if (initValue.length > 0) {
      // 从GraphQL获取用户完整信息
      const userIds = initValue.map(id => `"${id}"`).join(',');
      // 修复：按user字段(用户ID)查询，而不是space_user的_id
      const query = `{rows:space_users(filters: [["user","in",[${userIds}]]], top: 1000){_id,user,name,email,mobile,position,username,avatar,organization}}`;
      
      fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      .then(res => res.json())
      .then(data => {
        let users = (data.data?.rows || []).map((user: any) => ({
          _id: user._id,
          name: user.name,
          user: user.user,
          email: user.email,
          mobile: user.mobile,
          position: user.position,
          username: user.username,
          avatar: user.avatar,
          organization: user.organization
        }));
        // 按initValue的顺序排序users
        // 修复：按user字段匹配
        users = initValue.map(id => users.find((u: any) => u.user === id)).filter((u: any) => !!u);
        setSelectedUsers(users);
      });
    } else {
      setSelectedUsers([]);
    }
  }, [value]);

  // 组件卸载时清理防抖定时器，避免 setState on unmounted component
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (deptSearchTimeoutRef.current) clearTimeout(deptSearchTimeoutRef.current);
    };
  }, []);

  // 加载部门树
  useEffect(() => {
    if (visible) {
      setLoading(true);
      // 关键修复：visible变化时强制刷新treeKey，重置全部状态
      setTreeKey(k => k + 1);
      setSelectedDeptName('');
      setDeptTree([]);
      setExpandedKeys([]);
      setSelectedDept(null);
      setDeptSearchKeyword('');
      setSearchKeyword('');
      setSearchInputValue(''); // 同步清空搜索输入框
      
      let mobileUserLoading = false;
      fetchDeptTree()
        .then(data => {
          const rootNodes = data as DataNode[];
          setDeptTree(rootNodes);
          // 默认展开第一层
          const firstLevelKeys = rootNodes.map(item => item.key);
          setExpandedKeys(firstLevelKeys);
          // 默认选中第一个根节点
          if (firstLevelKeys.length > 0) {
            // 移动端默认进入人员Tab，需要同步显示部门名称
            if (isMobile && rootNodes[0]) {
              setSelectedDeptName(String(rootNodes[0].title || ''));
              // 移动端：记录根部门信息，初始页面显示全部人员（递归）+ 通讯录入口
              const rootId = String(rootNodes[0].key);
              const rootName = String(rootNodes[0].title || '');
              setRootDeptInfo({ id: rootId, name: rootName });
              setDeptPath([]); // 初始页面，不自动钻入
              setSelectedDept(rootId);
              // 加载全部人员（递归，与PC端一致）
              // 标记移动端用户加载中，外层 finally 不关闭 loading
              mobileUserLoading = true;
              fetchUsers(rootId).then(allUsers => {
                setUsers(allUsers);
              }).catch(() => {
                setUsers([]);
              }).finally(() => {
                setLoading(false);
              });
            } else {
              setSelectedDept(String(firstLevelKeys[0]));
            }
          }
          // 关键修复：手动加载已展开根节点的子节点数据
          // Ant Design Tree 对程序化设置的 expandedKeys 不会自动触发 loadData，
          // 这导致第二次打开弹窗时根节点展开但看不到子节点。
          rootNodes.forEach(node => {
            if (!node.isLeaf) {
              fetchDeptTree(String(node.key)).then(children => {
                setDeptTree(prev => {
                  // 内联 updateTreeData 逻辑，避免闭包依赖问题
                  const update = (list: DataNode[], key: React.Key, ch: DataNode[]): DataNode[] =>
                    list.map(n => {
                      if (n.key === key) return { ...n, children: ch };
                      if (n.children) return { ...n, children: update(n.children, key, ch) };
                      return n;
                    });
                  return update(prev, node.key, children as DataNode[]);
                });
              });
            }
          });
        })
        .finally(() => {
          // 移动端用户列表正在单独加载时，不在这里关闭 loading
          if (!mobileUserLoading) setLoading(false);
        });
    }
  }, [visible, fetchDeptTree]);

  // 加载选中部门的用户（移动端钻入式导航由 handleDrillDown/handleDrillBack 单独处理直属成员）
  useEffect(() => {
    if (isMobile) return; // 移动端跳过，由钻入逻辑直接管理用户加载
    if (selectedDept || searchKeyword) {
      setLoading(true);
      fetchUsers(selectedDept || undefined, searchKeyword || undefined)
        .then(data => setUsers(data))
        .finally(() => setLoading(false));
    } else {
      setUsers([]);
    }
  }, [selectedDept, searchKeyword, fetchUsers, isMobile]);

  // 递归更新树节点
  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map(node => {
      if (node.key === key) {
        // 关键修复：不要覆盖原有属性，只更新children
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });

  // 懒加载子节点
  const onLoadData: TreeProps['loadData'] = async ({ key, children }) => {
    // 如果已经有子节点，不需要重复加载
    if (children && children.length > 0) return;
    
    const childNodes = await fetchDeptTree(String(key));
    setDeptTree(origin => updateTreeData(origin, key, childNodes as DataNode[]));
  };

  // 选择部门
  const onSelectDept: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      setSelectedDept(String(selectedKeys[0]));
      setSearchKeyword(''); // 互斥规则：切换部门时清空搜索关键字
      setSearchInputValue(''); // 同步清空搜索输入框
      // 移动端：记住部门名称，自动跳转到人员Tab
      if (isMobile && info?.node) {
        setSelectedDeptName(String((info.node as any).title || ''));
        setMobileActiveTab('users');
      }
    } else if (deptTree.length > 0) {
      // 没有任何选中时，默认选中第一个根节点
      setSelectedDept(String(deptTree[0].key));
    }
  };

  // 处理部门搜索
  const handleDeptSearch = (searchValue: string) => {
    if (deptSearchTimeoutRef.current) {
      clearTimeout(deptSearchTimeoutRef.current);
    }
    
    setDeptSearchKeyword(searchValue);
    
    if (!searchValue) {
      // 清空搜索，恢复初始树
      setLoading(true);
      fetchDeptTree() // 获取根节点
        .then(data => {
          // 这里重置为初始状态，确保根节点的children是undefined，这样展开时才会触发懒加载
          const initialData = data.map((item: any) => ({
            ...item,
            children: undefined, // 强制重置children
          }));
          setDeptTree(initialData);
          setTreeKey(k => k + 1); // 强制重置Tree组件状态
          // 重新展开第一层
          const firstLevelKeys = (initialData as DataNode[]).map(item => item.key);
          setExpandedKeys(firstLevelKeys);
          // 默认选中第一个根节点
          if (firstLevelKeys.length > 0) {
            setSelectedDept(String(firstLevelKeys[0]));
          }
        })
        .finally(() => setLoading(false));
      return;
    }

    deptSearchTimeoutRef.current = setTimeout(() => {
      setLoading(true);
      fetchDeptTree(undefined, searchValue)
        .then(data => setDeptTree(data as DataNode[]))
        .finally(() => setLoading(false));
    }, 300);
  };

  // 处理用户搜索
  const handleSearch = (searchValue: string) => {
    setSearchInputValue(searchValue); // 立即更新输入框显示
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchKeyword(searchValue);
      if (searchValue) {
        setSelectedDept(null);      // 互斥规则：输入关键字时清空部门选中
        setSelectedDeptName('');    // 同步清空移动端顶部部门状态栏
        if (isMobile) {
          // 移动端手动触发搜索（useEffect 已跳过移动端）
          setLoading(true);
          fetchUsers(undefined, searchValue)
            .then(data => setUsers(data))
            .finally(() => setLoading(false));
        }
      } else if (isMobile) {
        // 移动端：清空搜索后完全回到初始页面（与首次打开一致）
        if (rootDeptInfo) {
          setDeptPath([]);
          setCurrentLevelDepts([]);
          setSelectedDept(rootDeptInfo.id);
          setLoading(true);
          fetchUsers(rootDeptInfo.id).then(allUsers => {
            setUsers(allUsers);
          }).catch(() => {
            setUsers([]);
          }).finally(() => setLoading(false));
        }
      } else if (deptTree.length > 0) {
        // PC端：清空关键字时恢复默认选中第一个根节点
        setSelectedDept(String(deptTree[0].key));
      }
    }, 300);
  };

  // 添加用户到已选
  const handleAddUser = (user: any) => {
    if (multiple) {
      if (!tempSelectedUsers.find(u => u._id === user._id)) {
        const newSelected = [...tempSelectedUsers, user];
        setTempSelectedUsers(newSelected);
      }
    } else {
      setTempSelectedUsers([user]);
      // 单选：点击即确认（PC 300ms 高亮反馈后关闭，移动端立即关闭）
      if (isMobile) {
        setTimeout(() => { handleOkWithUsers([user]); }, 0);
      } else {
        setSingleSelectHighlightId(user._id);
        setTimeout(() => {
          setSingleSelectHighlightId(null);
          handleOkWithUsers([user]);
        }, 300);
      }
    }
  };

  // 从已选中移除用户
  const handleRemoveUser = (userId: string) => {
    setTempSelectedUsers(tempSelectedUsers.filter(u => u._id !== userId));
  };

  // 拖拽开始
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // 拖拽经过
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;

    // 添加节流，避免频繁触发重排
    const now = Date.now();
    if (now - lastDragTimeRef.current < 100) return;
    lastDragTimeRef.current = now;

    const newList = [...tempSelectedUsers];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItem);
    
    setTempSelectedUsers(newList);
    setDraggedIndex(index);
  };

  // 全选/取消全选
  const handleToggleSelectAll = () => {
    const isAllSelected = users.length > 0 && users.every(u => tempSelectedUsers.find(s => s._id === u._id));
    if (isAllSelected) {
      // 取消全选：移除列表中的所有用户
      const visibleIds = new Set(users.map(u => u._id));
      setTempSelectedUsers(tempSelectedUsers.filter(u => !visibleIds.has(u._id)));
    } else {
      // 全选：添加列表中未选中的用户
      const newSelected = [...tempSelectedUsers];
      users.forEach(u => {
        if (!newSelected.find(s => s._id === u._id)) {
          newSelected.push(u);
        }
      });
      setTempSelectedUsers(newSelected);
    }
  };

  // 打开弹窗
  const handleOpen = () => {
    setVisible(true);
    setTempSelectedUsers([...selectedUsers]);
    // 移动端：重置状态
    if (isMobile) {
      setMobileActiveTab('users');
      setSelectedDeptName('');
      setShowSelectedPanel(false);
      setDeptPath([]);
      setCurrentLevelDepts([]);
      setRootDeptInfo(null);
    }
  };

  // 确认选择（支持传入指定用户列表，用于移动端单选自动确认）
  const handleOkWithUsers = async (userList: any[]) => {
    setSelectedUsers(userList);
    if (onChange || dispatchEvent) {
      const values = userList.map(u => u.user);
      const outputValue = multiple ? values : (values[0] || '');
      
      if (dispatchEvent) {
        await dispatchEvent('change', { value: outputValue }, ref.current);
      }
      
      if (onChange) {
        onChange(outputValue);
      }
    }
    setVisible(false);
  };

  // 确认选择
  const handleOk = async () => {
    await handleOkWithUsers(tempSelectedUsers);
  };

  // 取消选择
  const handleCancel = () => {
    setTempSelectedUsers([...selectedUsers]);
    setVisible(false);
  };

  // 移动端：钻入子部门
  const handleDrillDown = useCallback(async (deptId: string, deptName: string) => {
    setDeptPath(prev => [...prev, { id: deptId, name: deptName }]);
    setSelectedDept(deptId);
    setSearchKeyword('');
    setSearchInputValue('');
    setLoading(true);
    try {
      // 并行加载：子部门 + 直属成员（不递归）
      const [children, directUsers] = await Promise.all([
        fetchDeptTree(deptId),
        defaultFetchDirectUsers(deptId)
      ]);
      setCurrentLevelDepts(children);
      setUsers(directUsers);
    } catch {
      setCurrentLevelDepts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDeptTree]);

  // 移动端：面包屑返回
  const handleDrillBack = useCallback(async (targetIndex: number) => {
    if (targetIndex < 0) return;
    const newPath = deptPath.slice(0, targetIndex + 1);
    setDeptPath(newPath);
    const targetDept = newPath[newPath.length - 1];
    setSelectedDept(targetDept.id);
    setSearchKeyword('');
    setSearchInputValue('');
    setLoading(true);
    try {
      const [children, directUsers] = await Promise.all([
        fetchDeptTree(targetDept.id),
        defaultFetchDirectUsers(targetDept.id)
      ]);
      setCurrentLevelDepts(children);
      setUsers(directUsers);
    } catch {
      setCurrentLevelDepts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [deptPath, fetchDeptTree]);

  // 移动端：返回到初始页面（通讯录入口 + 全部人员递归列表）
  const handleBackToRoot = useCallback(async () => {
    if (!rootDeptInfo) return;
    setDeptPath([]);
    setSelectedDept(rootDeptInfo.id);
    setSearchKeyword('');
    setSearchInputValue('');
    setCurrentLevelDepts([]);
    setLoading(true);
    try {
      const allUsers = await fetchUsers(rootDeptInfo.id);
      setUsers(allUsers);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [rootDeptInfo, fetchUsers]);

  // 移动端：返回上一级（企业微信风格，左上角返回按钮）
  const handleMobileBack = useCallback(async () => {
    if (deptPath.length <= 0) return;
    if (deptPath.length === 1) {
      // 在根部门级别，返回初始页面
      await handleBackToRoot();
    } else {
      // 返回上一级部门
      const newPath = deptPath.slice(0, -1);
      setDeptPath(newPath);
      const targetDept = newPath[newPath.length - 1];
      setSelectedDept(targetDept.id);
      setSearchKeyword('');
      setSearchInputValue('');
      setLoading(true);
      try {
        const [children, directUsers] = await Promise.all([
          fetchDeptTree(targetDept.id),
          defaultFetchDirectUsers(targetDept.id)
        ]);
        setCurrentLevelDepts(children);
        setUsers(directUsers);
      } catch {
        setCurrentLevelDepts([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
  }, [deptPath, handleBackToRoot, fetchDeptTree]);

  // 移动端：拖拽排序已选用户
  const handleReorderUsers = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= tempSelectedUsers.length || toIndex >= tempSelectedUsers.length) return;
    const newList = [...tempSelectedUsers];
    const [moved] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, moved);
    setTempSelectedUsers(newList);
  }, [tempSelectedUsers]);

  // 移动端：切换用户选中/取消（用于人员列表点击已选用户时）
  const handleToggleUser = useCallback((user: any) => {
    const isSelected = tempSelectedUsers.find(u => u._id === user._id);
    if (isSelected) {
      handleRemoveUser(user._id);
    } else {
      handleAddUser(user);
    }
  }, [tempSelectedUsers, multiple]);

  // ====== 渲染部分 ======

  // 移动端：是否显示清除按钮（移动端常驻显示，PC端hover显示）
  const showClearButton = clearable && selectedUsers.length > 0 && (isMobile || inputHovered);

  return (
    <div style={{ ...style }} className='steedos-user-selector'>
      <Input
        readOnly
        placeholder={placeholder}
        value={selectedUsers.map(u => u.name).join(', ')}
        onClick={handleOpen}
        onMouseEnter={() => !isMobile && setInputHovered(true)}
        onMouseLeave={() => !isMobile && setInputHovered(false)}
        style={{ minWidth: 150, cursor: 'pointer' }}
        suffix={
          showClearButton ? (
            <CloseOutlined
              style={{ color: '#ff4d4f', cursor: 'pointer', padding: isMobile ? 4 : 0 }}
              onMouseEnter={() => !isMobile && setInputHovered(true)}
              onMouseLeave={() => !isMobile && setInputHovered(false)}
              onClick={async (e) => {
                e.stopPropagation();
                setSelectedUsers([]);
                const outputValue = multiple ? [] : '';
                
                if (dispatchEvent) {
                  await dispatchEvent('change', { value: outputValue }, ref.current);
                }
                
                if (onChange) onChange(outputValue);
                setInputHovered(false);
              }}
            />
          ) : (
            <UserOutlined 
              style={{ color: '#999' }} 
              onMouseEnter={() => !isMobile && selectedUsers.length > 0 && setInputHovered(true)}
              onMouseLeave={() => !isMobile && setInputHovered(false)}
            />
          )
        }
      />

      {/* ====== PC端：单选两栏 / 多选三栏 ====== */}
      {!isMobile && <Modal
        title={multiple ? "选择人员 (多选)" : "选择人员"}
        open={visible}
        onOk={multiple ? handleOk : undefined}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        footer={multiple ? undefined : null}
        width={1200}
        destroyOnClose
        bodyStyle={{ height: 600, overflow: 'hidden', padding: 0 }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* 左侧：组织树 */}
          <div style={{ width: 240, borderRight: '1px solid #f0f0f0', padding: 16, display: 'flex', flexDirection: 'column' }}>
            <Input
              placeholder="搜索部门"
              prefix={<SearchOutlined />}
              value={deptSearchKeyword}
              onChange={(e) => handleDeptSearch(e.target.value)}
              allowClear
              style={{ marginBottom: 12 }}
              size="small"
            />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Spin spinning={loading && !selectedDept && !searchKeyword}>
                <Tree
                  key={treeKey}
                  treeData={deptTree}
                  onSelect={onSelectDept}
                  loadData={deptSearchKeyword ? undefined : onLoadData}
                  showLine
                  selectedKeys={selectedDept ? [selectedDept] : []}
                  expandedKeys={expandedKeys}
                  onExpand={setExpandedKeys}
                />
              </Spin>
            </div>
          </div>

          {/* 中间：人员列表 */}
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <style>
              {`
                .steedos-user-selector-item:hover {
                  background-color: #f0f7ff !important;
                  border-color: #1890ff !important;
                }
              `}
            </style>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Input
                placeholder="搜索姓名、邮箱或用户名"
                prefix={<SearchOutlined />}
                value={searchInputValue}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                style={{ flex: 1 }}
              />
              {multiple && users.length > 0 && (
                <Button onClick={handleToggleSelectAll}>
                  {users.every(u => tempSelectedUsers.find(s => s._id === u._id)) ? '取消' : '全选'}
                </Button>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 4, position: 'relative' }}>
              <Spin spinning={loading}>
                {users.length > 0 ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '4px', padding: '0 8px' }}>
                      {users.slice(0, pcVisibleCount).map((user: any) => {
                        const isSelected = !!tempSelectedUsers.find(u => u._id === user._id);
                        return (
                          <div
                            key={user._id}
                            className={!isSelected || !multiple ? "steedos-user-selector-item" : ""}
                            onClick={() => {
                              if (multiple) {
                                if (!isSelected) handleAddUser(user);
                              } else {
                                handleAddUser(user); // 单选：允许替换已选
                              }
                            }}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              backgroundColor: singleSelectHighlightId === user._id ? '#e6f7ff' : (isSelected && multiple ? '#f5f5f5' : 'transparent'),
                              borderColor: singleSelectHighlightId === user._id ? '#1890ff' : (isSelected && multiple ? '#1890ff' : 'transparent'),
                              borderWidth: 1,
                              borderStyle: 'solid',
                              transition: 'all 0.2s',
                              opacity: isSelected && multiple ? 0.6 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              minWidth: 0
                            }}
                          >
                            <Avatar
                              src={user.avatar ? `/api/v6/users/${user.user}/avatar` : user.avatar}
                              size={40}
                              style={{ backgroundColor: user.avatar ? undefined : '#1890ff', flexShrink: 0 }}
                            >
                              {!user.avatar && user.name?.charAt(0)}
                            </Avatar>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                              <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.organization?.name && <span>{user.organization.name}</span>}
                                {user.position && <span> · {user.position}</span>}
                              </div>
                              <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email || user.mobile || user.username}
                              </div>
                            </div>
                            {isSelected && <CheckOutlined style={{ color: '#1890ff', flexShrink: 0 }} />}
                          </div>
                        );
                      })}
                    </div>
                    {pcVisibleCount < users.length && (
                      <div ref={pcSentinelRef} style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 13, marginTop: 8 }}>
                        滚动加载更多...
                      </div>
                    )}
                  </>
                ) : (selectedDept || searchKeyword) && !loading ? (
                  <Empty description="暂无人员" style={{ marginTop: 60 }} />
                ) : !loading ? (
                  <Empty description="请选择部门或搜索" style={{ marginTop: 60 }} />
                ) : null}
              </Spin>
            </div>
          </div>

          {/* 右侧：已选中 */}
          <div style={{ width: 240, borderLeft: '1px solid #f0f0f0', padding: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 12, fontSize: 14 }}>
              <span style={{ fontWeight: 500 }}>已选中</span>
              <span style={{ marginLeft: 8, color: '#999' }}>({tempSelectedUsers.length})</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {tempSelectedUsers.length > 0 ? (
                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                  {tempSelectedUsers.map((user, index) => (
                    <div
                      key={user._id}
                      draggable={multiple}
                      onDragStart={() => handleDragStart(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onMouseEnter={() => setHoveredUserId(user._id)}
                      onMouseLeave={() => setHoveredUserId(null)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        backgroundColor: draggedIndex === index ? '#e6f7ff' : '#f5f5f5',
                        borderRadius: 4,
                        position: 'relative',
                        cursor: multiple ? 'grab' : 'default',
                        transition: 'all 0.3s ease',
                        opacity: draggedIndex === index ? 0.5 : 1,
                        border: draggedIndex === index ? '1px dashed #1890ff' : '1px solid transparent',
                        transform: draggedIndex === index ? 'scale(0.98)' : 'scale(1)',
                        boxShadow: draggedIndex === index ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      <Avatar 
                        src={user.avatar ? `/api/v6/users/${user.user}/avatar` : user.avatar}
                        size={32}
                        style={{ backgroundColor: user.avatar ? undefined : '#1890ff', flexShrink: 0 }}
                      >
                        {!user.avatar && user.name?.charAt(0)}
                      </Avatar>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </span>
                      {clearable && hoveredUserId === user._id && (
                        <CloseOutlined 
                          onClick={() => handleRemoveUser(user._id)}
                          style={{ fontSize: 12, cursor: 'pointer', color: '#ff4d4f' }}
                        />
                      )}
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="未选择" style={{ marginTop: 60 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
            {clearable && tempSelectedUsers.length > 0 && (
              <Button
                size="small"
                type="link"
                onClick={() => setTempSelectedUsers([])}
                style={{ marginTop: 8, padding: 0 }}
              >
                清空全部
              </Button>
            )}
          </div>
        </div>
      </Modal>}

      {/* ====== 移动端：Drawer底部抽屉 + 钻入式导航 ====== */}
      {isMobile && visible && (
        <MobileDrawerContent
          visible={visible}
          multiple={multiple}
          loading={loading}
          users={users}
          searchKeyword={searchKeyword}
          searchInputValue={searchInputValue}
          tempSelectedUsers={tempSelectedUsers}
          clearable={clearable}
          rootDeptInfo={rootDeptInfo}
          deptPath={deptPath}
          currentLevelDepts={currentLevelDepts}
          showSelectedPanel={showSelectedPanel}
          onDrillDown={handleDrillDown}
          onMobileBack={handleMobileBack}
          onDrillBack={handleDrillBack}
          onBackToRoot={handleBackToRoot}
          onToggleSelectedPanel={() => setShowSelectedPanel(v => !v)}
          onUserSearch={handleSearch}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onToggleUser={handleToggleUser}
          onToggleSelectAll={handleToggleSelectAll}
          onReorderUsers={handleReorderUsers}
          onOk={handleOk}
          onCancel={handleCancel}
          onClearAll={() => setTempSelectedUsers([])}
        />
      )}
    </div>
  );
};
