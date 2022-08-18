/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 15:31:02
 * @Description: 
 */
import { SessionProvider } from "next-auth/react"
import 'focus-visible';
import '@/styles/tailwind.css';
import '@/styles/amis.css';
import 'antd/dist/antd.css'
import { AppLayout } from '@/components/AppLayout';
import { AppLayout as MobileAppLayout } from '@/components/mobile/AppLayout';
import '@/components/functions';
import React, { useState, useEffect, Fragment, useRef } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [formFactor, setFormFactor] = useState(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setFormFactor("SMALL");
    } else {
      setFormFactor("LARGE");
    }
  }, []);
  const Layout = Component.getLayout ? Component.getLayout() : (formFactor === "SMALL" ? MobileAppLayout : AppLayout);
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
