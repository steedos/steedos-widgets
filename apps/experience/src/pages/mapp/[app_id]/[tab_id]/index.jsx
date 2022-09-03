/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-03 14:12:30
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@steedos-labs/amis-lib';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { values } from 'lodash'

export default function Page (props) {
  const router = useRouter();
  const { app_id, tab_id } = router.query
  const [formFactor, setFormFactor] = useState(null);

  useEffect(()=>{
    if(window.innerWidth < 768){
      setFormFactor('SMALL')
    }else{
      setFormFactor('LARGE')
    }
  }, [])
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