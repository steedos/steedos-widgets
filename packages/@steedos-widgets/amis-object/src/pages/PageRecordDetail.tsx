/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-02 12:43:07
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getPage, Router } from "@steedos-widgets/amis-lib";


export const PageRecordDetail = async (props) => {
  const { formFactor: defaultFormFactor, app_id, tab_id, listview_id, recordId, display, side_object = tab_id, side_listview_id = listview_id, $schema } = props
  
  if (display)
    Router.setTabDisplayAs(tab_id, display)

  let displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : side_object? 'split': Router.getTabDisplayAs(tab_id);
  const formFactor = (["split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const renderId = SteedosUI.getRefId({
    type: "detail",
    appId: app_id,
    name: tab_id,
  });

  const listPage = await getPage({type: 'list', appId: app_id, objectName: tab_id, formFactor})

  let recordSchema = {}
  if (recordId) {

    const recordPage = await getPage({type: 'record', appId: app_id, objectName: tab_id, formFactor: defaultFormFactor});
    recordSchema = recordPage? JSON.parse(recordPage.schema) : {
      "type": "wrapper",
      "className": "p-0 m-0 sm:m-3 flex-1",
      "name": `amis-${app_id}-${tab_id}-detail`,
      "body": [
        {
          "type": "steedos-record-detail",
          "recordId": "${recordId}",
          "objectApiName": "${objectName}",
          appId: app_id,
        }
      ],
    }
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: side_object,
  });

  const listSchema = listPage? JSON.parse(listPage.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": side_object,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": true,
    "formFactor": 'SMALL',
  }

  return {
    type: 'service',
    data: {
      ...$schema.data,
      objectName: tab_id,
      listViewId: listViewId,
      listName: listview_id,
      recordId,
      appId: app_id,
      formFactor: formFactor,
      displayAs: displayAs,
      scopeId: listViewId,
    },
    "className": 'p-0 flex flex-1 overflow-hidden h-full',
    body: (displayAs === 'grid') ? recordSchema : [
      {
        "type": "wrapper",
        "className": `p-0 flex-shrink-0 min-w-32 overflow-y-auto border-r border-gray-200 lg:order-first lg:flex lg:flex-col`,
        "body": listSchema
      },
      {
        "type": "wrapper",
        "className": 'p-0 flex-1 overflow-y-auto focus:outline-none lg:order-last',
        "body": recordSchema
      }
    ]
  }
}
