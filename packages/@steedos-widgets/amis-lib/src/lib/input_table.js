/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2026-01-22 09:58:26
 */

import { getFormBody } from './converter/amis/form';
import { getComparableAmisVersion } from './converter/amis/util';
import { clone, cloneDeep, debounce, template as lodashTemplate } from 'lodash';
import { uuidv4 } from '../utils/uuid';
import i18next from "i18next";
import { buildPrintCellSchema, normalizeFieldSpecForPrint } from './printInputTableCell';

/**
 * 子表组件字段值中每行数据补上字段值为空的的字段值，把值统一设置为空字符串，是为了解决amis amis 3.6/6.0 input-table组件bug:行中字段值为空时会显示为父作用域中的同名变量值，见：https://github.com/baidu/amis/issues/9520
 * amis #9520修正后此函数及相关代码可以移除
 * @param {*} value 子表组件字段值，数组
 * @param {*} fields 子表组件fields属性，数组
 * @returns 转换后的子表组件字段值
 */
function getTableValueWithEmptyValue(value, fields) {
    return (value || []).map((itemValue) => {
        //这里不clone的话，会造成在pipeIn函数执行该函数后像pipeOut一样最终输出到表单项中，即库里字段值会被改了
        const newItemValue = clone(itemValue);
        (fields || []).forEach((itemField) => {
            if(itemField.name && (newItemValue[itemField.name] === undefined || newItemValue[itemField.name] === null)){
                // 这里newItemValue中不存在 itemField.name 属性，或者值为null时都会有“显示为父作用域中的同名变量值”的问题，所以null和undefined都要重置为空字符串
                // 实测数字、下拉框、多选lookup等字段类型重置为空字符串都不会有问题，而且实测amis from组件的清空表单字段值功能就是把表单中的各种字段类型设置为空字符串，所以看起来也符合amis规范
                newItemValue[itemField.name] = "";
            }
            if (newItemValue.children) {
                newItemValue.children = getTableValueWithEmptyValue(newItemValue.children, fields);
            }
        });
        return newItemValue;
    });
}

/**
 * 把子表组件字段值中每行数据中经过上面getTableValueWithEmptyValue函数空字段值移除
 * amis #9520修正后此函数及相关代码可以移除
 * @param {*} value 子表组件字段值，数组
 * @param {*} fields 子表组件fields属性，数组
 * @returns 转换后的子表组件字段值
 */
function getTableValueWithoutEmptyValue(value, fields) {
    return (value || []).map((itemValue) => {
        const newItemValue = clone(itemValue);
        (fields || []).forEach((itemField) => {
            if(itemField.name && (newItemValue[itemField.name] === "" || newItemValue[itemField.name] === undefined || newItemValue[itemField.name] === null)){
                // 这里额外把null和undefined值也删除掉纯粹是没必要输出保存它们
                delete newItemValue[itemField.name];
            }
            if (newItemValue.children) {
                newItemValue.children = getTableValueWithoutEmptyValue(newItemValue.children, fields);
            }
        });
        return newItemValue;
    });
}

function getTablePrimaryKey(props) {
    return props.primaryKey || "_id";
}

/**
 * 子表组件字段值中每行数据的补上唯一标识字段值，其值为随机uuid
 * @param {*} value 子表组件字段值，数组
 * @param {*} primaryKey 主键字段名，一般为_id
 * @returns 转换后的子表组件字段值
 */
function getTableValueWithPrimaryKeyValue(value, primaryKey, pipeOut = false) {
    if (!primaryKey) {
        return value;
    }
    return (value || []).map((itemValue) => {
        //这里不clone的话，会造成在pipeIn函数执行该函数后像pipeOut一样最终输出到表单项中，即库里把primaryKey字段值保存了
        const newItemValue = clone(itemValue);
        if (newItemValue[primaryKey]) {
            // 审批王子表开了autoGeneratePrimaryKeyValue属性，库里子表记录行中存了primaryKey属性，
            // 如果不加__input_table_temp_primary_key的话，子表行中无法识别主表记录字段值变更，即子表行中拿到的主表记录值可能是老的
            newItemValue["__input_table_temp_primary_key"] = uuidv4();
            if (newItemValue.children) {
                newItemValue.children = getTableValueWithPrimaryKeyValue(newItemValue.children, primaryKey, pipeOut);
            }
        }
        else {
            newItemValue[primaryKey] = uuidv4();
            if (newItemValue.children) {
                newItemValue.children = getTableValueWithPrimaryKeyValue(newItemValue.children, primaryKey, pipeOut);
            }
        }
        if (pipeOut === true) {
            // 如果是pipeOut，则把临时唯一标识字段值删除，避免存入库中
            delete newItemValue["__input_table_temp_primary_key"];
        }
        return newItemValue;
    });
}

/**
 * 子表组件字段值中每行数据的移除唯一标识字段值，因为该字段值一般只作临时标记，不存库
 * @param {*} value 子表组件字段值，数组
 * @param {*} primaryKey 主键字段名，一般为_id
 * @returns 转换后的子表组件字段值
 */
function getTableValueWithoutPrimaryKeyValue(value, primaryKey) {
    if (!primaryKey) {
        return value;
    }
    return (value || []).map((itemValue) => {
        //这里clone只是为了保险，不是必须的，每次修改子表数据是否都会生成新的primaryKey字段值是由pipeOut中识别autoGeneratePrimaryKeyValue决定的，跟这里没关系
        const newItemValue = clone(itemValue);
        if (newItemValue.children) {
            newItemValue.children = getTableValueWithoutPrimaryKeyValue(newItemValue.children, primaryKey);
        }
        delete newItemValue[primaryKey];
        return newItemValue;
    });
}

/**
 * 子表组件字段值中每行数据的键值key移除指定前缀
 * @param {*} value 子表组件字段值，数组
 * @param {*} fieldPrefix 字段前缀
 * @returns 转换后的子表组件字段值
 */
function getTableValueWithoutFieldPrefix(value, fieldPrefix) {
    let convertedValue = [];
    (value || []).forEach((itemValue) => {
        var newItemValue = {};
        for (let n in itemValue) {
            if (itemValue.hasOwnProperty(n)) {
                if(n === "children"){
                    newItemValue.children = getTableValueWithoutFieldPrefix(itemValue.children, fieldPrefix);
                }
                else{
                    newItemValue[n.replace(new RegExp(`^${fieldPrefix}`), "")] = itemValue[n];
                }
            }
        }
        convertedValue.push(newItemValue);
    });
    return convertedValue;
}

/**
 * 子表组件字段值中每行数据的键值key补上指定前缀
 * @param {*} value 子表组件字段值，数组
 * @param {*} fieldPrefix 字段前缀
 * @param {*} primaryKey 主键字段名，主键不参与被键值key规则，需要排除，审批王amis表单也是这个规则
 * @returns 转换后的子表组件字段值
 */
function getTableValuePrependFieldPrefix(value, fieldPrefix, primaryKey) {
    let convertedValue = [];
    (value || []).forEach((itemValue) => {
        var newItemValue = {};
        for (let n in itemValue) {
            if (itemValue.hasOwnProperty(n) && typeof itemValue[n] !== undefined && n !== primaryKey) {
                if(n === "children"){
                    newItemValue.children = getTableValuePrependFieldPrefix(itemValue.children, fieldPrefix, primaryKey);
                }
                else{
                    newItemValue[`${fieldPrefix}${n}`] = itemValue[n];
                }
            }
        }
        if (primaryKey && itemValue[primaryKey]) {
            newItemValue[primaryKey] = itemValue[primaryKey];
        }
        convertedValue.push(newItemValue);
    });
    return convertedValue;
}

/**
 * 子表组件字段集合属性中每个字段name移除指定前缀
 * @param {*} fields 子表组件字段集合，数组
 * @param {*} fieldPrefix 字段前缀
 * @returns 转换后的子表组件字段值
 */
function getTableFieldsWithoutFieldPrefix(fields, fieldPrefix) {
    return (fields || []).map((item) => {
        const newItem = clone(item);//这里不clone的话，会造成子表组件重新render，从而审批王那边点开子表行编辑窗口时报错
        newItem.name = newItem.name.replace(new RegExp(`^${fieldPrefix}`), "");
        return newItem;
    });
}

/**
 * 子表组件字段集合属性中每个字段name补上指定前缀
 * 因amis存在bug：input-table内的字段在行编辑模式时会受到外层相同name的字段的影响 https://github.com/baidu/amis/issues/9653
 * 在渲染input table组件时统一调用此函数加上前缀来避开同名字段问题
 * @param {*} fields 子表组件字段集合，数组
 * @param {*} fieldPrefix 字段前缀
 * @returns 转换后的子表组件字段值
 */
// function getTableFieldsPrependFieldPrefix(fields, fieldPrefix) {
//     return (fields || []).map((item) => {
//         const newItem = clone(item);
//         newItem.name = `${fieldPrefix}${item.name}`;
//         newItem.__originalName = item.name;
//         return newItem;
//     });
// }

/**
 * @param {*} props 
 * @param {*} mode edit/new/readonly
 */
function getFormFields(props, mode = "edit") {
    let fieldPrefix = props.fieldPrefix;
    let fields = props.fields || [];
    if (fieldPrefix) {
        fields = getTableFieldsWithoutFieldPrefix(fields, fieldPrefix);
    }
    return (fields || []).map(function (item) {
        let formItem ;

        if(item.isAmis){
            formItem = item;
        }else{
            formItem = {
                "type": "steedos-field",
                "name": item.name,
                "config": item
            };

            if(!formItem.config.amis){
                formItem.config.amis = {}
            }

            if(item.visibleOn){
                formItem.config.amis.visibleOn = item.visibleOn;
            }
            if(item.requiredOn){
                formItem.config.amis.requiredOn = item.requiredOn;
            }
        }
     
        if (mode === "readonly") {
            formItem.static = true;
        }
        return formItem;
    }) || [];
}

