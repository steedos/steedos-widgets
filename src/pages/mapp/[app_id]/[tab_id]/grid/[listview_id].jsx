/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 10:13:39
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
import { ListviewHeader as MobileListviewHeader } from '@/components/mobile/object/ListviewHeader'

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

  const Header = formFactor === 'SMALL' ? MobileListviewHeader : ListviewHeader;
  return (
    <div className='slds-card slds-card_boundary slds-grid slds-grid--vertical shadow-none border-none'>
      <div className=''>
      {formFactor && schema?.uiSchema.name === tab_id && <Header schema={schema} onListviewChange={(listView)=>{
          getListviewSchema(listView?.name)
        }} formFactor={formFactor}></Header>}
      </div>
      <div className="">
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