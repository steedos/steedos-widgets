import React from 'react';
import { RendererProps } from 'amis-core';
import { Action } from '../types';
import { ICRUDStore } from 'amis-core';
import { IScopedContext } from 'amis-core';
import { BaseSchema, SchemaApi, SchemaExpression, SchemaName, SchemaObject, SchemaTokenizeableString } from '../Schema';
import { CardsSchema } from './Cards';
import { ListSchema } from './List';
import { TableSchema2 } from './Table2';
import { SchemaCollection } from '../Schema';
export declare type CRUDRendererEvent = 'search';
export interface CRUD2CommonSchema extends BaseSchema {
    /**
     *  指定为 CRUD2 渲染器。
     */
    type: 'crud2';
    /**
     * 指定内容区的展示模式。
     */
    mode?: 'table' | 'grid' | 'cards' | /* grid 的别名*/ 'list' | 'table2';
    /**
     * 初始化数据 API
     */
    api?: SchemaApi;
    /**
     * 也可以直接从环境变量中读取，但是不太推荐。
     */
    source?: SchemaTokenizeableString;
    /**
     * 静默拉取
     */
    silentPolling?: boolean;
    /**
     * 设置自动刷新时间
     */
    interval?: number;
    stopAutoRefreshWhen?: SchemaExpression;
    /**
     * 数据展示模式 无限加载 or 分页
     */
    loadType?: 'more' | 'pagination';
    /**
     * 无限加载时，根据此项设置其每页加载数量，可以不限制
     */
    perPage?: number;
    /**
     * 是否为前端单次加载模式，可以用来实现前端分页。
     */
    loadDataOnce?: boolean;
    /**
     * 是否可以选择数据，外部事件动作
     */
    selectable?: boolean;
    /**
     * 是否可以多选数据，仅当selectable为 true 时生效
     */
    multiple?: boolean;
    /**
     * 是否展示已选数据区域，仅当selectable为 true 时生效
     */
    showSelection?: boolean;
    /**
     * 快速编辑后用来批量保存的 API
     */
    quickSaveApi?: SchemaApi;
    /**
     * 快速编辑配置成及时保存时使用的 API
     */
    quickSaveItemApi?: SchemaApi;
    /**
     * 保存排序的 api
     */
    saveOrderApi?: SchemaApi;
    /**
     * 是否将过滤条件的参数同步到地址栏,默认为true
     * @default true
     */
    syncLocation?: boolean;
    /**
     * 设置分页页码字段名。
     * @default page
     */
    pageField?: string;
    /**
     * 设置分页一页显示的多少条数据的字段名。
     * @default perPage
     */
    perPageField?: string;
    name?: SchemaName;
    /**
     * 是否隐藏快速编辑的按钮。
     */
    hideQuickSaveBtn?: boolean;
    /**
     * 是否自动跳顶部，当切分页的时候。
     */
    autoJumpToTopOnPagerChange?: boolean;
    /**
     * 顶部区域
     */
    headerToolbar?: SchemaCollection;
    /**
     * 底部区域
     */
    footerToolbar?: SchemaCollection;
    /**
     * 是否将接口返回的内容自动同步到地址栏，前提是开启了同步地址栏。
     */
    syncResponse2Query?: boolean;
    /**
     * 翻页时是否保留用户已选的数据
     */
    keepItemSelectionOnPageChange?: boolean;
    /**
     * 内容区域占满屏幕剩余空间
     */
    autoFillHeight?: boolean;
}
export declare type CRUD2CardsSchema = CRUD2CommonSchema & {
    mode: 'cards';
} & Omit<CardsSchema, 'type'>;
export declare type CRUD2ListSchema = CRUD2CommonSchema & {
    mode: 'list';
} & Omit<ListSchema, 'type'>;
export declare type CRUD2TableSchema = CRUD2CommonSchema & {
    mode?: 'table2';
} & Omit<TableSchema2, 'type'>;
export declare type CRUD2Schema = CRUD2CardsSchema | CRUD2ListSchema | CRUD2TableSchema;
export interface CRUD2Props extends RendererProps, Omit<CRUD2CommonSchema, 'type' | 'className'> {
    store: ICRUDStore;
    pickerMode?: boolean;
}
export default class CRUD2 extends React.Component<CRUD2Props, any> {
    static propsList: Array<keyof CRUD2Props>;
    static defaultProps: {
        toolbarInline: boolean;
        syncLocation: boolean;
        hideQuickSaveBtn: boolean;
        autoJumpToTopOnPagerChange: boolean;
        silentPolling: boolean;
        autoFillHeight: boolean;
        showSelection: boolean;
        perPage: number;
    };
    control: any;
    lastQuery: any;
    lastData: any;
    timer: ReturnType<typeof setTimeout>;
    mounted: boolean;
    stopingAutoRefresh: boolean;
    constructor(props: CRUD2Props);
    componentDidMount(): void;
    componentDidUpdate(prevProps: CRUD2Props): void;
    componentWillUnmount(): void;
    controlRef(control: any): void;
    initQuery(values: object): void;
    /**
     * 加载更多动作处理器
     */
    handleLoadMore(): void;
    /**
     * 发起一次新的查询，查询条件不同，需要从第一页数据加载
     */
    handleSearch(data: {
        query?: object;
        resetQuery?: boolean;
        replaceQuery?: boolean;
    }): void;
    handleStopAutoRefresh(): void;
    handleStartAutoRefresh(): void;
    reloadTarget(target: string, data: any): void;
    closeTarget(target: string): void;
    updateQuery(newQuery?: any): void;
    /**
     * 更新列表数据
     */
    getData(
    /** 静默更新，不显示加载状态 */
    silent?: boolean, 
    /** 清空已选择数据 */
    clearSelection?: boolean, 
    /** 强制重新加载 */
    forceReload?: boolean, 
    /** 加载更多数据，默认模式取props中的配置，只有事件动作需要直接触发 */
    loadMore?: boolean): void;
    handleChangePage(page: number, perPage?: number): void;
    handleSave(rows: Array<object> | object, diff: Array<object> | object, indexes: Array<string>, unModifiedItems?: Array<any>, rowsOrigin?: Array<object> | object, options?: {
        resetOnFailed?: boolean;
        reload?: string;
    }): void;
    handleSaveOrder(moved: Array<object>, rows: Array<object>): void;
    handleSelect(items: Array<any>, unSelectedItems: Array<any>): void;
    /**
     * 表格列上的筛选触发
     */
    handleTableQuery(values: object, forceReload?: boolean): void;
    reload(subpath?: string, query?: any): void;
    receive(values: object): void;
    doAction(action: Action, data: object, throwErrors?: boolean): any;
    unSelectItem(item: any, index: number): void;
    clearSelection(): void;
    toggleAllColumns(value: boolean): void;
    toggleToggle(toggled: boolean, index: number): void;
    renderChild(region: string, schema: any, props?: object): JSX.Element;
    renderToolbar(region: string, toolbar?: SchemaCollection): JSX.Element[] | null;
    renderFilter(filter: SchemaObject[]): JSX.Element[] | null;
    renderSelection(): React.ReactNode;
    render(): JSX.Element;
}
export declare class CRUD2Renderer extends CRUD2 {
    static contextType: React.Context<IScopedContext>;
    constructor(props: CRUD2Props, context: IScopedContext);
    componentWillUnmount(): void;
    reload(subpath?: string, query?: any, ctx?: any): void;
    receive(values: any, subPath?: string): void;
    reloadTarget(target: string, data: any): void;
    closeTarget(target: string): void;
}
