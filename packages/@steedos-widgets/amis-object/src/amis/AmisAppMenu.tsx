/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-10-30 15:55:23
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
    let badgeText = `\${keyvalues.badge.value | pick:${appId} | toInt}`;
    if(appId == "approve_workflow"){
        badgeText = "${keyvalues.badge.value | pick:'workflow' | toInt}";
    }

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
                      var objectTabId = "${data.tabId}";
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
                                            tpl: \`<span class='fill-slate-500 whitespace-normal leading-6 block -ml-px no-underline group flex items-center text-[14px] rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
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
                                                tpl: \`<span class='fill-slate-500 whitespace-normal leading-6 block -ml-px no-underline group flex items-center text-[14px] rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
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
                                  tpl: \`<span class='fill-slate-500 whitespace-normal leading-6 block -ml-px no-underline group flex items-center text-[14px] rounded-md'><svg class="mr-1 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
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
                      // let groupLength = ((payload.tab_groups && payload.tab_groups.length) || 0) + 1000;
                      data.nav = _.sortBy(data.nav, function(tab){
                        if(tab.isGroup){
                            return _.findIndex(payload.tab_groups, function(group){
                                return group.group_name === tab.label;
                            });
                        }else{
                            // 没有分组的选项卡按index排列在有分组的选项卡前方
                            return (tab.index || 0) - 1000;
                        }
                      })
                      payload.data = {
                        "type":"service",
                        "data":{
                            "tabId": customTabId || objectTabId,
                            "items": data.nav,
                            "keyvalues": "\${ss:keyvalues}"
                        },
                        "id": "appMenuService",
                        "onEvent": {
                            "@data.changed.steedos_keyvalues": {
                                "actions": [
                                    {
                                        "actionType": "setValue",
                                        "args": {
                                            "value": {
                                                "keyvalues": "\${event.data.keyvalues}"
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        "body":{
                            "type": "nav",
                            className: "${className} text-black",
                            "stacked": ${stacked},
                            "overflow": ${JSON.stringify(overflow)},
                            "indentSize": ${indentSize},
                            "source": "\${items}",
                            //左层显示时审批单显示badge数量
                            "itemBadge": {
                                "mode": "text",
                                "text": "${badgeText}",
                                "visibleOn": "\${id == 'instance_tasks'}",
                                "overflowCount": 99,
                                "style": stacked?{
                                  "right": "20%",
                                  "margin-right": "-23px",
                                  "height": "20px",
                                  "border-radius": "10px",
                                  "font-size": "16px",
                                  "line-height": "18px",
                                  "top": "50%"
                                }:{
                                    "transform": "translate(calc(50% - 17px), calc(-50% + 10px))",
                                    "border-radius": "6.5px",
                                    "height": "15px",
                                    "line-height": "13px",
                                    "padding": "0px 4px",
                                    "font-size": "12px"
                                }
                            },
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
