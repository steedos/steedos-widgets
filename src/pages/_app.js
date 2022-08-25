/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-19 16:40:31
 * @Description: 
 */
import { SessionProvider } from "next-auth/react"
import 'focus-visible';
import '@/styles/tailwind.css';
import '@/styles/amis.css';
import 'antd/dist/antd.css'
import { AppLayout } from '@/components/AppLayout';
import '@/components/functions';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { usePostHog } from 'next-use-posthog'

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
