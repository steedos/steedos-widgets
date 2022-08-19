/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-15 15:19:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-19 16:42:30
 * @Description: 
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure, Dialog } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react";

import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/mobile/Navigation'

const defaultAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";


function CloseIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  )
}

export function MobileNavigation({ navigation, app }) {
  let router = useRouter()
  let [isOpen, setIsOpen] = useState(false)

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

  useEffect(() => {
    if (!isOpen) return

    function onRouteChange() {
      setIsOpen(false)
    }

    router.events.on('routeChangeComplete', onRouteChange)
    router.events.on('routeChangeError', onRouteChange)

    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
      router.events.off('routeChangeError', onRouteChange)
    }
  }, [router, isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-6 w-6 stroke-slate-600" />
      </button>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur"
        aria-label="Navigation"
      >
        <Dialog.Panel className="min-h-full w-full max-w-xs bg-slate-50 px-4 pt-5 pb-12 sm:px-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation"
              className="absolute top-0 right-0 p-2 text-white"
            >
              <CloseIcon className="h-6 w-6 stroke-white" />
            </button>
          </div>
          {navigation && <Navigation navigation={navigation} app={app}  className="" />}

          <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center">
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
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={item.onClick}
                      className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
