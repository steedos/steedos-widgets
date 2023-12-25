/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-12-25 16:54:15
 */

import { getFormBody } from './converter/amis/form';
import { clone } from 'lodash';

/**
 * @param {*} props 
 * @param {*} mode edit/new/readonly
 */
function getFormFields(props, mode = "edit") {
    return (props.fields || []).map(function (item) {
        let formItem = {
            "type": "steedos-field",
            "name": item.name,
            "config": item
        }
        if (mode === "readonly") {
            formItem.static = true;
        }
        return formItem;
    }) || [];
}

function getInputTableCell(field, showAsInlineEditMode) {
    if (showAsInlineEditMode) {
        return {
            label: field.label,
            name: field.name,
            quickEdit: {
                "type": "steedos-field",
                "config": field,
                hideLabel: true
            }
        }
    }
    else {
        return {
            "type": "steedos-field",
            "config": field,
            "static": true,
            "readonly": true,
            label: field.label,
            name: field.name,
            hideLabel: true
        }
    }
}

function getComponentId(name, tag) {
    let id = "";
    switch (name) {
        case "table_service":
            id = `service_wrapper__${tag}`;
            break;
        case "form_pagination":
            id = `service_popup_pagination_wrapper__${tag}`;
            break;
        case "form":
            id = `form_popup__${tag}`;
            break;
        case "dialog":
            id = `dialog_popup__${tag}`;
            break;
        default:
            id = `${name}__${tag}`;
            break;
    }
    return id;
}

/**
 * @param {*} props 
 * @param {*} mode edit/new/readonly
 */
async function getInputTableColumns(props) {
    let columns = props.columns || [];
    let inlineEditMode = props.inlineEditMode;
    let showAsInlineEditMode = inlineEditMode && props.editable;
    // 实测过，直接不生成对应的隐藏column并不会对input-table值造成丢失问题，隐藏的列字段值能正常维护
    let fields = props.fields;
    if (columns && columns.length) {
        return columns.map(function (column) {
            let field, extendColumnProps = {};
            if (typeof column === "string") {
                // 如果字符串，则取出要显示的列配置
                field = fields.find(function (fieldItem) {
                    return fieldItem.name === column;
                });
            }
            else {
                // 如果是对象，则合并到steedos-field的config.amis属性中，steedos组件会把config.amis属性混合到最终生成的input-table column
                field = fields.find(function (fieldItem) {
                    return fieldItem.name === column.name;
                });
                if (field) {
                    // field.amis = Object.assign({}, field.amis, column);
                    // 如果把column合并到field.amis，column的label/width等属性不会生效，只能放外层合并
                    extendColumnProps = column;
                }
            }
            if (field) {
                let tableCell = getInputTableCell(field, showAsInlineEditMode);
                return Object.assign({}, tableCell, extendColumnProps);
            }
            else {
                return column;
            }
        });
    }
    else {
        return fields.map(function (field) {
            let tableCell = getInputTableCell(field, showAsInlineEditMode);
            return tableCell;
        }) || [];
    }
}

/**
 * @param {*} props input-table组件props
 * @param {*} mode edit/new/readonly
 * @returns 翻页组件
 */
