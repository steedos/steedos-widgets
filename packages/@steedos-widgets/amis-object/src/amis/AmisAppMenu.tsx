/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-20 16:10:11
 * @Description: 
 */
import './AmisAppMenu.less';

export const AmisAppMenu = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, className = '', indentSize = 12, selectedId } = props;
    if(!appId){
        appId = data.context.appId;
    }
    // console.log(`AmisAppMenu appId`, appId)
    console.log(`AmisAppMenu`, appId, props)
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
        id: 'u:app-menu',
        schemaApi: {
            "method": "get",
            "url": `\${context.rootUrl}/service/api/apps/\${appId}/menus`,
            "sendOn": "!!appId",
            "adaptor": `
                  try {
                    //  console.log('payload====>', payload)
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
                      var usedGroupNames = [];
                      let allowEditApp = false;
                      if(stacked){
                          if(payload.allowEditApp){
                            allowEditApp = true;
                          }
                          _.each(_.groupBy(payload.children, 'group'), (tabs, groupName) => {
                              if (groupName === 'undefined' || groupName === '') {
                                  _.each(tabs, (tab) => {
                                      tab.iconClass = (tab.icon || 'account').replaceAll('_', '-');
                                      if(locationPathname == tab.path){
                                        customTabId = tab.id;
                                      }else if(locationPathname.startsWith(tab.path + "/")){
                                        objectTabId = tab.id;
                                      }
                                      data.nav.push({
                                          "label": showIcon ? {
                                            type: 'tpl',
                                            tpl: \`<span class='whitespace-normal leading-6 no-underline group items-center rounded-md'><svg class="slds-icon_container slds-icon fill-gray-700 mr-2 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                                          } : tab.name,
                                          "searchKey": tab.name,
                                          "to": tab.path,
                                          "target":tab.target,
                                          "id": tab.id,
                                          "activeOn": "\\\\\${tabId == '"+ tab.id +"'}",
                                          "index": tab.index,
                                          "tabApiName": tab.tabApiName,
                                          "type": tab.type,
                                          // active: selectedId === tab.id,
                                      })
                                  })
                              } else {
                                  var tabGroup = _.find(tab_groups, {"group_name": groupName});
                                  usedGroupNames.push(groupName);
                                  data.nav.push({
                                      "label": groupName,
                                      'default_open': tabGroup && tabGroup.default_open != false,
                                      "unfolded": tabGroup && tabGroup.default_open != false,
                                      "isGroup": true,
                                      "children": _.sortBy(_.map(tabs, (tab) => {
                                            tab.iconClass = (tab.icon || 'account').replaceAll('_', '-');
                                            if(locationPathname == tab.path){
                                                customTabId = tab.id;
                                            }else if(locationPathname.startsWith(tab.path + "/")){
                                                objectTabId = tab.id;
                                            }
                                            return {
                                            "label": showIcon ? {
                                                type: 'tpl',
                                                tpl: \`<span class='whitespace-normal leading-6 block no-underline group items-center rounded-md'><svg class="slds-icon_container slds-icon fill-gray-700 mr-2 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                                            }  : tab.name,
                                            "searchKey": tab.name,
                                            "to": tab.path,
                                            "target":tab.target,
                                            "id": tab.id,
                                            "activeOn": "\\\\\${tabId == '"+ tab.id +"'}",
                                            "index": tab.index,
                                            "tabApiName": tab.tabApiName,
                                            "type": tab.type,
                                            // active: selectedId === tab.id,
                                            "groupName": groupName
                                            }
                                        }),(tab) => {return tab.index})
                                  })   
                              }
                              });
                        
                      }else{
                          _.each(payload.children, (tab)=>{
                                tab.iconClass = (tab.icon || 'account').replaceAll('_', '-');
                              if(locationPathname == tab.path){
                                customTabId = tab.id;
                              }else if(locationPathname.startsWith(tab.path + "/")){
                                objectTabId = tab.id;
                              }
                              data.nav.push({
                              "label": showIcon ? {
                                  type: 'tpl',
                                  tpl: \`<span class='whitespace-normal leading-6 no-underline group items-center rounded-md'><svg class="slds-icon_container slds-icon-standard-\${ tab.iconClass } slds-icon !fill-white rounded-xl mr-2 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg>\${tab.name}</span>\`
                              } : tab.name,
                              "searchKey": tab.name,
                              "to": tab.path,
                              "target":tab.target,
                              "id": tab.id,
                              "activeOn": "\\\\\${tabId == '"+ tab.id +"'}",
                              "index": tab.index,
                              "tabApiName": tab.tabApiName,
                              "type": tab.type,
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
                      if(allowEditApp){
                        _.each(payload.tab_groups, (group)=>{
                            if(!_.includes(usedGroupNames, group.group_name)){
                                data.nav.push({
                                    "label": group.group_name,
                                    'default_open': group && group.default_open != false,
                                    "unfolded": group && group.default_open != false,
                                    "isGroup": true,
                                    "children": []
                                })
                            }
                        });
                      }
                      let editAppSearch = [];
                      if(allowEditApp){
                        editAppSearch = [{
                                "type": "grid",
                                "className": "mx-3 mb-2",
                                "columns": [
                                    {
                                        "md": 10,
                                        "columnClassName": "p-0",
                                        "body": [
                                            {
                                                "type": "search-box",
                                                "name": "keywords",
                                                "className": "!w-full",
                                                "placeholder": "搜索菜单",
                                                "autoFocus": false,
                                                "searchImediately": true,
                                                "clearable": true,
                                                "clearAndSubmit": true,
                                                "id": "s01"
                                            }
                                        ]
                                    },
                                    {
                                        "md": 2,
                                        "columnClassName": "p0 pl-0 steedos-app-menu-plus",
                                        "body": [
                                            {
                                            "type": "dropdown-button",
                                            "level": "link",
                                            "btnClassName": "text-gray-700",
                                            "icon": "fa fa-plus",
                                            "size": "md",
                                            "hideCaret": true,
                                            "align": "right",
                                            "buttons": [
                                                    {
                                                        "type": "button",
                                                        "label": "新建对象",
                                                        "onEvent": {
                                                            "click": {
                                                                "actions": [
                                                                    {
                                                                        "ignoreError": false,
                                                                        "actionType": "dialog",
                                                                        "dialog": {
                                                                            "type": "dialog",
                                                                            "title": "新建对象",
                                                                            "body": [
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "Api Name",
                                                                                    "name": "oName",
                                                                                    "id": "u:dae5884c1633",
                                                                                    "placeholder": "唯一标识",
                                                                                    "value": "o_\${UUID(6)}",
                                                                                    "required": true,
                                                                                    "validateOnChange": true,
                                                                                    "validations": {
                                                                                        "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "显示名称",
                                                                                    "name": "oLabel",
                                                                                    "id": "u:e5bd37f6691b",
                                                                                    "required": true
                                                                                },
                                                                                {
                                                                                    "type": "steedos-field",
                                                                                    "label": "图标",
                                                                                    "config": {
                                                                                        "label": "图标",
                                                                                        "type": "lookup",
                                                                                        "required": true,
                                                                                        "sort_no": 30,
                                                                                        "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                                        "name": "icon",
                                                                                        "inlineHelpText": "",
                                                                                        "description": "",
                                                                                        "hidden": false,
                                                                                        "readonly": false,
                                                                                        "disabled": false
                                                                                    }
                                                                                }
                                                                            ],
                                                                            "id": "u:38b76ff2792d",
                                                                            "actions": [
                                                                                {
                                                                                "type": "button",
                                                                                "actionType": "cancel",
                                                                                "label": "取消",
                                                                                "id": "u:21d3cccf4d83"
                                                                                },
                                                                                {
                                                                                    "type": "button",
                                                                                    "actionType": "confirm",
                                                                                    "label": "确定",
                                                                                    "primary": true,
                                                                                    "id": "u:238e5731a053"
                                                                                }
                                                                            ],
                                                                            "showCloseButton": false,
                                                                            "closeOnOutside": false,
                                                                            "closeOnEsc": false,
                                                                            "showErrorMsg": false,
                                                                            "showLoading": false,
                                                                            "draggable": false,
                                                                            "onEvent": {
                                                                                "confirm": {
                                                                                    "weight": 0,
                                                                                    "actions": [
                                                                                        {
                                                                                        "ignoreError": false,
                                                                                        "actionType": "dialog",
                                                                                        "dialog": {
                                                                                            "type": "dialog",
                                                                                            "title": "",
                                                                                            "body": [
                                                                                                {
                                                                                                    "type": "spinner",
                                                                                                    "id": "u:7b15becd491f",
                                                                                                    "overlay": true
                                                                                                }
                                                                                            ],
                                                                                            "id": "u:38b76ff2798d",
                                                                                            "actions": [],
                                                                                            "showCloseButton": false,
                                                                                            "closeOnOutside": false,
                                                                                            "closeOnEsc": false,
                                                                                            "showErrorMsg": false,
                                                                                            "showLoading": false,
                                                                                            "draggable": false
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "ignoreError": false,
                                                                                            "outputVar": "responseResult",
                                                                                            "actionType": "ajax",
                                                                                            "api": {
                                                                                                "url": "/service/api/objects/create_by_design",
                                                                                                "method": "post",
                                                                                                "adaptor": "window.location.href=Steedos.getRelativeUrl('/api/amisObjectFieldsDesign?oid=' + payload._id +\`&assetUrls=\${Builder.settings.assetUrls}\`+'&retUrl='+window.location.href);return {}",
                                                                                                "requestAdaptor": "api.data={appId: context.app.id, groupId: '', name: context.oName, label: context.oLabel, icon: context.icon}; return api;",
                                                                                                "messages": {}
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "type": "button",
                                                        "label": "新建微页面",
                                                        "onEvent": {
                                                            "click": {
                                                                "actions": [
                                                                    {
                                                                        "ignoreError": false,
                                                                        "actionType": "dialog",
                                                                        "dialog": {
                                                                            "type": "dialog",
                                                                            "title": "新建微页面",
                                                                            "body": [
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "API Name",
                                                                                    "name": "oName",
                                                                                    "id": "u:dae5884c1633",
                                                                                    "placeholder": "唯一标识",
                                                                                    "value": "p_\${UUID(6)}",
                                                                                    "required": true,
                                                                                    "validateOnChange": true,
                                                                                    "validations": {
                                                                                        "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "显示名称",
                                                                                    "name": "oLabel",
                                                                                    "id": "u:e5bd37f6691b",
                                                                                    "required": true
                                                                                },
                                                                                {
                                                                                    "type": "steedos-field",
                                                                                    "label": "图标",
                                                                                    "config": {
                                                                                        "label": "图标",
                                                                                        "type": "lookup",
                                                                                        "required": true,
                                                                                        "sort_no": 30,
                                                                                        "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                                        "name": "icon",
                                                                                        "inlineHelpText": "",
                                                                                        "description": "",
                                                                                        "hidden": false,
                                                                                        "readonly": false,
                                                                                        "disabled": false
                                                                                    }
                                                                                }
                                                                            ],
                                                                            "id": "u:38b76ff2792d",
                                                                            "actions": [
                                                                                {
                                                                                "type": "button",
                                                                                "actionType": "cancel",
                                                                                "label": "取消",
                                                                                "id": "u:21d3cccf4d83"
                                                                                },
                                                                                {
                                                                                    "type": "button",
                                                                                    "actionType": "confirm",
                                                                                    "label": "确定",
                                                                                    "primary": true,
                                                                                    "id": "u:238e5731a053"
                                                                                }
                                                                            ],
                                                                            "showCloseButton": false,
                                                                            "closeOnOutside": false,
                                                                            "closeOnEsc": false,
                                                                            "showErrorMsg": false,
                                                                            "showLoading": false,
                                                                            "draggable": false,
                                                                            "onEvent": {
                                                                                "confirm": {
                                                                                    "weight": 0,
                                                                                    "actions": [
                                                                                        {
                                                                                        "ignoreError": false,
                                                                                        "actionType": "dialog",
                                                                                        "dialog": {
                                                                                            "type": "dialog",
                                                                                            "title": "",
                                                                                            "body": [
                                                                                                {
                                                                                                    "type": "spinner",
                                                                                                    "id": "u:7b15becd491f",
                                                                                                    "overlay": true
                                                                                                }
                                                                                            ],
                                                                                            "id": "u:38b76ff2798d",
                                                                                            "actions": [],
                                                                                            "showCloseButton": false,
                                                                                            "closeOnOutside": false,
                                                                                            "closeOnEsc": false,
                                                                                            "showErrorMsg": false,
                                                                                            "showLoading": false,
                                                                                            "draggable": false
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "ignoreError": false,
                                                                                            "outputVar": "responseResult",
                                                                                            "actionType": "ajax",
                                                                                            "api": {
                                                                                                "url": "/service/api/pages/create_page_by_design",
                                                                                                "method": "post",
                                                                                                "adaptor": "window.location.href=Steedos.getRelativeUrl('/api/pageDesign?pageId=' + payload._id +\`&assetUrls=\${Builder.settings.assetUrls}\`+'&retUrl='+window.location.href);return {}",
                                                                                                "requestAdaptor": "api.data={appId: context.app.id, groupId: '', name: context.oName, label: context.oLabel, icon: context.icon}; return api;",
                                                                                                "messages": {}
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "type": "button",
                                                        "label": "新建外部链接",
                                                        "onEvent": {
                                                            "click": {
                                                                "actions": [
                                                                    {
                                                                        "ignoreError": false,
                                                                        "actionType": "dialog",
                                                                        "dialog": {
                                                                            "type": "dialog",
                                                                            "title": "新建外部链接",
                                                                            "body": [
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "API Name",
                                                                                    "name": "oName",
                                                                                    "id": "u:dae5884c1633",
                                                                                    "placeholder": "唯一标识",
                                                                                    "required": true,
                                                                                    "value": "t_\${UUID(6)}",
                                                                                    "validateOnChange": true,
                                                                                    "validations": {
                                                                                        "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                                                                    }
                                                                                    
                                                                                },
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "显示名称",
                                                                                    "name": "fLabel",
                                                                                    "id": "u:e5bd37f6691b",
                                                                                    "required": true
                                                                                },
                                                                                {
                                                                                    "type": "input-text",
                                                                                    "label": "外部链接",
                                                                                    "name": "fUrl",
                                                                                    "id": "u:e5bd37f6691b",
                                                                                    "required": true
                                                                                },
                                                                                {
                                                                                    "type": "steedos-field",
                                                                                    "label": "图标",
                                                                                    "config": {
                                                                                        "label": "图标",
                                                                                        "type": "lookup",
                                                                                        "required": true,
                                                                                        "sort_no": 30,
                                                                                        "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                                        "name": "icon",
                                                                                        "inlineHelpText": "",
                                                                                        "description": "",
                                                                                        "hidden": false,
                                                                                        "readonly": false,
                                                                                        "disabled": false
                                                                                    }
                                                                                }
                                                                            ],
                                                                            "id": "u:38b76ff2792d",
                                                                            "actions": [
                                                                                {
                                                                                "type": "button",
                                                                                "actionType": "cancel",
                                                                                "label": "取消",
                                                                                "id": "u:21d3cccf4d83"
                                                                                },
                                                                                {
                                                                                    "type": "button",
                                                                                    "actionType": "confirm",
                                                                                    "label": "确定",
                                                                                    "primary": true,
                                                                                    "id": "u:238e5731a053"
                                                                                }
                                                                            ],
                                                                            "showCloseButton": false,
                                                                            "closeOnOutside": false,
                                                                            "closeOnEsc": false,
                                                                            "showErrorMsg": false,
                                                                            "showLoading": false,
                                                                            "draggable": false,
                                                                            "onEvent": {
                                                                                "confirm": {
                                                                                    "weight": 0,
                                                                                    "actions": [
                                                                                        {
                                                                                        "ignoreError": false,
                                                                                        "actionType": "dialog",
                                                                                        "dialog": {
                                                                                            "type": "dialog",
                                                                                            "title": "",
                                                                                            "body": [
                                                                                                {
                                                                                                    "type": "spinner",
                                                                                                    "id": "u:7b15becd491f",
                                                                                                    "overlay": true
                                                                                                }
                                                                                            ],
                                                                                            "id": "u:38b76ff2798d",
                                                                                            "actions": [],
                                                                                            "showCloseButton": false,
                                                                                            "closeOnOutside": false,
                                                                                            "closeOnEsc": false,
                                                                                            "showErrorMsg": false,
                                                                                            "showLoading": false,
                                                                                            "draggable": false
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "ignoreError": false,
                                                                                            "outputVar": "responseResult",
                                                                                            "actionType": "ajax",
                                                                                            "api": {
                                                                                                "url": "/service/api/tabs/create_link_tab_by_design",
                                                                                                "method": "post",
                                                                                            "requestAdaptor": "api.data={appId: context.app.id, groupId: '', name: context.oName, label: context.fLabel, icon: context.icon, url: context.fUrl}; return api;",
                                                                                                "messages": {}
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "componentId": "u:app-menu",
                                                                                            "groupType": "component",
                                                                                            "actionType": "reload"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "type": "divider"
                                                    },
                                                    {
                                                        "type": "button",
                                                        "label": "添加现有选项卡",
                                                        "onEvent": {
                                                            "click": {
                                                            "actions": [
                                                                {
                                                                "ignoreError": false,
                                                                "actionType": "dialog",
                                                                "dialog": {
                                                                    "type": "dialog",
                                                                    "title": "添加现有选项卡",
                                                                    "body": [
                                                                        {
                                                                            "type": "steedos-field",
                                                                            "label": "选项卡",
                                                                            "config": {
                                                                                "type": "lookup",
                                                                                "reference_to": "tabs",
                                                                                "reference_to_field": "name",
                                                                                "required": true,
                                                                                "sort_no": 30,
                                                                                "name": "tabs",
                                                                                "multiple": true,
                                                                                "enable_enhanced_lookup": true,
                                                                                "amis": {
                                                                                    "label": false,
                                                                                    "embed": true,
                                                                                }
                                                                            }
                                                                        }
                                                                    ],
                                                                    "id": "u:709fd4d53437",
                                                                    "actions": [
                                                                        {
                                                                            "type": "button",
                                                                            "actionType": "cancel",
                                                                            "label": "取消",
                                                                            "id": "u:ba7b707cddd8"
                                                                        },
                                                                        {
                                                                            "type": "button",
                                                                            "actionType": "confirm",
                                                                            "label": "确定",
                                                                            "primary": true,
                                                                            "id": "u:2f3e5635b95d"
                                                                        }
                                                                    ],
                                                                    "showCloseButton": true,
                                                                    "closeOnOutside": false,
                                                                    "closeOnEsc": false,
                                                                    "showErrorMsg": true,
                                                                    "showLoading": true,
                                                                    "draggable": false,
                                                                    "size": "md",
                                                                    "onEvent": {
                                                                        "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "options": {},
                                                                                "api": {
                                                                                    "url": "/service/api/apps/update_app_tabs_by_design",
                                                                                    "method": "post",
                                                                                    "requestAdaptor": "api.data={appId: context.app.id, groupId: '', addTabNames: context.tabs}; return api;",
                                                                                    "adaptor": "",
                                                                                    "messages": {}
                                                                                }
                                                                            },
                                                                            {
                                                                                "componentId": "u:app-menu",
                                                                                "groupType": "component",
                                                                                "actionType": "reload"
                                                                            }
                                                                        ]
                                                                        }
                                                                    }
                                                                }
                                                                }
                                                            ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "type": "divider"
                                                    },
                                                    {
                                                        "type": "button",
                                                        "label": "新建分组",
                                                        "onEvent": {
                                                            "click": {
                                                            "actions": [
                                                                {
                                                                    "ignoreError": false,
                                                                    "actionType": "dialog",
                                                                    "dialog": {
                                                                        "type": "dialog",
                                                                        "title": "新建分组",
                                                                        "body": [
                                                                            {
                                                                                "type": "input-text",
                                                                                "label": "名称",
                                                                                "name": "name",
                                                                                "id": "u:e5bd37f6699b",
                                                                                "placeholder": "分组名称",
                                                                                "required": true
                                                                            },
                                                                            {
                                                                                "type": "checkbox",
                                                                                "option": "是否默认展开",
                                                                                "name": "defaultOpen",
                                                                                "id": "u:dae5884c1623",
                                                                                "required": true
                                                                            }
                                                                        ],
                                                                        "id": "u:304b5b04c573",
                                                                        "actions": [
                                                                        {
                                                                            "type": "button",
                                                                            "actionType": "cancel",
                                                                            "label": "取消",
                                                                            "id": "u:21d3cccf4d85"
                                                                        },
                                                                        {
                                                                            "type": "button",
                                                                            "actionType": "confirm",
                                                                            "label": "确定",
                                                                            "primary": true,
                                                                            "id": "u:238e5731a05b"
                                                                        }
                                                                        ],
                                                                        "showCloseButton": true,
                                                                        "closeOnOutside": false,
                                                                        "closeOnEsc": false,
                                                                        "showErrorMsg": true,
                                                                        "showLoading": true,
                                                                        "draggable": false,
                                                                        "onEvent": {
                                                                            "confirm": {
                                                                                "weight": 0,
                                                                                "actions": [
                                                                                    {
                                                                                        "ignoreError": false,
                                                                                        "outputVar": "responseResult",
                                                                                        "actionType": "ajax",
                                                                                        "api": {
                                                                                            "url": "/service/api/apps/create_app_group_by_design",
                                                                                            "method": "post",
                                                                                            "adaptor": "",
                                                                                            "requestAdaptor": "api.data={appId: context.app.id, name: context.name, defaultOpen: context.defaultOpen}; return api;",
                                                                                            "messages": {}
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "componentId": "u:app-menu",
                                                                                        "groupType": "component",
                                                                                        "actionType": "reload"
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                            }
                                                        },
                                                    }
                                                ]
                                        }
                                        ]
                                    }
                                ]
                            }]
                      }

                      let menuItems = data.nav;

                      if(context.keywords){
                        // 如果menuItem的children, children是数组结构, 每一项的searchKey包含context.keywords, 则显示menuItem及其符合条件的children;
                        menuItems = _.filter(menuItems, (menuItem)=>{
                            if(menuItem.children){
                                const children = _.filter(menuItem.children, (child)=>{
                                    return _.includes(child.searchKey, context.keywords);
                                });

                                if(children.length > 0){
                                    menuItem.children = children;
                                }

                                return children.length > 0;
                            }
                        })
                      };

                      if(!menuItems || menuItems.length == 0){
                        menuItems = data.nav;
                      }

                      payload.data = {
                        "type":"service",
                        "data":{
                            "tabId": customTabId || objectTabId,
                            "items": menuItems,
                            "keyvalues": "\${ss:keyvalues}",
                            "allowEditApp": allowEditApp,
                            "tab_groups": tab_groups
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
                        "body": [
                            ...editAppSearch,
                            {
                            "type": "nav",
                            "expandPosition": "after",
                            "searchable": !allowEditApp && ${stacked},
                            "searchConfig": {
                              "placeholder": "搜索菜单",
                              "matchFunc": "return link.searchKey && link.searchKey.indexOf(keyword)>=0;"
                            },
                            className: "${className} text-black steedos-app-menu ${stacked?'stacked':''}",
                            "stacked": ${stacked},
                            "overflow": ${JSON.stringify(overflow)},
                            "indentSize": ${indentSize},
                            "draggable": allowEditApp,
                            "dragOnSameLevel": true,
                            "saveOrderApi": {
                                "url": "/service/api/apps/update_app_by_design",
                                "method": "post",
                                "adaptor": "",
                                "requestAdaptor": "const menus = context.data;const tab_groups = [];const tab_items = {};_.each(menus, (menu) => {  if (menu.isGroup) {    tab_groups.push({      group_name: menu.label,      default_open: menu.default_open,    });  }else{tab_items[menu.tabApiName] = {group:''}};  if (menu.children) {    _.each(menu.children, (menu2) => {      tab_items[menu2.tabApiName] = {        group: menu.label      }    })  }}); api.data={appId: context.app.id, tab_groups, tab_items}; return api;",
                                "messages": {}
                            },
                            "itemActions": [
                                {
                                    "type": "dropdown-button",
                                    "level": "link",
                                    "icon": "fa fa-ellipsis-h",
                                    "btnClassName": "!text-gray-700",
                                    "hideCaret": true,
                                    "className": "hidden hover-inline-flex",
                                    "visibleOn": "!!allowEditApp",
                                    "buttons": [
                                        {
                                            "type": "button",
                                            "label": "编辑",
                                            "visibleOn": "!!this.isGroup",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "actionType": "dialog",
                                                            "dialog": {
                                                                "type": "dialog",
                                                                "title": "编辑分组",
                                                                "data": {
                                                                    "appId": "\\\${app.id}",
                                                                    "name": "\\\${event.data.label}",
                                                                    "oldName": "\\\${event.data.label}",
                                                                    "defaultOpen": "\\\${event.data.default_open}"
                                                                },
                                                                "body": [
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "名称",
                                                                        "name": "name",
                                                                        "id": "u:e5bd37f6699b",
                                                                        "placeholder": "分组名称",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "checkbox",
                                                                        "option": "是否默认展开",
                                                                        "name": "defaultOpen",
                                                                        "id": "u:dae5884c1623",
                                                                        "required": true
                                                                    }
                                                                ],
                                                                "id": "u:304b5b04c573",
                                                                "actions": [
                                                                {
                                                                    "type": "button",
                                                                    "actionType": "cancel",
                                                                    "label": "取消",
                                                                    "id": "u:21d3cccf4d85"
                                                                },
                                                                {
                                                                    "type": "button",
                                                                    "actionType": "confirm",
                                                                    "label": "确定",
                                                                    "primary": true,
                                                                    "id": "u:238e5731a05b"
                                                                }
                                                                ],
                                                                "showCloseButton": true,
                                                                "closeOnOutside": false,
                                                                "closeOnEsc": false,
                                                                "showErrorMsg": true,
                                                                "showLoading": true,
                                                                "draggable": false,
                                                                "onEvent": {
                                                                    "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "api": {
                                                                                    "url": "/service/api/apps/update_app_group_by_design",
                                                                                    "method": "post",
                                                                                    "adaptor": "",
                                                                                    "requestAdaptor": "api.data={appId: context.appId, name: context.name, defaultOpen: context.defaultOpen, oldName: context.oldName}; return api;",
                                                                                    "messages": {}
                                                                                }
                                                                            },
                                                                            {
                                                                                "componentId": "u:app-menu",
                                                                                "groupType": "component",
                                                                                "actionType": "reload"
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "编辑",
                                            "visibleOn": "this.type==='object'",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "actionType": "custom",
                                                            "script": "window.location.href=Steedos.getRelativeUrl('/api/amisObjectFieldsDesign?oid=' + event.data.id +\`&assetUrls=\${Builder.settings.assetUrls}\`+'&retUrl='+window.location.href)",
                                                            "expression": "\${false}"
                                                        },
                                                        {
                                                            "ignoreError": false,
                                                            "outputVar": "responseResult",
                                                            "actionType": "ajax",
                                                            "api": {
                                                                "url": "/graphql",
                                                                "method": "post",
                                                                "adaptor": "const objects = payload.data.objects; if(objects && objects.length > 0){ try{const objectId = objects[0]._id; FlowRouter.go('/app/admin/objects/view/'+objectId+'?side_object=objects&side_listview_id=all')}catch(e){payload.error=e.message;} }; return payload;",
                                                                "requestAdaptor": "api.data={query: '{  objects(filters: [\\\"name\\\", \\\"=\\\", ' + context.id + ']) {    _id    name}}'}; return api;",
                                                                "messages": {}
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "编辑",
                                            "visibleOn": "this.type==='page'",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "outputVar": "responseResult",
                                                            "actionType": "ajax",
                                                            "api": {
                                                                "url": "/graphql",
                                                                "method": "post",
                                                                "adaptor": "const tabs = payload.data.tabs; if(tabs && tabs.length > 0){ try{const pageId = tabs[0].page__expand._id; window.location.href=Steedos.getRelativeUrl('/api/pageDesign?pageId=' + pageId +\`&assetUrls=\${Builder.settings.assetUrls}\`+'&retUrl='+window.location.href)}catch(e){payload.error=e.message;} }; return payload;",
                                                                "requestAdaptor": "api.data={query: '{  tabs(filters: [\\\"name\\\", \\\"=\\\", ' + context.id + ']) {    _id    name    page    page__expand {      _id    }  }}'}; return api;",
                                                                "messages": {}
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "编辑",
                                            "visibleOn": "this.type==='url'",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "outputVar": "responseResult",
                                                            "actionType": "ajax",
                                                            "api": {
                                                                "url": "/graphql",
                                                                "method": "post",
                                                                "adaptor": "if(payload.data.tabs && payload.data.tabs.length > 0){payload.data=payload.data.tabs[0]}; return payload",
                                                                "requestAdaptor": "api.data={query: '{  tabs(filters: [\\\"name\\\", \\\"=\\\", ' + context.id + ']) {    _id    oName:name    fLabel:label    fUrl:url    icon  }}'}; return api;",
                                                                "messages": {}
                                                            }
                                                        },
                                                        {
                                                            "ignoreError": false,
                                                            "actionType": "dialog",
                                                            "dialog": {
                                                                "type": "dialog",
                                                                "title": "编辑外部链接",
                                                                "data": {
                                                                    "appId": "\\\${app.id}",
                                                                    "&": "\\\${event.data.responseResult}"
                                                                },
                                                                "body": [
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "API Name",
                                                                        "name": "oName",
                                                                        "id": "u:dae5884c1633",
                                                                        "placeholder": "唯一标识",
                                                                        "required": true,
                                                                        "disabled": true
                                                                    },
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "显示名称",
                                                                        "name": "fLabel",
                                                                        "id": "u:e5bd37f6691b",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "外部链接",
                                                                        "name": "fUrl",
                                                                        "id": "u:e5bd37f6691b",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "steedos-field",
                                                                        "label": "图标",
                                                                        "config": {
                                                                            "label": "图标",
                                                                            "type": "lookup",
                                                                            "required": true,
                                                                            "sort_no": 30,
                                                                            "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                            "name": "icon",
                                                                            "inlineHelpText": "",
                                                                            "description": "",
                                                                            "hidden": false,
                                                                            "readonly": false,
                                                                            "disabled": false
                                                                        }
                                                                    }
                                                                ],
                                                                "id": "u:38b76ff2792d",
                                                                "actions": [
                                                                    {
                                                                    "type": "button",
                                                                    "actionType": "cancel",
                                                                    "label": "取消",
                                                                    "id": "u:21d3cccf4d83"
                                                                    },
                                                                    {
                                                                        "type": "button",
                                                                        "actionType": "confirm",
                                                                        "label": "确定",
                                                                        "primary": true,
                                                                        "id": "u:238e5731a053"
                                                                    }
                                                                ],
                                                                "showCloseButton": false,
                                                                "closeOnOutside": false,
                                                                "closeOnEsc": false,
                                                                "showErrorMsg": false,
                                                                "showLoading": false,
                                                                "draggable": false,
                                                                "onEvent": {
                                                                    "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                            "ignoreError": false,
                                                                            "actionType": "dialog",
                                                                            "dialog": {
                                                                                "type": "dialog",
                                                                                "title": "",
                                                                                "body": [
                                                                                    {
                                                                                        "type": "spinner",
                                                                                        "id": "u:7b15becd491f",
                                                                                        "overlay": true
                                                                                    }
                                                                                ],
                                                                                "id": "u:38b76ff2798d",
                                                                                "actions": [],
                                                                                "showCloseButton": false,
                                                                                "closeOnOutside": false,
                                                                                "closeOnEsc": false,
                                                                                "showErrorMsg": false,
                                                                                "showLoading": false,
                                                                                "draggable": false
                                                                                }
                                                                            },
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "api": {
                                                                                    "url": "/service/api/tabs/update_link_tab_by_design",
                                                                                    "method": "post",
                                                                                "requestAdaptor": "api.data={appId: context.appId, groupId: context.label, name: context.oName, label: context.fLabel, icon: context.icon, url: context.fUrl}; return api;",
                                                                                    "messages": {}
                                                                                }
                                                                            },
                                                                            {
                                                                                "componentId": "u:app-menu",
                                                                                "groupType": "component",
                                                                                "actionType": "reload"
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "移动",
                                            "visibleOn": "!!!this.isGroup",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "actionType": "custom",
                                                            "script": "event.setData({appId: event.data.app.id, groups: [{label: event.data.app.name, value: 0, children: _.map(event.data.tab_groups, (tGroup)=>{return {label: tGroup.group_name, value: tGroup.group_name}})}] , tabApiName: event.data.tabApiName, groupName: event.data.groupName})"
                                                        },
                                                        {
                                                            "ignoreError": false,
                                                            "actionType": "dialog",
                                                            "dialog": {
                                                                "type": "dialog",
                                                                "title": "移动",
                                                                "data": {
                                                                    "appId": "\\\${event.data.appId}",
                                                                    "groups": "\\\${event.data.groups}",
                                                                    "tabApiName": "\\\${event.data.tabApiName}",
                                                                    "groupName": "\\\${event.data.groupName}",
                                                                    "oldGroupName": "\\\${event.data.groupName}",
                                                                },
                                                                "body": [
                                                                    {
                                                                    "type": "tree-select",
                                                                    "label": "",
                                                                    "name": "groupName",
                                                                    "id": "u:26d0b458ff51",
                                                                    "multiple": false,
                                                                    "source": "\\\${groups}"
                                                                    }
                                                                ],
                                                                "id": "u:d69cbb95089a",
                                                                "actions": [
                                                                    {
                                                                        "type": "button",
                                                                        "actionType": "cancel",
                                                                        "label": "取消",
                                                                        "id": "u:12261bf51dcb"
                                                                    },
                                                                    {
                                                                        "type": "button",
                                                                        "actionType": "confirm",
                                                                        "label": "确定",
                                                                        "primary": true,
                                                                        "id": "u:b144775ea124"
                                                                    }
                                                                ],
                                                                "showCloseButton": true,
                                                                "closeOnOutside": false,
                                                                "closeOnEsc": false,
                                                                "showErrorMsg": true,
                                                                "showLoading": true,
                                                                "draggable": false,
                                                                "onEvent": {
                                                                    "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "options": {},
                                                                                "api": {
                                                                                    "url": "/service/api/apps/move_app_tab",
                                                                                    "method": "post",
                                                                                    "requestAdaptor": "api.data={appId: context.appId, groupName: context.groupName, oldGroupName: context.oldGroupName, tabName: context.tabApiName}; return api;",
                                                                                    "adaptor": "",
                                                                                    "messages": {}
                                                                                }
                                                                            },
                                                                            {
                                                                                "componentId": "u:app-menu",
                                                                                "groupType": "component",
                                                                                "actionType": "reload"
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "删除",
                                            "visibleOn": "!!!this.isGroup",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "outputVar": "responseResult",
                                                            "actionType": "ajax",
                                                            "options": {},
                                                            "api": {
                                                                "url": "/service/api/apps/delete_app_tab",
                                                                "method": "post",
                                                                "requestAdaptor": "api.data={appId: context.app.id, tabName: context.tabApiName};return api;",
                                                                "adaptor": "",
                                                                "messages": {}
                                                            }
                                                        },
                                                        {
                                                            "componentId": "u:app-menu",
                                                            "groupType": "component",
                                                            "actionType": "reload"
                                                        }
                                                    ]
                                                }
                                            },
                                            "id": "u:e54eed92d13f",
                                            "confirmText": "确定要删除吗?"
                                        },
                                        {
                                            "type": "button",
                                            "label": "删除",
                                            "visibleOn": "!!this.isGroup",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "actionType": "custom",
                                                            "script": "if(event.data.children && event.data.children.length > 0){doAction({'actionType': 'toast','args': {  'msgType': 'warning',  'msg': '分组下有数据,禁止删除'}});event.stopPropagation();};"
                                                        },
                                                        {
                                                            "ignoreError": false,
                                                            "outputVar": "responseResult",
                                                            "actionType": "ajax",
                                                            "options": {},
                                                            "api": {
                                                                "url": "/service/api/apps/delete_app_group",
                                                                "method": "post",
                                                                "requestAdaptor": "api.data={appId: context.app.id, groupName: context.label};return api;",
                                                                "adaptor": "",
                                                                "messages": {}
                                                            }
                                                        },
                                                        {
                                                            "componentId": "u:app-menu",
                                                            "groupType": "component",
                                                            "actionType": "reload"
                                                        }
                                                    ]
                                                }
                                            },
                                            "id": "u:e54eed92d13f",
                                            "confirmText": "确定要删除吗?"
                                        }
                                    ]
                                },
                                {
                                    "type": "dropdown-button",
                                    "level": "link",
                                    "icon": "fa fa-plus",
                                    "hideCaret": true,
                                    "btnClassName": "!text-gray-700",
                                    "visibleOn": "!!allowEditApp && !!this.isGroup",
                                    "className": "hidden hover-inline-flex",
                                    "buttons": [
                                        {
                                            "type": "button",
                                            "label": "新建对象",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "actionType": "dialog",
                                                            "dialog": {
                                                                "type": "dialog",
                                                                "title": "新建对象",
                                                                "body": [
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "Api Name",
                                                                        "name": "oName",
                                                                        "id": "u:dae5884c1633",
                                                                        "placeholder": "唯一标识",
                                                                        "value": "o_\${UUID(6)}",
                                                                        "required": true,
                                                                        "validateOnChange": true,
                                                                        "validations": {
                                                                            "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "显示名称",
                                                                        "name": "oLabel",
                                                                        "id": "u:e5bd37f6691b",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "steedos-field",
                                                                        "label": "图标",
                                                                        "config": {
                                                                            "label": "图标",
                                                                            "type": "lookup",
                                                                            "required": true,
                                                                            "sort_no": 30,
                                                                            "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                            "name": "icon",
                                                                            "inlineHelpText": "",
                                                                            "description": "",
                                                                            "hidden": false,
                                                                            "readonly": false,
                                                                            "disabled": false
                                                                        }
                                                                    }
                                                                ],
                                                                "id": "u:38b76ff2792d",
                                                                "actions": [
                                                                    {
                                                                    "type": "button",
                                                                    "actionType": "cancel",
                                                                    "label": "取消",
                                                                    "id": "u:21d3cccf4d83"
                                                                    },
                                                                    {
                                                                        "type": "button",
                                                                        "actionType": "confirm",
                                                                        "label": "确定",
                                                                        "primary": true,
                                                                        "id": "u:238e5731a053"
                                                                    }
                                                                ],
                                                                "showCloseButton": false,
                                                                "closeOnOutside": false,
                                                                "closeOnEsc": false,
                                                                "showErrorMsg": false,
                                                                "showLoading": false,
                                                                "draggable": false,
                                                                "onEvent": {
                                                                    "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                            "ignoreError": false,
                                                                            "actionType": "dialog",
                                                                            "dialog": {
                                                                                "type": "dialog",
                                                                                "title": "",
                                                                                "body": [
                                                                                    {
                                                                                        "type": "spinner",
                                                                                        "id": "u:7b15becd491f",
                                                                                        "overlay": true
                                                                                    }
                                                                                ],
                                                                                "id": "u:38b76ff2798d",
                                                                                "actions": [],
                                                                                "showCloseButton": false,
                                                                                "closeOnOutside": false,
                                                                                "closeOnEsc": false,
                                                                                "showErrorMsg": false,
                                                                                "showLoading": false,
                                                                                "draggable": false
                                                                                }
                                                                            },
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "api": {
                                                                                    "url": "/service/api/objects/create_by_design",
                                                                                    "method": "post",
                                                                                    "adaptor": "window.location.href=Steedos.getRelativeUrl('/api/amisObjectFieldsDesign?oid=' + payload._id +\`&assetUrls=\${Builder.settings.assetUrls}\`+'&retUrl='+window.location.href);return {}",
                                                                                "requestAdaptor": "api.data={appId: context.app.id, groupId: context.label, name: context.oName, label: context.oLabel, icon: context.icon}; return api;",
                                                                                    "messages": {}
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "新建微页面",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "actionType": "dialog",
                                                            "dialog": {
                                                                "type": "dialog",
                                                                "title": "新建微页面",
                                                                "body": [
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "API Name",
                                                                        "name": "oName",
                                                                        "id": "u:dae5884c1633",
                                                                        "placeholder": "唯一标识",
                                                                        "value": "p_\${UUID(6)}",
                                                                        "required": true,
                                                                        "validateOnChange": true,
                                                                        "validations": {
                                                                            "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "显示名称",
                                                                        "name": "oLabel",
                                                                        "id": "u:e5bd37f6691b",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "steedos-field",
                                                                        "label": "图标",
                                                                        "config": {
                                                                            "label": "图标",
                                                                            "type": "lookup",
                                                                            "required": true,
                                                                            "sort_no": 30,
                                                                            "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                            "name": "icon",
                                                                            "inlineHelpText": "",
                                                                            "description": "",
                                                                            "hidden": false,
                                                                            "readonly": false,
                                                                            "disabled": false
                                                                        }
                                                                    }
                                                                ],
                                                                "id": "u:38b76ff2792d",
                                                                "actions": [
                                                                    {
                                                                    "type": "button",
                                                                    "actionType": "cancel",
                                                                    "label": "取消",
                                                                    "id": "u:21d3cccf4d83"
                                                                    },
                                                                    {
                                                                        "type": "button",
                                                                        "actionType": "confirm",
                                                                        "label": "确定",
                                                                        "primary": true,
                                                                        "id": "u:238e5731a053"
                                                                    }
                                                                ],
                                                                "showCloseButton": false,
                                                                "closeOnOutside": false,
                                                                "closeOnEsc": false,
                                                                "showErrorMsg": false,
                                                                "showLoading": false,
                                                                "draggable": false,
                                                                "onEvent": {
                                                                    "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                            "ignoreError": false,
                                                                            "actionType": "dialog",
                                                                            "dialog": {
                                                                                "type": "dialog",
                                                                                "title": "",
                                                                                "body": [
                                                                                    {
                                                                                        "type": "spinner",
                                                                                        "id": "u:7b15becd491f",
                                                                                        "overlay": true
                                                                                    }
                                                                                ],
                                                                                "id": "u:38b76ff2798d",
                                                                                "actions": [],
                                                                                "showCloseButton": false,
                                                                                "closeOnOutside": false,
                                                                                "closeOnEsc": false,
                                                                                "showErrorMsg": false,
                                                                                "showLoading": false,
                                                                                "draggable": false
                                                                                }
                                                                            },
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "api": {
                                                                                    "url": "/service/api/pages/create_page_by_design",
                                                                                    "method": "post",
                                                                                    "adaptor": "window.location.href=Steedos.getRelativeUrl('/api/pageDesign?pageId=' + payload._id +\`&assetUrls=\${Builder.settings.assetUrls}\`+'&retUrl='+window.location.href);return {}",
                                                                                    "requestAdaptor": "api.data={appId: context.app.id, groupId: context.label, name: context.oName, label: context.oLabel, icon: context.icon}; return api;",
                                                                                    "messages": {}
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "新建外部链接",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "ignoreError": false,
                                                            "actionType": "dialog",
                                                            "dialog": {
                                                                "type": "dialog",
                                                                "title": "新建外部链接",
                                                                "body": [
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "API Name",
                                                                        "name": "oName",
                                                                        "id": "u:dae5884c1633",
                                                                        "placeholder": "唯一标识",
                                                                        "required": true,
                                                                        "value": "t_\${UUID(6)}",
                                                                        "validateOnChange": true,
                                                                        "validations": {
                                                                            "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "显示名称",
                                                                        "name": "fLabel",
                                                                        "id": "u:e5bd37f6691b",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "input-text",
                                                                        "label": "外部链接",
                                                                        "name": "fUrl",
                                                                        "id": "u:e5bd37f6691b",
                                                                        "required": true
                                                                    },
                                                                    {
                                                                        "type": "steedos-field",
                                                                        "label": "图标",
                                                                        "config": {
                                                                            "label": "图标",
                                                                            "type": "lookup",
                                                                            "required": true,
                                                                            "sort_no": 30,
                                                                            "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                                                            "name": "icon",
                                                                            "inlineHelpText": "",
                                                                            "description": "",
                                                                            "hidden": false,
                                                                            "readonly": false,
                                                                            "disabled": false
                                                                        }
                                                                    }
                                                                ],
                                                                "id": "u:38b76ff2792d",
                                                                "actions": [
                                                                    {
                                                                    "type": "button",
                                                                    "actionType": "cancel",
                                                                    "label": "取消",
                                                                    "id": "u:21d3cccf4d83"
                                                                    },
                                                                    {
                                                                        "type": "button",
                                                                        "actionType": "confirm",
                                                                        "label": "确定",
                                                                        "primary": true,
                                                                        "id": "u:238e5731a053"
                                                                    }
                                                                ],
                                                                "showCloseButton": false,
                                                                "closeOnOutside": false,
                                                                "closeOnEsc": false,
                                                                "showErrorMsg": false,
                                                                "showLoading": false,
                                                                "draggable": false,
                                                                "onEvent": {
                                                                    "confirm": {
                                                                        "weight": 0,
                                                                        "actions": [
                                                                            {
                                                                            "ignoreError": false,
                                                                            "actionType": "dialog",
                                                                            "dialog": {
                                                                                "type": "dialog",
                                                                                "title": "",
                                                                                "body": [
                                                                                    {
                                                                                        "type": "spinner",
                                                                                        "id": "u:7b15becd491f",
                                                                                        "overlay": true
                                                                                    }
                                                                                ],
                                                                                "id": "u:38b76ff2798d",
                                                                                "actions": [],
                                                                                "showCloseButton": false,
                                                                                "closeOnOutside": false,
                                                                                "closeOnEsc": false,
                                                                                "showErrorMsg": false,
                                                                                "showLoading": false,
                                                                                "draggable": false
                                                                                }
                                                                            },
                                                                            {
                                                                                "ignoreError": false,
                                                                                "outputVar": "responseResult",
                                                                                "actionType": "ajax",
                                                                                "api": {
                                                                                    "url": "/service/api/tabs/create_link_tab_by_design",
                                                                                    "method": "post",
                                                                                "requestAdaptor": "api.data={appId: context.app.id, groupId: context.label, name: context.oName, label: context.fLabel, icon: context.icon, url: context.fUrl}; return api;",
                                                                                    "messages": {}
                                                                                }
                                                                            },
                                                                            {
                                                                                "componentId": "u:app-menu",
                                                                                "groupType": "component",
                                                                                "actionType": "reload"
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "divider"
                                        },
                                        {
                                            "type": "button",
                                            "label": "添加现有选项卡",
                                            "onEvent": {
                                                "click": {
                                                "actions": [
                                                    {
                                                    "ignoreError": false,
                                                    "actionType": "dialog",
                                                    "dialog": {
                                                        "type": "dialog",
                                                        "title": "添加现有选项卡",
                                                        "body": [
                                                            {
                                                                "type": "steedos-field",
                                                                "label": "选项卡",
                                                                "config": {
                                                                    "type": "lookup",
                                                                    "reference_to": "tabs",
                                                                    "reference_to_field": "name",
                                                                    "required": true,
                                                                    "sort_no": 30,
                                                                    "name": "tabs",
                                                                    "multiple": true,
                                                                    "enable_enhanced_lookup": true,
                                                                    "amis": {
                                                                        "label": false,
                                                                        "embed": true,
                                                                    }
                                                                }
                                                            }
                                                        ],
                                                        "id": "u:709fd4d53437",
                                                        "actions": [
                                                            {
                                                                "type": "button",
                                                                "actionType": "cancel",
                                                                "label": "取消",
                                                                "id": "u:ba7b707cddd8"
                                                            },
                                                            {
                                                                "type": "button",
                                                                "actionType": "confirm",
                                                                "label": "确定",
                                                                "primary": true,
                                                                "id": "u:2f3e5635b95d"
                                                            }
                                                        ],
                                                        "showCloseButton": true,
                                                        "closeOnOutside": false,
                                                        "closeOnEsc": false,
                                                        "showErrorMsg": true,
                                                        "showLoading": true,
                                                        "draggable": false,
                                                        "size": "md",
                                                        "onEvent": {
                                                            "confirm": {
                                                            "weight": 0,
                                                            "actions": [
                                                                {
                                                                    "ignoreError": false,
                                                                    "outputVar": "responseResult",
                                                                    "actionType": "ajax",
                                                                    "options": {},
                                                                    "api": {
                                                                        "url": "/service/api/apps/update_app_tabs_by_design",
                                                                        "method": "post",
                                                                        "requestAdaptor": "api.data={appId: context.app.id, groupId: context.label, addTabNames: context.tabs}; return api;",
                                                                        "adaptor": "",
                                                                        "messages": {}
                                                                    }
                                                                },
                                                                {
                                                                    "componentId": "u:app-menu",
                                                                    "groupType": "component",
                                                                    "actionType": "reload"
                                                                }
                                                            ]
                                                            }
                                                        }
                                                    }
                                                    }
                                                ]
                                                }
                                            }
                                        }
                                    ]
                                },
                            ],
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
                        ]
                      };
                  } catch (error) {
                      console.log(\`error\`, error)
                  }
                    console.log('payload===2==>', payload)

                  setTimeout(function(){
                    $("[name='keywords']").focus();
                  }, 300);

                  return payload;
            `,
            "headers": {
              "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            }
        }
    }
    // console.log(`AmisAppMenu schema=====>`, schema)
    return schema;
}
