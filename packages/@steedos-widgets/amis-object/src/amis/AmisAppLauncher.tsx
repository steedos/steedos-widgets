/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 11:18:39
 * @Description: 
 */

export const AmisAppLauncher = async (props) => {
    let { app, data, className, showAppName = true, appNameClassName = '' } = props;
    if(!app){
      app = data.context.app ;
    }
    
    const formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
    const mobile = formFactor === "SMALL" ? true : false;

    return {
        type: 'service',
        className,
        body: [
            {
                "type": "button",
                "actionType": "dialog",
                "className": "flex items-center",
                "body": [
                  {
                    "type": "tpl",
                    "className": "flex items-center",
                    "tpl": "<div aria-haspopup='true' title='Open App Launcher' class='slds-icon-waffle_container slds-context-bar__button' title='Open App Launcher' type='button'><span class='slds-icon-waffle'><span class='slds-r1'></span><span class='slds-r2'></span><span class='slds-r3'></span><span class='slds-r4'></span><span class='slds-r5'></span><span class='slds-r6'></span><span class='slds-r7'></span><span class='slds-r8'></span><span class='slds-r9'></span></span></div>",
                  },
                  {
                      type: 'tpl',
                      className: `text-xl ml-4 mr-4 text-black nowrap ${appNameClassName} `,
                      tpl: '${app.name}',
                      hiddenOn: `${!!app || !!!showAppName}`
                  }
                ],
                "dialog": {
                  "size": "xl",
                  "title": {
                    "type": "tpl",
                    "tpl": "应用程序启动器",
                    "className": "block text-xl text-center"
                  },
                  "actions": [
                  ],
                  "body": [
                    {
                      "type": "service",
                      "id": "u:0f6224a0836f",
                      "affixFooter": false,
                      "body": [
                        {
                          "type": "collapse-group",
                          "activeKey": [
                            "1",
                            "2"
                          ],
                          "body": [
                            {
                              "type": "collapse",
                              "key": "1",
                              "header": "所有应用",
                              "body": [
                                {
                                  "type": "each",
                                  "name": "app_items",
                                  "items": {
                                    "type": "button",
                                    "level": "link",
                                    "actionType": "link",
                                    "link": "${path}",
                                    "body": [{
                                      "type": "tpl",
                                      "tpl": "<div class='slds-app-launcher__tile slds-text-link_reset'><div class='slds-app-launcher__tile-figure'><svg class='w-12 h-12 slds-icon slds-icon_container slds-icon-standard-${REPLACE(icon, '_', '-')}' aria-hidden='true'><use xlink:href='/assets/icons/standard-sprite/svg/symbols.svg#${icon}'></use></svg><span class='slds-assistive-text'>${name}</span></div><div class='slds-app-launcher__tile-body'><span class='slds-link text-blue-600 text-lg'><span title='${name}'>${name}</span></span><div style='display: -webkit-box; -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;'><span title='${description}'>${description}</span></div></div></div>",
                                    }],
                                    "onEvent": {
                                      "click": {
                                        "actions": [
                                          {
                                            "actionType": "closeDialog"
                                          }
                                        ]
                                      }
                                    },
                                    "inline": true,
                                    "style": {
                                    },
                                    "className": "slds-p-horizontal_small slds-size_1-of-1 slds-medium-size_1-of-3"
                                  },
                                  "className": "slds-grid slds-wrap slds-grid_pull-padded"
                                }
                              ]
                            },
                            {
                              "type": "collapse",
                              "key": "2",
                              "header": "所有项目",
                              "body": [
                                {
                                  "type": "each",
                                  "name": "object_items",
                                  "items": {
                                    "type": "button",
                                    "level": "link",
                                    "actionType": "link",
                                    "link": "${path}",
                                    "body": [{
                                      "type": "tpl",
                                      "wrapperComponent": "span",
                                      "className": "app-launcher-link slds-text-link--reset slds-app-launcher__tile--small slds-truncate creator-object-nav-${id}",
                                      "tpl": "<span class=\"slds-truncate slds-text-link\">${name}</span>",
                                    }],
                                    "onEvent": {
                                      "click": {
                                        "actions": [
                                          {
                                            "actionType": "closeDialog"
                                          }
                                        ]
                                      }
                                    },
                                    "inline": true,
                                    "style": {
                                    },
                                    "className": "slds-col--padded slds-p-vertical_xx-small slds-size_1-of-5 slds-grow-none oneAppLauncherItem"
                                  },
                                  "className": "slds-grid slds-wrap"
                                }
                              ],
                              "className": ""
                            }
                          ],
                        }
                      ],
                      "className": "",
                      "visibleOn": "",
                      "clearValueOnHidden": false,
                      "visible": true,
                      "messages": {
                      },
                      "api": {
                        "method": "get",
                        "url": "${context.rootUrl}/service/api/apps/menus?mobile="+mobile,
                        "data": null,
                        "headers": {
                          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                        },
                        "adaptor": "\nlet app_items = payload;\nlet object_items = [];\nlet objects = [];\napp_items.forEach((item) => {\n  item.children.forEach((i) => {\n    if (objects.indexOf(i.id) < 0) {\n      objects.push(i.id);\n      object_items.push(i)\n    }\n  })\n})\npayload.data = {\n  app_items,\n  object_items\n}\nreturn payload;"
}
                    }
                  ]
                },
                "id": "u:b5dc095e1c11"
            }
        ],
    }
}