/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-07 17:00:38
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-12-13 10:09:05
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
                "label": i18next.t('frontend_form_details'),
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