function getInputTableCell(field, showAsInlineEditMode) {
    if (showAsInlineEditMode) {
        // 这里不可以用quickEdit，因为amis存在bug：input-table内的字段在行编辑模式时会受到外层相同name的字段的影响 https://github.com/baidu/amis/issues/9653
        if(field.isAmis){
            return field;
        }
        return {
            "type": "steedos-field",
            "config": Object.assign({}, field, {
                label: false,
                description: null
            }),
            // quickEdit: {
            //     "type": "steedos-field",
            //     "mode": "inline",
            //     "config": Object.assign({}, field, {
            //         label: false
            //     })
            // },
            label: field.label,
            name: field.name,
            // 注意：列级 visibleOn 如果有引用行数据字段，可能导致不同行 td 显隐不一致，造成部分行生成的 td 数量比表头 th 数量少。
            // 这会导致缺失的td单元格边框线显示不完整，已通过 fixTableBorders 函数自动补齐缺失 td。
            visibleOn: field.visibleOn,
            requiredOn: field.requiredOn
        }
    }
    else {
        if(field.isAmis){
            return {
                ...field,
                inInputTable: true,
                "static": true,
                "readonly": true,
                label: field.label,
                name: field.name
            };
        }
        return {
            "type": "steedos-field",
            "config": Object.assign({}, field, {
                label: false,
                description: null
            }),
            inInputTable: true,
            "static": true,
            "readonly": true,
            label: field.label,
            name: field.name,
            // 注意：列级 visibleOn 如果有引用行数据字段，可能导致不同行 td 显隐不一致，造成部分行生成的 td 数量比表头 th 数量少。
            // 这会导致缺失的td单元格边框线显示不完整，已通过 fixTableBorders 函数自动补齐缺失 td。
            visibleOn: field.visibleOn,
            requiredOn: field.requiredOn
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
async function getInputTableColumns(props, buttonsForColumnOperations) {
    let columns = props.columns || [];
    let inlineEditMode = props.inlineEditMode;
    let showAsInlineEditMode = inlineEditMode && props.editable;
    // 实测过，直接不生成对应的隐藏column并不会对input-table值造成丢失问题，隐藏的列字段值能正常维护

    let fieldPrefix = props.fieldPrefix;
    let fields = cloneDeep(props.fields || []);
    if (fieldPrefix) {
        fields = getTableFieldsWithoutFieldPrefix(fields, fieldPrefix);
    }
    if (inlineEditMode == true) {
        let popOverContainerSelector = "";
        let popOverContainer = props.popOverContainer && props.popOverContainer();
        //获取到当前input-table所处的popOverContainer（可能是modal-dialog中），
        //给所有的下拉框字段配置popOverContainerSelector，使下拉框组件的弹出框挂载到当前dialog上，防止被dialog遮挡
        if (popOverContainer) {
            let classList = Array.prototype.slice.call(popOverContainer.parentElement.classList);
            if (classList.includes('amis-dialog-widget')) {
                popOverContainerSelector = '.' + classList.join('.') + ' .antd-Modal-content';
            }
        }
        fields.forEach(function (field) {
            //lookup存在下拉框模式；弹出模式用的是picker组件，不认popOverContainerSelector属性，所以统一加上
            if (field.type == "select" || field.type == "lookup") {
                field.amis = {
                    ...field.amis,
                    popOverContainerSelector
                }
            }
        })
    }
    
    if (columns && columns.length) {
        return columns.map(function (column, index) {
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
                let mode = typeof extendColumnProps.inlineEditMode === "boolean" ?
                    extendColumnProps.inlineEditMode : showAsInlineEditMode;
                let tableCell = getInputTableCell(field, mode);
                let className = "";
                //判断是否换行，目前规则默认换行
                if(extendColumnProps.wrap == false ){
                    className += " whitespace-nowrap"
                }else{
                    className += " break-words"
                }
                
                if(buttonsForColumnOperations.length == 0 && !props.showIndex && index == 0) {
                    className += " antd-Table-primayCell"
                }
                //合并classname
                if (typeof extendColumnProps.className == "object") {
                    className = {
                        [className]: "true",
                        ...extendColumnProps.className
                    }
                } else if (typeof extendColumnProps.className == "string") {
                    className = `${className} ${extendColumnProps.className} `
                }
                return Object.assign({}, tableCell, extendColumnProps, {className});
            }
            else {
                return column;
            }
        });
    }
    else {
        return fields.map(function (field, index) {
            let tableCell = getInputTableCell(field, showAsInlineEditMode); 
            tableCell.className = ""; // 允许换行 " whitespace-nowrap ";
            if(buttonsForColumnOperations.length == 0 && !props.showIndex && index == 0) {
                tableCell.className += " antd-Table-primayCell"
            }
            if(tableCell.config && inlineEditMode != true){
                delete tableCell.config.value;
            }
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
    if (mode === "new" && !!!props.editable) {
        //不允许编辑只允许新建时不应该让用户操作翻页
        showPagination = false;
    }
    let buttonPrevId = getComponentId("button_prev", props.id);
    let buttonNextId = getComponentId("button_next", props.id);
    let dialogId = getComponentId("dialog", props.id);
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
        let mode = "${mode}";
        // event.data中的index和__page分别表示当前要把表单数据提交到的行索引和用于标定下一页页码的当前页页码
        // 一般来说__page = index + 1，但是可以让event.data中传入__page和index值不是这种联系。
        // 比如__page设置为3，index设置为0表示把当前表单数据提交到第一页，但是跳转到第4页，弹出的表单中底下的新增和复制按钮依赖了此功能
        // let currentPage = currentIndex + 1;
        let currentPage = event.data.__page;
        let currentIndex = event.data.index;
        if(mode !== "readonly"){
            // 新建编辑时，翻页才需要把当前页表单保存，只读时直接翻页即可
            // 翻页到下一页之前需要先把当前页改动的内容保存到中间变量__tableItems中
            let currentFormValues = scope.getComponentById(__formId).getValues();
            // 这里不clone的话，其值会带上__super属性，审批王给子表组件传入autoGeneratePrimaryKeyValue属性后，这里用clone的话，通过复制出来的记录，如果点**右上角的关闭按钮**，再点击复制出来的行记录编辑，弹出的表单中没有值
            currentFormValues = JSON.parse(JSON.stringify(currentFormValues));//_.clone(currentFormValues);
            var parent = event.data.parent;
            var __parentIndex = event.data.__parentIndex;
            if(parent){
                fieldValue[__parentIndex].children[currentIndex] = currentFormValues;
                // 重写父节点，并且改变其某个属性以让子节点修改的内容回显到界面上
                fieldValue[__parentIndex] = Object.assign({}, fieldValue[__parentIndex], {
                    children: fieldValue[__parentIndex].children,
                    __fix_rerender_after_children_modified_tag: new Date().getTime()
                });
            }
            else{
                fieldValue[currentIndex] = currentFormValues;
            }
            // 翻页到下一页前需要同时把改动的内容保存到最终正式的表单字段中，所以额外给正式表单字段执行一次setValue
            doAction({
                "componentId": "${props.id}",
                "actionType": "setValue",
                "args": {
                    "value": fieldValue
                }
            });
        }

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
    let buttonPrevActions = [];
    if (mode !== "readonly") {
        // 校验通过时，返回上一页，需要重置 __isNewItem 为默认值，否则点击取消按钮会删除最后一行
        buttonPrevActions.push({
            "actionType": "setValue",
            "componentId": dialogId,
            "args": {
                "value": {
                    "__isNewItem": false
                }
            },
            "expression": "${!!!event.data.validateResult.error}"
        });
    }
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
                                "actionType": "validate",
                                "componentId": formId
                            },
                            {
                                "actionType": "custom",
                                "script": onPageChangeScript,
                                "expression": "${!!!event.data.validateResult.error}" //触发表单校验结果会存入validateResult，amis 3.2不支持，高版本比如 3.5.3支持
                            },
                            ...buttonPrevActions
                        ]
                    }
                }
            },
            {
                "type": "tpl",
                // 这里用__super.parent，加__super是为了防止当前记录有字段名为parent的重名变量
                "tpl": "${__page}/${__super.parent ? COMPACT(__tableItems[__parentIndex]['children']).length : COMPACT(__tableItems).length}"
            },
            {
                "type": "button",
                "label": "",
                "icon": `fa fa-angle-right`,
                "level": "link",
                "pageChangeDirection": "next",
                // "disabledOn": showPagination ? "${__page >= __tableItems.length}" : "true",
                // 这里用__super.parent，加__super是为了防止当前记录有字段名为parent的重名变量
                "disabledOn": showPagination ? "${__page >= (__super.parent ? COMPACT(__tableItems[__parentIndex]['children']).length : COMPACT(__tableItems).length)}" : "true",
                "size": "sm",
                "id": buttonNextId,
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "validate",
                                "componentId": formId
                            },
                            {
                                "actionType": "custom",
                                "script": onPageChangeScript,
                                "expression": "${!!!event.data.validateResult.error}" //触发表单校验结果会存入validateResult，amis 3.2不支持，高版本比如 3.5.3支持
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
    let primaryKey = getTablePrimaryKey(props);
    let innerForm = Object.assign({}, form, {
        "data": {
            // 这里加__super前缀是因为__parentForm变量（即主表单）中可能会正好有名为index的字段
            // 比如“对象字段”对象options字段是一个子表字段，但是主表（即“对象字段”对象）中正好有一个名为index的字段
            "&": "${__super.parent ? __tableItems[__parentIndex]['children'][__super.index] : __tableItems[__super.index]}"
        }
    });
    let formBody = [
        {
            "type": "wrapper",
            "size": "none",
            "className": "flex justify-end sticky top-0 right-0 left-0 z-20 bg-white",
            "body": [
                getFormPagination(props, mode)
            ]
        },
        {
            "type": "service",
            "id": "u:steedos-input-table-form-service",
            "body": [
                innerForm
            ],
            "data": {
                "&": "${__parentForm}"
            }
        }
    ];
    let onServiceInitedScript = `
        // 以下脚本解决了有时弹出编辑表单时，表单中的值比最后一次编辑保存的值会延迟一拍。
        // 比如：inlineEditMode模式时，用户在表格单元格中直接修改数据，然后弹出的表单form中并没有包含单元格中修改的内容
        // 另外有的地方在非inlineEditMode模式时也会有这种延迟一拍问题，比如对象字段中下拉框类型字段的”选择项“属性
        // 再比如工作流规则详细页面修改了子表字段”时间触发器“值后，在只读界面点击查看按钮弹出的表单中__tableItems值是修改前的值
        // 处理思路是每次弹出form之前先把其__tableItems同步更新为最新值，这样就能在弹出form中包含单元格中做的修改
        // 注意：service init事件只会在每次弹出窗口时才执行，在触发翻页时并不会触发service init事件
        let scope = event.context.scoped;
        let __wrapperServiceId = "${tableServiceId}";
        let wrapperService = scope.getComponentById(__wrapperServiceId);
        let wrapperServiceData = wrapperService.getData();
        // 这里不可以用event.data["${props.name}"]因为amis input talbe有一层单独的作用域，其值会延迟一拍
        // 这里如果不.clone的话，在弹出窗口中显示的子表组件，添加行后点窗口的取消按钮关闭窗口后无法把之前的操作还原，即把之前添加的行自动移除
        let lastestFieldValue = _.clone(wrapperServiceData["${props.name}"] || []);
        let fieldPrefix = "${props.fieldPrefix || ''}";
        if(fieldPrefix){
            let getTableValueWithoutFieldPrefix = new Function('v', 'f', "return (" + ${getTableValueWithoutFieldPrefix.toString()} + ")(v, f)");
            lastestFieldValue = getTableValueWithoutFieldPrefix(lastestFieldValue, fieldPrefix);
        }
        // 处理带括号的 key，复制一份 _ 的 key
        if(lastestFieldValue){
            lastestFieldValue.forEach(function(item) {
                for (var key in item) {
                    if (key && (/[^a-zA-Z0-9_$\u4e00-\u9fff.]/.test(key))) {
                        var safeKey = key.replace(/[）)]/g, '').replace(/[^a-zA-Z0-9_$\u4e00-\u9fff.]/g, '_');
                        if (safeKey !== key) {
                            item[safeKey] = item[key];
                        }
                    }
                }
            });
        }
        //不可以直接像event.data.__tableItems = lastestFieldValue; 这样整个赋值，否则作用域会断
        let mode = "${mode || ''}";
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

            // 延时再保存一次当前页数据到子表组件中，解决新增/复制新增行后关闭弹出窗口时数据丢失造成翻页页码错误问题
            setTimeout(function(){
                doAction({
                    "componentId": "${props.id}",
                    "actionType": "setValue",
                    "args": {
                        "value": lastestFieldValue
                    }
                });
            }, 1000);
        }
        event.data.__tableItems.forEach(function(n,i){
            event.data.__tableItems[i] = lastestFieldValue[i];
        });

        var parent = event.data.parent;
        var fieldValue = event.data.__tableItems;
        if(parent){
            // 如果是子行，即在节点嵌套情况下，当前节点如果是children属性下的子节点时，则算出其所属父行的索引值
            var primaryKey = "${primaryKey}";
            event.data.__parentIndex = _.findIndex(fieldValue, function(item){
                return item[primaryKey] == parent[primaryKey];
            });
            if(event.data.__parentIndex < 0){
                let tableId = "${props.id}";
                let table = scope.getComponentById(tableId)
                // autoGeneratePrimaryKeyValue不为true的情况下，即子表组件input-table的pipeOut函数中会移除表单了子表字段的primaryKey字段值，
                // 此时行primaryKey字段值为空，但是pipeIn函数中已经为input-table自动生成过primaryKey字段值了，只是没有输出到表单字段值中而已
                // 所以上面从表单字段值中没找到__parentIndex，是因为此时行primaryKey字段值只经过pipeIn保存到table组件内而没有保存到tableService
                event.data.__parentIndex = _.findIndex(table.props.value, function(item){
                    return item[primaryKey] == parent[primaryKey];
                });
            }
        }
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
            "__parentIndex": null,//兼容节点嵌套情况，即节点中有children属性时，这里记录当前节点所属上层节点index，只支持向上找一层，不支持多层
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
    // console.log(`getForm formFields`, formFields)
    let body = await getFormBody(null, formFields);
    let primaryKey = getTablePrimaryKey(props);
    if (!formId) {
        formId = getComponentId("form", props.id);
    }
    let schema = {
        "type": "form",
        "id": formId,
        "title": "表单",
        "debug": window.amis_form_debug || false,
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
            let removeEmptyItems = function(items){
                let i = _.findIndex(items, function(item){
                    return item === undefined
                });
                if(i > -1){
                    items.splice(i, 1);
                    removeEmptyItems(items);
                }
            }
            // 因为删除时只是把input-table组件中的行数据删除了，并没有把父层service中的行删除，所以__tableItems会有值为undefined的数据，需要移除掉
            // 不用event.data.__tableItems = _.compact(event.data.__tableItems)是因为会把__tableItems变量保存到表单中
            removeEmptyItems(event.data.__tableItems);
            let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
            //这里加__super.__super前缀是因为__parentForm变量（即主表单）中可能会正好有名为index的字段
            // 比如“对象字段”对象options字段是一个子表字段，但是主表（即“对象字段”对象）中正好有一个名为index的字段
            // fieldValue[event.data.__super.__super.index] = JSON.parse(JSON.stringify(event.data));
            var currentIndex = event.data.__super.__super.index;
            var currentFormValues = JSON.parse(JSON.stringify(event.data));
            var parent = event.data.__super.__super.parent;
            var __parentIndex = event.data.__super.__super.__parentIndex;
            // let uuidv4 = new Function("return (" + ${uuidv4.toString()} + ")()");
            // var primaryKey = "${primaryKey}";
            if(parent){
                fieldValue[__parentIndex].children[currentIndex] = currentFormValues;
                // 重写父节点，并且改变其某个属性以让子节点修改的内容回显到界面上
                fieldValue[__parentIndex] = Object.assign({}, fieldValue[__parentIndex], {
                    children: fieldValue[__parentIndex].children,
                    __fix_rerender_after_children_modified_tag: new Date().getTime()
                });
            }
            else{
                // 这里currentFormValues中如果没有primaryKey字段值不用处理，因为组件的pipeIn/pipeOut中会为每行自动生成
                // 也不用担心复制行时_id会重复，因为点击复制按钮时已经处理过了
                fieldValue[currentIndex] = currentFormValues;
            }
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
    let primaryKey = getTablePrimaryKey(props);
    let tableServiceId = getComponentId("table_service", props.id);
    let formId = getComponentId("form", props.id);
    let dialogId = getComponentId("dialog", props.id);
    let buttonNextId = getComponentId("button_next", props.id);
    let formPaginationId = getComponentId("form_pagination", props.id);
    let parentFormData = "${__super.__super.__super.__super || {}}";
    let amisVersion = getComparableAmisVersion();
    if (amisVersion < 3.6) {
        parentFormData = "${__super.__super || {}}";
    }
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
            console.log("onSaveAndNewItemScript start");
            let scope = event.context.scoped;
            let removeEmptyItems = function(items){
                let i = _.findIndex(items, function(item){
                    return item === undefined
                });
                if(i > -1){
                    items.splice(i, 1);
                    removeEmptyItems(items);
                }
            }
            // 因为删除时只是把input-table组件中的行数据删除了，并没有把父层service中的行删除，所以__tableItems会有值为undefined的数据，需要移除掉
            // 不用event.data.__tableItems = _.compact(event.data.__tableItems)是因为会把__tableItems变量保存到表单中
            removeEmptyItems(event.data.__tableItems);
            let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
            // 新建一条空白行并保存到子表组件
            var parent = event.data.__super.parent;
            var primaryKey = "${primaryKey}";
            var __parentIndex = parent && _.findIndex(fieldValue, function(item){
                return item[primaryKey] == parent[primaryKey];
            });
            if(parent && __parentIndex < 0){
                let tableId = "${props.id}";
                let table = scope.getComponentById(tableId)
                // autoGeneratePrimaryKeyValue不为true的情况下，即子表组件input-table的pipeOut函数中会移除表单了子表字段的primaryKey字段值，
                // 此时行primaryKey字段值为空，但是pipeIn函数中已经为input-table自动生成过primaryKey字段值了，只是没有输出到表单字段值中而已
                // 所以上面从表单字段值中没找到__parentIndex，是因为此时行primaryKey字段值只经过pipeIn保存到table组件内而没有保存到tableService
                __parentIndex = _.findIndex(table.props.value, function(item){
                    return item[primaryKey] == parent[primaryKey];
                });
            }
            if(parent){
                fieldValue[__parentIndex].children.push({});
                // 这里实测不需要fieldValue[__parentIndex] = ... 来重写整个父行让子表回显，所以没加相关代码
            }
            else{
                fieldValue.push({});
            }
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
            if(parent){
                event.data.__page = fieldValue[__parentIndex].children.length - 1;//这里不可以用Object.assign否则，event.data中上层作用域数据会丢失
                event.data.__parentIndex = __parentIndex; //执行下面的翻页按钮事件中依赖了__parentIndex值
            }
            else{
                event.data.__page = fieldValue.length - 1;//这里不可以用Object.assign否则，event.data中上层作用域数据会丢失
            }
            // 触发翻页按钮事件，实现保存当前页数据并跳转到最后一行
            scope.getComponentById(buttonNextId).props.dispatchEvent("click", event.data);

            // 标记dialog为新建行，点击取消时需要删除行
            doAction({
                "componentId": "${dialogId}",
                "actionType": "setValue",
                "args": {
                    "value": {
                        "__isNewItem": true
                    }
                }
            });
            
            // 延时再保存一次当前页数据到子表组件中，解决新增/复制新增行后关闭弹出窗口时数据丢失造成翻页页码错误问题
            setTimeout(function(){
                doAction({
                    "componentId": "${props.id}",
                    "actionType": "setValue",
                    "args": {
                        "value": fieldValue
                    }
                });
            }, 1000);
        `;
        let onSaveAndCopyItemScript = `
            console.log("onSaveAndCopyItemScript start");
            let scope = event.context.scoped;
            let __formId = "${formId}";
            // let newItem = JSON.parse(JSON.stringify(event.data));
            let newItem = scope.getComponentById(__formId).getValues();//这里不可以用event.data，因为其拿到的是弹出表单时的初始值，不是用户实时填写的数据
            // 审批王给子表组件传入autoGeneratePrimaryKeyValue属性后，这里用clone的话，通过复制出来的记录，如果点**右上角的关闭按钮**，再点击复制出来的行记录编辑，弹出的表单中没有值
            newItem = JSON.parse(JSON.stringify(newItem));//_.clone(newItem);
            let removeEmptyItems = function(items){
                let i = _.findIndex(items, function(item){
                    return item === undefined
                });
                if(i > -1){
                    items.splice(i, 1);
                    removeEmptyItems(items);
                }
            }
            // 因为删除时只是把input-table组件中的行数据删除了，并没有把父层service中的行删除，所以__tableItems会有值为undefined的数据，需要移除掉
            // 不用event.data.__tableItems = _.compact(event.data.__tableItems)是因为会把__tableItems变量保存到表单中
            removeEmptyItems(event.data.__tableItems);
            let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
            // 复制当前页数据到新建行并保存到子表组件
            // fieldValue.push(newItem);
            var parent = event.data.__super.parent;
            var primaryKey = "${primaryKey}";
            var __parentIndex = parent && _.findIndex(fieldValue, function(item){
                return item[primaryKey] == parent[primaryKey];
            });
            if(parent && __parentIndex < 0){
                let tableId = "${props.id}";
                let table = scope.getComponentById(tableId)
                // autoGeneratePrimaryKeyValue不为true的情况下，即子表组件input-table的pipeOut函数中会移除表单了子表字段的primaryKey字段值，
                // 此时行primaryKey字段值为空，但是pipeIn函数中已经为input-table自动生成过primaryKey字段值了，只是没有输出到表单字段值中而已
                // 所以上面从表单字段值中没找到__parentIndex，是因为此时行primaryKey字段值只经过pipeIn保存到table组件内而没有保存到tableService
                __parentIndex = _.findIndex(table.props.value, function(item){
                    return item[primaryKey] == parent[primaryKey];
                });
            }
            if(newItem[primaryKey]){
                // 如果newItem已经有主键字段值，则重新生成新的主键值，否则会重复。
                // let uuidv4 = new Function("return (" + ${uuidv4.toString()} + ")()");
                // newItem[primaryKey] = uuidv4();
                // 删除primaryKey会自动加primaryKey，这里不删除primaryKey审批王会有bug,像上面重新给新的uuid值也一样，见：[子表-通过复制出来的记录，再点击编辑，没有值](https://github.com/steedos/steedos-plugins/issues/83)
                // 只能删除primaryKey键值，改后不影响autoGeneratePrimaryKeyValue功能最终效果
                delete newItem[primaryKey];
            }
            if(parent){
                fieldValue[__parentIndex].children.push(newItem);
                // 这里实测不需要fieldValue[__parentIndex] = ... 来重写整个父行让子表回显，所以没加相关代码
            }
            else{
                fieldValue.push(newItem);
            }
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
            if(parent){
                event.data.__page = fieldValue[__parentIndex].children.length - 1;//这里不可以用Object.assign否则，event.data中上层作用域数据会丢失
                event.data.__parentIndex = __parentIndex; //执行下面的翻页按钮事件中依赖了__parentIndex值
            }
            else{
                event.data.__page = fieldValue.length - 1;//这里不可以用Object.assign否则，event.data中上层作用域数据会丢失
            }
            // 触发翻页按钮事件，实现保存当前页数据并跳转到最后一行
            scope.getComponentById(buttonNextId).props.dispatchEvent("click", event.data);

            // 标记dialog为新建行，点击取消时需要删除行
            doAction({
                "componentId": "${dialogId}",
                "actionType": "setValue",
                "args": {
                    "value": {
                        "__isNewItem": true
                    }
                }
            });
            
            // 延时再保存一次当前页数据到子表组件中，解决新增/复制新增行后关闭弹出窗口时数据丢失造成翻页页码错误问题
            setTimeout(function(){
                doAction({
                    "componentId": "${props.id}",
                    "actionType": "setValue",
                    "args": {
                        "value": fieldValue
                    }
                });
            }, 1000);
        `;
        let dialogButtons = [
            {
                "type": "button",
                "label": i18next.t('frontend_form_cancel'),//"取消",
                "actionType": "close",
                "style": {
                    "margin-right": "auto"
                }
            },
            {
                "type": "button",
                "label": i18next.t('frontend_input_table_button_confirm'),//"完成",
                "actionType": "confirm",
                "level": "primary"
            }
        ];
        if (props.addable) {
            // 有新增行权限时额外添加新增和复制按钮
            dialogButtons = [
                dialogButtons[0],
                {
                    "type": "button",
                    "label": i18next.t('frontend_input_table_button_new'),//"新增",
                    "tooltip": i18next.t('frontend_input_table_button_new_tooltip'),
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "actionType": "validate",
                                    "componentId": formId
                                },
                                {
                                    "actionType": "custom",
                                    "script": onSaveAndNewItemScript,
                                    "expression": "${!!!event.data.validateResult.error}" //触发表单校验结果会存入validateResult，amis 3.2不支持，高版本比如 3.5.3支持
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "button",
                    "label": i18next.t('frontend_input_table_button_copy'),//"复制",
                    "tooltip": i18next.t('frontend_input_table_button_copy_tooltip'),
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "actionType": "validate",
                                    "componentId": formId
                                },
                                {
                                    "actionType": "custom",
                                    "script": onSaveAndCopyItemScript,
                                    "expression": "${!!!event.data.validateResult.error}" //触发表单校验结果会存入validateResult，amis 3.2不支持，高版本比如 3.5.3支持
                                }
                            ]
                        }
                    }
                },
                dialogButtons[1]
            ];
        }
        let actionShowEditDialog = {
            "actionType": "dialog",
            "dialog": {
                "type": "dialog",
                "id": dialogId,
                "title": `\${uiSchema.fields.${props.name}.label} ` + i18next.t('frontend_input_table_dialog_title_suffix'),
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
                    // "__parentForm": mode == "new" ? "$$" : "${__super.__super || {}}",
                    "__parentForm": mode == "new" ? "$$" : parentFormData,
                    "_master": "${_master}",
                    "global": "${global}",
                    "context": "${context}",
                    "uiSchema": "${uiSchema}",
                    "index": "${index}",//amis组件自带行索引,在节点嵌套情况下，当前节点如果是children属性下的子节点时，这里的index是当前节点在children中的索引，而不是外层父节点的index
                    "parent": "${__super.parent}",//amis组件自带父节点数据域数据，即节点嵌套情况下，当前节点为某个节点（比如A节点）的children属性下的子节点时，当前节点的父节点（即A节点）的数据域数据
                    // "__tableItems": `\${${props.name}}`
                    // 为了解决"弹出的dialog窗口中子表组件会影响页面布局界面中父作用域字段值"，比如设计字段布局微页面中的设置分组功能，弹出的就是子表dialog
                    // 所以这里使用json|toJson转一次，断掉event.data.__tableItems与上层任用域中props.name的联系
                    // "__tableItems": `\${${props.name}|json|toJson}`
                    // 在节点嵌套情况下，当前节点正好是带children属性的节点的话，这里弹出的dialog映射到的会是children数组，这是amis目前的规则，
                    // 所以这里加判断有children时，用__super.__super让映射到正确的作用域层，如果不加，则__tableItems取到的会是children数组，而不是整个子表组件的值
                    "__tableItems": `\${((children ? __super.__super['${props.name}'] : __super['${props.name}']) || [])|json|toJson}`,
                    "__isNewItem": false,
                    "inTableFormDialog": true,
                    ...(props.actionData || {})
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
                    },
                    "cancel": {
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": `
                                    // let __dialogId = "${dialogId}";
                                    // let dialog = event.context.scoped.getComponentById(__dialogId)
                                    if (event.data.__isNewItem){
                                        let scope = event.context.scoped;
                                        let fieldValue = event.data.__tableItems;//这里不可以_.cloneDeep，因为翻页form中用的是event.data.__tableItems，直接变更其值即可改变表单中的值
                                        // 新建一条空白行并保存到子表组件
                                        var parent = event.data.__super.parent;
                                        var primaryKey = "${primaryKey}";
                                        var __parentIndex = parent && _.findIndex(fieldValue, function(item){
                                            return item[primaryKey] == parent[primaryKey];
                                        });
                                        if(parent && __parentIndex < 0){
                                            let tableId = "${props.id}";
                                            let table = scope.getComponentById(tableId)
                                            // autoGeneratePrimaryKeyValue不为true的情况下，即子表组件input-table的pipeOut函数中会移除表单了子表字段的primaryKey字段值，
                                            // 此时行primaryKey字段值为空，但是pipeIn函数中已经为input-table自动生成过primaryKey字段值了，只是没有输出到表单字段值中而已
                                            // 所以上面从表单字段值中没找到__parentIndex，是因为此时行primaryKey字段值只经过pipeIn保存到table组件内而没有保存到tableService
                                            __parentIndex = _.findIndex(table.props.value, function(item){
                                                return item[primaryKey] == parent[primaryKey];
                                            });
                                        }
                                        if(parent){
                                            fieldValue[__parentIndex].children.pop();
                                            // 这里实测不需要fieldValue[__parentIndex] = ... 来重写整个父行让子表回显，所以没加相关代码
                                        }
                                        else{
                                            fieldValue.pop();
                                        }
                                        doAction({
                                            "componentId": "${props.id}",
                                            "actionType": "setValue",
                                            "args": {
                                                "value": fieldValue
                                            }
                                        });
                                    }

                                `
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
            // let onNewLineScript = `
            //     let newItem = {};
            //     if(event.data["${props.name}"]){
            //         // let fieldValue = event.data.__tableItems;
            //         // 这里不用__tableItems是因为新建的时候没有翻页，里面没有也不需要走__tableItems变量
            //         // let fieldValue = _.clone(event.data["${props.name}"]);
            //         let fieldValue = event.data["${props.name}"];
            //         fieldValue.push(newItem);
            //         doAction({
            //             "componentId": "${props.id}",
            //             "actionType": "setValue",
            //             "args": {
            //                 "value": fieldValue
            //             }
            //         });
            //         event.data.index = fieldValue.length - 1;
            //     }
            //     else{
            //         // 这里不可以执行event.data["${props.name}"]=[newItem]，数据域会断掉
            //         doAction({
            //             "componentId": "${props.id}",
            //             "actionType": "setValue",
            //             "args": {
            //                 "value": [newItem]
            //             }
            //         });
            //         event.data.index = 1;
            //     }
            // `;
            // let actionNewLine = {
            //     "actionType": "custom",
            //     "script": onNewLineScript
            // };
            // 新增行时不需要在弹出编辑表单前先加一行，因为会在编辑表单所在service初始化时判断到是新增就自动增加一行，因为这里拿不到event.data.__tableItems，也无法变更其值
            // actions = [actionNewLine, actionShowEditDialog];
            if (props.enableDialog === false) {
                actions = [
                    {
                        "actionType": "custom",
                        "script":  `
                            let scope = event.context.scoped;
                            let __wrapperServiceId = "${tableServiceId}";
                            let wrapperService = scope.getComponentById(__wrapperServiceId);
                            let wrapperServiceData = wrapperService.getData();
                            let lastestFieldValue = _.clone(wrapperServiceData["${props.name}"] || []);
                            lastestFieldValue.push({})
                            doAction({
                                "componentId": "${props.id}",
                                "actionType": "setValue",
                                "args": {
                                    "value": lastestFieldValue
                                }
                            });
                        `
                    }
                ]
            }else {
                actionShowEditDialog.dialog.data.__isNewItem = true;
                actions = [actionShowEditDialog];
            }
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
                    "title": `\${uiSchema.fields.${props.name}.label} ` + i18next.t('frontend_input_table_dialog_title_suffix'),
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
                        "__parentForm": parentFormData,
                        "_master": "${_master}",
                        "global": "${global}",
                        "context": "${context}",
                        "uiSchema": "${uiSchema}",
                        "index": "${index}",
                        "parent": "${__super.parent}",//amis组件自带父节点数据域数据，即节点嵌套情况下，当前节点为某个节点（比如A节点）的children属性下的子节点时，当前节点的父节点（即A节点）的数据域数据
                        // "__tableItems": `\${${props.name}}`
                        // 为了解决"弹出的dialog窗口中子表组件会影响页面布局界面中父作用域字段值"，比如设计字段布局微页面中的设置分组功能，弹出的就是子表dialog
                        // 所以这里使用json|toJson转一次，断掉event.data.__tableItems与上层任用域中props.name的联系
                        // "__tableItems": `\${${props.name}|json|toJson}`
                        // "__tableItems": `\${((__super.parent ? __super.__super.${props.name} : __super.${props.name}) || [])|json|toJson}`
                        // 在节点嵌套情况下，当前节点正好是带children属性的节点的话，这里弹出的dialog映射到的会是children数组，这是amis目前的规则，
                        // 所以这里加判断有children时，用__super.__super让映射到正确的作用域层，如果不加，则__tableItems取到的会是children数组，而不是整个子表组件的值
                        "__tableItems": `\${((children ? __super.__super['${props.name}'] : __super['${props.name}']) || [])|json|toJson}`,
                        "inTableFormDialog": true,
                        ...(props.actionData || {})
                    },
                    ...(props.dialog || {})
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
            // 也因为这里clone没有直接删除，所以弹出编辑表单提交事件中event.data.__tableItems中取到的值会有被删除的行数据为undefined
            let lastestFieldValue = _.clone(wrapperServiceData["${props.name}"]);
            var currentIndex = event.data.index;
            var parent = event.data.__super.parent;
            var primaryKey = "${primaryKey}";
            var __parentIndex = parent && _.findIndex(lastestFieldValue, function(item){
                return item[primaryKey] == parent[primaryKey];
            });
            if(parent && __parentIndex < 0){
                let tableId = "${props.id}";
                let table = scope.getComponentById(tableId)
                // autoGeneratePrimaryKeyValue不为true的情况下，即子表组件input-table的pipeOut函数中会移除表单了子表字段的primaryKey字段值，
                // 此时行primaryKey字段值为空，但是pipeIn函数中已经为input-table自动生成过primaryKey字段值了，只是没有输出到表单字段值中而已
                // 所以上面从表单字段值中没找到__parentIndex，是因为此时行primaryKey字段值只经过pipeIn保存到table组件内而没有保存到tableService
                __parentIndex = _.findIndex(table.props.value, function(item){
                    return item[primaryKey] == parent[primaryKey];
                });
            }
            if(parent){
                lastestFieldValue[__parentIndex].children.splice(currentIndex, 1);
                // 重写父节点，并且改变其某个属性以让子节点修改的内容回显到界面上
                lastestFieldValue[__parentIndex] = Object.assign({}, lastestFieldValue[__parentIndex], {
                    children: lastestFieldValue[__parentIndex].children,
                    __fix_rerender_after_children_modified_tag: new Date().getTime()
                });
            }
            else{
                lastestFieldValue.splice(currentIndex, 1);
            }
            let fieldPrefix = "${props.fieldPrefix || ''}";
            if(fieldPrefix){
                let getTableValueWithoutFieldPrefix = new Function('v', 'f', "return (" + ${getTableValueWithoutFieldPrefix.toString()} + ")(v, f)");
                lastestFieldValue = getTableValueWithoutFieldPrefix(lastestFieldValue, fieldPrefix);
            }
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
        "label": i18next.t('frontend_input_table_button_new'),//"新增",
        "type": "button",
        "icon": "fa fa-plus",
        "onEvent": {
            "click": {
                "actions": await getButtonActions(props, "new")
            }
        },
        "level": "link",
        "className": "text-gray-500",
        "size": "xs"
    };
}

