/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-07 17:00:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-24 16:44:42
 * @Description: 
 */
import { i18next } from "../i18n";

export const getSchema = (uiSchema)=>{
    return {
        "type": "service",
        "className": "p-0",
        "body": [
            {
                "type": "button",
                "label": i18next.t('frontend_form_view'),
                "className": "border-none",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "componentId": "",
                        "args": {
                          "blank": false,
                          "url": "/app/${app_id}/${objectName}/view/${_id}?side_object=${objectName}&side_listview_id=${listName}"
                        },
                        "actionType": "link"
                      }
                    ]
                  }
                },
                "id": "u:ef35c9ae1d19"
              }
        ],
        "regions": [
          "body"
        ]
      }
}