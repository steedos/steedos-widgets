/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-15 15:58:15
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 11:41:36
 * @Description: 
 */
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Logo } from '@/components/Logo'
import { MobileNavigation } from '@/components/mobile/MobileNavigation'
import { ThemeSelector } from '@/components/mobile/ThemeSelector'
import { Notification } from '@/components/Notification';

export const GlobalHeader = ({ navigation, selected, app })=>{
    let [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
      function onScroll() {
        setIsScrolled(window.scrollY > 0)
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll, { passive: true })
      }
    }, [])
    return (
        <header
          className={clsx(
            'relative bg-blue-700 sticky top-0 z-50 flex flex-wrap items-center justify-between px-4 py-4 transition duration-500 shadow-none sm:px-6 lg:px-8',
          )}
        >
          <div className="mr-6 flex lg:hidden">
            <MobileNavigation navigation={navigation} />
          </div>
          <div className="relative flex flex-grow basis-0 items-center">
            <Link href="/" aria-label="Home page">
              <>
              <Logo className="h-9 w-auto fill-slate-700 dark:fill-sky-100 lg:block" />
              </>
            </Link>
          </div>
          {/* <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
            <Search />
          </div> */}
          <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
            {/* <ThemeSelector className="relative z-10" /> */}
            <Notification></Notification>
          </div>
        </header>
      )
}