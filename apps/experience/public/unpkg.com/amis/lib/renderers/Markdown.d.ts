/**
 * @file 用来渲染 Markdown
 */
import React from 'react';
import { RendererProps } from 'amis-core';
import { BaseSchema } from '../Schema';
/**
 * Markdown 渲染
 * 文档：https://baidu.gitee.io/amis/docs/components/markdown
 */
export interface MarkdownSchema extends BaseSchema {
    /**
     * markdown 渲染
     */
    type: 'markdown';
    /**
     * markdown 内容
     */
    value?: string;
    /**
     * 样式类
     */
    className?: string;
    /**
     * 名字映射
     */
    name?: string;
}
export interface MarkdownProps extends RendererProps, Omit<MarkdownSchema, 'type' | 'className'> {
}
interface MarkdownState {
    content: string;
}
export declare class Markdown extends React.Component<MarkdownProps, MarkdownState> {
    constructor(props: MarkdownProps);
    componentDidUpdate(prevProps: MarkdownProps): void;
    updateContent(): Promise<void>;
    render(): JSX.Element;
}
export declare class MarkdownRenderer extends Markdown {
}
export {};
