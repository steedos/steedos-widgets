/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 10:06:11
 * @Description: 
 */
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { AmisRender } from '@/components/AmisRender'
const schema = require('@/amis/app_launcher.amis.json');

export default function Apps() {
  const router = useRouter()
  return (
    <>
    <AmisRender className="" id={`app_launcher`} schema={schema} router={router}></AmisRender>
  </>
  )
}