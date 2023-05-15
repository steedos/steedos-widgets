export const sortListview = ()=>{
  
    return {
        "type": "button",
        "label": "默认排序规则",
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": "弹框标题",
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
                      "className": "",
                      "id": "u:061f158b4c5a",
                      "mode": "edit",
                      "fields": [
                        "sort",
                        "sort.$.field_name",
                        "sort.$.order"
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
                      },
                      "fieldsExtend": "{\n  \"sort\": {\n    \"amis\": {\n      \"type\": \"tabs-transfer\",\n      \"sortable\": true,\n      \"searchable\": true,\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/sortFields/options\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  }\n}",
                      "initApiAdaptor": "let sort;\nif (recordId) {\n  sort = payload.data.sort;\n  //数据格式转换\n  if (sort instanceof Array) {\n    sort = lodash.map(sort, (item) => {\n      return item.field_name + ':' + (item.order || 'asc')\n    });\n  }\n}\npayload.data.sort = sort;\ndelete payload.extensions;",
                      "apiRequestAdaptor": "const recordId = api.body.recordId;\n//数据格式转换\nif (typeof formData.sort == 'string') {\n  formData.sort = formData.sort?.split(',');\n}\nformData.sort = lodash.map(formData.sort, (item) => {\n  const arr = item.split(':');\n  return { field_name: arr[0], order: arr[1] };\n});\nif (recordId) {\n  query = 'mutation{record: ' + objectName + '__update(id: \"' + recordId + '\", doc: {__saveData}){_id}}';\n}\n__saveData = JSON.stringify(JSON.stringify(formData));\napi.data = { query: query.replace('{__saveData}', __saveData) };\n"
                    }
                  ],
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "id": "u:d3f6947b6acf",
                  "size": "lg"
                },
                "actionType": "dialog"
              }
            ]
          }
        }
    }
}