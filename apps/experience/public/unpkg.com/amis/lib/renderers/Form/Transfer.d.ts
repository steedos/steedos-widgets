import React from 'react';
import { OptionsControlProps } from 'amis-core';
import type { Option } from 'amis-core';
import { FormOptionsSchema, SchemaApi, SchemaObject } from '../../Schema';
import { ActionObject } from 'amis-core';
import type { ItemRenderStates } from 'amis-ui/lib/components/Selection';
/**
 * Transfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/transfer
 */
export interface TransferControlSchema extends FormOptionsSchema {
    type: 'transfer';
    /**
     * 是否显示剪头
     */
    showArrow?: boolean;
    /**
     * 可排序？
     */
    sortable?: boolean;
    /**
     * 勾选展示模式
     */
    selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';
    /**
     * 结果面板是否追踪显示
     */
    resultListModeFollowSelect?: boolean;
    /**
     * 当 selectMode 为 associated 时用来定义左侧的选项
     */
    leftOptions?: Array<Option>;
    /**
     * 当 selectMode 为 associated 时用来定义左侧的选择模式
     */
    leftMode?: 'tree' | 'list';
    /**
     * 当 selectMode 为 associated 时用来定义右侧的选择模式
     */
    rightMode?: 'table' | 'list' | 'tree' | 'chained';
    /**
     * 搜索结果展示模式
     */
    searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
    /**
     * 当 selectMode 为 table 时定义表格列信息。
     */
    columns?: Array<any>;
    /**
     * 当 searchResultMode 为 table 时定义表格列信息。
     */
    searchResultColumns?: Array<any>;
    /**
     * 可搜索？
     */
    searchable?: boolean;
    /**
     * 结果（右则）列表的检索功能，当设置为true时，可以通过输入检索模糊匹配检索内容
     */
    resultSearchable?: boolean;
    /**
     * 搜索 API
     */
    searchApi?: SchemaApi;
    /**
     * 左侧的标题文字
     */
    selectTitle?: string;
    /**
     * 右侧结果的标题文字
     */
    resultTitle?: string;
    /**
     * 用来丰富选项展示
     */
    menuTpl?: SchemaObject;
    /**
     * 用来丰富值的展示
     */
    valueTpl?: SchemaObject;
    /**
     * 左侧列表搜索框提示
     */
    searchPlaceholder?: string;
    /**
     * 右侧列表搜索框提示
     */
    resultSearchPlaceholder?: string;
}
export interface BaseTransferProps extends OptionsControlProps, Omit<TransferControlSchema, 'type' | 'options' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    resultItemRender?: (option: Option) => JSX.Element;
}
export declare class BaseTransferRenderer<T extends OptionsControlProps = BaseTransferProps> extends React.Component<T> {
    tranferRef?: any;
    reload(): void;
    handleChange(value: Array<Option> | Option, optionModified?: boolean): Promise<void>;
    option2value(option: Option): Option;
    handleSearch(term: string, cancelExecutor: Function): Promise<any[]>;
    handleResultSearch(term: string, item: Option): boolean;
    optionItemRender(option: Option, states: ItemRenderStates): JSX.Element;
    resultItemRender(option: Option, states: ItemRenderStates): JSX.Element;
    renderCell(column: {
        name: string;
        label: string;
        [propName: string]: any;
    }, option: Option, colIndex: number, rowIndex: number): JSX.Element;
    getRef(ref: any): void;
    onSelectAll(options: Option[]): void;
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    render(): JSX.Element;
}
export declare class TransferRender extends BaseTransferRenderer {
}
declare const _default: typeof TransferRender;
export default _default;
