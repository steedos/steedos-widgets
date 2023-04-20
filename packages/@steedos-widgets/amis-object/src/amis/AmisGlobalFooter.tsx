/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-11 13:51:50
 * @Description: 
 */

import './AmisGlobalFooter.less';

export const AmisGlobalFooter = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, className = '', indentSize=12, selectedId } = props;
    if(!appId){
        appId = data.context.appId || 'admin';
    }
    // console.log(`AmisAppMenu appId`, appId)

    if(links){
        return {
            "type": "nav",
            "className": `${className} AmisGlobalFooter`,
            "stacked": stacked,
            "overflow": overflow,
            "indentSize": indentSize,
            "links": links
        }
    }
    const schema = {
        type: 'service',
        schemaApi: {
            "method": "get",
            "url": `\${context.rootUrl}/service/api/apps/${appId}/menus?try=1111111`,
            "adaptor": `
                  try {
                      console.log('payload====>', payload)
                      if(payload.nav_schema){
                        payload.data = payload.nav_schema;
                        return payload
                      }

                      const data = { nav: [] };
                      const stacked = ${stacked};
                      const showIcon = ${showIcon};
                      const selectedId = '${selectedId}';
                      _.each(payload.children, (tab)=>{
                        data.nav.push({
                        "label": {
                            type: 'tpl',
                            tpl: \`<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[13px] font-medium rounded-md flex-col leading-3 nav-label'><svg class=" flex-shrink-0 h-10 w-10"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`,
                            className:'h-full flex items-center'
                        },
                        "to": tab.path,
                        "target":tab.target
                        // active: selectedId === tab.id,
                        });
                    })
                      payload.data = {
                        "type": "nav",
                        className: "${className} AmisGlobalFooter",
                        "stacked": ${stacked},
                        "overflow": ${JSON.stringify(overflow)},
                        "indentSize": ${indentSize},
                        "links": data.nav,
                      };
                  } catch (error) {
                      console.log(\`error\`, error)
                  }
                  console.log('payload===2==>', payload)
                  return payload;
            `,
            "headers": {
              "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            }
          }
    }
    return schema;
}