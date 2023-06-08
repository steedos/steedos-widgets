import i18next from "../../../../../i18n"
export const getDeleteListviewButtonSchema = ()=>{
    return {
        "type": "button",
        "label": i18next.t('frontend_listview_control_delete_label'),
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "confirmText": i18next.t('frontend_listview_control_delete_confirm_text'),
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "ajax",
                "args": {
                  "api": {
                    "url": "${context.rootUrl}/graphql",
                    "method": "post",
                    "headers": {
                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "data": {
                      "&": "$$",
                      "uiSchema": "${uiSchema}",
                      "recordId": "${uiSchema.list_views[listName]._id}"
                    },
                    "messages": {
                      "success": i18next.t('frontend_listview_control_delete_message_success')
                    },
                    "requestAdaptor": requestAdaptor(),
                    "adaptor": adaptor(),
                  }
                }
              },
              {
                "actionType": "url",
                "args": {
                  "url": "${context.rootUrl}/app/${appId}/${objectName}/grid/all",
                  "blank": false
                },
                "expression": "data.delete == 1"
              }
            ]
          }
        }
    }
}


function requestAdaptor(){
  return `
    const { recordId } = api.body;
    var deleteArray = [];
    if (recordId) { deleteArray.push(\`delete:object_listviews__delete(id: "\${recordId}")\`); }
    api.data = { query: \`mutation{\${deleteArray.join(',')}}\` };
    return api;
  `
}

function adaptor(){
  return  `
    if (payload.errors) {
      payload.status = 2;
      payload.msg = payload.errors[0].message;
    }
    return payload;
  `
}