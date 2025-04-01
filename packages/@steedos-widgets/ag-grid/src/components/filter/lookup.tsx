/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-03-25 17:53:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-01 17:34:20
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
                    multiple: true,
                    readonly: false,
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
        data: {
            [fieldConfig.name]: null //防止 amisData 中有同名字段
        }
    };

    const updateValue = (val: any) => {
        let updatedModel: any;
        if (val?.length) {
            updatedModel = {
                values: val,
                filterType: "lookup"
            };
        }
        onModelChange(updatedModel);
    };

    return (
        <form className="ag-filter-wrapper ag-focus-managed">
            <div className="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
                <div className='amis-ag-grid-filter amis-ag-grid-filter-lookup' style={{
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