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
        const gridContext = gridApi.getGridOption("context");
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
        const gridContext = gridApi.getGridOption("context");
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

/**
 * 新建、编辑查看校验规则表单记录的amis dialog
 * @param {*} tableId 
 * @param {*} mode new/edit/read
 * @returns 
 */
const getAgGridVerificationFormDialog = (tableId: string, mode: string) => {
    const form = {
        "type": "steedos-object-form",
        "mode": "edit",
        "label": "对象表单",
        "objectApiName": "b6_verification",
        "recordId": "${_id}",
        "enableInitApi": true,
        "className": "",
        "submitSuccActions": [
            {
                "actionType": "reload",
                "componentId": "u:d6234e18fa74",
                "groupType": "component"
            },
            // {
            //     "actionType": "broadcast",
            //     "args": {
            //         "eventName": "broadcast_service_listview_b6_data_rebuild"
            //     }
            // }
        ],
        "fieldsExtend": "{\n    \"table\": {\n        \"visible_on\": \"${false}\"\n    }\n}",
        "visibleOn": "${!!_formulaVariablesLoaded}"
    };
    if (mode === "new") {
        Object.assign(form, {
            "recordId": "",
            "enableInitApi": false,
            "defaultData": {
                "table": tableId
            }
        });
    }
    else if (mode === "read") {
        Object.assign(form, {
            "mode": "readonly",
            "submitSuccActions": []
        });
    }
    const formService = getFieldFormService(form, tableId, true);
    let title = "";
    if (mode === "edit") {
        title = "编辑校验规则";
    }
    else if (mode === "new") {
        title = "新建校验规则";
    }
    else if (mode === "read") {
        title = "查看校验规则";
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
                "label": "取消"
            },
            {
                "type": "button",
                "actionType": "confirm",
                "label": "确定",
                "primary": true
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

const getVerificationSetDialogConfirmScript = (tableId: string) => {
    return `
        const tableId = "${tableId}";
        var dialogCrud = event.context.scoped.getComponentById("u:d6234e18fa74");
        var crudData = dialogCrud.getData();
        var newVerifications = crudData.items;
        doAction({
            "type": "broadcast",
            "actionType": "broadcast",
            "args": {
                "eventName": "@airtable.${tableId}.setVerificationConfirm"
            },
            "data": {
                "newVerifications": newVerifications
            }
        })
    `;
}

export function getVerificationSetActions(tableId: string) {
    return [
        {
            "ignoreError": false,
            "actionType": "dialog",
            "dialog": {
                "type": "dialog",
                "title": "校验规则",
                "body": [
                    {
                        "type": "button-group",
                        "id": "u:173771bbd1fc",
                        "buttons": [
                            {
                                "type": "button",
                                "label": "新建",
                                "onEvent": {
                                    "click": {
                                        "actions": [
                                            {
                                                "ignoreError": false,
                                                "actionType": "dialog",
                                                "dialog": getAgGridVerificationFormDialog(tableId, "new"),
                                                "size": "lg"
                                            }
                                        ]
                                    }
                                },
                                "id": "u:f4bb2603b8e2",
                                "level": "primary"
                            }
                        ]
                    },
                    {
                        "type": "crud",
                        "hideQuickSaveBtn": true,
                        "syncLocation": false,
                        "api": {
                            "method": "get",
                            "url": "${context.rootUrl}/api/v1/b6_verification?sort=created",
                            "messages": {},
                            "requestAdaptor": `const masterRecordId = \"${tableId}\";\nlet filters = [\"table\", \"=\", masterRecordId];\nconst contextFilters = context && context.filters;\nif (contextFilters?.length) {\n  filters = [filters, contextFilters]\n}\napi.url = api.url + \"&skip=\" + context.top * (context.page - 1);\napi.url = api.url + '&filters=' + JSON.stringify(filters);\nreturn api;`,
                            "adaptor": "",
                            "headers": {
                                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                            }
                        },
                        "bulkActions": [],
                        "columns": [
                            {
                                "name": "_id",
                                "label": "ID",
                                "type": "text",
                                "hidden": true,
                                "id": "u:5963440c8296"
                            },
                            {
                                "name": "rule",
                                "label": "校验规则",
                                "sortable": true,
                                "type": "text",
                                "id": "u:ac13847067a1"
                            },
                            {
                                "type": "text",
                                "label": "报错提示",
                                "id": "u:ac13847067a1",
                                "name": "alert",
                                "sortable": true
                            },
                            {
                                "type": "operation",
                                "label": "操作",
                                "width": 100,
                                "fixed": "right",
                                "buttons": [
                                    {
                                        "type": "button",
                                        "icon": "fa fa-eye",
                                        "actionType": "dialog",
                                        "dialog": getAgGridVerificationFormDialog(tableId, "read")
                                    },
                                    {
                                        "type": "button",
                                        "icon": "fa fa-pencil",
                                        "actionType": "dialog",
                                        "dialog": getAgGridVerificationFormDialog(tableId, "edit")
                                    },
                                    {
                                        "type": "button",
                                        "icon": "fa fa-times text-danger",
                                        "confirmText": "确定要删除吗",
                                        "onEvent": {
                                            "click": {
                                                "weight": 0,
                                                "actions": [
                                                    {
                                                        "ignoreError": false,
                                                        "actionType": "ajax",
                                                        "outputVar": "responseResult",
                                                        "options": {},
                                                        "api": {
                                                            "url": "${context.rootUrl}/api/v1/b6_verification/${_id}",
                                                            "method": "delete",
                                                            "requestAdaptor": "",
                                                            "adaptor": "",
                                                            "headers": {
                                                                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                                            },
                                                            "messages": {}
                                                        }
                                                    },
                                                    {
                                                        "componentId": "u:d6234e18fa74",
                                                        "groupType": "component",
                                                        "actionType": "reload"
                                                    },
                                                    // {
                                                    //     "actionType": "broadcast",
                                                    //     "args": {
                                                    //         "eventName": "broadcast_service_listview_b6_data_rebuild"
                                                    //     }
                                                    // }
                                                ]
                                            }
                                        },
                                        "id": "u:0a119a9ef3bb"
                                    }
                                ],
                                "id": "u:293c7e7b65ef",
                                "placeholder": "-"
                            }
                        ],
                        "id": "u:d6234e18fa74",
                        "perPageAvailable": [
                            10
                        ],
                        "messages": {},
                        "primaryField": "_id",
                        "filter": null,
                        "perPageField": "top"
                    }
                ],
                "id": "u:set_fields_dialog",
                "data": {
                    "_crud_conditions": {},
                    "filters": [],
                    "_crud_ordering": false,
                    "_master": "${_master}",
                    "context": "${context}"
                },
                "actions": [
                    // {
                    //     "type": "button",
                    //     "actionType": "cancel",
                    //     "label": "取消",
                    //     "id": "u:cd0da5df3e78"
                    // },
                    {
                        "type": "button",
                        "actionType": "confirm",
                        "label": "完成",
                        "primary": true,
                        "id": "u:3ca3a2bb15b0"
                    }
                ],
                "showCloseButton": false,
                "closeOnOutside": false,
                "closeOnEsc": false,
                "showErrorMsg": true,
                "showLoading": true,
                "draggable": false,
                "actionType": "dialog",
                "size": "lg",
                "onEvent": {
                    "confirm": {
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": getVerificationSetDialogConfirmScript(tableId)
                            }
                        ]
                    }
                }
            }
        }
    ]
}