function getFormPagination(props, mode) {
    let showPagination = true;
    if(mode === "new" && !!!props.editable){
        //不允许编辑只允许新建时不应该让用户操作翻页
        showPagination = false;
    }
    let buttonPrevId = getComponentId("button_prev", props.id);
    let buttonNextId = getComponentId("button_next", props.id);
    let formId = getComponentId("form", props.id);
    let tableServiceId = getComponentId("table_service", props.id);
    let formPaginationId = getComponentId("form_pagination", props.id);
    let onPageChangeScript = `
        let scope = event.context.scoped;
        let __paginationServiceId = "${formPaginationId}";
        let __wrapperServiceId = "${tableServiceId}";
        let __formId = "${formId}";
        let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
        let pageChangeDirection = context.props.pageChangeDirection;
        // event.data中的index和__page分别表示当前要把表单数据提交到的行索引和用于标定下一页页码的当前页页码
        // 一般来说__page = index + 1，但是可以让event.data中传入__page和index值不是这种联系。
        // 比如__page设置为3，index设置为0表示把当前表单数据提交到第一页，但是跳转到第4页，弹出的表单中底下的新增和复制按钮依赖了此功能
        // let currentPage = currentIndex + 1;
        let currentPage = event.data.__page;
        let currentIndex = event.data.index;
        // 翻页到下一页之前需要先把当前页改动的内容保存到中间变量__tableItems中
        let currentFormValues = scope.getComponentById(__formId).getValues();
        fieldValue[currentIndex] = currentFormValues;
        // 翻页到下一页前需要同时把改动的内容保存到最终正式的表单字段中，所以额外给正式表单字段执行一次setValue
        doAction({
            "componentId": "${props.id}",
            "actionType": "setValue",
            "args": {
                "value": fieldValue
            }
        });

        // 以下是翻页逻辑，翻到下一页并把下一页内容显示到表单上
        let targetPage;
        if(pageChangeDirection === "next"){
            targetPage = currentPage + 1;
        }
        else{
            targetPage = currentPage - 1;
        }
        let targetIndex = targetPage - 1;//input-table组件行索引，从0开始的索引
        // let targetFormData = __tableItems[targetIndex];
        doAction({
            "actionType": "setValue",
            "componentId": __paginationServiceId,
            "args": {
                "value": {
                    "__page": targetPage,
                    "index": targetIndex
                }
            }
        });
        // 这里不用进一步把表单内容setValue到form中，是因为编辑表单中schemaApi监听了行索引index的变化，其值变化时会重新build整个form
        // doAction({
        //     "actionType": "setValue",
        //     "componentId": __formId,
        //     "args": {
        //         "value": targetFormData
        //     },
        //     "dataMergeMode": "override"// amis 3.2不支持override模式，高版本才支持
        // });
    `;
    return {
        "type": "wrapper",
        "size": "none",
        "className": "mr-1",
        "body": [
            {
                "type": "button",
                "label": "",
                "icon": `fa fa-angle-left`,
                "level": "link",
                "pageChangeDirection": "prev",
                "disabledOn": showPagination ? "${__page <= 1}" : "true",
                "size": "sm",
                "id": buttonPrevId,
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": onPageChangeScript
                            }
                        ]
                    }
                }
            },
            {
                "type": "tpl",
                "tpl": "${__page}/${__tableItems.length}"
            },
            {
                "type": "button",
                "label": "",
                "icon": `fa fa-angle-right`,
                "level": "link",
                "pageChangeDirection": "next",
                "disabledOn": showPagination ? "${__page >= __tableItems.length}" : "true",
                "size": "sm",
                "id": buttonNextId,
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": onPageChangeScript
                            }
                        ]
                    }
                }
            }
        ]
    }
}

/**
 * 传入formSchema输出带翻页容器的wrapper
 * @param {*} props input-table组件props
 * @param {*} form formSchema
 * @param {*} mode edit/new/readonly
 * @returns 带翻页容器的wrapper
 */
