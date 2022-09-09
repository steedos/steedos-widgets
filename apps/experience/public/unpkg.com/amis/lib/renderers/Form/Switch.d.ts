import React from 'react';
import { FormControlProps } from 'amis-core';
import { IconSchema } from '../Icon';
import { FormBaseControlSchema } from '../../Schema';
/**
 * Switch
 * 文档：https://baidu.gitee.io/amis/docs/components/form/switch
 */
export interface SwitchControlSchema extends FormBaseControlSchema {
    /**
     * 指定为多行文本输入框
     */
    type: 'switch';
    /**
     * 勾选值
     */
    trueValue?: boolean | string | number;
    /**
     * 未勾选值
     */
    falseValue?: boolean | string | number;
    /**
     * 选项说明
     */
    option?: string;
    /**
     * 开启时显示的内容
     */
    onText?: string | IconSchema;
    /**
     * 关闭时显示的内容
     */
    offText?: string | IconSchema;
    /** 开关尺寸 */
    size?: 'sm' | 'md';
}
export interface SwitchProps extends FormControlProps {
    option?: string;
    trueValue?: any;
    falseValue?: any;
    size?: 'sm';
}
export declare type SwitchRendererEvent = 'change';
export default class SwitchControl extends React.Component<SwitchProps, any> {
    static defaultProps: {
        trueValue: boolean;
        falseValue: boolean;
        optionAtLeft: boolean;
    };
    handleChange(checked: string | number | boolean): Promise<void>;
    render(): JSX.Element;
}
export declare class SwitchControlRenderer extends SwitchControl {
}
