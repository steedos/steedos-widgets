/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-03 17:04:12
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
    <>
      {schema?.amisSchema && schema?.uiSchema.name === tab_id && <ListviewHeader schema={schema} onListviewChange={(listView)=>{
        getListviewSchema(listView.name)
      }}></ListviewHeader>}
      <div className="mt-2 sm:pb-0 border-b sm:border-b-0">
      {schema?.amisSchema && schema?.uiSchema.name === tab_id && <AmisRender className="steedos-listview" id={listViewId} schema={schema?.amisSchema || {}} router={router}></AmisRender>}
          </div>
    </>
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