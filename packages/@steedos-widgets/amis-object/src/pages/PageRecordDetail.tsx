/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 13:59:28
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { has } from 'lodash';

export const PageRecordDetail = async (props) => {
  // console.log(`PageRecordDetail`, props)
  const { formFactor: defaultFormFactor, appId, objectApiName, recordId, display, data } = props
  const _display = data.display || display
  if(_display){
    Router.setTabDisplayAs(objectApiName, _display)
  }

  let recordSchema = {}
  if (true || recordId) {
    const recordPage = await getPage({type: 'record', appId: appId, objectName: objectApiName, formFactor: defaultFormFactor || data.formFactor});
    recordSchema = recordPage? recordPage.schema : {
      "type": "wrapper",
      "className": "steedos-record-content overflow-y-auto p-0 m-0 flex-1 h-full bg-gray-50",
      "name": `amis-${appId}-${objectApiName}-detail`,
      "body": [
        {
          "type": "steedos-record-detail",
          "recordId": has(props, 'recordId') ? recordId : data.recordId,
          "objectApiName": objectApiName,
          // className: "sm:m-3",
          appId: appId,
        }
      ],
    }
  }
  
  const schema = {
    type: 'service',
    "className":  'h-full',
    body: recordSchema,
    "onEvent": {
      "recordLoaded": {
        "actions": [
          {
            "actionType": "custom",
            "script": "window.Steedos && window.Steedos.setDocumentTitle && Steedos.setDocumentTitle({pageName: event.data.record.name}); $('.steedos-record-tr').removeClass('steedos-record-selected');$('.steedos-record-tr-'+event.data.record._id).addClass('steedos-record-selected');"
          }
        ]
      }
    }
  }
  
  // console.log(`PageRecordDetail===>`, schema, props)
  return schema;
}
