import { keyBy, map, isNaN, isNil, union, debounce, each, clone, forEach, filter, isArray, find, compact } from "lodash";
import { ProcessCellForExportParams } from 'ag-grid-enterprise';

const baseFields = ["created", "created_by", "modified", "modified_by"];

const FilterTypesMap = {
    'equals': '=',
    'notEqual': '!=',
    'contains': 'contains',
    'notContains': 'notcontains',
    'startsWith': 'startswith',
    'endsWith': 'endswith',
    'lessThan': '<',
    'lessThanOrEqual': '<=',
    'greaterThan': '>',
    'greaterThanOrEqual': '>=',
    'empty': 'empty' //TODO 不支持
}

function padZero(num: any) {
    num = num.toString();
    return num.length < 2 ? "0" + num : num;
}

// 判断一个js变量是否一个合法的Date变量
function isValidDate(date: any) {
    if (isNil(date)) {
        return true;
    }
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}

// 校验字符串日期值、日期时间值是否合法，如果合法返回Date类型，否则返回null
// hasTime为true时表达字段类型为datetime，否则为date
// 允许两种字段类型转换，比如hasTime为true时，允许传入2025/3/06这种格式，会自动带上整点时间部分，反之会自动去掉时间部分存为utc0点
function parseDate(str: string, hasTime: boolean = false) {
    // 定义正则表达式，匹配不同的日期格式
    // 格式：YYYY-MM-DD、YYYY/MM/DD、YYYY/MM/DD HH:MM、YYYY/MM/DD HH:MM:SS、YYYY-MM-DDTHH:MM:SS.SSS+00:00 和 YYYY-MM-DDTHH:MM:SS.SSSZ 
    // YYYY-MM-DDTHH:MM:SS.SSS+00:00 这种格式是amis input-datetime控件输出的字段值格式
    // 最后一种TZ格式是服务端返回的格式值，复制其它列字段值时会把这种格式值提交到接口，必须兼容
    // var regex = new RegExp("^(\\d{4})([-\\/])(0?[1-9]|1[0-2])\\2(0?[1-9]|[12][0-9]|3[01])(T(\\d{2}):(\\d{2}):(\\d{2})(\\.\\d{3})?Z)?$");
    var regex = new RegExp("^(\\d{4})([-\\/])(0?[1-9]|1[0-2])\\2(0?[1-9]|[12][0-9]|3[01])((T|\\s)(\\d{1,2}):(\\d{1,2})(:(\\d{1,2}))?(\\.\\d{3})?(Z|(\\+\\d{1,2}\\:\\d{1,2}))?)?$");

    // 检查是否匹配正则表达式
    var match = str.match(regex);
    if (!match) {
        return null;
    }

    // 提取年份、月份、日期和时间
    var year = match[1];
    var month = match[3].padStart(2, '0'); // 补齐月份前导零
    var day = match[4].padStart(2, '0');   // 补齐日期前导零

    // 如果有时间部分，提取时间
    var timePart = match[5] ? match[5] : '';
    if (hasTime) {
        // 如果没有时间部分，补充整点时间部分，本地时间0点，因为日期时间类型会保存时区部分，所以要转换本地时间0点而不是UTC 0点
        if (timePart === '') {
            timePart = ' 00:00:00';
        }
    }
    else {
        // 如果有时间部分，去掉时间部分，即UTC 0点，因为日期类型字段只保存日期部分，转换为UTC 0点
        if (timePart !== '') {
            timePart = 'T00:00:00.000Z';
        }
    }
    var standardizedDateStr = year + '-' + month + '-' + day + timePart;

    // 使用 Date 对象验证日期是否合法
    // 这里 standardizedDateStr 必须经过上面的补充前导零操作，否则new Date执行的结果会差8小时
    var date = new Date(standardizedDateStr);
    var timestamp = date.getTime();

    // 检查是否是合法日期
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        return null;
    }

    // 检查生成的日期和输入是否一致（避免 2024-02-30 这种情况）
    if (hasTime && str.indexOf('T') < 0) {
        // 日期时间字段类型，如果传入的字段值不带T就说明是本地时间，应该基于本地时间比较
        if (date.getFullYear() === parseInt(year, 10) &&
            date.getMonth() + 1 === parseInt(month, 10) &&
            date.getDate() === parseInt(day, 10)) {
            return date;
        }
    }
    else {
        // 日期字段类型基于UTC时间比较
        if (date.getUTCFullYear() === parseInt(year, 10) &&
            date.getUTCMonth() + 1 === parseInt(month, 10) &&
            date.getUTCDate() === parseInt(day, 10)) {
            return date;
        }
    }

    return null;
}

// 校验单选字段是否在选项范围
function checkSelectValueValid(value: any, options: any, isMultiple: boolean = false) {
    if (isMultiple) {
        return !!!find((value || []), function (valueItem: string) {
            return (options || []).indexOf(valueItem) < 0;
        });
    }
    else {
        return (options || []).indexOf(value) > -1;
    }
}

function getAmisGlobalVariables() {
    return {
        global: (window as any).Creator && (window as any).Creator.USER_CONTEXT || {}
    }
}

// 校验number值小数位数，必须小于等于指定位数
function checkNumberPrecision(num, precision) {
    const numStr = num.toString();
    const parts = numStr.split('.');
    if (precision > 0) {
        if (parts.length === 1) {
            return true;
        }
        return parts[1].length <= precision;
    }
    else {
        return parts.length === 1;
    }
}

function runAmisFormula(formula: string, data: any, catchBack: Function, options: any = {}) {
    try {
        var currentAmis = (window as any).amisRequire("amis");
        var evaluate = currentAmis.evaluate;
        var globalData = getAmisGlobalVariables();
        return (evaluate as any)(formula, Object.assign({}, globalData, data), Object.assign({ evalMode: true }, options));
    }
    catch (ex) {
        return typeof catchBack === "function" && catchBack(ex);
    }
}

// 校验数据表中配置的Verifications并返回错误信息
function getTableVerificationErrors(data: any, tableVerifications: any, { env }) {
    let validated = true;
    const verificationErrors = [];
    // verification校验
    const verifications = tableVerifications || [];
    verifications.forEach(function (verification: any) {
        validated = runAmisFormula(verification.rule, data, function (ex) {
            console.warn("执行校验规则“" + verification.rule + "”公式出错了，请检查校验规则公式配置：", ex);
            env.notify("error", "执行校验规则“" + verification.rule + "”公式出错了，请检查校验规则公式配置：" + (ex && ex.toString()))
        });
        if (!validated) {
            verificationErrors.push(verification.alert || "校验规则未配置错误信息");
        }
    });
    return verificationErrors;
}

function getMainMenuItems(params: any, { dispatchEvent, env }) {
    const athleteMenuItems = params.defaultItems.slice(0);
    athleteMenuItems.unshift("separator");
    athleteMenuItems.unshift({
        name: "删除字段",
        action: (menuParams: any) => {
            console.log("Start to delete a field");
            var fieldConfig = menuParams.column.colDef.cellEditorParams.fieldConfig;
            if (!fieldConfig) {
                return;
            }
            dispatchEvent("deleteField", {
                "deletingFieldId": fieldConfig._id
            });
        }
    });
    athleteMenuItems.unshift({
        name: "编辑字段",
        action: (menuParams: any) => {
            console.log("Start to edit a field");
            var fieldConfig = menuParams.column.colDef.cellEditorParams.fieldConfig;
            if (!fieldConfig) {
                return;
            }
            dispatchEvent("editField", {
                "editingFieldId": fieldConfig._id
            });
        }
    });
    return athleteMenuItems;
}

