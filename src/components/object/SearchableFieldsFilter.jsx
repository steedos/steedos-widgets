/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 15:46:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-08 15:23:03
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from "react";
import { isEmpty, filter, values, includes, map, compact } from 'lodash';
import { getSearchableFieldsFilterSchema } from "@/lib/objects";

export function SearchableFieldsFilter({schema, listViewId, appId}) {
    const [searchableFields, setSearchableFields] = useState(map(filter(values(schema.uiSchema.fields), (field)=>{
        return field.searchable;
    }), 'name'));
    const [searchableFieldsSchema, setSearchableFieldsSchema] = useState();
    const router = useRouter();

    useEffect(() => {
        if (!isEmpty(searchableFields)) {
        //   const scope = SteedosUI.getRef(listViewId);
          // scope.getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterReset();
          getSearchableFieldsFilterSchema(
            compact(map(searchableFields, (fieldName)=>{
                return schema.uiSchema.fields[fieldName]
            }))
          ).then((data) => {
            setSearchableFieldsSchema(data)
          });
        }
      }, [searchableFields]);
      
    const onSearch = (e)=>{
        const scope = SteedosUI.getRef(SteedosUI.getRefId({type: 'fieldsSearch', appId: appId, name: schema.uiSchema.name}));
        const formValues = scope.getComponentByName("page.form").getValues();
        SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterSubmit(formValues)
    }

    return (<div className="m-0 slds-panel slds-grid slds-grid_vertical slds-nowrap slds-panel_filters shadow-none border-none">
        <div className="slds-filters">
            <div className="slds-filters__header slds-grid slds-has-divider_bottom-space p-0 text-lg">字段搜索</div>
            <div className="slds-filters__body p-0">
                {searchableFieldsSchema && <AmisRender 
                id={SteedosUI.getRefId({type: 'fieldsSearch', appId: appId, name: schema.uiSchema.name})}
                schema={searchableFieldsSchema}
                router={router}></AmisRender>
                }
            </div>
            <div className="slds-filters__footer slds-grid slds-shrink-none flex justify-between p-0">
                <div></div>
                <div className="space-x-1">
                    <button className="slds-button_reset slds-text-link slds-col_bump-left" type="button" onClick={()=>{
                        return SteedosUI.Field.showFieldsTransfer(schema.uiSchema.name, {
                            fields: searchableFields
                        }, (values)=>{
                            setSearchableFields(values.fields)
                        }, ()=>{
                            console.log(`取消操作!!!`)
                        });
                    }}>选择过滤字段</button>
                    <button className="slds-button slds-button_neutral" type="button" onClick={onSearch}>
                        <svg
                        className="slds-button__icon slds-button__icon_left"
                        aria-hidden="true"
                        >
                        <use
                            xlinkHref={`/assets/icons/utility-sprite/svg/symbols.svg#search`}
                        ></use>
                        </svg>
                        搜索</button>
                </div>
            </div>
        </div>
    </div>)
}