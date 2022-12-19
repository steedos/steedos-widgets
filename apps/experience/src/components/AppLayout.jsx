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
import { Sidebar } from '@/components/Sidebar';
import { getApp } from '@steedos-widgets/amis-lib';
import { useRouter } from 'next/router'
import { setSteedosAuth, setRootUrl, getRootUrl } from '@steedos-widgets/amis-lib';
import { useSession, signIn } from "next-auth/react"
import { getNavStacked } from '@/lib/layout';

export function AppLayout({ children, app_id, tab_id, page_id}) {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768)
    const SideBarToggle = ()=> {
      return (
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative"
          aria-label="Open navigation"
        >
          {!sidebarOpen &&(<svg className="h-6 w-6 text-slate-500" fill="none" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3 18h18v-2h-18zm0-5h18v-2h-18zm0-7v2h18v-2z" fill="currentColor"></path></svg>)}
          {sidebarOpen && (<svg className="h-6 w-6 text-slate-500" fill="none" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3 18h13v-2h-13zm0-5h10v-2h-10zm0-7v2h13v-2zm18 9.59-3.58-3.59 3.58-3.59-1.41-1.41-5 5 5 5z" fill="currentColor"></path></svg>)}
        </button>
      )
    }
    
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
            setApp(data)
          })
      }
    }, [session]);

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
    
    const navStacked = getNavStacked();

    return (
      <div className='h-full flex flex-col'>
        <GlobalHeader navigation={app?.children} selectedTabId={tabId} app={app} SideBarToggle={SideBarToggle}/>
        {session && (
          <div id="main" className="flex flex-1 sm:overflow-hidden">
            {!navStacked &&  <div 
                id="sidebar" 
                className={`absolute lg:relative z-20 h-full ease-in-out duration-300 flex flex-shrink-0 border-r overflow-y-auto bg-white border-slate-200
                  ${sidebarOpen?'block -translate-x-0 sm:w-[220px] w-64':' -translate-x-80 w-0'}`}>
              <div className="flex flex-col w-full" onClick={(event)=>{
                if(!(window.innerWidth >= 768)){
                  if(event.target.nodeName != 'A' || event.target?.lastChild?.className === 'antd-TplField' || event.target.className === 'antd-TplField'){
                    setSidebarOpen(false)
                  }
                }
              }}>
                <Sidebar navigation={app?.children} selectedTabId={tabId} app={app}/>
              </div>
            </div>
            }
            <div id="content" className="flex flex-col min-w-0 flex-1 overflow-y-auto bg-slate-50">
              {children}
            </div>
          </div>
        )}
        {/* <Footer /> */}
      </div>
    )
  }