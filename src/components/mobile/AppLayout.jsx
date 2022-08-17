/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-17 17:26:53
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { GlobalHeader } from '@/components/mobile/GlobalHeader'
import { Sidebar } from '@/components/Sidebar';
import { getApp } from '@/lib/apps';
import { useRouter } from 'next/router'
import { setSteedosAuth } from '@/lib/steedos.client';
import { useSession } from "next-auth/react"

export function AppLayout({ children, formFactor }) {
    const router = useRouter()
    const { app_id, tab_id } = router.query
    const [app, setApp] = useState(null)
    const [selected, setSelected] = useState(tab_id)
    const { data: session } = useSession()
    if(session){
      setSteedosAuth(session.steedos.space, session.steedos.token, session.steedos.userId, session.steedos.name);
    }

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
        <GlobalHeader navigation={app?.children} selected={selected} app={app} formFactor={formFactor} />
        {session && (
          <div id="main" className="flex grow">
            <div id="sidebar" className="flex-none hidden lg:block z-20 inset-0 top-[3rem] right-auto w-[16rem] overflow-y-auto bg-slate-50 border-r border-slate-200">
            
              <Sidebar navigation={app?.children} selected={selected}/>
            </div>
            <div id="content" className="grow">
              {children}
            </div>
          </div>
        )}
        {/* <Footer /> */}
      </div>
    )
  }