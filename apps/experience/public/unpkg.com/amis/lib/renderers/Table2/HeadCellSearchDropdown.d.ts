import React from 'react';
import { RendererProps, ActionObject, ITableStore2, ClassNamesFn } from 'amis-core';
export interface QuickSearchConfig {
    type?: string;
    controls?: any;
    tabs?: any;
    fieldSet?: any;
    [propName: string]: any;
}
export interface HeadCellSearchProps extends RendererProps {
    name: string;
    searchable: boolean | QuickSearchConfig;
    onSearch?: (values: object) => void;
    onAction?: Function;
    store: ITableStore2;
    sortable?: boolean;
    label?: string;
    orderBy: string;
    orderDir: string;
    popOverContainer?: any;
    classnames: ClassNamesFn;
    classPrefix: string;
}
export declare class HeadCellSearchDropDown extends React.Component<HeadCellSearchProps, any> {
    formItems: Array<string>;
    constructor(props: HeadCellSearchProps);
    buildSchema(): any;
    handleAction(e: any, action: ActionObject, ctx: object, confirm: Function): Promise<void>;
    handleReset(): Promise<void>;
    handleSubmit(values: any, confirm: Function): Promise<void>;
    isActive(): boolean;
    render(): JSX.Element;
}
