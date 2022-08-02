/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 16:25:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 10:23:56
 * @Description: 
 */
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar'


export default function App() {

  return (
    <>
<div class="slds-page-header">
  <div class="slds-page-header__row">
    <div class="slds-page-header__col-title">
      <div class="slds-media">
        <div class="slds-media__figure">
          <span class="slds-icon_container slds-icon-standard-opportunity" title="opportunity">
            <svg class="slds-icon slds-page-header__icon" aria-hidden="true">
              <use xlinkHref="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
            </svg>
            <span class="slds-assistive-text">opportunity</span>
          </span>
        </div>
        <div class="slds-media__body">
          <div class="slds-page-header__name">
            <div class="slds-page-header__name-title">
              <h1>
                <span class="slds-page-header__title slds-truncate" title="Rohde Corp - 80,000 Widgets">Rohde Corp - 80,000 Widgets</span>
              </h1>
            </div>
          </div>
          <p class="slds-page-header__name-meta">Mark Jaeckal • Unlimited Customer • 11/13/15</p>
        </div>
      </div>
    </div>
  </div>
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