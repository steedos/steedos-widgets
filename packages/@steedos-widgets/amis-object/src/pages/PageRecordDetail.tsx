/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-02 10:56:35
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { defaultsDeep } from 'lodash';

export const PageRecordDetail = async (props) => {

  // console.log("PageRecordDetail=====>", props)

  const { formFactor: defaultFormFactor, appId, objectApiName, recordId, display, sideObject, sideListviewId, $schema, data } = props
  
  if (display)
    Router.setTabDisplayAs(objectApiName, display)

  let displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : sideObject? 'split': Router.getTabDisplayAs(objectApiName);
  const formFactor = (["split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const listPage = await getPage({type: 'list', appId: appId, objectName: objectApiName, formFactor})

  let recordSchema = {}
  if (recordId) {

    const recordPage = await getPage({type: 'record', appId: appId, objectName: objectApiName, formFactor: defaultFormFactor});
    recordSchema = recordPage? JSON.parse(recordPage.schema) : {
      "type": "wrapper",
      "className": "overflow-y-auto p-0 m-0 flex-1 h-full",
      "name": `amis-${appId}-${objectApiName}-detail`,
      "body": [
        {
          "type": "steedos-record-detail",
          "recordId": "${recordId}",
          "objectApiName": "${objectName}",
          className: "sm:m-3",
          appId: appId,
        }
      ],
    }
  }

  const listSchema = listPage? JSON.parse(listPage.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": sideObject,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": true,
    "formFactor": 'SMALL',
  }

  const defData = {
    ...$schema.data,
    objectName: objectApiName,
    listViewId: sideListviewId,
    listName: sideListviewId,
    recordId: data.recordId || recordId,
    appId: appId,
    formFactor: formFactor,
    displayAs: displayAs
  }

  // console.log('defData====>', defData)
  
  return {
    type: 'service',
    data: defData,
    "className":  (displayAs === 'grid') ? 'h-full' : 'p-0 flex flex-1 overflow-hidden h-full',
    body: (displayAs === 'grid') ? defaultsDeep({data: defData} , recordSchema) : [
      {
        "type": "wrapper",
        "className": `p-0 flex-shrink-0 min-w-[388px] border-r border-gray-300 bg-gray-100 shadow lg:order-first lg:flex lg:flex-col`,
        "body": defaultsDeep({data: defData} , listSchema)
      },
      {
        "type": "wrapper",
        "className": 'p-0 flex-1 focus:outline-none lg:order-last h-full',
        "body": defaultsDeep({data: defData} , recordSchema)
      }
    ]
  }
}
