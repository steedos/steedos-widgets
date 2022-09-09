import React from 'react';
import { RendererProps } from 'amis-core';
import { SchemaNode, ActionObject } from 'amis-core';
import { IListStore } from 'amis-core';
import { Action } from '../types';
import Sortable from 'sortablejs';
import { BaseSchema, SchemaClassName, SchemaCollection, SchemaExpression, SchemaTpl, SchemaTokenizeableString } from '../Schema';
import { CardSchema } from './Card';
import { Card2Schema } from './Card2';
import type { IItem } from 'amis-core/lib/store/list';
/**
 * Cards 卡片集合渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface CardsSchema extends BaseSchema {
    /**
     * 指定为 cards 类型
     */
    type: 'cards';
    card?: Partial<CardSchema> | Card2Schema;
    /**
     * 头部 CSS 类名
     */
    headerClassName?: SchemaClassName;
    /**
     * 底部 CSS 类名
     */
    footerClassName?: SchemaClassName;
    /**
     * 卡片 CSS 类名
     *
     * @default Grid-col--sm6 Grid-col--md4 Grid-col--lg3
     */
    itemClassName?: SchemaClassName;
    /**
     * 无数据提示
     *
     * @default 暂无数据
     */
    placeholder?: SchemaTpl;
    /**
     * 是否显示底部
     */
    showFooter?: boolean;
    /**
     * 是否显示头部
     */
    showHeader?: boolean;
    /**
     * 数据源: 绑定当前环境变量
     *
     * @default ${items}
     */
    source?: SchemaTokenizeableString;
    /**
     * 标题
     */
    title?: SchemaTpl;
    /**
     * 是否隐藏勾选框
     */
    hideCheckToggler?: boolean;
    /**
     * 是否固顶
     */
    affixHeader?: boolean;
    /**
     * 顶部区域
     */
    header?: SchemaCollection;
    /**
     * 底部区域
     */
    footer?: SchemaCollection;
    /**
     * 配置某项是否可以点选
     */
    itemCheckableOn?: SchemaExpression;
    /**
     * 配置某项是否可拖拽排序，前提是要开启拖拽功能
     */
    itemDraggableOn?: SchemaExpression;
    /**
     * 点击卡片的时候是否勾选卡片。
     */
    checkOnItemClick?: boolean;
    /**
     * 是否为瀑布流布局？
     */
    masonryLayout?: boolean;
    /**
     * 可以用来作为值的字段
     */
    valueField?: string;
}
export interface Column {
    type: string;
    [propName: string]: any;
}
export declare type CardsRendererEvent = 'change';
export declare type CardsRendererAction = 'check-all';
export interface GridProps extends RendererProps, Omit<CardsSchema, 'className' | 'itemClassName'> {
    store: IListStore;
    selectable?: boolean;
    selected?: Array<any>;
    checkAll?: boolean;
    multiple?: boolean;
    valueField?: string;
    draggable?: boolean;
    dragIcon?: SVGAElement;
    onSelect: (selectedItems: Array<object>, unSelectedItems: Array<object>) => void;
    onSave?: (items: Array<object> | object, diff: Array<object> | object, rowIndexes: Array<number> | number, unModifiedItems?: Array<object>, rowOrigins?: Array<object> | object, options?: {
        resetOnFailed?: boolean;
        reload?: string;
    }) => void;
    onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
    onQuery: (values: object) => void;
}
export default class Cards extends React.Component<GridProps, object> {
    static propsList: Array<string>;
    static defaultProps: Partial<GridProps>;
    dragTip?: HTMLElement;
    sortable?: Sortable;
    parentNode?: any;
    body?: any;
    unSensor: Function;
    renderedToolbars: Array<string>;
    constructor(props: GridProps);
    static syncItems(store: IListStore, props: GridProps, prevProps?: GridProps): boolean;
    componentDidMount(): void;
    componentDidUpdate(prevProps: GridProps): void;
    componentWillUnmount(): void;
    bodyRef(ref: HTMLDivElement): void;
    itemsRef(ref: HTMLDivElement): void;
    affixDetect(): void;
    doAction(action: Action, data: object, throwErrors?: boolean): void;
    handleAction(e: React.UIEvent<any>, action: ActionObject, ctx: object): void;
    handleCheck(item: IItem): void;
    handleCheckAll(): void;
    handleSelectAll(): void;
    handleClearAll(): void;
    syncSelected(): void;
    handleQuickChange(item: IItem, values: object, saveImmediately?: boolean | any, savePristine?: boolean, options?: {
        resetOnFailed?: boolean;
        reload?: string;
    }): void;
    handleSave(): void;
    handleSaveOrder(): void;
    reset(): void;
    bulkUpdate(value: object, items: Array<object>): void;
    getSelected(): any[];
    dragTipRef(ref: any): void;
    initDragging(): void;
    destroyDragging(): void;
    renderActions(region: string): JSX.Element | null;
    renderHeading(): JSX.Element | null;
    renderHeader(): JSX.Element | JSX.Element[] | null;
    renderFooter(): JSX.Element | JSX.Element[] | null;
    renderCheckAll(): JSX.Element | null;
    renderDragToggler(): JSX.Element | null;
    renderToolbar(toolbar: SchemaNode, index: number): JSX.Element | null | undefined;
    renderCard(index: number, card: any, item: IItem, itemClassName: string): JSX.Element;
    render(): JSX.Element;
}
export declare class CardsRenderer extends Cards {
    dragging: boolean;
    selectable: boolean;
    selected: boolean;
    onSelect: boolean;
    title?: string;
    subTitle?: string;
    desc?: string;
    avatar?: string;
    avatarClassName?: string;
    body?: SchemaNode;
    actions?: Array<ActionObject>;
}
