/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 15:46:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-15 17:16:59
 * @Description:
 */
import { AmisRender } from "@/components/AmisRender";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { isEmpty, filter, values, sortBy, map, compact } from "lodash";
import { getSearchableFieldsFilterSchema } from "@steedos-widgets/amis-lib";

export function SearchableFieldsFilter({ schema, listViewId, listViewName, appId, onClose, cols }) {
  const searchableFieldsStoreKey = location.pathname + "/searchable_fields/" + listViewId;
  let defaultSearchableFields = localStorage.getItem(searchableFieldsStoreKey);
  if(!defaultSearchableFields){
    let listView = schema.uiSchema.list_views[listViewName];
    defaultSearchableFields = listView && listView.searchable_fields;
    if(defaultSearchableFields && defaultSearchableFields.length){
      defaultSearchableFields = map(defaultSearchableFields, 'field');
    }
  }
  if(isEmpty(defaultSearchableFields)){
    defaultSearchableFields = map(
      filter(values(schema.uiSchema.fields), (field) => {
        return field.searchable;
      }),
      "name"
    );
  }
  if(defaultSearchableFields && typeof defaultSearchableFields === "string"){
    defaultSearchableFields = defaultSearchableFields.split(",");
  }
  const [searchableFields, setSearchableFields] = useState(defaultSearchableFields);
  const [searchableFieldsSchema, setSearchableFieldsSchema] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!isEmpty(searchableFields)) {
      //   const scope = SteedosUI.getRef(listViewId);
      // scope.getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterReset();
      let initData = {};
      const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
      let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
      if(localListViewProps){
          localListViewProps = JSON.parse(localListViewProps);
          let filterFormValues = _.pickBy(localListViewProps, function(n,k){
            return /^__searchable__/g.test(k);
          });
          if(!_.isEmpty(filterFormValues)){
            initData = filterFormValues;
          }
      }
      getSearchableFieldsFilterSchema(
        schema.uiSchema,
        sortBy(
          compact(
            map(searchableFields, (fieldName) => {
              return schema.uiSchema.fields[fieldName];
            })
          ),
          "sort_no"
        ), { initData }
      ).then((data) => {
        setSearchableFieldsSchema(data);
      });
    }
  }, [searchableFields]);

  const onSearch = (e) => {
    const scope = SteedosUI.getRef(
      SteedosUI.getRefId({
        type: "fieldsSearch",
        appId: appId,
        name: schema.uiSchema.name,
      })
    );
    const formValues = scope.getComponentByName("listview-filter-form").getValues();
    SteedosUI.getRef(listViewId)
      .getComponentByName(`page.listview_${schema.uiSchema.name}`)
      .handleFilterSubmit(formValues);
  };
  return (
    <div className="border-gray slds-grid slds-grid_vertical slds-nowrap ">
      <div className="slds-filters">
        <div className="slds-filters__body p-0">
          {searchableFieldsSchema && (
            <AmisRender
              id={SteedosUI.getRefId({
                type: "fieldsSearch",
                appId: appId,
                name: schema.uiSchema.name,
              })}
              schema={searchableFieldsSchema}
              router={router}
            ></AmisRender>
          )}
        </div>
        <div className="slds-filters__footer slds-grid slds-shrink-none flex justify-between p-0">
          <div className="space-x-4">
            {searchableFieldsSchema && <button
              className="slds-button slds-button_neutral"
              type="button"
              onClick={onSearch}
            >
              <svg
                className="slds-button__icon slds-button__icon_left"
                aria-hidden="true"
              >
                <use
                  xlinkHref={`/assets/icons/utility-sprite/svg/symbols.svg#search`}
                ></use>
              </svg>
              搜索
            </button>
            }
            <button
              className="slds-button_reset slds-text-link slds-col_bump-left"
              type="button"
              onClick={() => {
                return SteedosUI.Field.showFieldsTransfer({
                  objectName: schema.uiSchema.name,
                  data: {
                    fields: searchableFields,
                  },
                  onOk: (values) => {
                    setSearchableFields(values.fields);
                    localStorage.setItem(searchableFieldsStoreKey, values.fields)
                  },
                  onCancel: () => {
                    // console.log(`取消操作!!!`)
                  },
                  title: '设置搜索项'
                });
              }}
            >
              设置搜索项
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
