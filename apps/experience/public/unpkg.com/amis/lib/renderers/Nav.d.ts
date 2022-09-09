/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { RendererEnv, RendererProps } from 'amis-core';
import { ThemeProps } from 'amis-core';
import { BadgeObject } from 'amis-ui';
import { IScopedContext } from 'amis-core';
import type { BaseSchema, SchemaObject, SchemaApi, SchemaIcon, SchemaUrlPath, SchemaCollection, SchemaClassName } from '../Schema';
export declare type NavItemSchema = {
    /**
     * 文字说明
     */
    label?: string | SchemaCollection;
    /**
     * 图标类名，参考 fontawesome 4。
     */
    icon?: SchemaIcon;
    to?: SchemaUrlPath;
    target?: string;
    unfolded?: boolean;
    active?: boolean;
    defer?: boolean;
    deferApi?: SchemaApi;
    children?: Array<NavItemSchema>;
} & Omit<BaseSchema, 'type'>;
export interface NavOverflow {
    /**
     * 是否开启响应式收纳
     */
    enable: boolean;
    /**
     * 菜单触发按钮的文字
     */
    overflowLabel?: string | SchemaObject;
    /**
     * 菜单触发按钮的图标
     * @default "fa fa-ellipsis"
     */
    overflowIndicator?: SchemaIcon;
    /**
     * 菜单触发按钮CSS类名
     */
    overflowClassName?: SchemaClassName;
    /**
     * Popover浮层CSS类名
     */
    overflowPopoverClassName?: SchemaClassName;
    /**
     * 菜单外层CSS类名
     */
    overflowListClassName?: SchemaClassName;
    /**
     * 导航横向布局时，开启开启响应式收纳后最大可显示数量，超出此数量的导航将被收纳到下拉菜单中
     */
    maxVisibleCount?: number;
    /**
     * 包裹导航的外层标签名，可以使用其他标签渲染
     * @default "ul"
     */
    wrapperComponent?: string;
    /**
     * 导航项目宽度
     * @default 160
     */
    itemWidth?: number;
    /**
     * 导航列表后缀节点
     */
    overflowSuffix?: SchemaCollection;
    /**
     * 自定义样式
     */
    style?: React.CSSProperties;
    /**
     * 菜单DOM挂载点
     */
    popOverContainer?: any;
}
/**
 * Nav 导航渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/nav
 */
export interface NavSchema extends BaseSchema {
    /**
     * 指定为 Nav 导航渲染器
     */
    type: 'nav';
    /**
     * 链接地址集合
     */
    links?: Array<NavItemSchema>;
    /**
     * @default 24
     */
    indentSize: number;
    /**
     * 可以通过 API 拉取。
     */
    source?: SchemaApi;
    /**
     * 懒加载 api，如果不配置复用 source 接口。
     */
    deferApi?: SchemaApi;
    /**
     * true 为垂直排列，false 为水平排列类似如 tabs。
     */
    stacked?: boolean;
    /**
     * 更多操作菜单列表
     */
    itemActions?: SchemaCollection;
    /**
     * 可拖拽
     */
    draggable?: boolean;
    /**
     * 保存排序的 api
     */
    saveOrderApi?: SchemaApi;
    /**
     * 角标
     */
    itemBadge?: BadgeObject;
    /**
     * 仅允许同层级拖拽
     */
    dragOnSameLevel?: boolean;
    /**
     * 横向导航时自动收纳配置
     */
    overflow?: NavOverflow;
}
export interface Link {
    className?: string;
    label?: string | SchemaCollection;
    to?: string;
    target?: string;
    icon?: string;
    active?: boolean;
    activeOn?: string;
    unfolded?: boolean;
    children?: Links;
    defer?: boolean;
    loading?: boolean;
    loaded?: boolean;
    [propName: string]: any;
    itemBadge?: BadgeObject;
}
export interface Links extends Array<Link> {
}
export interface NavigationState {
    error?: string;
    dropIndicator?: {
        top: number;
        left: number;
        width: number;
        height?: number;
        opacity?: number;
    };
}
export interface NavigationProps extends ThemeProps, Omit<NavSchema, 'type' | 'className'> {
    onSelect?: (item: Link) => void | false;
    onToggle?: (item: Link, forceFold?: boolean) => void;
    onDragUpdate?: (dropInfo: IDropInfo) => void;
    onOrderChange?: (res: Link[]) => void;
    togglerClassName?: string;
    links?: Array<Link>;
    loading?: boolean;
    render: RendererProps['render'];
    env: RendererEnv;
    data: Object;
    reload?: any;
    overflow?: NavOverflow;
}
export interface IDropInfo {
    dragLink: Link | null;
    nodeId: string;
    position: string;
    rect: DOMRect;
    height: number;
    left: number;
}
export declare class Navigation extends React.Component<NavigationProps, NavigationState> {
    static defaultProps: Pick<NavigationProps, 'indentSize'>;
    dragNode: {
        node: HTMLElement;
        link: Link | null;
    } | null;
    dropInfo: IDropInfo | null;
    startPoint: {
        y: number;
        x: number;
    };
    state: NavigationState;
    handleClick(link: Link): void;
    toggleLink(target: Link, forceFold?: boolean): void;
    getDropInfo(e: DragEvent, id: string, depth: number): IDropInfo;
    updateDropIndicator(e: DragEvent): void;
    handleDragStart(link: Link): (e: React.DragEvent) => void;
    handleDragOver(e: DragEvent): void;
    handleDragEnd(e: DragEvent): void;
    renderItem(link: Link, index: number, depth?: number): JSX.Element | null;
    renderOverflowNavs(overflowConfig: NavOverflow): JSX.Element;
    render(): JSX.Element;
}
declare const ThemedNavigation: {
    new (props: Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps): {
        ref: any; /**
         * 包裹导航的外层标签名，可以使用其他标签渲染
         * @default "ul"
         */
        childRef(ref: any): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode; /**
             * 懒加载 api，如果不配置复用 source 接口。
             */
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "itemBadge" | "loading" | "reload" | "data" | "draggable" | "itemActions" | "onSelect" | "render" | "env" | "deferApi" | "onToggle" | "saveOrderApi" | "links" | "stacked" | "dragOnSameLevel" | "overflow" | "onDragUpdate" | "onOrderChange" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<Pick<NavigationProps, "indentSize">, never>> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Navigation>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Navigation, {}> & {
    ComposedComponent: typeof Navigation;
};
export default ThemedNavigation;
export declare class NavigationRenderer extends React.Component<RendererProps> {
    static contextType: React.Context<IScopedContext>;
    remoteRef: {
        loadConfig: (ctx?: any) => Promise<any> | void;
        setConfig: (value: any) => void;
    } | undefined;
    remoteConfigRef(ref: any): void;
    constructor(props: RendererProps, context: IScopedContext);
    componentWillUnmount(): void;
    reload(target?: string, query?: any, values?: object): void;
    receive(values: object): void;
    render(): JSX.Element;
}
