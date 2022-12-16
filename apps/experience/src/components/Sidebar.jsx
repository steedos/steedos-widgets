/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-15 16:39:08
 * @Description: 
 */
/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppLauncherBar } from '@/components/AppLauncherBar'
import { AmisRender } from '@/components/AmisRender'
import { each, groupBy, map } from 'lodash'

function getNavData(nav, selected){
  const data = {nav: []};
  each(groupBy(nav, 'group'), (tabs , groupName)=>{
    if(groupName === 'undefined'){
      each(tabs, (tab)=>{
        data.nav.push({
          "label": {
              type: 'tpl',
              tpl: `<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#${tab.icon || 'account'}"></use></svg>${tab.name}</span>`
            },
          "to": tab.path,
          active: tab.id === selected
        })
      })
    }else{
      data.nav.push({
        "label": groupName,
        "unfolded": true,
        "children": map(tabs, (tab)=>{
          return {
            "label": {
              type: 'tpl',
              tpl: `<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#${tab.icon || 'account'}"></use></svg>${tab.name}</span>`
            },
            "to": tab.path,
            active: tab.id === selected
          }
        })
      })
    }
  });

  return data;
}

export  function Sidebar({ navigation, selectedTabId, app }) {
  const data = getNavData(navigation, selectedTabId);
  const router = useRouter()
  return (
    <nav aria-label="Sidebar" className="">
      <div className="block sm:hidden px-4 py-2 bg-white border-b">
      <AmisRender schema={{
        type: 'service',
        body: [
          {
            "type": "steedos-app-launcher",
            "showAppName": true,
          }
        ]
      }} data={{}} router={router} id="sidebarAppLauncherBar"></AmisRender>
      </div>
      <div className="py-4 font-medium">
      {app && data?.nav && <AmisRender schema={{
        type: 'service',
        body: [
          {
            "type": "steedos-app-menu",
            "stacked": true,
            "appId": app.id,
            links: data.nav
          }
        ]
      }} data={{}} router={router} id="sidebarAppMenu"></AmisRender>}
      </div>
    </nav>
  )
}