function getFormPaginationWrapper(props, form, mode) {
    // console.log("==getFormPaginationWrapper===", props, mode);
    let serviceId = getComponentId("form_pagination", props.id);
    let tableServiceId = getComponentId("table_service", props.id);
    let innerForm = Object.assign({}, form, {
        "data": {
            // 这里加__super前缀是因为__parentForm变量（即主表单）中可能会正好有名为index的字段
            // 比如“对象字段”对象options字段是一个子表字段，但是主表（即“对象字段”对象）中正好有一个名为index的字段
            "&": "${__tableItems[__super.index]}"
        }
    });
    let formBody = [
        {
            "type": "wrapper",
            "size": "none",
            "className": "flex justify-end sticky top-0 right-0 left-0 z-20 bg-white -mt-2",
            "body": [
                getFormPagination(props, mode)
            ]
        },
        {
            "type": "service",
            "body": [
                innerForm
            ],
            "data": {
                "&": "${__parentForm}"
            }
        }
    ];
    let onServiceInitedScript = `
        // 以下脚本是为了解决有时弹出编辑表单时，表单中的值比最后一次编辑保存的值会延迟一拍。
        // 比如：inlineEditMode模式时，用户在表格单元格中直接修改数据，然后弹出的表单form中并没有包含单元格中修改的内容
        // 另外有的地方在非inlineEditMode模式时也会有这种延迟一拍问题，比如对象字段中下拉框类型字段的”选择项“属性
        // 再比如工作流规则详细页面修改了子表字段”时间触发器“值后，在只读界面点击查看按钮弹出的表单中__tableItems值是修改前的值
        // 处理思路是每次弹出form之前先把其__tableItems同步更新为最新值，这样就能在弹出form中包含单元格中做的修改
        // 注意：service init事件只会在每次弹出窗口时才执行，在触发翻页时并不会触发service init事件
        let scope = event.context.scoped;
        let __wrapperServiceId = "${tableServiceId}";
        let wrapperService = scope.getComponentById(__wrapperServiceId);
        let wrapperServiceData = wrapperService.getData();
        let lastestFieldValue = _.clone(wrapperServiceData["${props.name}"] || []);//这里不可以用event.data["${props.name}"]因为amis input talbe有一层单独的作用域，其值会延迟一拍
        //不可以直接像event.data.__tableItems = lastestFieldValue; 这样整个赋值，否则作用域会断
        let mode = "${mode}";
        if(mode === "new"){
            // 点击子表组件底部新增按钮时新增一条空白行并自动翻页到新增行
            // 注意点击弹出的子表行详细表单中的新增按钮不会进此service init事件函数中
            let newItem = {};
            event.data.__tableItems.push(newItem);
            lastestFieldValue.push(newItem);
            event.data.index = lastestFieldValue.length - 1;
            event.data.__page = lastestFieldValue.length;
            // 这里新增空白行时要把值同步保存到子表组件中，如果不同步保存的话，用户点击弹出表单右上角的关闭窗口时不会自动删除这里自动增加的空白行，同步后可以让用户手动删除此行
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": lastestFieldValue
                }
            });
        }
        event.data.__tableItems.forEach(function(n,i){
            event.data.__tableItems[i] = lastestFieldValue[i];
        });
    `;
    let schema = {
        "type": "service",
        "id": serviceId,
        "schemaApi": {
            // "url": "${context.rootUrl}/graphql?rebuildOn=${index}",
            "url": "${context.rootUrl}/api/v1/spaces/none",
            "trackExpression": "${index}",
            "method": "get",
            "adaptor": `
                const formBody = ${JSON.stringify(formBody)};
                return {
                    "body": formBody
                }
            `,
            "cache": 600000
        },
        // "body": formBody,
        "data": {
            "__page": "${index + 1}",
            // "__total": `\${${props.name}.length}`,
            // "__total": "${__tableItems.length}",
            // "__paginationServiceId": serviceId,
            // "__formId": form.id
        },
        "onEvent": {
            "init": {
                "actions": [
                    {
                        "actionType": "custom",
                        "script": onServiceInitedScript
                    }
                ]
            }
        }
    };
    return schema;
}

/**
 * @param {*} props 
 * @param {*} mode edit/new/readonly
 */
