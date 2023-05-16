export const getNewListviewButtonSchema = ()=>{
    return {
        "type": "button",
        "label": "新建",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": "新建 列表视图",
                  "data": {
                    "&": "$$",
                    "all": "${uiSchema.list_views.all}",
                    "list_view": "${uiSchema.list_views[listName]}",
                    "appId": "${appId}",
                    "global": "${global}",
                    "targetObjectName": "${objectName}",
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
                        "label":"",
                        "filters":"",
                        "shared":false
                      },
                      "fieldsExtend": fieldsExtend(),
                      "fields": fields(),
                      "onEvent": {
                        "submitSucc": {
                          "weight": 0,
                          "actions": [
                            {
                              "args": {
                                // 直接使用recordId不能拿到数据，只能通过result里面拿数据
                                "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/listview_${result.data.recordId|lowerCase}",
                                "blank": false
                              },
                              "actionType": "url",
                            }
                          ]
                        }
                      },
                      "messages": {
                        "success": "成功",
                        "failed": "失败"
                      },
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

function fields(){
  return [
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
  ]
}

function fieldsExtend(){
  return {
    "label": {
      "is_wide": true
    },
    "name": {
      "amis": {
        "hidden": true
      }
    },
    "object_name": {
      "amis": {
        "hidden": true
      }
    },
    "filter_scope": {
      "amis": {
        "hidden": true
      }
    },
    "columns": {
      "amis": {
        "hidden": true
      }
    },
    "filter_fields": {
      "amis": {
        "hidden": true
      }
    },
    "scrolling_mode": {
      "amis": {
        "hidden": true
      }
    },
    "sort": {
      "amis": {
        "hidden": true
      }
    },
    "show_count": {
      "amis": {
        "hidden": true
      }
    },
    "type": {
      "amis": {
        "hidden": true
      }
    },
    "shared": {
      "amis": {
        "visibleOn": "${global.user.is_space_admin}"
      }
    }
  }
}