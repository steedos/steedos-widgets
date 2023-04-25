/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-11 13:51:50
 * @Description: 
 */

import './AmisGlobalFooter.less';

export const AmisGlobalFooter = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, indentSize = 12, selectedId } = props;
    if (!appId) {
        appId = data.context.appId || 'admin';
    }
    const isMobile = window.innerWidth <= 768;
    const className = 'fixed bottom-0 z-20 flex justify-evenly w-full h-16 bg-gray-100 steedos-global-footer';
    const className1 = 'fixed bottom-0 z-20 flex justify-center w-full h-16 bg-gray-100 steedos-global-footer';

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
                "url": `\${context.rootUrl}/service/api/apps/${appId}/menus?mobile=true`,
                "adaptor": `
              try {
                  if(payload.children.length == 0){
                    payload.data = {};
                    return payload
                  }
                  console.log("22222")
                  const data = { nav: [] };
                  const stacked = ${stacked};
                  const showIcon = ${showIcon};
                  const selectedId = '${selectedId}';
                  _.each(payload.children, (tab)=>{
                    const classIcon = tab.icon.replace(/_/g,"-");
                    data.nav.push({
                    "label": {
                        type: 'tpl',
                        tpl: \`<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[13px] font-medium rounded-md flex-col leading-3 nav-label'><svg class="slds-icon slds-icon_container slds-icon-standard-\`+classIcon+\` flex-shrink-0 h-10 w-10"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`,
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
                    "overflow": {
                        "enable": true,
                        "maxVisibleCount": 4,
                        "overflowPopoverClassName": "steedos-global-footer-popup",
                        "overflowLabel":{
                            "type": 'tpl',
                            "tpl": \`<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[13px] font-medium rounded-md flex-col leading-3 nav-label'><svg class=" flex-shrink-0 h-10 w-10"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead_list"></use></svg>菜单</span>\`,
                            "className":'h-full flex items-center'
                        },
                        "overflowIndicator":""
                    },
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