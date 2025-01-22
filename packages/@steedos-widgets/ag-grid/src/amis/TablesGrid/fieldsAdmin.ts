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
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
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
 * 新建和编辑字段form提交成功后脚本
 * @param {*} tableId 
 * @param {*} mode new/edit
 * @returns 
 */
const getSubmitSuccScript = (tableId: any, mode: string) => {
    return `
        let mode = "${mode || ''}";
        const data = context.getData();
        const gridApi = data.gridApi;
        const gridContext = data.gridContext;
        const fieldFormData = JSON.parse(JSON.stringify(data));
        // fieldFormData中缺少_id属性，agGrid组件中依赖了_id
        Object.assign(fieldFormData, {
            _id: data.recordId
        });
        var columnDefs = gridApi.getColumnDefs();
        var currentColumnDef = gridContext.getColumnDefByField(fieldFormData);
        let newColumnDefs;
        if (mode === "new"){
            // columnDefs.splice(columnDefs.length - 4, 0, "m");
            var index = columnDefs.length - 4;
            newColumnDefs = columnDefs.slice(0, index).concat([currentColumnDef], columnDefs.slice(index));
        }
        else if (mode === "edit"){
            newColumnDefs = columnDefs.map(function (n) {
                if (n.field === fieldFormData.name) {
                    return currentColumnDef;
                }
                return n;
            });
        }
        gridApi.setGridOption('columnDefs', newColumnDefs);
    `
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
                "actionType": "custom",
                "script": getSubmitSuccScript(tableId, mode)
            }
            // 不再使用rebuild刷新表格的方式来更新ag-grid字段信息
            // {
            //     "actionType": "broadcast",
            //     "args": {
            //         "eventName": "broadcast_service_listview_b6_data_rebuild"
            //     }
            // }
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

const getDeleteSuccScript = () => {
    return `
        const data = context.getData();
        const gridApi = data.gridApi;
        const gridContext = data.gridContext;
        const deletingFieldId = event.data.deletingFieldId;
        const isDeleteSuc = event.data.responseData && event.data.responseData._id === deletingFieldId;
        if (isDeleteSuc) {
            var columnDefs = gridApi.getColumnDefs();
            _.remove(columnDefs, function(n){
                return n.cellEditorParams && n.cellEditorParams.fieldConfig && n.cellEditorParams.fieldConfig._id === deletingFieldId;
            });
            gridApi.setGridOption('columnDefs', columnDefs);
        }
    `
}

export function getTableAdminEvents(tableId: string) {
    return {
        [`@airtable.${tableId}.editField`]: {
            "actions": [
                {
                    "actionType": "dialog",
                    "dialog": getAgGridFieldFormDialog(tableId, "edit")
                }
            ]
        },
        [`@airtable.${tableId}.newField`]: {
            "actions": [
                {
                    "actionType": "dialog",
                    "dialog": getAgGridFieldFormDialog(tableId, "new")
                }
            ]
        },
        [`@airtable.${tableId}.deleteField`]: {
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
                        "headers": {
                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
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
                    "actionType": "custom",
                    "script": getDeleteSuccScript()
                }
                // 不再使用rebuild刷新表格的方式来更新ag-grid字段信息
                // {
                //     "actionType": "broadcast",
                //     "args": {
                //         "eventName": "broadcast_service_listview_b6_data_rebuild"
                //     }
                // }
            ]
        },
        [`@airtable.${tableId}.sortFields`]: {
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
                        "headers": {
                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                        },
                        "adaptor": "",
                        "messages": {
                            // "success": "已成功更新字段排序",
                            "failed": "更新字段排序时发生错误，请稍后重试。"
                        }
                    }
                },
                // 排序后不用刷新表格，ag-grid会自动更新界面上的排序次序
                // 不再使用rebuild刷新表格的方式来更新ag-grid字段信息
                // {
                //     "actionType": "broadcast",
                //     "args": {
                //         "eventName": "broadcast_service_listview_b6_data_rebuild"
                //     },
                //     "expression": "${!!!b6FieldsOrderResponseResult.success}"
                // }
            ]
        },
        [`@airtable.${tableId}.setVerification`]: {
            // "actions": getVerificationSetActions(table, fields)
        }
    }
}
