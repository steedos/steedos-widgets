/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-08 16:39:48
 * @Description: 
 */

import { getPage } from '../lib/page'

export const getSchema = async (uiSchema, ctx)=>{
    const title = "新建 " + uiSchema.label;
    const defaultFormSchema = {
        "type": "steedos-object-form",
        "label": "对象表单",
        "objectApiName": "${objectName}",
        "recordId": "",
        "id": "u:f8ad8ddf153a",
        "mode": "edit",
        "layout": "horizontal"
    };

    let formSchema = defaultFormSchema;
    const page = await getPage({type: 'form', appId: ctx.appId, objectName: ctx.objectName, formFactor: ctx.formFactor});

    if(page){
        formSchema = _.isString(page.schema) ? JSON.parse(page.schema) : page.schema;
    }

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
                                    "data": {
                                        "$master": "$$",
                                        "&": "${defaultData}",
                                        "objectName": "${objectName}",
                                        "context": "${context}"
                                    },
                                    "title": title,
                                    "bodyClassName": "",
                                    "body": [
                                        formSchema
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
        "className": "p-0",
        "id": "u:aef99d937b10"
    }
}