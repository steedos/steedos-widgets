import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, unstable_batchedUpdates } from 'react-dom';
import { map, keyBy, cloneDeep, keys } from 'lodash';

import { createObject } from '@steedos-widgets/amis-lib'

import {
  CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  useDroppable,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  AnimateLayoutChanges,
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates';

import { Item } from './components/Item'
import { Container, ContainerProps } from './components/';

import { createRange } from '../utilities';

export default {
  title: 'Presets/Sortable/Multiple Containers',
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function DroppableContainer({
  children,
  columns = 1,
  disabled,
  id,
  items,
  style,
  className,
  ...props
}: ContainerProps & {
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
  className: string
}) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
    items.includes(over.id)
    : false;

  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      className={className}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  );
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

interface Props {
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: { index: number }): React.CSSProperties;
  itemCount?: number;
  items?: Items;
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  trashable?: boolean;
  addable?: boolean;
  scrollable?: boolean;
  vertical?: boolean;
  boardSource: [{id:string, label:string}?],
  cardSource: [{id:string, label:string, color: string, columnSpan: number, body: [any]}?],
  value: any,
  onChange: Function,
  data: any,
  dispatchEvent: Function,
  render: Function,
  cardSchema: any,
  boardHeader: any,
  boardFooter: any,
  wrapperClassName: string,
  boardClassName: string,
  cardClassName: string,
}

export const TRASH_ID = 'void';
const PLACEHOLDER_ID = 'placeholder';
const empty: UniqueIdentifier[] = [];

