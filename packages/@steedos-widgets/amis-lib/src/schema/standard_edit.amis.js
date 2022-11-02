/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:49:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-02 10:35:45
 * @Description: 
 */
export const getSchema = (uiSchema)=>{
  return {
    "type": "service",
    "body": [
      {
        "type": "button",
        "label": "编辑",
        "id": "u:standard_edit",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "dialog",
                "dialog": {
                  "type": "dialog",
                  "title": "编辑",
                  "bodyClassName": "p-0 m-0",
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "${objectName}",
                      "recordId": "${recordId}",
                      "id": "u:d2b0c083c38f",
                      "mode": "edit"
                    }
                  ],
                  "id": "u:ee95697baa4f",
                  "closeOnEsc": false,
                  "closeOnOutside": false,
                  "showCloseButton": true,
                  "size": "lg"
                }
              }
            ],
            "weight": 0
          }
        }
      }
    ],
    "regions": [
      "body"
    ],
    "bodyClassName": "p-0",
    "id": "u:3c5cbc0429bb"
  }
} 