async function getButtonEdit(props, showAsInlineEditMode) {
    return {
        "type": "button",
        "label": "",
        "icon": `fa fa-${showAsInlineEditMode ? "expand-alt" : "pencil"}`,//inline edit模式时显示为放开按钮，只读时显示为笔按钮
        "level": "link",
        "className": "text-gray-400",
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
        "className": "text-gray-400",
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
        "level": "link",
        "className": "text-gray-400 steedos-delete-button",
        "icon": "fa fa-trash-alt",
        "actionType": "dialog",
        "dialog": {
            "title": "${'CustomLabels.alert_info' | t}",
            "actions": [
                {
                    "type": "button",
                    "label": "${'Cancel' | t}",
                    "close": true
                },
                {
                    "type": "button",
                    "label": i18next.t('frontend_input_table_button_delete'),
                    "level": "danger",
                    "onEvent": {
                        "click": {
                            "actions": await getButtonActions(props, "delete")
                        }
                    },
                    "close": true
                }
            ],
            "body": [
                {
                    "tpl": i18next.t('frontend_delete_many_confirm_text'),
                    "type": "tpl"
                }
            ]
        }
    }
}


// 子表打印渲染器开关（issue steedos/steedos-plugins#744 子表打印线条失真）
// 命中条件（满足任一即可）：
//   1. props.print === true —— 唯一正式数据流；由 page_instance_print.page.amis.json
//      在 adaptor 里给 steedos-instance-detail 组件传 print:true，AmisInstanceDetail
//      透传给 getFlowFormSchema，flow.js 的 case "table" 再写入子表 schema.print。
//   2. localStorage.STEEDOS_PRINT_INPUT_TABLE = '1' —— 调试 / 灰度兜底，方便在
//      普通审批查看页（非打印 URL）临时启用打印渲染器排查问题，不影响生产。
// 命中后 getAmisInputTableSchema 会绕开 amis input-table / antd Table，
// 改用纯静态 HTML 表格渲染，彻底规避超宽列布局导致的文字压扁失真问题。
const isPrintInputTableEnabled = (props) => {
    try {
        if (props && props.print === true) return true;
        if (typeof window === 'undefined') return false;
        if (window.localStorage && window.localStorage.STEEDOS_PRINT_INPUT_TABLE === '1') return true;
    } catch (e) {
        // 任意环境异常都视为未开启，回落到原 amis input-table 路径
    }
    return false;
};

