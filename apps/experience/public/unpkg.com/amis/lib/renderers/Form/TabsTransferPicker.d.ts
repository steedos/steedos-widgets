/// <reference types="react" />
import { OptionsControlProps } from 'amis-core';
import { BaseTabsTransferRenderer } from './TabsTransfer';
import { TabsTransferControlSchema } from './TabsTransfer';
import { ActionObject } from 'amis-core';
import type { ItemRenderStates } from 'amis-ui/lib/components/Selection';
/**
 * TabsTransferPicker 穿梭器的弹框形态
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs-transfer-picker
 */
export interface TabsTransferPickerControlSchema extends Omit<TabsTransferControlSchema, 'type'> {
    type: 'tabs-transfer-picker';
}
export interface TabsTransferProps extends OptionsControlProps, Omit<TabsTransferPickerControlSchema, 'type' | 'options' | 'inputClassName' | 'className' | 'descriptionClassName'> {
}
interface BaseTransferState {
    activeKey: number;
}
export declare class TabsTransferPickerRenderer extends BaseTabsTransferRenderer<TabsTransferProps> {
    state: BaseTransferState;
    dispatchEvent(name: string): void;
    optionItemRender(option: any, states: ItemRenderStates): JSX.Element;
    doAction(action: ActionObject): void;
    render(): JSX.Element;
}
export {};
