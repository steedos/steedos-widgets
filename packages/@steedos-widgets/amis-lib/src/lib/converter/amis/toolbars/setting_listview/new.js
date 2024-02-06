import { i18next } from "../../../../../i18n"
export const getNewListviewButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_new_label'),
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_new_title'),
                  "data": {
                    //"&":"$$",2.7、2.9、3.0在此处失效
                    "all": "${uiSchema.list_views.all}",
                    "list_view": "${uiSchema.list_views[listName]}",
                    "appId": "${appId}",
                    "global": "${global}",
                    "targetObjectName": "${objectName}",
                    "context": "${context}"
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "",
                      "mode": "edit",
                      "layout": "normal",
                      "defaultData": {
                        "&": "${list_view}",
                        "name":"",
                        "label":"",
                        "filters":"",
                        "shared":false,
                        "object_name": "${targetObjectName}",
                        "_id":"",
                        "shared_to": null,
                        "shared_to_organizations": null,
                        "locked": false,
                        "owner": null,
                        "company_id": null,
                        "company_ids": null,
                        "is_system": false
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
                        "success": i18next.t('frontend_listview_control_new_message_success'),
                        "failed": i18next.t('frontend_listview_control_new_message_failed')
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
    "columns",
    "sort",
    "filters",
    "mobile_columns",
    "searchable_fields",
    "is_system",
    "shared",
    "shared_to",
    "shared_to_organizations"
  ]
}

function fieldsExtend(){
  return {
    "group": "",
    "label": {
      "group": "",
      "is_wide": true
    },
    "name": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "object_name": {
      "group": "",
      "amis": {
        "hidden": true
      }
    },
    "filter_scope": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "columns": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "mobile_columns":{
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "searchable_fields":{
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "filter_fields": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "scrolling_mode": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "sort": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "show_count": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "type": {
      "group": "",
      "amis": {
        "hidden": true,
        "required": false
      }
    },
    "shared": {
      "group": "",
      "amis": {
        "visibleOn": "${false}"
      }
    },
    "shared_to": {
      "group": "",
      "amis":{
        "type": "radios",
        "inline": false
      }
    },
    "shared_to_organizations": {
      "group": ""
    },
    "filters": {
      "group": "",
      "amis": {
        "hidden": true
      }
    }
  }
}