/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 14:40:25
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
      setSteedosAuth(session.steedos.space, session.steedos.token);
    }

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
      <>
        <Navbar navigation={app?.children} selected={selected}/>

        {session && (
        <div className="py-10">
          <div className="sm:px-6 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
              <Sidebar navigation={app?.children} selected={selected}/>
            </div>

            <main className="lg:col-span-9 xl:col-span-10">
              {children}
            </main>
          </div>
        </div>
        )}
        {/* <Footer /> */}
      </>
    )
  }