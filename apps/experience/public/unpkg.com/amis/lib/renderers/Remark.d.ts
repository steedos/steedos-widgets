/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { RendererProps } from 'amis-core';
import { ClassNamesFn } from 'amis-core';
import { BaseSchema, SchemaClassName, SchemaIcon, SchemaTpl } from '../Schema';
import type { TooltipObject } from 'amis-ui/lib/components/TooltipWrapper';
/**
 * 提示渲染器，默认会显示个小图标，鼠标放上来的时候显示配置的内容。
 */
export interface RemarkSchema extends BaseSchema {
    /**
     * 指定为提示类型
     */
    type: 'remark';
    label?: string;
    icon?: SchemaIcon;
    tooltipClassName?: SchemaClassName;
    /**
     * 触发规则
     */
    trigger?: Array<'click' | 'hover' | 'focus'>;
    /**
     * 提示标题
     */
    title?: string;
    /**
     * 提示内容
     */
    content: SchemaTpl;
    /**
     * 显示位置
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * 点击其他内容时是否关闭弹框信息
     */
    rootClose?: boolean;
    /**
     * icon的形状
     */
    shape?: 'circle' | 'square';
}
export declare type SchemaRemark = string | Omit<RemarkSchema, 'type'>;
export declare function filterContents(tooltip: string | undefined | {
    title?: string;
    children?: any;
    content?: string;
    body?: string;
}, data: any): string | {
    title: string;
    content: string | undefined;
    children?: any;
} | undefined;
export interface RemarkProps extends RendererProps, Omit<RemarkSchema, 'type' | 'className'> {
    icon: string;
    trigger: Array<'hover' | 'click' | 'focus'>;
}
declare class Remark extends React.Component<RemarkProps> {
    static propsList: Array<string>;
    static defaultProps: {
        icon: string;
        trigger: ("click" | "focus" | "hover")[];
    };
    showModalTip(tooltip?: string | TooltipObject): (e: React.MouseEvent) => void;
    renderLabel(finalIcon: any, finalLabel: string, cx: ClassNamesFn, shape?: 'circle' | 'square'): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
        ref: any;
        childRef(ref: any): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<RemarkProps, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Remark>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Remark, {}> & {
    ComposedComponent: typeof Remark;
};
export default _default;
export declare class RemarkRenderer extends Remark {
}
