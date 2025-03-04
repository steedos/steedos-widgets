/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 11:25:39
 * @Description: 
 */

import { i18next } from '@steedos-widgets/amis-lib';

export const AmisAppLauncher = async (props) => {
  console.log(`AmisAppLauncher`, props)
  let { app, data, className, showAppName = true, appNameClassName = '', customElements = [], showAppIcon = true } = props;
  if (!app) {
    app = data.context.app;
  }

  let isSpaceAdmin = false;

  if(data.context.user && data.context.user.is_space_admin){
    isSpaceAdmin = true;
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
  `;
  const mobile_blank_script = `
    if(event.data.path[0] == "/"){
      Steedos.openWindow(event.data.context.rootUrl + event.data.path)
    }else{
      Steedos.openWindow(event.data.path)
    }
  `;

  const convertAppVisibleOnScript = `
    var currentAmis = amisRequire('amis');
    app_items.forEach((item) => {
      let visible_on = item.visible_on && item.visible_on.trim();
      if(visible_on){
        // amis visibleOn属性中的表达式来自作用域中变量时,amis不认,所以这里把公式表达式提前运行下
        try{
          visible_on = currentAmis.evaluate(visible_on, BuilderAmisObject.AmisLib.createObject(context, item));
          item.visible_on = visible_on;
        }
        catch(ex){
          console.error("运行应用“" + item.name + "”的显示公式表达式时出现错误:",ex);
          item.visible_on = false;
        }
      }
      else{
        item.visible_on = true;
      }
    });
  `;

  const pcInitApiAdaptorScript = `
    let app_items = payload;
    let object_items = [];
    let objects = [];
    app_items.forEach((item) => {
      item.children.forEach((i) => {
        if (objects.indexOf(i.id) < 0) {
          objects.push(i.id);
          if(i.type != 'url' && i.type != 'page'){object_items.push(i);}
        }
      })
    })
    ${convertAppVisibleOnScript}
    payload = {
      app_items,
      object_items
    }
    return payload;
  `;
  const mobileInitApiAdaptorScript = `
    let app_items = payload;
    ${convertAppVisibleOnScript}
    payload = {
      app_items
    }
    return payload;
  `;

  let dialogSchema = {}
  const badgeText = "${IF(${id} == 'approve_workflow',${ss:keyvalues.badge.value|pick:'workflow'},${ss:keyvalues.badge.value|pick:${id}}) | toInt}";
  if(!isMobile){
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
                  "items": [{
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
                    "visibleOn": "${visible_on}",
                    "className": "slds-p-horizontal_small slds-size_1-of-1 slds-medium-size_1-of-3"
                  }],
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
        "cache": "10000",
        "url": "${context.rootUrl}/service/api/apps/menus?mobile=" + isMobile,
        "data": null,
        "headers": {
          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "adaptor": pcInitApiAdaptorScript
      }
    }
  }
  const overlaySchema = {
    "type": "service",
    "className": isMobile ? "steedos-apps-service" : "steedos-apps-service w-96",
    "affixFooter": false,
    "body": [
      {
        "type": "each",
        "source": isMobile ? "${app_items}" : "${ARRAYFILTER(app_items, (item,index) => index<=8)}",
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
          "visibleOn": "${visible_on}",
          "className": "block w-1/3 py-4 hover:bg-[#1589EE1A]",
          "style": {
            "display": "inline-flex",
            "justify-content": "center"
          }
        },
        "className": "flex flex-wrap",
        "id": "u:a98e9f6fb4db"
      },
      isMobile ? null : {
        "type": "divider",
        "className": "m-0"
      },
      isMobile ? null : {
        "type": "button",
        "level": "link",
        "label": "更多",
        "className": "w-full h-10",
        "actionType": "dialog",
        "visibleOn": "${app_items.length > 9}",
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
        }
      },
      isMobile || !isSpaceAdmin ? null : {
        "type": "button",
        "level": "link",
        "label": "+ 新建应用",
        "className": "w-full h-10",
        "actionType": "dialog",
        "dialog": {
          "title": "新建应用",
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
          "body": [
            {
              "type": "form",
              "api": {
                  "url": "/service/api/apps/create_by_design",
                  "method": "post",
                  "requestAdaptor": "api.data={code: context.code, name: context.name, icon: context.icon}; return api;",
                  "adaptor": "window.location.href=Steedos.getRelativeUrl('/app/' + payload.code);return {}",
                  "messages": {}
              },
              "body": [
                {
                  "type": "input-text",
                  "name": "code",
                  "label": "应用唯一标识",
                  "value": "a_\${UUID(6)}",
                  "required": true,
                  "validateOnChange": true,
                  "validations": {
                      "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                  }
                },
                {
                  "name": "name",
                  "type": "input-text",
                  "label": "显示名称",
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
              ]
            }
          ]
        }
      }
    ],
    "clearValueOnHidden": false,
    "visible": true,
    "messages": {
    },
    "api": {
      "method": "get",
      "cache": "10000",
      "url": "${context.rootUrl}/service/api/apps/menus?mobile="+isMobile,
      "headers": {
        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
      },
      "adaptor": mobileInitApiAdaptorScript,
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

  return {
    "type": "service",
    className,
    "body": [
      isMobile ? {
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
            overlaySchema
          ]
        },
        "id": "u:b5dc095e1c11"
      } : {
        "type": "steedos-dropdown",
        "placement": "bottomRight",
        "trigger": [
          "click"
        ],
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
        "overlay": [
          overlaySchema
        ],
        "className": "flex items-center",
        "open": false
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
