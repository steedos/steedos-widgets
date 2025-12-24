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

function injectServerCss(cssString) {

  // 1. 创建 style 标签
  const styleTag = document.createElement('style');
  styleTag.id = 'record-page-styles'; // 设置 ID 以便后续更新或删除
  
  // 2. 填入 CSS 内容
  styleTag.innerHTML = cssString;
  
  // 3. 挂载到 head 中
  // 如果之前已经存在，先移除旧的（避免重复堆叠）
  const oldStyle = document.getElementById('record-page-styles');
  if (oldStyle) {
    oldStyle.remove();
  }
  document.head.prepend(styleTag);
}

export const PageRecordDetail = async (props) => {
  // console.log(`PageRecordDetail`, props)
  const { formFactor: defaultFormFactor, appId, objectApiName, recordId, display, data, _reloadKey } = props
  const _display = data.display || display
  if(_display){
    Router.setTabDisplayAs(objectApiName, _display)
  }

  if (data.recordId && !(window as any).$('.steedos-record-tr-'+ data.recordId ).hasClass('steedos-record-selected')) {
    (window as any).$('.page-object-detail-wrapper').removeClass('slide-in-top'); 
    (window as any).$('.page-object-detail-wrapper').addClass('slide-out-bottom');
  }

  let recordSchema = {}
  if (true || recordId) {
    const recordPage = await getPage({type: 'record', appId: appId, objectName: objectApiName, formFactor: defaultFormFactor || data.formFactor});
    if (recordPage && recordPage.css) {
      injectServerCss(recordPage.css);
    }
    if (recordPage && recordPage.schema) {
      recordPage.schema.className += ` page-${recordPage?.name}`;
    }
    recordSchema = recordPage? recordPage.schema : {
      "type": "wrapper",
      "className": `steedos-record-content overflow-y-auto p-0 m-0 flex-1 h-full bg-gray-50`,
      "name": `amis-${appId}-${objectApiName}-detail`,
      "body": [
        {
          "type": "steedos-record-detail",
          "recordId": has(props, 'recordId') ? recordId : data.recordId,
          "objectApiName": objectApiName,
          // className: "sm:m-3",
          appId: appId,
          "_reloadKey": _reloadKey
        }
      ],
    }
  }
  
  const schema = {
    type: 'service',
    "className": `h-full`,
    id: 'u:steedos-page-object-detail',
    body: recordSchema,
    "onEvent": {
      "recordLoaded": {
        "actions": [
          {
            "actionType": "custom",
            "script": "$('.steedos-record-tr').removeClass('steedos-record-selected');$('.steedos-record-tr-'+event.data.recordId).addClass('steedos-record-selected'); $('.page-object-detail-wrapper').removeClass('slide-out-bottom'); $('.page-object-detail-wrapper').addClass('slide-in-top')"
          }
        ]
      }
    }
  }
  // console.log(`PageRecordDetail===>`, schema, props)
  return schema;
}
