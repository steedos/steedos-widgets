/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-29 11:16:01
 * @Description: 
 */
/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

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
    <nav aria-label="Sidebar" className="sticky top-10 divide-y divide-gray-300">
      <div className="space-y-6 lg:space-y-3 border-l border-slate-100 dark:border-slate-800">
        {navigation?.map((item) => (
          <a
            onClick={handleClick}
            key={item.name}
            href={item.path}
            className={classNames(
              item.id === selected ? 'text-sky-500 border-current font-semibold dark:text-sky-400' : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
              'block border-l pl-4 -ml-px text-lg'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  )
}
