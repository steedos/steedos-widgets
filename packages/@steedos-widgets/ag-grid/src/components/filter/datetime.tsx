/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-03-25 17:53:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-25 23:20:27
 */
import type { ChangeEvent } from "react";
import React, { useCallback, useEffect, useState } from "react";

import type {
    IAfterGuiAttachedParams,
    IDoesFilterPassParams,
} from "ag-grid-enterprise";
import type { CustomFilterProps } from "ag-grid-react";
import { useGridFilter } from "ag-grid-react";

export const DateTimeFilter = (props: CustomFilterProps) => {
    // console.log("=DateTimeFilter==props====", props);
    const { model, onModelChange, context, colDef } = props;
    const { filterParams, cellEditorParams } = colDef;
    const { amisRender, amisData } = context;
    const fieldConfig = cellEditorParams?.fieldConfig || {};

    const doesFilterPass = useCallback((params: IDoesFilterPassParams) => {
        // doesFilterPass only gets called if the filter is active,
        return true;
    }, []);

    // TODO:点击弹出日期时间popover会关闭filter菜单，需要单独处理，见：https://ag-grid.com/react-data-grid/component-filter/#custom-filters-containing-a-popup-element
    function onAntdDateRangePickerPopoverClick(event) {
        // console.log("=onAntdDateRangePickerPopoverClick====88====");
        // // 获取 grid 的 DOM 元素
        // var gridElement = document.querySelector('.steedos-airtable-grid');

        // if (!gridElement) {
        //     return;
        // }

        var targetElement = event.target;

        // 如果点击发生在 grid 内部，不执行 stopEditing，由ag-grid内部规则处理
        if (targetElement.closest('.antd-PopOver.antd-DateRangePicker-popover')) {
            // console.log("=onAntdDateRangePickerPopoverClick=====in closest===");
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    const afterGuiAttached = useCallback(
        ({ hidePopup }: IAfterGuiAttachedParams) => {
            // document.addEventListener('click', onAntdDateRangePickerPopoverClick);
        },
        [],
    );

    const afterGuiDetached = useCallback(
        () => {
            // document.removeEventListener('click', onAntdDateRangePickerPopoverClick);
        },
        [],
    );

    // register filter handlers with the grid
    useGridFilter({
        doesFilterPass,
        afterGuiAttached,
        afterGuiDetached,
    });

    const random = Math.random().toString(36).substring(2);
    const cellFormId = `filterForm__datetime__${random}`;

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
                    type: 'input-datetime-range',
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
                            // "focus": {
                            //     "actions": [
                            //         {
                            //             "actionType": "custom",
                            //             "script": `
                            //                 console.log("=====focus=====");
                            //                 var onAntdDateRangePickerPopoverClick = context.props.onAntdDateRangePickerPopoverClick;
                            //                 var popover = document.querySelector('.antd-PopOver.antd-DateRangePicker-popover');
                            //                 popover && popover.addEventListener('click', onAntdDateRangePickerPopoverClick);
                            //             `
                            //         }
                            //     ]
                            // }
                        },
                    }
                })
            }
        ],
        // data: {
        //     [fieldConfig.name]: value
        // }
    };

    const updateValue = (val: any) => {
        onModelChange({
            dateFrom: val[0],
            dateTo: val[1],
            filterType: "datetime",
            type: "between",
        });
    };

    return (
        <div className='amis-ag-grid-cell-editor amis-ag-grid-cell-editor-datetime' style={{
            width: '100%',
            height: '100%'
        }}>
            {amisRender('body', amisSchema, {
                // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个,
                data: amisData,
                updateAgGridFilterValue: updateValue,
                onAntdDateRangePickerPopoverClick,
                // 测试到直接使用下面的onChange，用户操作比较快的时间不会触发，所以迁移到上面的amis onEvent中
                // onChange: (data, value, props) => {
                //     console.log(`change....`)
                //     updateValue(value[fieldConfig.name]);
                // }
            })}
        </div>
    )
};