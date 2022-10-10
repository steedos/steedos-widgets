/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { FormControlProps } from 'amis-core';
import type { PresetColor } from 'amis-ui';
import { FormBaseControlSchema } from '../../Schema';
export declare const ColorPicker: React.LazyExoticComponent<{
    new (props: Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
        ref: any;
        childRef(ref: any): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("amis-core").ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }): {
            ref: any;
            childRef(ref: any): void;
            getWrappedInstance(): any;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof import("amis-ui/lib/components/ColorPicker").ColorControl>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof import("amis-ui/lib/components/ColorPicker").ColorControl, {}> & {
        ComposedComponent: typeof import("amis-ui/lib/components/ColorPicker").ColorControl;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }): {
        ref: any;
        childRef(ref: any): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K_1_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1_1> | null) | Pick<{}, K_1_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof import("amis-ui/lib/components/ColorPicker").ColorControl>;
} & import("hoist-non-react-statics").NonReactStatics<typeof import("amis-ui/lib/components/ColorPicker").ColorControl, {}> & {
    ComposedComponent: typeof import("amis-ui/lib/components/ColorPicker").ColorControl;
}, {}> & {
    ComposedComponent: {
        new (props: Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }): {
            ref: any;
            childRef(ref: any): void;
            getWrappedInstance(): any;
            render(): JSX.Element;
            context: any;
            setState<K_1_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1_2> | null) | Pick<{}, K_1_2> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placement" | "className" | "disabled" | "classPrefix" | "classnames" | "theme" | "useMobileUI" | "popOverContainer" | "onChange" | "value" | "resetValue" | "popoverClassName" | "presetColors"> & Partial<Pick<Omit<import("amis-ui/lib/components/ColorPicker").ColorProps, keyof import("amis-core").LocaleProps>, "placeholder" | "clearable" | "format" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof import("amis-ui/lib/components/ColorPicker").ColorControl>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof import("amis-ui/lib/components/ColorPicker").ColorControl, {}> & {
        ComposedComponent: typeof import("amis-ui/lib/components/ColorPicker").ColorControl;
    };
}>;
/**
 * Color 颜色选择框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/color
 */
export interface InputColorControlSchema extends FormBaseControlSchema {
    /**
     * 指定为颜色选择框
     */
    type: 'input-color';
    /**
     * 是否显示清除按钮
     */
    clearable?: boolean;
    /**
     * 颜色格式
     */
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
    /**
     * 选中颜色后是否关闭弹出层。
     */
    closeOnSelect?: boolean;
    /**
     * 预设颜色，用户可以直接从预设中选。
     */
    presetColors?: Array<PresetColor>;
    /**
     * 是否允许用户输入颜色。
     */
    allowCustomColor?: boolean;
}
export interface ColorProps extends FormControlProps, Omit<InputColorControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export interface ColorControlState {
    open: boolean;
}
export default class ColorControl extends React.PureComponent<ColorProps, ColorControlState> {
    static defaultProps: Partial<ColorProps>;
    state: ColorControlState;
    render(): JSX.Element;
}
export declare class ColorControlRenderer extends ColorControl {
}
