/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-19 16:04:28
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';

import { Loading } from '@/components/Loading'
import { GlobalHeader } from '@/components/GlobalHeader';
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
    const [selectedTabId, setSelectedTabId] = useState(tabId)
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
            data.showSidebar = showSidebar || (window.innerWidth <= 768);
            if (data.id === 'admin')
              data.showSidebar = true;
            setApp(data)
          })
      }
    }, [session, appId]);

    // app 变化，默认进入第一个tab
    useEffect(() => {
      if(!session) return ;
      if(!pageId && !tabId && !selectedTabId && app?.children[0]){
        router.push(app.children[0].path)
        setSelectedTabId(app.children[0].id)
      } else if (tabId != selectedTabId){
        setSelectedTabId(tabId)
      }
    }, [app]);


    if (!session) return <Loading></Loading>
    
    return (
      <div className='h-full flex flex-col'>
        {app && (
          <GlobalHeader app={app}/>
        )}
        {session && (
          <div id="main" className="flex flex-1 sm:overflow-hidden">
            <div id="content" className="flex flex-col min-w-0 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        )}
      </div>
    )
  }