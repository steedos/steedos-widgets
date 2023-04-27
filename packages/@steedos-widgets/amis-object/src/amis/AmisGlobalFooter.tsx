/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-27 13:25:07
 * @Description: 
 */

import './AmisGlobalFooter.less';

export const AmisGlobalFooter = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, indentSize = 12, selectedId } = props;
    if (!appId) {
        appId = data.context.appId || 'admin';
    }
    const isMobile = window.innerWidth <= 768;
    const className = 'fixed bottom-0 z-20 flex justify-evenly w-full h-16 bg-gray-100 AmisGlobalFooter';
    const className1 = 'fixed bottom-0 z-20 flex justify-center w-full h-16 bg-gray-100 AmisGlobalFooter';

    let schema = {}
    if (links) {
        schema = {
            type: 'service',
            mobile: {
                body: [
                    {
                        "type": "nav",
                        "className": links.length ==1 ? `${className1}` : `${className}`,
                        "stacked": stacked,
                        "overflow": overflow,
                        "indentSize": indentSize,
                        "links": links
                    }
                ]
            }

        }
    } else if(isMobile){
        schema = {
            type: 'service',
            schemaApi: {
                "method": "get",
                "url": `\${context.rootUrl}/service/api/apps/${appId}/menus`,
                "adaptor": `
              try {
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
                    className: payload.children.length ==1 ? '${className1}' : '${className}',
                    "stacked": ${stacked},
                    "overflow": ${JSON.stringify(overflow)},
                    "indentSize": ${indentSize},
                    "links": data.nav,
                  };
              } catch (error) {
                  console.log(\`error\`, error)
              }
              return payload;
        `,
                "headers": {
                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                }
            }
        }
    }

    return schema;
}