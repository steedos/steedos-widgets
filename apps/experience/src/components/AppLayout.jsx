/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-19 13:27:46
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { Transition } from '@headlessui/react'

import { GlobalHeader } from '@/components/GlobalHeader';
import { Sidebar } from '@/components/Sidebar';
import { getApp } from '@steedos-widgets/amis-lib';
import { useRouter } from 'next/router'
import { setSteedosAuth, setRootUrl, getRootUrl } from '@steedos-widgets/amis-lib';
import { useSession } from "next-auth/react"

export function AppLayout({ children, app_id, tab_id, page_id}) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const SideBarToggle = ()=> {
      return (
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative mr-4"
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
        <GlobalHeader navigation={app?.children} selected={selected} app={app} SideBarToggle={SideBarToggle}/>
        {session && (
          <div id="main" className="flex flex-1 sm:overflow-hidden">

            <Transition
              show={sidebarOpen}
              as={Fragment}
              enter="transition-opacity duration-75 flex"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150  flex"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div id="sidebar" className="absolute sm:relative z-20 h-full ease-in-out duration-300 flex flex-shrink-0 border-r overflow-y-auto bg-slate-100 sm:bg-slate-100/80 border-slate-300">
                <div className="flex flex-col w-64">
                  <Sidebar navigation={app?.children} selected={selected} app={app}/>
                </div>
              </div>
            </Transition>
            <div id="content" className="flex flex-col min-w-0 flex-1">
              {children}
            </div>
          </div>
        )}
        {/* <Footer /> */}
      </div>
    )
  }