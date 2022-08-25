/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-23 15:15:34
 * @Description: 
 */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Loading } from '@/components/Loading'

import { getApps } from '@/lib/apps'

export default function Apps() {
  const router = useRouter()

  useEffect(()=>{
    getApps().then((apps)=>{
      if(apps && apps.length > 0){
        router.push(apps[0].path)
      }
    })
  }, [])

  return (
    <Loading/>
  )
}