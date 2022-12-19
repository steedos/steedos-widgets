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
import { getNavStacked } from '@/lib/layout';

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

  const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
  ];
  if (session) {
    userNavigation.push({
      name: "注销",
      href: "#",
      onClick: () => signOut(),
    });
  } else {
    userNavigation.push({
      name: "登录",
      onClick: () => signIn(),
    });
  }

  const handleClick = (e) => {
    e.preventDefault();
    router.push(e.target.href);
  };

  window.signOut = signOut;

  console.log(`app`, app)
  const navStacked = getNavStacked();

  return (
    <>
      <Disclosure
        as="header"
        className="slds-global-header_container sticky top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 border-b-2 border-sky-500 lg:shadow"
      >
        {({ open }) => (
          <>
            <div className="bg-transparent slds-global-header slds-grid slds-grid_align-spread shadow-none">
              <div className="slds-global-header__item flex">
                {/* <div className="sm:hidden mr-4 flex items-center">
                  <MobileNavigation navigation={navigation} app={app} />
                </div> */}
                {!navStacked && <SideBarToggle/>
                }
                
                
                {/* <a href="/app" className="flex items-center">
                  <img
                    className="block h-7 w-auto"
                    src="/logo.png"
                  />
                </a>
                <div className="flex items-center ml-6 hidden sm:block">
                  <AppLauncherBar app={app}></AppLauncherBar>
                </div> */}

                { app && <AmisRender schema={{
                  type: "service",
                  body: [
                    {
                      "type": "grid",
                      className: 'pl-4',
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
                          "id": "u:e8a42e96eaf5",
                          "md": "auto",
                          "valign": "middle"
                        },
                        {
                          "columnClassName": "flex items-center hidden sm:block",
                          "body": [
                            {
                              "type": "steedos-app-launcher",
                              "showAppName": true,
                              "appId": app.id,
                            }
                          ],
                          "id": "u:e8a42e96eaf5",
                          "md": "auto",
                          "valign": "middle"
                        }
                      ],
                      "id": "u:6cc99950b29c"
                    }
                  ]
                }} id="appLauncher" router={router}></AmisRender>}

              </div>
              <div className="slds-global-header__item w-9/12">
                { app && <AmisRender schema={{
                  type: "service",
                  body: [
                    {
                      "type": "grid",
                      className: 'pl-4',
                      "columns": [
                        {
                          "columnClassName": "",
                          "body": [
                            {
                              "type": "steedos-app-menu",
                              "stacked": false,
                              showIcon: false,
                              "appId": app.id,
                              selectedId: selectedTabId,
                              overflow: {
                                  enable: true,
                                  overflowLabel: '更多',
                                  overflowIndicator: "fas fa-angle-double-down"
                              },
                              "id": "u:77851eb4aa89",
                              // hiddenOn: `${appId === 'admin'}`
                            }
                          ],
                          "id": "u:5367229505d8",
                          "md": "",
                          "valign": "middle",
                          // hiddenOn: `${appId === 'admin'}`
                        }
                      ],
                      "id": "u:6cc99950b29c"
                    }
                  ]
                }} id="appMenu" router={router}></AmisRender>}
              </div>

              <div className="slds-global-header__item">
                { false && <ul className="slds-global-actions mb-0">
                  <li className="slds-global-actions__item">
                    <div
                      className="slds-dropdown-trigger slds-dropdown-trigger_click hidden sm:block"
                    >
                      <button
                        className="slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__help slds-global-actions__item-action"
                        id="header-help-popover-id"
                        title="Help and Training"
                        type="button"
                        aria-haspopup="true"
                        onClick={()=>{
                            window.open(`https://www.steedos.com/docs`, '_blank');
                        }}
                      >

                        <svg
                            focusable="false"
                            data-key="down"
                            aria-hidden="true"
                            className="slds-button__icon slds-global-header__icon"
                            >
                            <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#help"></use>
                            </svg>
                        <span className="slds-assistive-text">
                          Help and Training
                        </span>
                      </button>
                    </div>
                  </li>
                  <li className="slds-global-actions__item">
                    <div
                      className="slds-dropdown-trigger slds-dropdown-trigger_click hidden sm:block"
                    >
                      <a
                        className="slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__help slds-global-actions__item-action"
                        id="header-help-popover-id"
                        type="button"
                        aria-haspopup="true"
                        href='/app/admin'
                        target='_blank'
                      >

                        <svg
                            focusable="false"
                            data-key="down"
                            aria-hidden="true"
                            className="slds-button__icon slds-global-header__icon"
                            >
                            <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#setup"></use>
                            </svg>
                        <span className="slds-assistive-text">
                          Setup
                        </span>
                      </a>
                    </div>
                  </li>
                  {session && 
                  <li className="slds-global-actions__item">
                  <div
                    className="slds-dropdown-trigger slds-dropdown-trigger_click"
                    style={{ display: "inline-block" }}
                  >
                    <Notification></Notification>
                  </div>
                </li>
                  }
                  

                  <div className="hidden lg:relative lg:z-10 lg:ml-2 lg:flex lg:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-0 flex-shrink-0">
                      <div className="slds-global-actions__item slds-grid slds-grid_vertical-align-center">
                        <Menu.Button className="slds-dropdown-trigger slds-dropdown-trigger_click">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="fixed right-6 mt-2 min-w-[160px] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {session && (
                          <>
                            <div className="flex items-center py-2 px-4">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={user.imageUrl}
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">
                                  {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <a href={'/app/admin/space_users/view/'+ session.steedos.spaceUserId} onClick={handleClick} className="block py-2 px-4 text-sm text-gray-700" id="user_info">个人资料</a>
                          </>
                          )}
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block py-2 px-4 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </ul>}

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
               

          </>
        )}
      </Disclosure>
    </>
  );
}
