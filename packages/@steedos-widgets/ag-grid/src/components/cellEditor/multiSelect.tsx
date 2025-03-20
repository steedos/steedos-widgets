/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-20 12:42:26
 */

import React from 'react';
import { CustomCellEditorProps } from 'ag-grid-react';

export const MultiSelectCellEditor = (props: CustomCellEditorProps & {
    minWidth?: number;
    fieldConfig?: any;
    values?: any;
}) => {
    const { context, eGridCell, column, fieldConfig, value, onValueChange, values, minWidth } = props;
    const { amisRender, amisData } = context;
    const random = Math.random().toString(36).substring(2);
    const cellFormId = `cellForm__editor__select-multiple__${random}`;

    const originalWidth = column.getActualWidth();
    const maxTagCount = Math.floor((originalWidth < minWidth ? minWidth : originalWidth) / 60);

    let fieldOptions = values;
    fieldOptions = fieldOptions && fieldOptions.map(function (n: string) { return { label: n, value: n } }) || [];

    // 定义 amis 的 schema
    const amisSchema = {
        id: cellFormId,
        type: 'form',
        wrapWithPanel: false,
        body: [
            {
                type: 'steedos-field',
                // value: this.value,
                config: Object.assign({}, fieldConfig, {
                    label: false,
                    type: 'select',
                    multiple: true,
                    options: fieldOptions,
                    amis: {
                        "popOverContainerSelector": `.steedos-airtable-grid`,//`#${this.eGui.id}`
                        "maxTagCount": maxTagCount,
                        "checkAll": true
                        // valuesNoWrap: true
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
        <div className='amis-ag-grid-cell-editor amis-ag-grid-cell-editor-select-multiple' style={{
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