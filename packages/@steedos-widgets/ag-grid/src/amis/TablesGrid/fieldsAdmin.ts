const getFormServiceApiRequestAdaptor = (tableId: string, showFormulaFields = false) => {
    const filters = [["table_id", "=", tableId]];
    if (!showFormulaFields) {
        // 不能在公式字段中引用公式字段
        filters.push(["type", "!=", "formula"]);
    }
    return `
api.url += '?filters=${JSON.stringify(filters)}&fields=["label","name","type","sort_no"]&sort=sort_no';
return api;
    `;
}

const getFormServiceApiAdaptor = () => {
    return `
var formulaVariables = [];
var fTypeTags = {
  "text": "文本",
  "textarea": "长文本",
  "number": "数字",
  "select": "单选",
  "select-multiple": "多选",
  "boolean": "勾选",
  "date": "日期",
  "datetime": "日期时间",
  "formula": "公式",
};
var getFormulaVariableTag = function (type) { 
  var tag = fTypeTags[type] || type;
  return tag;
}
if (payload.data.items && payload.data.items.length) { 
  formulaVariables = payload.data.items.map(function (n) {
    return {
      "label": n.label,
      "value": n.name,
      "tag": getFormulaVariableTag(n.type)
    }
  })
}
payload.data = {
  _b6_fields__formula_variables: formulaVariables,
  _formulaVariablesLoaded: true
}
return payload;
    `
}

/**
 * 新建和编辑字段的amis dialog第一层的service，它会抓取当前table所有字段集合用于显示公式字段的变量
 * @returns 
 */
const getFieldFormService = (form, tableId, showFormulaFields = false) => {
    const formService = {
        "type": "service",
        "body": [
            form
        ],
        "api": {
            "url": "${context.rootUrl}/api/v1/b6_fields",
            "method": "get",
            "requestAdaptor": getFormServiceApiRequestAdaptor(tableId, showFormulaFields),
            "adaptor": getFormServiceApiAdaptor(),
            "headers": {//TODO:Authorization取不到
                //   "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                "Authorization": "Bearer 654300b5074594d15147bcfa,dbe0e0da68ba2e83aca63a5058907e543a4e89f7e979963b4aa1f574f227a3b5063e149d818ff553fb4aa1"
            },
            "messages": {
            },
            "data": {
            }
        },
        "data": {
            "_formulaVariablesLoaded": false
        }
    }
    return formService;
}

/**
 * 新建和编辑字段的amis dialog
 * @param {*} tableId 
 * @param {*} mode new/edit
 * @returns 
 */
const getAgGridFieldFormDialog = (tableId: string, mode: string) => {
    const form = {
        "type": "steedos-object-form",
        "mode": "edit",
        "label": "对象表单",
        "objectApiName": "b6_fields",
        "recordId": "${editingFieldId}",
        "enableInitApi": true,
        "className": "",
        "submitSuccActions": [
            {
                "actionType": "broadcast",
                "args": {
                    "eventName": "broadcast_service_listview_b6_data_rebuild"
                }
            }
        ],
        "fieldsExtend": "{\n  \"table_id\": {\n    \"visible_on\": \"${false}\"\n  }\n}",
        "visibleOn": "${!!_formulaVariablesLoaded}"
    };
    if (mode === "new") {
        Object.assign(form, {
            "recordId": "",
            "enableInitApi": false,
            "defaultData": {
                "table_id": tableId
            }
        });
    }
    const formService = getFieldFormService(form, tableId);
    let title = "";
    if (mode === "edit") {
        title = "编辑字段";
    }
    else if (mode === "new") {
        title = "新建字段";
    }
    return {
        "type": "dialog",
        "title": title,
        "size": "lg",
        "body": formService,
        "actionType": "dialog",
        "actions": [
            {
                "type": "button",
                "actionType": "cancel",
                "label": "取消",
                "id": "u:30d4bab40dff"
            },
            {
                "type": "button",
                "actionType": "confirm",
                "label": "确定",
                "primary": true,
                "id": "u:bc50710298c1"
            }
        ],
        "showCloseButton": true,
        "closeOnOutside": false,
        "closeOnEsc": false,
        "showErrorMsg": true,
        "showLoading": true,
        "draggable": false
    }
}

export function getTableAdminEvents(tableId: string) {
    return {
        [`@b6tables.${tableId}.editField`]: {
            "actions": [
                {
                    "actionType": "dialog",
                    "dialog": getAgGridFieldFormDialog(tableId, "edit")
                }
            ]
        },
        [`@b6tables.${tableId}.newField`]: {
            "actions": [
                {
                    "actionType": "dialog",
                    "dialog": getAgGridFieldFormDialog(tableId, "new")

                }
            ]
        },
        [`@b6tables.${tableId}.deleteField`]: {
            "actions": [
                {
                    "actionType": "confirmDialog",
                    "dialog": {
                        "title": "操作确认",
                        "msg": "确定要删除此字段吗?"
                    }
                },
                {
                    "ignoreError": false,
                    "actionType": "ajax",
                    "options": {},
                    "api": {
                        "url": "${context.rootUrl}/api/v1/b6_fields/${deletingFieldId}",
                        "method": "delete",
                        "headers": {//TODO:Authorization取不到
                            //   "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                            "Authorization": "Bearer 654300b5074594d15147bcfa,dbe0e0da68ba2e83aca63a5058907e543a4e89f7e979963b4aa1f574f227a3b5063e149d818ff553fb4aa1"
                        },
                        "requestAdaptor": "",
                        "adaptor": "",
                        "messages": {
                            "success": "删除字段成功",
                            "failed": "删除字段时发生错误，请稍后重试。"
                        }
                    }
                },
                {
                    "actionType": "broadcast",
                    "args": {
                        "eventName": "broadcast_service_listview_b6_data_rebuild"
                    }
                }
            ]
        },
        [`@b6tables.${tableId}.sortFields`]: {
            "actions": [
                {
                    "ignoreError": false,
                    "actionType": "ajax",
                    "outputVar": "b6FieldsOrderResponseResult",
                    "options": {},
                    "api": {
                        "url": "${context.rootUrl}/api/builder6/b6_aggrid/order/b6_fields",
                        // "url": "http://127.0.0.1:5800/api/builder6/b6_aggrid/order/b6_fields", //TODO:rootUrl能取到？接口在b6不是标准接口
                        "method": "post",
                        "data": {
                            "fields": "${sortedFields}"
                        },
                        "headers": {//TODO:Authorization取不到
                            //   "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                            "Authorization": "Bearer 654300b5074594d15147bcfa,dbe0e0da68ba2e83aca63a5058907e543a4e89f7e979963b4aa1f574f227a3b5063e149d818ff553fb4aa1"
                        },
                        "adaptor": "",
                        "messages": {
                            // "success": "已成功更新字段排序",
                            "failed": "更新字段排序时发生错误，请稍后重试。"
                        }
                    }
                },
                {
                    "actionType": "broadcast",
                    "args": {
                        "eventName": "broadcast_service_listview_b6_data_rebuild"
                    },
                    "expression": "${!!!b6FieldsOrderResponseResult.success}"
                }
            ]
        },
        [`@b6tables.${tableId}.setVerification`]: {
            // "actions": getVerificationSetActions(table, fields)
        }
    }
}