// POC（issue steedos/steedos-widgets#651）: 打印 cell 渲染改为复用 amis static-* renderer。
// 命中条件（满足任一即可）：
//   1. localStorage.STEEDOS_PRINT_INPUT_TABLE_REUSE_AMIS === '1' —— 调试/灰度持久化开关
//   2. URL search 参数 ?reuseAmis=1 —— chrome-devtools MCP / 浏览器手工切换更方便，
//      navigate 一次即可在 baseline ↔ POC 之间对比，无需 reload 重设 localStorage
// 仅在打印分支已经被 isPrintInputTableEnabled 命中后再额外判定，flag off 时走原 hand-port 路径
const isPrintInputTableReuseAmisEnabled = () => {
    try {
        if (typeof window === 'undefined') return false;
        if (window.localStorage && window.localStorage.STEEDOS_PRINT_INPUT_TABLE_REUSE_AMIS === '1') return true;
        if (window.location && window.location.search) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('reuseAmis') === '1') return true;
        }
    } catch (e) {
        // 任意环境异常都视为未开启，回落到 hand-port 打印分支
    }
    return false;
};

const escapeHtmlForPrintTable = (text) => {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// 将子表渲染为纯静态 HTML 表格，绕开 amis input-table / antd Table 的复杂 DOM
// 表头取 field.label，行值直接取 row[field.name]；select / lookup 暂走基础格式化
// 数值 / 金额 / 日期 等非文本类字段不按字符断行，避免"23232"被竖排折成"2/3/2/3/2"
const isPrintInputTableNoWrapType = (type) => {
    return /^(number|currency|percent|date|datetime|time)$/.test(type || '');
};

const getPrintInputTableSchema = (props) => {
    const fields = (props.fields || []).filter((f) => f && f.name);
    const showIndex = props.showIndex !== false;
    const visibleFieldNames = fields.map((f) => f.name);

    // 字段在进入打印链路时已被上层转换成 amis 形式：
    // - readonly 文本类: { type: 'static', className: '...steedos-field-input-readonly' }
    // - readonly number 字段未配 precision: { type: 'static', className: '...steedos-field-number-readonly' }
    //   → 非打印态 amis 渲染原值（无千分位），打印态对齐
    // - readonly currency / 配 precision 的 number: { type: 'input-number', static: true, precision: 'N' }
    //   → 非打印态 amis input-number 在 static 模式下按 precision 千分位渲染，打印态对齐
    // - readonly 选项类: { type: 'static', className: '...steedos-field-select-readonly', tpl: '<% ... %>' }
    //   → 非打印态用 lodash 模板把值映射为 label，打印态按 row 求值同一 tpl
    // 不再为打印态额外加 nowrap class —— 非打印态没有，规则保持一致。
    const isThousandsField = (f) => !!(f && f.type === 'input-number');

    // 把 tpl 字段的 lodash 模板预编译并以 window 全局表暂存，运行时按 (tableKey|fieldName) 查找调用。
    // 与 amis 内置 tpl-lodash 引擎一致：variable: 'data'，使得 tpl 内的 data["xxx"] 等价于 row["xxx"]。
    const tableKey = (props.id || props.name || 'tbl') + '_' + uuidv4();
    if (typeof window !== 'undefined') {
        window.__steedosPrintFieldTpls = window.__steedosPrintFieldTpls || {};
    }
    // 与 amis-core/utils/tpl-lodash.js 对齐：上层 (workflow/flow.js / converter/amis/tpl.js)
    // 生成的 tpl 经常调用 amis-formula 暴露的过滤器函数（最常见的是 date / number / formatDate）。
    // 这些 tpl 在 amis 运行时由 tpl-lodash 引擎传 imports 后执行；本打印分支自行预编译时
    // 必须把同样的辅助函数注入到 lodash template 的 imports 中，否则会抛
    // "date is not defined" 之类的错误，进而被 _printTableEvalFieldTpl 捕获并落回原值，
    // 表现为子表日期列渲染成 "2026-02-10T00:00:00.000Z" 这类 ISO 字符串。
    const _printTplImports = {
        // date(value, format)：与 amis-formula filters.date 行为对齐
        // - 入参可以是 Date 实例 / ISO 字符串 / 时间戳数字
        // - format 为空时默认 "YYYY-MM-DD HH:mm:ss"
        // - date 字段 (UTC midnight) 仍按本地时区取值，与 amis 现有行为一致；
        //   如需严格 UTC 显示请在上层 tpl 里改用 dateInput / inputFormat
        date: function (value, format) {
            if (value === null || value === undefined || value === '') return '';
            const dt = value instanceof Date ? value : new Date(value);
            if (isNaN(dt.getTime())) return String(value);
            const f = format || 'YYYY-MM-DD HH:mm:ss';
            const pad = (n) => (n < 10 ? '0' + n : '' + n);
            return f
                .replace(/YYYY/g, dt.getFullYear())
                .replace(/MM/g, pad(dt.getMonth() + 1))
                .replace(/DD/g, pad(dt.getDate()))
                .replace(/HH/g, pad(dt.getHours()))
                .replace(/mm/g, pad(dt.getMinutes()))
                .replace(/ss/g, pad(dt.getSeconds()));
        },
        formatDate: function (value, format, inputFormat) {
            return _printTplImports.date(value, format || 'YYYY-MM-DD HH:mm:ss');
        },
        // number(value, precision)：千分位 + 可选小数位
        number: function (value, precision) {
            if (value === null || value === undefined || value === '') return '';
            const n = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));
            if (!isFinite(n)) return String(value);
            if (typeof precision === 'number') {
                return n.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
            }
            const s = String(value).replace(/,/g, '');
            const dot = s.indexOf('.');
            const frac = dot >= 0 ? s.length - dot - 1 : 0;
            return n.toLocaleString('en-US', { minimumFractionDigits: frac, maximumFractionDigits: Math.max(frac, 0) });
        },
        formatNumber: function (value, precision) {
            return _printTplImports.number(value, precision);
        },
    };
    fields.forEach((f) => {
        if (f && typeof f.tpl === 'string' && f.tpl) {
            try {
                const fn = lodashTemplate(f.tpl, {
                    variable: 'data',
                    interpolate: /<%=([\s\S]+?)%>/g,
                    imports: _printTplImports,
                });
                if (typeof window !== 'undefined') {
                    window.__steedosPrintFieldTpls[tableKey + '|' + f.name] = fn;
                }
            } catch (e) {
                // tpl 编译失败时回退到原值渲染，不阻塞表格输出
            }
        }
    });

    const headerCells = [];
    if (showIndex) {
        headerCells.push('<th class="steedos-print-input-table__index">#</th>');
    }
    fields.forEach((f) => {
        headerCells.push('<th>' + escapeHtmlForPrintTable(f.label || f.name) + '</th>');
    });

    const rowsExpr = JSON.stringify(props.name);
    const visibleFieldNamesJson = JSON.stringify(visibleFieldNames);

    // 需要千分位的字段名集合（仅 input-number 类型）
    const numericFieldNames = fields.filter(isThousandsField).map((f) => f.name);
    const numericFieldNamesJson = JSON.stringify(numericFieldNames);

    // 图片 / 文件字段需要输出 <img> / <a> 等原始 HTML，单元格用 <%= %> 不转义；
    // 其他字段一律 <%- %> 转义，避免文本被解释为 HTML。
    // 上层（converter/amis/fields/file.js + AmisSteedosField.tsx）已经把
    // 'avatar' 也走 image schema，这里把 avatar 也按 image 处理。
    const isPrintImageType = (f) => f && (f.type === 'image' || f.type === 'avatar');
    const isPrintFileType = (f) => f && f.type === 'file';
    // 日期类字段：实测大量历史 instances.values 的子表行不带 _display，
    // 服务端只回 ISO 字符串（如 "2026-02-10T00:00:00.000Z"）。打印态如果
    // 不格式化就会原样输出 ISO，违反"与非打印态视觉一致"原则。
    // 这里在构建期按字段类型分发到 _printTableFormatDate，运行时再决定格式。
    const isPrintDateType = (f) => f && (f.type === 'date' || f.type === 'datetime' || f.type === 'time');

    // 把每个日期字段的 format / 类型预先编码到 tpl 中（避免运行时再查 field meta）
    // 默认 format 与 AmisSteedosField.tsx + converter/amis/fields/index.js 中的 inputFormat 对齐：
    //   - date: YYYY-MM-DD（数据是 UTC midnight，按 UTC 取年月日，避免被时区前移一天）
    //   - datetime: YYYY-MM-DD HH:mm（本地时区）
    //   - time: HH:mm
    const getPrintDateDefaultFormat = (type) => {
        if (type === 'date') return 'YYYY-MM-DD';
        if (type === 'datetime') return 'YYYY-MM-DD HH:mm';
        if (type === 'time') return 'HH:mm';
        return 'YYYY-MM-DD';
    };

    const cellTemplates = fields
        .map((f) => {
            const nameJson = JSON.stringify(f.name);
            let valueExpr;
            let useRawHtml = false;
            if (isPrintImageType(f)) {
                valueExpr = '_printTableFormatImage(row, ' + nameJson + ')';
                useRawHtml = true;
            } else if (isPrintFileType(f)) {
                valueExpr = '_printTableFormatFile(row, ' + nameJson + ')';
                useRawHtml = true;
            } else if (isPrintDateType(f)) {
                const fmtJson = JSON.stringify(f.format || getPrintDateDefaultFormat(f.type));
                const typeJson = JSON.stringify(f.type);
                valueExpr = '_printTableFormatDate(row, ' + nameJson + ', ' + typeJson + ', ' + fmtJson + ')';
            } else if (f && typeof f.tpl === 'string' && f.tpl) {
                valueExpr = '_printTableEvalFieldTpl(row, ' + nameJson + ')';
            } else {
                valueExpr = '_printTableFormatCell(row, ' + nameJson + ')';
            }
            const interpolate = useRawHtml ? '<%= ' : '<%- ';
            return '<td>' + interpolate + valueExpr + ' %></td>';
        })
        .join('');
    const indexCell = showIndex ? '<td class="steedos-print-input-table__index"><%- i + 1 %></td>' : '';

    const tableKeyJson = JSON.stringify(tableKey);

    // 样式已迁移到 packages/@steedos-widgets/amis-object/src/amis/AmisInputTable.less
    const tpl = '<div class="steedos-print-input-table-wrap" data-name="' + escapeHtmlForPrintTable(props.name) + '">'
        + '<table class="steedos-print-input-table">'
        + '<thead><tr>' + headerCells.join('') + '</tr></thead>'
        + '<tbody>'
        + '<% '
        // 注意：本 tpl 由若干 '...' 字符串用 + 拼接而成，
        // 行尾不可写 // 行内注释——否则 `+ // comment` 会让下一行开头的
        // `+'string'` 退化为一元 `+`，把字符串转成 NaN 注入到 tpl 里。
        // 另外：tpl 字符串中 **绝对不要出现裸的 `$` 字符**（除非紧跟在 `\\` 后面）。
        // amis 内置 tpl 引擎(builtin)会优先匹配带 `$` 的模板，从而抢占 lodash 引擎，
        // 导致 `<% %>` 块被完全忽略且最终返回空。
        // 所有说明请放在拼接表达式上方，不要写在 + 之间。
        + 'var _printTableRows = (data && data[' + rowsExpr + ']) || []; '
        + 'var _printTableVisibleFields = ' + visibleFieldNamesJson + '; '
        + 'var _printTableNumericFields = ' + numericFieldNamesJson + '; '
        + 'var _printTableIsNumericField = function(name){ '
        +   'for (var i = 0; i < _printTableNumericFields.length; i++) { if (_printTableNumericFields[i] === name) return true; } '
        +   'return false; '
        + '}; '
        + 'var _printTableFormatNumber = function(v){ '
        +   'var n = typeof v === "number" ? v : Number(String(v).replace(/,/g, "")); '
        +   'if (!isFinite(n)) return null; '
        +   'var s = String(v).replace(/,/g, ""); '
        +   'var dot = s.indexOf("."); '
        +   'var frac = dot >= 0 ? s.length - dot - 1 : 0; '
        +   'return n.toLocaleString("en-US", { minimumFractionDigits: frac, maximumFractionDigits: Math.max(frac, 0) }); '
        + '}; '
        // 字段类型覆盖矩阵详见 .github/instructions/print-input-table.instructions.md §4
        //   ✅ text / textarea / autonumber / url / email / password —— 原值
        //   ✅ number / currency / percent（amis 中间 type=input-number）—— 千分位
        //   ✅ select / boolean / lookup（带 tpl 的）—— _printTableEvalFieldTpl 预编译求值
        //   ✅ boolean（无 tpl 兜底）—— 是 / 否
        //   ✅ 数组 / 对象 —— join(",") 或 name/label/value 取值
        //   ✅ date / datetime / time / formula / summary / master_detail（单值）
        //       —— 上层 Tpl.getDateTpl / getDateTimeTpl / getUiFieldTpl / getNameTpl 都返回 `${_display.<name>}`，
        //          这里走 _display 兜底分支即对齐非打印态
        //   ✅ multi-select / multi-lookup / multi-master_detail
        //       —— _display 为数组时按 label/name/value 取出后 join(", ")（修复了之前把数组当对象返回空的回归）
        //   ✅ image / avatar / multi-image —— _printTableFormatImage 输出 <img>，src 优先取 _display.url，
        //       回退到 row[name].url，再回退到字符串原值。多图按 _display 数组逐个渲染
        //   ✅ file / multi-file —— _printTableFormatFile 输出 <a href=url>name</a>，
        //       字段值 / _display 同 image 处理
        //   ⏳ html / markdown / color —— 低优先级，未覆盖；上层 readonly 模式分别走 'html' / 'static-markdown' / 'static-color'
        //       渲染器，需要 hand-port 到 print。当前会落入字符串兜底分支，原样转义输出
        // 新增字段类型流程见 .github/instructions/print-input-table.instructions.md
        + 'var _printTableFormatCell = function(row, name){ '
        +   'if (!row) return ""; '
        +   'var d = row._display && row._display[name]; '
        +   'if (d !== null && d !== undefined && d !== "") { '
        +     'if (Array.isArray(d)) { '
        +       'return d.map(function(item){ '
        +         'if (item === null || item === undefined) return ""; '
        +         'if (typeof item === "object") return item.label || item.name || item.value || ""; '
        +         'return String(item); '
        +       '}).filter(function(s){ return s !== ""; }).join(", "); '
        +     '} '
        +     'if (typeof d === "object") return d.label || d.name || d.value || ""; '
        +     'return String(d); '
        +   '} '
        +   'var v = row[name]; '
        +   'if (v === null || v === undefined) return ""; '
        +   'if (typeof v === "boolean") return v ? "是" : "否"; '
        +   'if (_printTableIsNumericField(name) && (typeof v === "number" || typeof v === "string")) { '
        +     'var fn = _printTableFormatNumber(v); '
        +     'if (fn !== null) return fn; '
        +   '} '
        +   'if (Array.isArray(v)) { '
        +     'return v.map(function(item){ '
        +       'if (item && typeof item === "object") return item.name || item.label || item.value || JSON.stringify(item); '
        +       'return String(item); '
        +     '}).join(", "); '
        +   '} '
        +   'if (typeof v === "object") return v.name || v.label || v.value || JSON.stringify(v); '
        +   'return String(v); '
        + '}; '
        // HTML 转义辅助：tpl 里没法直接复用闭包外的 escapeHtmlForPrintTable，所以这里再写一份
        + 'var _printTableEscapeHtml = function(s){ '
        +   'if (s === null || s === undefined) return ""; '
        +   'return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\'/g, "&#39;"); '
        + '}; '
        // 图片 / 文件 字段共用的取值规范化：返回 [{url, name}] 数组
        // 优先用 _display[name]（服务端通常已注入 {url, name, value}），
        // 兜底用 row[name] 自身（可能是字符串 URL / {url} / 数组）
        + 'var _printTableNormalizeFiles = function(row, name){ '
        +   'var pick = function(it){ '
        +     'if (it === null || it === undefined) return null; '
        +     'if (typeof it === "string") return { url: it, name: it }; '
        +     'if (typeof it === "object") { '
        +       'var url = it.url || it.src || it.value || ""; '
        +       'var label = it.name || it.label || ""; '
        +       'if (!url && !label) return null; '
        +       'return { url: url, name: label || url }; '
        +     '} '
        +     'return null; '
        +   '}; '
        +   'var src = (row && row._display && row._display[name]); '
        +   'if (src === null || src === undefined || src === "") { src = row ? row[name] : null; } '
        +   'if (src === null || src === undefined || src === "") return []; '
        +   'var arr = Array.isArray(src) ? src : [src]; '
        +   'var out = []; '
        +   'for (var i = 0; i < arr.length; i++) { var picked = pick(arr[i]); if (picked) out.push(picked); } '
        +   'return out; '
        + '}; '
        // 打印态图片：固定缩略尺寸（max-height:60px / max-width:120px），避免高分图片把行撑爆
        // 多图横向排列，间距 4px
        + 'var _printTableFormatImage = function(row, name){ '
        +   'var items = _printTableNormalizeFiles(row, name); '
        +   'if (!items.length) return ""; '
        +   'return items.map(function(it){ '
        +     'var url = _printTableEscapeHtml(it.url); '
        +     'var alt = _printTableEscapeHtml(it.name || ""); '
        +     'if (!url) return ""; '
        +     'return "<img src=\\"" + url + "\\" alt=\\"" + alt + "\\" class=\\"steedos-print-input-table__img\\" />"; '
        +   '}).join(""); '
        + '}; '
        // 打印态文件：文件名 + 下载链接；多文件用空格 + 换行分隔
        + 'var _printTableFormatFile = function(row, name){ '
        +   'var items = _printTableNormalizeFiles(row, name); '
        +   'if (!items.length) return ""; '
        +   'return items.map(function(it){ '
        +     'var url = _printTableEscapeHtml(it.url); '
        +     'var label = _printTableEscapeHtml(it.name || it.url || ""); '
        +     'if (!url) return label; '
        +     'return "<a href=\\"" + url + "\\" target=\\"_blank\\" class=\\"steedos-print-input-table__file\\">" + label + "</a>"; '
        +   '}).join(" "); '
        + '}; '
        // 打印态日期：按字段 format 格式化 ISO 字符串 / Date 对象
        // 设计要点：
        //   1. 服务端对 date / datetime 子表行通常不回 _display，只回 ISO 字符串
        //      （如 "2026-02-10T00:00:00.000Z"），打印态如果不格式化就会原样输出
        //   2. 与 amis 行为对齐：date 字段的 ISO 是 UTC midnight，必须按 UTC 取
        //      年月日；否则东 8 区会把 2026-02-10 显示成 2026-02-09
        //   3. format 支持的 token：YYYY, MM, DD, HH, mm, ss（再保留原值的其它字符）
        //      这与 Steedos 上下游配置 (inputFormat: "YYYY-MM-DD" / "YYYY-MM-DD HH:mm") 一致
        + 'var _printTableFormatDate = function(row, name, ftype, fmt){ '
        +   'if (!row) return ""; '
        +   'var d = row._display && row._display[name]; '
        +   'if (d !== null && d !== undefined && d !== "") { '
        +     'if (typeof d === "string" || typeof d === "number") return String(d); '
        +     'if (typeof d === "object") return d.label || d.name || d.value || ""; '
        +   '} '
        +   'var v = row[name]; '
        +   'if (v === null || v === undefined || v === "") return ""; '
        +   'var dt = (v instanceof Date) ? v : new Date(v); '
        +   'if (isNaN(dt.getTime())) return String(v); '
        +   'var useUTC = (ftype === "date"); '
        +   'var pad = function(n){ return n < 10 ? "0" + n : "" + n; }; '
        +   'var yyyy = useUTC ? dt.getUTCFullYear() : dt.getFullYear(); '
        +   'var MM = pad((useUTC ? dt.getUTCMonth() : dt.getMonth()) + 1); '
        +   'var DD = pad(useUTC ? dt.getUTCDate() : dt.getDate()); '
        +   'var HH = pad(useUTC ? dt.getUTCHours() : dt.getHours()); '
        +   'var mm = pad(useUTC ? dt.getUTCMinutes() : dt.getMinutes()); '
        +   'var ss = pad(useUTC ? dt.getUTCSeconds() : dt.getSeconds()); '
        +   'var f = fmt || "YYYY-MM-DD"; '
        +   'return f.replace(/YYYY/g, yyyy).replace(/MM/g, MM).replace(/DD/g, DD).replace(/HH/g, HH).replace(/mm/g, mm).replace(/ss/g, ss); '
        + '}; '
        + 'var _printTableEvalFieldTpl = function(row, name){ '
        +   'try { '
        +     'var k = ' + tableKeyJson + ' + "|" + name; '
        +     'var fn = (typeof window !== "undefined") && window.__steedosPrintFieldTpls && window.__steedosPrintFieldTpls[k]; '
        +     'if (typeof fn === "function") { var s = fn(row || {}); return s == null ? "" : String(s); } '
        +   '} catch(e) {} '
        +   'return _printTableFormatCell(row, name); '
        + '}; '
        + '_printTableRows.forEach(function(row, i){ '
        + '%>'
        + '<tr>' + indexCell + cellTemplates + '</tr>'
        + '<% }); %>'
        + '</tbody>'
        + '</table>'
        + '</div>';

    return {
        type: 'control',
        label: props.label,
        labelClassName: props.label ? props.labelClassName : 'none',
        labelRemark: props.labelRemark,
        labelAlign: props.labelAlign,
        mode: props.mode || null,
        visibleOn: props.$schema && props.$schema.visibleOn,
        visible: props.$schema && props.$schema.visible,
        hiddenOn: props.$schema && props.$schema.hiddenOn,
        hidden: props.$schema && props.$schema.hidden,
        required: props.required,
        className: 'steedos-input-table steedos-print-input-table-host',
        body: {
            type: 'tpl',
            tpl,
            className: 'steedos-print-input-table-tpl',
        },
    };
};

