/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-19 13:27:46
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { getApp } from '@steedos-widgets/amis-lib';
import { useRouter } from 'next/router'
import { setSteedosAuth, setRootUrl, getRootUrl } from '@steedos-widgets/amis-lib';
import { useSession } from "next-auth/react"

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
    const [selected, setSelected] = useState(tabId)
    const { data: session } = useSession()
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
          authToken: session.steedos.token
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

    // 默认进入第一个tab
    useEffect(() => {
      if(!pageId && !tabId && !selected && app?.children[0]){
        router.push(app.children[0].path)
        setSelected(app.children[0].id)
      }
    }, [app]);

    useEffect(() => {
        setSelected(tabId)
    }, [tabId]);

    useEffect(() => {
        if(!appId || !session) return ;
        getApp(appId)
          .then((data) => {
            setApp(data)
          })
      }, [appId, session]);
    return (
      <div className='h-full flex flex-col'>
        <Navbar navigation={app?.children} selected={selected} app={app}/>
        {session && (
          <div id="main" className="flex flex-1 sm:overflow-hidden">
            <div id="sidebar" className="hidden lg:block flex flex-shrink-0 border-r overflow-y-auto bg-slate-50">
              <div className="flex flex-col w-64">
                <Sidebar navigation={app?.children} selected={selected} app={app}/>
              </div>
            </div>
            <div id="content" className="flex flex-col min-w-0 flex-1">
              {children}
            </div>
          </div>
        )}
        {/* <Footer /> */}
      </div>
    )
  }