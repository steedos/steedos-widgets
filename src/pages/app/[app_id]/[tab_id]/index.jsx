/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-04 15:56:29
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

export default function Page (props) {
  const [selectedListView, setSelectedListView] = useState();
  const router = useRouter();
  const { app_id, tab_id } = router.query
  const [schema, setSchema] = useState();
  const [formFactor, setFormFactor] = useState(null);
  const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});

  useEffect(()=>{
    if(window.innerWidth < 768){
      setFormFactor('SMALL')
    }else{
      setFormFactor('LARGE')
    }
  }, [])

  useEffect(() => {
    setSelectedListView(undefined)
  }, [tab_id]);

  const getListviewSchema = (listviewName)=>{
    getListSchema(app_id, tab_id, listviewName, {formFactor: formFactor}).then((data) => {
      setSchema(data)
    })
  } 

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListviewSchema(undefined)
  }, [tab_id, selectedListView, formFactor]);

  return (
    <div className='slds-card slds-card_boundary slds-grid slds-grid--vertical min-h-full'>
      <div className='slds-page-header--object-home slds-page-header_joined slds-page-header_bleed slds-page-header slds-shrink-none p-0'>
        {schema?.amisSchema && schema?.uiSchema.name === tab_id && <ListviewHeader schema={schema} onListviewChange={(listView)=>{
          getListviewSchema(listView.name)
        }}></ListviewHeader>}
      </div>
      <div className="border-t">
      {schema?.amisSchema && schema?.uiSchema.name === tab_id && <AmisRender className="steedos-listview" id={listViewId} schema={schema?.amisSchema || {}} router={router}></AmisRender>}
          </div>
    </div>
  )
}


export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

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