/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-06-13 13:51:19
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-02-05 11:25:09
 */
import { i18next } from "../../../../../i18n"
export const getRenameListviewButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_rename_label'),
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_rename_title'),
                  "data": {
                    "targetObjectName": "${objectName}",
                    "recordId": "${uiSchema.list_views[listName]._id}",
                    "appId": "${appId}",
                    "context": "${context}"
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "${recordId}",
                      "layout": "normal",
                      "mode": "edit",
                      "fields": [
                        "label"
                      ],
                      "fieldsExtend": "{\n  \"label\":{\n    \"is_wide\": true\n  }\n}",
                      "onEvent": {
                        "submitSucc": {
                          "weight": 0,
                          "actions": [
                            {
                              "args": {
                                "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${name}",
                                "blank": false
                              },
                              "actionType": "url",
                            },
                            {
                              "actionType": "custom",
                              "script": "window.location.reload();"
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "size": "lg"
                },
                "actionType": "dialog"
              }
            ]
          }
        }
    }
}