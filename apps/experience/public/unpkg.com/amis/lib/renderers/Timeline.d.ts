import React from 'react';
import { RendererProps } from 'amis-core';
import { BaseSchema, SchemaApi, SchemaCollection, SchemaTokenizeableString } from '../Schema';
export interface TimelineItemSchema extends Omit<BaseSchema, 'type'> {
    /**
     * 时间点
     */
    time: string;
    /**
     * 时间节点标题
     */
    title?: SchemaCollection;
    /**
     * 详细内容
     */
    detail?: string;
    /**
     * detail折叠时文案
     */
    detailCollapsedText?: string;
    /**
     * detail展开时文案
     */
    detailExpandedText?: string;
    /**
     * 时间点圆圈颜色
     */
    color?: string;
    /**
     * 图标
     */
    icon?: SchemaCollection;
}
export interface TimelineSchema extends BaseSchema {
    /**
     * 指定为 Timeline 时间轴渲染器
     */
    type: 'timeline';
    /**
     * 节点数据
     */
    items?: Array<TimelineItemSchema>;
    /**
     * API 或 数据映射
     */
    source?: SchemaApi | SchemaTokenizeableString;
    /**
     * 文字相对于时间轴展示方向
     */
    mode?: 'left' | 'right' | 'alternate';
    /**
     * 展示方向
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * 节点倒序
     */
    reverse?: boolean;
}
export interface TimelineProps extends RendererProps, Omit<TimelineSchema, 'className'> {
}
export declare function TimelineCmpt(props: TimelineProps): JSX.Element;
export declare class TimelineRenderer extends React.Component<TimelineProps> {
    render(): JSX.Element;
}
