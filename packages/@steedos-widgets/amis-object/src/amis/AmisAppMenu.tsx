/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-15 16:06:58
 * @Description: 
 */
export const AmisAppMenu = async (props) => {
    let { stacked = false, overflow, appId, data, links = [] } = props;
    if(!appId){
        appId = data.context.appId || 'admin';
    }
    console.log(`AmisAppMenu appId`, appId)
    console.log(`AmisAppMenu`, props)
    return {
        "type": "nav",
        "stacked": stacked,
        "overflow": overflow,
        "links": links,
        "source": {
          "method": "get",
          "url": `\${context.rootUrl}/service/api/apps/${appId}/menus`,
          "adaptor": "try {\n  const data = { nav: [] };\n  \n  console.log(`payload222`, payload)\n  _.each(_.groupBy(payload.children, 'group'), (tabs, groupName) => {\n    if (groupName === 'undefined') {\n      _.each(tabs, (tab) => {\n        data.nav.push({\n          \"label\": {\n            type: 'tpl',\n            tpl: `<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class=\"mr-1 flex-shrink-0 h-6 w-6\"><use xlink:href=\"/assets/icons/standard-sprite/svg/symbols.svg#${tab.icon || 'account'}\"></use></svg>${tab.name}</span>`\n          },\n          \"to\": tab.path,\n          \n        })\n      })\n    } else {\n      data.nav.push({\n        \"label\": groupName,\n        \"unfolded\": true,\n        \"children\": _.map(tabs, (tab) => {\n          return {\n            \"label\": {\n              type: 'tpl',\n              tpl: `<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class=\"mr-1 flex-shrink-0 h-6 w-6\"><use xlink:href=\"/assets/icons/standard-sprite/svg/symbols.svg#${tab.icon || 'account'}\"></use></svg>${tab.name}</span>`\n            },\n            \"to\": tab.path,\n            \n          }\n        })\n      })\n    }\n  });\n  payload.data = data.nav;\n} catch (error) {\n  console.log(`error`, error)\n}\nconsole.log(`payload`, payload)\nreturn payload;",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          "sendOn": `${!!!links}`
        }
      }
    
}