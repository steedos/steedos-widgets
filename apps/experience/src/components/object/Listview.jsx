/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-24 17:49:09
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@steedos-widgets/amis-lib';
import { AmisRender } from '@/components/AmisRender'
import { ListviewHeader } from '@/components/object/ListviewHeader'
import { Loading } from '@/components/Loading';

export function Listview ({formFactor, app_id, tab_id, listViewName, bulkActions}) {
  const router = useRouter();
  const [schema, setSchema] = useState();
  const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
  
  const getListviewSchema = (listviewName)=>{
    getListSchema(app_id, tab_id, listviewName || 'all', {formFactor: formFactor, bulkActions}).then((data) => {
      setSchema(data)
    })
  } 

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListviewSchema(listViewName)
  }, [tab_id, formFactor]);

  if (!schema) 
    return <><Loading/></>
  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      <div className='b-b'>
      {formFactor && schema?.uiSchema.name === tab_id && <ListviewHeader tab_id={tab_id} app_id={app_id} listViewName={listViewName} formFactor={formFactor} schema={schema} onListviewChange={(listView)=>{
          getListviewSchema(listView?.name)
        }} searchFieldsFilterProps={{cols: 2}}></ListviewHeader>}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
      {schema?.amisSchema && schema?.uiSchema.name === tab_id && <AmisRender className="steedos-listview" id={listViewId} schema={schema?.amisSchema || {}} router={router}></AmisRender>}
      </div>
    </div>
  )
}