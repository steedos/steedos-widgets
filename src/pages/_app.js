/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-27 16:39:11
 * @Description: 
 */
import { SessionProvider } from "next-auth/react"
import 'focus-visible';
import '@/styles/tailwind.css';
import '@/styles/amis.css';
import '@/styles/notification.css';
import 'antd/dist/antd.css'
import { AppLayout } from '@/components/AppLayout';
import '@/components/functions';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { usePostHog } from 'next-use-posthog'
import { Builder } from '@steedos-builder/react'

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
    if (Builder.isBrowser)
      window.Builder = Builder;
    Builder.registerRemoteAssets('https://unpkg.com/@steedos-widgets/example@0.0.4/dist/assets.json')
  }, []);

  const [formFactor, setFormFactor] = useState(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setFormFactor("SMALL");
    } else {
      setFormFactor("LARGE");
    }
  }, []);
  const Layout = Component.getLayout ? Component.getLayout() : AppLayout;
  return (
    <>
    { formFactor && <SessionProvider session={session}>
      <Layout formFactor={formFactor}>
        <Component {...pageProps} formFactor={formFactor}/>
      </Layout>
    </SessionProvider>}
    </>
  )
}
