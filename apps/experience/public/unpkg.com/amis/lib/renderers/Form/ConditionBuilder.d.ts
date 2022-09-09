import React from 'react';
import { FormControlProps, Schema } from 'amis-core';
import { FormBaseControlSchema, SchemaApi, SchemaTokenizeableString } from '../../Schema';
import { ConditionBuilderFields, ConditionBuilderFuncs, ConditionBuilderConfig } from 'amis-ui';
import { IconSchema } from '../Icon';
/**
 * 条件组合控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/condition-builder
 */
export interface ConditionBuilderControlSchema extends FormBaseControlSchema {
    /**
     * 指定为
     */
    type: 'condition-builder';
    /**
     * 内嵌模式，默认为 true
     */
    embed?: boolean;
    /**
     * 非内嵌模式时 弹窗触发icon
     */
    pickerIcon?: IconSchema;
    /**
     * 函数集合
     */
    funcs?: ConditionBuilderFuncs;
    /**
     * 字段集合
     */
    fields: ConditionBuilderFields;
    /**
     * 其他配置
     */
    config?: ConditionBuilderConfig;
    /**
     * 通过远程拉取配置项
     */
    source?: SchemaApi | SchemaTokenizeableString;
    /**
     * 展现模式
     */
    builderMode?: 'simple' | 'full';
    /**
     * 是否显示并或切换键按钮，只在简单模式下有用
     */
    showANDOR?: boolean;
}
export interface ConditionBuilderProps extends FormControlProps, Omit<ConditionBuilderControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class ConditionBuilderControl extends React.PureComponent<ConditionBuilderProps> {
    renderEtrValue(schema: Schema, data: any): JSX.Element;
    renderPickerIcon(): JSX.Element | undefined;
    render(): JSX.Element;
}
export declare class ConditionBuilderRenderer extends ConditionBuilderControl {
}
