/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 18:04:09
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'
import { getPage } from '@/lib/page';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { amisRender, amisRootClick } from '@/lib/amis';
import { AmisRender } from '@/components/AmisRender';

export default function Page ({}) {
  const router = useRouter()
  const { app_id, page_id } = router.query
  const [page, setPage] = useState(null);

  useEffect(() => {
    if(!page_id) return ;
    getPage(page_id, app_id)
      .then((data) => {
        setPage(data)
      })
  }, [app_id, page_id]);

  return (
    <>
      {page && page.schema && <AmisRender id="amis-root" schema={JSON.parse(page.schema)} />}
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