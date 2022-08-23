/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 15:31:41
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@/lib/objects';
import { unstable_getServerSession } from "next-auth/next"
import { AmisRender } from '@/components/AmisRender'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { ListviewHeader } from '@/components/object/ListviewHeader'

export default function Page ({formFactor}) {
  const router = useRouter();
  const { app_id, tab_id } = router.query
  const [schema, setSchema] = useState();
  const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
  
  const getListviewSchema = (listviewName)=>{
    getListSchema(app_id, tab_id, listviewName, {formFactor: formFactor}).then((data) => {
      setSchema(data)
    })
  } 

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListviewSchema(undefined)
  }, [tab_id, formFactor]);

  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      <div className='border-b'>
      {formFactor && schema?.uiSchema.name === tab_id && <ListviewHeader formFactor={formFactor} schema={schema} onListviewChange={(listView)=>{
          getListviewSchema(listView?.name)
        }}></ListviewHeader>}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
      {schema?.amisSchema && schema?.uiSchema.name === tab_id && <AmisRender className="steedos-listview" id={listViewId} schema={schema?.amisSchema || {}} router={router}></AmisRender>}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = context.req.session || await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/app',
        permanent: false,
      },
    }
  }
  return {
    props: { },
  }
}