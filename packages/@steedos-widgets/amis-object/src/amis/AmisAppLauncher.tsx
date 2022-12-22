/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 11:18:39
 * @Description: 
 */

export const AmisAppLauncher = async (props) => {
    let { appId, data, className, showAppName, appNameClassName = '' } = props;
    if(!appId){
        appId = data.context.appId || 'admin';
    }
    // console.log(`AmisAppLauncher`, props);
    
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
                      className: `text-xl ml-4 mr-4 ${appNameClassName} `,
                      tpl: '${name}',
                      hiddenOn: `${!!!showAppName}`
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
                                    "type": "tpl",
                                    "tpl": "<a class='slds-app-launcher__tile slds-text-link_reset ' role='button' tabindex='0' href='${path}'><div class='slds-app-launcher__tile-figure'><span class='slds-icon_container slds-icon-standard-${REPLACE(icon, '_', '-')}'><img class='w-12 h-12 slds-icon slds-icon_container slds-icon-standard-${icon}' src='${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg'><span class='slds-assistive-text'>${name}</span></span></div><div class='slds-app-launcher__tile-body'><span class='slds-link text-blue-600 text-lg'><span title='${name}'>${name}</span></span><div style='display: -webkit-box; -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;'><span title='${description}'>${description}</span></div></div></a>",
                                    "inline": true,
                                    "style": {
                                    },
                                    "className": "slds-p-horizontal_small slds-size_1-of-1 slds-medium-size_1-of-3"
                                  },
                                  "id": "u:a0f163ed207f",
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
                                  "type": "html",
                                  "html": "<ul class='slds-grid slds-wrap'>${object_items_dom|raw}</ul>",
                                  "className": "dec"
                                }
                              ],
                              "id": "u:a88a225c8832",
                              "className": ""
                            }
                          ],
                          "id": "u:cb1c62622fd6"
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
                        "url": "${context.rootUrl}/service/api/apps/menus",
                        "data": null,
                        "headers": {
                          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                        },
                        "adaptor": "\nlet app_items = payload;\nlet object_items = [];\nlet objects = [];\napp_items.forEach((item) => {\n  item.children.forEach((i) => {\n    if (objects.indexOf(i.id) < 0) {\n      objects.push(i.id);\n      object_items.push(i)\n    }\n  })\n})\nlet object_items_dom = '';\nobject_items.forEach((item) => {\n\n  object_items_dom = object_items_dom +\n    `<li class=\"slds-col--padded slds-p-vertical_xx-small slds-size_1-of-5 slds-grow-none oneAppLauncherItem\">\n      <a data-object-name=\"${item.id}\" href=\"${item.path}\" class=\"app-launcher-link slds-text-link--reset slds-app-launcher__tile--small slds-truncate creator-object-nav-${item.id}\">\n        <span class=\"slds-truncate slds-text-link\">${item.name}</span>\n      </a>\n    </li>`\n})\npayload.data = {\n  app_items,\n  object_items_dom\n}\nreturn payload;"
                      }
                    }
                  ]
                },
                "id": "u:b5dc095e1c11"
            }
        ],
        api: {
          "method": "get",
          "url": `\${context.rootUrl}/service/api/apps/${appId}/menus`,
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          sendOn: `${!!showAppName}`
        }
    }
}