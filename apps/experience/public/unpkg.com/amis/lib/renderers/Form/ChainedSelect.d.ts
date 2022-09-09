import React from 'react';
import { OptionsControlProps, Option } from 'amis-core';
import { ActionObject } from 'amis-core';
import { FormOptionsSchema } from '../../Schema';
/**
 * 链式下拉框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chained-select
 */
export interface ChainedSelectControlSchema extends FormOptionsSchema {
    type: 'chained-select';
}
export interface ChainedSelectProps extends OptionsControlProps, Omit<ChainedSelectControlSchema, 'options' | 'type' | 'source' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export interface SelectState {
    stack: Array<{
        options: Array<Option>;
        parentId: any;
        loading: boolean;
        visible?: boolean;
    }>;
}
export default class ChainedSelectControl extends React.Component<ChainedSelectProps, SelectState> {
    static defaultProps: Partial<ChainedSelectProps>;
    state: SelectState;
    constructor(props: ChainedSelectProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ChainedSelectProps): void;
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    array2value(arr: Array<any>, isExtracted?: boolean): string | any[];
    loadMore(): void;
    handleChange(index: number, currentValue: any): Promise<void>;
    reload(): void;
    render(): JSX.Element;
}
export declare class ChainedSelectControlRenderer extends ChainedSelectControl {
}
