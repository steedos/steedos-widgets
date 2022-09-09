import React from 'react';
import { FormControlProps } from 'amis-core';
import { FormBaseControlSchema } from '../../Schema';
/**
 * JSON Schema
 * 文档：https://baidu.gitee.io/amis/docs/components/form/json-schema
 */
export interface JSONSchemaControlSchema extends FormBaseControlSchema {
    /**
     * 指定为 JSON Schema
     */
    type: 'json-schema';
    /**
     * json-schema 详情，支持关联上下文数据
     */
    schema?: any;
}
export interface JSONSchemaProps extends FormControlProps, Omit<JSONSchemaControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class JSONSchemaControl extends React.PureComponent<JSONSchemaProps> {
    render(): JSX.Element;
}
export declare class JSONSchemaRenderer extends JSONSchemaControl {
}
