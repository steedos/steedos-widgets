import React from 'react';
import { OptionsControlProps, ActionObject } from 'amis-core';
import { FormOptionsSchema, SchemaApi } from '../../Schema';
/**
 * Tree 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tree
 */
export interface TreeControlSchema extends FormOptionsSchema {
    type: 'input-tree';
    /**
     * 是否隐藏顶级
     */
    hideRoot?: boolean;
    /**
     * 顶级选项的名称
     */
    rootLabel?: string;
    /**
     * 顶级选项的值
     */
    rootValue?: any;
    /**
     * 显示图标
     */
    showIcon?: boolean;
    /**
     * ui级联关系，true代表级联选中，false代表不级联，默认为true
     */
    autoCheckChildren?: boolean;
    /**
     * 该属性代表数据级联关系，autoCheckChildren为true时生效，默认为false，具体数据级联关系如下：
     * 1.casacde为false，ui行为为级联选中子节点，子节点禁用；值只包含父节点的值
     * 2.cascade为false，withChildren为true，ui行为为级联选中子节点，子节点禁用；值包含父子节点的值
     * 3.cascade为true，ui行为级联选中子节点，子节点可反选，值包含父子节点的值，此时withChildren属性失效
     * 4.cascade不论为true还是false，onlyChildren为true，ui行为级联选中子节点，子节点可反选，值只包含子节点的值
     */
    cascade?: boolean;
    /**
     * 选父级的时候是否把子节点的值也包含在内。
     */
    withChildren?: boolean;
    /**
     * 选父级的时候，是否只把子节点的值包含在内
     */
    onlyChildren?: boolean;
    /**
     * 单选时，只运行选择叶子节点
     */
    onlyLeaf?: boolean;
    /**
     * 顶级节点是否可以创建子节点
     */
    rootCreatable?: boolean;
    /**
     * 是否开启节点路径模式
     */
    enableNodePath?: boolean;
    /**
     * 开启节点路径模式后，节点路径的分隔符
     */
    pathSeparator?: string;
    /**
     * 是否显示展开线
     */
    showOutline?: boolean;
    deferApi?: SchemaApi;
    /**
     * 需要高亮的字符串
     */
    highlightTxt?: string;
}
export interface TreeProps extends OptionsControlProps, Omit<TreeControlSchema, 'type' | 'options' | 'className' | 'inputClassName' | 'descriptionClassName'> {
    enableNodePath?: boolean;
    pathSeparator?: string;
}
export default class TreeControl extends React.Component<TreeProps> {
    static defaultProps: Partial<TreeProps>;
    treeRef: any;
    reload(): void;
    doAction(action: ActionObject, data: any, throwErrors: boolean): void;
    handleChange(value: any): Promise<void>;
    domRef(ref: any): void;
    validate(): any;
    render(): JSX.Element;
}
export declare class TreeControlRenderer extends TreeControl {
}