async function getForm(props, mode = "edit", formId) {
    let formFields = getFormFields(props, mode)
    let body = await getFormBody(null, formFields);
    if (!formId) {
        formId = getComponentId("form", props.id);
    }
    let schema = {
        "type": "form",
        "id": formId,
        "title": "表单",
        "debug": false,
        "mode": "normal",
        "body": body,
        "wrapWithPanel": false,
        "canAccessSuperData": false,
        "className": "steedos-object-form steedos-amis-form"
    };
    if (mode === "edit" || mode === "new") {
        // 新增行弹出编辑行表单，在弹出之前已经不用先增加一行，因为在翻页service初始化的时候会判断mode为new时自动新增一行
        let onEditItemSubmitScript = `
            // let fieldValue = _.cloneDeep(event.data["${props.name}"]);
            let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
            //这里加__super.__super前缀是因为__parentForm变量（即主表单）中可能会正好有名为index的字段
            // 比如“对象字段”对象options字段是一个子表字段，但是主表（即“对象字段”对象）中正好有一个名为index的字段
            fieldValue[event.data.__super.__super.index] = JSON.parse(JSON.stringify(event.data));
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": fieldValue
                }
            });
        `;
        Object.assign(schema, {
            "onEvent": {
                "submit": {
                    "weight": 0,
                    "actions": [
                        // {
                        //     "actionType": "setValue",
                        //     "args": {
                        //         "index": "${index}",
                        //         "value": {
                        //             "&": "$$"
                        //         }
                        //     },
                        //     "componentId": props.id
                        // }
                        {
                            "actionType": "custom",
                            "script": onEditItemSubmitScript
                        }
                    ]
                }
            }
        });
    }
    // else if (mode === "new") {
    //     let onNewItemSubmitScript = `
    //         let newItem = JSON.parse(JSON.stringify(event.data));
    //         if(event.data["${props.name}"]){
    //             // let fieldValue = event.data.__tableItems;
    //             // 这里不用__tableItems是因为新建的时候没有翻页，里面没有也不需要走__tableItems变量
    //             let fieldValue = event.data["${props.name}"];
    //             fieldValue.push(newItem);
    //             doAction({
    //                 "componentId": "${props.id}",
    //                 "actionType": "setValue",
    //                 "args": {
    //                     "value": fieldValue
    //                 }
    //             });
    //         }
    //         else{
    //             // 这里不可以执行event.data["${props.name}"]=[newItem]，数据域会断掉
    //             doAction({
    //                 "componentId": "${props.id}",
    //                 "actionType": "setValue",
    //                 "args": {
    //                     "value": [newItem]
    //                 }
    //             });
    //         }
    //     `;
    //     Object.assign(schema, {
    //         "onEvent": {
    //             "submit": {
    //                 "weight": 0,
    //                 "actions": [
    //                     {
    //                         "actionType": "custom",
    //                         "script": onNewItemSubmitScript
    //                     },
    //                     // {
    //                     //     "componentId": props.id,
    //                     //     "actionType": "addItem",//input-table组件的needConfirm属性为true时，addItem动作会把新加的行显示为编辑状态，所以只能使用上面的custom script来setValue实现添加行
    //                     //     "args": {
    //                     //         "index": `\${${props.name}.length || 9000}`,//这里加9000是因为字段如果没放在form组件内，props.name.length拿不到值
    //                     //         "item": {
    //                     //             "&": "$$"
    //                     //         }
    //                     //     }
    //                     // }
    //                 ]
    //             }
    //         }
    //     });
    // }
    schema = getFormPaginationWrapper(props, schema, mode);
    return schema;
}


/**
 * 编辑、新增、删除、查看按钮actions
 * @param {*} props 
 * @param {*} mode edit/new/readonly/delete
 */
