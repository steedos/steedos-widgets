/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-18 11:51:07
 * @Description: 
 */
import './AmisAppMenu.less';

export const AmisAppMenu = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, className = '', indentSize=12, selectedId } = props;
    if(!appId){
        appId = data.context.appId || 'admin';
    }
    // console.log(`AmisAppMenu appId`, appId)
    // console.log(`AmisAppMenu`, appId, props)

    if(links){
        return {
            "type": "nav",
            className: `${className} text-black`,
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
            "url": `\${context.rootUrl}/service/api/apps/${appId}/menus`,
            "adaptor": `
                  try {
                    //   console.log('payload====>', payload)
                      if(payload.nav_schema){
                        payload.data = payload.nav_schema;
                        return payload
                      }

                      const data = { nav: [] };
                      const stacked = ${stacked};
                      const showIcon = ${showIcon};
                      const selectedId = '${selectedId}';
                      const tab_groups = payload.tab_groups;
                      const locationPathname = window.location.pathname;
                      var customTabId = "";
                      var objectTabId = "";
                      if(stacked){
                          _.each(_.groupBy(payload.children, 'group'), (tabs, groupName) => {
                              if (groupName === 'undefined' || groupName === '') {
                                  _.each(tabs, (tab) => {
                                      if(locationPathname == tab.path){
                                        customTabId = tab.id;
                                      }else if(locationPathname.startsWith(tab.path + "/")){
                                        objectTabId = tab.id;
                                      }
                                      data.nav.push({
                                          "label": showIcon ? {
                                          type: 'tpl',
                                          tpl: \`<span class='fill-slate-500 word-break leading-6 block -ml-px no-underline group flex items-center text-[15px] rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                                          } : tab.name,
                                          "to": tab.path,
                                          "target":tab.target,
                                          "id": tab.id,
                                          "activeOn": "\\\\\${tabId == '"+ tab.id +"'}",
                                          "index": tab.index
                                          // active: selectedId === tab.id,
                                      })
                                  })
                              } else {
                                  var tabGroup = _.find(tab_groups, {"group_name": groupName});
                                  data.nav.push({
                                      "label": groupName,
                                      "unfolded": tabGroup && tabGroup.default_open != false,
                                      "isGroup": true,
                                      "children": _.sortBy(_.map(tabs, (tab) => {
                                            if(locationPathname == tab.path){
                                            customTabId = tab.id;
                                            }else if(locationPathname.startsWith(tab.path + "/")){
                                            objectTabId = tab.id;
                                            }
                                            return {
                                            "label": showIcon ? {
                                                type: 'tpl',
                                                tpl: \`<span class='fill-slate-500 word-break leading-6 block -ml-px no-underline group flex items-center text-[15px] rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                                            }  : tab.name,
                                            "to": tab.path,
                                            "target":tab.target,
                                            "id": tab.id,
                                            "activeOn": "\\\\\${tabId == '"+ tab.id +"'}",
                                            "index": tab.index
                                            // active: selectedId === tab.id,
                                            }
                                        }),(tab) => {return tab.index})
                                  })   
                              }
                              });
                        
                      }else{
                          _.each(payload.children, (tab)=>{
                              if(locationPathname == tab.path){
                                customTabId = tab.id;
                              }else if(locationPathname.startsWith(tab.path + "/")){
                                objectTabId = tab.id;
                              }
                              data.nav.push({
                              "label": showIcon ? {
                                  type: 'tpl',
                                  tpl: \`<span class='fill-slate-500 word-break leading-6 block -ml-px no-underline group flex items-center text-[15px] rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                              } : tab.name,
                              "to": tab.path,
                              "target":tab.target,
                              "id": tab.id,
                              "activeOn": "\\\\\${tabId == '"+ tab.id +"'}",
                              "index": tab.index
                              // active: selectedId === tab.id,
                              });
                          })
                      }
                      //以下为nav第一层排序，包括分组与选项卡
                      let groupLength = ((payload.tab_groups && payload.tab_groups.length) || 0) + 1000;
                      data.nav = _.sortBy(data.nav, function(tab){
                        if(tab.isGroup){
                            return _.findIndex(payload.tab_groups, function(group){
                                return group.group_name === tab.label;
                            });
                        }else{
                            return groupLength + tab.index;
                        }
                      })
                      payload.data = {
                        "type":"service",
                        "data":{
                            "tabId": customTabId || objectTabId,
                            "items": data.nav
                        },
                        "id": "appMenuService",
                        "body":{
                            "type": "nav",
                            className: "${className} text-black",
                            "stacked": ${stacked},
                            "overflow": ${JSON.stringify(overflow)},
                            "indentSize": ${indentSize},
                            "source": "\${items}",
                            "onEvent": {
                                "click": {
                                    "actions": [
                                        {
                                            "actionType": "setValue",
                                            "componentId": "appMenuService",
                                            "args": {
                                                "value": {
                                                    "tabId": "\${event.data.item.id}",
                                                    "items": data.nav
                                                }
                                            },
                                            "expression":"\${event.data.item.id}"
                                        },
                                        {
                                            "actionType": "custom",
                                            "script" : "window.postMessage(Object.assign({type: 'nav.click', data: event.data.item}), '*');"
                                        }
                                    ]
                                },
                                "@tabId.changed":{
                                    "actions":[
                                        {
                                            "actionType": "setValue",
                                            "componentId": "appMenuService",
                                            "args": {
                                                "value": {
                                                    "tabId": "\${event.data.tabId}",
                                                    "items": data.nav
                                                }
                                            },
                                            "expression":"\${event.data.tabId}"
                                        },
                                        {
                                            "actionType": "custom",
                                            "script" : "window.postMessage(Object.assign({type: 'nav.click', data: event.data.item}), '*');"
                                        }
                                    ]
                                }
                            }
                        }
                      };
                  } catch (error) {
                      console.log(\`error\`, error)
                  }
                //   console.log('payload===2==>', payload)
                  return payload;
            `,
            "headers": {
              "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            }
        }
    }
    // console.log(`schema=====>`, schema)
    return schema;
}
