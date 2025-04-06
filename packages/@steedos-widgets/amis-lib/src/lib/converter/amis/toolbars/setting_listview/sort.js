import { i18next } from "../../../../../i18n"
export const getSetListviewSortButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_sort'),
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "dialog": {
                  "type": "dialog",
                  "title": i18next.t('frontend_listview_control_sort'),
                  "data": {
                    //"&":"$$",2.7、2.9、3.0在此处失效
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
                              "actionType": "custom",
                              "script": "window.location.reload(); //doAction({'actionType': 'rebuild', 'componentId': `service_listview_${event.data.targetObjectName}`})"
                            }
                          ]
                        }
                      },
                      "fieldsExtend": fieldsExtend(),
                      "initApiAdaptor": initApiAdaptor(),
                      "apiRequestAdaptor": apiRequestAdaptor()
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

function fieldsExtend(){
  return {
    "sort": {
      "label": "",
      "group": "",
      "amis": {
        "type": "tabs-transfer",
        "sortable": true,
        "searchable": true,
        "source": {
          "method": "get",
          "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${targetObjectName}/sortFields/options",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          }
        }
      }
    }
  }
}

function initApiAdaptor(){
  return `
    let sort;
    if (recordId) {
      sort = payload.data.sort;
      //数据格式转换
      if (sort instanceof Array) {
        sort = lodash.map(sort, (item) => {
          return item.field_name + ':' + (item.order || 'asc')
        });
      }
    }
    payload.data.sort = sort;
    delete payload.extensions;
    return payload;
  `
}

function apiRequestAdaptor(){
  return `
    const recordId = api.body.recordId;
    //数据格式转换
    if (typeof formData.sort == 'string') {
      formData.sort = formData.sort && formData.sort.split(',');
    }
    formData.sort = lodash.map(formData.sort, (item) => {
      const arr = item.split(':');
      return { field_name: arr[0], order: arr[1] };
    });
    if (recordId) {
      query = 'mutation{record: ' + objectName + '__update(id: "' + recordId + '", doc: {__saveData}){_id}}';
    }
    __saveData = JSON.stringify(JSON.stringify(formData));
    api.data = { query: query.replace('{__saveData}', __saveData) };
    return api;
  `
}