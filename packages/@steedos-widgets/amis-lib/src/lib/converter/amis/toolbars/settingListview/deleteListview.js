export const deleteListview = ()=>{
    return {
        "type": "button",
        "label": "删除",
        "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
        "confirmText": "如果您删除此列表视图，该视图将为所有具备访问权限的用户永久删除。是否确定要删除？",
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
                      "success": "删除成功"
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