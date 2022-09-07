/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-07 15:00:55
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { getApp } from '@steedos-widgets/amis-lib';
import { useRouter } from 'next/router'
import { setSteedosAuth, getRootUrl } from '@steedos-widgets/amis-lib';
import { useSession } from "next-auth/react"

export function AppLayout({ children }) {
    const router = useRouter()
    const { app_id, tab_id } = router.query
    const [app, setApp] = useState(null)
    const [selected, setSelected] = useState(tab_id)
    const { data: session } = useSession()
    if(session){
      setSteedosAuth(session.steedos);
      Builder.set({ 
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
      if(!selected && app?.children[0]){
        router.push(app.children[0].path)
        setSelected(app.children[0].id)
      }
    }, [app]);

    useEffect(() => {
        setSelected(tab_id)
    }, [tab_id]);

    useEffect(() => {
        if(!app_id || !session) return ;
        getApp(app_id)
          .then((data) => {
            setApp(data)
          })
      }, [app_id, session]);
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