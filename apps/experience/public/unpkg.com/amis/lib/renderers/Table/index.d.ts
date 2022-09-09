import React from 'react';
import { IScopedContext, SchemaExpression } from 'amis-core';
import { RendererProps } from 'amis-core';
import { SchemaNode, ActionObject } from 'amis-core';
import { BadgeObject } from 'amis-ui';
import { ITableStore } from 'amis-core';
import Sortable from 'sortablejs';
import { TableCell } from './TableCell';
import { BaseSchema, SchemaApi, SchemaClassName, SchemaObject, SchemaTokenizeableString, SchemaTpl } from '../../Schema';
import { SchemaPopOver } from '../PopOver';
import { SchemaQuickEdit } from '../QuickEdit';
import { SchemaCopyable } from '../Copyable';
import { SchemaRemark } from '../Remark';
import type { IColumn, IRow } from 'amis-core/lib/store/table';
/**
 * 表格列，不指定类型时默认为文本类型。
 */
export declare type TableColumnObject = {
    /**
     * 列标题
     */
    label: string;
    /**
     * 配置是否固定当前列
     */
    fixed?: 'left' | 'right' | 'none';
    /**
     * 绑定字段名
     */
    name?: string;
    /**
     * 配置查看详情功能
     */
    popOver?: SchemaPopOver;
    /**
     * 配置快速编辑功能
     */
    quickEdit?: SchemaQuickEdit;
    /**
     * 作为表单项时，可以单独配置编辑时的快速编辑面板。
     */
    quickEditOnUpdate?: SchemaQuickEdit;
    /**
     * 配置点击复制功能
     */
    copyable?: SchemaCopyable;
    /**
     * 配置是否可以排序
     */
    sortable?: boolean;
    /**
     * 是否可快速搜索
     */
    searchable?: boolean | SchemaObject;
    /**
     * 配置是否默认展示
     */
    toggled?: boolean;
    /**
     * 列宽度
     */
    width?: number | string;
    /**
     * 列对齐方式
     */
    align?: 'left' | 'right' | 'center' | 'justify';
    /**
     * 列样式表
     */
    className?: string;
    /**
     * 单元格样式表达式
     */
    classNameExpr?: string;
    /**
     * 列头样式表
     */
    labelClassName?: string;
    /**
     * todo
     */
    filterable?: boolean | {
        source?: string;
        options?: Array<any>;
    };
    /**
     * 结合表格的 footable 一起使用。
     * 填写 *、xs、sm、md、lg指定 footable 的触发条件，可以填写多个用空格隔开
     */
    breakpoint?: '*' | 'xs' | 'sm' | 'md' | 'lg';
    /**
     * 提示信息
     */
    remark?: SchemaRemark;
    /**
     * 默认值, 只有在 inputTable 里面才有用
     */
    value?: any;
    /**
     * 是否唯一, 只有在 inputTable 里面才有用
     */
    unique?: boolean;
    /**
     * 表格列单元格是否可以获取父级数据域值，默认为true，该配置对当前列内单元格生效
     */
    canAccessSuperData?: boolean;
};
export declare type TableColumnWithType = SchemaObject & TableColumnObject;
export declare type TableColumn = TableColumnWithType | TableColumnObject;
interface AutoFillHeightObject {
    height: number;
}
/**
 * Table 表格渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/table
 */
