/// <reference types="react" />
import { OptionsControlProps } from 'amis-core';
import { BaseTransferRenderer, TransferControlSchema } from './Transfer';
import { Option } from 'amis-core';
import { ActionObject } from 'amis-core';
import type { ItemRenderStates } from 'amis-ui/lib/components/Selection';
/**
 * TabsTransfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs-transfer
 */
export interface TabsTransferControlSchema extends Omit<TransferControlSchema, 'type'> {
    type: 'tabs-transfer';
}
export interface TabsTransferProps extends OptionsControlProps, Omit<TabsTransferControlSchema, 'type' | 'options' | 'inputClassName' | 'className' | 'descriptionClassName'> {
}
interface BaseTransferState {
    activeKey: number;
}
export declare class BaseTabsTransferRenderer<T extends OptionsControlProps = TabsTransferProps> extends BaseTransferRenderer<T> {
    state: BaseTransferState;
    onTabChange(key: number): Promise<void>;
    handleTabSearch(term: string, option: Option, cancelExecutor: Function): Promise<any[]>;
    handleChange(value: Array<Option> | Option, optionModified?: boolean): Promise<void>;
}
export declare class TabsTransferRenderer extends BaseTabsTransferRenderer<TabsTransferProps> {
    optionItemRender(option: any, states: ItemRenderStates): JSX.Element;
    doAction(action: ActionObject, args: any): void;
    render(): JSX.Element;
}
export {};
