/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-10 14:14:03
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@steedos-widgets/amis-lib';
import { values } from 'lodash'

export default function Page ({ formFactor }) {
  const router = useRouter();
  const { app_id, tab_id } = router.query

  const getListviewSchema = (listviewName)=>{
    getListSchema(app_id, tab_id, listviewName, {formFactor: formFactor}).then((data) => {
      router.push(SteedosUI.Router.getObjectListViewPath({
        formFactor, appId: app_id, objectName: tab_id, listViewName: values(data.uiSchema.list_views)[0].name
      }))
    })
  } 

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListviewSchema(undefined)
  }, [tab_id, formFactor]);

  return (<></>)
}


