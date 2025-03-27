/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-24 13:22:31
 */

import React from 'react';
import { CustomCellEditorProps } from 'ag-grid-react';

export const DateTimeCellEditor = (props: CustomCellEditorProps & {
    minWidth?: number;
    fieldConfig?: any;
}) => {
    const { context, eGridCell, column, fieldConfig, value, onValueChange } = props;
    const { amisRender, amisData } = context;
    const random = Math.random().toString(36).substring(2);
    const cellFormId = `cellForm__editor__datetime__${random}`;

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
                    amis: {
                        "popOverContainerSelector": `.steedos-airtable-grid`,//`#${this.eGui.id}`
                        // "closeOnSelect": false,// 不可以配置为false，否则会出现第一次点开控件时，点选日期后，输入框中小时值无故变成差8小时
                        // "embed": true
                        "onEvent": {
                            "change": {
                                "actions": [
                                    {
                                        "actionType": "custom",
                                        "script": `
                                            var updateAgGridCellEditorValue = context.props.updateAgGridCellEditorValue;
                                            updateAgGridCellEditorValue(event.data.value);
                                        `
                                    }
                                ]
                            }
                        },
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
        <div className='amis-ag-grid-cell-editor amis-ag-grid-cell-editor-datetime' style={{
            width: '100%',
            height: '100%'
        }}>
            {amisRender('body', amisSchema, {
                // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个,
                data: amisData,
                updateAgGridCellEditorValue: updateValue,
                // 测试到直接使用下面的onChange，用户操作比较快的时间不会触发，所以迁移到上面的amis onEvent中
                // onChange: (data, value, props) => {
                //     console.log(`change....`)
                //     updateValue(value[fieldConfig.name]);
                // }
            })}
        </div>
    )
}