/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-02 12:43:07
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getPage, Router } from "@steedos-widgets/amis-lib";


export const PageListView = async (props) => {
  const { formFactor: defaultFormFactor, app_id, tab_id, listview_id, display, defaultData } = props
  
  console.log(props);
  if (display)
    Router.setTabDisplayAs(tab_id, display)

  const displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : Router.getTabDisplayAs(tab_id);

  const formFactor = (["split_three", "split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const page = await getPage({type: 'list', appId: app_id, objectName: tab_id, formFactor})

  if(page === false){
    return {
      "type": "spinner",
      "show": true
    }
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: tab_id,
  });
  const splitOffset = displayAs === "split_three" ? "w-1/2" : "w-[388px]";
  const gridClassName = "absolute inset-0 sm:m-3 sm:mb-0 sm:border sm:shadow sm:rounded border-slate-300 border-solid bg-gray-100";
  const splitClassName = `absolute top-0 bottom-0 ${splitOffset} border-r border-slate-300 border-solid bg-gray-100`;
  const schema = page? JSON.parse(page.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": tab_id,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": (defaultFormFactor !== 'SMALL'),
    "formFactor": formFactor,
    className: displayAs === 'grid' ? gridClassName : splitClassName
  }
  

  return {
    type: 'service',
    id: listViewId,
    className: "steedos-listview static",
    data: {
      ...defaultData,
      objectName: tab_id,
      listViewId: listViewId,
      listName: listview_id,
      appId: app_id,
      formFactor: formFactor,
      displayAs: displayAs,
      scopeId: listViewId,
    },
    body: schema
  }
}
