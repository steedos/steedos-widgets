/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-25 09:35:26
 * @Description: 
 */
import { SessionProvider } from "next-auth/react"
import 'focus-visible';
import '@/styles/tailwind.css';
import 'antd/dist/antd.css'
import '@/styles/antd.css';
import '@/styles/amis.css';
import '@/styles/mobile.css';
import '@/styles/notification.css';
import '@/styles/workflow.css';
import { AppLayout } from '@/components/AppLayout';
import '@/components/functions';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { usePostHog } from 'next-use-posthog'
import { Builder } from '@steedos-builder/react'
import { Steedos } from '@steedos-widgets/steedos-lib'
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  usePostHog('phc_Hs5rJpeE5JK3GdR3NWOf75TvjEcnYShmBxNU2Y942HB', {
    api_host: 'https://posthog.steedos.cn',
    loaded: (posthog) => {
      window.posthog = posthog;
      posthog.opt_in_capturing()
    },
  })  

  useEffect(() => {
    if (Builder.isBrowser){
      window.Builder = Builder;
      window.React = amisRequire('react');
      window.ReactDOM = amisRequire('react-dom');
      window.Steedos = Steedos;
    }
  }, []);

  const [formFactor, setFormFactor] = useState(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setFormFactor("SMALL");
    } else {
      setFormFactor("LARGE");
    }
  }, []);
  let Layout = Component.getLayout ? Component.getLayout() : AppLayout;
  let data = {}
  if(Layout.data){
    data = Layout.data;
    Layout = Layout.layout;
  }
  return (
    <>
    { formFactor && <SessionProvider session={session}>
      <Layout formFactor={formFactor} {...data}>
        <Component {...pageProps} formFactor={formFactor}/>
      </Layout>
    </SessionProvider>}
    </>
  )
}