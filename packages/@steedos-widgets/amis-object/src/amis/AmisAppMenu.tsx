/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-20 11:49:55
 * @Description: 
 */
export const AmisAppMenu = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, className = '', selectedId } = props;
    if(!appId){
        appId = data.context.appId || 'admin';
    }
    // console.log(`AmisAppMenu appId`, appId)
    // console.log(`AmisAppMenu`, props)
    return {
        "type": "nav",
        className: className,
        "stacked": stacked,
        "overflow": overflow,
        "links": links,
        "source": {
          "method": "get",
          "url": `\${context.rootUrl}/service/api/apps/${appId}/menus`,
          "adaptor": `
                try {
                    const data = { nav: [] };
                    const stacked = ${stacked};
                    const showIcon = ${showIcon};
                    const selectedId = '${selectedId}';
                    _.each(_.groupBy(payload.children, 'group'), (tabs, groupName) => {
                    if (groupName === 'undefined') {
                        _.each(tabs, (tab) => {
                        data.nav.push({
                            "label": showIcon ? {
                            type: 'tpl',
                            tpl: \`<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                            } : tab.name,
                            "to": tab.path,
                            // active: selectedId === tab.id,
                        })
                        })
                    } else {

                        if(stacked){
                            data.nav.push({
                                "label": groupName,
                                "unfolded": true,
                                "children": _.map(tabs, (tab) => {
                                    return {
                                    "label": showIcon ? {
                                        type: 'tpl',
                                        tpl: \`<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                                    }  : tab.name,
                                    "to": tab.path,
                                    // active: selectedId === tab.id,
                                    }
                                })
                                })
                        }else{
                            _.each(tabs, (tab) => {
                                data.nav.push({
                                "label": showIcon ? {
                                    type: 'tpl',
                                    tpl: \`<span class='fill-slate-500  text-slate-700 block -ml-px no-underline group flex items-center text-[15px] font-medium rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                                } : tab.name,
                                "to": tab.path,
                                // active: selectedId === tab.id,
                                });
                            })
                        }

                        
                    }
                    });
                    payload.data = data.nav;
                } catch (error) {
                    console.log(\`error\`, error)
                }
                return payload;
          `,
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          "sendOn": `${!!!links}`
        }
      }
    
}