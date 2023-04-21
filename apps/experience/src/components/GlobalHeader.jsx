import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AmisRender } from '@/components/AmisRender';


export function GlobalHeader({app}) {

  const logoSrc = '/images/logo_platform.png';

  useEffect(()=>{
    if (app) {
      if (app.showSidebar)
        document.body.classList.add('sidebar')
      else
        document.body.classList.remove("sidebar")
    }
    if (window.innerWidth >= 768) 
      document.body.classList.add('sidebar-open')

  }, [app])

  const router = useRouter();


  window.signOut = signOut;
  return (
    <>
            
      { app && 
      <AmisRender 
        id="steedos-global-header"
        className="fixed z-50 w-full"
        data={{
          appId: app.id,
          app,
          isMobile: window.innerWidth <= 768
        }} 
        router={router} 
        // updateProps={{location: router}}
        schema={{
          type: "service",
          body: [
            {
              "type": "steedos-global-header",
              "logoSrc": logoSrc
            }
          ]
        }}></AmisRender>}



    </>
  );
}
