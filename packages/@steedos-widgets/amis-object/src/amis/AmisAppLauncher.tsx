/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-30 10:06:03
 * @Description: 
 */

import { i18next } from '@steedos-widgets/amis-lib';

export const AmisAppLauncher = async (props) => {
  let { app, data, className, showAppName = true, appNameClassName = '', customElements = [], showAppIcon = true } = props;
  if (!app) {
    app = data.context.app;
  }

  const formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  const isMobile = formFactor === "SMALL" ? true : false;
  const on_click_script = `
    var evalFunString = "(function(){" + event.data.on_click + "})()";
    try{
      eval(evalFunString);
    }
    catch(e){
      console.error("catch some error when eval the on_click script for app link:");
      console.error(e.message + "\\r\\n" + e.stack);
    }
  `
  const mobile_blank_script = `
    if(event.data.path[0] == "/"){
      Steedos.openWindow(event.data.context.rootUrl + event.data.path)
    }else{
      Steedos.openWindow(event.data.path)
    }
  `
  let dialogSchema = {}
  const badgeText = "${IF(${id} == 'approve_workflow',${ss:keyvalues.badge.value|pick:'workflow'},${ss:keyvalues.badge.value|pick:${id}}) | toInt}";
  if(isMobile){
    dialogSchema = {
      "type": "service",
      "className": "steedos-apps-service",
      "affixFooter": false,
      "body": [
        {
          "type": "each",
          "name": "app_items",
          "items": {
            "type": "button",
            "level": "link",
            "body": [
              {
                "type": "tpl",
                "tpl": "<div class='flex flex-col justify-center'><div class='text-center'><svg class='w-12 h-12 slds-icon slds-icon_container slds-icon-standard-${REPLACE(icon, '_', '-' )}' aria-hidden='true'><use xlink:href='/assets/icons/standard-sprite/svg/symbols.svg#${icon}'></use></svg></div><div class='text-center text-lg'>${name}</div></div>",
                "badge": {
                  "mode": "text",
                  "text": badgeText,
                  "visibleOn": badgeText,
                  "overflowCount": 99,
                  "style": {
                    "right": "50%",
                    "margin-right": "-23px",
                    "height": "20px",
                    "border-radius": "10px",
                    "font-size": "16px",
                    "line-height": "18px"
                  }
                }
              }
            ],
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "actionType": "closeDialog"
                  },
                  {
                    "actionType": "link",
                    "args": {
                      "link": "${path}"
                    },
                    "expression": "${AND(!blank , !on_click)}"
                  },
                  {
                    "actionType": "custom",
                    "script": mobile_blank_script,
                    "expression": "${AND(blank , !on_click)}"
                  },
                  {
                    "actionType": "custom",
                    "script": on_click_script,
                    "expression": "${on_click}"
                  }
                ]
              }
            },
            "className": "block w-1/3 py-4",
            "style": {
              "display": "inline-flex",
              "justify-content": "center"
            }
          },
          "className": "flex flex-wrap",
          "id": "u:a98e9f6fb4db"
        }
      ],
      "clearValueOnHidden": false,
      "visible": true,
      "messages": {
      },
      "api": {
        "method": "get",
        "url": "${context.rootUrl}/service/api/apps/menus?mobile=true",
        "headers": {
          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "adaptor": "\nlet app_items = payload;\npayload = {\n  app_items\n}\nreturn payload;",
        "messages": {
        }
      },
      "onEvent": {
        "@data.changed.steedos_keyvalues": {
          "actions": [
            {
              "actionType": "reload"
            }
          ]
        },
        "fetchInited": {
          "actions": [
            {
              "actionType": "broadcast",
              "args": {
                "eventName": "@appsLoaded"
              },
              "data": {
                "apps": "${event.data.app_items}"
              }
            }
          ]
        }
      },
      "id": "u:2c8bd22d4ea8"
    }
  }else{
    dialogSchema = {
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
              "header": i18next.t('frontend_all_apps'),
              "body": [
                {
                  "type": "each",
                  "name": "app_items",
                  "items": {
                    "type": "button",
                    "level": "link",
                    "body": [{
                      "type": "tpl",
                      "tpl": "<div class='slds-app-launcher__tile slds-text-link_reset'><div class='slds-app-launcher__tile-figure'><svg class='w-12 h-12 slds-icon slds-icon_container slds-icon-standard-${REPLACE(icon, '_', '-')}' aria-hidden='true'><use xlink:href='/assets/icons/standard-sprite/svg/symbols.svg#${icon}'></use></svg><span class='slds-assistive-text'>${name}</span></div><div class='slds-app-launcher__tile-body'><span class='slds-link text-blue-600 text-lg'><span title='${name}'>${name}</span></span><div style='display: -webkit-box; -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;'><span title='${description}'>${description}</span></div></div></div>",
                      "badge": {
                        "mode": "text",
                        "text": badgeText,
                        "visibleOn": badgeText,
                        "className": "w-full",
                        "overflowCount": 99,
                        "style": {
                          "top": "20px",
                          "left": "37px",
                          "height": "20px",
                          "border-radius": "10px",
                          "line-height": "18px",
                          "margin-left": "${"+ badgeText +">9?("+ badgeText +">99?'-21px':'-11px'):'0'}",
                          "right": "auto",
                          "font-size": "16px"
                        }
                      }
                    }],
                    "onEvent": {
                      "click": {
                        "actions": [
                          {
                            "actionType": "closeDialog"
                          },
                          {
                            "actionType": "link",
                            "args": {
                              "link": "${path}"
                            },
                            "expression": "${AND(!blank , !on_click)}"
                          },
                          {
                            "actionType": "url",
                            "args": {
                              "url": "${path}",
                              "blank": true
                            },
                            "expression": "${AND(blank , !on_click)}"
                          },
                          {
                            "actionType": "custom",
                            "script": on_click_script,
                            "expression": "${!!on_click}"
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
              "header": i18next.t('frontend_all_projects'),
              "body": [
                {
                  "type": "each",
                  "name": "object_items",
                  "items": {
                    "type": "button",
                    "level": "link",
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
                            "actionType": "custom",
                            "script": "\nconst path = context.props.data.path;\ndoAction({\n  actionType: 'link',\n  args: {\n    \"url\": path,\n    \"blank\": false\n  }\n});"
                          },
                          {
                            "actionType": "broadcast",
                            "args": {
                              "eventName": "@tabId.changed"
                            },
                            "data":{
                              "tabId": "${event.data.id}"
                            }
                          },
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
      "className": "steedos-apps-service",
      "visibleOn": "",
      "clearValueOnHidden": false,
      "visible": true,
      "messages": {
      },
      "onEvent": {
        "@data.changed.steedos_keyvalues": {
          "actions": [
            {
              "actionType": "reload"
            }
          ]
        },
        "fetchInited": {
          "actions": [
            {
              "actionType": "broadcast",
              "args": {
                "eventName": "@appsLoaded"
              },
              "data": {
                "apps": "${event.data.app_items}"
              }
            }
          ]
        }
      },
      "api": {
        "method": "get",
        "url": "${context.rootUrl}/service/api/apps/menus?mobile=" + isMobile,
        "data": null,
        "headers": {
          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "adaptor": "\nlet app_items = payload;\nlet object_items = [];\nlet objects = [];\napp_items.forEach((item) => {\n  item.children.forEach((i) => {\n    if (objects.indexOf(i.id) < 0) {\n      objects.push(i.id);\n      if(i.type != 'url' && i.type != 'page'){object_items.push(i);}\n    }\n  })\n})\npayload = {\n  app_items,\n  object_items\n}\nreturn payload;"
      }
    }
  }

  return {
    "type": "service",
    className,
    "body": [
      {
        "type": "button",
        "actionType": "dialog",
        "className": "flex items-center",
        "body": [
          {
            "type": "tpl",
            "className": "flex items-center",
            "tpl": `<div aria-haspopup='true' title='${i18next.t('frontend_open_app_launcher')}' class='slds-icon-waffle_container slds-context-bar__button' type='button'><span class='slds-icon-waffle'><span class='slds-r1'></span><span class='slds-r2'></span><span class='slds-r3'></span><span class='slds-r4'></span><span class='slds-r5'></span><span class='slds-r6'></span><span class='slds-r7'></span><span class='slds-r8'></span><span class='slds-r9'></span></span></div>`,
            "badge": {
              "visibleOn": "${ss:keyvalues.badge.value.workflow | toInt}",
              "offset": [3, -3],
              "style": {
                "width": "8px",
                "height": "8px"
              }
            },
            "hiddenOn": `${!showAppIcon}`
          },
          {
            type: 'tpl',
            className: `text-xl ml-4 mr-4 text-black nowrap ${appNameClassName} `,
            tpl: '${app.name}',
            hiddenOn: `${!!app || !!!showAppName}`
          },
          ...customElements
        ],
        "dialog": {
          "size": "xl",
          "title": {
            "type": "tpl",
            "tpl": i18next.t('frontend_application_launcher'),
            "className": "block text-xl text-center"
          },
          "actions": [
          ],
          "body": [
            dialogSchema
          ]
        },
        "id": "u:b5dc095e1c11"
      }
    ],
    "id": "u:06ee48db134a",
    "messages": {
    },
    "onEvent": {
      "@data.changed.steedos_keyvalues": {
        "actions": [
          {
            "actionType": "reload"
          }
        ]
      }
    }
  }

}
