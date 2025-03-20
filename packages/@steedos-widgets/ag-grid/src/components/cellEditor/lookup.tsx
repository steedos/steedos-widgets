/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-20 12:41:16
 */

import React from 'react';
import { CustomCellEditorProps } from 'ag-grid-react';

export const LookupCellEditor = (props: CustomCellEditorProps & {
    minWidth?: number;
    fieldConfig?: any;
}) => {
    const { context, eGridCell, column, fieldConfig, value, onValueChange, minWidth } = props;
    const { amisRender, amisData } = context;
    const random = Math.random().toString(36).substring(2);
    const cellFormId = `cellForm__editor__lookup__${random}`;

    const originalWidth = column.getActualWidth();
    const maxTagCount = fieldConfig.multiple ? (10 + Math.floor((originalWidth < minWidth ? minWidth : originalWidth) / 60)) : -1;

    // 定义 amis 的 schema
    const amisSchema = {
        id: cellFormId,
        type: 'form',
        wrapWithPanel: false,
        // debug: true,
        body: [
            {
                type: 'steedos-field',
                // value: this.value,
                config: Object.assign({}, fieldConfig, {
                    label: false,
                    amis: {
                        "overflowConfig": {
                            "maxTagCount": maxTagCount
                        }
                    }
                })
            }
        ],
        data: {
            [fieldConfig.name]: value
        }
    };

    const updateValue = (val: any) => {
        onValueChange(val);
    };

    return (
        <div className='amis-ag-grid-cell-editor amis-ag-grid-cell-editor-lookup' style={{
            width: '100%',
            height: '100%'
        }}>
            {amisRender('body', amisSchema, {
                // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个,
                data: amisData,
                onChange: (data, value, props) => {
                    console.log(`change....`)
                    updateValue(value[fieldConfig.name]);
                }
            })}
        </div>
    )
}