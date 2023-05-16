export const copyListview = ()=>{
  
    return {
        "type": "button",
        "label": "复制",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": "复制 列表视图",
                  "data": {
                    "&": "$$",
                    "listName": "${listName}",
                    "targetObjectName": "${objectName}",
                    "list_view": "${uiSchema.list_views[listName]}",
                    "appId": "${appId}",
                    "global": "${global}"
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "",
                      "mode": "edit",
                      "defaultData": {
                        "&": "${list_view}",
                        "name":"",
                        "label": "${list_view.label}的副本",
                        "shared":false
                      },
                      "fieldsExtend": "{\n  \"label\": {\n    \"is_wide\": true\n  },\n  \"name\": {\n    \"is_wide\": true,\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"object_name\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_scope\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"columns\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_fields\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"scrolling_mode\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"sort\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"show_count\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"type\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"shared\":{\n    \"amis\":{\n      \"visibleOn\":\"${global.user.is_space_admin}\"\n  }\n}\n}",
                      "fields": [
                        "label",
                        "name",
                        "object_name",
                        "filter_scope",
                        "show_count",
                        "columns.$.field",
                        "columns.$.width",
                        "sort.$.field_name",
                        "sort.$.order",
                        "filters",
                        "mobile_columns.$.field",
                        "searchable_fields.$.field",
                        "is_system",
                        "shared"
                      ],
                      "onEvent": {
                        "submitSucc": {
                          "weight": 0,
                          "actions": [
                            {
                              "args": {
                                "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/listview_${result.data.recordId|lowerCase}",
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