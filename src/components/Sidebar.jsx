/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 13:16:20
 * @Description: 
 */
/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export  function Sidebar({ navigation, selected }) {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push(e.target.href)
  }
  return (
    <nav aria-label="Sidebar" className="sticky top-6 divide-y divide-gray-300">
      <div className="">
        {navigation?.map((item) => (
          <Link href={item.path} key={item.name}>
            <a
            onClick={handleClick}
            className={classNames(
              item.id === selected ? 'text-sky-500 border-current font-semibold dark:text-sky-400 bg-slate-100' : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
              'block border-l-[3px] pl-4 -ml-px text-base no-underline py-2 hover:bg-slate-100'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </a>
          </Link>
        ))}
      </div>
    </nav>
  )
}
