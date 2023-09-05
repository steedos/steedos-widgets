/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-14 09:47:57
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getPage, Router } from "@steedos-widgets/amis-lib";

export const PageRecordDetail = async (props) => {

  const { formFactor: defaultFormFactor, appId, objectApiName, recordId, display } = props
  
  if(display){
    Router.setTabDisplayAs(objectApiName, display)
  }

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
  
  return {
    type: 'service',
    "className":  'h-full',
    body: recordSchema
  }
}