async function getButtonActions(props, mode) {
    let actions = [];
    let formId = getComponentId("form", props.id);
    let dialogId = getComponentId("dialog", props.id);
    let buttonNextId = getComponentId("button_next", props.id);
    let formPaginationId = getComponentId("form_pagination", props.id);
    if (mode == "new" || mode == "edit") {
        // let actionShowNewDialog = {
        //     "actionType": "dialog",
        //     "dialog": {
        //         "type": "dialog",
        //         "title": "新增行",
        //         "body": [
        //             await getForm(props, "new", formId)
        //         ],
        //         "size": "lg",
        //         "showCloseButton": true,
        //         "showErrorMsg": true,
        //         "showLoading": true,
        //         "className": "app-popover",
        //         "closeOnEsc": false,
        //         "onEvent": {
        //             "confirm": {
        //                 "actions": [
        //                     {
        //                         "actionType": "validate",
        //                         "componentId": formId
        //                     },
        //                     {
        //                         "preventDefault": true,
        //                         "expression": "${event.data.validateResult.error}" //触发表单校验结果会存入validateResult，amis 3.2不支持，高版本比如 3.5.3支持
        //                     }
        //                 ]
        //             }
        //         }
        //     }
        // };
        let onSaveAndNewItemScript = `
            let scope = event.context.scoped;
            let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
            // 新建一条空白行并保存到子表组件
            fieldValue.push({});
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": fieldValue
                }
            });
            let buttonNextId = "${buttonNextId}";
            let __paginationServiceId = "${formPaginationId}";
            let __paginationData = scope.getComponentById(__paginationServiceId).getData();
            event.data.index = __paginationData.index;
            event.data.__page = fieldValue.length - 1;//这里不可以用Object.assign否则，event.data中上层作用域数据会丢失
            // 触发翻页按钮事件，实现保存当前页数据并跳转到最后一行
            scope.getComponentById(buttonNextId).props.dispatchEvent("click", event.data);
        `;
        let onSaveAndCopyItemScript = `
            let scope = event.context.scoped;
            let __formId = "${formId}";
            // let newItem = JSON.parse(JSON.stringify(event.data));
            let newItem = scope.getComponentById(__formId).getValues();//这里不可以用event.data，因为其拿到的是弹出表单时的初始值，不是用户实时填写的数据
            let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
            // 复制当前页数据到新建行并保存到子表组件
            fieldValue.push(newItem);
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": fieldValue
                }
            });
            let buttonNextId = "${buttonNextId}";
            let __paginationServiceId = "${formPaginationId}";
            let __paginationData = scope.getComponentById(__paginationServiceId).getData();
            event.data.index = __paginationData.index;
            event.data.__page = fieldValue.length - 1;//这里不可以用Object.assign否则，event.data中上层作用域数据会丢失
            // 触发翻页按钮事件，实现保存当前页数据并跳转到最后一行
            scope.getComponentById(buttonNextId).props.dispatchEvent("click", event.data);
        `;
        let dialogButtons = [
            {
            "type": "button",
            "label": "完成",
            "actionType": "confirm",
            "level": "primary"
            }
        ];
        if(props.addable){
            // 有新增行权限时额外添加新增和复制按钮
            dialogButtons = [
                {
                    "type": "button",
                    "label": "新增",
                    "tooltip": "保存并新增一行，即保存当前行数据并新增一条空白行",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "actionType": "custom",
                                    "script": onSaveAndNewItemScript
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "button",
                    "label": "复制",
                    "tooltip": "复制并新增一行，即保存当前行数据并复制当前行数据到新增行",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "actionType": "custom",
                                    "script": onSaveAndCopyItemScript
                                }
                            ]
                        }
                    }
                },
                dialogButtons[0]
            ];
        }
        let actionShowEditDialog = {
            "actionType": "dialog",
            "dialog": {
                "type": "dialog",
                "id": dialogId,
                "title": `\${uiSchema.fields.${props.name}.label} 明细`,
                "body": [
                    await getForm(props, mode, formId)
                ],
                "size": "lg",
                "showCloseButton": true,
                "showErrorMsg": true,
                "showLoading": true,
                "className": "app-popover",
                "closeOnEsc": false,
                "data": {
                    // 这里必须加data数据映射，否则翻页功能中取__tableItems值时会乱，比如翻页编辑后会把上一页中没改过的字段值带过去
                    // 额外把华炎魔方主表记录ObjectForm中的字段值从record变量中映射到子表form中，因为子表lookup字段filtersFunction中可能依赖了主表记录中的字段值，比如“工作流规则”对象“时间触发器”字段中的“日期字段”字段
                    // 额外把global、uiSchema也映射过去，有可能要用，后续需要用到其他变更可以这里加映射
                    // "&": "${record || {}}",
                    // 换成从__super来映射上级表单数据是因为对象列表视图界面中每行下拉菜单中的编辑按钮弹出的表单中的子表所在作用域中没有record变量
                    // 映射到中间变量__parentForm而不是直接用&展开映射是为了避免表单中字段名与作用域中变量重名
                    // "__parentForm": "${__super.__super || {}}",
                    "__parentForm": mode == "new" ? "$$" : "${__super.__super || {}}",
                    "global": "${global}",
                    "uiSchema": "${uiSchema}",
                    "index": "${index}",
                    // "__tableItems": `\${${props.name}}`
                    // 为了解决"弹出的dialog窗口中子表组件会影响页面布局界面中父作用域字段值"，比如设计字段布局微页面中的设置分组功能，弹出的就是子表dialog
                    // 所以这里使用json|toJson转一次，断掉event.data.__tableItems与上层任用域中props.name的联系
                    // "__tableItems": `\${${props.name}|json|toJson}`
                    "__tableItems": `\${(${props.name} || [])|json|toJson}`
                },
                "actions": dialogButtons,
                "onEvent": {
                    "confirm": {
                        "actions": [
                            {
                                "actionType": "validate",
                                "componentId": formId
                            },
                            {
                                "preventDefault": true,
                                "expression": "${event.data.validateResult.error}" //触发表单校验结果会存入validateResult，amis 3.2不支持，高版本比如 3.5.3支持
                            }
                        ]
                    }
                }
            }
        }
        if (props.dialog) {
            Object.assign(actionShowEditDialog.dialog, props.dialog);
        }
        if (mode == "new") {
            let onNewLineScript = `
                let newItem = {};
                if(event.data["${props.name}"]){
                    // let fieldValue = event.data.__tableItems;
                    // 这里不用__tableItems是因为新建的时候没有翻页，里面没有也不需要走__tableItems变量
                    // let fieldValue = _.clone(event.data["${props.name}"]);
                    let fieldValue = event.data["${props.name}"];
                    fieldValue.push(newItem);
                    doAction({
                        "componentId": "${props.id}",
                        "actionType": "setValue",
                        "args": {
                            "value": fieldValue
                        }
                    });
                    event.data.index = fieldValue.length - 1;
                }
                else{
                    // 这里不可以执行event.data["${props.name}"]=[newItem]，数据域会断掉
                    doAction({
                        "componentId": "${props.id}",
                        "actionType": "setValue",
                        "args": {
                            "value": [newItem]
                        }
                    });
                    event.data.index = 1;
                }
            `;
            let actionNewLine = {
                "actionType": "custom",
                "script": onNewLineScript
            };
            // 新增行时不需要在弹出编辑表单前先加一行，因为会在编辑表单所在service初始化时判断到是新增就自动增加一行，因为这里拿不到event.data.__tableItems，也无法变更其值
            // actions = [actionNewLine, actionShowEditDialog];
            actions = [actionShowEditDialog];
        }
        else if (mode == "edit") {
            actions = [actionShowEditDialog];
        }
    }
    else if (mode == "readonly") {
        actions = [
            {
                "actionType": "dialog",
                "dialog": {
                    "type": "dialog",
                    "title": `\${uiSchema.fields.${props.name}.label} 明细`,
                    "body": [
                        await getForm(props, "readonly")
                    ],
                    "size": "lg",
                    "showCloseButton": true,
                    "showErrorMsg": true,
                    "showLoading": true,
                    "className": "app-popover",
                    "closeOnEsc": false,
                    "actions": [],
                    "data": {
                        // 这里必须加data数据映射，否则翻页功能中取__tableItems值时会乱，比如翻页编辑后会把上一页中没改过的字段值带过去
                        // 额外把华炎魔方主表记录ObjectForm中的字段值从record变量中映射到子表form中，因为子表lookup字段filtersFunction中可能依赖了主表记录中的字段值，比如“工作流规则”对象“时间触发器”字段中的“日期字段”字段
                        // 额外把global、uiSchema也映射过去，有可能要用，后续需要用到其他变更可以这里加映射
                        // "&": "${record || {}}",
                        // 换成从__super来映射上级表单数据是因为对象列表视图界面中每行下拉菜单中的编辑按钮弹出的表单中的子表所在作用域中没有record变量
                        // 映射到中间变量__parentForm而不是直接用&展开映射是为了避免表单中字段名与作用域中变量重名
                        // "__parentForm": "${__super.__super || {}}",
                        "__parentForm": "${__super.__super || {}}",
                        "global": "${global}",
                        "uiSchema": "${uiSchema}",
                        "index": "${index}",
                        // "__tableItems": `\${${props.name}}`
                        // 为了解决"弹出的dialog窗口中子表组件会影响页面布局界面中父作用域字段值"，比如设计字段布局微页面中的设置分组功能，弹出的就是子表dialog
                        // 所以这里使用json|toJson转一次，断掉event.data.__tableItems与上层任用域中props.name的联系
                        // "__tableItems": `\${${props.name}|json|toJson}`
                        "__tableItems": `\${(${props.name} || [])|json|toJson}`
                },
                }
            }
        ];
    }
    else if (mode == "delete") {
        let tableServiceId = getComponentId("table_service", props.id);
        let onDeleteItemScript = `
            // let fieldValue = event.data["${props.name}"];
            let scope = event.context.scoped;
            let __wrapperServiceId = "${tableServiceId}";
            let wrapperService = scope.getComponentById(__wrapperServiceId);
            let wrapperServiceData = wrapperService.getData();
            // 这里不可以用event.data["${props.name}"]因为amis input talbe有一层单独的作用域，其值会延迟一拍
            // 这里_.clone是因为字段设计布局设置分组这种弹出窗口中的子表组件，直接删除后，点取消无法还原
            let lastestFieldValue = _.clone(wrapperServiceData["${props.name}"]);
            lastestFieldValue.splice(event.data.index, 1);
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": lastestFieldValue
                }
            });
        `;
        actions = [
            // {
            //     "actionType": "deleteItem",
            //     "args": {
            //         "index": "${index+','}" //这里不加逗号后续会报错，语法是逗号分隔可以删除多行
            //     },
            //     "componentId": props.id
            // },
            {
                "actionType": "custom",
                "script": onDeleteItemScript
            }
        ]
    }
    return actions;
}