export function getColumnDef(field: any, dataTypeDefinitions: any, mode: string, { dispatchEvent, env }) {
    const isReadonly = mode === "read";
    const isAdmin = mode === "admin";
    var cellDataType: any,
        cellEditorParams: any,
        cellEditor: any,
        cellRendererParams: any,
        cellRenderer: any,
        valueFormatter: any,
        valueGetter: any,
        valueSetter: any,
        valueParser: any,
        fieldOptions: any,
        editable = true,
        filter: any,
        filterParams: any,
        cellClass: any;

    let isCellReadonly = isReadonly;
    if (field.readonly || field.is_system) {
        isCellReadonly = true;
    }

    let suppressMovable = baseFields.indexOf(field.name) > -1;
    let lockPosition = baseFields.indexOf(field.name) > -1 ? 'right' : false;

    // 根据字段类型设置 dataType
    cellEditorParams = {
        fieldConfig: field
    };
    cellRendererParams = {};
    filterParams = {
        debounceMs: 200,
        maxNumConditions: 1
    };
    switch (field.type) {
        case 'text':
        case 'textarea':
            cellDataType = 'text';
            filter = 'agTextColumnFilter';
            Object.assign(filterParams, {
                filterOptions: ["contains", "notContains", "equals", "startsWith", "endsWith"]
            });
            break;
        case 'number':
            cellDataType = 'number';
            let precision = 17; // field.precision || 0，编辑时默认始终支持任意小数位数输入
            if (!field.precision) {
                // 整数时不允许输入小数位
                precision = 0;
            }
            else {
                // 小数值要格式化为field.precision位数显示和导出Excel
                valueGetter = dataTypeDefinitions.number.valueGetter;
            }
            Object.assign(cellEditorParams, {
                precision: precision
            });
            filter = 'agNumberColumnFilter';
            Object.assign(filterParams, {
                filterOptions: ["equals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
            });
            break;
        case 'select':
            cellDataType = 'text';
            fieldOptions = field.options && field.options.split("\n").map(function (n) { return n.trim(); }) || [];
            fieldOptions.unshift(null);
            Object.assign(cellEditorParams, {
                values: fieldOptions
            });
            cellEditor = "agSelectCellEditor";
            filter = 'agSetColumnFilter';
            Object.assign(filterParams, {
                values: fieldOptions
            });
            break;
        case 'select-multiple':
            cellDataType = 'object';
            fieldOptions = field.options && field.options.split("\n").map(function (n: string) { return n.trim(); }) || [];
            Object.assign(cellEditorParams, {
                values: fieldOptions,
                minWidth: 200
            });
            cellEditor = "agAmisMultiSelectCellEditor";
            valueParser = dataTypeDefinitions.multipleSelect.valueParser;
            valueFormatter = dataTypeDefinitions.multipleSelect.valueFormatter;
            filter = 'agSetColumnFilter';
            Object.assign(filterParams, {
                values: fieldOptions
            });
            cellClass = "ag-cell-select-multiple";
            break;
        case 'date':
            cellDataType = 'date';
            cellEditor = "agDateCellEditor";
            valueFormatter = dataTypeDefinitions.date.valueFormatter;
            // 如果不定义valueGetter，双击单元格进入编辑状态时，值显示为空
            valueGetter = dataTypeDefinitions.date.valueGetter;
            filter = 'agDateColumnFilter';
            Object.assign(filterParams, {
                filterOptions: ["equals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
            });
            break;
        case 'datetime':
            cellDataType = 'date';
            // editable = false;
            Object.assign(cellEditorParams, {
                minWidth: 172
            });
            cellEditor = "agAmisDateTimeCellEditor";
            // 因为日期时间依赖了DateTimeEditor.init函数中对初始值定义，所以这里没必要再走一次valueGetter
            // valueGetter = dataTypeDefinitions.date.valueGetter;
            filter = 'agAmisDateTimeFilter';
            // Object.assign(filterParams, {
            //     filterOptions: ["equals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
            // });
            break;
        case 'boolean':
            cellDataType = 'boolean';
            Object.assign(cellRendererParams, {
                disabled: true
            });
            cellRenderer = "agCheckboxCellRenderer";
            filter = 'agSetColumnFilter';
            Object.assign(filterParams, {
                values: [true, false],
                suppressSelectAll: true,
                comparator: function (a, b) {
                    // 将 true 显示在 false 之前
                    if (a === true && b === false) return -1;
                    if (a === false && b === true) return 1;
                    return 0;
                },
                valueFormatter: function (params) {
                    return params.value ? '是' : '否';
                }
            });
            break;
        case 'formula':
            cellDataType = 'formula';
            editable = false;
            // 记录所有公式字段配置方便取出来用
            dataTypeDefinitions.formula.fields[field.name.toLowerCase()] = field;
            break;
        case 'lookup':
            cellDataType = 'text';
            let minWidth = 160;
            cellClass = "ag-cell-lookup";
            if (field.multiple) {
                cellDataType = 'object';
                minWidth = 220;
                cellClass = "ag-cell-lookup ag-cell-lookup-multiple";
            }
            Object.assign(cellEditorParams, {
                minWidth
            });
            cellEditor = "agAmisLookupCellEditor";
            Object.assign(cellRendererParams, {
                fieldConfig: field
            });
            // 导出excel不走 cellRenderer，走的是 valueFormatter
            cellRenderer = "agAmisLookupCellRenderer";
            // cellRenderer = function(params) { return (params.value && params.value.name) || ""; }
            valueGetter = dataTypeDefinitions.lookup.valueGetter;
            valueFormatter = dataTypeDefinitions.lookup.valueFormatter;
            valueParser = dataTypeDefinitions.lookup.valueParser;
            filter = 'agAmisLookupFilter';
            break;
        default:
            cellDataType = 'text'; // 默认类型
    }

    let mainMenuItems: any;
    // 系统字段不显示额外菜单
    if (isAdmin && !field.is_system) {
        // 使用闭包把 dispatchEvent 等参数传递给事件处理函数
        const getMainMenuItemsRaw = function (params: any) {
            return getMainMenuItems(params, { dispatchEvent, env });
        };
        mainMenuItems = getMainMenuItemsRaw;
    }

    return {
        field: field.name.toLowerCase(),
        colId: field.name.toLowerCase(),
        headerName: field.label,
        cellDataType: cellDataType,
        cellEditorParams: cellEditorParams,
        cellEditor: cellEditor,
        cellRendererParams: cellRendererParams,
        cellRenderer: cellRenderer,
        editable: isCellReadonly ? false : editable,
        valueFormatter: valueFormatter,
        valueGetter: valueGetter,
        valueSetter: valueSetter,
        valueParser: valueParser,
        tooltipValueGetter: tooltipValueGetter,
        filter: filter,
        filterParams: filterParams,
        mainMenuItems: mainMenuItems,
        suppressMovable: suppressMovable,
        lockPosition: lockPosition,
        cellClass
    };

}

export function getColumnDefByFieldFun(dataTypeDefinitions: any, mode: string, { dispatchEvent, env }) {
    return function (field: any) {
        return getColumnDef(field, dataTypeDefinitions, mode, { dispatchEvent, env });
    }
}

// 校验数据表中配置的Verifications并返回错误信息
function getFieldVerificationErrors(fieldValue, colDef) {
    const verificationErrors = [];
    if (isNil(colDef) || !colDef.editable) {
        // 不在列上定义，或列上只读的字段不用校验字段值类型合法性
        return [];
    }
    if (isNil(fieldValue)) {
        return [];
    }

    const fieldConfig = colDef.cellEditorParams.fieldConfig;
    if (fieldConfig.type === "date" || fieldConfig.type === "datetime") {
        let isDateValid = true;
        if (typeof fieldValue === 'string') {
            if (fieldValue === '') {
                // 空字符串应该直接存储为null，也不校验失败
                return verificationErrors;
            }
            // 粘贴行数据过来时是字符串
            fieldValue = parseDate(fieldValue, fieldConfig.type === "datetime");
            if (fieldValue === null) {
                isDateValid = false;
            }
        }
        if (isDateValid) {
            // 到这里说明字段值已经转为一个Date类型变量，进一步判断变量是否合法
            isDateValid = isValidDate(fieldValue);
        }
        if (!isDateValid) {
            var msgValidFormat = fieldConfig.type === "datetime" ? "必须是合法的日期时间格式！例如：2024-01-01 09:00、2024/01/01 09:00、2024/2/3 9:6" : "必须是合法的日期格式！例如：2024-01-01 或 2024/01/01";
            verificationErrors.push("字段“" + fieldConfig.label + "”" + msgValidFormat);
            return verificationErrors;
        }
    }
    else if (fieldConfig.type === "number") {
        if (typeof fieldValue === 'string') {
            fieldValue = Number(fieldValue);
        }
        if (typeof fieldValue !== 'number' || isNaN(fieldValue)) {
            verificationErrors.push("字段“" + fieldConfig.label + "”必须是数字！");
        }
        // 无论整数小数都不校验位数，整数直接存为整数，小数直接按原始值存，不截取小数位
        // else {
        //     let isPrecisionValid = checkNumberPrecision(fieldValue, fieldConfig.precision);
        //     if (!isPrecisionValid) {
        //         verificationErrors.push("字段“" + fieldConfig.label + "”小数位数不能大于" + fieldConfig.precision || 0 + "！");
        //     }
        // }
    }
    else if (fieldConfig.type === "select") {
        if (typeof fieldValue !== 'string') {
            verificationErrors.push("字段“" + fieldConfig.label + "”是单选类型，只支持字符串！");
            return verificationErrors;
        }
        let isSelectValueValid = checkSelectValueValid(fieldValue, colDef.cellEditorParams.values || []);
        if (!isSelectValueValid) {
            verificationErrors.push("字段“" + fieldConfig.label + "”是单选类型，请输入合法的选项值！");
        }
    }
    else if (fieldConfig.type === "select-multiple") {
        if (fieldValue && !isArray(fieldValue)) {
            verificationErrors.push("字段“" + fieldConfig.label + "”是多选类型，只支持数组！");
            return verificationErrors;
        }
        let isSelectValueValid = checkSelectValueValid(fieldValue, colDef.cellEditorParams.values || [], true);
        if (!isSelectValueValid) {
            verificationErrors.push("字段“" + fieldConfig.label + "”是多选类型，请输入合法的选项值！");
        }
    }
    return verificationErrors;
}

// 监听行数据改变事件
async function onRowValueChanged(event: any, dataSource: any, { env }) {
    const table: any = {};
    const data = event.data;
    console.log('Saving updated data to server:', JSON.stringify(data));
    try {
        const allGridColumns = event.api.getAllGridColumns();
        const gridContext = event.api.getGridOption("context");
        // 字段类型值转换以及字段校验
        let fieldsVerificationErrors = [];
        const colDefs = keyBy(map(allGridColumns, "colDef"), "field");
        // removeIgnoredFieldValueInData(data, colDefs);
        each(data, function (n, k) {
            if (isNil(n)) {
                return;
            }
            const colDef = colDefs[k];
            if (colDef) {
                const fieldConfig = colDef.cellEditorParams.fieldConfig;
                if (fieldConfig.type === "date" || fieldConfig.type === "datetime") {
                    let dateValiErrors = getFieldVerificationErrors(n, colDef);
                    let isDateValid = !dateValiErrors || dateValiErrors.length === 0;
                    if (!isDateValid) {
                        fieldsVerificationErrors = union(fieldsVerificationErrors, dateValiErrors);
                        data[k] = null; // 这里不转为null会真的保存为非法数据到数据库，非法字段类型值统一存为null
                        return;
                    }
                    let isDateString = false;
                    if (typeof n === 'string') {
                        if (n === '') {
                            // 空字符串直接存储为null
                            data[k] = null;
                            return;
                        }
                        isDateString = true;
                    }
                    let utcDate = n;
                    if (isDateString) {
                        // 从粘贴行数据过来的字符串格式不用额外处理时区，parseDate中会自动处理时区
                        utcDate = parseDate(n, fieldConfig.type === "datetime");
                    }
                    else if (fieldConfig.type === "date") {
                        // 设置为选中日期的 UTC 0 点
                        // 只有从日期控件输入的值需要做转换，从粘贴行数据过来的字符串格式不用处理时区，因为要求粘贴过来的只兼容 YYYY-MM-DD YYYY/MM/DD 两种格式
                        const timezoneOffset = n.getTimezoneOffset();
                        utcDate = new Date(n.getTime() - timezoneOffset * 60 * 1000);
                    }
                    data[k] = utcDate;
                }
                else if (fieldConfig.type === "number") {
                    let numberValiErrors = getFieldVerificationErrors(n, colDef);
                    let isNumberValid = !numberValiErrors || numberValiErrors.length === 0;
                    if (!isNumberValid) {
                        fieldsVerificationErrors = union(fieldsVerificationErrors, numberValiErrors);
                        data[k] = null; // 非法字段类型值统一存为null
                        return;
                    }
                    if (typeof n === 'string') {
                        n = Number(n);
                    }
                    if (!fieldConfig.precision) {
                        n
                        // 整数直接转为四舍五入整数，不提醒错误，小数不用进这里，小数不管小数位数直接保存原始值即可
                        let isPrecisionValid = checkNumberPrecision(n, fieldConfig.precision);
                        if (!isPrecisionValid) {
                            n = Math.round(n)
                        }
                    }
                }
                else if (fieldConfig.type === "select") {
                    let selectValiErrors = getFieldVerificationErrors(n, colDef);
                    let isSelectValueValid = !selectValiErrors || selectValiErrors.length === 0;
                    if (!isSelectValueValid) {
                        fieldsVerificationErrors = union(fieldsVerificationErrors, selectValiErrors);
                        // 下拉框字段类型是字符串，不在范围内也直接保存，列表会显示异常信息就好
                        // data[k] = null; // 非法字段类型值统一存为null
                    }
                }
                else if (fieldConfig.type === "select-multiple") {
                    let selectValiErrors = getFieldVerificationErrors(n, colDef);
                    let isSelectValueValid = !selectValiErrors || selectValiErrors.length === 0;
                    if (!isSelectValueValid) {
                        fieldsVerificationErrors = union(fieldsVerificationErrors, selectValiErrors);
                        // 下拉框多选字段类型是数组，不在范围内也直接保存，列表会显示异常信息就好
                        // data[k] = null; // 非法字段类型值统一存为null
                    }
                }
                else if (fieldConfig.type === "lookup") {
                    var isMultiple = fieldConfig.multiple;
                    if (isMultiple) {
                        // 移除id数组中的null值，单元格复制功能可以填充错误的id值保存为null了
                        data[k] = compact(data[k]);
                    }
                }
            }
        });
        // 循环所有公式字段执行公式计算并设置值到data中
        // 一定要先计算公式字段值再执行校验，否则校验规则中引用了公式字段值的话，校验规则中的公式值是错误的
        setRowDataFormulaValues(data, event.api);
        const formulaErrors = data.__formulaErrors.concat();
        // verifications校验
        const rowNode = event.node;
        const tableVerificationErrors = getTableVerificationErrors(data, gridContext.verifications, { env });
        const verificationErrors = union(fieldsVerificationErrors, tableVerificationErrors);
        // console.log("==verificationErrors===:", verificationErrors);
        let allValidated = verificationErrors.length === 0;
        if (allValidated) {
            // 校验通过重新把row data中校验错误信息移除，否则错误信息一直在
            rowNode.setData(Object.assign({}, data, { __verificationErrors: [] }));
        }
        else {
            console.log("The table verifications is not passed for the row data:", table.verifications, data);
            let editingCellsCount = event.api.getEditingCells().length;
            if (editingCellsCount === 0) {
                // 多行校验不通过时只开启第一行编辑状态
                /*
                // 从行编辑改为单元格编辑后，不再需要自动开启编辑状态
                event.api.startEditingCell({
                    rowIndex: event.rowIndex,
                    colKey: allGridColumns[0].colId
                });*/
            }
            rowNode.setData(Object.assign({}, data, { __verificationErrors: verificationErrors }));
            verificationErrors.forEach((msg) => {
                env.notify("error", msg)
            });
            console.log(verificationErrors.join("\n"));
        }
        // 保存更新的数据到服务端
        delete data.__verificationErrors;
        delete data.__formulaErrors;
        // if (!response.ok) {
        //     throw new Error('Server error! Status: ' + response.status);
        // }

        const beforeSaveData = gridContext.beforeSaveData;
        beforeSaveData && beforeSaveData(data, { isUpdate: true });
        const responseData = await dataSource.update(data._id, data);
        console.log('Data saved successfully:', responseData);
        rowNode.setData(Object.assign({}, responseData, { __verificationErrors: verificationErrors, __formulaErrors: formulaErrors }));
    } catch (error) {
        console.error('Error saving data:', error);
        env.notify("error", "保存数据失败，请刷新浏览器以查看最新数据状态，并稍后重试。");
    }
}

const changeQueue = new Map();

function processChangeQueue(dataSource: any, { env }) {
    changeQueue.forEach((event, rowIndex) => {
        onRowValueChanged(event, dataSource, { env });
    });
    changeQueue.clear();
}

const debouncedProcessChangeQueue = debounce(processChangeQueue, 200, {
    leading: false,
    trailing: true
});

function onCellValueChanged(event: any, dataSource: any, { env }) {
    const rowIndex = event.node.rowIndex;

    if (!changeQueue.has(rowIndex)) {
        changeQueue.set(rowIndex, event);
    } else {
        const existingEvent = changeQueue.get(rowIndex);
        // 更新现有的 event 对象中的数据
        existingEvent.data = { ...existingEvent.data, ...event.data };
    }

    debouncedProcessChangeQueue(dataSource, { env });
}

// 校验数据表中数据的字段类型格式合法性
function getFieldsVerificationErrors(fieldValues, colDefs) {
    let validated = true;
    let verificationErrors = [];

    for (const key in fieldValues) {
        if (fieldValues.hasOwnProperty(key)) {
            const value = fieldValues[key];
            var fieldItemValiResult = getFieldVerificationErrors(value, colDefs[key]);
            if (fieldItemValiResult && fieldItemValiResult.length) {
                verificationErrors = verificationErrors.concat(fieldItemValiResult);
            }
        }
    }
    return verificationErrors;
}

function tooltipValueGetter(params) {
    var data = params.data;
    var tips = (data.__verificationErrors || []).concat(data.__formulaErrors || []);
    if (tips && tips.length) {
        return tips.join("；");
    }
}

function setRowDataFormulaValues(rowData, targetGridApi) {
    // 获取数据类型定义
    var dataTypeDefinitions = targetGridApi.getGridOption("dataTypeDefinitions");
    var formulaFields = dataTypeDefinitions.formula.fields;

    // 作为公式参数参与计算前，表单中各种字段类型空值异常值处理，要转为0值或对应的默认值参与计算
    // 注意rowData中非法字段类型值已经提前转为空值或合法的默认字段值了，比如boolean类型非法的字符串会转为false，非法的数值会转为null
    // 所以下面不用额外处理，只需要考虑空值的情况
    const allGridColumns = targetGridApi.getAllGridColumns();
    const colDefs = keyBy(map(allGridColumns, "colDef"), "field");
    const formulaInputData = clone(rowData);
    each(colDefs, function (n, k) {
        if (!k) {
            return;
        }
        const colDef = n;
        const fieldValue = formulaInputData[k];
        const fieldConfig = colDef.cellEditorParams && colDef.cellEditorParams.fieldConfig;
        if (fieldConfig) {
            const fieldType = fieldConfig.type;
            if (fieldType === "number") {
                // 数字类型参数，如果为空，视为0值参与公式计算
                if (isNil(fieldValue)) {
                    formulaInputData[k] = 0;
                }
            }
            else if (fieldType === "boolean") {
                // boolean类型参数，如果为空，视为false值参与公式计算
                if (isNil(fieldValue)) {
                    formulaInputData[k] = false;
                }
            }
            else {
                // 其它类型，包括单选，日期，文本等，如果为空，视为空字符串参与公式计算
                if (isNil(fieldValue)) {
                    formulaInputData[k] = "";
                }
            }
        }
    });

    var success = true;
    var formulaErrors = [];

    // 遍历每个公式字段并计算
    for (var formulaFieldName in formulaFields) {
        if (formulaFields.hasOwnProperty(formulaFieldName)) {
            var formulaField = formulaFields[formulaFieldName];
            var formula = formulaField.formula;
            console.log("ag-grid amis formula runing:", formulaField.label, formula, rowData);
            var formulaValue = runAmisFormula(formula, formulaInputData, function (ex) {
                var errMsg = "公式字段“" + formulaField.label + "”执行公式”" + formula + "“出错了，请检查公式配置：" + (ex && ex.toString());
                console.warn(errMsg, ex);
                // env.notify("error", errMsg)
                formulaErrors.push(errMsg);
                success = false;
                return null;
            });
            // 检查结果是否为数值
            var valueType = typeof formulaValue;
            var isValueTypeInvalid = !isNil(formulaValue) && ["number", "string", "boolean"].indexOf(valueType) < 0;
            if (valueType === 'number') {
                if (isFinite(formulaValue)) {
                    // 四舍五入并保留两位小数
                    formulaValue = Math.round(formulaValue * 100) / 100;
                }
                else {
                    // 比如值为1/0是一个非法的数值
                    // 不可以设置为校验失败，因为新建记录时可能参与计算的字段值为空，此时公式计算结果为NaN，需要设置为null
                    // isValueTypeInvalid = true;
                }
            }
            if (isValueTypeInvalid) {
                var errMsg = "公式字段“" + formulaField.label + "”计算结果出错了，计算结果只支持数值、字符串和布尔类型。";
                console.warn(errMsg);
                // env.notify("error", errMsg)
                formulaErrors.push(errMsg);
                // 只支持变量类型 number/string/boolean,其他类型返回null，比如1/0值为NaN，会转为null保存
                success = false;
                formulaValue = null;
            }
            console.log("ag-grid amis formula run result:", formulaField.label, formula, formulaValue);
            rowData[formulaFieldName] = formulaValue;
        }
    }

    rowData.__formulaErrors = formulaErrors;
    return success;
}

let columnMoved = false;
const onColumnMoved = () => {
    columnMoved = true;
};

// Function to handle drag stopped event
async function onDragStopped(event: any, dispatchEvent: Function) {
    if (!columnMoved) {
        return;
    }
    const gridApi = event.api;
    var columnDefs = gridApi.getColumnDefs();
    var allColumns = filter(columnDefs, function (n) {
        return n.cellEditorParams && n.cellEditorParams.fieldConfig && baseFields.indexOf(n.cellEditorParams.fieldConfig.name) < 0;
    });
    var newSortedFieldIds = map(allColumns, "cellEditorParams.fieldConfig._id")
    var newSortedFields = map(allColumns, "cellEditorParams.fieldConfig")
    console.log("Saving new fields sort:", newSortedFields);
    // 将新的字段排序发送到服务器
    dispatchEvent("sortFields", {
        "sortedFields": newSortedFieldIds
    });
    var newColumnKeys = columnDefs.map(function (n: any) {
        return n.field;
    });
    updateDefaultExportColumnKeys(gridApi, newColumnKeys);
    columnMoved = false;
}

/**
 * 把ag-grid filterModel 转为魔方filters格式
 * @param filterModel
 */
function filterModelToOdataFilters(filterModel, colDefs) {
    const filters = [];
    forEach(filterModel, (value, key) => {
        const fieldConfig = colDefs[key].cellEditorParams.fieldConfig;
        let filterValue;
        if (value.type === 'between') {
            if (value.filterType === "number") {
                filters.push([key, "between", [value.numberFrom, value.numberTo]]);
            } else if (value.filterType === "datetime" || value.filterType === "date") {
                // filters.push([key, "between", [value.dateFrom, value.dateTo]]);
                // 服务端接口不支持between，裂变为两个条件
                let filterItem = [];
                if (value.dateFrom) {
                    filterItem.push([key, ">=", value.dateFrom]);
                }
                if (value.dateTo) {
                    filterItem.push([key, "<=", value.dateTo]);
                }
                if (filterItem.length) {
                    filters.push(filterItem);
                }
            } else {
                if (value.filter) {
                    filters.push([key, value.type, value.filter]);
                } else {
                    filters.push([key, "between", [value.dateFrom, value.dateTo]]);
                }
            }

        } else {
            let filterItem;
            switch (fieldConfig.type) {
                case 'text':
                case 'textarea':
                    filterItem = [key, FilterTypesMap[value.type], value.filter];
                    filters.push(filterItem);
                    break;
                case 'number':
                    filterItem = [key, FilterTypesMap[value.type], value.filter];
                    filters.push(filterItem);
                    break;
                case 'select':
                case 'select-multiple':
                    // 因为不需要支持多选，这里先不处理，如果要支持多选使用anyof过滤操作符应该就可以了，比如["category", "anyof", selectedCategories]
                    const filterValues = value.values;
                    if (filterValues.length) {
                        let filterItem = [];
                        for (let i = 0; i < filterValues.length; i++) {
                            filterItem.push([key, "=", filterValues[i]]);
                            if (i < filterValues.length - 1) {
                                filterItem.push("or");
                            }
                        }
                        filters.push(filterItem);
                    }
                    break;
                case 'date':
                case 'datetime':
                    let dateValue = new Date(value.dateFrom);
                    if (fieldConfig.type === "date") {
                        // 设置为日期的 UTC 0 点
                        const timezoneOffset = dateValue.getTimezoneOffset();
                        dateValue = new Date(dateValue.getTime() - timezoneOffset * 60 * 1000);
                    }
                    filterItem = [key, FilterTypesMap[value.type], dateValue];
                    filters.push(filterItem);
                    break;
                case 'boolean':
                    filterValue = value.values[0];
                    if (typeof filterValue !== "boolean") {
                        filterValue = filterValue === "true"
                    }
                    filterItem = [key, "=", filterValue];
                    filters.push(filterItem);
                    break;
                case 'formula':
                    // 不支持公式字段过滤
                    break;
                case 'lookup':
                    filterValue = value.values;
                    if (filterValue?.length) {
                        filterItem = [key, 'in', filterValue];
                        filters.push(filterItem);
                    }
                    break;
            }
        }
    })
    return filters;
}

function getServerSideDatasource(dataSource: any, filters: any) {
    return {
        getRows: async function (params: any) {
            console.log('Server Side Datasource - Requesting rows from server:', params.request);
            // let gridApi = params.api;

            try {
                const colDefs = keyBy(
                    map(params.api.getAllGridColumns(), col => col.colDef),
                    "field"
                );
                const modelFilters = filterModelToOdataFilters(params.request.filterModel, colDefs);
                console.log('Server Side Datasource - Requesting rows by modelFilters:', modelFilters);
                const startRow = params.request.startRow;
                const pageSize = params.api.paginationGetPageSize();

                const loadOptions: any = {
                    skip: startRow,
                    top: pageSize,
                    // expands: 'created_by,modified_by'
                }

                // 过滤
                let queryFilters = [];
                const rawFilters = filters || [];
                // if (B6_TABLES_DATA_COLLECT_FIELDNAME && collectId) {
                //     rawFilters = [B6_TABLES_DATA_COLLECT_FIELDNAME, "=", collectId];
                // }
                if (rawFilters.length && modelFilters.length) {
                    queryFilters = [rawFilters, modelFilters];
                } else if (rawFilters.length) {
                    queryFilters = rawFilters;
                } else {
                    queryFilters = modelFilters;
                }
                if (queryFilters.length) {
                    loadOptions.filters = queryFilters;
                }

                // 排序
                const sortModel = params.request.sortModel;
                const sort = [];
                forEach(sortModel, sortField => {
                    sort.push(`${sortField.colId} ${sortField.sort}`);
                });
                console.log('Server Side Datasource - Requesting rows by sortModel:', sortModel);
                if (sort.length) {
                    loadOptions.sort = sort.join(",");
                }

                const response = await dataSource.load(loadOptions);

                // if (!response.ok) {
                //     throw new Error(`Server error! Status: ${response.status}`);
                // }

                params.success({
                    rowData: response.data,
                    rowCount: response.totalCount
                });
            } catch (error) {
                console.error('Error fetching data from server:', error);
                // env.notify("error", '无法从服务器获取数据，请检查网络连接并重试。如果问题持续，请联系技术支持。');
                params.fail();
            }
        }
    };
}

export function getDataTypeDefinitions() {
    return {
        date: {
            baseDataType: 'date',
            extendsDataType: 'date',
            valueParser__: function (params) {
                // ag-grid官网明确说valueParser是用来实现保存数据前数据转换的，但是实测这个函数并不一定会被触发
                // 另外valueSetter也能实现类似功能，但是一样实测不会被触发
                // 所以只能手动在调用保存接口前实现相关转换逻辑
                // 见：
                // https://www.ag-grid.com/javascript-data-grid/column-properties/#reference-editing-valueParser
                // https://www.ag-grid.com/javascript-data-grid/cell-data-types/#overriding-the-pre-defined-cell-data-type-definitions
                // 后面测试到规则是输入值为string类型时，即复制粘贴进来的字段值才会走valueParser
                // 因为要考虑到从excel大量copy数据过来时保持原错误字段值提醒用户手动改值, 所以不可以启用valueParser做值转换，只能手动在调用保存接口前实现相关转换逻辑
                console.log("valueParser:", params.newValue);
            },
            valueGetter: function (params) {
                var fieldType = params.colDef.cellEditorParams.fieldConfig.type;
                var fieldName = params.colDef.field;
                var fieldValue = params.data[fieldName];
                if (!fieldValue) return null;

                var date = new Date(fieldValue);
                return date;
            },
            valueFormatter: function (params) {
                var fieldType = params.colDef.cellEditorParams.fieldConfig.type;
                var date = new Date(params.value);

                if (!params.value) return "";

                if (fieldType === "date") {
                    return date.getFullYear() + '-' + padZero(date.getMonth() + 1) + '-' + padZero(date.getDate());
                } else if (fieldType === "datetime") {
                    // Convert to local time considering timezone
                    var localDate = new Date(date.getTime());
                    return localDate.getFullYear() + '-' + padZero(localDate.getMonth() + 1) + '-' + padZero(localDate.getDate()) + ' ' + padZero(localDate.getHours()) + ':' + padZero(localDate.getMinutes());
                }

                return "";
            }
        },
        formula: {
            baseDataType: 'text',
            extendsDataType: 'text',
            fields: {}
        },
        lookup: {
            baseDataType: 'text',
            extendsDataType: 'text',
            valueGetter: function (params) {
                var isMultiple = params.colDef.cellEditorParams.fieldConfig.multiple;
                var fieldName = params.colDef.field;
                var fieldValue = params.data[fieldName];
                if (!fieldValue) return null;

                return isMultiple ? (compact(fieldValue.map((item) => item?._id)) || []) : (fieldValue._id || "");
            },
            valueFormatter: function (params) {
                // lookup字段值显示和导出为excel，不可以使用 cellRenderer ，因为导出excel不认
                var isMultiple = params.colDef.cellEditorParams.fieldConfig.multiple;
                var fieldName = params.colDef.field;
                var fieldValue = params.data[fieldName];
                if (!fieldValue) return null;

                // 这里使用params.value.map，而不是fieldValue.map，是因为 processCellForClipboard 中调用了 formatValue 函数，传入的参数值为params.value
                return isMultiple ? (params.value.map((item) => find(fieldValue, { _id: item })?.name || "").join(",")) : (fieldValue.name || "");
            },
            valueParser: function (params) {
                const fieldValue = params.newValue;
                const colDef = params.column.getColDef();
                const fieldConfig = colDef.cellEditorParams.fieldConfig;
                const isMultiple = fieldConfig.multiple;
                var fieldName = colDef.field;
                if (fieldConfig.type === "lookup" && isMultiple && typeof fieldValue === 'string') {
                    // 多选lookup字段值如果是string，额外处理，转为数组
                    return fieldValue && fieldValue.split(',') || [];
                }
                return fieldValue;
            }
        },
        number: {
            baseDataType: 'number',
            extendsDataType: 'number',
            valueGetter: function (params) {
                // number字段值显示和导出为excel，不可以使用 cellRenderer ，因为导出excel不认
                var fieldPrecision = params.colDef.cellEditorParams.fieldConfig.precision;
                var fieldName = params.colDef.field;
                var fieldValue = params.data[fieldName];
                if (!isNil(fieldValue)) {
                    let isValidNumber = true;
                    if (typeof fieldValue === 'string') {
                        fieldValue = Number(fieldValue);
                    }
                    if (typeof fieldValue !== 'number' || isNaN(fieldValue)) {
                        isValidNumber = false;
                    }
                    if (!isValidNumber) {
                        // 非法值直接清空显示和导出
                        return null;
                    }
                    if (fieldPrecision > 0) {
                        // 小数格式化为指定小数位数显示和导出
                        return parseFloat(fieldValue).toFixed(fieldPrecision);
                    }
                    else {
                        // 整数直接返回显示和导出
                        return fieldValue;
                    }
                }
            }
        },
        // 下拉多选 select-multiple 类型
        multipleSelect: {
            baseDataType: 'object',
            extendsDataType: 'object',
            valueParser: function (params) {
                // 复制单元格时，需要将字符串转换为数组
                if (typeof params.newValue === 'string') {
                    return params.newValue && params.newValue.split(',') || [];
                }
                return params.newValue;
            },
            valueFormatter: function (params) {
                var fieldValue = params.value;
                if (!fieldValue) return null;

                return isArray(fieldValue) ? fieldValue.join(",") : fieldValue;
            }
        }
    };
}

// 编辑开始时的处理函数
function onCellEditingStarted(event: any) {
    const column = event.column;
    const colDef = event.colDef;
    const cellEditorParams = colDef.cellEditorParams || {};
    const fieldConfig = cellEditorParams.fieldConfig;
    if (!fieldConfig) {
        return;
    }
    const minWidth = cellEditorParams.minWidth;
    const originalWidth = column.getActualWidth();
    if (minWidth && minWidth > originalWidth) {
        // console.log('onCellEditingStarted', 'column', column, 'originalWidth', originalWidth, 'minWidth', minWidth);
        // event.api.setColumnWidth(column, minWidth);
        event.api.setColumnWidths([{
            key: column,
            newWidth: minWidth
        }]);
    }
}


function updateDefaultExportColumnKeys(gridApi: any, newColumnKeys: any) {
    // 更新导出参数，如果配置了columnKeys，则导出时需要同步更新
    var defaultExcelExportParams = gridApi.getGridOption('defaultExcelExportParams');
    var defaultCsvExportParams = gridApi.getGridOption('defaultCsvExportParams');
    if (defaultExcelExportParams && isArray(defaultExcelExportParams.columnKeys)) {
        var newExportParams = Object.assign({}, defaultExcelExportParams, {
            columnKeys: newColumnKeys
        });
        gridApi.setGridOption('defaultExcelExportParams', newExportParams);
    }
    if (defaultCsvExportParams && isArray(defaultCsvExportParams.columnKeys)) {
        var newExportParams = Object.assign({}, defaultCsvExportParams, {
            columnKeys: newColumnKeys
        });
        gridApi.setGridOption('defaultCsvExportParams', newExportParams);
    }
}

export async function getGridOptions({ tableId, title, mode, config, dataSource, getColumnDefs, env, dispatchEvent, filters, verifications = [], amisData, beforeSaveData, amisRender }) {
    let gridApi: any;
    let tableLabel = title;
    const isReadonly = mode === "read";
    const isAdmin = mode === "admin";
    var dataTypeDefinitions = getDataTypeDefinitions();

    // var columnDefs = table.fields.map(function (field) {
    //     return getColumnDef(field, dataTypeDefinitions, mode, { dispatchEvent, env });
    // });
    const getColumnDefByField = getColumnDefByFieldFun(dataTypeDefinitions, mode, { dispatchEvent, env });
    var columnDefs = await getColumnDefs({ title, mode, dataSource, env, dispatchEvent, getColumnDefByField }) || [];
    columnDefs.unshift({
        headerName: "",
        valueGetter: "node.rowIndex + 1",
        flex: null,//不配置的话，默认走defaultColDef中的flex:1的话，宽度不生效
        width: 50,
        minWidth: 50,
        contextMenuItems: [],
        mainMenuItems: [],
        // pinned: 'left',
        suppressMovable: true,
        suppressHeaderMenuButton: true,
        suppressHeaderContextMenu: true,
        suppressFloatingFilterButton: true,
        resizable: true,
        sortable: false
    });

    // 使用闭包把 dataSource 等参数传递给事件处理函数
    const onRowValueChangedRaw = (event: any) => {
        onRowValueChanged(event, dataSource, { env });
    };
    const onCellValueChangedRaw = (event: any) => {
        onCellValueChanged(event, dataSource, { env });
    };
    const onDragStoppedRaw = (event: any) => {
        onDragStopped(event, dispatchEvent);
    };

    // 全局点击事件处理函数，stopEditingWhenCellsLoseFocus为false（ag-grid默认）时，点击其他空白地方不会自动停止编辑
    function onDocumentClick(event) {
        // 获取 grid 的 DOM 元素
        var gridElement = document.querySelector('.steedos-airtable-grid');

        if (!gridElement) {
            return;
        }

        var targetElement = event.target;

        // // 如果点击发生在 grid 内部，直接返回
        // if (gridElement.contains(targetElement)) {
        //   return;
        // }

        // 如果点击发生在 grid 内部，不执行 stopEditing，由ag-grid内部规则处理
        if (targetElement.closest('.steedos-airtable-grid .ag-center-cols-viewport .ag-center-cols-container')) {
            return;
        }

        // 点击某些字段编辑状态下弹出的 popover 内部元素时，不执行 stopEditing
        const escapeSelectors = [
            '.antd-PopOver.antd-Select-popover',//多选 字段 弹出 amis select 内部
            '.amis-dialog-widget.antd-Modal',//lookup 字段 弹出 amis picker 内部
            '.antd-Button',//所有的amis按钮，比如lookup 字段 弹出 amis picker 底部的确定、取消按钮，及其顶部展开的搜索搜索表单中中的按钮
            '.antd-PopOver.antd-DatePicker-popover'//datetime 字段 弹出 amis picker 内部
        ];
        if (targetElement.closest(escapeSelectors.join(','))) {
            return;
        }

        gridApi.stopEditing();
    }

    var needToValiTable = verifications && verifications.length > 0;
    var columnFieldNames = map(columnDefs, "field");
    var pageSize = 100000;
    // 初始化网格配置
    let gridOptions: any = {
        columnDefs: columnDefs,
        dataTypeDefinitions: dataTypeDefinitions,
        rowClassRules: {
            'ag-grid-verification-errors-row': function (params) {
                if (!params.data) {
                    return false;
                }
                const allGridColumns = params.api.getAllGridColumns();
                const gridContext = params.api.getGridOption("context");
                const colDefs = keyBy(map(allGridColumns, "colDef"), "field");
                var fieldsVerificationErrors = getFieldsVerificationErrors(params.data, colDefs);
                var tableVerificationErrors = getTableVerificationErrors(params.data, gridContext.verifications, { env });
                const verificationErrors = union(fieldsVerificationErrors, tableVerificationErrors);
                params.data.__verificationErrors = verificationErrors;

                const hasVerificationErrors = params.data.__verificationErrors && params.data.__verificationErrors.length;
                const isFormulaError = params.data.__formulaErrors && params.data.__formulaErrors.length;
                return hasVerificationErrors || isFormulaError;
            }
        },
        rowData: null, // 初始为空，通过 API 动态加载
        rowModelType: 'serverSide',
        pagination: false,
        paginationPageSizeSelector: false,
        paginationPageSize: pageSize,
        cacheBlockSize: pageSize,
        // editType: 'fullRow',
        cellSelection: {
            handle: {
                mode: 'range',
            }
        },
        // stopEditingWhenCellsLoseFocus: true,//如果开启，单元格amis日期时间控件、下拉选择控件、lookup picker控件等在弹出popover选项层失去焦点时，会自动停止编辑状态，导致无法保存数据
        // onRowValueChanged: isReadonly ? null : onRowValueChangedRaw,
        onCellValueChanged: isReadonly ? null : onCellValueChangedRaw,
        onDragStopped: isAdmin ? onDragStoppedRaw : null,
        onColumnMoved: isAdmin ? onColumnMoved : null,
        defaultColDef: {
            flex: 1,
            minWidth: 100,
            resizable: true
        },
        getRowId: function (params) { return params.data._id; },
        selectionColumnDef: {
            pinned: 'left'
        },
        rowSelection: isReadonly ? null : {
            mode: "multiRow",
            selectAll: "all",
            checkboxes: true,
            headerCheckbox: true,
            enableClickSelection: false
        },
        // 勾选框列单独在columnDefs中定义后，rowSelection定义为上面的对象格式会多显示一列勾选框列
        // rowSelection: isReadonly ? null : "multiple",
        // suppressRowClickSelection: true,//ag-grid 33版本后不再支持，换成rowSelection.enableClickSelection了
        onStoreUpdated: function (event) {
            var rowCount = event.api.getDisplayedRowCount();
            console.log('onStoreUpdated:', rowCount);
            // getRows 初始加载数据，过滤数据，列排序等，gridApi.applyServerSideTransaction 新建记录、删除记录都会触发
            dispatchEvent("setTotalCount", {
                "totalCount": rowCount
            });
        },
        onGridReady: function (params: any) {
            gridApi = params.api;
            // getRows 初始加载数据，过滤数据，列排序等，gridApi.applyServerSideTransaction 新建记录、删除记录都会触发
            dispatchEvent("setGridApi", {
                "gridApi": params.api
            });
            // 添加全局点击事件监听器
            document.addEventListener('click', onDocumentClick);
        },
        onGridPreDestroyed: function () {
            // 在 grid 销毁时，移除事件监听器，防止内存泄漏
            document.removeEventListener('click', onDocumentClick);
        },
        onCellEditingStarted,
        // 自定义数据复制到剪贴板时的格式
        processCellForClipboard: function (params: ProcessCellForExportParams) {
            try {
                const fieldValue = params.value;
                const colDef = params.column.getColDef();
                const fieldConfig = colDef.cellEditorParams.fieldConfig;
                const isMultiple = fieldConfig.multiple;
                const fieldType = fieldConfig.type;
                var fieldName = colDef.field;
                if (fieldType === "lookup") {
                    // 因为lookup字段的值是记录id，避免发起起请求来根据记录label（即formatValue）获取记录id，这里直接复制id值到剪贴板
                    if (isMultiple) {
                        // return fieldValue.join(",");
                        // 约定输出"新新<654300b5074594d15147bcfa>,上海分公司<9FqSC6jms4KRGCgNm>"这种格式
                        // 如果不约定格式，直接返回id数组格式，即 fieldValue.join(",") 即可
                        return fieldValue?.map((item: string) => {
                            return `${params.formatValue([item])}<${item}>`;
                        }).join(",");
                    }
                    else {
                        // return fieldValue;
                        // 输出"上海分公司<9FqSC6jms4KRGCgNm>"这种格式
                        // 如果不约定格式，直接返回id字符格式，即 fieldValue 即可
                        return `${params.formatValue(fieldValue)}<${fieldValue}>`;
                    }
                }
                // 默认（即不定义 processCellForClipboard 函数时）使用的是字段的formatValue格式作为复制到剪贴板的内容
                return params.formatValue(fieldValue);
            }
            catch (error) {
                console.error("Ag-Grid复制数据时遇到错误了：", error);
                env.notify("error", `Ag-Grid复制数据时遇到错误了：${error.message}`);
            }
        },
        // 从剪贴板粘贴回ag-grid时的处理逻辑
        processCellFromClipboard: function (params: ProcessCellForExportParams) {
            try {
                const fieldValue = params.value;
                const colDef = params.column.getColDef();
                const fieldConfig = colDef.cellEditorParams.fieldConfig;
                const isMultiple = fieldConfig.multiple;
                const fieldType = fieldConfig.type;
                var fieldName = colDef.field;
                if (fieldType === "lookup") {
                    // 如果上面 processCellForClipboard 函数中不约定特定格式，以下lookup字段转换逻辑可以全去掉
                    if (isMultiple) {
                        // "新新<654300b5074594d15147bcfa>,上海分公司<9FqSC6jms4KRGCgNm>"这种格式中取出id值数组
                        const matches = fieldValue.match(/<(.*?)>/g)?.map(match => match.slice(1, -1));
                        if (matches?.length) {
                            return matches;
                        }
                        else {
                            return fieldValue.split(",").map((item: string) => {
                                return item.trim();
                            });
                        }
                    }
                    else {
                        // "上海分公司<9FqSC6jms4KRGCgNm>"这种格式中取出id值
                        const mactchs = fieldValue.match(/<(\w+)>/);
                        const fieldValueId = mactchs?.length > 1 ? mactchs[1] : fieldValue;
                        return fieldValueId;
                    }
                }
                // 默认（即不定义 processCellFromClipboard 函数时）使用的是字段的parseValue格式作为复制到剪贴板的内容
                return params.parseValue(fieldValue);
            }
            catch (error) {
                console.error("Ag-Grid粘贴数据时遇到错误了：", error)
                env.notify("error", `Ag-Grid粘贴数据时遇到错误了：${error.message}`);
            }
        },
        defaultExcelExportParams: {
            fileName: tableLabel,
            sheetName: tableLabel,
            columnKeys: columnFieldNames
        },
        defaultCsvExportParams: {
            fileName: tableLabel,
            sheetName: tableLabel,
            columnKeys: columnFieldNames
        },
        serverSideDatasource: getServerSideDatasource(dataSource, filters),
        context: {
            dataSource,
            verifications,
            onRowValueChangedFun: onRowValueChangedRaw,
            onCellValueChangedFun: onCellValueChangedRaw,
            setRowDataFormulaValues,
            getColumnDefByField,
            updateDefaultExportColumnKeys: (newColumnKeys: any) => {
                updateDefaultExportColumnKeys(gridApi, newColumnKeys)
            },
            beforeSaveData,
            isReadonly,
            amisData,
            amisEnv: env,
            amisRender
        }
    };

    if (needToValiTable) {
        // 用户有数据编辑权限时，默认使用单元格编辑，即 onCellValueChanged 属性有值
        // 如果 tables 中存在校验规则，把编辑模式转为行编辑，不使用单元格编辑模式，即把 onCellValueChanged 换成 onRowValueChanged
        if (gridOptions.onCellValueChanged) {
            gridOptions.editType = 'fullRow';
            gridOptions.onRowValueChanged = onRowValueChangedRaw;
            delete gridOptions.onCellValueChanged;
        }
    }

    gridOptions = Object.assign({}, config, gridOptions);
    console.log("amis agGrid gridOptions:", gridOptions);
    return gridOptions;
}

const getAgGrid = async ({ tableId, title, mode, dataSource, getColumnDefs, env, agGridLicenseKey, filters, verifications, beforeSaveData, amisRender }) => {
    const onDataFilter = async function (config: any, AgGrid: any, props: any, data: any, ref: any) {
        // 为ref.current补上props属性，否则props.dispatchEvent不能生效
        ref.current.props = props;
        let dispatchEvent = async function (action, data) {
            props.dispatchEvent(action, data, ref.current);
        }
        if (agGridLicenseKey) {
            // 启用 AG Grid 企业版
            AgGrid.LicenseManager.setLicenseKey(agGridLicenseKey);
        }
        let gridOptions = await getGridOptions({ tableId, title, mode, config, dataSource, getColumnDefs, env, dispatchEvent, filters, verifications, amisData: data, beforeSaveData, amisRender });
        return gridOptions;
    }
    const agGrid = {
        "type": "ag-grid",
        "onDataFilter": onDataFilter,
        "className": "steedos-airtable-grid-content mt-2 h-96",
        "style": {
            "height": "calc(100% - 58px)"
        },
        "onEvent": {
            "setGridApi": {
                "weight": 0,
                "actions": [
                    // {
                    //     "ignoreError": false,
                    //     "actionType": "custom",
                    //     "script": "debugger;",
                    //     "args": {
                    //     }
                    // },
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.setGridApi`
                        },
                        "data": {
                            "gridApi": "${gridApi}"
                        }
                    }
                ]
            },
            "editField": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.editField`
                        },
                        "data": {
                            // "gridApi": "${gridApi}",//这里gridApi传不下去，在TablesGrid组件的广播事件监听器中获取不到
                            "editingFieldId": "${editingFieldId}"
                        }
                    }
                ]
            },
            "deleteField": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.deleteField`
                        },
                        "data": {
                            "deletingFieldId": "${deletingFieldId}"
                        }
                    }
                ]
            },
            "sortFields": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.sortFields`
                        },
                        "data": {
                            "sortedFields": "${sortedFields}"
                        }
                    }
                ]
            },
            "setTotalCount": {
                "weight": 0,
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.setTotalCount`
                        },
                        "data": {
                            "totalCount": "${totalCount}"
                        }
                    }
                ]
            }
        }
    };
    return agGrid;
}

const getNewButtonScript = () => {
    return `
    //   const B6_TABLES_DATA_COLLECT_FIELDNAME = "\${B6_TABLES_DATA_COLLECT_FIELDNAME}";
    //   const collectId = '\${collectId || ""}';
      const amisNotify = event.context && event.context.env && event.context.env.notify || alert;
    
      const gridApi = event.data.gridApi;
      const gridContext = gridApi.getGridOption("context");
      const setRowDataFormulaValues = gridContext.setRowDataFormulaValues;
      const dataSource = gridContext.dataSource;
  
      function scrollToBottom() {
        const rowCount = gridApi.getDisplayedRowCount();
        if (rowCount > 0) {
          // Scroll to the last row
          gridApi.ensureIndexVisible(rowCount - 1, 'bottom');
        }
      }
  
      function getFieldDefaultValue(colDef) {
        const fieldConfig = colDef.cellEditorParams && colDef.cellEditorParams.fieldConfig;
        if (!fieldConfig) {
          //左侧行勾选框列没有cellEditorParams.fieldConfig
          return;
        }
        const defaultValue = fieldConfig.default_value;
        if (typeof defaultValue !== "undefined") {
          return defaultValue;
        }
        if (fieldConfig.type === "boolean") {
          return false;
        }
      }
    
      // 创建一个新行数据，可以初始化为默认值或空值
      function createNewRowData() {
        const newRow = {};
        // 可以给每个字段一个默认值，例如：
        const allGridColumns = gridApi.getAllGridColumns();
        // 字段类型值转换
        const colDefs = _.map(allGridColumns, "colDef");
        colDefs.forEach(colDef => {
          const dfValue = getFieldDefaultValue(colDef); // 设置为空或设置默认值
          if (typeof dfValue != "undefined") {
            newRow[colDef.field] = dfValue;
          }
        });
  
        // 设置默认值后需要进行依赖字段默认值的公式计算
        const isFormulaRunSuccess = setRowDataFormulaValues(newRow, gridApi);
        if (!isFormulaRunSuccess) {
            return;
        }
  
        // collectId存在时设置collectId值
        // if (B6_TABLES_DATA_COLLECT_FIELDNAME && collectId) {
        //   newRow[B6_TABLES_DATA_COLLECT_FIELDNAME] = collectId;
        // }
        return newRow;
    }
  
      // 新增行的功能
      async function addNewRow() {
        if (!gridApi) {
          console.error('Grid api not available. Ensure grid is initialized properly.');
          return;
        }
  
        // 有排序和过滤条件情况下不允许新建数据，因为新建后不知道是哪一行
        const gridState = gridApi.getState();
        const sortState = gridState.sort;
        const filterState = gridState.filter;
        if (!_.isEmpty(sortState)) {
          amisNotify("warn", "请先移除排序");
          return;
        }
  
        if (!_.isEmpty(filterState)) {
          amisNotify("warn", "请先移除过滤条件");
          return;
        }
  
        const newRow = createNewRowData();
        if (!newRow) {
          return;
        }
  
        // 将新增数据发送到服务器
        try {
          const beforeSaveData = gridContext.beforeSaveData;
          beforeSaveData && beforeSaveData(newRow, { isInsert: true });
          const data = await dataSource.insert(newRow);
          console.log('New row saved successfully', data);
  
          // 不能走refreshServerSide，因为会把校验失败的数据直接清空丢失
          gridApi.applyServerSideTransaction({ add: [data] });
          scrollToBottom();
          
          // 新增数据成功后刷新网格数据
          // gridApi.refreshServerSide({ purge: false });//purge设置为true会造成上面scrollToBottomAfterRefresh不生效
  
        } catch (error) {
          console.error('Error adding new row:', error);
          amisNotify("warn", "新增行时发生错误，请稍后重试。");
        }
      }
  
      addNewRow();
        `;
}

const getNewFieldButtonScript = (tableId: string, mode: string, { env }) => {
    return `
      doAction(
        {
            "type": "broadcast",
            "actionType": "broadcast",
            "args": {
                "eventName": "@airtable.${tableId}.newField"
            }
        })
      `;
}

const getDeleteButtonScript = () => {
    return `
      const amisNotify = event.context && event.context.env && event.context.env.notify || alert;

      const gridApi = event.data.gridApi;
      const gridContext = gridApi.getGridOption("context");
      const dataSource = gridContext.dataSource;

      function getAllRowData() {
        const rowData = [];
        const rowCount = gridApi.getDisplayedRowCount();

        for (let i = 0; i < rowCount; i++) {
          const rowNode = gridApi.getDisplayedRowAtIndex(i);
          rowData.push(rowNode.data);
        }

        return rowData;
      }

      function getSelectedRowData() {
        // Get the selected nodes and extract their data
        const gridState = gridApi.getState();
        const rowSelectionState = gridState.rowSelection;
        const isSelectAll = rowSelectionState && rowSelectionState.selectAll;
        if (isSelectAll) {
          // 用户勾选了表头全选勾选框时，gridApi.getSelectedNodes()取不到数据，这里手动获取列表上的行数据
          // gridApi.getState().rowSelection.toggledNodes 中记录了全选时用户取消了哪些选项的id值集合
          const toggledNodes = rowSelectionState.toggledNodes;
          let allRowData = getAllRowData();
          if (_.isEmpty(toggledNodes)) {
            return allRowData;
          }
          else {
            const selectedData = allRowData.filter(dataItem => toggledNodes.indexOf(dataItem._id) < 0);
            return selectedData;
          }
        }
        else {
          const selectedNodes = gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData;
        }
      }

      async function deleteSelectedRows() {
        if (!gridApi) {
          console.error('Grid api not available. Ensure grid is initialized properly.');
          return;
        }

        const selectedData = getSelectedRowData();
        const selectedIds = selectedData.map(data => data._id);
        console.log('Deleting Rows:', selectedIds);

        // Check if any rows are selected
        if (selectedIds.length === 0) {
          amisNotify("warn", "没有选中任何行！");
          return;
        }

        try {
          console.log('Deleting rows:', selectedIds);
          const result = await dataSource.remove(selectedIds);

          if (result.error) {
            console.error('Error deleting rows result:', result.error);
            amisNotify('error', '删除行时发生错误，请稍后重试。');
          } else {
            console.log('Deleted rows success:', result.records);
            // Remove the selected rows from the grid
            gridApi.applyServerSideTransaction({ remove: selectedData });
          }
        } catch (error) {
          console.error('Error deleting rows:', error);
          amisNotify('error', '删除行时发生错误，请稍后重试。');
        }
      }

      deleteSelectedRows();
    `;
}

const getTableHeaderLeftButtons = (tableId: string, mode: string, { env }) => {
    const isAdmin = mode === "admin";
    const newFieldButton = {
        "label": "新建字段",
        "type": "button",
        // "icon": "fa fa-plus",
        "actionType": "custom",
        // "level": "link",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "ignoreError": false,
                        "actionType": "custom",
                        "script": getNewFieldButtonScript(tableId, mode, { env }),
                        "args": {
                        }
                    }
                ]
            }
        }
    };
    const setVerificationButton = {
        "type": "button",
        "label": "校验规则",
        // "icon": "fa fa-exclamation-triangle",
        // "level": "link",
        "actionType": "custom",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.setVerification`
                        }
                    }
                ]
            }
        }
    }
    const buttons = isAdmin ? [
        newFieldButton,
        setVerificationButton
    ] : [];
    return {
        "type": "flex",
        "items": buttons,
        "visibleOn": "${window:innerWidth > 768}"
    };
}

