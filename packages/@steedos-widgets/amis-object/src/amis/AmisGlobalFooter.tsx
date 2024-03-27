/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 涂佳俊 tujiajun@steedos.com
 * @LastEditTime: 2023-11-23 14:33:45
 * @Description: 
 */

import './AmisGlobalFooter.less';
import {i18next} from '@steedos-widgets/amis-lib';

export const AmisGlobalFooter = async (props) => {
    let { stacked = false, overflow, appId, data, links = null, showIcon = true, indentSize = 12, selectedId } = props;
    if (!appId) {
        appId = data.context.appId || 'admin';
    }
    const isMobile = window.innerWidth <= 768;
    const className = 'steedos-global-footer';
    const footerNavEach = `
        const classIcon = tab.icon.replace(/_/g,"-");
        if(locationPathname == tab.path){
            customTabId = tab.id;
        }else if(locationPathname.startsWith(tab.path + "/")){
            objectTabId = tab.id;
        }
        data.nav.push({
            "label": {
                type: 'tpl',
                tpl: \`<span class='fill-slate-500 truncate text-gray-700 block -ml-px no-underline group flex items-center text-[11px] rounded-md flex-col leading-3 nav-label'><svg class="slds-icon slds-icon_container slds-icon-standard-\`+classIcon+\` flex-shrink-0 h-10 w-10"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\${tab.icon || 'account'}"></use></svg><span class="truncate" style="max-width: 20vw">\${tab.name}</span></span>\`,
                className:'h-full flex items-center'
            },
            "to": tab.path,
            "target":tab.target,
            "id": tab.id,
            "activeOn": "\\\\\${tabId == '"+ tab.id +"' && !isMenuNavVisible}"
        });
    `;
    const footerNavScript = `
        _.each(_.slice(payload.children, 0, 3), (tab,index)=>{
            ${footerNavEach}
        })
        if (!${data.app.is_hide_mobile_menu}) {
            data.nav.push({
                "label": {
                    type: 'tpl',
                    tpl: \`<span class=' truncate text-gray-700 block -ml-px no-underline group flex items-center text-[11px] rounded-md flex-col leading-3 nav-label'><svg class="fill-slate-500 flex-shrink-0 !h-10 !w-10" style="padding:7px"><use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#rows"></use></svg><span class="truncate" style="max-width: 20vw">${i18next.t('frontend_menu')}</span></span>\`,
                    className:'h-full flex items-center'
                },
                "id": "__menu__",
                "activeOn": "\\\\\${isMenuNavVisible}",
                "isMenu": true,
                "menuReRengder": "\${isMenuNavVisible}"//为了menu能正常显示高亮，触发重新渲染
            });
        } 
    `;
    const menuNavScript = `
        _.each(_.groupBy(payload.children, 'group'), (tabs, groupName) => {
            if (groupName === 'undefined' || groupName === '') {
                _.each(tabs, function(tab){
                    const classIcon = tab.icon.replace(/_/g, "-");
                    data.links.push({
                        "label": {
                            type: 'tpl',
                            tpl: \`<span class='fill-slate-500  text-gray-700 block -ml-px no-underline group flex items-center text-lg font-medium rounded-md flex-row leading-3 nav-label'><svg class="mr-3 slds-icon slds-icon_container slds-icon-standard-\` + classIcon + \` flex-shrink-0 h-10 w-10"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\` + tab.icon + \`"></use></svg><span>\` + tab.name +\`</span><i class="fa fa-angle-right" aria-hidden="true" style="position: absolute;right: 20px;color: #bababa;"></i></span>\`,
                            className: 'h-full flex items-center'
                        },
                        "to": tab.path,
                        "target": tab.target,
                        "id": tab.id,
                        "activeOn": "false",
                        "className": "border-b border-gray-200 py-2.5"
                    });
                })
            } else {
                var tabGroup = _.find(tab_groups, { "group_name": groupName });
                data.links.push({
                    "label": groupName,
                    "unfolded": tabGroup && tabGroup.default_open != false,
                    "isGroup": true,
                    "mode": "group",
                    "children": _.sortBy(_.map(tabs, (tab) => {
                        const classIcon = tab.icon.replace(/_/g, "-");
                        return {
                            "label": {
                                type: 'tpl',
                                tpl: \`<span class='fill-slate-500  text-gray-700 block -ml-px no-underline group flex items-center text-lg font-medium rounded-md flex-row leading-3 nav-label'><svg class="mr-3 slds-icon slds-icon_container slds-icon-standard-\` + classIcon + \` flex-shrink-0 h-10 w-10"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#\` + tab.icon + \`"></use></svg><span>\` + tab.name +\`</span><i class="fa fa-angle-right" aria-hidden="true" style="position: absolute;right: 20px;color: #bababa;"></i></span>\`,
                                className: 'h-full flex items-center'
                            },
                            "to": tab.path,
                            "target": tab.target,
                            "id": tab.id,
                            "activeOn": "false",
                            "className": "border-b border-gray-200 py-2.5"
                        }
                    }), function (tab){ return tab.index })
                })
            }
        });
        data.links = _.sortBy(data.links, function (tab) {
            if (tab.isGroup) {
                return _.findIndex(payload.tab_groups, function (group) {
                    return group.group_name === tab.label;
                });
            } else {
                // 没有分组的选项卡按index排列在有分组的选项卡前方
                return (tab.index || 0) - 1000;
            }
        })
    `;
    let schema = {}
    if (links) {
        schema = {
            type: 'service',
            mobile: {
                body: [
                    {
                        "type": "nav",
                        "className": className,
                        "stacked": stacked,
                        "overflow": overflow,
                        "indentSize": indentSize,
                        "links": links
                    }
                ]
            }

        }
    } else if (isMobile) {
        schema = {
            type: 'service',
            schemaApi: {
                "method": "get",
                "url": `\${context.rootUrl}/service/api/apps/${appId}/menus?mobile=true`,
                "adaptor": `
                        try {
                            // if(payload.children && payload.children.length == 0){
                            //     payload.data = {};
                            //     return payload
                            // }
                            const data = { nav: [],links: [] };
                            const stacked = ${stacked};
                            const showIcon = ${showIcon};
                            const selectedId = '${selectedId}';
                            const locationPathname = window.location.pathname;
                            var customTabId = "";
                            var objectTabId = "";
                            const tab_groups = payload.tab_groups;
                            payload.children = _.sortBy(payload.children, function(tab){
                                return tab.index;
                            })
                            ${footerNavScript}
                            ${menuNavScript}
                            payload.data = {
                                "type": "service",
                                "data":{
                                    "tabId": customTabId || objectTabId,
                                    "items": data.nav,
                                    "isMenuNavVisible": false
                                },
                                "id": "steedosMobileFooterService",
                                "body": [
                                    {
                                        "type": "nav",
                                        className: "${className}",
                                        "stacked": ${stacked},
                                        "indentSize": ${indentSize},
                                        "source": "\${items}",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "setValue",
                                                        "componentId": "steedosMobileFooterService",
                                                        "args": {
                                                            "value": {
                                                                "isMenuNavVisible": "\${event.data.item.isMenu}",
                                                                "tabId": "\${event.data.item.id}",
                                                                "items": data.nav
                                                            }
                                                        },
                                                        "expression":"\${event.data.item.id}"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        "type": "page",
                                        "bodyClassName": "p-0",
                                        "title": {
                                            "type": "steedos-app-launcher",
                                            "showAppName": true,
                                            "showAppIcon": false,
                                            "appNameClassName": "!mx-0",
                                            "appId": "${appId}",
                                            "customElements": [
                                                {
                                                    "type": "icon",
                                                    "icon": "angle-down",
                                                    "className": "absolute right-0"
                                                }
                                            ]
                                        },
                                        "className": "steedos-global-footer-menu-page",
                                        "visibleOn": "\${isMenuNavVisible}",
                                        "body": [
                                            {
                                                "type": "nav",
                                                "id": "u:58c2a9249e9d",
                                                "stacked": true,
                                                "links": data.links,
                                                "onEvent": {
                                                    "click": {
                                                        "actions": [
                                                        {
                                                                "actionType": "setValue",
                                                                "componentId": "steedosMobileFooterService",
                                                                "args": {
                                                                    "value": {
                                                                        "isMenuNavVisible": false,
                                                                        "tabId": "\${event.data.item.id}",
                                                                        "items": data.nav
                                                                    }
                                                                },
                                                                "expression":"\${event.data.item.id}"
                                                        }
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                                
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
    console.log("payload===>",schema);
    return schema;
}