async function getButtonNew(props) {
    return {
        "label": "新增",
        "type": "button",
        "icon": "fa fa-plus",
        "onEvent": {
            "click": {
                "actions": await getButtonActions(props, "new")
            }
        },
        "level": "primary"
    };
}

async function getButtonEdit(props, showAsInlineEditMode) {
    return {
        "type": "button",
        "label": "",
        "icon": `fa fa-${showAsInlineEditMode ? "expand-alt" : "pencil"}`,//inline edit模式时显示为放开按钮，只读时显示为笔按钮
        "level": "link",
        "onEvent": {
            "click": {
                "actions": await getButtonActions(props, "edit")
            }
        }
    };
}

async function getButtonView(props) {
    return {
        "type": "button",
        "label": "",
        "icon": "fa fa-expand-alt",//fa-external-link
        "level": "link",
        "onEvent": {
            "click": {
                "actions": await getButtonActions(props, "readonly")
            }
        }
    };
}

async function getButtonDelete(props) {
    return {
        "type": "button",
        "label": "",
        "icon": "fa fa-trash-alt",//不可以用fa-trash-o，因为设计字段布局界面中弹出的设置分组列表中显示不了这个图标
        "level": "link",
        "onEvent": {
            "click": {
                "actions": await getButtonActions(props, "delete")
            }
        }
    };
}

