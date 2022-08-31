/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-31 13:12:06
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
import { setEnvs } from '@/lib/public.env';
import { setRootUrl } from "@/lib/steedos.client.js";
export default function App({
  Component,
  publicEnv,
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
    }
  }, []);

  if (typeof window !== "undefined") {
    setEnvs(publicEnv);
    setRootUrl(publicEnv.STEEDOS_ROOT_URL);
  }

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

App.getInitialProps = (appContext)=>{
  return {
    publicEnv: {
      STEEDOS_ROOT_URL: process.env.STEEDOS_ROOT_URL,
      STEEDOS_EXPERIENCE_ASSETURLS: process.env.STEEDOS_EXPERIENCE_ASSETURLS
    },
  };
}