export interface TableSchema extends BaseSchema {
    /**
     * 指定为表格渲染器。
     */
    type: 'table' | 'static-table';
    /**
     * 是否固定表头
     */
    affixHeader?: boolean;
    /**
     * 表格的列信息
     */
    columns?: Array<TableColumn>;
    /**
     * 展示列显示开关，自动即：列数量大于或等于5个时自动开启
     */
    columnsTogglable?: boolean | 'auto';
    /**
     * 是否开启底部展示功能，适合移动端展示
     */
    footable?: boolean | {
        expand?: 'first' | 'all' | 'none';
        /**
         * 是否为手风琴模式
         */
        accordion?: boolean;
    };
    /**
     * 底部外层 CSS 类名
     */
    footerClassName?: SchemaClassName;
    /**
     * 顶部外层 CSS 类名
     */
    headerClassName?: SchemaClassName;
    /**
     * 占位符
     */
    placeholder?: string | SchemaTpl;
    /**
     * 是否显示底部
     */
    showFooter?: boolean;
    /**
     * 是否显示头部
     */
    showHeader?: boolean;
    /**
     * 数据源：绑定当前环境变量
     */
    source?: SchemaTokenizeableString;
    /**
     * 表格 CSS 类名
     */
    tableClassName?: SchemaClassName;
    /**
     * 标题
     */
    title?: string;
    /**
     * 工具栏 CSS 类名
     */
    toolbarClassName?: SchemaClassName;
    /**
     * 合并单元格配置，配置数字表示从左到右的多少列自动合并单元格。
     */
    combineNum?: number | SchemaExpression;
    /**
     * 合并单元格配置，配置从第几列开始合并。
     */
    combineFromIndex?: number;
    /**
     * 顶部总结行
     */
    prefixRow?: Array<SchemaObject>;
    /**
     * 底部总结行
     */
    affixRow?: Array<SchemaObject>;
    /**
     * 是否可调整列宽
     */
    resizable?: boolean;
    /**
     * 行样式表表达式
     */
    rowClassNameExpr?: string;
    /**
     * 行角标
     */
    itemBadge?: BadgeObject;
    /**
     * 开启查询区域，会根据列元素的searchable属性值，自动生成查询条件表单
     */
    autoGenerateFilter?: boolean;
    /**
     * 表格是否可以获取父级数据域值，默认为false
     */
    canAccessSuperData?: boolean;
    /**
     * 表格自动计算高度
     */
    autoFillHeight?: boolean | AutoFillHeightObject;
}
export interface TableProps extends RendererProps {
    title?: string;
    header?: SchemaNode;
    footer?: SchemaNode;
    actions?: ActionObject[];
    className?: string;
    headerClassName?: string;
    footerClassName?: string;
    store: ITableStore;
    columns?: Array<any>;
    headingClassName?: string;
    toolbarClassName?: string;
    headerToolbarClassName?: string;
    footerToolbarClassName?: string;
    tableClassName?: string;
    source?: string;
    selectable?: boolean;
    selected?: Array<any>;
    maxKeepItemSelectionLength?: number;
    valueField?: string;
    draggable?: boolean;
    columnsTogglable?: boolean | 'auto';
    affixHeader?: boolean;
    affixColumns?: boolean;
    combineNum?: number | SchemaExpression;
    combineFromIndex?: number;
    footable?: boolean | {
        expand?: 'first' | 'all' | 'none';
        expandAll?: boolean;
        accordion?: boolean;
    };
    expandConfig?: {
        expand?: 'first' | 'all' | 'none';
        expandAll?: boolean;
        accordion?: boolean;
    };
    itemCheckableOn?: string;
    itemDraggableOn?: string;
    itemActions?: Array<ActionObject>;
    onSelect: (selectedItems: Array<object>, unSelectedItems: Array<object>) => void;
    onPristineChange?: (data: object, rowIndexe: string) => void;
    onSave?: (items: Array<object> | object, diff: Array<object> | object, rowIndexes: Array<string> | string, unModifiedItems?: Array<object>, rowOrigins?: Array<object> | object, options?: {
        resetOnFailed?: boolean;
        reload?: string;
    }) => void;
    onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
    onQuery: (values: object) => void;
    onImageEnlarge?: (data: any, target: any) => void;
    buildItemProps?: (item: any, index: number) => any;
    checkOnItemClick?: boolean;
    hideCheckToggler?: boolean;
    rowClassName?: string;
    rowClassNameExpr?: string;
    popOverContainer?: any;
    canAccessSuperData?: boolean;
    reUseRow?: boolean;
    itemBadge?: BadgeObject;
    loading?: boolean;
    autoFillHeight?: boolean | AutoFillHeightObject;
}
export declare type ExportExcelToolbar = SchemaNode & {
    api?: SchemaApi;
    columns?: string[];
    exportColumns?: any[];
    filename?: string;
};
export declare type TableRendererEvent = 'selectedChange' | 'columnSort' | 'columnFilter' | 'columnSearch' | 'columnToggled' | 'orderChange' | 'rowClick';
export declare type TableRendererAction = 'selectAll' | 'clearAll' | 'select' | 'initDrag';
export default class Table extends React.Component<TableProps, object> {
    static contextType: React.Context<IScopedContext>;
    static propsList: Array<string>;
    static defaultProps: Partial<TableProps>;
    table?: HTMLTableElement;
    sortable?: Sortable;
    dragTip?: HTMLElement;
    affixedTable?: HTMLTableElement;
    parentNode?: HTMLElement | Window;
    lastScrollLeft: number;
    lastScrollTop: number;
    totalWidth: number;
    totalHeight: number;
    outterWidth: number;
    outterHeight: number;
    unSensor?: Function;
    updateTableInfoLazy: () => void;
    widths: {
        [propName: string]: number;
    };
    widths2: {
        [propName: string]: number;
    };
    heights: {
        [propName: string]: number;
    };
    renderedToolbars: Array<string>;
    subForms: any;
    timer: ReturnType<typeof setTimeout>;
    constructor(props: TableProps, context: IScopedContext);
    static syncRows(store: ITableStore, props: TableProps, prevProps?: TableProps): boolean;
    componentDidMount(): void;
    /**
     * 自动设置表格高度占满界面剩余区域
     * 用 css 实现有点麻烦，要改很多结构，所以先用 dom hack 了，避免对之前的功能有影响
     */
    updateAutoFillHeight(): void;
    componentDidUpdate(prevProps: TableProps): void;
    componentWillUnmount(): void;
    subFormRef(form: any, x: number, y: number): void;
    handleAction(e: React.UIEvent<any> | undefined, action: ActionObject, ctx: object): void;
    handleCheck(item: IRow, value: boolean, shift?: boolean): Promise<void>;
    handleCheckAll(): Promise<void>;
    handleQuickChange(item: IRow, values: object, saveImmediately?: boolean | any, savePristine?: boolean, options?: {
        resetOnFailed?: boolean;
        reload?: string;
    }): void;
    handleSave(): Promise<void>;
    handleSaveOrder(): Promise<void>;
    syncSelected(): void;
    reset(): void;
    bulkUpdate(value: any, items: Array<object>): void;
    getSelected(): any[];
    affixDetect(): void;
    updateTableInfo(): void;
    handleOutterScroll(): void;
    handleFixedColumnsScroll(event: React.UIEvent<any>): void;
    tableRef(ref: HTMLTableElement): void;
    dragTipRef(ref: any): void;
    affixedTableRef(ref: HTMLTableElement): void;
    initDragging(): void;
    destroyDragging(): void;
    getPopOverContainer(): Element | Text | null;
    handleMouseMove(e: React.MouseEvent<any>): void;
    handleMouseLeave(): void;
    draggingTr: HTMLTableRowElement;
    originIndex: number;
    draggingSibling: Array<HTMLTableRowElement>;
    handleDragStart(e: React.DragEvent): void;
    handleDragOver(e: any): void;
    handleDrop(): Promise<void>;
    handleDragEnd(): void;
    handleImageEnlarge(info: any, target: {
        rowIndex: number;
        colIndex: number;
    }): void;
    resizeLine: HTMLElement;
    resizeLineLeft: number;
    targetTh: HTMLElement;
    targetThWidth: number;
    lineStartX: number;
    handleColResizeMouseDown(e: React.MouseEvent<HTMLElement>): void;
    handleColResizeMouseMove(e: MouseEvent): void;
    handleColResizeMouseUp(e: MouseEvent): void;
    handleColumnToggle(columns: Array<IColumn>): void;
    renderAutoFilterForm(): React.ReactNode;
    renderHeading(): JSX.Element | null;
    renderHeadCell(column: IColumn, props?: any): JSX.Element;
    renderCell(region: string, column: IColumn, item: IRow, props: any, ignoreDrag?: boolean): JSX.Element | null;
    renderAffixHeader(tableClassName: string): JSX.Element | null;
    renderFixedColumns(rows: Array<any>, columns: Array<IColumn>, headerOnly?: boolean, tableClassName?: string): JSX.Element;
    renderToolbar(toolbar: SchemaNode): JSX.Element | null | undefined;
    renderColumnsToggler(config?: any): JSX.Element | null;
    renderDragToggler(): JSX.Element | null;
    renderExportExcel(toolbar: ExportExcelToolbar): JSX.Element | null;
    renderActions(region: string): JSX.Element | null;
    renderHeader(editable?: boolean): JSX.Element | JSX.Element[] | null;
    renderFooter(): JSX.Element | JSX.Element[] | null;
    renderTableContent(): JSX.Element;
    doAction(action: ActionObject, args: any, throwErrors: boolean): any;
    render(): JSX.Element;
}
export declare class TableRenderer extends Table {
    receive(values: any, subPath?: string): void;
    reload(subPath?: string, query?: any, ctx?: any): void;
}
export { TableCell };
