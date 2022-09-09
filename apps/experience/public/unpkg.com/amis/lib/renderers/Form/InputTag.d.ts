import React from 'react';
import { OptionsControlProps, Option } from 'amis-core';
import { ActionObject } from 'amis-core';
import { FormOptionsSchema } from '../../Schema';
/**
 * Tag 输入框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tag
 */
export interface TagControlSchema extends FormOptionsSchema {
    type: 'input-tag';
    /**
     * 选项提示信息
     */
    optionsTip?: string;
    /**
     * 是否为下拉模式
     */
    dropdown?: boolean;
    /**
     * 允许添加的标签的最大数量
     */
    max?: number;
    /**
     * 单个标签的最大文本长度
     */
    maxTagLength?: number;
    /**
     * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
     */
    maxTagCount?: number;
    /**
     * 收纳标签的Popover配置
     */
    overflowTagPopover?: object;
    /** 是否开启批量添加模式 */
    enableBatchAdd: boolean;
    /**
     * 开启批量添加后，输入多个标签的分隔符，支持传入多个符号，默认为"-"
     *
     * @default "-"
     */
    separator?: string;
}
export declare type InputTagValidationType = 'max' | 'maxLength';
export interface TagProps extends OptionsControlProps {
    placeholder?: string;
    clearable: boolean;
    resetValue?: any;
    optionsTip: string;
    dropdown?: boolean;
    /** 是否支持批量输入 */
    enableBatchAdd: boolean;
    /** 开启批量添加后，输入多个标签的分隔符，支持传入多个符号，默认为英文逗号 */
    separator?: string;
    /** 允许添加的tag的最大数量 */
    max?: number;
    /** 单个标签的最大文本长度 */
    maxTagLength?: number;
    /** 文本输入后校验失败的callback */
    onInputValidateFailed?(value: string | string[], validationType: InputTagValidationType): void;
}
export interface TagState {
    inputValue: string;
    isFocused?: boolean;
    isOpened?: boolean;
}
export default class TagControl extends React.PureComponent<TagProps, TagState> {
    input: React.RefObject<any>;
    static defaultProps: {
        resetValue: string;
        labelField: string;
        valueField: string;
        multiple: boolean;
        placeholder: string;
        optionsTip: string;
        separator: string;
    };
    state: {
        isOpened: boolean;
        inputValue: string;
        isFocused: boolean;
    };
    componentDidUpdate(prevProps: TagProps): void;
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    dispatchEvent(eventName: string, eventData?: any): Promise<boolean>;
    /** 处理输入的内容 */
    normalizeInputValue(inputValue: string): Option[];
    normalizeOptions(options: Option[]): string | any[];
    /** 输入的内容和存量的内容合并，过滤掉value值相同的 */
    normalizeMergedValue(inputValue: string, normalized?: boolean): string | any[];
    validateInputValue(inputValue: string): boolean;
    getValue(type?: 'push' | 'pop' | 'normal', option?: any): string | any[];
    addItem(option: Option): Promise<void>;
    handleFocus(e: any): Promise<void>;
    handleBlur(e: any): Promise<void>;
    close(): void;
    handleInputChange(text: string): void;
    handleChange(value: Array<Option>): Promise<void>;
    renderItem(item: Option): any;
    handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): Promise<void>;
    handleOptionChange(option: Option): void;
    getTarget(): any;
    getParent(): any;
    reload(): void;
    isReachMax(): boolean;
    render(): JSX.Element;
}
export declare class TagControlRenderer extends TagControl {
}
