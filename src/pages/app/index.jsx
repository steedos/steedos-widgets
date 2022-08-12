/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-12 18:11:21
 * @Description: 
 */
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { AppLauncher } from '@/components/AppLauncher'
import { LauncherLayout } from "@/components/LauncherLayout";

export default function Apps() {
  const router = useRouter()
  return (
    <>
    <AppLauncher router={router}></AppLauncher>
  </>
  )
}
Apps.getLayout = function getLayout(page) {
  return LauncherLayout;
};
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