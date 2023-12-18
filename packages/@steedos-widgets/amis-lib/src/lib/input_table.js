/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-12-18 17:12:23
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

function getFormPagination(props) {
    let onPageChangeScript = `
        let scope = event.context.scoped;
        let __paginationServiceId = event.data.__paginationServiceId;
        let __wrapperServiceId = event.data.__wrapperServiceId;
        let __formId = event.data.__formId;
        let fieldValue = event.data.__changedItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.changedItems，直接变更其值即可改变表单中的值
        let pageChangeDirection = context.props.pageChangeDirection;
        let currentPage = event.data.__page;
        let currentIndex = event.data.index;

        // 翻页到下一页之前需要先把当前页改动的内容保存到中间变量changedItems中
        let currentFormValues = scope.getComponentById(__formId).getValues();
        fieldValue[currentIndex] = currentFormValues;
        // // 因为翻页form中用的是event.data.changedItems中的数据，所以不需要像下面这样doAction setValue变更中间变量changedItems值
        // doAction({
        //     "componentId": __wrapperServiceId,
        //     "actionType": "setValue",
        //     "args": {
        //         "value": {
        //             "__changedItems": fieldValue
        //         }
        //     }
        // });
        // 如果翻页到下一页前需要同时把改动的内容保存到最终正式的表单字段中，需要额外给正式表单字段执行一次setValue
        // 但是同时保存到正式表单字段中会造成翻页后点击取消无法取消翻页之前的改动内容
        // doAction({
        //     "componentId": "${props.id}",
        //     "actionType": "setValue",
        //     "args": {
        //         "value": fieldValue
        //     }
        // });

        // 以下是翻页逻辑，翻到下一页并把下一页内容显示到表单上
        let targetPage;
        if(pageChangeDirection === "next"){
            targetPage = currentPage + 1;
        }
        else{
            targetPage = currentPage - 1;
        }
        let targetIndex = targetPage - 1;//input-table组件行索引，从0开始的索引
        // let targetFormData = __changedItems[targetIndex];
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
        "className": "py-2",
        "body": [
            {
                "type": "button",
                "label": "",
                "icon": `fa fa-angle-left`,
                "level": "link",
                "pageChangeDirection": "prev",
                "disabledOn": "${__page <= 1}",
                "size": "sm",
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
                "tpl": "${__page}/${__total}"
            },
            {
                "type": "button",
                "label": "",
                "icon": `fa fa-angle-right`,
                "level": "link",
                "pageChangeDirection": "next",
                "disabledOn": "${__page >= __total}",
                "size": "sm",
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
 * @param {*} mode edit/readonly
 * @returns 带翻页容器的wrapper
 */
function getFormPaginationWrapper(props, form, mode) {
    let serviceId = `service_popup_pagination_wrapper__${props.id}`;
    // 这里加__super前缀是因为__parentForm变量（即主表单）中可能会正好有名为index的字段
    // 比如“对象字段”对象options字段是一个子表字段，但是主表（即“对象字段”对象）中正好有一个名为index的字段
    // 只读的时候不可以走中间变量__changedItems，比如工作流规则详细页面修改了子表字段”时间触发器“值后，在只读界面点击查看按钮弹出的表单中__changedItems值是修改前的值
    let formValues = mode === "readonly" ? `\${${props.name}[__super.index]}` : "${__changedItems[__super.index]}";
    // 这时用__readonlyItemsLength是因为`\${${props.name}.length}`拿不到值
    let totalValue = mode === "readonly" ? "${__readonlyItemsLength}" : "${__changedItems.length}";
    let innerForm = Object.assign({}, form, {
        "data": {
            // "&": "${__changedItems[__super.index]}"
            "&": formValues,
        }
    });
    let formBody = [
        {
            "type": "wrapper",
            "size": "none",
            "className": "flex justify-end border-y border-gray-200 -mx-6 shadow-inner sticky top-0 right-0 left-0 z-20 bg-white mb-4",
            "body": [
                getFormPagination(props)
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
        // 以下脚本在inlineEditMode模式时才有必要执行（不过执行了也没有坏处，纯粹是没必要），是为了解决：
        // inlineEditMode模式时，用户在表格单元格中直接修改数据，然后弹出的表单form中并没有包含单元格中修改的内容
        // 思路是每次弹出form之前先把其changedItems同步更新为最新值，这样就能在弹出form中包含单元格中做的修改
        // 注意：service init事件只会在每次弹出窗口时才执行，在触发翻页时并不会触发service init事件
        let inlineEditMode = ${props.inlineEditMode};
        if(!inlineEditMode){
            return;
        }
        let scope = event.context.scoped;
        let __wrapperServiceId = event.data.__wrapperServiceId;
        let wrapperService = scope.getComponentById(__wrapperServiceId);
        let wrapperServiceData = wrapperService.getData();
        let lastestFieldValue = wrapperServiceData["${props.name}"];//这里不可以用event.data["${props.name}"]因为amis input talbe有一层单独的作用域，其值会延迟一拍
        //不可以直接像event.data.__changedItems = originalFieldValue; 这样整个赋值，否则作用域会断
        event.data.__changedItems.forEach(function(n,i){
            event.data.__changedItems[i] = lastestFieldValue[i];
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
            "__total": totalValue,
            "__paginationServiceId": serviceId,
            "__formId": form.id
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
    if(!formId){
        formId = `form_popup__${props.id}`;
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
    if (mode === "edit") {
        let onEditItemSubmitScript = `
            // let fieldValue = _.cloneDeep(event.data["${props.name}"]);
            let fieldValue = event.data.__changedItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.changedItems，直接变更其值即可改变表单中的值

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
            // // 因为翻页form中用的是event.data.changedItems中的数据，所以不需要像下面这样doAction setValue变更中间变量changedItems值
            // doAction({
            //     "componentId": event.data.__wrapperServiceId,
            //     "actionType": "setValue",
            //     "args": {
            //         "value": {
            //             "__changedItems": fieldValue
            //         }
            //     }
            // });
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
    else if (mode === "new") {
        let onNewItemSubmitScript = `
            // let fieldValue = _.cloneDeep(event.data["${props.name}"]);
            if(!event.data.__changedItems){
                event.data.__changedItems = [];
            }
            let fieldValue = event.data.__changedItems;
            fieldValue.push(JSON.parse(JSON.stringify(event.data)));
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": fieldValue
                }
            });
            // // 因为翻页form中用的是event.data.changedItems中的数据，所以不需要像下面这样doAction setValue变更中间变量changedItems值
            // doAction({
            //     "componentId": event.data.__wrapperServiceId,
            //     "actionType": "setValue",
            //     "args": {
            //         "value": {
            //             "__changedItems": fieldValue
            //         }
            //     }
            // });
        `;
        Object.assign(schema, {
            "onEvent": {
                "submit": {
                    "weight": 0,
                    "actions": [
                        {
                            "actionType": "custom",
                            "script": onNewItemSubmitScript
                        },
                        // {
                        //     "componentId": props.id,
                        //     "actionType": "addItem",//input-table组件的needConfirm属性为true时，addItem动作会把新加的行显示为编辑状态，所以只能使用上面的custom script来setValue实现添加行
                        //     "args": {
                        //         "index": `\${${props.name}.length || 9000}`,//这里加9000是因为字段如果没放在form组件内，props.name.length拿不到值
                        //         "item": {
                        //             "&": "$$"
                        //         }
                        //     }
                        // }
                    ]
                }
            }
        });
    }
    if (mode === "edit" || mode === "readonly") {
        schema = getFormPaginationWrapper(props, schema, mode);
    }
    return schema;
}

