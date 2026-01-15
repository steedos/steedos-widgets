import React, { useEffect, useState, useRef } from 'react';
import { Modal, Tree, Input, Spin, Empty, Space, Button, Tag, Avatar } from 'antd';
import { SearchOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';

interface DataNode {
  title: string;
  value: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
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
    // 按姓名或邮箱搜索
    filters.push([[['name', 'contains', keyword], 'or', ['email', 'contains', keyword]], 'or', ['username', 'contains', keyword]]);
  } else if (organizationId) {
    // 按部门搜索
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
    data
  } = props;

  // console.log('SteedosUserSelector. value', value)
  const [visible, setVisible] = useState(false);
  const [deptTree, setDeptTree] = useState<DataNode[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deptSearchKeyword, setDeptSearchKeyword] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [inputHovered, setInputHovered] = useState(false);
  const [treeKey, setTreeKey] = useState(0); // 增加 treeKey 状态
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const deptSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastDragTimeRef = useRef<number>(0);
  const ref = useRef<any>();

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

  // 加载部门树
  useEffect(() => {
    if (visible) {
      setLoading(true);
      // 重置状态，确保Tree组件能重新触发加载
      setDeptTree([]);
      setExpandedKeys([]);
      setSelectedDept(null);
      setDeptSearchKeyword('');
      setSearchKeyword('');
      
      fetchDeptTree()
        .then(data => {
          setDeptTree(data as DataNode[]);
          // 默认展开第一层
          const firstLevelKeys = (data as DataNode[]).map(item => item.key);
          setExpandedKeys(firstLevelKeys);
          // 默认选中第一个根节点
          if (firstLevelKeys.length > 0) {
            setSelectedDept(String(firstLevelKeys[0]));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [visible, fetchDeptTree]);

  // 加载选中部门的用户
  useEffect(() => {
    if (selectedDept || searchKeyword) {
      setLoading(true);
      fetchUsers(selectedDept || undefined, searchKeyword || undefined)
        .then(data => setUsers(data))
        .finally(() => setLoading(false));
    } else {
      setUsers([]);
    }
  }, [selectedDept, searchKeyword, fetchUsers]);

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
  const onSelectDept: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      setSelectedDept(String(selectedKeys[0]));
      setSearchKeyword('');
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
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchKeyword(searchValue);
      if (searchValue) {
        setSelectedDept(null);
      } else if (deptTree.length > 0) {
        // 如果清空搜索且有部门树数据，默认选中第一个
        setSelectedDept(String(deptTree[0].key));
      }
    }, 300);
  };

  // 添加用户到已选
  const handleAddUser = (user: any) => {
    if (multiple) {
      if (!tempSelectedUsers.find(u => u._id === user._id)) {
        setTempSelectedUsers([...tempSelectedUsers, user]);
      }
    } else {
      setTempSelectedUsers([user]);
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
  };

  // 确认选择
  const handleOk = async () => {
    setSelectedUsers(tempSelectedUsers);
    if (onChange || dispatchEvent) {
      // 修复：返回user字段(用户ID)而不是space_users的_id
      const values = tempSelectedUsers.map(u => u.user);
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

  // 取消选择
  const handleCancel = () => {
    setTempSelectedUsers([...selectedUsers]);
    setVisible(false);
  };

  return (
    <div style={{ ...style }} className='steedos-user-selector'>
      <Input
        readOnly
        placeholder={placeholder}
        value={selectedUsers.map(u => u.name).join(', ')}
        onClick={handleOpen}
        onMouseEnter={() => setInputHovered(true)}
        onMouseLeave={() => setInputHovered(false)}
        style={{ minWidth: 280, cursor: 'pointer' }}
        suffix={
          selectedUsers.length > 0 && inputHovered ? (
            <CloseOutlined
              style={{ color: '#ff4d4f', cursor: 'pointer' }}
              onMouseEnter={() => setInputHovered(true)}
              onMouseLeave={() => setInputHovered(false)}
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
              onMouseEnter={() => selectedUsers.length > 0 && setInputHovered(true)}
              onMouseLeave={() => setInputHovered(false)}
            />
          )
        }
      />

      <Modal
        title="选择人员"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
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
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <Spin spinning={loading}>
                {users.length > 0 ? (
                  <div style={{ 
                    padding: 8, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: 8 
                  }}>
                    {users.map((user) => {
                      const isSelected = tempSelectedUsers.find(u => u._id === user._id);
                      return (
                        <div
                          key={user._id}
                          className={!isSelected ? "steedos-user-selector-item" : ""}
                          onClick={() => !isSelected && handleAddUser(user)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 4,
                            cursor: isSelected ? 'default' : 'pointer',
                            backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                            borderColor: isSelected ? '#1890ff' : 'transparent',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            transition: 'all 0.2s',
                            opacity: isSelected ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
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
                        </div>
                      );
                    })}
                  </div>
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
                      {hoveredUserId === user._id && (
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
            {tempSelectedUsers.length > 0 && (
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
      </Modal>
    </div>
  );
};
