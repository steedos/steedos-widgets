/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { FormControlProps } from 'amis-core';
import { ThemeProps } from 'amis-core';
import { ActionObject } from 'amis-core';
import { Option } from 'amis-core';
import { LocaleProps } from 'amis-core';
import { FormBaseControlSchema } from '../../Schema';
/**
 * City 城市选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/city
 */
export interface InputCityControlSchema extends FormBaseControlSchema {
    /**
     * 指定为城市选择框。
     */
    type: 'input-city';
    /**
     * 开启后只会存城市的 code 信息
     */
    extractValue?: boolean;
    /**
     * 是否将各个信息拼接成字符串。
     */
    joinValues?: boolean;
    /**
     * 拼接的符号是啥？
     */
    delimiter?: string;
    /**
     * 允许选择城市？
     */
    allowCity?: boolean;
    /**
     * 允许选择地区？
     */
    allowDistrict?: boolean;
    /**
     * 允许选择街道？
     */
    allowStreet?: boolean;
    /**
     * 是否显示搜索框
     */
    searchable?: boolean;
}
export interface CityPickerProps extends Omit<InputCityControlSchema, 'type' | 'className'>, LocaleProps, ThemeProps {
    value: any;
    onChange: (value: any) => void;
    extractValue: boolean;
    delimiter: string;
    allowCity: boolean;
    allowDistrict: boolean;
    allowStreet: boolean;
    useMobileUI?: boolean;
}
export interface CityPickerState {
    code: number;
    province: string;
    provinceCode: number;
    city: string;
    cityCode: number;
    district: string;
    districtCode: number;
    street: string;
    db?: {
        province: Array<string>;
        city: {
            [propName: number]: Array<number>;
        };
        district: {
            [propName: number]: {
                [propName: number]: Array<number>;
            } | Array<number>;
        };
        [propName: string]: any;
    };
}
export declare class CityPicker extends React.Component<CityPickerProps, CityPickerState> {
    static defaultProps: {
        joinValues: boolean;
        extractValue: boolean;
        delimiter: string;
        allowCity: boolean;
        allowDistrict: boolean;
        allowStreet: boolean;
    };
    state: CityPickerState;
    componentDidMount(): void;
    componentDidUpdate(prevProps: CityPickerProps): void;
    loadDb(callback?: () => void): void;
    handleProvinceChange(option: Option): void;
    handleCityChange(option: Option): void;
    handleDistrictChange(option: Option, otherStates?: Partial<CityPickerState>): void;
    handleStreetChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleStreetEnd(): void;
    syncIn(props?: Readonly<CityPickerProps> & Readonly<{
        children?: React.ReactNode;
    }>): void;
    syncOut(): void;
    render(): JSX.Element;
}
declare const ThemedCity: {
    new (props: Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
        joinValues: boolean;
        extractValue: boolean;
        delimiter: string;
        allowCity: boolean;
        allowDistrict: boolean;
        allowStreet: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps): {
        ref: any;
        childRef(ref: any): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("amis-core/lib/theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }): {
            ref: any;
            childRef(ref: any): void;
            getWrappedInstance(): any;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof CityPicker>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof CityPicker, {}> & {
        ComposedComponent: typeof CityPicker;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
        joinValues: boolean;
        extractValue: boolean;
        delimiter: string;
        allowCity: boolean;
        allowDistrict: boolean;
        allowStreet: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }): {
        ref: any;
        childRef(ref: any): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof CityPicker>;
} & import("hoist-non-react-statics").NonReactStatics<typeof CityPicker, {}> & {
    ComposedComponent: typeof CityPicker;
}, {}> & {
    ComposedComponent: {
        new (props: Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
            joinValues: boolean;
            extractValue: boolean;
            delimiter: string;
            allowCity: boolean;
            allowDistrict: boolean;
            allowStreet: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }): {
            ref: any;
            childRef(ref: any): void;
            getWrappedInstance(): any;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<CityPickerProps, keyof LocaleProps>, "placeholder" | "className" | "$ref" | "disabled" | "disabledOn" | "hidden" | "hiddenOn" | "visible" | "visibleOn" | "id" | "onEvent" | "size" | "label" | "remark" | "name" | "value" | "searchable" | "desc" | "classPrefix" | "classnames" | "theme" | "mode" | "horizontal" | "onChange" | "labelClassName" | "inline" | "readOnly" | "description" | "labelRemark" | "labelAlign" | "labelWidth" | "hint" | "submitOnChange" | "readOnlyOn" | "validateOnChange" | "descriptionClassName" | "inputClassName" | "required" | "validationErrors" | "validations" | "clearValueOnHidden" | "validateApi" | "useMobileUI"> & Partial<Pick<Omit<CityPickerProps, keyof LocaleProps>, "joinValues" | "delimiter" | "extractValue" | "allowCity" | "allowDistrict" | "allowStreet">> & Partial<Pick<{
                joinValues: boolean;
                extractValue: boolean;
                delimiter: string;
                allowCity: boolean;
                allowDistrict: boolean;
                allowStreet: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof CityPicker>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof CityPicker, {}> & {
        ComposedComponent: typeof CityPicker;
    };
};
export default ThemedCity;
export interface LocationControlProps extends FormControlProps {
    allowCity?: boolean;
    allowDistrict?: boolean;
    extractValue?: boolean;
    joinValues?: boolean;
    allowStreet?: boolean;
}
export declare class LocationControl extends React.Component<LocationControlProps> {
    doAction(action: ActionObject, data: object, throwErrors: boolean): void;
    handleChange(value: number | string): Promise<void>;
    render(): JSX.Element;
}
export declare class CheckboxControlRenderer extends LocationControl {
}
