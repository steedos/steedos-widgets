import React from 'react';
import type { ActionObject, Api, OptionsControlProps, Option } from 'amis-core';
import { FormOptionsSchema } from '../../Schema';
/**
 * 复选框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/checkboxes
 */
export interface CheckboxesControlSchema extends FormOptionsSchema {
    type: 'checkboxes';
    /**
     * 是否开启全选功能
     */
    checkAll?: boolean;
    /**
     * 是否默认全选
     */
    defaultCheckAll?: boolean;
    /**
     * 每行显示多少个
     */
    columnsCount?: number | number[];
    /**
     * 自定义选项展示
     */
    menuTpl?: string;
}
export interface CheckboxesProps extends OptionsControlProps, Omit<CheckboxesControlSchema, 'options' | 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    placeholder?: any;
    itemClassName?: string;
    columnsCount?: number | number[];
    labelClassName?: string;
    onAdd?: () => void;
    addApi?: Api;
    creatable: boolean;
    createBtnLabel: string;
    editable?: boolean;
    removable?: boolean;
    optionType?: 'default' | 'button';
    menuTpl?: string;
}
export default class CheckboxesControl extends React.Component<CheckboxesProps, any> {
    static defaultProps: {
        columnsCount: number;
        multiple: boolean;
        placeholder: string;
        creatable: boolean;
        inline: boolean;
        createBtnLabel: string;
        optionType: string;
    };
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    reload(): void;
    handleAddClick(): void;
    handleEditClick(e: Event, item: any): void;
    handleDeleteClick(e: Event, item: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    updateBorderStyle(): void;
    renderGroup(option: Option, index: number): JSX.Element | null;
    renderItem(option: Option, index: number): JSX.Element | null;
    columnsSplit(body: React.ReactNode[]): any[];
    render(): JSX.Element;
}
export declare class CheckboxesControlRenderer extends CheckboxesControl {
}
