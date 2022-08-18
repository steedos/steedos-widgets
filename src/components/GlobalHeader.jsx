import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/router";
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
        className="slds-global-header_container supports-backdrop-blur:bg-white/60 sticky top-0 z-40 w-full flex-none bg-white/95 shadow-none backdrop-blur transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10"
      >
        {({ open }) => (
          <>
            <div className="slds-global-header slds-grid slds-grid_align-spread border-b-2 border-sky-500 shadow-none">
              <div className="slds-global-header__item flex">
                <a href="/app" className="pr-6">
                  <img
                    className="block h-8 w-auto"
                    src="/logo.png"
                  />
                </a>
                <AppLauncherBar app={app}></AppLauncherBar>
              </div>
              <div className="slds-global-header__item">
              </div>

              <div className="slds-global-header__item">
                <ul className="slds-global-actions mb-0">
                  <li className="slds-global-actions__item">
                    <div
                      className="slds-dropdown-trigger slds-dropdown-trigger_click"
                      style={{display: "inline-block"}}
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
                  
                  <li className="relative z-10 flex items-center lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </li>

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
               

            <Disclosure.Panel
              as="nav"
              className="lg:hidden"
              aria-label="Global"
            >
              <div className="slds-context-bar h-12 pl-3">
                <AppLauncherBar app={app}></AppLauncherBar>
              </div>
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation?.map((item) => (
                  <Disclosure.Button
                    key={item.id}
                    as="a"
                    href={item.path}
                    className={classNames(
                      item.id === selected
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                      "block rounded-md py-2 px-3 text-base font-medium"
                    )}
                    aria-current={item.id === selected ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
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
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={item.onClick}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
