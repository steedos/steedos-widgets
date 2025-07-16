/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-22 09:31:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-07 16:02:53
 */
import { i18next } from "../i18n";
export const getSchema = (uiSchema)=>{
    return {
        "type": "service",
        "className": "p-0",
        "body": [
            {
                "type": "button",
                "label": i18next.t('frontend_form_delete'),
                "confirmText": i18next.t('frontend_delete_many_confirm_text'),
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                              "args": {
                                "api": {
                                    "method": "post",
                                    "url": "${context.rootUrl}/graphql",
                                    "data": {
                                        "&": "$$",
                                        "recordId": "${recordId}",
                                        "objectName": "${objectName}"
                                    },
                                    "requestAdaptor": "const {recordId, objectName} = api.body; var deleteArray = []; deleteArray.push(`delete:${objectName}__delete(id: \"${recordId}\")`); api.data = {query: `mutation{${deleteArray.join(',')}}`}; return api;",
                                    "headers": {
                                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    },
                                    "adaptor": `
                                        if(payload.errors){
                                          payload.status = 2;
                                          payload.msg = window.t ? window.t(payload.errors[0].message) : payload.errors[0].message;
                                        }
                                        return payload;
                                    `,
                                }
                              },
                              "actionType": "ajax"
                            },
                            {
                                "actionType": "broadcast",
                                "args": {
                                  "eventName": `@data.changed.${uiSchema.name}`
                                },
                                "data": {
                                  "objectName": `${uiSchema.name}`,
                                  "__deletedRecord": true,
                                  "_inDrawer": "${_inDrawer}"
                                }
                            },
                            {
                                "actionType": "broadcast",
                                "args": {
                                  "eventName": "@data.changed.${_master.objectName}"
                                },
                                "data": {
                                  "objectName": "${_master.objectName}",
                                  "_isRelated": "${_isRelated}"
                                },
                                "expression": `\${_master.objectName != '${uiSchema.name}' && _master.objectName}`
                            },
                            // 列表视图、对象表格组件上的lookup字段，点开右侧弹出drawer窗口，删除记录后刷新列表
                            {
                                "actionType": "broadcast",
                                "args": {
                                  "eventName": "@data.changed.${_lookupObjectName}"
                                },
                                "data": {
                                  "objectName": "${_lookupObjectName}"
                                },
                                "expression": `\${_lookupObjectName != '${uiSchema.name}' && _lookupObjectName}`
                            }
                          ]
                    }
                }
            }
        ],
        "regions": [
          "body"
        ]
      }
}