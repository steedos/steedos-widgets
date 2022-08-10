/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 15:12:45
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { getApp } from '@/lib/apps';
import { useRouter } from 'next/router'
import { setSteedosAuth } from '@/lib/steedos.client';
import { useSession } from "next-auth/react"
export function AppLayout({ children }) {
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
        if(!app_id || !session) return ;
        getApp(app_id)
          .then((data) => {
            setApp(data)
          })
      }, [app_id, session]);

    useEffect(() => {
        setSelected(tab_id)
    }, [tab_id]);

    return (
      <div className='h-full flex flex-col'>
          <Navbar navigation={app?.children} selected={selected}/>

        {session && (
          <div className="">

            <div className="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] right-auto w-[16rem] overflow-y-auto bg-slate-50 border-r border-slate-200">
              <Sidebar navigation={app?.children} selected={selected}/>
            </div>

            <div className="lg:pl-[16rem] lg:m-6">
              {children}
            </div>
        </div>
        )}
        {/* <Footer /> */}
      </div>
    )
  }