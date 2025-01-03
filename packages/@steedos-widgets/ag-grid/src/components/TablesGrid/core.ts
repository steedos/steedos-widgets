import { keyBy, map, isNaN, isNil, union, debounce, each, clone, forEach, filter } from "lodash";

export const B6_TABLES_BASEID = "default";

const ROOT_URL = "http://127.0.0.1:5800";
const B6_HOST = "http://localhost:5100";//process.env.B6_HOST || "";
const B6_TABLES_API = `${B6_HOST}/api/v6/tables`;
export const B6_TABLES_ROOTURL = `${B6_TABLES_API}/${B6_TABLES_BASEID}`;

export const B6_TABLES_METABASE_ROOTURL = `${B6_TABLES_API}/meta/bases/${B6_TABLES_BASEID}/tables`;

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

//校验字符串日期值是否合法，如果合法返回Date类型，否则返回null
function parseDate(str: string) {
    // 定义正则表达式，匹配不同的日期格式
    // 格式：YYYY-MM-DD、YYYY/MM/DD 和 YYYY-MM-DDTHH:MM:SS.SSSZ 
    // 最后一种TZ格式是服务端返回的格式值，复制其它列字段值时会把这种格式值提交到接口，必须兼容
    var regex = new RegExp("^(\\d{4})([-\\/])(0?[1-9]|1[0-2])\\2(0?[1-9]|[12][0-9]|3[01])(T(\\d{2}):(\\d{2}):(\\d{2})(\\.\\d{3})?Z)?$");

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
    if (date.getUTCFullYear() === parseInt(year, 10) &&
        date.getUTCMonth() + 1 === parseInt(month, 10) &&
        date.getUTCDate() === parseInt(day, 10)) {
        return date;
    }

    return null;
}