const getTableHeaderRightButtons = (tableId: any, mode: string, { env }) => {
    const newButton = {
        "label": "新建",
        "type": "button",
        "actionType": "custom",
        // "level": "primary",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.insertRecord`
                        }
                    }
                ]
            }
        }
    };
    const deleteButton = {
        "label": "删除",
        "type": "button",
        "actionType": "custom",
        // "level": "primary",
        "onEvent": {
            "click": {
                "actions": [
                    {
                        "actionType": "confirmDialog",
                        "dialog": {
                            "title": "操作确认",
                            "msg": "确定要删除选中记录吗?"
                        }
                    },
                    {
                        "type": "broadcast",
                        "actionType": "broadcast",
                        "args": {
                            "eventName": `@airtable.${tableId}.removeRecord`
                        }
                    }
                ]
            }
        }
    };
    const buttons = [
        newButton,
        deleteButton
    ];
    return {
        "type": "flex",
        "items": buttons
    };
}

export const getTableHeader = ({ tableId, title, mode, dataSource, getColumnDefs, env }) => {
    const isReadonly = mode === "read";
    const isAdmin = mode === "admin";
    const tableTitle = title || "记录";
    return {
        "type": "wrapper",
        "body": [
            {
                "type": "grid",
                "valign": "middle",
                "columns": [
                    {
                        "body": [
                            {
                                "type": "grid",
                                "valign": "middle",
                                "className": "flex justify-between",
                                "columns": [
                                    {
                                        "body": {
                                            "type": "tpl",
                                            "className": "block",
                                            "tpl": "<svg class=\"w-6 h-6 slds-icon slds-icon_container slds-icon-standard-datadotcom\" aria-hidden=\"true\"><use xlink:href=\"/assets/icons/standard-sprite/svg/symbols.svg#datadotcom\"></use></svg>"
                                        },
                                        "md": "auto",
                                        "className": "",
                                        "columnClassName": "flex justify-center items-center"
                                    },
                                    {
                                        "body": [
                                            {
                                                "type": "tpl",
                                                // "tpl": "<a class=\"text-black text-base font-bold hover:font-bold\" href=\"/app/${appId}/${_master.objectName}/${_master.recordId}/${objectName}/grid?related_field_name=${relatedKey}\">记录(${$count})</a>",
                                                "tpl": tableTitle + `(\${_aggridTotalCount})`,
                                                "inline": false,
                                                "wrapperComponent": "",
                                                "className": "text-black text-base font-bold hover:font-bold"
                                            }
                                        ],
                                        "md": "",
                                        "valign": "middle",
                                        "columnClassName": "p-l-xs"
                                    }
                                ]
                            }
                        ],
                        "md": "auto"
                    },
                    {
                        "type": "grid",
                        "valign": "middle",
                        "className": "flex justify-end",
                        "columns": [
                            {
                                "body": getTableHeaderLeftButtons(tableId, mode, { env }),
                                "md": "auto"
                            },
                            {
                                "body": {
                                    "type": "divider",
                                    "direction": "vertical",
                                    "className": "-ml-1 mt-0 mb-0",
                                    "visibleOn": `\${window:innerWidth > 768 ? ${isAdmin} : false}`,
                                },
                                "md": "auto"
                            },
                            isReadonly ? {} : {
                                "body": getTableHeaderRightButtons(tableId, mode, { env }),
                                "md": "auto"
                            }
                        ]
                    }
                ],
                "className": "flex justify-between min-h-8 items-center"
            }
        ],
        "className": "steedos-record-related-header py-2 px-3 bg-gray-50 border rounded"
    };
}

