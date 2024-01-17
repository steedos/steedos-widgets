/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-25 14:53:05
 * @Description: 
 */
import { i18next } from "../i18n";

export const getSchema = async (uiSchema, ctx) => {
    const schemaApiAdaptor = `
        let formSchema = {
            "type": "steedos-object-form",
            "label": "对象表单",
            "objectApiName": "\${objectName}",
            "recordId": "",
            "mode": "edit",
        };

        if (payload && payload.schema) {
            formSchema = _.isString(payload.schema) ? JSON.parse(payload.schema) : payload.schema;
        }

        const fields = ${JSON.stringify(uiSchema.fields)};
        const selectedRowResponseResult = api.body.selectedRowResponseResult;
        let defaultData = {}; 

        if(!_.isEmpty(selectedRowResponseResult)){
            const fieldsKeys = _.keys(fields);
            // 如果新建记录时复制的数据中有omit或其他不相关字段数据时不应该一起保存到数据库，
            // 原规则见：https://github.com/steedos/steedos-frontend/issues/297
            _.forEach(selectedRowResponseResult, (val, key) => {
              if (fieldsKeys.indexOf(key) > -1 && fields[key].omit !== true) {
                defaultData[key] = val;
              }
            })
        }

        const _master = api.body._master;
        if(_master && _master._isRelated){
            const relatedKey = _master.relatedKey;
            const masterObjectName = _master.objectName;
            const recordId = _master.recordId;
            let relatedKeySaveValue = recordId;
            const relatedField = fields[relatedKey];
            if(relatedField.reference_to_field && relatedField.reference_to_field !== '_id'){
                relatedKeySaveValue = _master.record[relatedField.reference_to_field];
            }
            let relatedKeyValue; 
            if(!_.isString(relatedField.reference_to)){
                relatedKeyValue = { o: masterObjectName, ids: [relatedKeySaveValue] };
            }else if (relatedField.multiple) {
                relatedKeyValue = [relatedKeySaveValue];
            } else {
                relatedKeyValue = relatedKeySaveValue;
            }
            defaultData[relatedKey]=relatedKeyValue;
        }

        if(!_.isEmpty(defaultData)){
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
    const onDialogCancelScript = `
        // 这里加setTimeout是因为amis的Bug，它会先触发cancel事件执行此脚本关闭父窗口然后再关闭子窗口
        // 正确的顺序应该是先关闭子窗口再关闭父窗口，顺序错了会造成第二次点击新建按钮的时候异常
        setTimeout(function(){
            doAction({
                "actionType": "cancel",
                "componentId": "object_actions_drawer_${uiSchema.name}"
            });
        }, 200);
    `;
    const getSelectedRowsScript = `
        const isLookup = event.data.isLookup;
        if(isLookup){
            // lookup弹出窗口的新建功能不需要支持复制新建
            return;
        }
        const uiSchema = event.data.uiSchema;
        const objectName = event.data.objectName;
        const listViewRef = event.context.scoped.getComponentById("listview_" + objectName);
        const selectedItems = listViewRef && listViewRef.props.store.toJSON().selectedItems || [];
        event.data.selectedIds = _.map(selectedItems, uiSchema.idFieldName || '_id');
    `;
    return {
        "type": "service",
        "body": [
            {
                "type": "button",
                "label": i18next.t('frontend_form_new'),
                "id": "u:standard_new",
                "level": "default",
                "onEvent": {
                    "click": {
                        "weight": 0,
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": getSelectedRowsScript
                            },
                            {
                                "actionType": "ajax",
                                "outputVar": "selectedRowResponseResult",
                                "args": {
                                    "api": {
                                        "url": "${context.rootUrl}/api/v1/${uiSchema.name}/${selectedIds|first}",
                                        "method": "get"
                                    }
                                },
                                "expression": "${selectedIds.length > 0}"
                            },
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
                                        "listName": "${listName}",
                                        "selectedRowResponseResult": "${selectedRowResponseResult}",
                                    },
                                    "title":i18next.t('frontend_form_new') + " ${uiSchema.label | raw}",
                                    "body": [
                                        {
                                            "type": "service",
                                            "id": "u:1678e148c4d2",
                                            "messages": {},
                                            "schemaApi": {
                                                "data": {
                                                    "isLookup": "${isLookup}",
                                                    "_master": "${_master}",
                                                    "url": "${context.rootUrl}/api/pageSchema/form?app=${appId}&objectApiName=${objectName}&formFactor=${formFactor}",
                                                    "selectedRowResponseResult": "${selectedRowResponseResult}"
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
                                    "onEvent": {
                                        "cancel": {
                                            "actions": [
                                                {
                                                    "actionType": "custom",
                                                    "script": onDialogCancelScript,
                                                    "expression": "${window:innerWidth < 768}",
                                                }
                                            ]
                                        }
                                    },
                                    "actions": [
                                        {
                                            type: 'button',
                                            actionType: 'cancel',
                                            label: i18next.t('frontend_form_cancel')
                                        },
                                        {
                                            type: 'button',
                                            label: i18next.t('frontend_form_save_and_new'),
                                            actionType: 'confirm',
                                            close: false,
                                            id: "confirmAndNew"
                                        },
                                        {
                                            type: 'button',
                                            actionType: 'confirm',
                                            label: i18next.t('frontend_form_save'),
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