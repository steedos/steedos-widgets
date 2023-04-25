import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AmisRender } from '@/components/AmisRender';


export function GlobalFooter({ app }) {

  const router = useRouter();

  return (
    <>

      {app &&
        <AmisRender
          id="steedos-global-footer"
          className="fixed z-50 w-full bottom-0"
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
                "type": "steedos-global-footer",
                "id": "u:77851eb4aa89",
              }
            ]
          }}></AmisRender>}
    </>
  );
}
