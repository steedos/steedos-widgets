/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-07 17:00:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-07 17:12:20
 * @Description: 
 */
export const getSchema = (uiSchema)=>{
    return {
        "type": "service",
        "bodyClassName": "p-0",
        "body": [
            {
                "type": "button",
                "label": "查看",
                "className": "border-none",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "componentId": "",
                        "args": {
                          "blank": false,
                          "url": "/app/${app_id}/${objectName}/view/${_id}"
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