// ============================================================================
// POC（issue steedos/steedos-widgets#651）：复用 amis static-* renderer 的打印 cell 渲染
// ----------------------------------------------------------------------------
// 设计要点：
//   1. 外层 <table> 容器仍然由 amis 渲染为原生 DOM —— 用 amis 内置 `table-view` renderer，
//      源码 node_modules/amis/esm/renderers/TableView.js 直接 React.createElement('table'/
//      'tbody'/'tr'/'td')，没有任何 <div> 包裹（每个 cell.body 通过 render('td', body)
//      支持嵌套任意 amis 子 schema），完整规避了 HTML 解析器把 <tr>/<td> foster-parent
//      到 <table> 之外的失真根因；
//   2. table-view 的 `trs` 是一个静态数组 —— 子表行数运行时才知道，所以套一层 amis
//      `service`，用 `dataProvider`（客户端函数）把 `data[tableName]` 转换为
//      `__printTrs` (含表头 + 行) 再交给 table-view；
//   3. 每个 td.body 都是一份 amis 子 schema 对象（POC T0 阶段只支持 text 类，对应
//      `{ type: 'tpl', tpl: '<值>' }`；后续按 issue #651 验证矩阵逐步替换为
//      `static-date / static-image / static-mapping` 等真正的 static-* renderer），
//      与非打印态 amis readonly 共用同一套字段格式化逻辑；
//   4. 外层 className 直接复用 `.steedos-print-input-table` —— PR #650 已校准的边框 /
//      字号 / 行高 / 列宽 / `min-width:max-content` / `@media print` 横向滚动条等
//      CSS 决策（详见 AmisInputTable.less §219+）全部按文档要求保留不动。
// 命中条件：见 isPrintInputTableReuseAmisEnabled（localStorage 持久化 + URL 参数实时切换）
// POC（issue #651）字段类型 → amis cell body schema 的纯函数映射已抽离到
// `./printInputTableCell.js`（leaf module），便于 Jest 单测直接 import 而不连带
// converter/amis/form.js → utils/object.ts 等 TS 依赖。
// 这里只保留对外接口，dataProvider 闭包通过 import 复用。