export async function getAirtableGridSchema(
    { tableId, title, mode, dataSource, getColumnDefs, env, agGridLicenseKey, filters, verifications, beforeSaveData, amisRender }
) {
    // beforeSaveData = (rowData: any, options: any)=>{
    //     const { isInsert, isUpdate } = options;
    //     // rowData.xxx = "ssss";
    // }
    if (typeof beforeSaveData === 'string') {
        beforeSaveData = new Function('rowData', 'options', 'return (async () => { ' + beforeSaveData + ' })()')
    }

    const amisSchema = {
        "type": "service",
        "id": `service_airtable_grid_${tableId}`,
        "name": "page",
        "data": {
            "_aggridTotalCount": "--"
        },
        "className": "steedos-airtable-grid h-full",
        "body": [
            getTableHeader({ tableId, title, mode, dataSource, getColumnDefs, env }),
            await getAgGrid({ tableId, title, mode, dataSource, getColumnDefs, env, agGridLicenseKey, filters, verifications, beforeSaveData, amisRender })
        ],
        "onEvent": {
            [`@airtable.${tableId}.setGridApi`]: {
                "actions": [
                    {
                        "actionType": "setValue",
                        "args": {
                            "value": {
                                "gridApi": "${gridApi}"
                            }
                        },
                    }
                ]
            },
            [`@airtable.${tableId}.setTotalCount`]: {
                "actions": [
                    {
                        "actionType": "setValue",
                        "args": {
                            "value": {
                                "_aggridTotalCount": "${totalCount}"
                            }
                        },
                    }
                ]
            },
            [`@airtable.${tableId}.insertRecord`]: {
                "actions": [
                    {
                        "ignoreError": false,
                        "actionType": "custom",
                        "script": getNewButtonScript(),
                        "args": {
                        }
                    }
                ]
            },
            [`@airtable.${tableId}.removeRecord`]: {
                "actions": [
                    {
                        "ignoreError": false,
                        "actionType": "custom",
                        "script": getDeleteButtonScript(),
                        "args": {
                        }
                    }
                ]
            }
        }
    };
    return {
        amisSchema,
    };
}