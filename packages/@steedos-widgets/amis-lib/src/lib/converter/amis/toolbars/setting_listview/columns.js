export const getSetListviewColumnsButtonSchema = ()=>{
    return {
        "type": "button",
        "label": "显示的列",
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "args": {},
                "dialog": {
                  "type": "dialog",
                  "title": "显示的列",
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
                      "mode": "edit",
                      "fieldsExtend": fieldsExtend(),
                      "initApiAdaptor": initApiAdaptor(),
                      "apiRequestAdaptor": apiRequestAdaptor(),
                      "fields": [
                        "columns",
                        "mobile_columns"
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
                      }
                    }
                  ],
                  "searchable": true,
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

function fieldsExtend(){
  return {
    "columns": {
      "amis": {
        "type": "transfer",
        "sortable": true,
        "searchable": true,
        "source": {
          "method": "get",
          "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${targetObjectName}/fields/options",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          }
        }
      }
    },
    "mobile_columns": {
      "group": "手机端",
      "amis": {
        "type": "transfer",
        "sortable": true,
        "searchable": true,
        "source": {
          "method": "get",
          "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${targetObjectName}/fields/options",
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
    const recordId_tmp = api.body.recordId;
    let columns_tmp = {}, mobile_columns_tmp = {};
    if (recordId_tmp) {
      columns_tmp = payload.data.columns;
      mobile_columns_tmp = payload.data.mobile_columns;
      if (columns_tmp) {
        columns_tmp = lodash.map(columns_tmp, 'field');
      }
      if (mobile_columns_tmp) {
        mobile_columns_tmp = lodash.map(mobile_columns_tmp, 'field');
      }
    }
    payload.data.columns = columns_tmp;
    payload.data.mobile_columns = mobile_columns_tmp;
    
    delete payload.extensions;
    return payload;
  `
}

function apiRequestAdaptor(){
  return `
    const formData_tmp = api.body.$;
    const objectName_tmp = api.body.objectName;
    const recordId_tmp = api.body.recordId;
    
    if (typeof formData_tmp.columns == 'string') {
      formData_tmp.columns = formData_tmp.columns?.split(',');
    }
    if (typeof formData_tmp.mobile_columns == 'string') {
      formData_tmp.mobile_columns = formData_tmp.mobile_columns?.split(',');
    }
    
    // 数据格式转换
    formData_tmp.columns = lodash.map(formData_tmp.columns, (item) => {
      return { field: item };
    });
    formData.mobile_columns = lodash.map(formData.mobile_columns, (item) => {
      return { field: item };
    });
    
    let query_tmp = 'mutation{record: ' + objectName_tmp + '__insert(doc: {__saveData}){_id}}';
    if (api.body.recordId) {
      query_tmp = 'mutation{record: ' + objectName_tmp + '__update(id: "' + recordId_tmp +'", doc: {__saveData}){_id}}';
    };
    delete formData_tmp._id;
    let __saveData_tmp = JSON.stringify(JSON.stringify(formData_tmp));
    api.data = { query: query_tmp.replace('{__saveData}', __saveData_tmp) };
    
    return api;
  `
}