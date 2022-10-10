import React from 'react';
import { RendererProps } from 'amis-core';
import type { Option } from 'amis-core';
export interface QuickFilterConfig {
    options: Array<any>;
    multiple: boolean;
    strictMode?: boolean;
    [propName: string]: any;
}
export interface HeadCellFilterProps extends RendererProps {
    data: any;
    name: string;
    filterable: QuickFilterConfig;
    onQuery: (values: object) => void;
}
export declare class HeadCellFilterDropDown extends React.Component<HeadCellFilterProps, any> {
    state: {
        isOpened: boolean;
        filterOptions: never[];
    };
    sourceInvalid: boolean;
    constructor(props: HeadCellFilterProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: HeadCellFilterProps, prevState: any): void;
    fetchOptions(): void;
    alterOptions(options: Array<any>): any[];
    optionComparator(option: Option, selected: any): boolean;
    handleClickOutside(): void;
    open(): void;
    close(): void;
    handleClick(value: string): Promise<void>;
    handleCheck(value: string): Promise<void>;
    handleReset(): void;
    render(): JSX.Element;
}
