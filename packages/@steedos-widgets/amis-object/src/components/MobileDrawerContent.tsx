import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Tree, Input, Spin, Empty, Button, Avatar, Drawer, Badge } from 'antd';
import { SearchOutlined, CloseOutlined, CheckOutlined, UpOutlined, DownOutlined, ApartmentOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';

// 移动端分批渲染 Hook（callback ref 模式，兼容 Drawer 动画延迟挂载场景）
function useMobileInfiniteScroll(totalCount: number, batchSize: number = 50, deps: any[] = []) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const elRef = useRef<HTMLDivElement | null>(null);
  // refReady 随 DOM 节点的挂载/卸载而变化，用于触发 useEffect 重新绑定
  const [refReady, setRefReady] = useState(false);

  // 当数据源变化时重置 visibleCount 并滚动回顶部
  useEffect(() => {
    setVisibleCount(batchSize);
    if (elRef.current) elRef.current.scrollTop = 0;
  }, [...deps, totalCount]);

  // callback ref：DOM 节点真正挂载时才触发，解决 Drawer 动画导致的 null 问题
  const scrollContainerRef = useCallback((el: HTMLDivElement | null) => {
    elRef.current = el;
    setRefReady(!!el);
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onScroll = () => {
      // 距离底部 < 120px 时加载下一批
      setVisibleCount(prev => {
        if (prev >= totalCount) return prev;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
          return Math.min(prev + batchSize, totalCount);
        }
        return prev;
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    // 首帧检查：如果内容不足以填满容器，自动加载更多
    const raf = requestAnimationFrame(() => onScroll());

    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [totalCount, batchSize, refReady]);

  return { visibleCount, scrollContainerRef };
}

const mobileStyles = `
.steedos-mobile-drawer .ant-drawer-content-wrapper {
  border-radius: 16px 16px 0 0 !important;
  overflow: hidden;
}
.steedos-mobile-drawer .ant-drawer-header {
  padding: 12px 16px;
  border-bottom: none;
}
.steedos-mobile-drawer .ant-drawer-body {
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.steedos-mobile-drawer .ant-tree .ant-tree-treenode {
  min-height: 44px;
  padding: 4px 0;
  align-items: center;
}
.steedos-mobile-drawer .ant-tree .ant-tree-node-content-wrapper {
  min-height: 36px;
  line-height: 36px;
  font-size: 15px;
}
.steedos-mobile-drawer .ant-tree .ant-tree-switcher {
  width: 32px;
  height: 36px;
  line-height: 36px;
}
.steedos-mobile-tab-bar {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.steedos-mobile-tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0 10px;
  font-size: 15px;
  color: #666;
  position: relative;
  cursor: pointer;
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.steedos-mobile-tab-item.active {
  color: #1890ff;
  font-weight: 500;
}
.steedos-mobile-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 2px;
  background: #1890ff;
  border-radius: 1px;
}
.steedos-mobile-user-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.steedos-mobile-user-card:active {
  background: #f5f5f5;
}
.steedos-mobile-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #f0f0f0;
  background: #fff;
}
`;

interface MobileDrawerProps {
  visible: boolean;
  multiple: boolean;
  loading: boolean;
  deptTree: any[];
  treeKey: number;
  deptSearchKeyword: string;
  selectedDept: string | null;
  selectedDeptName: string;
  expandedKeys: React.Key[];
  users: any[];
  searchKeyword: string;
  tempSelectedUsers: any[];
  mobileActiveTab: 'dept' | 'users' | 'selected';
  clearable: boolean;
  onSelectDept: TreeProps['onSelect'];
  onLoadData: TreeProps['loadData'];
  onExpandKeys: (keys: React.Key[]) => void;
  onDeptSearch: (value: string) => void;
  onUserSearch: (value: string) => void;
  onAddUser: (user: any) => void;
  onRemoveUser: (userId: string) => void;
  onToggleUser: (user: any) => void;
  onToggleSelectAll: () => void;
  onMoveUser: (index: number, direction: 'up' | 'down') => void;
  onTabChange: (tab: 'dept' | 'users' | 'selected') => void;
  onOk: () => void;
  onCancel: () => void;
  onClearAll: () => void;
}

export const MobileDrawerContent: React.FC<MobileDrawerProps> = (props) => {
  const {
    visible, multiple, loading, deptTree, treeKey, deptSearchKeyword,
    selectedDept, selectedDeptName, expandedKeys, users, searchKeyword,
    tempSelectedUsers, mobileActiveTab, clearable,
    onSelectDept, onLoadData, onExpandKeys, onDeptSearch, onUserSearch,
    onAddUser, onRemoveUser, onToggleUser, onToggleSelectAll,
    onMoveUser, onTabChange, onOk, onCancel, onClearAll
  } = props;

  const isAllSelected = users.length > 0 && users.every(u => tempSelectedUsers.find(s => s._id === u._id));

  // 移动端分批渲染（scroll 事件驱动，兼容 Drawer CSS transform）
  const { visibleCount, scrollContainerRef } = useMobileInfiniteScroll(users.length, 50, [selectedDept, searchKeyword, mobileActiveTab]);

  // 部门面板
  const renderDeptPanel = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px 8px' }}>
        <Input placeholder="搜索部门" prefix={<SearchOutlined />} value={deptSearchKeyword} onChange={(e) => onDeptSearch(e.target.value)} allowClear size="large" />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px', WebkitOverflowScrolling: 'touch' as any }}>
        <Spin spinning={loading && !selectedDept && !searchKeyword}>
          <Tree key={treeKey} treeData={deptTree} onSelect={onSelectDept} loadData={deptSearchKeyword ? undefined : onLoadData} showLine selectedKeys={selectedDept ? [selectedDept] : []} expandedKeys={expandedKeys} onExpand={onExpandKeys} />
        </Spin>
      </div>
    </div>
  );

  // 人员列表面板
  const renderUsersPanel = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {selectedDeptName && (
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <ApartmentOutlined style={{ color: '#1890ff' }} />
          <span style={{ flex: 1, fontSize: 14, color: '#333' }}>{selectedDeptName}</span>
          <Button type="link" size="small" onClick={() => onTabChange('dept')} style={{ padding: 0, fontSize: 13 }}>切换部门</Button>
        </div>
      )}
      {/* 搜索框 + 全选同行（参考钉钉/飞书规范） */}
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Input placeholder="搜索姓名、邮箱或用户名" prefix={<SearchOutlined />} value={searchKeyword} onChange={(e) => onUserSearch(e.target.value)} allowClear size="large" style={{ flex: 1 }} />
        {multiple && users.length > 0 && (
          <Button size="small" onClick={onToggleSelectAll} style={{ flexShrink: 0 }}>{isAllSelected ? '取消全选' : '全选'}</Button>
        )}
      </div>
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <Spin spinning={loading}>
          {users.length > 0 ? (
            <>
              {users.slice(0, visibleCount).map((user: any) => {
                const isSelected = !!tempSelectedUsers.find(u => u._id === user._id);
                return (
                  <div key={user._id} className="steedos-mobile-user-card" onClick={() => onToggleUser(user)} style={{ opacity: isSelected ? 0.7 : 1 }}>
                    <Avatar src={user.avatar ? `/api/v6/users/${user.user}/avatar` : undefined} size={40} style={{ backgroundColor: user.avatar ? undefined : '#1890ff', flexShrink: 0 }}>
                      {!user.avatar && user.name?.charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {user.organization?.name}{user.position ? ` · ${user.position}` : ''}
                      </div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isSelected ? '#1890ff' : '#f0f0f0' }}>
                      {isSelected ? <CheckOutlined style={{ color: '#fff', fontSize: 14 }} /> : <span style={{ color: '#bbb', fontSize: 18, lineHeight: 1 }}>+</span>}
                    </div>
                  </div>
                );
              })}
              {visibleCount < users.length && (
                <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 13 }}>
                  加载更多...
                </div>
              )}
            </>
          ) : (selectedDept || searchKeyword) && !loading ? (
            <Empty description="暂无人员" style={{ marginTop: 60 }} />
          ) : !loading ? (
            <Empty description="请选择部门" style={{ marginTop: 60 }} />
          ) : null}
        </Spin>
      </div>
    </div>
  );

  // 已选面板
  const renderSelectedPanel = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 500, fontSize: 15 }}>已选中 ({tempSelectedUsers.length})</span>
        {clearable && tempSelectedUsers.length > 0 && (
          <Button type="link" danger size="small" onClick={onClearAll} style={{ padding: 0 }}>清空全部</Button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        {tempSelectedUsers.length > 0 ? tempSelectedUsers.map((user, index) => (
          <div key={user._id} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f5f5f5', gap: 8 }}>
            {multiple && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <Button type="text" size="small" icon={<UpOutlined />} disabled={index === 0} onClick={() => onMoveUser(index, 'up')} style={{ padding: 0, width: 24, height: 24, minWidth: 24 }} />
                <Button type="text" size="small" icon={<DownOutlined />} disabled={index === tempSelectedUsers.length - 1} onClick={() => onMoveUser(index, 'down')} style={{ padding: 0, width: 24, height: 24, minWidth: 24 }} />
              </div>
            )}
            <Avatar src={user.avatar ? `/api/v6/users/${user.user}/avatar` : undefined} size={36} style={{ backgroundColor: user.avatar ? undefined : '#1890ff', flexShrink: 0 }}>
              {!user.avatar && user.name?.charAt(0)}
            </Avatar>
            <span style={{ flex: 1, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
            {clearable && (
              <CloseOutlined onClick={() => onRemoveUser(user._id)} style={{ fontSize: 14, color: '#ff4d4f', padding: 8, flexShrink: 0 }} />
            )}
          </div>
        )) : (
          <Empty description="未选择" style={{ marginTop: 60 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );

  return (
    <Drawer
      open={visible}
      placement="bottom"
      height="92vh"
      closable={false}
      destroyOnClose
      rootClassName="steedos-mobile-drawer"
      onClose={onCancel}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
    >
      <style>{mobileStyles}</style>
      {/* 顶部拖拽条 */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#ddd' }} />
      </div>
      {/* 标题栏：确认入口统一在底部，顶部只保留取消 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 8px' }}>
        <Button type="text" onClick={onCancel} style={{ padding: 0, color: '#666' }}>取消</Button>
        <span style={{ fontWeight: 600, fontSize: 16 }}>选择人员</span>
        <span style={{ width: 40 }} />
      </div>
      {/* Tab栏 */}
      <div className="steedos-mobile-tab-bar">
        <div className={`steedos-mobile-tab-item ${mobileActiveTab === 'dept' ? 'active' : ''}`} onClick={() => onTabChange('dept')}>部门</div>
        <div className={`steedos-mobile-tab-item ${mobileActiveTab === 'users' ? 'active' : ''}`} onClick={() => onTabChange('users')}>人员</div>
        <div className={`steedos-mobile-tab-item ${mobileActiveTab === 'selected' ? 'active' : ''}`} onClick={() => onTabChange('selected')}>
          已选{tempSelectedUsers.length > 0 ? <Badge count={tempSelectedUsers.length} size="small" offset={[4, -2]} style={{ fontSize: 10 }} /> : null}
        </div>
      </div>
      {/* 内容区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {mobileActiveTab === 'dept' && renderDeptPanel()}
        {mobileActiveTab === 'users' && renderUsersPanel()}
        {mobileActiveTab === 'selected' && renderSelectedPanel()}
      </div>
      {/* 底部操作栏（仅多选模式） */}
      {multiple && (
        <div className="steedos-mobile-bottom-bar">
          <span style={{ fontSize: 14, color: '#666' }}>已选 {tempSelectedUsers.length} 人</span>
          <Button type="primary" onClick={onOk}>确定</Button>
        </div>
      )}
    </Drawer>
  );
};
