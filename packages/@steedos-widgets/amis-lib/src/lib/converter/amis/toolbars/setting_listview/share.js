import { i18next } from "../../../../../i18n"
export const getSetListviewShareButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_share'),
        "disabledOn": "!(global.user.is_space_admin && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_share'),
                  "data": {
                    "recordId": "${uiSchema.list_views[listName]._id}",
                    "context": "${context}"
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "${recordId}",
                      "mode": "edit",
                      "fields": [
                        "shared"
                      ]
                    }
                  ],
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "closeOnEsc": false,
                  "dataMapSwitch": false,
                  "size": "md"
                },
                "actionType": "dialog"
              }
            ]
          }
        }
    }
}