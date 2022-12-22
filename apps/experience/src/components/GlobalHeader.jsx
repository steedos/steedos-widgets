import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AmisRender } from '@/components/AmisRender';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const defaultAvatar =
  "/images/defaultAvatar.png";

export function GlobalHeader({app}) {

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
  const { data: session } = useSession();


  window.signOut = signOut;

  return (
    <>
      <div
        className="slds-global-header_container sticky top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 sm:shadow  border-b-[3px] border-sky-500"
      >
            
      { app && 
      <AmisRender 
        id="steedos-global-header"
        data={{
          app,
        }} 
        schema={{
          type: "service",
          body: [
            {
              "type": "wrapper",
              "className": 'flex w-full px-4 h-[50px] p-0 justify-between items-center',
              "body": [
                {
                  "type": "steedos-logo",
                  "src": "/logo.png",
                  "className": 'block h-7 w-auto flex flex-1'
                },
                {
                  "type": "steedos-global-header",
                  "label": "Global Header",
                  className: 'flex flex-nowrap gap-x-3 items-center',
                  logoutScript: "window.signOut();",
                  customButtons: [
                    {
                      "type": "button",
                      "className": "toggle-sidebar",
                      "hiddenOn": "${app.showSidebar != true}",
                      "onEvent": {
                        "click": {
                          "actions": [
                            {
                              "actionType": "custom",
                              "script": "document.body.classList.toggle('sidebar-open')",
                            }
                          ]
                        }
                      },
                      "body": [
                        {
                          "type": "steedos-icon",
                          "category": "utility",
                          "name": "toggle_panel_left",
                          "colorVariant": "default",
                          "id": "u:afc3a08e8cf3",
                          "className": "slds-button_icon slds-global-header__icon"
                        }
                      ],
                    },]
                }
              ],
            }
          ]
        }}></AmisRender>}



        { app && 
          <AmisRender 
            data={{
              app,
            }}
            id="steedos-global-navigation" 
            schema={{
              type: "service",
              hiddenOn: "${app.showSidebar === true}",
              body: [
                {
                  "type": "grid",
                  className: 'steedos-context-bar hidden sm:flex h-10 leading-5 pl-4 mb-[-3px]',
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
                        }
                      ],
                      "id": "u:5367229505d8",
                      "md": "",
                      "valign": "middle",
                    }
                  ],
                }
              ]
            }} 
            router={router} 
            updateProps={{location: router}}></AmisRender>}
      </div>

      <div className="absolute inset-0 mt-[50px]" onClick={(event)=>{
        if(window.innerWidth < 768){
          if(event.target.nodeName != 'A' || event.target?.lastChild?.className === 'antd-TplField' || event.target.className === 'antd-TplField'){
            document.body.classList.remove("sidebar-open")
          }
        }
      }}>

      {app && <AmisRender 
        data={{
          app,
        }}
        schema={{
          type: 'service',
          body: [
            {
              type: "wrapper",
              hiddenOn: "${app.showSidebar != true}",
              className: 'sidebar-wrapper p-0 fixed z-20 h-full ease-in-out duration-300 flex flex-col border-r overflow-y-auto bg-white border-slate-200 block -translate-x-0 sm:w-[220px] w-64',
              body: [
                {
                  "type": "steedos-app-launcher",
                  "showAppName": true,
                  "className": "p-4 border-b"
                },
                {
                  "type": "steedos-app-menu",
                  "stacked": true,
                  "appId": app.id,
                },
              ]
            },
          ]
        }} 
        updateProps={{location: router}} 
        router={router}
        id="sidebar-x"
        ></AmisRender>
      }
      </div>
    </>
  );
}
