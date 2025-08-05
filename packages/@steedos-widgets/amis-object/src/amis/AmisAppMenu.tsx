/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-07-29 22:50:22
 * @Description: 
 */
import './AmisAppMenu.less';

export const AmisAppMenu = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, className = '', indentSize = 12, selectedId } = props;
    if(!appId){
        appId = data.context.appId;
    }
    // console.log(`AmisAppMenu appId`, appId)
    // console.log(`AmisAppMenu`, appId, props)
    let badgeText = `\${badges.value | pick:${appId} | toInt}`;
    if(appId == "approve_workflow"){
        badgeText = "${badges.value | pick:'workflow' | toInt}";
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

    const saveOrderApiRequestAdaptor = `
        const menus = context.data;
        // console.log("====saveOrderApiRequestAdaptor====menus==", menus);
        const tab_groups = [];
        const tab_items = {};
        var hasError = false;
        _.each(menus, (menu) => {
            if (menu.isGroup) {
                tab_groups.push({
                    group_name: menu.label,
                    default_open: menu.default_open,
                });
            } else {
                tab_items[menu.tabApiName] = { group: "" };
            }
            if (menu.children) {
                _.each(menu.children, (menu2) => {
                    if(menu2.isTempTabForEmptyGroup !== true){
                        if (menu2.isGroup) {
                            // 因为分组只支持到一层，不支持分组拖动到另一个分组，还原到原来的分组
                            tab_groups.push({
                                group_name: menu2.label,
                                default_open: menu2.default_open,
                            });
                            _.each(menu2.children, (menu3) => {
                                tab_items[menu3.tabApiName] = { group: menu2.label };
                            });
                            hasError = true;
                        } else {
                            if (menu.isGroup) {
                                tab_items[menu2.tabApiName] = { group: menu.label };
                            }
                            else{
                                // menu.isGroup不为true，说明menu不是一个分组，而menu.children有值，说明menu是一个分组，这是异常操作
                                // 说明此时是把一个菜单拖动到一个普通的菜单内部，正常应该把菜单拖动到某个分组内或其它菜单同级，不可以把普通菜单当分组
                                // 此时把菜单还原成普通菜单即可，即group值为空
                                tab_items[menu2.tabApiName] = { group: "" };
                            }
                        }
                    }
                });
            }
        });
        if(hasError){
            var amis = amisRequire("amis");
            // var errorMsg = window.t ? window.t("frontend_app_menu_save_order_group_nesting_error") : "Group nesting is not supported";
            amis && amis.toast.warning("不支持分组嵌套");
        }
        api.data = { appId: context.app.id, tab_groups, tab_items };
        // console.log("====saveOrderApiRequestAdaptor====api.data==", api.data);
        return api;
    `;
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

                      let collapsed = false;

                      const data = { nav: [] };
                      const stacked = ${stacked};
                      let showIcon = ${showIcon};
                      const selectedId = '${selectedId}';
                      const tab_groups = payload.tab_groups;
                      const locationPathname = window.location.pathname;
                      var customTabId = "";
                      var objectTabId = "${data.tabId}";
                      var usedGroupNames = [];
                      let allowEditApp = false;
                      if(stacked){
                        if(context.appId == context.app.id){
                            collapsed = _.includes(document.body.classList, 'sidebar-open') != true;
                        }
                        // console.log('collapsed', collapsed, document.body.classList, context.appId == context.app.id)
                        if(collapsed){
                            showIcon = false;
                        }

                          if(payload.allowEditApp && collapsed != true){
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
                                          "tabIcon": tab.icon
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
                                            "groupName": groupName,
                                            "tabIcon": tab.icon
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
                              "tabIcon": tab.icon
                              // active: selectedId === tab.id,
                              });
                          })
                      }

                      if(allowEditApp){
                        const tempTabForEmptyGroup = {
                            "label": {
                                "type": "tpl",
                                "tpl": "无菜单"
                            },
                            "searchKey": "",
                            "disabled": true,
                            "tabApiName": "temp_tab_for_empty_group",
                            "isTempTabForEmptyGroup": true
                        };
                        _.each(payload.tab_groups, (group)=>{
                            if(!_.includes(usedGroupNames, group.group_name)){
                                tempTabForEmptyGroup.id = "temp_tab_for_empty_group__" + group.group_name;
                                data.nav.push({
                                    "label": group.group_name,
                                    'default_open': group && group.default_open != false,
                                    "unfolded": group && group.default_open != false,
                                    "isGroup": true,
                                    "children": [tempTabForEmptyGroup]
                                })
                            }
                        });
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

                      if(collapsed){
                        const collapsedNav = [];
                        for(const item of data.nav){
                            if(item.isGroup){
                                if(collapsedNav.length > 0){
                                    collapsedNav.push({
                                        "mode": "divider"
                                    })
                                }
                                for(const childrenItem of item.children){
                                    collapsedNav.push(Object.assign({}, childrenItem, {
                                        disabledTip: true,
                                        label: {
                                            "type": "tooltip-wrapper",
                                            "content": childrenItem.label,
                                            "placement": "right",
                                            "disabled": true,
                                            "body": [
                                                {
                                                    'type': 'tpl',
                                                    'tpl': '<svg class="slds-icon_container slds-icon fill-gray-700 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#' + (childrenItem.tabIcon || 'account') + '"></use></svg>'
                                                }
                                            ]
                                        }
                                        
                                        
                                        // label: false, 
                                        // icon: '/assets/icons/standard-sprite/svg/symbols.svg#' + (childrenItem.tabIcon || 'account')
                                    }));
                                }
                            }else{
                                collapsedNav.push(Object.assign({}, item, {
                                    disabledTip: true,
                                    label: {
                                        "type": "tooltip-wrapper",
                                        "content": item.label,
                                        "placement": "right",
                                        "disabled": true,
                                        "body": [
                                            {
                                                'type': 'tpl',
                                                'tpl': '<svg class="slds-icon_container slds-icon fill-gray-700 flex-shrink-0 h-6 w-6"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#' + (item.tabIcon || 'account') + '"></use></svg>'
                                            }
                                        ]
                                    }
                                    // label: false, 
                                    // icon: '/assets/icons/standard-sprite/svg/symbols.svg#' + (item.tabIcon || 'account')
                                }));
                            }
                        }
                        data.nav = collapsedNav;
                      }

                      let editAppSearch = [];
                      if(allowEditApp){
                        editAppSearch = [{
                                "type": "grid",
                                "className": "m-2",
                                "columns": [
                                    {
                                        "md": 9,
                                        "columnClassName": "p-0",
                                        "body": [
                                            {
                                                "type": "button",
                                                "className": "toggle-sidebar",
                                                "onEvent": {
                                                    "click": {
                                                        "actions": [
                                                            {
                                                                "actionType": "custom",
                                                                "script": "document.body.classList.toggle('sidebar-open')",
                                                            },
                                                            {
                                                                "actionType": "rebuild",
                                                                "componentId": "u:app-menu",
                                                                "args": {
                                                                    "toggleSidebar": true
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                "body": [
                                                    {
                                                        "type": "html",
                                                        "html": "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-7 h-7 p-1 hover:bg-white hover:shadow'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' /></svg>"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "md": 3,
                                        "columnClassName": "p-0 steedos-app-menu-plus",
                                        "body": [
                                            {
                                            "type": "dropdown-button",
                                            "level": "link",
                                            "className": "float-right",
                                            "btnClassName": "p-1 text-gray-600 hover:bg-white! hover:shadow!",
                                            "icon": "fa fa-gear",
                                            "iconOnly": true,
                                            "closeOnClick": true,
                                            "closeOnOutside": true,
                                            // "size": "md",
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
                                                    },
                                                    {
                                                        "type": "divider"
                                                    },
                                                    {
                                                        "type": "button",
                                                        "label": "编辑应用",
                                                        "onEvent": {
                                                            "click": {
                                                                "actions": [
                                                                    {
                                                                        "actionType": "ajax",
                                                                        "api": {
                                                                            "url": "/graphql",
                                                                            "method": "post",
                                                                            "adaptor": "const apps = payload.data.apps; if(apps && apps.length > 0){ return {data: apps[0]} }; return {data: null};",
                                                                            "requestAdaptor": "api.data={query: '{  apps(filters: [\\\"code\\\", \\\"=\\\", ' + context.appId + ']) {    _id    name}}'}; return api;"
                                                                        }
                                                                    },
                                                                    {
                                                                        "actionType": "drawer",
                                                                        "drawer": {
                                                                            "type": "drawer",
                                                                            "title": "&nbsp;",
                                                                            "headerClassName": "hidden",
                                                                            "size": "lg",
                                                                            "width": window.drawerWidth || "70%",
                                                                            "bodyClassName": "p-0 m-0 bg-gray-100",
                                                                            "closeOnEsc": true,
                                                                            "closeOnOutside": true,
                                                                            "resizable": true,
                                                                            "actions": [],
                                                                            "body": {
                                                                                "type": "service",
                                                                                "id": "u:1678e148c8d2",
                                                                                "messages": {},
                                                                                "schemaApi": {
                                                                                    "url": "/api/pageSchema/app?objectApiName=apps&formFactor=LARGE&formFactor=LARGE",
                                                                                    "method": "get",
                                                                                    "adaptor": "const schema = {type: 'steedos-record-detail'}; schema.data={objectName: 'apps', _inDrawer: true, recordLoaded: false}; schema.objectApiName='apps'; schema.recordId=context.responseData._id; console.log('schema', schema); return {data: schema};"
                                                                                }
                                                                            },
                                                                            "className": "steedos-record-detail-drawer app-popover",
                                                                            "id": "u:fc5f055afa8c"
                                                                        },
                                                                        "preventDefault": true
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                        }
                                        ]
                                    }
                                ]
                            }]
                      }else if(stacked){
                        editAppSearch = [{
                            "type": "button",
                            "className": "toggle-sidebar w-12 mx-3 my-2",
                            "onEvent": {
                                "click": {
                                    "actions": [
                                        {
                                            "actionType": "custom",
                                            "script": "document.body.classList.toggle('sidebar-open')",
                                        },
                                        {
                                            "actionType": "rebuild",
                                            "componentId": "u:app-menu",
                                            "args": {
                                                "toggleSidebar": true
                                            }
                                        }
                                    ]
                                }
                            },
                            "body": [
                                {
                                    "type": "html",
                                    "html": "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-7 h-7 p-1 hover:bg-white hover:shadow'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' /></svg>"
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
                    //   console.log("menuItems====", menuItems);
                      payload.data = {
                        "type":"service",
                        "className": "steedos-app-service steedos-app-service-\${allowEditApp ? 'edit' : 'readonly'}",
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
                            "collapsed": collapsed,
                            "searchable": false,
                            "searchConfig": {
                              "placeholder": "搜索菜单",
                              "matchFunc": "return link.searchKey && link.searchKey.indexOf(keyword)>=0;"
                            },
                            className: "${className} text-black steedos-app-menu ${stacked?'stacked':''}",
                            "stacked": ${stacked},
                            "overflow": ${JSON.stringify(overflow)},
                            "indentSize": ${indentSize},
                            "draggable": allowEditApp,
                            "dragOnSameLevel": false,
                            "saveOrderApi": {
                                "url": "/service/api/apps/update_app_by_design",
                                "method": "post",
                                "adaptor": "",
                                "requestAdaptor": ${JSON.stringify(saveOrderApiRequestAdaptor)},
                                "messages": {}
                            },
                            "itemActions": [
                                {
                                    "type": "dropdown-button",
                                    "level": "link",
                                    "icon": "fa fa-ellipsis-h",
                                    "hideCaret": true,
                                    "closeOnClick": true,
                                    "closeOnOutside": true,
                                    "btnClassName": "!text-gray-700",
                                    "visibleOn": "!!allowEditApp",
                                    "className": "hidden hover-inline-flex px-1",
                                    "buttons": [
                                        {
                                            "type": "button",
                                            "label": "新建对象",
                                            "visibleOn": "!!this.isGroup",
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
                                            "visibleOn": "!!this.isGroup",
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
                                            "visibleOn": "!!this.isGroup",
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
                                            "type": "divider",
                                            "visibleOn": "!!this.isGroup",
                                        },
                                        {
                                            "type": "button",
                                            "label": "添加现有选项卡",
                                            "visibleOn": "!!this.isGroup",
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
                                        },
                                        {
                                            "type": "divider",
                                            "visibleOn": "!!this.isGroup",
                                        },
                                        {
                                            "type": "button",
                                            "label": "编辑分组",
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
                                            "label": "查看对象",
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
                                                            "actionType": "ajax",
                                                            "api": {
                                                                "url": "/graphql",
                                                                "method": "post",
                                                                "adaptor": "const objects = payload.data.objects; if(objects && objects.length > 0){ return {data: objects[0]} }; return {data: null};",
                                                                "requestAdaptor": "api.data={query: '{  objects(filters: [\\\"name\\\", \\\"=\\\", ' + context.id + ']) {    _id    name}}'}; return api;"
                                                            }
                                                        },
                                                        {
                                                            "actionType": "drawer",
                                                            "drawer": {
                                                                "type": "drawer",
                                                                "title": "&nbsp;",
                                                                "headerClassName": "hidden",
                                                                "size": "lg",
                                                                "width": window.drawerWidth || "70%",
                                                                "bodyClassName": "p-0 m-0 bg-gray-100",
                                                                "closeOnEsc": true,
                                                                "closeOnOutside": true,
                                                                "resizable": true,
                                                                "actions": [],
                                                                "body": {
                                                                    "type": "service",
                                                                    "id": "u:1678e148c8d2",
                                                                    "messages": {},
                                                                    "schemaApi": {
                                                                        "url": "/api/pageSchema/record?objectApiName=objects&formFactor=LARGE",
                                                                        "method": "get",
                                                                        "adaptor": "const schema = JSON.parse(payload.schema); schema.data={objectName: 'objects', _inDrawer: true, recordLoaded: false}; schema.objectApiName='objects'; schema.recordId=context.responseData._id; return {data: schema};"
                                                                    }
                                                                },
                                                                "className": "steedos-record-detail-drawer app-popover",
                                                                "id": "u:fc5f055afa8c"
                                                            },
                                                            "preventDefault": true
                                                        },
                                                        {
                                                            "ignoreError": false,
                                                            "outputVar": "responseResult",
                                                            "actionType": "ajax",
                                                            "expression": "\${false}",
                                                            "api": {
                                                                "url": "/graphql",
                                                                "method": "post",
                                                                "adaptor": "const objects = payload.data.objects; if(objects && objects.length > 0){ try{const objectId = objects[0]._id; navigate('/app/admin/objects/view/'+objectId+'?side_object=objects&side_listview_id=all')}catch(e){payload.error=e.message;} }; return payload;",
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
                                            "label": "编辑微页面",
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
                                            "label": "编辑选项卡",
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
                                            "label": "移动分组",
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
                                                                "title": "移动到指定分组",
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
                                            "label": "删除选项卡",
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
                                            "label": "删除分组",
                                            "visibleOn": "!!this.isGroup",
                                            "onEvent": {
                                                "click": {
                                                    "actions": [
                                                        {
                                                            "actionType": "custom",
                                                            "script": "if(event.data.children && event.data.children.length > 0 && !event.data.children[0].isTempTabForEmptyGroup){doAction({'actionType': 'toast','args': {  'msgType': 'warning',  'msg': '分组下有数据,禁止删除'}});event.stopPropagation();};"
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
                  setTimeout(function(){
                    $("[name='keywords']").focus();
                  }, 300);
                  // console.log('AmisAppMenu AmisAppMenu=====>', payload)
                  return payload;
            `
        }
    }
    // console.log(`AmisAppMenu schema=====>`, schema)
    return schema;
}