const getVerificationConfirmScript = () => {
    return `
        const newVerifications = event.data.newVerifications;
        const data = context.getData();
        const gridApi = data.gridApi;
        const oldContext = gridApi.getGridOption("context");
        const newContext = Object.assign({}, oldContext, { 
            verifications: newVerifications 
        });
        const newGridOptionsProps = {
            context: newContext
        };
        const needToValiTable = newVerifications && newVerifications.length > 0;
        const isReadonly = oldContext.isReadonly;
        if (!isReadonly){
            // 用户有数据编辑权限时，默认使用单元格编辑，即 onCellValueChanged 属性有值
            // 如果 tables 中存在校验规则，把编辑模式转为行编辑，不使用单元格编辑模式，即把 onCellValueChanged 换成 onRowValueChanged
            if (needToValiTable){
                newGridOptionsProps.editType = "fullRow";
                newGridOptionsProps.onRowValueChanged = oldContext.onRowValueChangedFun;
                newGridOptionsProps.onCellValueChanged = null;
            }
            else {
                newGridOptionsProps.editType = "cell";
                newGridOptionsProps.onRowValueChanged = null;
                newGridOptionsProps.onCellValueChanged = oldContext.onCellValueChangedFun;
            }
        }
        gridApi.updateGridOptions(newGridOptionsProps);
        gridApi.redrawRows();
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
                        "url": "${context.rootUrl}/api/builder6/b6_aggrid/order/b6_fields",//TODO:sort接口在b6不是标准接口
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
            "actions": getVerificationSetActions(tableId)
        },
        [`@airtable.${tableId}.setVerificationConfirm`]: {
            "actions": [
                {
                    "actionType": "custom",
                    "script": getVerificationConfirmScript()
                }
            ]
        }
    }
}