export function MultipleContainers(props) {
  let {
    adjustScale = false,
    itemCount = 3,
    cancelDrop,
    columns = 1,
    handle = true,
    containerStyle,
    coordinateGetter = multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    minimal = false,
    modifiers,
    renderItem,
    strategy = verticalListSortingStrategy,
    addable = false,
    trashable = false,
    vertical = false,
    scrollable,
    boardSource = [],
    cardSource = [],
    value,
    onChange: amisOnChange,
    data: amisData,
    dispatchEvent: amisDispatchEvent,
    render: amisRender,
    cardSchema = [{
      "type": "tpl",
      "tpl": "${label}",
      "inline": false,
    }],
    boardHeader = [{
      "type": "tpl",
      "tpl": "${label}",
    }],
    boardFooter = [],
    wrapperClassName = "gap-2",
    boardClassName = "border rounded",
    cardClassName = "",
  }: Props = props

  value && delete(value.$$id);

  const [items, setItems] = useState<Items>(
    () => {
      return (value as Items) ?? {
        A: ['A1', 'A2'],
        B: ['B1', 'B2'],
        C: ['C1', 'C2'],
      }
    }
  );

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  );

  useEffect(() => {
    setItems(value as Items);
    setContainers(Object.keys(value) as UniqueIdentifier[]);
  }, [value]);

  const handleChange = async (newItems? : any) => {
    if (!amisDispatchEvent || !amisOnChange)
      return 
    const value = newItems || items;

    // 支持 amis OnEvent.change
    const rendererEvent = await amisDispatchEvent(
      'change',
      createObject(amisData, {
        value
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    setTimeout(()=> amisOnChange(value), 500);
  }
  
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
          pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || overId === TRASH_ID || active.id in items) {
          // 拖动的是分组则跳过后面的逻辑
          return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = items[activeContainer];
            const overItems = items[overContainer];
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            let newIndex: number;

            if (overId in items) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (item) => item !== active.id
              ),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(
                  newIndex,
                  items[overContainer].length
                ),
              ],
            };
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        if (overId === TRASH_ID) {
          setItems((items) => ({
            ...items,
            [activeContainer]: items[activeContainer].filter(
              (id) => id !== activeId
            ),
          }));
          setActiveId(null);
          return;
        }

        if (overId === PLACEHOLDER_ID) {
          const newContainerId = getNextContainerId();

          unstable_batchedUpdates(() => {
            setContainers((containers) => [...containers, newContainerId]);
            setItems((items) => ({
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (id) => id !== activeId
              ),
              [newContainerId]: [active.id],
            }));
            // console.log('拖动结束，更新form value')
            handleChange()
            setActiveId(null);
          });
          return;
        }

        const overContainer = findContainer(overId);

        let newItems = items;

        if (overContainer) {
          if(activeContainer !== overContainer){
            // 拖动变更分组之间的顺序时，activeContainer 与 overContainer 值不相等
            setTimeout(function(){
              const sortedGroups = over.data.current.sortable.items; //不加setTimeout的话，这里拿到的会是变更前的数据
              newItems = {};
              sortedGroups.forEach((groupKey: string) => {
                newItems[groupKey] = items[groupKey];
              });
              delete newItems[TRASH_ID];
              delete newItems[PLACEHOLDER_ID];
              if(keys(items).join(",") !== keys(newItems).join(",")){
              // 只有顺序发生变化时才触发change事件
                setItems(newItems);
                // console.log('拖动结束2，更新form value')
                handleChange(newItems)
              }

              setActiveId(null);
            },500);
            return;
          }
          else {
            // 同一个分组中字段顺序变更以及把一个字段从某个分组拖动到另一个分组内时，activeContainer 与 overContainer 值相等
            const activeIndex = items[activeContainer].indexOf(active.id);
            const overIndex = items[overContainer].indexOf(overId);
  
            if (activeIndex !== overIndex) {
              setItems((items) => {
                newItems = {
                  ...items,
                  [overContainer]: arrayMove(
                    items[overContainer],
                    activeIndex,
                    overIndex
                  ),
                }
                return newItems;
              });
            }
          }
        }

        setActiveId(null);

        // console.log('拖动结束2，更新form value')
        handleChange(newItems)
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        style={{
          display: 'inline-grid',
          boxSizing: 'border-box',
          gridAutoFlow: vertical ? 'row' : 'column',
          width: vertical? '100%': 'auto'
        }}
        className={wrapperClassName}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={
            vertical
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {containers.map((containerId) => {
            const container = cloneDeep(keyBy(boardSource, 'id')[containerId]) || {id: containerId, label: 'Container ' + containerId}
            return (
            <DroppableContainer
              key={containerId}
              // id={containerId}
              // label={container.label}
              columns={columns}
              items={items[containerId]}
              scrollable={scrollable}
              style={containerStyle}
              className={boardClassName}
              unstyled={minimal}
              // onRemove={() => handleRemove(containerId)}
              {...container}
              label={amisRender? amisRender('body', boardHeader, {data: {...container}}) : (
                <span>{container.label}</span>
              )}
              footer={amisRender? amisRender('body', boardFooter, {data: {...container}}) : (<></>)}
            >
              <SortableContext 
                items={items[containerId]} 
                strategy={strategy}
                >
                {items[containerId].map((value, index) => {
                  const item = cloneDeep(keyBy(cardSource, 'id')[value]) || {id: value, label: '' + value, columnSpan:1, body: cardSchema}
                  if (item.columnSpan && item.columnSpan > columns)
                    item.columnSpan = columns
                  if (!item.body) 
                    item.body = cardSchema
                  return (
                    <SortableItem
                      disabled={isSortingContainer}
                      key={value}
                      value={amisRender? amisRender('body', item.body, {data: {...item}}) : (
                        <span>{item.label}</span>
                      )}
                      index={index}
                      handle={handle}
                      style={getItemStyles}
                      wrapperStyle={wrapperStyle}
                      renderItem={renderItem}
                      containerId={containerId}
                      getIndex={getIndex}
                      className={cardClassName}
                      {...item}
                    />
                  );
                })}
              </SortableContext>
            </DroppableContainer>
          )})}
          {minimal || !addable ? undefined : (
            <DroppableContainer
              id={PLACEHOLDER_ID}
              disabled={isSortingContainer}
              items={empty}
              onClick={handleAddColumn}
              placeholder
            >
              + Add
            </DroppableContainer>
          )}
        </SortableContext>

        {createPortal(
          <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
            {activeId
              ? containers.includes(activeId)
                ? renderContainerDragOverlay(activeId)
                : renderSortableItemDragOverlay(activeId)
              : null}
          </DragOverlay>,
          document.body
        )}
        {trashable && activeId && !containers.includes(activeId) ? (
          <Trash id={TRASH_ID} />
        ) : null}
      </div>
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    const item = cloneDeep(keyBy(cardSource, 'id')[id]) || {id: id, label: '' + id, columnSpan:1}
    if (item.columnSpan && item.columnSpan > columns)
      item.columnSpan = columns
    return (
      <Item
        value={amisRender? amisRender('body', cardSchema, {data: {...item}}) : (
          <span>{item.label}</span>
        )}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    );
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {            
    const container = cloneDeep(keyBy(boardSource, 'id')[containerId]) || {id: containerId, label: 'Container ' + containerId}

    return (
      <Container
        label={amisRender? amisRender('body', boardHeader, {data: {...container}}) : (
          <span>{container.label}</span>
        )}
        columns={columns}
        style={{
          height: '100%',
        }}
        className={boardClassName}
        unstyled={false}
      >
        {items[containerId].map((id, index) => {
          const item = cloneDeep(keyBy(cardSource, 'id')[id]) || {id: id, label: '' + id, columnSpan:1}
          return (
          <Item
            key={id}
            handle={handle}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(id),
              value: id,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(id)}
            wrapperStyle={wrapperStyle({ id })}
            renderItem={renderItem}
            className={cardClassName}
            value={amisRender? amisRender('body', cardSchema, {data: {...item}}) : (
              <span>{item.label}</span>
            )}
          />
          )}
        )}
      </Container>
    );
  }

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers((containers) =>
      containers.filter((id) => id !== containerID)
    );
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId();

    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, newContainerId]);
      setItems((items) => ({
        ...items,
        [newContainerId]: [],
      }));
    });
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  }

  function getColor(id: UniqueIdentifier) {
    const item  = cloneDeep(keyBy(cardSource, 'id')[id])
    return item && item.color? item.color : undefined
  }

  function SortableItem({
    disabled,
    id,
    label,
    index,
    handle,
    renderItem,
    style,
    containerId,
    getIndex,
    value,
    wrapperStyle,
    className,
    ...props
  }: SortableItemProps) {
    const {
      setNodeRef,
      setActivatorNodeRef,
      listeners,
      isDragging,
      isSorting,
      over,
      overIndex,
      transform,
      transition,
    } = useSortable({
      id,
    });
    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;
  
    return (
      <Item
        ref={disabled ? undefined : setNodeRef}
        value={value}
        dragging={isDragging}
        sorting={isSorting}
        handle={handle}
        handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
        index={index}
        wrapperStyle={wrapperStyle({ index })}
        style={style({
          index,
          value: id,
          isDragging,
          isSorting,
          overIndex: over ? getIndex(over.id) : overIndex,
          containerId,
        })}
        color={getColor(id)}
        transition={transition}
        transform={transform}
        fadeIn={mountedWhileDragging}
        listeners={listeners}
        renderItem={renderItem}
        className={className}
        {...props}
      />
    );
  }
  
}

function Trash({ id }: { id: UniqueIdentifier }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '50%',
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 60,
        borderRadius: 5,
        border: '1px solid',
        borderColor: isOver ? 'red' : '#DDD',
      }}
    >
      Drop here to delete
    </div>
  );
}

interface SortableItemProps {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  label: string,
  index: number;
  handle: boolean;
  value: any;
  disabled?: boolean;
  className: string;
  style(args: any): React.CSSProperties;
  getIndex(id: UniqueIdentifier): number;
  renderItem(): React.ReactElement;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
