/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 16:25:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 18:06:08
 * @Description: 
 */
import React, { useState, useEffect } from 'react';
import { SiteLayout } from '@/components/site/SiteLayout'

export default function Site() {

  return (
    <>
        <div>Welcome to site</div>
    </>
  )
}




Site.getLayout = function getLayout(page) {
    return {
      layout: SiteLayout,
      data: {}
    }
  }