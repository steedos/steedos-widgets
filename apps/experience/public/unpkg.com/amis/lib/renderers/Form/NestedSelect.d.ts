import React from 'react';
import { OptionsControlProps } from 'amis-core';
import { Option, Options } from 'amis-core';
import { ActionObject } from 'amis-core';
import { FormOptionsSchema } from '../../Schema';
/**
 * Nested Select
 * 文档：https://baidu.gitee.io/amis/docs/components/form/nested-select
 */
export interface NestedSelectControlSchema extends FormOptionsSchema {
    type: 'nested-select';
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 弹框的 css 类
     */
    menuClassName?: string;
    /**
     * 父子之间是否完全独立。
     */
    cascade?: boolean;
    /**
     * 选父级的时候是否把子节点的值也包含在内。
     */
    withChildren?: boolean;
    /**
     * 选父级的时候，是否只把子节点的值包含在内
     */
    onlyChildren?: boolean;
    /**
     * 只允许选择叶子节点
     */
    onlyLeaf?: boolean;
    /**
     * 是否隐藏选择框中已选中节点的祖先节点的文本信息
     */
    hideNodePathLabel?: boolean;
}
export interface NestedSelectProps extends OptionsControlProps {
    cascade?: boolean;
    noResultsText?: string;
    withChildren?: boolean;
    onlyChildren?: boolean;
    hideNodePathLabel?: boolean;
    useMobileUI?: boolean;
}
export interface NestedSelectState {
    isOpened?: boolean;
    isFocused?: boolean;
    inputValue?: string;
    stack: Array<Array<Option>>;
}
export default class NestedSelectControl extends React.Component<NestedSelectProps, NestedSelectState> {
    static defaultProps: Partial<NestedSelectProps>;
    target: any;
    input: HTMLInputElement;
    state: NestedSelectState;
    domRef(ref: any): void;
    componentDidUpdate(prevProps: NestedSelectProps): void;
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    dispatchEvent(eventName: string, eventData?: any): Promise<boolean>;
    handleOutClick(e: React.MouseEvent<any>): void;
    handleResultClear(): void;
    close(): void;
    removeItem(index: number, e?: React.MouseEvent<HTMLElement>): Promise<void>;
    renderValue(option: Option, key?: any): any;
    handleOptionClick(option: Option): Promise<void>;
    handleCheck(option: Option | Options, index?: number): Promise<void>;
    allChecked(options: Options): boolean;
    partialChecked(options: Options): boolean;
    reload(): void;
    getValue(): any;
    onFocus(e: any): Promise<void>;
    onBlur(e: any): Promise<void>;
    getTarget(): HTMLElement;
    handleKeyPress(e: React.KeyboardEvent): void;
    handleInputKeyDown(event: React.KeyboardEvent): void;
    handleInputChange(inputValue: string): void;
    handleResultChange(value: Array<Option>): Promise<void>;
    renderOptions(): JSX.Element;
    renderSearchResult(): JSX.Element;
    onMouseEnter(option: Option, index: number, e: MouseEvent): void;
    renderOuter(): JSX.Element;
    render(): JSX.Element;
}
export declare class NestedSelectControlRenderer extends NestedSelectControl {
}
export declare class CascaderSelectControlRenderer extends NestedSelectControl {
}
