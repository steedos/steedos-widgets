/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-09-01 15:40:28
 */

import { getFormBody } from './converter/amis/form';
import { getComparableAmisVersion } from './converter/amis/util';
import { clone, cloneDeep } from 'lodash';
import { uuidv4 } from '../utils/uuid';
import { i18next } from '../i18n';

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
function getTableValueWithPrimaryKeyValue(value, primaryKey) {
    if (!primaryKey) {
        return value;
    }
    return (value || []).map((itemValue) => {
        //这里不clone的话，会造成在pipeIn函数执行该函数后像pipeOut一样最终输出到表单项中，即库里把primaryKey字段值保存了
        const newItemValue = clone(itemValue);
        if (newItemValue[primaryKey]) {
            if (newItemValue.children) {
                newItemValue.children = getTableValueWithPrimaryKeyValue(newItemValue.children, primaryKey);
            }
            return newItemValue;
        }
        else {
            newItemValue[primaryKey] = uuidv4();
            if (newItemValue.children) {
                newItemValue.children = getTableValueWithPrimaryKeyValue(newItemValue.children, primaryKey);
            }
            return newItemValue;
        }
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
        // 这里不可以用quickEdit，因为amis存在bug：input-table内的字段在行编辑模式时会受到外层相同name的字段的影响 https://github.com/baidu/amis/issues/9653
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
            name: field.name
        }
    }
    else {
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
            name: field.name
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
                if(extendColumnProps.wrap != true){
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
            tableCell.className = " whitespace-nowrap ";
            if(buttonsForColumnOperations.length == 0 && !props.showIndex && index == 0) {
                tableCell.className += " antd-Table-primayCell"
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
            // 这里不clone的话，其值会带上__super属性
            currentFormValues = _.clone(currentFormValues);
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
                            }
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
    let body = await getFormBody(null, formFields);
    let primaryKey = getTablePrimaryKey(props);
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
            let uuidv4 = new Function("return (" + ${uuidv4.toString()} + ")()");
            var primaryKey = "${primaryKey}";
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
        `;
        let onSaveAndCopyItemScript = `
            let scope = event.context.scoped;
            let __formId = "${formId}";
            // let newItem = JSON.parse(JSON.stringify(event.data));
            let newItem = scope.getComponentById(__formId).getValues();//这里不可以用event.data，因为其拿到的是弹出表单时的初始值，不是用户实时填写的数据
            newItem = _.clone(newItem);
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
                let uuidv4 = new Function("return (" + ${uuidv4.toString()} + ")()");
                newItem[primaryKey] = uuidv4();
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
        `;
        let dialogButtons = [
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
                dialogButtons[0]
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
                    "__tableItems": `\${((children ? __super.__super.${props.name} : __super.${props.name}) || [])|json|toJson}`
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
                        "__tableItems": `\${((children ? __super.__super.${props.name} : __super.${props.name}) || [])|json|toJson}`
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


export const getAmisInputTableSchema = async (props) => {
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
                value = getTableValueWithPrimaryKeyValue(value, primaryKey);
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
            "className": "w-full",
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
        "required": props.required,
        className,
    };
    // console.log("===schema===", schema);
    return schema;
}