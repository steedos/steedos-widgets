/// <reference types="lodash" />
import React from 'react';
import { FormControlProps } from 'amis-core';
import { FormBaseControlSchema, SchemaTokenizeableString } from '../../Schema';
import type { ListenerAction } from 'amis-core';
/**
 * Diff 编辑器
 * 文档：https://baidu.gitee.io/amis/docs/components/form/diff
 */
export interface DiffControlSchema extends FormBaseControlSchema {
    /**
     * 指定为 Diff 编辑器
     */
    type: 'diff-editor';
    /**
     * 左侧面板的值， 支持取变量。
     */
    diffValue?: SchemaTokenizeableString;
    /**
     * 语言，参考 monaco-editor
     */
    language?: string;
    /**
     * 编辑器配置
     */
    options?: any;
}
export declare type DiffEditorRendererEvent = 'blur' | 'focus';
export interface DiffEditorProps extends FormControlProps, Omit<DiffControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export declare class DiffEditor extends React.Component<DiffEditorProps, any> {
    static defaultProps: Partial<DiffEditorProps>;
    state: {
        focused: boolean;
    };
    editor: any;
    monaco: any;
    originalEditor: any;
    modifiedEditor: any;
    toDispose: Array<Function>;
    divRef: React.RefObject<HTMLDivElement>;
    constructor(props: DiffEditorProps);
    componentWillUnmount(): void;
    doAction(action: ListenerAction, args: any): void;
    focus(): void;
    handleFocus(): void;
    handleBlur(): void;
    componentDidUpdate(prevProps: any): void;
    editorFactory(containerElement: any, monaco: any, options: any): any;
    handleEditorMounted(editor: any, monaco: any): void;
    handleModifiedEditorChange(): void;
    prevHeight: number;
    updateContainerSize(editor: any, monaco: any): void;
    render(): JSX.Element;
}
export declare class DiffEditorControlRenderer extends DiffEditor {
    static defaultProps: {
        [x: string]: any;
        render?: ((region: string, node: import("amis-core").SchemaNode, props?: import("amis-core").PlainObject | undefined) => JSX.Element) | undefined;
        env?: import("amis-core").RendererEnv | undefined;
        $path?: string | undefined;
        $schema?: any;
        store?: ({
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            hasRemoteData: boolean;
            data: any;
            initedAt: number;
            updatedAt: number;
            pristine: any;
            action: any;
            dialogOpen: boolean;
            dialogData: any;
            drawerOpen: boolean;
            drawerData: any;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & {
            getValueByName(name: string, canAccessSuper?: boolean | undefined): any;
            getPristineValueByName(name: string): any;
        } & {
            initData(data?: object | undefined, skipSetPristine?: boolean | undefined): void;
            reset(): void;
            updateData(data?: object | undefined, tag?: object | undefined, replace?: boolean | undefined): void;
            changeValue(name: string, value: any, changePristine?: boolean | undefined, force?: boolean | undefined, otherModifier?: ((data: Object) => void) | undefined): void;
            setCurrentAction(action: object): void;
            openDialog(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDialog(result?: any): void;
            openDrawer(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDrawer(result?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        } & {
            /**
             * 左侧面板的值， 支持取变量。
             */
            hasRemoteData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            initedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
            updatedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
            pristine: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            action: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            dialogData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            drawerOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            drawerData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & {
            getValueByName(name: string, canAccessSuper?: boolean | undefined): any;
            getPristineValueByName(name: string): any;
        } & {
            initData(data?: object | undefined, skipSetPristine?: boolean | undefined): void;
            reset(): void;
            updateData(data?: object | undefined, tag?: object | undefined, replace?: boolean | undefined): void;
            changeValue(name: string, value: any, changePristine?: boolean | undefined, force?: boolean | undefined, otherModifier?: ((data: Object) => void) | undefined): void;
            setCurrentAction(action: object): void;
            openDialog(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDialog(result?: any): void;
            openDrawer(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDrawer(result?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        syncSuperStore?: boolean | undefined;
        data?: {
            [propName: string]: any;
        } | undefined;
        defaultData?: object | undefined;
        className?: any;
        classPrefix?: string | undefined;
        classnames?: import("amis-core").ClassNamesFn | undefined;
        theme?: string | undefined;
        locale?: string | undefined;
        translate?: import("amis-core").TranslateFn<any> | undefined;
        onEvent?: {
            [propName: string]: {
                weight?: number | undefined;
                actions: ListenerAction[];
            };
        } | undefined;
        onOpenDialog?: ((schema: import("amis-core").Schema, data: any) => Promise<any>) | undefined;
        name?: string | undefined;
        formStore?: ({
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            hasRemoteData: boolean;
            data: any;
            initedAt: number;
            updatedAt: number;
            pristine: any;
            action: any;
            dialogOpen: boolean;
            dialogData: any;
            drawerOpen: boolean;
            drawerData: any;
            msg: string;
            error: boolean;
            fetching: boolean;
            saving: boolean;
            busying: boolean;
            checking: boolean;
            initializing: boolean;
            schema: any;
            schemaKey: string;
            inited: boolean;
            validated: boolean;
            submited: boolean;
            submiting: boolean;
            savedData: any;
            canAccessSuperData: boolean;
            persistData: string | boolean;
            restError: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & {
            getValueByName(name: string, canAccessSuper?: boolean | undefined): any;
            getPristineValueByName(name: string): any;
        } & {
            initData(data?: object | undefined, skipSetPristine?: boolean | undefined): void;
            reset(): void;
            updateData(data?: object | undefined, tag?: object | undefined, replace?: boolean | undefined): void;
            changeValue(name: string, value: any, changePristine?: boolean | undefined, force?: boolean | undefined, otherModifier?: ((data: Object) => void) | undefined): void;
            setCurrentAction(action: object): void;
            openDialog(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDialog(result?: any): void;
            openDrawer(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDrawer(result?: any): void;
        } & {
            readonly loading: boolean;
        } & {
            markFetching: (fetching?: boolean | undefined) => void;
            markSaving: (saving?: boolean | undefined) => void;
            markBusying: (busying?: boolean | undefined) => void;
            fetchInitData: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            fetchData: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            reInitData: (data: object | undefined, replace?: boolean | undefined) => void;
            updateMessage: (msg?: string | undefined, error?: boolean | undefined) => void;
            clearMessage: () => void;
            setHasRemoteData: () => void;
            saveRemote: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            fetchSchema: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            checkRemote: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
        } & {
            readonly loading: boolean;
            readonly items: ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
            readonly directItems: ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
            readonly errors: {
                [propName: string]: string[];
            };
            getValueByName(name: string, canAccessSuperData?: boolean | undefined): any;
            getPristineValueByName(name: string): any;
            getItemById(id: string): ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
            getItemByName(name: string): ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
            getItemsByName(name: string): ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
            readonly valid: boolean;
            readonly validating: boolean;
            readonly isPristine: boolean;
            readonly modified: boolean;
            readonly persistKey: string;
        } & {
            setInited: (value: boolean) => void;
            setValues: (values: object, tag?: object | undefined, replace?: boolean | undefined) => void;
            setValueByName: (name: string, value: any, isPristine?: boolean | undefined, force?: boolean | undefined) => void;
            trimValues: () => void;
            submit: (fn?: ((values: object) => Promise<any>) | undefined, hooks?: (() => Promise<any>)[] | undefined, failedMessage?: string | undefined, validateErrCb?: (() => void) | undefined) => Promise<any>;
            validate: (hooks?: (() => Promise<any>)[] | undefined, forceValidate?: boolean | undefined) => Promise<boolean>;
            validateFields: (fields: (string | {
                name: string;
                rules: {
                    [propName: string]: any;
                };
            })[]) => Promise<boolean>;
            clearErrors: () => void;
            saveRemote: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            reset: (cb?: ((data: any) => void) | undefined, resetData?: boolean | undefined) => void;
            syncOptions: import("lodash").DebouncedFunc<() => void>;
            setCanAccessSuperData: (value?: boolean | undefined) => void;
            deleteValueByName: (name: string) => void;
            getLocalPersistData: () => void;
            setLocalPersistData: (keys?: string[] | undefined) => void;
            clearLocalPersistData: () => void;
            setPersistData: (value?: string | undefined) => void;
            clear: (cb?: ((data: any) => void) | undefined) => void;
            updateSavedData: () => void;
            setFormItemErrors: (errors: {
                [propName: string]: string;
            }, tag?: string | undefined) => void;
            getItemsByPath: (key: string) => any[] | null;
            setRestError: (errors: string[]) => void;
            addRestError: (msg: string, name?: string | string[] | undefined) => void;
            clearRestError: () => void;
            beforeDestroy(): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        } & {
            hasRemoteData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            initedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
            updatedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
            pristine: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            action: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            dialogData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            drawerOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            drawerData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        } & {
            msg: import("mobx-state-tree").IType<string | undefined, string, string>;
            error: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            saving: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            busying: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            checking: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            initializing: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            schema: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            schemaKey: import("mobx-state-tree").IType<string | undefined, string, string>;
        } & {
            inited: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            submited: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            submiting: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            savedData: import("mobx-state-tree").IType<any, any, any>;
            canAccessSuperData: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            persistData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ITypeUnion<string | boolean, string | boolean, string | boolean>, [undefined]>;
            restError: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & {
            getValueByName(name: string, canAccessSuper?: boolean | undefined): any;
            getPristineValueByName(name: string): any;
        } & {
            initData(data?: object | undefined, skipSetPristine?: boolean | undefined): void;
            reset(): void;
            updateData(data?: object | undefined, tag?: object | undefined, replace?: boolean | undefined): void;
            changeValue(name: string, value: any, changePristine?: boolean | undefined, force?: boolean | undefined, otherModifier?: ((data: Object) => void) | undefined): void;
            setCurrentAction(action: object): void;
            openDialog(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDialog(result?: any): void;
            openDrawer(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
            closeDrawer(result?: any): void;
        } & {
            readonly loading: boolean;
        } & {
            markFetching: (fetching?: boolean | undefined) => void;
            markSaving: (saving?: boolean | undefined) => void;
            markBusying: (busying?: boolean | undefined) => void;
            fetchInitData: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            fetchData: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            reInitData: (data: object | undefined, replace?: boolean | undefined) => void;
            updateMessage: (msg?: string | undefined, error?: boolean | undefined) => void;
            clearMessage: () => void;
            setHasRemoteData: () => void;
            saveRemote: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            fetchSchema: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            checkRemote: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
        } & {
            readonly loading: boolean;
            readonly items: ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
            readonly directItems: ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
            readonly errors: {
                [propName: string]: string[];
            };
            getValueByName(name: string, canAccessSuperData?: boolean | undefined): any;
            getPristineValueByName(name: string): any;
            getItemById(id: string): ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
            getItemByName(name: string): ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
            getItemsByName(name: string): ({
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & {
                focus: () => void;
                blur: () => void;
                config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                    required?: boolean | undefined;
                    unique?: boolean | undefined;
                    value?: any;
                    rules?: string | {
                        [propName: string]: any;
                    } | undefined;
                    messages?: {
                        [propName: string]: string;
                    } | undefined;
                    multiple?: boolean | undefined;
                    delimiter?: string | undefined;
                    valueField?: string | undefined;
                    labelField?: string | undefined;
                    joinValues?: boolean | undefined;
                    extractValue?: boolean | undefined;
                    type?: string | undefined;
                    id?: string | undefined;
                    selectFirst?: boolean | undefined;
                    autoFill?: any;
                    clearValueOnHidden?: boolean | undefined;
                    validateApi?: boolean | undefined;
                    minLength?: number | undefined;
                    maxLength?: number | undefined;
                    validateOnChange?: boolean | undefined;
                    label?: string | undefined;
                }) => void;
                validate: (data: Object, hook?: any, customRules?: {
                    [propName: string]: any;
                } | undefined) => Promise<boolean>;
                setError: (msg: string | string[], tag?: string | undefined) => void;
                addError: (msg: string | (string | {
                    msg: string;
                    rule: string;
                })[], tag?: string | undefined) => void;
                clearError: (tag?: string | undefined) => void;
                setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
                loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                    extendsOptions?: boolean | undefined;
                }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
                expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
                syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
                setLoading: (value: boolean) => void;
                setSubStore: (store: any) => void;
                getSubStore: () => any;
                reset: (keepErrors?: boolean | undefined) => void;
                resetValidationStatus: (tag?: string | undefined) => void;
                openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
                closeDialog: (result?: any) => void;
                changeTmpValue: (value: any) => void;
                changeEmitedValue: (value: any) => void;
                addSubFormItem: (item: any) => void;
                removeSubFormItem: (item: any) => void;
                loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
            readonly valid: boolean;
            readonly validating: boolean;
            readonly isPristine: boolean;
            readonly modified: boolean;
            readonly persistKey: string;
        } & {
            setInited: (value: boolean) => void;
            setValues: (values: object, tag?: object | undefined, replace?: boolean | undefined) => void;
            setValueByName: (name: string, value: any, isPristine?: boolean | undefined, force?: boolean | undefined) => void;
            trimValues: () => void;
            submit: (fn?: ((values: object) => Promise<any>) | undefined, hooks?: (() => Promise<any>)[] | undefined, failedMessage?: string | undefined, validateErrCb?: (() => void) | undefined) => Promise<any>;
            validate: (hooks?: (() => Promise<any>)[] | undefined, forceValidate?: boolean | undefined) => Promise<boolean>;
            validateFields: (fields: (string | {
                name: string;
                rules: {
                    [propName: string]: any;
                };
            })[]) => Promise<boolean>;
            clearErrors: () => void;
            saveRemote: (api: import("amis-core").Api, data?: object | undefined, options?: import("amis-core").fetchOptions | undefined) => Promise<any>;
            reset: (cb?: ((data: any) => void) | undefined, resetData?: boolean | undefined) => void;
            syncOptions: import("lodash").DebouncedFunc<() => void>;
            setCanAccessSuperData: (value?: boolean | undefined) => void;
            deleteValueByName: (name: string) => void;
            getLocalPersistData: () => void;
            setLocalPersistData: (keys?: string[] | undefined) => void;
            clearLocalPersistData: () => void;
            setPersistData: (value?: string | undefined) => void;
            clear: (cb?: ((data: any) => void) | undefined) => void;
            updateSavedData: () => void;
            setFormItemErrors: (errors: {
                [propName: string]: string;
            }, tag?: string | undefined) => void;
            getItemsByPath: (key: string) => any[] | null;
            setRestError: (errors: string[]) => void;
            addRestError: (msg: string, name?: string | string[] | undefined) => void;
            clearRestError: () => void;
            beforeDestroy(): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        formItem?: ({
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            isFocused: boolean;
            type: string;
            label: string;
            unique: boolean;
            loading: boolean;
            required: boolean;
            tmpValue: any;
            emitedValue: any;
            rules: any;
            messages: any;
            errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                rule: import("mobx-state-tree").IType<string | undefined, string, string>;
            }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                rule: import("mobx-state-tree").IType<string | undefined, string, string>;
            }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
            name: string;
            itemId: string;
            unsetValueOnInvisible: boolean;
            itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            validated: boolean;
            validating: boolean;
            multiple: boolean;
            delimiter: string;
            valueField: string;
            labelField: string;
            joinValues: boolean;
            extractValue: boolean;
            options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
            expressionsInOptions: boolean;
            selectFirst: boolean;
            autoFill: any;
            clearValueOnHidden: boolean;
            validateApi: any;
            selectedOptions: any;
            filteredOptions: any;
            dialogSchema: any;
            dialogOpen: boolean;
            dialogData: any;
            resetValue: any;
            validateOnChange: boolean;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & {
            readonly subFormItems: any;
            readonly form: any;
            readonly value: any;
            readonly prinstine: any;
            readonly errors: string[];
            readonly valid: boolean;
            readonly errClassNames: string;
            readonly lastSelectValue: string;
            getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
        } & {
            focus: () => void;
            blur: () => void;
            config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                required?: boolean | undefined;
                unique?: boolean | undefined;
                value?: any;
                rules?: string | {
                    [propName: string]: any;
                } | undefined;
                messages?: {
                    [propName: string]: string;
                } | undefined;
                multiple?: boolean | undefined;
                delimiter?: string | undefined;
                valueField?: string | undefined;
                labelField?: string | undefined;
                joinValues?: boolean | undefined;
                extractValue?: boolean | undefined;
                type?: string | undefined;
                id?: string | undefined;
                selectFirst?: boolean | undefined;
                autoFill?: any;
                clearValueOnHidden?: boolean | undefined;
                validateApi?: boolean | undefined;
                minLength?: number | undefined;
                maxLength?: number | undefined;
                validateOnChange?: boolean | undefined;
                label?: string | undefined;
            }) => void;
            validate: (data: Object, hook?: any, customRules?: {
                [propName: string]: any;
            } | undefined) => Promise<boolean>;
            setError: (msg: string | string[], tag?: string | undefined) => void;
            addError: (msg: string | (string | {
                msg: string;
                rule: string;
            })[], tag?: string | undefined) => void;
            clearError: (tag?: string | undefined) => void;
            setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
            loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                extendsOptions?: boolean | undefined;
            }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
            deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
            deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
            expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
            syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
            setLoading: (value: boolean) => void;
            setSubStore: (store: any) => void;
            getSubStore: () => any;
            reset: (keepErrors?: boolean | undefined) => void;
            resetValidationStatus: (tag?: string | undefined) => void;
            openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
            closeDialog: (result?: any) => void;
            changeTmpValue: (value: any) => void;
            changeEmitedValue: (value: any) => void;
            addSubFormItem: (item: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) => void;
            removeSubFormItem: (item: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) => void;
            loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        } & {
            isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            type: import("mobx-state-tree").IType<string | undefined, string, string>;
            label: import("mobx-state-tree").IType<string | undefined, string, string>;
            unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            tmpValue: import("mobx-state-tree").IType<any, any, any>;
            emitedValue: import("mobx-state-tree").IType<any, any, any>;
            rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                rule: import("mobx-state-tree").IType<string | undefined, string, string>;
            }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
            name: import("mobx-state-tree").ISimpleType<string>;
            itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
            unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
            valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
            labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
            joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
            expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            autoFill: import("mobx-state-tree").IType<any, any, any>;
            clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            dialogSchema: import("mobx-state-tree").IType<any, any, any>;
            dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            dialogData: import("mobx-state-tree").IType<any, any, any>;
            resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & {
            readonly subFormItems: any;
            readonly form: any;
            readonly value: any;
            readonly prinstine: any;
            readonly errors: string[];
            readonly valid: boolean;
            readonly errClassNames: string;
            readonly lastSelectValue: string;
            getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
        } & {
            focus: () => void;
            blur: () => void;
            config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength, validateOnChange, label }: {
                required?: boolean | undefined;
                unique?: boolean | undefined;
                value?: any;
                rules?: string | {
                    [propName: string]: any;
                } | undefined;
                messages?: {
                    [propName: string]: string;
                } | undefined;
                multiple?: boolean | undefined;
                delimiter?: string | undefined;
                valueField?: string | undefined;
                labelField?: string | undefined;
                joinValues?: boolean | undefined;
                extractValue?: boolean | undefined;
                type?: string | undefined;
                id?: string | undefined;
                selectFirst?: boolean | undefined;
                autoFill?: any;
                clearValueOnHidden?: boolean | undefined;
                validateApi?: boolean | undefined;
                minLength?: number | undefined;
                maxLength?: number | undefined;
                validateOnChange?: boolean | undefined;
                label?: string | undefined;
            }) => void;
            validate: (data: Object, hook?: any, customRules?: {
                [propName: string]: any;
            } | undefined) => Promise<boolean>;
            setError: (msg: string | string[], tag?: string | undefined) => void;
            addError: (msg: string | (string | {
                msg: string;
                rule: string;
            })[], tag?: string | undefined) => void;
            clearError: (tag?: string | undefined) => void;
            setOptions: (options: object[], onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
            loadOptions: (api: import("amis-core").Api, data?: object | undefined, config?: (import("amis-core").fetchOptions & {
                extendsOptions?: boolean | undefined;
            }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<import("amis-core").Payload | null>;
            deferLoadOptions: (option: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
            deferLoadLeftOptions: (option: any, leftOptions: any, api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<import("amis-core").Payload | null>;
            expandTreeOptions: (nodePathArr: any[], api: import("amis-core").Api, data?: object | undefined, config?: import("amis-core").fetchOptions | undefined) => Promise<void | import("amis-core").Payload | null>;
            syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
            setLoading: (value: boolean) => void;
            setSubStore: (store: any) => void;
            getSubStore: () => any;
            reset: (keepErrors?: boolean | undefined) => void;
            resetValidationStatus: (tag?: string | undefined) => void;
            openDialog: (schema: any, ctx: any, callback?: ((ret?: any) => void) | undefined) => void;
            closeDialog: (result?: any) => void;
            changeTmpValue: (value: any) => void;
            changeEmitedValue: (value: any) => void;
            addSubFormItem: (item: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) => void;
            removeSubFormItem: (item: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                isFocused: boolean;
                type: string;
                label: string;
                unique: boolean;
                loading: boolean;
                required: boolean;
                tmpValue: any;
                emitedValue: any;
                rules: any;
                messages: any;
                errorData: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>>;
                name: string;
                itemId: string;
                unsetValueOnInvisible: boolean;
                itemsRef: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
                validated: boolean;
                validating: boolean;
                multiple: boolean;
                delimiter: string;
                valueField: string;
                labelField: string;
                joinValues: boolean;
                extractValue: boolean;
                options: any[] & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>>;
                expressionsInOptions: boolean;
                selectFirst: boolean;
                autoFill: any;
                clearValueOnHidden: boolean;
                validateApi: any;
                selectedOptions: any;
                filteredOptions: any;
                dialogSchema: any;
                dialogOpen: boolean;
                dialogData: any;
                resetValue: any;
                validateOnChange: boolean;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            } & {
                isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                type: import("mobx-state-tree").IType<string | undefined, string, string>;
                label: import("mobx-state-tree").IType<string | undefined, string, string>;
                unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                tmpValue: import("mobx-state-tree").IType<any, any, any>;
                emitedValue: import("mobx-state-tree").IType<any, any, any>;
                rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
                    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    tag: import("mobx-state-tree").IType<string | undefined, string, string>;
                    rule: import("mobx-state-tree").IType<string | undefined, string, string>;
                }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
                name: import("mobx-state-tree").ISimpleType<string>;
                itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
                unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
                validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
                valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
                labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
                joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
                expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                autoFill: import("mobx-state-tree").IType<any, any, any>;
                clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                dialogSchema: import("mobx-state-tree").IType<any, any, any>;
                dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                dialogData: import("mobx-state-tree").IType<any, any, any>;
                resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
                validateOnChange: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[] | undefined): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & {
                readonly subFormItems: any;
                readonly form: any;
                readonly value: any;
                readonly prinstine: any;
                readonly errors: string[];
                readonly valid: boolean;
                readonly errClassNames: string;
                readonly lastSelectValue: string;
                getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
            } & any, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) => void;
            loadAutoUpdateData: (api: import("amis-core").Api, data?: object | undefined, silent?: boolean | undefined) => Promise<import("amis-core").Payload>;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        formInited?: boolean | undefined;
        formMode?: "horizontal" | "inline" | "normal" | "row" | "default" | undefined;
        formHorizontal?: import("amis-core").FormHorizontal | undefined;
        formLabelAlign?: import("amis-core/lib/renderers/Item").LabelAlign | undefined;
        formLabelWidth?: string | number | undefined;
        defaultSize?: "full" | "xs" | "sm" | "md" | "lg" | undefined;
        size?: "full" | "xs" | "sm" | "md" | "lg" | undefined;
        labelAlign?: import("amis-core/lib/renderers/Item").LabelAlign | undefined;
        labelWidth?: string | number | undefined;
        disabled?: boolean | undefined;
        btnDisabled?: boolean | undefined;
        defaultValue?: any;
        value?: any;
        prinstine?: any;
        setPrinstineValue?: ((value: any) => void) | undefined;
        onChange?: ((value: any, submitOnChange?: boolean | undefined, changeImmediately?: boolean | undefined) => void) | undefined;
        onBulkChange?: ((values: {
            [propName: string]: any;
        }, submitOnChange?: boolean | undefined) => void) | undefined;
        addHook?: ((fn: Function, mode?: "validate" | "init" | "flush" | undefined) => () => void) | undefined;
        removeHook?: ((fn: Function, mode?: "validate" | "init" | "flush" | undefined) => void) | undefined;
        renderFormItems?: ((schema: Partial<import("amis-core/lib/renderers/Form").FormSchemaBase>, region: string, props: any) => JSX.Element) | undefined;
        onFocus?: ((e: any) => void) | undefined;
        onBlur?: ((e: any) => void) | undefined;
        formItemValue?: any;
        getValue?: (() => any) | undefined;
        setValue?: ((value: any, key: string) => void) | undefined;
        inputClassName?: string | undefined;
        renderControl?: ((props: FormControlProps) => JSX.Element) | undefined;
        inputOnly?: boolean | undefined;
        renderLabel?: boolean | undefined;
        renderDescription?: boolean | undefined;
        sizeMutable?: boolean | undefined;
        wrap?: boolean | undefined;
        hint?: string | undefined;
        description?: string | undefined;
        descriptionClassName?: string | undefined;
        errors?: {
            [propName: string]: string;
        } | undefined;
        error?: string | undefined;
        showErrorMsg?: boolean | undefined;
        remark?: import("../Remark").SchemaRemark | undefined;
        hidden?: boolean | undefined;
        label?: string | false | undefined;
        $ref?: string | undefined;
        disabledOn?: string | undefined;
        hiddenOn?: string | undefined;
        visible?: boolean | undefined;
        visibleOn?: string | undefined;
        id?: string | undefined;
        desc?: string | undefined;
        placeholder?: string | undefined;
        labelRemark?: import("../Remark").SchemaRemark | undefined;
        labelClassName?: string | undefined;
        submitOnChange?: boolean | undefined;
        readOnly?: boolean | undefined;
        readOnlyOn?: string | undefined;
        validateOnChange?: boolean | undefined;
        mode?: "horizontal" | "inline" | "normal" | undefined;
        horizontal?: import("amis-core").FormHorizontal | undefined;
        inline?: boolean | undefined;
        required?: boolean | undefined;
        validationErrors?: {
            [propName: string]: any;
            isAlpha?: string | undefined;
            isAlphanumeric?: string | undefined;
            isEmail?: string | undefined;
            isFloat?: string | undefined;
            isInt?: string | undefined;
            isJson?: string | undefined;
            isLength?: string | undefined;
            isNumeric?: string | undefined;
            isRequired?: string | undefined;
            isUrl?: string | undefined;
            matchRegexp?: string | undefined;
            matchRegexp2?: string | undefined;
            matchRegexp3?: string | undefined;
            matchRegexp4?: string | undefined;
            matchRegexp5?: string | undefined;
            maxLength?: string | undefined;
            maximum?: string | undefined;
            minLength?: string | undefined;
            minimum?: string | undefined;
            isDateTimeSame?: string | undefined;
            isDateTimeBefore?: string | undefined;
            isDateTimeAfter?: string | undefined;
            isDateTimeSameOrBefore?: string | undefined;
            isDateTimeSameOrAfter?: string | undefined;
            isDateTimeBetween?: string | undefined;
            isTimeSame?: string | undefined;
            isTimeBefore?: string | undefined;
            isTimeAfter?: string | undefined;
            isTimeSameOrBefore?: string | undefined;
            isTimeSameOrAfter?: string | undefined;
            isTimeBetween?: string | undefined;
        } | undefined;
        validations?: string | {
            [propName: string]: any;
            isAlpha?: boolean | undefined;
            isAlphanumeric?: boolean | undefined;
            isEmail?: boolean | undefined;
            isFloat?: boolean | undefined;
            isInt?: boolean | undefined;
            isJson?: boolean | undefined;
            isLength?: number | undefined;
            isNumeric?: boolean | undefined;
            isRequired?: boolean | undefined;
            isUrl?: boolean | undefined;
            matchRegexp?: string | undefined;
            matchRegexp1?: string | undefined;
            matchRegexp2?: string | undefined;
            matchRegexp3?: string | undefined;
            matchRegexp4?: string | undefined;
            matchRegexp5?: string | undefined;
            maxLength?: number | undefined;
            maximum?: number | undefined;
            minLength?: number | undefined;
            minimum?: number | undefined;
            isDateTimeSame?: string | string[] | undefined;
            isDateTimeBefore?: string | string[] | undefined;
            isDateTimeAfter?: string | string[] | undefined;
            isDateTimeSameOrBefore?: string | string[] | undefined;
            isDateTimeSameOrAfter?: string | string[] | undefined;
            isDateTimeBetween?: string | string[] | undefined;
            isTimeSame?: string | string[] | undefined;
            isTimeBefore?: string | string[] | undefined;
            isTimeAfter?: string | string[] | undefined;
            isTimeSameOrBefore?: string | string[] | undefined;
            isTimeSameOrAfter?: string | string[] | undefined;
            isTimeBetween?: string | string[] | undefined;
        } | undefined;
        clearValueOnHidden?: boolean | undefined;
        validateApi?: string | import("amis-core").BaseApiObject | undefined;
        options?: any;
        language?: string | undefined;
        diffValue?: string | undefined;
    };
}
