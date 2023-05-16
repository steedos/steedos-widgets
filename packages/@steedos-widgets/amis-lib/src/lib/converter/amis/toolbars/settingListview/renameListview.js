export const renameListview = ()=>{
    return {
        "type": "button",
        "label": "重命名",
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": "重命名 列表视图",
                  "data": {
                    "targetObjectName": "${objectName}",
                    "recordId": "${uiSchema.list_views[listName]._id}",
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
                        "label"
                      ],
                      "fieldsExtend": "{\n  \"label\":{\n    \"is_wide\": true\n  }\n}",
                      "onEvent": {
                        "submitSucc": {
                          "weight": 0,
                          "actions": [
                            {
                              "args": {
                                "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${name}",
                                "blank": false
                              },
                              "actionType": "url",
                            },
                          ]
                        }
                      }
                    }
                  ],
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