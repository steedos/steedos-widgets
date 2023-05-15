export const filtersListview = ()=>{
  
    return {
        "type": "button",
        "label": "过滤设置",
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": "过滤设置",
                  "data": {
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
                      "fields": [
                        "filters"
                      ],
                      "initApiRequestAdaptor": "",
                      "initApiAdaptor": "const recordId_tmp = api.body.recordId;\nlet data_tmp;\nif (recordId_tmp) {\n  data_tmp = payload.data;\n  // 数据格式转换\n  if (data_tmp) {\n    if (data_tmp.filters && lodash.isString(data_tmp.filters)) {\n      try {\n        data_tmp.filters = JSON.parse(data_tmp.filters);\n      } catch (e) { }\n    }\n\n    if (data_tmp.filters && lodash.isString(data_tmp.filters)) {\n      data_tmp._filters_type_controller = 'function';\n    } else {\n      data_tmp._filters_type_controller = 'conditions'\n    }\n\n    if (data_tmp._filters_type_controller === 'conditions') {\n      data_tmp._filters_conditions = window.amisConvert.filtersToConditions(data_tmp.filters || []);\n      data_tmp.filters = data_tmp._filters_conditions;\n    } else {\n      data_tmp._filters_function = data_tmp.filters;\n    }\n  }\n}\nfor (key in data_tmp) {\n  if (data_tmp[key] === null) {\n    delete data_tmp[key];\n  }\n}\npayload.data = Object.assign(payload.data, data_tmp);\ndelete payload.extensions;",
                      "apiRequestAdaptor": "const recordId = api.body.recordId;\nif (formData._filters_type_controller === 'conditions' && formData._filters_conditions) {\n  formData.filters = window.amisConvert.conditionsToFilters(formData.filters);\n} else {\n  formData.filters = formData._filters_function || null;\n}\n\ndelete formData._filters_type_controller;\ndelete formData._filters_conditions;\ndelete formData._filters_function;\n// 字符串拼接（不支持ES6``语法）\nquery = 'mutation{record: ' + objectName + '__insert(doc: {__saveData}){_id}}';\nif (api.body.recordId) {\n  query = 'mutation{record: ' + objectName + '__update(id: \"' + recordId + '\", doc: {__saveData}){_id}}';\n};\n__saveData = JSON.stringify(JSON.stringify(formData));\napi.data = { query: query.replace('{__saveData}', __saveData) };\n",
                      "fieldsExtend": "{\"filters\": {\n    \"visible_on\": \"true\",\n   \"amis\": {\n      \"type\": \"condition-builder\",\n      \"label\": \"条件组件\",\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectName}\",\n        \"dataType\": \"json\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  }\n}",
                      "onEvent": {
                        "submitSucc": {
                          "weight": 0,
                          "actions": [
                            {
                              "args": {
                                "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${listName}",
                                "blank": false
                              },
                              "actionType": "url",
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "closeOnEsc": false,
                  "dataMapSwitch": false,
                  "size": "lg"
                },
                "actionType": "dialog"
              }
            ]
          }
        }
    }
}