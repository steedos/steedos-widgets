import { i18next } from "../i18n";

export const getSchema = async (uiSchema, ctx) => {
  const requestAdaptor = function () {
    let uiSchema = api.body.uiSchema;
    let list_views_name = api.body.listName;
    let list_views = uiSchema.list_views;
    const listViewPropsStoreKey = location.pathname + "/crud/query";
    const query = JSON.parse(sessionStorage.getItem(listViewPropsStoreKey));
    const { filters, sort, fields: select } = query;
    let filename = uiSchema.label + "-" + list_views[list_views_name].label;

    var url_tmp = api.url.split('?')[0];
    api.url = url_tmp + "?$select=" + encodeURIComponent(select.toString()) + "&filename=" + encodeURIComponent(filename);
    // 判断sort 和 filters
    if (sort.length > 0) {
      api.url += "&$orderby=" + encodeURIComponent(sort);
    }
    if (filters && filters.length > 0) {
      api.url = api.url + "&filters=" + encodeURIComponent(JSON.stringify(filters));
    }
    return api;
  }
  return {
    "type": "service",
    "body": [
      {
        "type": "button",
        "label": i18next.t('frontend_export_excel'),
        "id": "u:standard_export_excel",
        "level": "default",
        "disabledTip": i18next.t('frontend_export_excel_toast'),
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [{
              "componentId": "u:standard_export_excel",
              "actionType": "disabled"
            },
              {
                "args": {
                  "api": {
                    "url": "${context.rootUrl}/api/record/export/${objectName}",
                    "method": "get",
                    "messages": {},
                    "requestAdaptor": requestAdaptor.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1],
                    "data": {
                      "uiSchema": "${uiSchema}",
                      "listName": "${listName}"
                    },
                    "headers": {
                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    }
                  }
                },
                "actionType": "download"
              },
              {
                "componentId": "u:standard_export_excel",
                "actionType": "enabled"
              }
            ]
          }
        }
      }
    ]
  }
}