async function getButtonNew(props) {
    let formId = `form_popup__${props.id}`;
    return {
        "label": "新增",
        "type": "button",
        "icon": "fa fa-plus",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "actionType": "dialog",
                        "dialog": {
                            "type": "dialog",
                            "title": "新增行",
                            "body": [
                                await getForm(props, "new", formId)
                            ],
                            "size": "lg",
                            "showCloseButton": true,
                            "showErrorMsg": true,
                            "showLoading": true,
                            "className": "app-popover",
                            "closeOnEsc": false,
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
                ]
            }
        },
        "level": "primary"
    };
}

async function getButtonEdit(props, showAsInlineEditMode) {
    let formId = `form_popup__${props.id}`;
    let onCancelScript = `
        let scope = event.context.scoped;
        let __wrapperServiceId = event.data.__wrapperServiceId;
        let wrapperService = scope.getComponentById(__wrapperServiceId);
        let wrapperServiceData = wrapperService.getData();
        let originalFieldValue = wrapperServiceData["${props.name}"];//这里不可以用event.data["${props.name}"]因为amis input talbe有一层单独的作用域，其值会延迟一拍
        //不可以直接像event.data.__changedItems = originalFieldValue; 这样整个赋值，否则作用域会断，造成无法还原
        event.data.__changedItems.forEach(function(n,i){
            event.data.__changedItems[i] = originalFieldValue[i];
        });
        // 因为翻页form中用的是event.data.changedItems中的数据，所以像下面这样doAction setValue无法实现还原
        // doAction({
        //     "componentId": __wrapperServiceId,
        //     "actionType": "setValue",
        //     "args": {
        //         "value": {
        //             "__changedItems": originalFieldValue
        //         }
        //     }
        // });
    `;
    return {
        "type": "button",
        "label": "",
        "icon": `fa fa-${showAsInlineEditMode ? "expand" : "pencil"}`,//inline edit模式时显示为放开按钮，只读时显示为笔按钮
        "level": "link",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "actionType": "dialog",
                        "dialog": {
                            "type": "dialog",
                            "title": "编辑行",
                            "body": [
                                await getForm(props, "edit", formId)
                            ],
                            "size": "lg",
                            "showCloseButton": true,
                            "showErrorMsg": true,
                            "showLoading": true,
                            "className": "app-popover",
                            "closeOnEsc": false,
                            "data": {
                                // 这里必须加data数据映射，否则翻页功能中取changedItems值时会乱，比如翻页编辑后会把上一页中没改过的字段值带过去
                                // 额外把华炎魔方主表记录ObjectForm中的字段值从record变量中映射到子表form中，因为子表lookup字段filtersFunction中可能依赖了主表记录中的字段值，比如“工作流规则”对象“时间触发器”字段中的“日期字段”字段
                                // 额外把global、uiSchema也映射过去，有可能要用，后续需要用到其他变更可以这里加映射
                                // "&": "${record || {}}",
                                // 换成从__super来映射上级表单数据是因为对象列表视图界面中每行下拉菜单中的编辑按钮弹出的表单中的子表所在作用域中没有record变量
                                // 映射到中间变量__parentForm而不是直接用&展开映射是为了避免表单中字段名与作用域中变量重名
                                "__parentForm": "${__super.__super || {}}",
                                "global": "${global}",
                                "uiSchema": "${uiSchema}",
                                "index": "${index}",
                                "__changedItems": "${__changedItems}",
                                "__wrapperServiceId": "${__wrapperServiceId}"
                            },
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
                                },
                                "cancel": {
                                    "actions": [
                                        {
                                            "actionType": "custom",
                                            "script": onCancelScript
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        }
    };
}

async function getButtonView(props) {
    return {
        "type": "button",
        "label": "",
        "icon": "fa fa-expand",//fa-external-link
        "level": "link",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "actionType": "dialog",
                        "dialog": {
                            "type": "dialog",
                            "title": "查看行",
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
                                // 这里必须加data数据映射，否则翻页功能中取changedItems值时会乱，比如翻页编辑后会把上一页中没改过的字段值带过去
                                // 额外把华炎魔方主表记录ObjectForm中的字段值从formData变量中映射到子表form中，因为子表lookup字段filtersFunction中可能依赖了主表记录中的字段值，比如“工作流规则”对象“时间触发器”字段中的“日期字段”字段
                                // global、uiSchema等常用变量本来就在formData变量已经存在了，无需另外映射
                                // "&": "${formData || {}}",
                                // 换成从__super来映射上级表单数据是因为对象列表视图界面中每行下拉菜单中的编辑按钮弹出的表单中的子表所在作用域中没有formData变量
                                // 映射到中间变量__parentForm而不是直接用&展开映射是为了避免表单中字段名与作用域中变量重名
                                "__parentForm": "${__super.__super || {}}",
                                "index": "${index}",
                                "__changedItems": "${__changedItems}",
                                "__wrapperServiceId": "${__wrapperServiceId}",
                                "__readonlyItemsLength": `\${${props.name}.length}`
                            }
                        }
                    }
                ]
            }
        }
    };
}

