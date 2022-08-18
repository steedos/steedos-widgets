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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const defaultAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export function GlobalHeader({ navigation, selected, app }) {
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

  return (
    <>
      <Disclosure
        as="header"
        className="slds-global-header_container supports-backdrop-blur:bg-white/60 sticky top-0 z-40 w-full flex-none bg-white/95 shadow-none backdrop-blur transition-colors duration-500 lg:z-50 border-b lg:border-b-2 lg:border-sky-500"
      >
        {({ open }) => (
          <>
            <div className="slds-global-header slds-grid slds-grid_align-spread   shadow-none">
              <div className="slds-global-header__item flex">
                <div className="sm:hidden mr-4 flex items-center">
                  <MobileNavigation navigation={navigation} app={app} />
                </div>
                
                <a href="/app" className="flex items-center">
                  <img
                    className="block h-7 w-auto"
                    src="/logo.png"
                  />
                </a>
                <div className="flex items-center ml-6 hidden sm:block">
                  <AppLauncherBar app={app}></AppLauncherBar>
                </div>
              </div>
              <div className="slds-global-header__item">
              </div>

              <div className="slds-global-header__item">
                <ul className="slds-global-actions mb-0">
                  <li className="slds-global-actions__item">
                    <div
                      className="slds-dropdown-trigger slds-dropdown-trigger_click hidden sm:block"
                    >
                      <button
                        className="slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__help slds-global-actions__item-action"
                        id="header-help-popover-id"
                        tabindex="0"
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
                  

                  <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-0 flex-shrink-0">
                      <div className="slds-global-actions__item">
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
                </ul>
              </div>
            </div>
               

          </>
        )}
      </Disclosure>
    </>
  );
}
