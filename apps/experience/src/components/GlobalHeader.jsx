import { useEffect, useState } from 'react'
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/router";
import { MobileNavigation } from '@/components/mobile/MobileNavigation'
import { AppLauncherBar } from "@/components/AppLauncherBar";
import { Notification } from '@/components/Notification';
import { AmisRender } from '@/components/AmisRender';
import { Sidebar } from '@/components/Sidebar';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const defaultAvatar =
  "/images/defaultAvatar.png";

export function GlobalHeader({ navigation, selectedTabId, app, SideBarToggle }) {
  let [sidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouter();
  const { data: session } = useSession();

  const user = session
    ? {
        name: session.user.name,
        email: session.user.email,
        imageUrl: session.user.image ? session.user.image : defaultAvatar,
      }
    : {
        name: "",
        email: "",
        imageUrl: defaultAvatar,
      };


  const handleClick = (e) => {
    e.preventDefault();
    router.push(e.target.href);
  };

  window.signOut = signOut;

  console.log(`app`, app)

  return (
    <>
      <div
        className="slds-global-header_container sticky top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50"
      >
        <div className="bg-transparent slds-global-header slds-grid slds-grid_align-spread shadow-none">
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

      </div>

      <div className="steedos-context-bar hidden sm:block h-10 leading-5 pl-4 border-b-[3px] border-sky-500">
        { app && <AmisRender schema={{
              type: "service",
              body: [
                {
                  "type": "grid",
                  className: '',
                  "columns": [
                    {
                      "columnClassName": "flex items-center hidden sm:block",
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
                          // selectedId: selectedTabId,
                          overflow: {
                              enable: true,
                              overflowIndicator: "fas fa-angle-double-down"
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
            }} id="appLauncher" router={router} data={{selectedId: selectedTabId}}></AmisRender>}
        </div>

    </>
  );
}
