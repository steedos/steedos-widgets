/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-13 18:31:41
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


  let recordSchema = {}
  if (true || recordId) {

    const recordPage = await getPage({type: 'record', appId: appId, objectName: objectApiName, formFactor: defaultFormFactor});
    recordSchema = recordPage? recordPage.schema : {
      "type": "wrapper",
      "className": "overflow-y-auto p-0 m-0 flex-1 h-full",
      "name": `amis-${appId}-${objectApiName}-detail`,
      "body": [
        {
          "type": "steedos-record-detail",
          // "recordId": "${recordId}",
          "objectApiName": "${objectName}",
          className: "sm:m-3",
          appId: appId,
        }
      ],
    }
  }

  const defData = {
    ...$schema.data,
    objectName: objectApiName,
    listViewId: sideListviewId,
    listName: sideListviewId,
    // recordId: "${recordId}",
    // appId: appId,
    formFactor: formFactor,
    displayAs: displayAs
  }
  // console.log('defData====>', defData)
  
  return {
    type: 'service',
    // data: defData,
    "className":  'h-full',
    body: recordSchema
  }
}
