/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 16:25:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 14:52:39
 * @Description: 
 */
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';

export default function App() {

  return (
    <>
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