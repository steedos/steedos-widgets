import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Input, Spin, Empty, Button, Avatar, Drawer } from 'antd';
import { SearchOutlined, CloseOutlined, CheckOutlined, ApartmentOutlined, HolderOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

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
  border-radius: 0 !important;
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
.steedos-mobile-dept-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.steedos-mobile-dept-card:active {
  background: #f5f5f5;
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
.steedos-mobile-selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
`;

interface MobileDrawerProps {
  visible: boolean;
  multiple: boolean;
  loading: boolean;
  users: any[];
  searchKeyword: string;
  searchInputValue: string;
  tempSelectedUsers: any[];
  clearable: boolean;
  rootDeptInfo: { id: string; name: string } | null;
  deptPath: Array<{ id: string; name: string }>;
  currentLevelDepts: any[];
  showSelectedPanel: boolean;
  onDrillDown: (deptId: string, deptName: string) => void;
  onMobileBack: () => void;
  onDrillBack: (targetIndex: number) => void;
  onBackToRoot: () => void;
  onToggleSelectedPanel: () => void;
  onUserSearch: (value: string) => void;
  onAddUser: (user: any) => void;
  onRemoveUser: (userId: string) => void;
  onToggleUser: (user: any) => void;
  onToggleSelectAll: () => void;
  onReorderUsers: (fromIndex: number, toIndex: number) => void;
  onOk: () => void;
  onCancel: () => void;
  onClearAll: () => void;
}

export const MobileDrawerContent: React.FC<MobileDrawerProps> = (props) => {
  const {
    visible, multiple, loading, users, searchKeyword, searchInputValue,
    tempSelectedUsers, clearable,
    rootDeptInfo, deptPath, currentLevelDepts, showSelectedPanel,
    onDrillDown, onMobileBack, onDrillBack, onBackToRoot, onToggleSelectedPanel,
    onUserSearch, onAddUser, onRemoveUser, onToggleUser, onToggleSelectAll,
    onReorderUsers, onOk, onCancel, onClearAll
  } = props;

  const isAllSelected = users.length > 0 && users.every(u => tempSelectedUsers.find(s => s._id === u._id));
  const isSearchMode = !!searchKeyword;

  // 移动端分批渲染（scroll 事件驱动，兼容 Drawer CSS transform）
  const { visibleCount, scrollContainerRef } = useMobileInfiniteScroll(users.length, 50, [deptPath.length, searchKeyword]);

  // 渲染通讯录入口栏（初始页面，点击进入部门钻入模式）
  const renderRootBar = () => {
    if (isSearchMode || deptPath.length > 0 || !rootDeptInfo) return null;
    return (
      <>
        <div
          className="steedos-mobile-dept-card"
          onClick={() => onDrillDown(rootDeptInfo.id, rootDeptInfo.name)}
        >
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ApartmentOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 15 }}>通讯录</div>
          </div>
          <RightOutlined style={{ color: '#ccc', fontSize: 14, flexShrink: 0 }} />
        </div>
        {users.length > 0 && (
          <div style={{ height: 8, background: '#f5f5f5' }} />
        )}
      </>
    );
  };

  // 渲染部门卡片（钻入式）
  const renderDeptCards = () => {
    if (isSearchMode || deptPath.length === 0 || currentLevelDepts.length === 0) return null;
    return (
      <>
        {currentLevelDepts.map((dept: any) => (
          <div
            key={dept._id || dept.id || dept.key || dept.value}
            className="steedos-mobile-dept-card"
            onClick={() => onDrillDown(dept._id || dept.id || dept.key || dept.value, dept.title || dept.name || dept.label)}
          >
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ApartmentOutlined style={{ fontSize: 18, color: '#1890ff' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dept.title || dept.name || dept.label}
              </div>
            </div>
            <RightOutlined style={{ color: '#ccc', fontSize: 14, flexShrink: 0 }} />
          </div>
        ))}
        {/* 部门与人员之间的分隔线 */}
        {users.length > 0 && (
          <div style={{ height: 8, background: '#f5f5f5' }} />
        )}
      </>
    );
  };

  // 渲染人员列表（当前部门下的人员 或 搜索结果）
  const renderUserList = () => (
    <>
      {users.length > 0 ? (
        <>
          {users.slice(0, visibleCount).map((user: any) => {
            const isSelected = !!tempSelectedUsers.find(u => u._id === user._id);
            return (
              <div key={user._id} className="steedos-mobile-user-card" onClick={() => onToggleUser(user)}>
                {multiple && (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isSelected ? '#1890ff' : 'transparent', border: isSelected ? 'none' : '1.5px solid #d9d9d9' }}>
                    {isSelected && <CheckOutlined style={{ color: '#fff', fontSize: 11 }} />}
                  </div>
                )}
                <Avatar src={user.avatar ? `/api/v6/users/${user.user}/avatar` : undefined} size={40} style={{ backgroundColor: user.avatar ? undefined : '#1890ff', flexShrink: 0 }}>
                  {!user.avatar && user.name?.charAt(0)}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                    {user.organization?.name}{user.position ? ` · ${user.position}` : ''}
                  </div>
                  {(user.email || user.mobile || user.username) && (
                    <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                      {user.email || user.mobile || user.username}
                    </div>
                  )}
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
      ) : !loading ? (
        <Empty description={searchKeyword ? "未找到匹配的人员" : "暂无人员"} style={{ marginTop: 60 }} />
      ) : null}
    </>
  );

  // 触摸拖拽排序状态
  const dragState = useRef<{
    dragging: boolean;
    startIndex: number;
    currentIndex: number;
    startY: number;
    itemHeight: number;
    clone: HTMLDivElement | null;
    listEl: HTMLDivElement | null;
  }>({ dragging: false, startIndex: -1, currentIndex: -1, startY: 0, itemHeight: 56, clone: null, listEl: null });

  const selectedListRef = useRef<HTMLDivElement | null>(null);
  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // 长按开始拖拽
  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    // 如果是在删除按钮上长按，忽略
    const target = e.target as HTMLElement;
    if (target.closest('.steedos-selected-remove-btn')) return;

    const touch = e.touches[0];
    const card = (e.currentTarget as HTMLElement);
    const rect = card.getBoundingClientRect();

    // 创建拖拽克隆元素
    const clone = card.cloneNode(true) as HTMLDivElement;
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.zIndex = '9999';
    clone.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    clone.style.borderRadius = '8px';
    clone.style.opacity = '0.92';
    clone.style.transition = 'box-shadow 0.2s';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    dragState.current = {
      dragging: true,
      startIndex: index,
      currentIndex: index,
      startY: touch.clientY,
      itemHeight: rect.height,
      clone,
      listEl: selectedListRef.current,
    };
    setDragActiveIndex(index);
    setDropTargetIndex(index);

    // 触发触觉反馈（如果设备支持）
    if (navigator.vibrate) navigator.vibrate(20);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const ds = dragState.current;
    if (!ds.dragging || !ds.clone) return;
    e.preventDefault(); // 阻止页面滚动

    const touch = e.touches[0];
    const deltaY = touch.clientY - ds.startY;
    ds.clone.style.transform = `translateY(${deltaY}px) scale(1.02)`;

    // 计算当前悬停的目标位置
    const newIndex = Math.round(deltaY / ds.itemHeight) + ds.startIndex;
    const clamped = Math.max(0, Math.min(newIndex, tempSelectedUsers.length - 1));
    if (clamped !== ds.currentIndex) {
      ds.currentIndex = clamped;
      setDropTargetIndex(clamped);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, [tempSelectedUsers.length]);

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current;
    if (!ds.dragging) return;

    // 清理克隆节点
    if (ds.clone) {
      ds.clone.remove();
      ds.clone = null;
    }

    const from = ds.startIndex;
    const to = ds.currentIndex;
    ds.dragging = false;

    setDragActiveIndex(null);
    setDropTargetIndex(null);

    if (from !== to && from >= 0 && to >= 0) {
      onReorderUsers(from, to);
    }
  }, [onReorderUsers]);

  // 已选列表（供已选面板使用）
  const renderSelectedList = () => (
    <div ref={selectedListRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
      {tempSelectedUsers.length > 0 ? tempSelectedUsers.map((user, index) => {
          const isDragging = dragActiveIndex === index;
          const isDropTarget = dropTargetIndex === index && dragActiveIndex !== null && dragActiveIndex !== index;
          return (
            <div
              key={user._id}
              onTouchStart={multiple ? (e) => handleTouchStart(e, index) : undefined}
              onTouchMove={multiple ? handleTouchMove : undefined}
              onTouchEnd={multiple ? handleTouchEnd : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderBottom: '1px solid #f5f5f5',
                gap: 10,
                opacity: isDragging ? 0.3 : 1,
                background: isDropTarget ? '#e6f7ff' : '#fff',
                borderTop: isDropTarget ? '2px solid #1890ff' : '2px solid transparent',
                transition: 'background 0.15s, border-top 0.15s, opacity 0.15s',
                touchAction: 'none',
                userSelect: 'none' as any,
              }}
            >
              {multiple && (
                <HolderOutlined style={{ color: '#bbb', fontSize: 16, flexShrink: 0, cursor: 'grab' }} />
              )}
              <Avatar src={user.avatar ? `/api/v6/users/${user.user}/avatar` : undefined} size={36} style={{ backgroundColor: user.avatar ? undefined : '#1890ff', flexShrink: 0 }}>
                {!user.avatar && user.name?.charAt(0)}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                {(user.email || user.mobile || user.username) && (
                  <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                    {user.email || user.mobile || user.username}
                  </div>
                )}
              </div>
              {clearable && (
                <CloseOutlined className="steedos-selected-remove-btn" onClick={() => onRemoveUser(user._id)} style={{ fontSize: 14, color: '#ff4d4f', padding: 8, flexShrink: 0 }} />
              )}
            </div>
          );
        }) : (
          <Empty description="未选择" style={{ marginTop: 60 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>

  );

  return (
    <Drawer
      open={visible}
      placement="bottom"
      height="100vh"
      closable={false}
      destroyOnClose
      rootClassName="steedos-mobile-drawer"
      onClose={onCancel}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' } }}
    >
      <style>{mobileStyles}</style>
      {/* 标题栏 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, minWidth: 60 }}>
          {deptPath.length > 0 && (
            <span onClick={onMobileBack} style={{ color: '#1890ff', fontSize: 18, lineHeight: 1, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', padding: '4px 0' }}>
              <LeftOutlined />
            </span>
          )}
          <span onClick={onCancel} style={{ color: '#666', fontSize: 16, lineHeight: 1, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', padding: '4px 0' }}>
            <CloseOutlined />
          </span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 16 }}>选择人员</span>
        <div style={{ minWidth: 60, display: 'flex', justifyContent: 'flex-end' }}>
          {multiple && users.length > 0 && !isSearchMode && deptPath.length > 0 && (
            <span onClick={onToggleSelectAll} style={{ fontSize: 14, color: '#1890ff', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>{isAllSelected ? '取消全选' : '全选'}</span>
          )}
        </div>
      </div>
      {/* 搜索框 */}
      <div style={{ padding: '4px 16px 8px', flexShrink: 0 }}>
        <Input
          placeholder="搜索姓名、邮箱或用户名"
          prefix={<SearchOutlined />}
          value={searchInputValue}
          onChange={(e) => onUserSearch(e.target.value)}
          allowClear
          size="large"
        />
      </div>
      {/* 搜索与面包屑之间的分隔条 */}
      {deptPath.length > 0 && !isSearchMode && (
        <div style={{ height: 8, background: '#f5f5f5', flexShrink: 0 }} />
      )}
      {/* 面包屑导航（搜索框下方，飞书风格） */}
      {deptPath.length > 0 && !isSearchMode && (() => {
        const showEllipsis = deptPath.length > 2;
        const visiblePath = deptPath.length > 2 ? deptPath.slice(-2) : deptPath;
        const visibleStartIndex = deptPath.length > 2 ? deptPath.length - 2 : 0;
        const truncateName = (name: string) => name.length > 8 ? name.slice(0, 8) + '…' : name;
        return (
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', fontSize: 13, color: '#999', overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0, borderBottom: '1px solid #f0f0f0' }}>
            <span onClick={onBackToRoot} style={{ color: '#1890ff', cursor: 'pointer', flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}>联系人</span>
            {showEllipsis && (
              <>
                <RightOutlined style={{ margin: '0 6px', color: '#ccc', fontSize: 10, flexShrink: 0 }} />
                <span style={{ color: '#999', flexShrink: 0, display: 'flex', alignItems: 'center', lineHeight: 1 }}>···</span>
              </>
            )}
            {visiblePath.map((item, i) => {
              const realIndex = visibleStartIndex + i;
              const isLast = realIndex === deptPath.length - 1;
              return (
                <React.Fragment key={item.id}>
                  <RightOutlined style={{ margin: '0 6px', color: '#ccc', fontSize: 10, flexShrink: 0 }} />
                  {isLast ? (
                    <span style={{ color: '#999', overflow: 'hidden', textOverflow: 'ellipsis' }}>{truncateName(item.name)}</span>
                  ) : (
                    <span onClick={() => onDrillBack(realIndex)} style={{ color: '#1890ff', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', WebkitTapHighlightColor: 'transparent' }}>{truncateName(item.name)}</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      })()}
      {/* 主内容区：通讯录入口(初始页) / 部门卡片(钻入) + 人员列表 */}
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <Spin spinning={loading}>
          {renderRootBar()}
          {renderDeptCards()}
          {renderUserList()}
        </Spin>
      </div>
      {/* 已选面板（覆盖层，点击底部栏"已选N人"切换） */}
      {showSelectedPanel && (
        <div className="steedos-mobile-selected-overlay">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>已选中 ({tempSelectedUsers.length})</span>
            <Button type="text" onClick={onToggleSelectedPanel} style={{ padding: 0, color: '#666' }}>返回</Button>
          </div>
          {clearable && tempSelectedUsers.length > 0 && (
            <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="link" danger size="small" onClick={onClearAll} style={{ padding: 0 }}>清空全部</Button>
            </div>
          )}
          {multiple && tempSelectedUsers.length > 1 && (
            <div style={{ padding: '0 16px 6px', fontSize: 12, color: '#999' }}>长按拖拽可调整顺序</div>
          )}
          {renderSelectedList()}
        </div>
      )}
      {/* 底部操作栏 */}
      {multiple ? (
        <div className="steedos-mobile-bottom-bar">
          <span
            style={{ fontSize: 14, color: tempSelectedUsers.length > 0 ? '#1890ff' : '#666', cursor: 'pointer' }}
            onClick={tempSelectedUsers.length > 0 ? onToggleSelectedPanel : undefined}
          >
            已选 {tempSelectedUsers.length} 人 {tempSelectedUsers.length > 0 && !showSelectedPanel ? '▲' : tempSelectedUsers.length > 0 && showSelectedPanel ? '▼' : ''}
          </span>
          <Button type="primary" onClick={onOk}>确定</Button>
        </div>
      ) : (
        <div className="steedos-mobile-bottom-bar">
          <span style={{ fontSize: 14, color: '#666' }}>
            {tempSelectedUsers.length > 0 ? `已选: ${tempSelectedUsers[0]?.name}` : '请选择人员'}
          </span>
          <Button type="primary" onClick={onOk} disabled={tempSelectedUsers.length === 0}>确定</Button>
        </div>
      )}
    </Drawer>
  );
};
