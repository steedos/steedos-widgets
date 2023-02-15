/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-09 11:59:25
 * @Description: 
 */
import Script from 'next/script'
import { SessionProvider } from "next-auth/react"
import { defaultsDeep, concat, compact, filter, map, isEmpty } from 'lodash';
import 'focus-visible';
import '@/styles/tailwind.css';
import '@/styles/antd.css';
import '@/styles/amis.css';
import '@/styles/mobile.css';
import '@/styles/notification.css';
import '@/styles/workflow.css';
import '@/styles/experience.css';
import { AppLayout } from '@/components/AppLayout';
import '@/components/functions';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { usePostHog } from 'next-use-posthog'
import { Builder } from '@steedos-builder/react'
import { Steedos } from '@steedos-widgets/steedos-lib'
import { registerRenders } from '@/lib/amis';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [globalAssetsLoaded, setGlobalAssetsLoaded] = useState(false);

  useEffect(()=>{

    const globalAssetUrl =  window.STEEDOS_EXPERIENCE_ASSETURLS
    window.addEventListener('message', function (event) {
        const { data } = event;
        console.log(data)
        if (data.type === 'builder.assetsLoaded') {
            setGlobalAssetsLoaded(true)
        }
    })
    
    const globalAssetUrls = globalAssetUrl.split(',');
    Builder.registerRemoteAssets(globalAssetUrls).then(()=>{
        const amisComps = filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
        const globalAssets = map(amisComps, (item)=>{
            return { componentType: item.componentType, componentName: item.componentName, ...item.amis.render}
        });
        registerRenders(globalAssets)
    })
    
  }, [])

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
      if(window.Steedos){
        window.Steedos = Object.assign({}, window.Steedos, Steedos);
      }else{
        window.Steedos = Steedos;
      }
      if (process.env.NODE_ENV !== 'production') {
        // window['BuilderAmisObject'] = require('@steedos-widgets/amis-object/src');
      }
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
    <Script src={`https://unpkg.steedos.cn/amis@${process.env.STEEDOS_EXPERIENCE_AMIS_VERSION}/sdk/sdk.js`} strategy="beforeInteractive"/>
    <Script src="/amis-init.js" strategy="beforeInteractive"/>

    { formFactor && globalAssetsLoaded && <SessionProvider session={session}>
      <Layout formFactor={formFactor} {...data}>
        <Component {...pageProps} formFactor={formFactor}/>
      </Layout>
    </SessionProvider>}
    </>
  )
}