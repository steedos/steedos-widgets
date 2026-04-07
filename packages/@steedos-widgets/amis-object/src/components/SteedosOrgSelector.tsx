import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, Tree, Input, Spin, Empty, Space, Button, Tag, Drawer, Badge } from 'antd';
import { SearchOutlined, ApartmentOutlined, CloseOutlined, CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';
import { createObject } from '@steedos-widgets/amis-lib';

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
  fullname?: string;
  name?: string;
}

// 支持服务端检索的部门树数据获取方法
async function defaultFetchDeptTree(parentId?: string, keyword?: string): Promise<any[]> {
  keyword = keyword?.trim();
  if (keyword) {
    // 服务端检索
    const query = `{rows:organizations(filters: [["name","contains","${keyword}"]], top: 100, skip: 0, sort: "sort_no desc"){_id,space,name,fullname,sort_no,parent,children}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const rows = data.data?.rows || [];
    return rows.map(org => ({
      title: org.fullname || org.name,
      name: org.name,
      fullname: org.fullname,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined,
    }));
  } else if (!parentId) {
    // 获取第一层
    const res = await fetch('/service/api/organizations/root');
    const data = await res.json();
    const rows = data.data?.rows || data.rows || [];
    return rows.map(org => ({
      title: org.name,
      name: org.name,
      fullname: org.fullname,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined,
    }));
  } else {
    // 获取子层
    const query = `{rows:organizations(filters: [["parent","=","${parentId}"]], top: 5000, skip: 0, sort: "sort_no desc"){_id,space,name,fullname,sort_no,parent,children}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const rows = data.data?.rows || [];
    return rows.map(org => ({
      title: org.name,
      name: org.name,
      fullname: org.fullname,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined,
    }));
  }
}

interface OrgValueItem {
  id: string;
  name: string;
  fullname: string;
}

interface DeptGroupSelectorProps {
  name?: string;
  value?: OrgValueItem | OrgValueItem[] | string | string[];
  onChange?: (value: OrgValueItem | OrgValueItem[] | string | string[] | null) => void;
  multiple?: boolean;
  valueFormat?: 'string' | 'object';
  placeholder?: string;
  fetchDeptTree?: (parentId?: string, keyword?: string) => Promise<any[]>;
  style?: React.CSSProperties;
  dispatchEvent?: (eventName: string, data: any, ref: any) => Promise<void>;
  onEvent?: any;
  data?: any;
  clearable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export const SteedosOrgSelector: React.FC<DeptGroupSelectorProps> = (props) => {
  const {
    name,
    value,
    onChange,
    multiple = false,
    valueFormat = 'string',
    placeholder = '请选择部门',
    fetchDeptTree = defaultFetchDeptTree,
    style,
    dispatchEvent,
    data,
    clearable = true,
    readonly = false,
    disabled = false,
  } = props;

  const isReadOnly = readonly || disabled;
  const isMobile = useIsMobile();

  const [visible, setVisible] = useState(false);
  const [deptTree, setDeptTree] = useState<DataNode[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<any[]>([]); // persisted selection
  const [tempSelectedOrgs, setTempSelectedOrgs] = useState<any[]>([]); // temp selection inside modal
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [hoveredOrgId, setHoveredOrgId] = useState<string | null>(null);
  const [inputHovered, setInputHovered] = useState(false);
  const [treeKey, setTreeKey] = useState(0);
  const [singleSelectHighlightId, setSingleSelectHighlightId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const ref = useRef<any>();

  // 移动端钻入式导航状态
  const [deptPath, setDeptPath] = useState<Array<{id: string, name: string}>>([]);
  const [currentLevelDepts, setCurrentLevelDepts] = useState<any[]>([]);
  const [rootDeptInfo, setRootDeptInfo] = useState<{ id: string; name: string } | null>(null);

  // 确保 ref.current.props 等于传入的完整 props
  ref.current = { props };

  const triggerChange = async (newValue: any, selectedItems?: any) => {
    if (!onChange && !dispatchEvent) return;

    const eventPatch: any = { value: newValue };
    if (name) {
      eventPatch[name] = newValue;
    }
    if (selectedItems !== undefined) {
      eventPatch.selectedItems = selectedItems;
    }

    if (dispatchEvent) {
      await dispatchEvent('change', createObject(data || {}, eventPatch), ref.current);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  // 从值中提取ID（兼容字符串和对象格式）
  const extractId = (v: any): string => {
    if (v && typeof v === 'object' && 'id' in v) return String(v.id);
    return String(v);
  };

  // 初始化已选择的组织
  useEffect(() => {
    const initValue = Array.isArray(value)
      ? value.map(extractId)
      : (value ? [extractId(value)] : []);
    if (initValue.length > 0) {
      const orgIds = initValue.map(id => `"${id}"`).join(',');
      const query = `{rows:organizations(filters: [["_id","in",[${orgIds}]]], top: 500){_id,name,fullname}}`;

      fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      .then(res => res.json())
      .then(data => {
        let orgs = (data.data?.rows || []).map((org: any) => ({
          _id: String(org._id),
          name: org.name,
          fullname: org.fullname,
        }));
        // 按initValue的顺序排序
        orgs = initValue.map(id => orgs.find((o: any) => o._id === id)).filter((o: any) => !!o);
        setSelectedOrgs(orgs);
      });
    } else {
      setSelectedOrgs([]);
    }
  }, [value]);

  // 组件卸载时清理防抖定时器
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // 加载部门树（弹窗打开时）
  useEffect(() => {
    if (visible) {
      setLoading(true);
      setTreeKey(k => k + 1);
      setDeptTree([]);
      setExpandedKeys([]);
      setSearchKeyword('');

      fetchDeptTree()
        .then(data => {
          const rootNodes = data as DataNode[];
          setDeptTree(rootNodes);
          const firstLevelKeys = rootNodes.map(item => item.key);
          setExpandedKeys(firstLevelKeys);

          // 移动端：记录根部门信息
          if (isMobile && rootNodes[0]) {
            const rootId = String(rootNodes[0].key);
            const rootName = String(rootNodes[0].title || '');
            setRootDeptInfo({ id: rootId, name: rootName });
            setDeptPath([]);
            setCurrentLevelDepts(rootNodes);
          }

          // 手动加载已展开根节点的子节点数据
          rootNodes.forEach(node => {
            if (!node.isLeaf) {
              fetchDeptTree(String(node.key)).then(children => {
                setDeptTree(prev => {
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
        .finally(() => setLoading(false));
    }
  }, [visible, fetchDeptTree]);

  // 递归更新树节点
  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map(node => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });

  // 懒加载子节点
  const onLoadData: TreeProps['loadData'] = async ({ key, children }) => {
    if (children && children.length > 0) return;
    const childNodes = await fetchDeptTree(String(key));
    setDeptTree(origin => updateTreeData(origin, key, childNodes as DataNode[]));
  };

  // 处理搜索
  const handleSearch = (searchValue: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchKeyword(searchValue);

    if (!searchValue.trim()) {
      // 清空搜索，恢复初始树
      setLoading(true);
      fetchDeptTree()
        .then(data => {
          const initialData = data.map((item: any) => ({
            ...item,
            children: undefined,
          }));
          setDeptTree(initialData);
          setTreeKey(k => k + 1);
          const firstLevelKeys = (initialData as DataNode[]).map(item => item.key);
          setExpandedKeys(firstLevelKeys);
        })
        .finally(() => setLoading(false));
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      setLoading(true);
      fetchDeptTree(undefined, searchValue.trim())
        .then(data => setDeptTree(data as DataNode[]))
        .finally(() => setLoading(false));
    }, 300);
  };

  // 选择组织（点击树节点）
  const handleSelectOrg = (org: any) => {
    if (multiple) {
      if (!tempSelectedOrgs.find(o => o._id === org._id)) {
        setTempSelectedOrgs([...tempSelectedOrgs, org]);
      }
    } else {
      setTempSelectedOrgs([org]);
      // 单选：点击即确认（PC端300ms高亮反馈后关闭）
      if (isMobile) {
        setTimeout(() => { handleOkWithOrgs([org]); }, 0);
      } else {
        setSingleSelectHighlightId(org._id);
        setTimeout(() => {
          setSingleSelectHighlightId(null);
          handleOkWithOrgs([org]);
        }, 300);
      }
    }
  };

  // 从已选中移除组织
  const handleRemoveOrg = (orgId: string) => {
    setTempSelectedOrgs(tempSelectedOrgs.filter(o => o._id !== orgId));
  };

  // 打开弹窗
  const handleOpen = () => {
    setVisible(true);
    setTempSelectedOrgs([...selectedOrgs]);
    if (isMobile) {
      setDeptPath([]);
      setCurrentLevelDepts([]);
      setRootDeptInfo(null);
    }
  };

  // 确认选择（支持传入指定列表，用于单选自动确认）
  const handleOkWithOrgs = async (orgList: any[]) => {
    setSelectedOrgs(orgList);
    if (onChange || dispatchEvent) {
      const selectedItems = multiple
        ? orgList.map(o => ({ label: o.name, value: o._id, _id: o._id }))
        : (orgList[0] ? { label: orgList[0].name, value: orgList[0]._id, _id: orgList[0]._id } : null);

      let outputValue: any;
      if (valueFormat === 'object') {
        const outputValues = orgList.map(o => ({
          id: o._id,
          name: o.name,
          fullname: o.fullname || o.name,
        }));
        outputValue = multiple ? outputValues : (outputValues[0] || null);
      } else {
        const outputStringValues = orgList.map(o => String(o._id));
        outputValue = multiple ? outputStringValues : (outputStringValues[0] || null);
      }

      await triggerChange(outputValue, selectedItems);
    }
    setVisible(false);
  };

  // 确认选择
  const handleOk = async () => {
    await handleOkWithOrgs(tempSelectedOrgs);
  };

  // 取消选择
  const handleCancel = () => {
    setTempSelectedOrgs([...selectedOrgs]);
    setVisible(false);
  };

  // 处理树节点选中（checkbox模式或select模式）
  const onTreeCheck: TreeProps['onCheck'] = (checkedKeysValue, info) => {
    const { node, checked } = info as any;
    const org = { _id: String(node.key), name: node.name || node.title, fullname: node.fullname || '' };
    if (checked) {
      if (!tempSelectedOrgs.find(o => o._id === org._id)) {
        setTempSelectedOrgs([...tempSelectedOrgs, org]);
      }
    } else {
      setTempSelectedOrgs(tempSelectedOrgs.filter(o => o._id !== org._id));
    }
  };

  const onTreeSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0 && info.node) {
      const node = info.node as any;
      const org = { _id: String(node.key), name: node.name || node.title, fullname: node.fullname || '' };
      handleSelectOrg(org);
    }
  };

  // 移动端：钻入子部门
  const handleDrillDown = useCallback(async (deptId: string, deptName: string) => {
    setDeptPath(prev => [...prev, { id: deptId, name: deptName }]);
    setLoading(true);
    try {
      const children = await fetchDeptTree(deptId);
      setCurrentLevelDepts(children);
    } catch {
      setCurrentLevelDepts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDeptTree]);

  // 移动端：返回上一级
  const handleMobileBack = useCallback(async () => {
    if (deptPath.length <= 0) return;
    if (deptPath.length === 1) {
      // 在根部门级别，返回初始页面
      setDeptPath([]);
      if (rootDeptInfo) {
        setLoading(true);
        try {
          const rootNodes = await fetchDeptTree();
          setCurrentLevelDepts(rootNodes);
        } catch {
          setCurrentLevelDepts([]);
        } finally {
          setLoading(false);
        }
      }
    } else {
      const newPath = deptPath.slice(0, -1);
      setDeptPath(newPath);
      const targetDept = newPath[newPath.length - 1];
      setLoading(true);
      try {
        const children = await fetchDeptTree(targetDept.id);
        setCurrentLevelDepts(children);
      } catch {
        setCurrentLevelDepts([]);
      } finally {
        setLoading(false);
      }
    }
  }, [deptPath, rootDeptInfo, fetchDeptTree]);

  // 移动端：选择/取消组织
  const handleMobileToggleOrg = useCallback((org: any) => {
    const isSelected = tempSelectedOrgs.find(o => o._id === org._id);
    if (isSelected) {
      handleRemoveOrg(org._id);
    } else {
      handleSelectOrg(org);
    }
  }, [tempSelectedOrgs, multiple]);

  // ====== 渲染部分 ======

  const showClearButton = !isReadOnly && clearable && selectedOrgs.length > 0 && (isMobile || inputHovered);

  // 渲染树节点标题（带选中状态图标）
  const renderTreeTitle = (nodeData: any) => {
    const isSelected = !!tempSelectedOrgs.find(o => o._id === String(nodeData.key));
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{nodeData.title}</span>
        {isSelected && !multiple && <CheckOutlined style={{ color: '#1890ff', fontSize: 12 }} />}
      </span>
    );
  };

  return (
    <div style={{ ...style }} className='steedos-org-selector'>
      <Input
        readOnly
        disabled={isReadOnly}
        placeholder={placeholder}
        value={selectedOrgs.map(o => o.name).join(', ')}
        onClick={isReadOnly ? undefined : handleOpen}
        onMouseEnter={() => !isMobile && setInputHovered(true)}
        onMouseLeave={() => !isMobile && setInputHovered(false)}
        style={{
          minWidth: 150,
          cursor: isReadOnly ? 'default' : 'pointer',
          ...(isMobile ? { paddingLeft: 0 } : {})
        }}
        suffix={
          showClearButton ? (
            <CloseOutlined
              style={{ color: '#ff4d4f', cursor: 'pointer', padding: isMobile ? 4 : 0 }}
              onMouseEnter={() => !isMobile && setInputHovered(true)}
              onMouseLeave={() => !isMobile && setInputHovered(false)}
              onClick={async (e) => {
                e.stopPropagation();
                setSelectedOrgs([]);
                const outputValue = multiple ? [] : null;
                await triggerChange(outputValue);
                setInputHovered(false);
              }}
            />
          ) : (
            <ApartmentOutlined
              style={{ color: '#999' }}
              onMouseEnter={() => !isMobile && selectedOrgs.length > 0 && setInputHovered(true)}
              onMouseLeave={() => !isMobile && setInputHovered(false)}
            />
          )
        }
      />

      {/* ====== PC端：单选单栏 / 多选双栏 ====== */}
      {!isMobile && <Modal
        title={multiple ? "选择部门 (多选)" : "选择部门"}
        open={visible}
        onOk={multiple ? handleOk : undefined}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        footer={multiple ? undefined : null}
        width={multiple ? 800 : 500}
        destroyOnClose
        zIndex={1500}
        bodyStyle={{ height: 500, overflow: 'hidden', padding: 0 }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* 左侧：组织树 */}
          <div style={{ flex: 1, padding: '16px 16px 16px 0px' , display: 'flex', flexDirection: 'column' }}>
            <Input
              placeholder="搜索部门"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ marginBottom: 12 }}
            />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Spin spinning={loading}>
                {deptTree.length > 0 ? (
                  multiple ? (
                    <Tree
                      key={treeKey}
                      treeData={deptTree}
                      checkable
                      checkedKeys={tempSelectedOrgs.map(o => o._id)}
                      onCheck={onTreeCheck}
                      loadData={searchKeyword ? undefined : onLoadData}
                      showLine
                      expandedKeys={expandedKeys}
                      onExpand={setExpandedKeys}
                      checkStrictly
                    />
                  ) : (
                    <Tree
                      key={treeKey}
                      treeData={deptTree}
                      onSelect={onTreeSelect}
                      loadData={searchKeyword ? undefined : onLoadData}
                      showLine
                      selectedKeys={singleSelectHighlightId ? [singleSelectHighlightId] : []}
                      expandedKeys={expandedKeys}
                      onExpand={setExpandedKeys}
                      titleRender={renderTreeTitle}
                    />
                  )
                ) : !loading ? (
                  <Empty description="暂无部门" style={{ marginTop: 60 }} />
                ) : null}
              </Spin>
            </div>
          </div>

          {/* 右侧：已选中（多选模式） */}
          {multiple && (
            <div style={{ width: 260, borderLeft: '1px solid #f0f0f0', padding: 16, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 12, fontSize: 14 }}>
                <span style={{ fontWeight: 500 }}>已选中</span>
                <span style={{ marginLeft: 8, color: '#999' }}>({tempSelectedOrgs.length})</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {tempSelectedOrgs.length > 0 ? (
                  <Space direction="vertical" style={{ width: '100%' }} size={8}>
                    {tempSelectedOrgs.map((org) => (
                      <div
                        key={org._id}
                        onMouseEnter={() => setHoveredOrgId(org._id)}
                        onMouseLeave={() => setHoveredOrgId(null)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: '#f5f5f5',
                          borderRadius: 4,
                          position: 'relative',
                        }}
                      >
                        <ApartmentOutlined style={{ color: '#1890ff', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                            {org.name}
                          </div>
                          {org.fullname && org.fullname !== org.name && (
                            <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {org.fullname}
                            </div>
                          )}
                        </div>
                        {clearable && hoveredOrgId === org._id && (
                          <CloseOutlined
                            onClick={() => handleRemoveOrg(org._id)}
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
              {clearable && tempSelectedOrgs.length > 0 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => setTempSelectedOrgs([])}
                  style={{ marginTop: 8, padding: 0 }}
                >
                  清空全部
                </Button>
              )}
            </div>
          )}
        </div>
      </Modal>}

      {/* ====== 移动端：Drawer底部抽屉 + 钻入式导航 ====== */}
      {isMobile && visible && (
        <Drawer
          open={visible}
          placement="bottom"
          height="90vh"
          onClose={handleCancel}
          closable={false}
          zIndex={1500}
          bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* 顶部导航栏 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {deptPath.length > 0 && (
                <LeftOutlined style={{ cursor: 'pointer', fontSize: 16 }} onClick={handleMobileBack} />
              )}
              <span style={{ fontWeight: 500, fontSize: 16 }}>
                {deptPath.length > 0 ? deptPath[deptPath.length - 1].name : '选择部门'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {multiple && tempSelectedOrgs.length > 0 && (
                <Badge count={tempSelectedOrgs.length} size="small">
                  <Button size="small" type="primary" onClick={handleOk}>确定</Button>
                </Badge>
              )}
              <Button size="small" onClick={handleCancel}>取消</Button>
            </div>
          </div>

          {/* 搜索栏 */}
          <div style={{ padding: '8px 16px' }}>
            <Input
              placeholder="搜索部门"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                if (!e.target.value.trim()) {
                  // 清空搜索，恢复到当前层级
                  if (deptPath.length > 0) {
                    const currentDept = deptPath[deptPath.length - 1];
                    fetchDeptTree(currentDept.id).then(children => setCurrentLevelDepts(children));
                  } else {
                    fetchDeptTree().then(data => setCurrentLevelDepts(data));
                  }
                  return;
                }
                searchTimeoutRef.current = setTimeout(() => {
                  setLoading(true);
                  fetchDeptTree(undefined, e.target.value.trim())
                    .then(data => setCurrentLevelDepts(data))
                    .finally(() => setLoading(false));
                }, 300);
              }}
              allowClear
            />
          </div>

          {/* 部门列表 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            <Spin spinning={loading}>
              {currentLevelDepts.length > 0 ? (
                currentLevelDepts.map((dept: any) => {
                  const orgId = String(dept.key || dept.value);
                  const orgName = dept.name || dept.title;
                  const orgFullname = dept.fullname || '';
                  const isSelected = !!tempSelectedOrgs.find(o => o._id === orgId);
                  const isLeaf = dept.isLeaf;
                  return (
                    <div
                      key={orgId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #f5f5f5',
                        gap: 12,
                      }}
                    >
                      {/* 选择区域 */}
                      <div
                        onClick={() => {
                          const org = { _id: orgId, name: orgName, fullname: orgFullname };
                          handleMobileToggleOrg(org);
                        }}
                        style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 12, cursor: 'pointer', minWidth: 0 }}
                      >
                        <ApartmentOutlined style={{ color: isSelected ? '#1890ff' : '#999', fontSize: 20, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {orgName}
                          </div>
                          {orgFullname && orgFullname !== orgName && (
                            <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {orgFullname}
                            </div>
                          )}
                        </div>
                        {isSelected && <CheckOutlined style={{ color: '#1890ff', flexShrink: 0 }} />}
                      </div>
                      {/* 钻入子部门 */}
                      {!isLeaf && !searchKeyword && (
                        <RightOutlined
                          style={{ color: '#999', cursor: 'pointer', padding: '4px 0 4px 8px' }}
                          onClick={() => handleDrillDown(orgId, orgName)}
                        />
                      )}
                    </div>
                  );
                })
              ) : !loading ? (
                <Empty description="暂无部门" style={{ marginTop: 60 }} />
              ) : null}
            </Spin>
          </div>

          {/* 底部已选（多选模式） */}
          {multiple && tempSelectedOrgs.length > 0 && (
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 16px', maxHeight: 120, overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {tempSelectedOrgs.map(org => (
                  <Tag
                    key={org._id}
                    closable
                    onClose={() => handleRemoveOrg(org._id)}
                    style={{ margin: 0 }}
                  >
                    {org.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
};