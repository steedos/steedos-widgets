/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-20 11:43:08
 * @Description: 
 */
/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from 'next/router'
import { AmisRender } from '@/components/AmisRender'

export  function Sidebar({ navigation, selectedTabId, app }) {
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
      {app && <AmisRender schema={{
        type: 'service',
        body: [
          {
            "type": "steedos-app-menu",
            "stacked": true,
            "appId": app.id,
          }
        ]
      }} data={{selectedId: selectedTabId}} router={router} id="sidebarAppMenu"></AmisRender>}
      </div>
    </nav>
  )
}
