/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-08 09:20:45
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@steedos-widgets/amis-lib';
import { unstable_getServerSession } from "next-auth/next"
import { AmisRender } from '@/components/AmisRender'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Loading } from '@/components/Loading';
import { InstancesListview } from '@/components/object/InstancesListview';

export default function Page ({formFactor}) {
  const router = useRouter();
  const { app_id,  } = router.query
  const tab_id = 'instances';
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

  if (!schema) 
    return <><Loading/></>

  return (
    <div className='h-full flex instance-scope'>
      <div className="flex-1 w-32 border-r"><InstancesListview bulkActions={false} formFactor={formFactor} app_id={app_id} tab_id={tab_id}></InstancesListview></div>
      <div className="flex-1 w-64" ></div>
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