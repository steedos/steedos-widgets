import React from 'react';
import { FormControlProps } from 'amis-core';
import { Option, PlainObject, ActionObject } from 'amis-core';
import { FormBaseControlSchema } from '../../Schema';
/**
 * 数字输入框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/number
 */
export interface NumberControlSchema extends FormBaseControlSchema {
    type: 'input-number';
    /**
     * 最大值
     */
    max?: number;
    /**
     * 最小值
     */
    min?: number;
    /**
     * 步长
     */
    step?: number;
    /**
     * 精度
     */
    precision?: number;
    /**
     * 默认当然是
     */
    showSteps?: boolean;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 前缀
     */
    prefix?: string;
    /**
     * 后缀
     */
    suffix?: string;
    /**
     * 单位列表
     */
    unitOptions?: string | Array<Option> | string[] | PlainObject;
    /**
     * 是否千分分隔
     */
    kilobitSeparator?: boolean;
    /**
     * 只读
     */
    readOnly?: boolean;
    /**
     * 是否启用键盘行为
     */
    keyboard?: boolean;
    /**
     * 输入框为基础输入框还是加强输入框
     */
    displayMode?: 'base' | 'enhance';
}
export interface NumberProps extends FormControlProps {
    placeholder?: string;
    max?: number | string;
    min?: number | string;
    step?: number;
    precision?: number;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 前缀
     */
    prefix?: string;
    /**
     * 后缀
     */
    suffix?: string;
    /**
     * 是否千分分隔
     */
    kilobitSeparator?: boolean;
    /**
     * 只读
     */
    readOnly?: boolean;
    /**
     * 启用键盘行为，即通过上下方向键控制是否生效
     */
    keyboard?: boolean;
    /**
     * 输入框为基础输入框还是加强输入框
     */
    displayMode?: 'base' | 'enhance';
}
interface NumberState {
    unit?: string;
    unitOptions?: Option[];
}
export declare type InputNumberRendererEvent = 'blur' | 'focus' | 'change';
export declare type InputNumberRendererAction = 'clear';
export default class NumberControl extends React.Component<NumberProps, NumberState> {
    input?: HTMLInputElement;
    static defaultProps: Partial<NumberProps>;
    constructor(props: NumberProps);
    /**
     * 动作处理
     */
    doAction(action: ActionObject, args: any): void;
    getUnit(): any;
    getValue(inputValue: any): any;
    dispatchEvent(eventName: string): Promise<void>;
    handleChange(inputValue: any): Promise<void>;
    filterNum(value: number | string | undefined): number | undefined;
    handleChangeUnit(option: Option): void;
    componentDidUpdate(prevProps: NumberProps): void;
    inputRef(ref: any): void;
    focus(): void;
    render(): JSX.Element;
}
export declare class NumberControlRenderer extends NumberControl {
    static defaultProps: Partial<FormControlProps>;
}
export {};
