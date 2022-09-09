import React from 'react';
import { ClassNamesFn, ITableStore, SchemaNode, ActionObject, LocaleProps, OnEventProps } from 'amis-core';
import { ActionSchema } from '../Action';
import { SchemaTpl } from '../../Schema';
import type { IColumn, IRow } from 'amis-core/lib/store/table';
export interface TableContentProps extends LocaleProps {
    className?: string;
    tableClassName?: string;
    classnames: ClassNamesFn;
    columns: Array<IColumn>;
    columnsGroup: Array<{
        label: string;
        index: number;
        colSpan: number;
        rowSpan: number;
        has: Array<any>;
    }>;
    rows: Array<IRow>;
    placeholder?: string | SchemaTpl;
    render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
    onMouseMove: (event: React.MouseEvent) => void;
    onScroll: (event: React.UIEvent) => void;
    tableRef: (table?: HTMLTableElement | null) => void;
    renderHeadCell: (column: IColumn, props?: any) => JSX.Element;
    renderCell: (region: string, column: IColumn, item: IRow, props: any) => React.ReactNode;
    onCheck: (item: IRow, value: boolean, shift?: boolean) => void;
    onQuickChange?: (item: IRow, values: object, saveImmediately?: boolean | any, savePristine?: boolean) => void;
    footable?: boolean;
    footableColumns: Array<IColumn>;
    checkOnItemClick?: boolean;
    buildItemProps?: (item: IRow, index: number) => any;
    onAction?: (e: React.UIEvent<any>, action: ActionObject, ctx: object) => void;
    rowClassNameExpr?: string;
    affixRowClassName?: string;
    prefixRowClassName?: string;
    rowClassName?: string;
    data?: any;
    prefixRow?: Array<any>;
    affixRow?: Array<any>;
    itemAction?: ActionSchema;
    itemActions?: Array<ActionObject>;
    store: ITableStore;
    dispatchEvent?: Function;
    onEvent?: OnEventProps;
    loading?: boolean;
}
export declare class TableContent extends React.Component<TableContentProps> {
    renderItemActions(): JSX.Element | null;
    render(): JSX.Element;
}
