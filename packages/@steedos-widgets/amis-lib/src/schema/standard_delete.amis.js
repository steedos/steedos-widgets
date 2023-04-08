/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-22 09:31:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-06 16:04:20
 */
export const getSchema = (uiSchema)=>{
    return {
        "type": "service",
        "className": "p-0",
        "body": [
            {
                "type": "button",
                "label": "删除",
                "confirmText": "确定要删除此项目?",
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
                                  "__deletedRecord": true
                                }
                            },
                            {
                                "actionType": "broadcast",
                                "args": {
                                  "eventName": "@data.changed.${_master.objectName}"
                                },
                                "data": {
                                  "objectName": "${_master.objectName}"
                                },
                                "expression": `\${_master.objectName != '${uiSchema.name}' && _master.objectName}`
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