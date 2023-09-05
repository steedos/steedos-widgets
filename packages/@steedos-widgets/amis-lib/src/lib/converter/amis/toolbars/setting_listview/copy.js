import { i18next } from "../../../../../i18n"
export const getCopyListviewButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_clone_label'),
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_clone_title'),
                  "data": {
                    //"&":"$$",2.7、2.9、3.0在此处失效
                    "listName": "${listName}",
                    "targetObjectName": "${objectName}",
                    "list_view": "${uiSchema.list_views[listName]}",
                    "appId": "${appId}",
                    "global": "${global}",
                    "context": "${context}"
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
                        "label": i18next.t('frontend_listview_control_clone_defaultData_label_start') + " ${list_view.label} " + i18next.t('frontend_listview_control_clone_defaultData_label_end'),
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
      "is_wide": true,
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