// 校验单选字段是否在选项范围
function checkSelectValueValid(value, options) {
    return (options || []).indexOf(value) > -1;
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

export async function getMeta(tableId: string, force: boolean = false) {
    if (!tableId) {
        return;
    }
    try {
        const response = await fetch(`${B6_TABLES_METABASE_ROOTURL}/${tableId}`, {
            credentials: 'include',
            // "headers": {
            //     'Content-Type': 'application/json',
            //     "Authorization": "Bearer ${context.tenantId},${context.authToken}" //TODO context中没取到数据
            // }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`getUISchema`, tableId, error);
    }
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
    var allColumns = filter(event.api.getColumnDefs(), function (n) {
        return n.cellEditorParams && n.cellEditorParams.fieldConfig && baseFields.indexOf(n.cellEditorParams.fieldConfig.name) < 0;
    });
    var newSortedFieldIds = map(allColumns, "cellEditorParams.fieldConfig._id")
    var newSortedFields = map(allColumns, "cellEditorParams.fieldConfig")
    console.log("Saving new fields sort:", newSortedFields);
    // 将新的字段排序发送到服务器
    dispatchEvent("sortFields", {
        "sortedFields": newSortedFieldIds
    });
    columnMoved = false;
}

/**
 * 把ag-grid filterModel 转为魔方filters格式
 * @param filterModel
 */
export function filterModelToSteedosFilters(filterModel, colDefs) {
    const filters = [];
    forEach(filterModel, (value, key) => {
        const fieldConfig = colDefs[key].cellEditorParams.fieldConfig;
        if (value.type === 'between') {
            if (value.filterType === "number") {
                filters.push([key, "between", [value.numberFrom, value.numberTo]]);
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
                    let filterValue = value.values[0];
                    if (typeof filterValue !== "boolean") {
                        filterValue = filterValue === "true"
                    }
                    filterItem = [key, "=", filterValue];
                    filters.push(filterItem);
                    break;
                case 'formula':
                    // 不支持公式字段过滤
                    break;
            }
        }
    })
    return filters;
}

function getServerSideDatasource(tableId: string) {
    return {
        getRows: async function (params: any) {
            console.log('Server Side Datasource - Requesting rows from server:', params.request);
            let gridApi = params.api;
            // agGridRefs[tableId] = gridApi;\

            try {
                const colDefs = keyBy(
                    map(params.api.getAllGridColumns(), col => col.colDef),
                    "field"
                );
                const modelFilters = filterModelToSteedosFilters(params.request.filterModel, colDefs);
                console.log('Server Side Datasource - Requesting rows by modelFilters:', modelFilters);

                let url = `${B6_TABLES_ROOTURL}/${tableId}`;
                const startRow = params.request.startRow;
                const pageSize = params.api.paginationGetPageSize();
                let separator = url.includes('?') ? '&' : '?';
                url += `${separator}skip=${startRow}&top=${pageSize}&expands=created_by,modified_by`;

                // 过滤
                let queryFilters = [];
                const collectFilters = [];
                // if (B6_TABLES_DATA_COLLECT_FIELDNAME && collectId) {
                //     collectFilters = [B6_TABLES_DATA_COLLECT_FIELDNAME, "=", collectId];
                // }
                if (collectFilters.length && modelFilters.length) {
                    queryFilters = [collectFilters, modelFilters];
                } else if (collectFilters.length) {
                    queryFilters = collectFilters;
                } else {
                    queryFilters = modelFilters;
                }
                if (queryFilters.length > 0) {
                    separator = url.includes('?') ? '&' : '?';
                    url += `${separator}filters=${JSON.stringify(queryFilters)}`;
                }

                // 排序
                const sortModel = params.request.sortModel;
                const sort = [];
                forEach(sortModel, sortField => {
                    sort.push(`${sortField.colId} ${sortField.sort}`);
                });
                console.log('Server Side Datasource - Requesting rows by sortModel:', sortModel);
                if (sort.length > 0) {
                    separator = url.includes('?') ? '&' : '?';
                    url += `${separator}sort=${sort.join(",")}`;
                }

                const response = await fetch(url, {
                    credentials: 'include',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    //     'Authorization': 'Bearer ${context.tenantId},${context.authToken}' //TODO context中没取到数据
                    // }
                });

                if (!response.ok) {
                    throw new Error(`Server error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Server Side Datasource - data:', data);

                params.success({
                    rowData: data.data,
                    rowCount: data.totalCount
                });
            } catch (error) {
                console.error('Error fetching data from server:', error);
                // env.notify("error", '无法从服务器获取数据，请检查网络连接并重试。如果问题持续，请联系技术支持。');
                params.fail();
            }
        }
    };
}

function getDataTypeDefinitions() {
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
                // lookup字段值显示和导出为excel，不可以使用 cellRenderer ，因为导出excel不认
                var fieldType = params.colDef.cellEditorParams.fieldConfig.type;
                var fieldName = params.colDef.field;
                var fieldValue = params.data[fieldName];
                if (!fieldValue) return null;

                return fieldValue.name || "";
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
                        console.log("===整数直接返回显示和导出2===");
                        // 整数直接返回显示和导出
                        return fieldValue;
                    }
                }
            }
        }
    };
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

function getColumnDef(field: any, dataTypeDefinitions: any, mode: string, { dispatchEvent, env }) {
    const isReadonly = mode === "read";
    const isAdmin = mode === "admin";
    var cellDataType: any,
        cellEditorParams: any,
        cellEditor: any,
        cellRendererParams: any,
        cellRenderer: any,
        valueFormatter: any,
        valueGetter: any,
        fieldOptions: any,
        editable = true,
        filter: any,
        filterParams: any;

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
                values: fieldOptions
            });
            // cellEditor = MultiSelectCellEditor;
            filter = 'agSetColumnFilter';
            Object.assign(filterParams, {
                values: fieldOptions
            });
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
            editable = false;
            // cellEditor = DateTimeEditor;
            // 因为日期时间依赖了DateTimeEditor.init函数中对初始值定义，所以这里没必要再走一次valueGetter
            // valueGetter = dataTypeDefinitions.date.valueGetter;
            /*
            filter = 'agDateColumnFilter';
            Object.assign(filterParams, {
                filterOptions: ["equals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
            });*/
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
            cellDataType = 'lookup';
            editable = false;
            // 不可以使用 cellRenderer ，因为导出excel不认
            // cellRenderer = function(params) { return (params.value && params.value.name) || ""; }
            valueGetter = dataTypeDefinitions.lookup.valueGetter;
            break;
        default:
            cellDataType = 'text'; // 默认类型
    }

    let mainMenuItems: any;
    // 系统字段不显示额外菜单
    if (isAdmin && !field.is_system) {
        // 使用闭包把 table 参数传递给事件处理函数
        const getMainMenuItemsRaw = function (params: any) {
            return getMainMenuItems(params, { dispatchEvent, env });
        };
        mainMenuItems = getMainMenuItemsRaw;
    }

    return {
        field: field.name.toLowerCase(),
        headerName: field.label,
        cellDataType: cellDataType,
        cellEditorParams: cellEditorParams,
        cellEditor: cellEditor,
        cellRendererParams: cellRendererParams,
        cellRenderer: cellRenderer,
        editable: isCellReadonly ? false : editable,
        valueFormatter: valueFormatter,
        valueGetter: valueGetter,
        // tooltipValueGetter: tooltipValueGetter,
        filter: filter,
        filterParams: filterParams,
        mainMenuItems: mainMenuItems,
        suppressMovable: suppressMovable,
        lockPosition: lockPosition
    };

}

export function getGridOptions(table: any, mode: string, { dispatchEvent, env, getRows }) {
    if (!table || !table.fields) {
        return null;
    }
    let tableId = table._id;
    let tableLabel = table.label;
    const isReadonly = mode === "read";
    const isAdmin = mode === "admin";
    var dataTypeDefinitions = getDataTypeDefinitions();

    var columnDefs = table.fields.map(function (field) {
        return getColumnDef(field, dataTypeDefinitions, mode, { dispatchEvent, env });
    });

    // if (!isReadonly){
    //     // 添加选择列，这里单独添加选择列，不使用rowSelection配置为对象的方式默认生成的选择列是为了把索引列排在第一列
    //     columnDefs.unshift({
    //         headerCheckboxSelection: true,
    //         checkboxSelection: true,
    //         flex: null,//不配置的话，默认走defaultColDef中的flex:1的话，宽度不生效
    //         width: 50,
    //         minWidth: 50,
    //         contextMenuItems: [],
    //         mainMenuItems: [],
    //         pinned: 'left',
    //         suppressMovable: true,
    //         suppressHeaderMenuButton: true,
    //         suppressHeaderContextMenu: true,
    //         suppressFloatingFilterButton: true,
    //         resizable: false,
    //         sortable: false
    //     });
    // }
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

    // 使用闭包把 table 参数传递给事件处理函数
    const onRowValueChangedRaw = (event: any) => {
        // onRowValueChanged(event, table, { env });
    };
    const onCellValueChangedRaw = (event: any) => {
        // onCellValueChanged(event, table, { env });
    };
    const onDragStoppedRaw = (event: any) => {
        // onDragStopped(event, dispatchEvent);
    };

    var needToValiTable = table.verifications && table.verifications.length > 0;
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
                const colDefs = keyBy(map(allGridColumns, "colDef"), "field");
                // var fieldsVerificationErrors = getFieldsVerificationErrors(params.data, colDefs);
                // var tableVerificationErrors = getTableVerificationErrors(params.data, table.verifications, { env });
                // const verificationErrors = union(fieldsVerificationErrors, tableVerificationErrors);
                // params.data.__verificationErrors = verificationErrors;

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
        stopEditingWhenCellsLoseFocus: true,
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
            headerCheckbox: true
        },
        // 勾选框列单独在columnDefs中定义后，rowSelection定义为上面的对象格式会多显示一列勾选框列
        // rowSelection: isReadonly ? null : "multiple",
        suppressRowClickSelection: true,
        onStoreUpdated: function (event) {
            var rowCount = event.api.getDisplayedRowCount();
            console.log('onStoreUpdated:', rowCount);
            // getRows 初始加载数据，过滤数据，列排序等，gridApi.applyServerSideTransaction 新建记录、删除记录都会触发
            // dispatchEvent("setTotalCount", {
            //     "totalCount": rowCount
            // });
        },
        onGridReady: function (params: any) {
            // getRows 初始加载数据，过滤数据，列排序等，gridApi.applyServerSideTransaction 新建记录、删除记录都会触发
            dispatchEvent("setGridApi", {
                "gridApi": params.api,
                "gridContext": {
                    // setRowDataFormulaValues
                }
            });
        },
        defaultExcelExportParams: {
            fileName: tableLabel,
            columnKeys: columnFieldNames
        },
        defaultCsvExportParams: {
            fileName: tableLabel,
            columnKeys: columnFieldNames
        },
        // serverSideDatasource: getServerSideDatasource(tableId)
        serverSideDatasource: {
            getRows
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

    // gridOptions = Object.assign({}, config, gridOptions);
    console.log("amis agGrid gridOptions:", gridOptions);
    return gridOptions;
}