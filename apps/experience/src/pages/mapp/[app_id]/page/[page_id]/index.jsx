/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-06 09:44:31
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'
import { getPage } from '@steedos-widgets/amis-lib';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { AmisRender } from '@/components/AmisRender';

export default function Page ({}) {
  const router = useRouter()
  const { app_id, page_id } = router.query
  const [page, setPage] = useState(null);

  useEffect(() => {
    if(!page_id) return ;
    getPage({pageId: page_id, appId: app_id})
      .then((data) => {
        setPage(data)
      })
  }, [app_id, page_id]);

  return (
    <>
      {page && page.schema && <AmisRender id="amis-root" className="overflow-auto" schema={JSON.parse(page.schema)} />}
    </>
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