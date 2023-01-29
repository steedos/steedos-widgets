import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AmisRender } from '@/components/AmisRender';


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


  window.signOut = signOut;
  return (
    <>
            
      { app && 
      <AmisRender 
        id="steedos-global-header"
        data={{
          appId: app.id,
          app,
          isMobile: window.innerWidth <= 768
        }} 
        router={router} 
        updateProps={{location: router}}
        schema={{
          type: "service",
          body: [
            {
              "type": "wrapper",
              "className": 'p-0',
              body: [
                {
                  "type": "wrapper",
                  "className": "p-0 slds-global-header_container sticky top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 sm:shadow border-b-[3px] border-sky-500 border-solid",
                  body: [
                    {
                      "type": "wrapper",
                      "className": 'flex w-full px-4 h-[50px] p-0 justify-between items-center',
                      "body": [
                        {
                          type: "wrapper",
                          className: 'p-0 flex flex-1 items-center',
                          body: [
                            {
                              "type": "steedos-logo",
                              "src": "/logo.png",
                              "className": 'block h-7 w-auto mr-4',
                              "hiddenOn": "${isMobile}",
                            },
                            {
                              "type": "button",
                              "className": "toggle-sidebar flex items-center pr-4",
                              "hiddenOn": "${!isMobile}",
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
                                  "name": "rows",
                                  "colorVariant": "default",
                                  "id": "u:afc3a08e8cf3",
                                  "className": "slds-button_icon slds-global-header__icon"
                                }
                              ],
                            },
                            {
                              "type": "steedos-app-launcher",
                              hiddenOn: "${app.showSidebar != true}",
                              "showAppName": true
                            },
                          ],
                        },
                        {
                          "type": "steedos-global-header",
                          "label": "Global Header",
                          className: 'flex flex-nowrap gap-x-3 items-center',
                          logoutScript: "window.signOut();",
                          customButtons: [{
                            "type": "button",
                            "className": "toggle-sidebar",
                            "visibleOn": "${AND(app.showSidebar,!isMobile)}",
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
                                "name": "rows",
                                "colorVariant": "default",
                                "id": "u:afc3a08e8cf3",
                                "className": "slds-button_icon slds-global-header__icon"
                              }
                            ],
                          }]
                        }
                      ],
                    },
    
                    {
                      "type": "grid",
                      hiddenOn: "${app.showSidebar === true}",
                      "className": 'steedos-context-bar hidden sm:flex h-10 leading-5 pl-4 mb-[-3px]',
                      "columns": [
                        {
                          "columnClassName": "items-center hidden sm:flex pb-0",
                          "body": [
                            {
                              "type": "steedos-app-launcher",
                              "showAppName": true,
                              "appId": "${app.id}",
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
                              "appId": "${app.id}",
                              overflow: {
                                  enable: false,
                                  itemWidth: 80,
                              },
                              "id": "u:77851eb4aa89",
                            }
                          ],
                          "id": "u:5367229505d8",
                          "md": "",
                          "valign": "middle",
                        }
                      ],
                    },
                  ],
                },

                {

                  "type": "button",
                  "className": 'p-0 absolute inset-0 mt-[50px]',
                  hiddenOn: "${app.showSidebar != true}",
                  body: [{
                    type: "wrapper",
                    className: 'sidebar-wrapper px-0 pt-4 pb-16 fixed z-20 h-full h-fill ease-in-out duration-300 flex flex-col border-r overflow-y-auto bg-white border-slate-200 block -translate-x-0 sm:w-[220px] w-64',
                    body: [
                      {
                        "type": "steedos-app-menu",
                        "stacked": true,
                        "appId": "${app.id}",
                      },
                    ]
                  }],
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "custom",
                          "script": "console.log(event.target); if(window.innerWidth < 768){ document.body.classList.remove('sidebar-open'); }",
                        }
                      ]
                    }
                  },
                }
              ],
            },
          ]
        }}></AmisRender>}



    </>
  );
}