function getButtonDelete(props) {
    let onDeleteItemScript = `
        // let fieldValue = _.cloneDeep(event.data["${props.name}"]);
        if(!event.data.__changedItems){
            event.data.__changedItems = [];
        }
        let fieldValue = event.data.__changedItems;
        // fieldValue.push(JSON.parse(JSON.stringify(event.data)));
        fieldValue.splice(event.data.index, 1)
        doAction({
            "componentId": "${props.id}",
            "actionType": "setValue",
            "args": {
                "value": fieldValue
            }
        });
        // // 因为翻页form中用的是event.data.changedItems中的数据，所以不需要像下面这样doAction setValue变更中间变量changedItems值
        // doAction({
        //     "componentId": event.data.__wrapperServiceId,
        //     "actionType": "setValue",
        //     "args": {
        //         "value": {
        //             "__changedItems": fieldValue
        //         }
        //     }
        // });
    `;
    return {
        "type": "button",
        "label": "",
        "icon": "fa fa-minus",
        "level": "link",
        "onEvent": {
            "click": {
                "actions": [
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
        }
    };
}

export const getAmisInputTableSchema = async (props) => {
    if (!props.id) {
        props.id = "steedos_input_table_" + props.name + "_" + Math.random().toString(36).substr(2, 9);
    }
    let serviceId = `service_wrapper__${props.id}`;
    let buttonsForColumnOperations = [];
    let inlineEditMode = props.inlineEditMode;
    let showAsInlineEditMode = inlineEditMode && props.editable;
    if (props.editable) {
        let showEditButton = true;
        if (showAsInlineEditMode) {
            // inline edit模式下只在有列被隐藏时才需要显示编辑按钮
            if (props.columns && props.columns.length > 0 && props.columns.length < props.fields.length) {
                showEditButton = true;
            }
            else {
                showEditButton = false;
            }
        }
        // 编辑时显示编辑按钮
        if (showEditButton) {
            let buttonEditSchema = await getButtonEdit(props, showAsInlineEditMode);
            buttonsForColumnOperations.push(buttonEditSchema);
        }
    }
    else {
        // 只读时显示查看按钮
        if (props.columns && props.columns.length > 0 && props.columns.length < props.fields.length) {
            // 只在有列被隐藏时才需要显示查看按钮
            let buttonViewSchema = await getButtonView(props);
            buttonsForColumnOperations.push(buttonViewSchema);
        }
    }
    if (props.removable) {
        let buttonDeleteSchema = getButtonDelete(props);
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
    let dataProviderInited = `
        // 单独维护一份中间变量changedItems，因为原变量在input-table组件有单独的作用域，翻页功能中无法维护此作用域中的行记录值
        setData({ __changedItems: _.cloneDeep(data["${props.name}"]) || []});
    `;
    let onInitScript = `
        // 上面dataProviderInited中setData有时不生效，没有成功给service组件设置__changedItems变量值
        // 比如设计字段布局界面中的设置分组功能就因为__changedItems变量值不存在而报错，应该是因为把steedos-input-table组件单独放到弹出窗口中会有这个问题
        // 所以额外在service init事件中手动设置一次__changedItems值
        let __wrapperServiceId = event.data.__wrapperServiceId;
        let fieldValue = _.cloneDeep(event.data["${props.name}"]) || [];
        doAction({
            "componentId": __wrapperServiceId,
            "actionType": "setValue",
            "args": {
                "value": {
                    "__changedItems": fieldValue
                }
            }
        });
        // 下面的doAction好像不是必须的
        // doAction({
        //     "componentId": "${props.id}",
        //     "actionType": "setValue",
        //     "args": {
        //         "value": fieldValue
        //     }
        // });
    `;
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
    // 不可以直接把headerToolbar unshift进schemaBody，因为它没有显示在label下面，而是显示在上面了，这没有意义
    // 看起来amis官方后续会支持给input-table组件配置headerToolbar，见：https://github.com/baidu/amis/issues/7246
    // let headerToolbar = clone(props.headerToolbar || []); //这里不clone的话，会造成死循环，应该是因为props属性变更会让组件重新渲染
    // if (headerToolbar.length) {
    //     schemaBody.unshift({
    //         "type": "wrapper",
    //         "size": "none",
    //         "body": headerToolbar
    //     });
    // }
    let schema = {
        "type": "service",
        "body": schemaBody,
        "className": props.className,
        "id": serviceId,
        "data": {
            "__wrapperServiceId": serviceId
        },
        "dataProvider": {
            "inited": dataProviderInited
        },
        "onEvent": {
          "init": {
            "actions": [
              {
                "actionType": "custom",
                "script": onInitScript
              }
            ]
          }
        }
    };
    // console.log("===schema===", schema);
    return schema;
}