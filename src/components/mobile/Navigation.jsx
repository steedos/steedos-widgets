/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-15 15:19:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-17 17:26:35
 * @Description: 
 */
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AppLauncherBar } from '@/components/AppLauncherBar'

export function Navigation({ navigation, className, formFactor, app }) {
  let router = useRouter();
  return (
    <>
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-2">
        <li>
        <AppLauncherBar formFactor={formFactor} app={app} ></AppLauncherBar>
        </li>
        {navigation.map((section) => (
          <li key={section.path} className="relative">
          <Link
            href={section.path.replace(/^\/app/, '/mapp')}
          >
           <a className={clsx(
              'text-slate-700 block w-full before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
              section.path === router.pathname
                ? 'font-semibold text-sky-500 before:bg-sky-500'
                : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
            )}>
              {/* <svg
                  className="slds-icon slds-icon-text-default slds-icon-small"
                  aria-hidden="true"
                  style={{display: "inline"}}
                >
                  <use
                    xlinkHref={`/assets/icons/standard-sprite/svg/symbols.svg#${section.icon}`}
                  ></use>
                </svg> */}
              {section.name}</a>
          </Link>
        </li>
        ))}
      </ul>
    </nav>
    </>
  )
}
