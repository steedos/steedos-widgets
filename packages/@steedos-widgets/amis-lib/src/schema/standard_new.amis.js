/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: 廖大雪 2291335922@qq.com
 * @LastEditTime: 2023-03-05 13:44:36
 * @Description: 
 */

export const getSchema = async (uiSchema, ctx) => {
    const schemaApiAdaptor = `
        let formSchema = {
            "type": "steedos-object-form",
            "label": "对象表单",
            "objectApiName": "\${objectName}",
            "recordId": "",
            "mode": "edit",
            "layout": "normal"
        };

        if (payload && payload.schema) {
            formSchema = _.isString(payload.schema) ? JSON.parse(payload.schema) : payload.schema;
        }
        return {
            data: formSchema
        };
    `;
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
                        "weight": 0,
                        "actions": [
                            {
                                "actionType": "dialog",
                                "dialog": {
                                    "type": "dialog",
                                    "data": {
                                        "$master": "$$",
                                        "defaultData": "${defaultData}",
                                        "appId": "${appId}",
                                        "objectName": "${objectName}",
                                        "context": "${context}",
                                        "global": "${global}",
                                        "listViewId": "${listViewId}",
                                        "uiSchema": "${uiSchema}",
                                        "isLookup": "${isLookup}",
                                        "listName": "${listName}"
                                    },
                                    "title": "新建 ${uiSchema.label}",
                                    "body": [
                                        {
                                            "type": "service",
                                            "id": "u:1678e148c4d2",
                                            "messages": {},
                                            "schemaApi": {
                                                "data": {
                                                    "isLookup": "${isLookup}"
                                                },
                                                "url": "${context.rootUrl}/api/pageSchema/form?app=${appId}&objectApiName=${objectName}&formFactor=${formFactor}",
                                                "method": "get",
                                                "messages": {
                                                },
                                                "requestAdaptor": "",
                                                "adaptor": schemaApiAdaptor
                                            }
                                        }
                                    ],
                                    "showCloseButton": true,
                                    "id": "u:e11347411d2d",
                                    "closeOnEsc": false,
                                    "closeOnOutside": false,
                                    "size": "lg"
                                }
                            }
                        ]
                    }
                }
            }
        ],
        "regions": [
            "body"
        ],
        "className": "p-0 border-0",
        "id": "u:aef99d937b10"
    }
}