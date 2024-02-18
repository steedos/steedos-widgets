/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-06-13 13:51:19
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-02-06 15:38:49
 */
import { i18next } from "../../../../../i18n"
export const getSetListviewShareButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_share'),
        "disabledOn": "!(global.user.is_space_admin && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_share'),
                  "data": {
                    "recordId": "${uiSchema.list_views[listName]._id}",
                    "appId": "${appId}",
                    "global": "${global}",
                    "context": "${context}"
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "${recordId}",
                      "mode": "edit",
                      "layout": "normal",
                      "fields": [
                        "shared_to",
                        "shared_to_organizations"
                      ],
                      "fieldsExtend": fieldsExtend(),
                    }
                  ],
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "closeOnEsc": false,
                  "dataMapSwitch": false,
                  "size": "md"
                },
                "actionType": "dialog"
              }
            ]
          }
        }
    }
}

function fieldsExtend(){
  return {
    "shared_to": {
      "group": "",
      "amis":{
        "type": "radios",
        "inline": false
      }
    },
    "shared_to_organizations": {
      "group": ""
    }
  }
}