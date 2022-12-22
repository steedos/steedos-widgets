import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Sidebar } from '@/components/Sidebar';
import { AmisRender } from '@/components/AmisRender';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const defaultAvatar =
  "/images/defaultAvatar.png";

export function GlobalHeader({app}) {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const SideBarToggle = ()=> {
    return (
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="relative pr-4"
        aria-label="Open navigation"
      >
        {!sidebarOpen &&(<svg className="h-6 w-6 text-slate-500" fill="none" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3 18h18v-2h-18zm0-5h18v-2h-18zm0-7v2h18v-2z" fill="currentColor"></path></svg>)}
        {sidebarOpen && (<svg className="h-6 w-6 text-slate-500" fill="none" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3 18h13v-2h-13zm0-5h10v-2h-10zm0-7v2h13v-2zm18 9.59-3.58-3.59 3.58-3.59-1.41-1.41-5 5 5 5z" fill="currentColor"></path></svg>)}
      </button>
    )
  }
  useEffect(()=>{
    if (app)
      setSidebarOpen(app.showSidebar)
  }, [app])

  useEffect(()=>{
    if (sidebarOpen)
      document.querySelector("body").classList.add('sidebar-open')
    else
      document.querySelector("body").classList.remove("sidebar-open")
  }, [sidebarOpen])

  const router = useRouter();
  const { data: session } = useSession();


  window.signOut = signOut;

  return (
    <>
      <div
        className="slds-global-header_container sticky top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 sm:shadow"
      >
        <div className="bg-transparent slds-global-header slds-grid slds-grid_align-spread shadow-none border-b sm:border-none">
          <div className="slds-global-header__item flex">

            {app && app.showSidebar && <SideBarToggle/>
            }
            
            { app && <AmisRender schema={{
              type: "service",
              body: [
                {
                  "type": "grid",
                  className: '',
                  "columns": [
                    {
                      "columnClassName": "",
                      "body": [
                        {
                          "type": "steedos-logo",
                          "src": "/logo.png",
                          "className": 'block h-7 w-auto'
                        }
                      ],
                      "md": "auto",
                      "valign": "middle"
                    },
                  ],
                }
              ]
            }} id="logo" router={router}></AmisRender>}

          </div>

          <div className="slds-global-header__item">

            <AmisRender router={router} schema={{
              type: 'service',
              id: "globalHeader",
              body: [
                {
                  "type": "steedos-global-header",
                  "label": "Global Header",
                  className: 'flex flex-nowrap gap-x-3 items-center',
                  logoutScript: "window.signOut();"
                }
              ]
            }}></AmisRender>

          </div>
               
        </div>

        <div className="steedos-context-bar hidden sm:flex h-10 leading-5 pl-4 border-b-[3px] border-sky-500">

        { app && <AmisRender schema={{
              type: "service",
              body: [
                {
                  "type": "grid",
                  className: '',
                  "columns": [
                    {
                      "columnClassName": "items-center hidden sm:flex pb-0",
                      "body": [
                        {
                          "type": "steedos-app-launcher",
                          "showAppName": true,
                          "appId": app.id,
                        }
                      ],
                      "md": "auto",
                      "valign": "middle"
                    },
                    {
                      "columnClassName": "flex ",
                      "body": [
                        {
                          "type": "steedos-app-menu",
                          "stacked": false,
                          showIcon: false,
                          "appId": app.id,
                          overflow: {
                              enable: false,
                              itemWidth: 80,
                              // overflowIndicator: "fas fa-angle-double-down"
                          },
                          "id": "u:77851eb4aa89",
                          hiddenOn: `${app.showSidebar === true}`
                        }
                      ],
                      "id": "u:5367229505d8",
                      "md": "",
                      "valign": "middle",
                    }
                  ],
                }
              ]
            }} id="appLauncher" router={router} updateProps={{location: router}}></AmisRender>}
        </div>
      </div>

      {app && app.showSidebar &&  <div 
          id="sidebar" 
          className={`absolute lg:fixed z-20 h-full ease-in-out duration-300 flex flex-shrink-0 border-r overflow-y-auto bg-white border-slate-200
            ${sidebarOpen?'block -translate-x-0 sm:w-[220px] w-64':' -translate-x-80 w-0'}`}>
        <div className="flex flex-col w-full" onClick={(event)=>{
          if(!(window.innerWidth >= 768)){
            if(event.target.nodeName != 'A' || event.target?.lastChild?.className === 'antd-TplField' || event.target.className === 'antd-TplField'){
              setSidebarOpen(false)
            }
          }
        }}>
          <Sidebar app={app}/>
        </div>
      </div>
      }

    </>
  );
}
