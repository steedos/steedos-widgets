/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { IScopedContext } from 'amis-core';
import { RendererProps } from 'amis-core';
import { SchemaNode, ActionObject } from 'amis-core';
import { IModalStore } from 'amis-core';
import { BaseSchema, SchemaClassName, SchemaCollection, SchemaName } from '../Schema';
import { ActionSchema } from './Action';
/**
 * Dialog 弹框渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/dialog
 */
export interface DialogSchema extends BaseSchema {
    type: 'dialog';
    /**
     * 默认不用填写，自动会创建确认和取消按钮。
     */
    actions?: Array<ActionSchema>;
    /**
     * 内容区域
     */
    body?: SchemaCollection;
    /**
     * 配置 Body 容器 className
     */
    bodyClassName?: SchemaClassName;
    /**
     * 是否支持按 ESC 关闭 Dialog
     */
    closeOnEsc?: boolean;
    /**
     * 是否支持点其它区域关闭 Dialog
     */
    closeOnOutside?: boolean;
    name?: SchemaName;
    /**
     * Dialog 大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /**
     * Dialog 高度
     */
    height?: string;
    /**
     * Dialog 宽度
     */
    width?: string;
    /**
     * 请通过配置 title 设置标题
     */
    title?: SchemaCollection;
    header?: SchemaCollection;
    headerClassName?: SchemaClassName;
    footer?: SchemaCollection;
    /**
     * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
     */
    confirm?: boolean;
    /**
     * 是否显示关闭按钮
     */
    showCloseButton?: boolean;
    /**
     * 是否显示错误信息
     */
    showErrorMsg?: boolean;
    /**
     * 是否显示 spinner
     */
    showLoading?: boolean;
}
export declare type DialogSchemaBase = Omit<DialogSchema, 'type'>;
export interface DialogProps extends RendererProps, Omit<DialogSchema, 'className'> {
    onClose: (confirmed?: boolean) => void;
    onConfirm: (values: Array<object>, action: ActionObject, ctx: object, targets: Array<any>) => void;
    children?: React.ReactNode | ((props?: any) => React.ReactNode);
    store: IModalStore;
    show?: boolean;
    lazyRender?: boolean;
    lazySchema?: (props: DialogProps) => SchemaCollection;
    wrapperComponent: React.ElementType;
}
export default class Dialog extends React.Component<DialogProps> {
    static propsList: Array<string>;
    static defaultProps: {
        title: string;
        bodyClassName: string;
        confirm: boolean;
        show: boolean;
        lazyRender: boolean;
        showCloseButton: boolean;
        wrapperComponent: {
            new (props: Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
                ref: any;
                childRef(ref: any): void;
                getWrappedInstance(): any;
                render(): JSX.Element;
                context: any;
                setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            displayName: string;
            contextType: React.Context<string>;
            ComposedComponent: React.ComponentType<{
                new (props: Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<typeof import("amis-ui/lib/components/Modal").Modal>;
            } & import("hoist-non-react-statics").NonReactStatics<typeof import("amis-ui/lib/components/Modal").Modal, {}> & {
                ComposedComponent: typeof import("amis-ui/lib/components/Modal").Modal;
            }>;
        } & import("hoist-non-react-statics").NonReactStatics<{
            new (props: Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }): {
                ref: any;
                childRef(ref: any): void;
                getWrappedInstance(): any;
                render(): JSX.Element;
                context: any;
                setState<K_1_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1_1> | null) | Pick<{}, K_1_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            displayName: string;
            contextType: React.Context<string>;
            ComposedComponent: React.ComponentType<typeof import("amis-ui/lib/components/Modal").Modal>;
        } & import("hoist-non-react-statics").NonReactStatics<typeof import("amis-ui/lib/components/Modal").Modal, {}> & {
            ComposedComponent: typeof import("amis-ui/lib/components/Modal").Modal;
        }, {}> & {
            ComposedComponent: {
                new (props: Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_1_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1_2> | null) | Pick<{}, K_1_2> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "width" | "height" | "closeOnOutside" | "show" | "onHide" | "onEntered" | "onExited" | "contentClassName" | "closeOnEsc"> & Partial<Pick<Omit<import("amis-ui/lib/components/Modal").ModalProps, keyof import("amis-core").LocaleProps>, "size" | "container" | "overlay">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<typeof import("amis-ui/lib/components/Modal").Modal>;
            } & import("hoist-non-react-statics").NonReactStatics<typeof import("amis-ui/lib/components/Modal").Modal, {}> & {
                ComposedComponent: typeof import("amis-ui/lib/components/Modal").Modal;
            };
        } & {
            Header: {
                new (props: Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<{
                    new (props: Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }): {
                        ref: any;
                        childRef(ref: any): void;
                        getWrappedInstance(): any;
                        render(): JSX.Element;
                        context: any;
                        setState<K_1_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>) => {} | Pick<{}, K_1_3> | null) | Pick<{}, K_1_3> | null, callback?: (() => void) | undefined): void;
                        forceUpdate(callback?: (() => void) | undefined): void;
                        readonly props: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }> & Readonly<{
                            children?: React.ReactNode;
                        }>;
                        state: Readonly<{}>;
                        refs: {
                            [key: string]: React.ReactInstance;
                        };
                        componentDidMount?(): void;
                        shouldComponentUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): boolean;
                        componentWillUnmount?(): void;
                        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>): any;
                        componentDidUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>, snapshot?: any): void;
                        componentWillMount?(): void;
                        UNSAFE_componentWillMount?(): void;
                        componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                    };
                    displayName: string;
                    contextType: React.Context<string>;
                    ComposedComponent: React.ComponentType<({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
                } & import("hoist-non-react-statics").NonReactStatics<({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                    ComposedComponent: ({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
                }>;
            } & import("hoist-non-react-statics").NonReactStatics<{
                new (props: Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_1_4 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1_4> | null) | Pick<{}, K_1_4> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
                forwardedRef?: any;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            }, {}> & {
                ComposedComponent: {
                    new (props: Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }): {
                        ref: any;
                        childRef(ref: any): void;
                        getWrappedInstance(): any;
                        render(): JSX.Element;
                        context: any;
                        setState<K_1_5 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>) => {} | Pick<{}, K_1_5> | null) | Pick<{}, K_1_5> | null, callback?: (() => void) | undefined): void;
                        forceUpdate(callback?: (() => void) | undefined): void;
                        readonly props: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }> & Readonly<{
                            children?: React.ReactNode;
                        }>;
                        state: Readonly<{}>;
                        refs: {
                            [key: string]: React.ReactInstance;
                        };
                        componentDidMount?(): void;
                        shouldComponentUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): boolean;
                        componentWillUnmount?(): void;
                        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>): any;
                        componentDidUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>, snapshot?: any): void;
                        componentWillMount?(): void;
                        UNSAFE_componentWillMount?(): void;
                        componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                            forwardedRef?: any;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                    };
                    displayName: string;
                    contextType: React.Context<string>;
                    ComposedComponent: React.ComponentType<({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
                } & import("hoist-non-react-statics").NonReactStatics<({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                    ComposedComponent: ({ classnames, className, showCloseButton, onClose, children, classPrefix, translate, forwardedRef, ...rest }: import("amis-core").ThemeProps & import("amis-core").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
                };
            };
            Title: {
                new (props: Omit<import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
                forwardedRef?: any;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            };
            Body: {
                new (props: Omit<import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_4 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K_4> | null) | Pick<{}, K_4> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
                forwardedRef?: any;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            };
            Footer: {
                new (props: Omit<import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
                    ref: any;
                    childRef(ref: any): void;
                    getWrappedInstance(): any;
                    render(): JSX.Element;
                    context: any;
                    setState<K_5 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K_5> | null) | Pick<{}, K_5> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("amis-core").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                        forwardedRef?: any;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
                forwardedRef?: any;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames, className, children, classPrefix, forwardedRef, ...rest }: import("amis-core").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                    forwardedRef?: any;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            };
        };
        closeOnEsc: boolean;
        closeOnOutside: boolean;
        showErrorMsg: boolean;
    };
    reaction: any;
    isDead: boolean;
    $$id: string;
    constructor(props: DialogProps);
    componentWillUnmount(): void;
    buildActions(): Array<ActionSchema>;
    handleSelfClose(e?: any, confirmed?: boolean): Promise<void>;
    handleActionSensor(p: Promise<any>): void;
    handleAction(e: React.UIEvent<any>, action: ActionObject, data: object): void;
    handleDialogConfirm(values: object[], action: ActionObject, ...args: Array<any>): void;
    handleDialogClose(...args: Array<any>): void;
    handleDrawerConfirm(values: object[], action: ActionObject, ...args: Array<any>): void;
    handleDrawerClose(...args: Array<any>): void;
    handleEntered(): void;
    handleExited(): void;
    handleFormInit(data: any): void;
    handleFormChange(data: any, name?: string): void;
    handleFormSaved(data: any, response: any): void;
    handleChildFinished(value: any, action: ActionObject): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    getPopOverContainer(): Element | null;
    renderBody(body: SchemaNode, key?: any): React.ReactNode;
    renderFooter(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class DialogRenderer extends Dialog {
    static contextType: React.Context<IScopedContext>;
    constructor(props: DialogProps, context: IScopedContext);
    componentWillUnmount(): void;
    tryChildrenToHandle(action: ActionObject, ctx: object, rawAction?: ActionObject): boolean;
    doAction(action: ActionObject, data: object, throwErrors: boolean): any;
    handleAction(e: React.UIEvent<any> | void, action: ActionObject, data: object, throwErrors?: boolean, delegate?: IScopedContext): Promise<any>;
    handleChildFinished(value: any, action: ActionObject): void;
    handleDialogConfirm(values: object[], action: ActionObject, ...rest: Array<any>): void;
    handleDrawerConfirm(values: object[], action: ActionObject, ...rest: Array<any>): void;
    reloadTarget(target: string, data?: any): void;
    closeTarget(target: string): void;
    setData(values: object): void;
}
