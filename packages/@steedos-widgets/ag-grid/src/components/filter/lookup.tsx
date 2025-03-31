/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-03-25 17:53:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-31 10:06:00
 */
import type { ChangeEvent } from "react";
import React, { useCallback, useEffect, useState } from "react";

import type {
    IAfterGuiAttachedParams,
    IDoesFilterPassParams,
} from "ag-grid-enterprise";
import type { CustomFilterProps } from "ag-grid-react";
import { useGridFilter } from "ag-grid-react";

export const LookupFilter = (props: CustomFilterProps) => {
    // console.log("=LookupFilter==props====", props);
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
    const cellFormId = `filterForm__lookup__${random}`;

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
                    multiple: true,
                    amis: {
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
                            }
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
            values: val,
            filterType: "lookup"
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
                // 测试到直接使用下面的onChange，用户操作比较快的时间不会触发，所以迁移到上面的amis onEvent中
                // onChange: (data, value, props) => {
                //     console.log(`change....`)
                //     updateValue(value[fieldConfig.name]);
                // }
            })}
        </div>
    )
};