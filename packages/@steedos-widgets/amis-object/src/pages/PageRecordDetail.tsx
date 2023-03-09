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
  const { formFactor: defaultFormFactor, appId, tabId, listviewId, recordId, display, sideObject = tabId, sideListviewId = listviewId, $schema } = props
  
  if (display)
    Router.setTabDisplayAs(tabId, display)

  let displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : sideObject? 'split': Router.getTabDisplayAs(tabId);
  const formFactor = (["split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const renderId = SteedosUI.getRefId({
    type: "detail",
    appId: appId,
    name: tabId,
  });

  const listPage = await getPage({type: 'list', appId: appId, objectName: tabId, formFactor})

  let recordSchema = {}
  if (recordId) {

    const recordPage = await getPage({type: 'record', appId: appId, objectName: tabId, formFactor: defaultFormFactor});
    recordSchema = recordPage? JSON.parse(recordPage.schema) : {
      "type": "wrapper",
      "className": "p-0 m-0 sm:m-3 flex-1",
      "name": `amis-${appId}-${tabId}-detail`,
      "body": [
        {
          "type": "steedos-record-detail",
          "recordId": "${recordId}",
          "objectApiName": "${objectName}",
          appId: appId,
        }
      ],
    }
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: appId,
    name: sideObject,
  });

  const listSchema = listPage? JSON.parse(listPage.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": sideObject,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": true,
    "formFactor": 'SMALL',
  }

  return {
    type: 'service',
    data: {
      ...$schema.data,
      objectName: tabId,
      listViewId: sideListviewId,
      listName: sideListviewId,
      recordId,
      appId: appId,
      formFactor: formFactor,
      displayAs: displayAs,
      scopeId: listViewId,
    },
    "className": 'p-0 flex flex-1 overflow-hidden h-full',
    body: (displayAs === 'grid') ? recordSchema : [
      {
        "type": "wrapper",
        "className": `p-0 flex-shrink-0 min-w-[388px] overflow-y-auto border-r border-gray-200 lg:order-first lg:flex lg:flex-col`,
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
