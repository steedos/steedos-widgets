import { useCallback, useRef, useState } from 'react';

/**
 * 移动端触摸拖拽排序 Hook。
 *
 * 封装从 MobileDrawerContent 抽出的 touch 事件 + DOM clone 浮层算法，
 * 兼容 iOS Safari（HTML5 drag/drop 在 iOS 上不触发，所以移动端必须自己实现）。
 *
 * 使用方式：
 * ```tsx
 * const { bind, dragActiveIndex, dropTargetIndex } = useTouchSort({
 *   itemCount: items.length,
 *   onReorder: (from, to) => setItems(reorder(items, from, to)),
 *   excludeSelector: '.my-remove-btn', // 在该按钮上按下时不触发拖拽
 * });
 *
 * items.map((item, index) => (
 *   <div {...bind(index)} style={{ touchAction: 'none', userSelect: 'none' }}>...</div>
 * ));
 * ```
 *
 * 视觉反馈建议由调用方根据 dragActiveIndex / dropTargetIndex 自行处理
 * （如原位 opacity:0.3、目标位 borderTop:'2px solid #1890ff'）。
 */
export interface UseTouchSortOptions {
  /** 列表项数量；用于计算拖拽目标 index 的上下边界 */
  itemCount: number;
  /** 拖拽完成时回调，调用方负责实际重排数组 */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** CSS 选择器；若 touchstart 的 target 命中该选择器则不进入拖拽（用于排除删除按钮等子元素） */
  excludeSelector?: string;
  /** 是否触发触觉反馈（开始拖 20ms / 换位 10ms）。默认 true */
  vibrate?: boolean;
}

export interface UseTouchSortReturn {
  /** 把返回值 spread 到列表项 DOM 上即可接入拖拽事件 */
  bind: (index: number) => {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  /** 当前正在被拖动的原始 index；非拖拽态为 null */
  dragActiveIndex: number | null;
  /** 当前手指悬停的目标 index；非拖拽态为 null */
  dropTargetIndex: number | null;
}

export function useTouchSort(options: UseTouchSortOptions): UseTouchSortReturn {
  const { itemCount, onReorder, excludeSelector, vibrate = true } = options;

  // 把 itemCount 放进 ref，避免 handleTouchMove 因 deps 变化频繁重建闭包
  const itemCountRef = useRef(itemCount);
  itemCountRef.current = itemCount;

  // 跨 touch 事件传递的拖拽状态（用 ref 避免 closure 陷阱）
  const dragState = useRef<{
    dragging: boolean;
    startIndex: number;
    currentIndex: number;
    startY: number;
    itemHeight: number;
    clone: HTMLDivElement | null;
  }>({ dragging: false, startIndex: -1, currentIndex: -1, startY: 0, itemHeight: 56, clone: null });

  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const triggerVibrate = (duration: number) => {
    if (vibrate && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(duration);
    }
  };

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    // 在被排除的子元素上（如删除按钮）按下时不触发拖拽
    if (excludeSelector) {
      const target = e.target as HTMLElement;
      if (target && target.closest(excludeSelector)) return;
    }

    const touch = e.touches[0];
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();

    // 创建 fixed 定位的克隆节点作为拖拽浮层
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
    };
    setDragActiveIndex(index);
    setDropTargetIndex(index);

    triggerVibrate(20);
  // 注意：triggerVibrate 是闭包内函数；vibrate 选项变化时需要重建
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeSelector, vibrate]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const ds = dragState.current;
    if (!ds.dragging || !ds.clone) return;
    // 阻止页面跟随手指滚动
    e.preventDefault();

    const touch = e.touches[0];
    const deltaY = touch.clientY - ds.startY;
    ds.clone.style.transform = `translateY(${deltaY}px) scale(1.02)`;

    const newIndex = Math.round(deltaY / ds.itemHeight) + ds.startIndex;
    const clamped = Math.max(0, Math.min(newIndex, itemCountRef.current - 1));
    if (clamped !== ds.currentIndex) {
      ds.currentIndex = clamped;
      setDropTargetIndex(clamped);
      triggerVibrate(10);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibrate]);

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current;
    if (!ds.dragging) return;

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
      onReorder(from, to);
    }
  }, [onReorder]);

  const bind = useCallback((index: number) => ({
    onTouchStart: (e: React.TouchEvent) => handleTouchStart(e, index),
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }), [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { bind, dragActiveIndex, dropTargetIndex };
}
