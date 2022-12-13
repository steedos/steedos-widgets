/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-13 13:13:16
 * @Description: 
 */

export const AmisAppMenu = async (props) => {
    const { stacked = false } = props;
    return {
        "type": "nav",
        "stacked": stacked,
        "links": [],
        "id": "u:c5ad2fdd3be0",
        "source": {
          "method": "get",
          "url": "${context.rootUrl}/service/api/apps/projects/menus",
          "adaptor": "try {\n  const data = { nav: [] };\n  const selected = api.data?.selected;\n  console.log(`payload222`, payload)\n  _.each(_.groupBy(payload.children, 'group'), (tabs, groupName) => {\n    if (groupName === 'undefined') {\n      _.each(tabs, (tab) => {\n        data.nav.push({\n          \"label\": {\n            type: 'tpl',\n            tpl: `<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class=\"mr-1 flex-shrink-0 h-6 w-6\"><use xlink:href=\"/assets/icons/standard-sprite/svg/symbols.svg#${tab.icon || 'account'}\"></use></svg>${tab.name}</span>`\n          },\n          \"to\": tab.path,\n          active: tab.id === selected\n        })\n      })\n    } else {\n      data.nav.push({\n        \"label\": groupName,\n        \"unfolded\": true,\n        \"children\": _.map(tabs, (tab) => {\n          return {\n            \"label\": {\n              type: 'tpl',\n              tpl: `<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class=\"mr-1 flex-shrink-0 h-6 w-6\"><use xlink:href=\"/assets/icons/standard-sprite/svg/symbols.svg#${tab.icon || 'account'}\"></use></svg>${tab.name}</span>`\n            },\n            \"to\": tab.path,\n            active: tab.id === selected\n          }\n        })\n      })\n    }\n  });\n  payload.data = data.nav;\n} catch (error) {\n  console.log(`error`, error)\n}\nconsole.log(`payload`, payload)\nreturn payload;",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          }
        }
      }
    
}