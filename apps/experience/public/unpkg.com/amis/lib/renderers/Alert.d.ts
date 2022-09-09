import { RendererProps } from 'amis-core';
import React from 'react';
import { BaseSchema, SchemaCollection, SchemaIcon } from '../Schema';
import type { AlertProps } from 'amis-ui/lib/components/Alert2';
/**
 * Alert 提示渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/alert
 */
export interface AlertSchema extends BaseSchema {
    /**
     * 指定为提示框类型
     */
    type: 'alert';
    /**
     * 提示框标题
     */
    title?: string;
    /**
     * 内容区域
     */
    body: SchemaCollection;
    /**
     * 提示类型
     */
    level?: 'info' | 'warning' | 'success' | 'error' | 'danger';
    /**
     * 是否显示关闭按钮
     */
    showCloseButton?: boolean;
    /**
     * 关闭按钮CSS类名
     */
    closeButtonClassName?: string;
    /**
     * 是否显示ICON
     */
    showIcon?: boolean;
    /**
     * 左侧图标
     */
    icon?: SchemaIcon;
    /**
     * 图标CSS类名
     */
    iconClassName?: string;
}
export declare class TplRenderer extends React.Component<AlertProps & RendererProps> {
    render(): JSX.Element;
}