const getPrintInputTableReuseAmisSchema = (props) => {
    const fields = (props.fields || []).filter((f) => f && f.name);
    const showIndex = props.showIndex !== false;
    const tableName = props.name;

    // 表头行 trs[0]：表头 cell 走最朴素的 tpl 字符串，避免 static renderer 默认 padding 影响
    const headerTds = [];
    if (showIndex) {
        headerTds.push({
            body: '#',
            align: 'center',
            style: { fontWeight: 'bold', background: 'transparent', width: '40px' },
        });
    }
    fields.forEach((f) => {
        headerTds.push({
            body: String(f.label || f.name),
            style: { fontWeight: 'bold', background: 'transparent' },
        });
    });

    // 序列化字段 spec 给 dataProvider 函数体使用
    const fieldSpecsJson = JSON.stringify(fields.map(normalizeFieldSpecForPrint).filter(Boolean));
    const tableNameJson = JSON.stringify(tableName);
    const showIndexLiteral = showIndex ? 'true' : 'false';

    // dataProvider 客户端函数：拿到 service 作用域内的 data，从 data[tableName] 提取子表行，
    // 转成 table-view 期望的 { tds: [{ body }] } 数组结构，setData 注入到 __printTrs。
    // 头行也一并塞进同一数组首位，避免 amis 端再做静态头 + 动态体的合并。
    //
    // 注意：amis Service.dataProvider 支持「函数」或「字符串源码」两种形式（参见
    //   node_modules/amis/esm/renderers/Service.js initDataProviders）。这里我们用函数对象
    //   传入，amis 直接执行，无 eval 安全 / 序列化问题。
    //
    // 字段类型 → cell schema 的映射统一收敛到 buildPrintCellSchema（模块级纯函数，可单测）。
    // 闭包对 buildPrintCellSchema 的引用稳定（amis 不会序列化 schema），运行时直接调用。
    const cellMapper = buildPrintCellSchema;
    const headerTdsJson = JSON.stringify(headerTds);
    const dataProvider = function (data, setData) {
        try {
            const headerRow = { tds: JSON.parse(headerTdsJson) };
            const rows = (data && data[JSON.parse(tableNameJson)]) || [];
            const fieldSpecs = JSON.parse(fieldSpecsJson);
            const includeIndex = JSON.parse(showIndexLiteral);
            const bodyTrs = [];
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i] || {};
                const tds = [];
                if (includeIndex) {
                    tds.push({
                        body: { type: 'tpl', tpl: String(i + 1) },
                        align: 'center',
                        style: { width: '40px' },
                    });
                }
                for (let j = 0; j < fieldSpecs.length; j++) {
                    const spec = fieldSpecs[j];
                    const val = row[spec.name];
                    // 把服务端预格式化的显示值 _display[name] 透传给 cellMapper，
                    // 让 select / lookup / user / formula 等带 display 的字段优先用 label。
                    const disp = row._display && row._display[spec.name];
                    tds.push({ body: cellMapper(spec, val, disp) });
                }
                bodyTrs.push({ tds });
            }
            setData({ __printTrs: [headerRow].concat(bodyTrs) });
        } catch (e) {
            setData({ __printTrs: [{ tds: JSON.parse(headerTdsJson) }] });
        }
    };

    return {
        type: 'control',
        label: props.label,
        labelClassName: props.label ? props.labelClassName : 'none',
        labelRemark: props.labelRemark,
        labelAlign: props.labelAlign,
        mode: props.mode || null,
        visibleOn: props.$schema && props.$schema.visibleOn,
        visible: props.$schema && props.$schema.visible,
        hiddenOn: props.$schema && props.$schema.hiddenOn,
        hidden: props.$schema && props.$schema.hidden,
        required: props.required,
        className: 'steedos-input-table steedos-print-input-table-host',
        body: {
            type: 'service',
            className: 'steedos-print-input-table-wrap',
            dataProvider: dataProvider,
            body: {
                type: 'table-view',
                className: 'steedos-print-input-table',
                border: true,
                borderColor: '#000',
                padding: '4px 6px',
                trs: '${__printTrs}',
            },
        },
    };
};

