/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-27 18:03:32
 * @Description: 
 */
/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppLauncherBar } from '@/components/AppLauncherBar'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export  function Sidebar({ navigation, selected, app }) {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push(e.currentTarget.href)
  }
  return (
    <nav aria-label="Sidebar" className="divide-y">
      <div className="block lg:hidden px-4 py-4">
        <AppLauncherBar app={app}></AppLauncherBar>
      </div>
      <div className="px-2 py-4">
        {navigation?.map((item) => {
          const icon = item.icon?item.icon:'account'
          const href = (window.innerWidth < 768)? item.path.replace(/^\/app/, '/mapp') : item.path
          return (
          <Link href={href} key={item.name}>
            <a
            onClick={handleClick}
            className={classNames(
              item.id === selected ? 'bg-sky-200/25 fill-sky-500  text-slate-900' : 'fill-slate-500  text-slate-700',
              'block px-2 -ml-px no-underline py-2 hover:bg-slate-100 group flex items-center text-[15px] font-medium rounded-md'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            <svg className="mr-3 flex-shrink-0 h-6 w-6" ariaHidden="true"><use xlinkHref={`/assets/icons/standard-sprite/svg/symbols.svg#${icon}`}></use></svg>
            
            {item.name}
          </a>
          </Link>
        )})}
      </div>
    </nav>
  )
}
