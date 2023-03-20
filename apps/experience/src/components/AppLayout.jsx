/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-20 16:55:40
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';

import { GlobalHeader } from '@/components/GlobalHeader';
import { AmisRender } from "@/components/AmisRender";
import { getApp } from '@steedos-widgets/amis-lib';
import { useRouter } from 'next/router'
import { setSteedosAuth, setRootUrl, getRootUrl } from '@steedos-widgets/amis-lib';
import { useSession, signIn } from "next-auth/react"

const showSidebar = false;

export function AppLayout({ children, app_id, tab_id, page_id}) {
    
    const router = useRouter()
    let { app_id: appId, tab_id: tabId, page_id: pageId } = router.query;
    if(app_id){
      appId = app_id
    }
    if(tab_id){
      tabId = tab_id
    }
    if(page_id){
      pageId = page_id
    }
    if(!tabId && pageId){
      tabId = pageId;
    }
    const [app, setApp] = useState(null)
    const { data: session, status } = useSession()
    if(session){
      if(session.publicEnv?.STEEDOS_ROOT_URL){
        setRootUrl(session.publicEnv?.STEEDOS_ROOT_URL);
      }
      setSteedosAuth(session.steedos);
      Builder.set({ 
        env: session.publicEnv,
        rootUrl: getRootUrl(),
        context: {
          rootUrl: getRootUrl(),
          userId: session.steedos.userId,
          tenantId: session.steedos.spaceId,
          authToken: session.steedos.authToken
        } 
      });
    }

    useEffect(() => {
      if (session && session.steedos && session.steedos.space) {
        const userId = session.steedos.userId;
        const people = {
          id: userId,
          name: session.steedos.space.name + '/' + session.steedos.name,
          spaceId: session.steedos.space._id,
          spaceName: session.steedos.space.name,
        }
        window.posthog.identify(userId);
        window.posthog.people.set(people);
      }
    }, [session]);

    useEffect(()=>{
      if (status === "unauthenticated") {
        signIn()
      }
    }, [status])

    // session 变化，获取 app
    useEffect(() => {
      if(!appId || !session) return ;
      if (!app || app?.id != appId) {
        getApp(appId)
          .then((data) => {
            console.log('setApp')
            data.showSidebar = data.showSidebar || showSidebar || (window.innerWidth <= 768);
            if (data.id === 'admin')
              data.showSidebar = true;
            setApp(data)
          })
      }
    }, [session, appId]);

    // app 变化，默认进入第一个tab
    // 要兼容考虑在当前应用中再次进入同一个应用的情况，比如合同应用中再次点九宫格应用列表中的合同应用按钮，所以要监听tabId变化
    useEffect(() => {
      if(!session) return ;
      if(app && app.id != appId) return ;//应用切换了，要等app重新请求后再进入第一个tab
      if(!pageId && !tabId && app?.children[0]){
        router.push(app.children[0].path)
      }
    }, [app, tabId]);


    if (!session) return (
      <AmisRender
        id="loading"
        schema={{
          type: 'steedos-loading'
        }}
      />)
    
    return (
      <div className='h-full flex flex-col'>
        {app && (
          <GlobalHeader app={app}/>
        )}
        {session && (
          <div id="main" className="absolute inset-0 overflow-auto mt-[50px] sm:mt-[90px]">
              {children}
          </div>
        )}
      </div>
    )
  }