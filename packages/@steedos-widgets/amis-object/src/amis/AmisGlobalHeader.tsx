




  /*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-15 11:21:12
 * @Description: 
 */

export const AmisGlobalHeader = async (props) => {
    const { stacked = false } = props;
    return {
        "type": "wrapper",
        "id": "u:9c3d279be31a",
        "className": "steedos-global-header",
        "size": "xs",
        "body": [
          {
            "type": "button",
            "id": "u:267a7e84a89d",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "componentId": "",
                    "args": {
                      "url": "https://www.steedos.com/docs"
                    },
                    "actionType": "url"
                  }
                ]
              }
            },
            "body": [
              {
                "type": "steedos-icon",
                "category": "utility",
                "name": "help",
                "colorVariant": "default",
                "id": "u:afc3a08e8cf3",
                "className": "slds-button_icon slds-global-header__icon"
              }
            ],
            "label": "帮助"
          },
          {
            "type": "button",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "componentId": "",
                    "args": {
                      "url": "/app/admin"
                    },
                    "actionType": "url"
                  }
                ]
              }
            },
            "id": "u:b5d0ab3a32b5",
            "body": [
              {
                "type": "steedos-icon",
                "category": "utility",
                "name": "setup",
                "colorVariant": "default",
                "id": "u:793a86f8a9e4",
                "className": "slds-button_icon slds-global-header__icon"
              }
            ],
            "label": "设置"
          },
          {
            "type": "steedos-dropdown",
            "placement": "bottomRight",
            "trigger": [
              "click"
            ],
            "body": [
              {
                "type": "steedos-icon",
                "category": "utility",
                "name": "notification",
                "colorVariant": "default",
                "id": "u:00e16db9edeb",
                "className": "slds-button_icon slds-global-header__icon"
              }
            ],
            "overlay": [
              {
                "type": "steedos-object-table",
                "label": "对象表格",
                "objectApiName": "notifications",
                "className": "bg-white",
                "columns": [
                  {
                    "field": "name"
                  }
                ],
                "id": "u:3585d3f4958a"
              }
            ],
            "id": "u:857e8161c96b",
            "className": "antd-Action",
            "open": false
          },
          {
            "type": "steedos-dropdown",
            "placement": "bottomRight",
            "trigger": [
              "click"
            ],
            "body": [
              {
                "type": "avatar",
                "icon": "fa fa-user",
                "id": "u:033218742221",
                size: 30
              }
            ],
            "overlay": [
              {
                "type": "wrapper",
                "className": "bg-white",
                "body": [
                  {
                    "type": "avatar",
                    "icon": "fa fa-user",
                    "id": "u:c1956f5ad96a"
                  },
                  {
                    "type": "tpl",
                    "tpl": "${context.user.name}",
                    "inline": true,
                    "wrapperComponent": "",
                    "id": "u:325e582aac06"
                  },
                  {
                    "type": "tpl",
                    "tpl": "${context.user.email}",
                    "inline": true,
                    "wrapperComponent": "",
                    "id": "u:eac1db95ebb9"
                  },
                  {
                    "type": "button",
                    "label": "个人资料",
                    "onEvent": {
                      "click": {
                        "actions": [
                        ]
                      }
                    },
                    "id": "u:1e6c26ff8721",
                    "block": true,
                    "level": "link"
                  },
                  {
                    "type": "button",
                    "label": "注销",
                    "onEvent": {
                      "click": {
                        "actions": [
                        ]
                      }
                    },
                    "id": "u:0ab9ad5a8503",
                    "block": true,
                    "level": "link"
                  }
                ],
                "id": "u:b90fbd8773aa"
              }
            ],
            "id": "u:7a8bead68a8c",
            "className": "antd-Action"
          }
        ]
      }
    
}