import React from 'react';
import { FormControlProps } from 'amis-core';
import { FormBaseControlSchema } from '../../Schema';
/**
 * JSON Schema Editor
 * 文档：https://baidu.gitee.io/amis/docs/components/form/json-schema-editor
 */
export interface JSONSchemaEditorControlSchema extends FormBaseControlSchema {
    /**
     * 指定为 JSON Schema Editor
     */
    type: 'json-schema-editor';
    /**
     * 可以理解为类型模板，方便快速定义复杂类型
     */
    definitions?: {
        [propName: string]: {
            title: string;
            type: 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean' | 'null';
            [propName: string]: any;
        };
    };
    /**
     * 顶层是否允许修改类型
     */
    rootTypeMutable?: boolean;
    /**
     * 顶层类型信息是否隐藏
     */
    showRootInfo?: boolean;
    /**
     * 禁用类型，默认禁用了 null 类型
     */
    disabledTypes?: Array<string>;
    /**
     * 开启详情配置
     */
    enableAdvancedSetting?: boolean;
    /**
     * 自定义详情配置面板如：
     *
     * {
     *   boolean: [
     *      {type: "input-text", name: "aa", label: "AA" }
     *   ]
     * }
     *
     * 当配置布尔字段详情时，就会出现以上配置
     */
    advancedSettings?: {
        [propName: string]: any;
    };
}
export interface JSONSchemaEditorProps extends FormControlProps, Omit<JSONSchemaEditorControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class JSONSchemaEditorControl extends React.PureComponent<JSONSchemaEditorProps> {
    static defaultProps: {
        enableAdvancedSetting: boolean;
    };
    renderModalProps(value: any, onChange: (value: any) => void): JSX.Element;
    render(): JSX.Element;
}
export declare class JSONSchemaEditorRenderer extends JSONSchemaEditorControl {
}
