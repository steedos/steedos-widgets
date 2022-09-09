import React from 'react';
import { FormControlProps } from 'amis-core';
import type { FormBaseControlSchema, SchemaApi } from '../../Schema';
/**
 * RichText
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-rich-text
 */
export interface RichTextControlSchema extends FormBaseControlSchema {
    type: 'input-rich-text';
    /**
     * 编辑器类型
     */
    vendor?: 'froala' | 'tinymce';
    /**
     * 图片保存 API
     *
     * @default /api/upload/image
     */
    receiver?: SchemaApi;
    /**
     * 视频保存 API
     *
     * @default /api/upload/video
     */
    videoReceiver?: SchemaApi;
    /**
     * 接收器的字段名
     */
    fileField?: string;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     *  tinymce 或 froala 的配置
     */
    options?: any;
}
export interface RichTextProps extends FormControlProps {
    options?: any;
    vendor?: 'froala' | 'tinymce';
}
export default class RichTextControl extends React.Component<RichTextProps, any> {
    static defaultProps: Partial<RichTextProps>;
    state: {
        focused: boolean;
    };
    config: any;
    constructor(props: RichTextProps);
    handleFocus(): void;
    handleBlur(): void;
    handleChange(value: any, submitOnChange?: boolean, changeImmediately?: boolean): void;
    render(): JSX.Element;
}
export declare class RichTextControlRenderer extends RichTextControl {
}
