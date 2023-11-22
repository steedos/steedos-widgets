import { i18next } from "../../../../../i18n"
export const getSetListviewFiltersButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_filters'),
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_filters'),
                  "data": {
                    "targetObjectName": "${objectName}",
                    "recordId": "${uiSchema.list_views[listName]._id}",
                    "listName": "${listName}",
                    "appId": "${appId}",
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
                        "filters"
                      ],
                      "initApiAdaptor": initApiAdaptor(),
                      "apiRequestAdaptor": apiRequestAdaptor(),
                      "fieldsExtend": fieldsExtend(),
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
                  "className": "steedos-overflow-visible-dialog",
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


function initApiAdaptor(){
  return `
    const recordId_tmp = api.body.recordId;
    let data_tmp;
    if (recordId_tmp) {
      data_tmp = payload.data;
      // 数据格式转换
      if (data_tmp) {
        if (data_tmp.filters && lodash.isString(data_tmp.filters)) {
          try {
            data_tmp.filters = JSON.parse(data_tmp.filters);
          } catch (e) { }
        }
    
        if (data_tmp.filters && lodash.isString(data_tmp.filters)) {
          data_tmp._filters_type_controller = 'function';
        } else {
          data_tmp._filters_type_controller = 'conditions'
        }
    
        if (data_tmp._filters_type_controller === 'conditions') {
          data_tmp._filters_conditions = window.amisConvert.filtersToConditions(data_tmp.filters || []);
          data_tmp.filters = data_tmp._filters_conditions;
        } else {
          data_tmp._filters_function = data_tmp.filters;
        }
      }
    }
    for (key in data_tmp) {
      if (data_tmp[key] === null) {
        delete data_tmp[key];
      }
    }
    payload.data = Object.assign(payload.data, data_tmp);
    delete payload.extensions;
    return payload;
  `
}

function apiRequestAdaptor(){
  return `
    const recordId = api.body.recordId;
    if (formData._filters_type_controller === 'conditions' && formData._filters_conditions) {
      formData.filters = window.amisConvert.conditionsToFilters(formData.filters);
    } else {
      formData.filters = formData._filters_function || null;
    }
    
    delete formData._filters_type_controller;
    delete formData._filters_conditions;
    delete formData._filters_function;
    
    query = 'mutation{record: ' + objectName + '__insert(doc: {__saveData}){_id}}';
    if (api.body.recordId) {
      query = 'mutation{record: ' + objectName + '__update(id: "' + recordId + '", doc: {__saveData}){_id}}';
    };
    __saveData = JSON.stringify(JSON.stringify(formData));
    api.data = { query: query.replace('{__saveData}', __saveData) };
    return api;
  `
}

function fieldsExtend(){
  return {
    "filters": {
      "visible_on": "true",
      "amis": {
        "type": "condition-builder",
        "label": i18next.t('frontend_listview_control_filters_fields_extend'),
        "source": {
          "method": "get",
          "url": "${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${targetObjectName}",
          "dataType": "json",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          }
        }
      }
    }
  }
}