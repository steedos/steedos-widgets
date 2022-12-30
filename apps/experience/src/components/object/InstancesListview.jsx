/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-30 13:56:56
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@steedos-widgets/amis-lib';
import { AmisRender } from '@/components/AmisRender'
import { ListviewHeader } from '@/components/object/ListviewHeader'
import { Loading } from '@/components/Loading';

export function InstancesListview ({formFactor, app_id, tab_id, listview_id, bulkActions}) {
  const router = useRouter();
  const [schema, setSchema] = useState();
  const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
  
  const getListviewSchema = (listview_id)=>{
    getListSchema(app_id, tab_id, listview_id || 'all', {formFactor: formFactor, bulkActions}).then((data) => {
      setSchema(data)
    })
  } 

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListviewSchema(listview_id)
  }, [tab_id, formFactor]);

  if (!schema) 
    return <><Loading/></>
  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      <AmisRender
            data={{
              objectName: tab_id,
              listViewId: listViewId,
              listName: listview_id,
              appId: app_id,
              formFactor: formFactor,
              scopeId: listViewId,
            }}
            className="steedos-listview"
            id={listViewId}
            schema={{
              "type": "steedos-object-listview",
              "objectApiName": tab_id,
              // "listName": "${listName}",
              // "headerToolbar": [],
              "columnsTogglable": false,
              "showHeader": true,
              "className": "sm:m-3"
            }}
            router={router}
          ></AmisRender>
    </div>
  )
}