export const getAmisInputTableSchema = async (props) => {
    if (!props.id) {
        props.id = "steedos_input_table_" + props.name + "_" + Math.random().toString(36).substr(2, 9);
    }
    let serviceId = getComponentId("table_service", props.id);
    let buttonsForColumnOperations = [];
    let inlineEditMode = props.inlineEditMode;
    let showAsInlineEditMode = inlineEditMode && props.editable;
    if (props.editable) {
        let showEditButton = true;
        if (showAsInlineEditMode) {
            // 始终显示弹出子表表单按钮，如果需要判断只在有列被隐藏时才需要显示弹出表单按钮放开下面的if逻辑就好
            showEditButton = true;
            // // inline edit模式下只在有列被隐藏时才需要显示编辑按钮
            // if (props.columns && props.columns.length > 0 && props.columns.length < props.fields.length) {
            //     showEditButton = true;
            // }
            // else {
            //     showEditButton = false;
            // }
        }
        // 编辑时显示编辑按钮
        if (showEditButton) {
            let buttonEditSchema = await getButtonEdit(props, showAsInlineEditMode);
            buttonsForColumnOperations.push(buttonEditSchema);
        }
    }
    else {
        // 只读时显示查看按钮
        // 如果想只在有列被隐藏时才需要显示查看按钮可以加上判断：if (props.columns && props.columns.length > 0 && props.columns.length < props.fields.length)
        let buttonViewSchema = await getButtonView(props);
        buttonsForColumnOperations.push(buttonViewSchema);
    }
    if (props.removable) {
        let buttonDeleteSchema = await getButtonDelete(props);
        buttonsForColumnOperations.push(buttonDeleteSchema);
    }
    let inputTableSchema = {
        "type": "input-table",
        "label": props.label,
        "name": props.name,
        //不可以addable/editable/removable设置为true，因为会在原生的操作列显示操作按钮图标，此开关实测只控制这个按钮显示不会影响功能
        // "addable": props.addable,
        // "editable": props.editable,
        // "removable": props.removable, 
        "draggable": props.draggable,
        "showIndex": props.showIndex,
        "perPage": props.perPage,
        "id": props.id,
        "columns": await getInputTableColumns(props),
        // "needConfirm": false, //不可以配置为false，否则，单元格都是可编辑状态，且很多static类型无法正常显示，比如static-mapping
        "strictMode": props.strictMode,
        "showTableAddBtn": false,
        "showFooterAddBtn": false,
        "className": props.tableClassName
    };
    if (buttonsForColumnOperations.length) {
        inputTableSchema.columns.push({
            "name": "__op__",
            "type": "operation",
            "buttons": buttonsForColumnOperations,
            "width": buttonsForColumnOperations.length > 1 ? "46px" : "20px"
        });
    }
    if (showAsInlineEditMode) {
        inputTableSchema.needConfirm = false;
    }
    let amis = props["input-table"] || props.amis;//额外支持"input-table"代替amis属性，是因为在字段yml文件中用amis作为key不好理解
    if (amis) {
        // 支持配置amis属性重写或添加最终生成的input-table中任何属性。
        delete amis.id;//如果steedos-input-table组件配置了amis.id属性，会造成新建编辑行功能不生效
        Object.assign(inputTableSchema, amis);
    }
    const isAnyFieldHasDependOn = (props.fields || []).find(function (item) {
        return item.depend_on;
    });
    if (isAnyFieldHasDependOn) {
        // 有任意一个子字段有depend_on属性时，强制设置禁用静态模式
        Object.assign(inputTableSchema, {
            strictMode: false
        });
    }
    let schemaBody = [inputTableSchema];
    let footerToolbar = clone(props.footerToolbar || []); //这里不clone的话，会造成死循环，应该是因为props属性变更会让组件重新渲染
    if (props.addable) {
        let buttonNewSchema = await getButtonNew(props);
        footerToolbar.unshift(buttonNewSchema);
    }
    if (footerToolbar.length) {
        schemaBody.push({
            "type": "wrapper",
            "size": "none",
            "body": footerToolbar
        });
    }
    // 直接把headerToolbar unshift进schemaBody，不会显示在label下面，而是显示在上面了，这个暂时没有解决办法，只能等amis 升级
    // 看起来amis官方后续会支持给input-table组件配置headerToolbar，见：https://github.com/baidu/amis/issues/7246
    // 不过依然放开此功能的意义在于有的场景字段label本来就不需要显示出来，此时headerToolbar就有意义
    let headerToolbar = clone(props.headerToolbar || []); //这里不clone的话，会造成死循环，应该是因为props属性变更会让组件重新渲染
    if (headerToolbar.length) {
        schemaBody.unshift({
            "type": "wrapper",
            "size": "none",
            "body": headerToolbar
        });
    }
    let schema = {
        "type": "service",
        "body": schemaBody,
        "className": props.className,
        "id": serviceId
    };
    // console.log("===schema===", schema);
    return schema;
}