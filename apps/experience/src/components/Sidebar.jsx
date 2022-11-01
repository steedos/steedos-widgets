/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-01 13:43:16
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

function getNavSchema(nav, selected){
  const data = getNavData(nav, selected);
  return {
    "type": "page",
    // "data": data,
    bodyClassName: "p-0",
    "css": {
      ".antd-Nav-itemIcon":{
        height: '20px !important',
        width: '20px',
        'object-fit': 'cover',
        // 'background-color': 'var(--slds-c-icon-color-background,var(--sds-c-icon-color-background,#779ef2))',
        // fill: "var(--slds-c-icon-color-foreground,var(--sds-c-icon-color-foreground,#fff))",
      },
      ".antd-Nav-list":{
        width: "auto"
      },
      ".antd-Nav-item a":{
        // "padding-top": "2px !important",
        // "padding-bottom": "2px !important"
      },
      ".is-active .fill-slate-500":{
        fill: '#ffffff !important'
      },
      ".is-active .text-slate-700":{
        color: '#ffffff !important'
      }
    },
    "body": {
      "type": "nav",
      "stacked": true,
      "className": "w-md",
      "links": data.nav,
      // "source": "${nav}"
    }
  }
}

export  function Sidebar({ navigation, selected, app }) {
  const router = useRouter()
  return (
    <nav aria-label="Sidebar" className="divide-y">
      <div className="block lg:hidden px-4 py-4">
        <AppLauncherBar app={app}></AppLauncherBar>
      </div>
      <div className="px-0 py-4">
      { navigation && <AmisRender schema={getNavSchema(navigation, selected)} data={{}} router={router}></AmisRender>} 
      </div>
    </nav>
  )
}
