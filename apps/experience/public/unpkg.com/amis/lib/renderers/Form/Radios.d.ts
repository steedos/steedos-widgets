import React from 'react';
import { OptionsControlProps, Option } from 'amis-core';
import { ActionObject } from 'amis-core';
import { FormOptionsSchema } from '../../Schema';
/**
 * Radio 单选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/radios
 */
export interface RadiosControlSchema extends FormOptionsSchema {
    type: 'radios';
    /**
     * 每行显示多少个
     */
    columnsCount?: number;
}
export interface RadiosProps extends OptionsControlProps {
    placeholder?: any;
    columnsCount?: number;
    labelField?: string;
    /**
     * @deprecated 和checkbox的labelClassName有冲突，请用optionClassName代替
     */
    labelClassName?: string;
    /** 选项CSS类名 */
    optionClassName?: string;
}
export default class RadiosControl extends React.Component<RadiosProps, any> {
    static defaultProps: Partial<RadiosProps>;
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    handleChange(option: Option): Promise<void>;
    reload(): void;
    render(): JSX.Element;
}
export declare class RadiosControlRenderer extends RadiosControl {
    static defaultProps: {
        multiple: boolean;
        inline: boolean;
    };
}