export const getAmisInputTableSchema = async (props) => {
    // 命中打印场景时直接走纯静态 HTML 表格渲染器，绕过 amis input-table → antd Table 复杂 DOM，
    // 修复 A4 打印下子表线条 / 文字被压缩失真的问题（steedos/steedos-plugins#744）
    if (isPrintInputTableEnabled(props)) {
        // POC（issue steedos/steedos-widgets#651）：flag 开启时切换到「外层 table-view 原生 <table>
        //   + 每个 cell body 复用 amis static-* renderer」路径，目的是消灭 _printTable* hand-port 分支。
        // flag 未开启时保持 PR #650 已合 staging 的纯静态 HTML 表格行为不变。
        if (isPrintInputTableReuseAmisEnabled()) {
            return getPrintInputTableReuseAmisSchema(props);
        }
        return getPrintInputTableSchema(props);
    }
    if (!props.id) {
        props.id = "steedos_input_table_" + props.name + "_" + Math.random().toString(36).substr(2, 9);
    }
    let primaryKey = getTablePrimaryKey(props);
    let showOperation = props.showOperation;
    if (showOperation !== false) {
        showOperation = true;
    }
    let fieldPrefix = props.fieldPrefix;
    let fields = props.fields || [];
    if (fieldPrefix) {
        fields = getTableFieldsWithoutFieldPrefix(fields, fieldPrefix);
    }
    let serviceId = getComponentId("table_service", props.id);
    let buttonsForColumnOperations = [];
    let inlineEditMode = props.inlineEditMode;
    let showAsInlineEditMode = inlineEditMode && props.editable;
    if (showOperation) {
        if (props.enableDialog !== false) {
            if (props.editable) {
                let showEditButton = true;
                if (showAsInlineEditMode) {
                    // 始终显示弹出子表表单按钮，如果需要判断只在有列被隐藏时才需要显示弹出表单按钮放开下面的if逻辑就好
                    showEditButton = true;
                    // // inline edit模式下只在有列被隐藏时才需要显示编辑按钮
                    // if (props.columns && props.columns.length > 0 && props.columns.length < fields.length) {
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
                // 如果想只在有列被隐藏时才需要显示查看按钮可以加上判断：if (props.columns && props.columns.length > 0 && props.columns.length < fields.length)
                let buttonViewSchema = await getButtonView(props);
                buttonsForColumnOperations.push(buttonViewSchema);
            }
        }
        
        if (props.removable) {
            let buttonDeleteSchema = await getButtonDelete(props);
            buttonsForColumnOperations.push(buttonDeleteSchema);
        }
    }
    let amis = props["input-table"] || props.amis || {};//额外支持"input-table"代替amis属性，是因为在字段yml文件中用amis作为key不好理解
    let inputTableSchema = {
        "type": "input-table",
        "mode": "normal",
        "name": props.name,
        //不可以addable/editable/removable设置为true，因为会在原生的操作列显示操作按钮图标，此开关实测只控制这个按钮显示不会影响功能
        // "addable": props.addable,
        // "editable": props.editable,
        // "removable": props.removable, 
        "draggable": props.draggable,
        "showIndex": props.showIndex,
        "perPage": props.perPage,
        "id": props.id,
        "columns": await getInputTableColumns(props, buttonsForColumnOperations),
        // "needConfirm": false, //不可以配置为false，否则，单元格都是可编辑状态，且很多static类型无法正常显示，比如static-mapping
        "strictMode": props.strictMode,
        "showTableAddBtn": false,
        "showFooterAddBtn": false,
        "className": props.tableClassName,
        "pipeIn": (value, data) => {
            // console.log("steedos input table pipeIn:", fieldPrefix, primaryKey);
            if (fieldPrefix) {
                value = getTableValueWithoutFieldPrefix(value, fieldPrefix);
            }
            value = getTableValueWithEmptyValue(value, fields);
            if (primaryKey) {
                // 这里临时给每行数据补上primaryKey字段值，如果库里不需要保存这里补上的字段值，pipeOut中会识别autoGeneratePrimaryKeyValue属性选择最终移除这里补上的字段值
                // 这里始终自动生成primaryKey字段值，而不是只在pipeOut输出整个子表字段值时才生成，是因为要支持当数据库里保存的子表字段行数据没有primaryKey字段值时的行嵌套模式（即节点的children属性）功能
                // 这里要注意，流程详细设置界面的字段设置功能中的子表组件中，数据库里保存的子表字段行数据是有primaryKey字段值的，它不依赖这里自动生成行primaryKey值功能
                value = getTableValueWithPrimaryKeyValue(value, primaryKey);
            }
            if (amis.pipeIn) {
                if (typeof amis.pipeIn === 'function') {
                    return amis.pipeIn(value, data);
                }
                else {
                    // TODO: 如果需要支持amis.pipeIn为字符串脚本在这里处理
                    // amis.pipeIn;
                }
            }
            return value;
        },
        "pipeOut": (value, data) => {
            // console.log("steedos input table pipeOut:", fieldPrefix, primaryKey);
            value = (value || []).map(function (item) {
                delete item.__fix_rerender_after_children_modified_tag;
                return item;
            });
            if (fieldPrefix) {
                value = getTableValuePrependFieldPrefix(value, fieldPrefix, primaryKey);
            }
            value = getTableValueWithoutEmptyValue(value, fields);
            if (props.autoGeneratePrimaryKeyValue === true) {
                // 如果需要把自动生成的primaryKey值输出保存的库中，则补全所有行中的primaryKey值
                // 这里如果不全部补全的话，初始从库里返回的字段值中拿到的行没primaryKey值的话就不会自动补上
                value = getTableValueWithPrimaryKeyValue(value, primaryKey, true);
            }
            else {
                // 默认情况下，也就是没有配置autoGeneratePrimaryKey时，最终输出的字段值要移除行中的primaryKey值
                // 需要注意如果没有配置autoGeneratePrimaryKey时，因为每次弹出行编辑窗口保存后都会先后进入pipeOut和pipeIn，
                // 这里删除掉了primaryKey值，所以primaryKey值每次弹出编辑窗口保存后都会给每行重新生成新的primaryKey值
                // 只有autoGeneratePrimaryKey配置为true时，每行的primaryKey字段值才会始终保持不变
                value = getTableValueWithoutPrimaryKeyValue(value, primaryKey);
            }
            if (amis.pipeOut) {
                if (typeof amis.pipeOut === 'function') {
                    return amis.pipeOut(value, data);
                }
                else {
                    // TODO: 如果需要支持amis.pipeOut为字符串脚本在这里处理
                    // amis.pipeOut;
                }
            }
            return value;
        },
        "required": props.required,
        "description": props.description
    };
    if (buttonsForColumnOperations.length) {
        inputTableSchema.columns.unshift({
            "name": "__op__",
            "type": "operation",
            "buttons": buttonsForColumnOperations,
            "width": 1,
            "className": "steedos-input-table-column-operation",
        });
    }
    // if (showAsInlineEditMode) {
    //     // 因为要支持不同的列上配置inlineEditMode属性，所有不可以把整个子表组件都设置为inlineEditMode
    //     inputTableSchema.needConfirm = false;
    // }
    if (amis) {
        // 支持配置amis属性重写或添加最终生成的input-table中任何属性。
        delete amis.id;//如果steedos-input-table组件配置了amis.id属性，会造成新建编辑行功能不生效
        delete amis.pipeIn;//该属性在上面合并过了
        delete amis.pipeOut;//该属性在上面合并过了
        Object.assign(inputTableSchema, amis);
    }
    const isAnyFieldHasDependOn = (fields || []).find(function (item) {
        return item.depend_on;
    });
    if (isAnyFieldHasDependOn) {
        // 有任意一个子字段有depend_on属性时，强制设置禁用静态模式，因为strictMode模式下，dependOn的字段值变更后，不会rerender整个子表
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
            "className": "steedos-input-table-footer",
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
    let className = "steedos-input-table";

    if (props.showIndex) {
        className += " steedos-show-index"
    }

    if (buttonsForColumnOperations.length) {
        className += " steedos-has-operations"
    }

    if (props.enableTree) {
        className += " steedos-tree-mode"
    }

    if (typeof props.className == "object") {
        className = {
            [className]: "true",
            ...props.className
        }
    } else if (typeof props.className == "string") {
        className = `${className} ${props.className} `
    }

    let schema = {
        "type": "control",
        "body": {
            "type": "service",
            "body": schemaBody,
            "id": serviceId,
            "className": "w-full"
        },
        "label": props.label,
        "labelClassName": props.label ? props.labelClassName : "none",
        "labelRemark": props.labelRemark,
        "labelAlign": props.labelAlign,
        //控制control的mode属性，https://aisuda.bce.baidu.com/amis/zh-CN/components/form/formitem#表单项展示
        "mode": props.mode || null,
        "visibleOn": props.$schema.visibleOn,
        "visible":  props.$schema.visible,
        "hiddenOn": props.$schema.hiddenOn,
        "hidden": props.$schema.hidden,
        "requiredOn": props.$schema.requiredOn,
        "required": props.required,
        className,
    };
    // console.log("=inputtable==schema===", schema);
    return schema;
}