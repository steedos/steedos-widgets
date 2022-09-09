/// <reference types="react" />
import { ITableStore } from 'amis-core';
import { ClassNamesFn } from 'amis-core';
export interface ItemActionsProps {
    classnames: ClassNamesFn;
    children: JSX.Element;
    store: ITableStore;
}
declare function ItemActionsWrapper(props: ItemActionsProps): JSX.Element;
declare const _default: typeof ItemActionsWrapper;
export default _default;
