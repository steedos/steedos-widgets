export const showListview = ()=>{
  
    return {
        "type": "button",
        "label": "显示的列",
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "args": {},
                "dialog": {
                  "type": "dialog",
                  "title": "显示的列",
                  "data": {
                    "&": "$$",
                    "targetObjectName": "${objectName}",
                    "objectName": "${objectName}",
                    "recordId": "${uiSchema.list_views[listName]._id}",
                    "listName": "${listName}",
                    "appId": "${appId}"
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "${recordId}",
                      "mode": "edit",
                      "fieldsExtend": "{\n  \"columns\": {\n    \"amis\": {\n      \"type\": \"transfer\",\n      \"sortable\": true,\n      \"searchable\": true,\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  },\n  \"mobile_columns\": {\n    \"group\": \"手机端\",\n    \"amis\": {\n      \"type\": \"transfer\",\n      \"sortable\": true,\n      \"searchable\": true,\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  }\n}",
                      "initApiAdaptor": "const recordId_tmp = api.body.recordId;\nlet columns_tmp = {}, mobile_columns_tmp = {};\nif (recordId_tmp) {\n  columns_tmp = payload.data.columns;\n  mobile_columns_tmp = payload.data.mobile_columns;\n  if (columns_tmp) {\n    columns_tmp = lodash.map(columns_tmp, 'field');\n  }\n  if (mobile_columns_tmp) {\n    mobile_columns_tmp = lodash.map(mobile_columns_tmp, 'field');\n  }\n}\npayload.data.columns = columns_tmp;\npayload.data.mobile_columns = mobile_columns_tmp;\n\ndelete payload.extensions;\nreturn payload;",
                      "apiRequestAdaptor": "const formData_tmp = api.body.$;\nconst objectName_tmp = api.body.objectName;\nconst recordId_tmp = api.body.recordId;\n\nif (typeof formData_tmp.columns == 'string') {\n  formData_tmp.columns = formData_tmp.columns?.split(',');\n}\nif (typeof formData_tmp.mobile_columns == 'string') {\n  formData_tmp.mobile_columns = formData_tmp.mobile_columns?.split(',');\n}\n\n// 数据格式转换\nformData_tmp.columns = lodash.map(formData_tmp.columns, (item) => {\n  return { field: item };\n});\nformData.mobile_columns = lodash.map(formData.mobile_columns, (item) => {\n  return { field: item };\n});\n\n// 字符串拼接（不支持ES6语法）\nlet query_tmp = 'mutation{record: ' + objectName_tmp + '__insert(doc: {__saveData}){_id}}';\nif (api.body.recordId) {\n  query_tmp = 'mutation{record: ' + objectName_tmp + '__update(id: \"' + recordId_tmp +'\", doc: {__saveData}){_id}}';\n};\ndelete formData_tmp._id;\nlet __saveData_tmp = JSON.stringify(JSON.stringify(formData_tmp));\napi.data = { query: query_tmp.replace('{__saveData}', __saveData_tmp) };\n\nreturn api;",
                      "fields": [
                        "columns",
                        "mobile_columns"
                      ],
                      "onEvent": {
                        "submitSucc": {
                          "weight": 0,
                          "actions": [
                            {
                              "args": {
                                "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${listName}",
                                "blank": false
                              },
                              "actionType": "url"
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "searchable": true,
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "size": "lg"
                },
                "actionType": "dialog"
              }
            ]
          }
        }
    }
}