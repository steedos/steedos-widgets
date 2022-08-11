import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/solid'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { useSession, signIn, signOut } from "next-auth/react"
import { Logo } from '@/components/Logo'
import { useRouter } from 'next/router'
import { AppLauncherBar } from '@/components/AppLauncherBar'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'

export function GlobalHeader({ navigation, selected, app }) {
  const router = useRouter()
  const { data: session } = useSession()

  const user = session? {
    name: session.user.name,
    email: session.user.email,
    imageUrl: session.user.image ? session.user.image : defaultAvatar ,
  } : {
    name: '',
    email: '',
    imageUrl: defaultAvatar,
  } 

  const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
  ]
  if (session) {
    userNavigation.push({
      name: '注销',
      href: '#',
      onClick: () => signOut()
    })
  } else{
    userNavigation.push({
      name: '登录',
      onClick: () => signIn()
    })

  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(e.target.href)
  }
  
  return (
    <>
    <Disclosure as="header" className="slds-global-header_container sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      {({ open }) => (
        <>
          <div className="slds-global-header slds-grid slds-grid_align-spread">
            <div className="slds-global-header__item">
                <div
                className="slds-global-header__logo"
                style={{ backgroundImage: "url(/logo.png)", display: 'inline-block' }}
                ></div>
                
            </div>
            
            <div className="slds-global-header__item">
                <ul className="slds-global-actions">
                <li className="slds-global-actions__item">
                <div
                  className="slds-dropdown-trigger slds-dropdown-trigger_click"
                  style={{ display: "inline-block" }}
                >
                  <button
                    className="slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__notifications slds-global-actions__item-action"
                    id="header-notifications-popover-id"
                    title="5 new notifications"
                    type="button"
                    aria-live="assertive"
                    aria-haspopup="dialog"
                  >
                    <svg
                      aria-hidden="true"
                      className="slds-button__icon slds-global-header__icon"
                      viewBox="0 0 52 52"
                    >
                      <g>
                        <path d="M46 33h-.5c-1.9 0-3.5-1.6-3.5-3.5V18c0-9.1-7.6-16.4-16.8-16C16.6 2.4 10 9.8 10 18.5v11.1c0 1.9-1.6 3.4-3.5 3.4H6c-2.2 0-4 1.9-4 4.1v1.5c0 .7.7 1.4 1.5 1.4h45c.8 0 1.5-.7 1.5-1.5V37c0-2.2-1.8-4-4-4zM30.9 44h-9.8c-.6 0-1.1.6-1 1.2.5 2.8 3 4.8 5.9 4.8s5.4-2.1 5.9-4.8c.1-.6-.4-1.2-1-1.2z"></path>
                      </g>
                    </svg>
                    <span className="slds-assistive-text">
                      5 new notifications
                    </span>
                  </button>
                  <span
                    aria-hidden="true"
                    className="slds-notification-badge slds-incoming-notification slds-show-notification"
                  >
                    5
                  </span>
                </div>
              </li>
                <li className="relative z-10 flex items-center lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                    </Disclosure.Button>
                </li>
                
                <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="flex-shrink-0 relative ml-0">
                    <div className='slds-global-actions__item'>
                        <Menu.Button className="slds-dropdown-trigger slds-dropdown-trigger_click">
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
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
                        <Menu.Items className="origin-top-right fixed right-6 mt-2 min-w-[160px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">

                        {session && (<div className="py-2 px-4 flex items-center">
                            <div className="flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                            </div>
                            <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                        </div>)}
                        {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                            {({ active }) => (
                                <a
                                href={item.href}
                                onClick={item.onClick}
                                className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block py-2 px-4 text-sm text-gray-700'
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
          
          <div className="bBottom">
            <AppLauncherBar app={app}></AppLauncherBar>
        </div>

          <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="pt-2 pb-3 px-2 space-y-1">
              {navigation?.map((item) => (
                <Disclosure.Button
                  key={item.id}
                  as="a"
                  href={item.path}
                  className={classNames(
                    item.id === selected ? 'bg-gray-100 text-gray-900' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                    'block rounded-md py-2 px-3 text-base font-medium'
                  )}
                  aria-current={item.id === selected ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="px-4 flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
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
  )
}