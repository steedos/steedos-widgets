/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-03-25 17:53:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-10 22:55:54
 */
import type { ChangeEvent } from "react";
import React, { useCallback, useEffect, useState } from "react";

import type {
    IAfterGuiAttachedParams,
    IDoesFilterPassParams,
} from "ag-grid-enterprise";
import type { CustomFilterProps } from "ag-grid-react";
import { useGridFilter } from "ag-grid-react";

export const DateFilter = (props: CustomFilterProps) => {
    // console.log("=DateFilter==props====", props);
    const { model, onModelChange, context, colDef } = props;
    const { filterParams, cellEditorParams } = colDef;
    const { amisRender, amisData } = context;
    const fieldConfig = cellEditorParams?.fieldConfig || {};

    const doesFilterPass = useCallback((params: IDoesFilterPassParams) => {
        // doesFilterPass only gets called if the filter is active,
        return true;
    }, []);

    const afterGuiAttached = useCallback(
        ({ hidePopup }: IAfterGuiAttachedParams) => {
        },
        [],
    );

    const afterGuiDetached = useCallback(
        () => {
        },
        [],
    );

    // register filter handlers with the grid
    useGridFilter({
        doesFilterPass,
        // afterGuiAttached,
        // afterGuiDetached,
    });

    const random = Math.random().toString(36).substring(2);
    const cellFormId = `filterForm__date__${random}`;

    // 定义 amis 的 schema
    // 设置 showSystemFields 和 readonly 属性是因为 创建时间、创建人、修改时间、修改人 这几个系统字段, 在表单中不可编辑且默认隐藏
    const amisSchema = {
        id: cellFormId,
        type: 'form',
        wrapWithPanel: false,
        body: [
            {
                type: 'steedos-field',
                // value: this.value,
                ctx: {
                    showSystemFields: true
                },
                config: Object.assign({}, fieldConfig, {
                    label: false,
                    type: 'input-date-range',
                    readonly: false,
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
                                            var updateAgGridFilterValue = context.props.updateAgGridFilterValue;
                                            updateAgGridFilterValue(event.data.value);
                                        `
                                    }
                                ]
                            },
                            // 点击弹出日期时间popover会关闭filter菜单，需要单独处理，见：https://ag-grid.com/react-data-grid/component-filter/#custom-filters-containing-a-popup-element
                            "focus": {
                                "actions": [
                                    {
                                        "actionType": "custom",
                                        "script": `
                                            setTimeout(function(){
                                                var popover = document.querySelector('.antd-PopOver.antd-DateRangePicker-popover');
                                                popover && popover.classList.add('ag-custom-component-popup');
                                            }, 300);
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
            [fieldConfig.name]: null //防止 amisData 中有同名字段
        }
    };

    const updateValue = (val: any) => {
        let updatedModel: any;
        if (val?.length) {
            updatedModel = {
                dateFrom: val[0],
                dateTo: val[1],
                filterType: "date",
                type: "between"
            };
        }
        onModelChange(updatedModel);
    };

    return (
        <form className="ag-filter-wrapper ag-focus-managed">
            <div className="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
                <div className='amis-ag-grid-filter amis-ag-grid-filter-date' style={{
                    width: '100%',
                    height: '100%'
                }}>
                    {amisRender('body', amisSchema, {
                        // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个,
                        data: amisData,
                        updateAgGridFilterValue: updateValue,
                        // 测试到直接使用下面的onChange，用户操作比较快的时间不会触发，所以迁移到上面的amis onEvent中
                        // onChange: (data, value, props) => {
                        //     console.log(`change....`)
                        //     updateValue(value[fieldConfig.name]);
                        // }
                    })}
                </div>
            </div>
        </form>
    )
};