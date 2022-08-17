/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-15 15:19:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 17:40:24
 * @Description: 
 */
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export function Navigation({ navigation, className }) {
  let router = useRouter()
  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-2">
        {navigation.map((section) => (
          <li key={section.path} className="relative">
          <Link
            href={section.path.replace(/^\/app/, '/mapp')}
            className={clsx(
              'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
              section.path === router.pathname
                ? 'font-semibold text-sky-500 before:bg-sky-500'
                : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
            )}
          >
            {section.name}
          </Link>
        </li>
        ))}
      </ul>
    </nav>
  )
}
