import React from 'react';
import { OptionsControlProps, Option } from 'amis-core';
import { Api, ActionObject } from 'amis-core';
import { FormOptionsSchema, SchemaApi } from '../../Schema';
import { TransferControlSchema } from './Transfer';
import type { SchemaClassName } from '../../Schema';
import type { TooltipObject } from 'amis-ui/lib/components/TooltipWrapper';
/**
 * Select 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/select
 */
export interface SelectControlSchema extends FormOptionsSchema {
    type: 'select' | 'multi-select';
    /**
     * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
     * 接口可以返回匹配到的选项，帮助用户输入。
     */
    autoComplete?: SchemaApi;
    /**
     * 可以自定义菜单展示。
     */
    menuTpl?: string;
    /**
     * 当在value值未匹配到当前options中的选项时，是否value值对应文本飘红显示
     */
    showInvalidMatch: boolean;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 勾选展示模式
     */
    selectMode?: 'table' | 'group' | 'tree' | 'chained' | 'associated';
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
     * 搜索 API
     */
    searchApi?: SchemaApi;
    /**
     * 单个选项的高度，主要用于虚拟渲染
     */
    itemHeight?: number;
    /**
     * 在选项数量达到多少时开启虚拟渲染
     */
    virtualThreshold?: number;
    /**
     * 可多选条件下，是否可全选
     */
    checkAll?: boolean;
    /**
     * 可多选条件下，是否默认全选中所有值
     */
    defaultCheckAll?: boolean;
    /**
     * 可多选条件下，全选项文案，默认 ”全选“
     */
    checkAllLabel?: string;
    /**
     * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
     */
    maxTagCount?: number;
    /**
     * 收纳标签的Popover配置
     */
    overflowTagPopover?: object;
    /**
     * 选项的自定义CSS类名
     */
    optionClassName?: SchemaClassName;
}
export interface SelectProps extends OptionsControlProps {
    autoComplete?: Api;
    searchable?: boolean;
    showInvalidMatch?: boolean;
    defaultOpen?: boolean;
    useMobileUI?: boolean;
    maxTagCount?: number;
    overflowTagPopover?: TooltipObject;
}
export declare type SelectRendererEvent = 'change' | 'blur' | 'focus' | 'add' | 'edit' | 'delete';
export default class SelectControl extends React.Component<SelectProps, any> {
    static defaultProps: Partial<SelectProps>;
    input: any;
    unHook: Function;
    lazyloadRemote: Function;
    lastTerm: string;
    constructor(props: SelectProps);
    componentDidUpdate(prevProps: SelectProps): void;
    componentWillUnmount(): void;
    inputRef(ref: any): void;
    foucs(): void;
    getValue(value: Option | Array<Option> | string | void): string | void | Option | Option[];
    dispatchEvent(eventName: SelectRendererEvent, eventData?: any): Promise<void>;
    changeValue(value: Option | Array<Option> | string | void): Promise<void>;
    loadRemote(input: string): Promise<(() => void) | {
        options: Option[];
    }>;
    mergeOptions(options: Array<object>): Option[];
    renderMenu(option: Option, state: any): JSX.Element;
    reload(): void;
    option2value(): void;
    renderOtherMode(): JSX.Element;
    doAction(action: ActionObject, data: object, throwErrors: boolean): any;
    render(): JSX.Element;
}
export interface TransferDropDownProps extends OptionsControlProps, Omit<TransferControlSchema, 'type' | 'options' | 'inputClassName' | 'className' | 'descriptionClassName'> {
    borderMode?: 'full' | 'half' | 'none';
    useMobileUI?: boolean;
}
export declare class SelectControlRenderer extends SelectControl {
}
export declare class MultiSelectControlRenderer extends SelectControl {
    static defaultProps: {
        multiple: boolean;
    };
}
