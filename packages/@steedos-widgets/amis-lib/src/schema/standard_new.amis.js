/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-12 18:15:27
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
    // console.log(`standard_new getSchema`, uiSchema, ctx)
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
                                        "appId": "${appId}",
                                        "objectName": "${objectName}",
                                        "context": "${context}",
                                        "global": "${global}",
                                        "listViewId": "${listViewId}"
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
        "className": "p-0 border-0",
        "id": "u:aef99d937b10"
    }
}