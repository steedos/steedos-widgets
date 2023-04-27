/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-26 11:52:04
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

        const _master = api.body._master;
        if(_master && _master._isRelated){
            const relatedKey = _master.relatedKey;
            const masterObjectName = _master.objectName;
            const recordId = _master.recordId;
            let relatedKeySaveValue = recordId;
            const fields = ${JSON.stringify(uiSchema.fields)};
            const relatedField = fields[relatedKey];
            if(relatedField.reference_to_field && relatedField.reference_to_field !== '_id'){
                relatedKeySaveValue = _master.record[relatedField.reference_to_field];
            }
            let defaultData = {}; 
            let relatedKeyValue; 
            if(!_.isString(relatedField.reference_to)){
                relatedKeyValue = { o: masterObjectName, ids: [relatedKeySaveValue] };
            }else if (relatedField.multiple) {
                relatedKeyValue = [relatedKeySaveValue];
            } else {
                relatedKeyValue = relatedKeySaveValue;
            }
            defaultData[relatedKey]=relatedKeyValue;
            if(payload.schema){
                // 表单微页面第一层要求是page
                formSchema.data.defaultData = defaultData;
            }else{
                formSchema.defaultData = defaultData;
            }
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
                                        "_master": "${_master}",
                                        "_master._isRelated": "${_isRelated}",
                                        "_master.relatedKey": "${relatedKey}",
                                        "appId": "${appId}",
                                        "objectName": "${objectName}",
                                        "context": "${context}",
                                        "global": "${global}",
                                        "listViewId": "${listViewId}",
                                        "displayAs": "${displayAs}",
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
                                                    "isLookup": "${isLookup}",
                                                    "_master": "${_master}",
                                                    "url": "${context.rootUrl}/api/pageSchema/form?app=${appId}&objectApiName=${objectName}&formFactor=${formFactor}"
                                                },
                                                "url": "${context.rootUrl}/api/pageSchema/form?app=${appId}&objectApiName=${objectName}&formFactor=${formFactor}",
                                                "method": "get",
                                                "messages": {
                                                },
                                                "headers": {
                                                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                                },
                                                "requestAdaptor": "return { ...api, url: api.body.url }",
                                                "adaptor": schemaApiAdaptor
                                            }
                                        }
                                    ],
                                    "showCloseButton": true,
                                    "id": "u:e11347411d2d",
                                    "closeOnEsc": false,
                                    "closeOnOutside": false,
                                    "size": "lg",
                                    "actions": [
                                        {
                                            type: 'button',
                                            actionType: 'cancel',
                                            label: "取消"
                                        },
                                        {
                                            type: 'button',
                                            label: "保存并新建",
                                            actionType: 'confirm',
                                            close: false,
                                            id: "confirmAndNew"
                                        },
                                        {
                                            type: 'button',
                                            actionType: 'confirm',
                                            label: "保存",
                                            primary: true
                                        },
                                    ]
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