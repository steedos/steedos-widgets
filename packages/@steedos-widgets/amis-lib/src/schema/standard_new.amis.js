/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-02 18:49:42
 * @Description: 
 */
export const getSchema = (uiSchema)=>{
    const title = "新建 " + uiSchema.label
    return {
        "type": "service",
        "body": [
            {
                "type": "button",
                "label": "新建",
                "id": "u:standard_new",
                "level": "default",
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "dialog",
                                "dialog": {
                                    "type": "dialog",
                                    "title": title,
                                    "bodyClassName": "",
                                    "body": [
                                        {
                                            "type": "steedos-object-form",
                                            "label": "对象表单",
                                            "objectApiName": "${objectName}",
                                            "recordId": "",
                                            "id": "u:f8ad8ddf153a",
                                            "mode": "edit",
                                            "layout": "horizontal"
                                        }
                                    ],
                                    "id": "u:0b96577db93c",
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
        "id": "u:aef99d937b10"
    }
}