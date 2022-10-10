/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var mobxStateTree = require('mobx-state-tree');
var cloneDeep = require('lodash/cloneDeep');
var isEqual = require('lodash/isEqual');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var HeadCellSearchDropdown = require('./HeadCellSearchDropdown.js');
require('./TableCell.js');
require('./ColumnToggler.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);

var Table2 = /** @class */ (function (_super) {
    tslib.__extends(Table2, _super);
    function Table2(props, context) {
        var _this = _super.call(this, props) || this;
        _this.renderedToolbars = [];
        var scoped = context;
        scoped.registerComponent(_this);
        var store = props.store, columnsTogglable = props.columnsTogglable, columns = props.columns, keepItemSelectionOnPageChange = props.keepItemSelectionOnPageChange, maxKeepItemSelectionLength = props.maxKeepItemSelectionLength;
        store.update({
            columnsTogglable: columnsTogglable,
            columns: columns,
            keepItemSelectionOnPageChange: keepItemSelectionOnPageChange,
            maxKeepItemSelectionLength: maxKeepItemSelectionLength
        });
        Table2.syncRows(store, props, undefined) && _this.syncSelected();
        return _this;
    }
    Table2.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    Table2.prototype.syncSelected = function () {
        var _a = this.props, store = _a.store, onSelect = _a.onSelect;
        onSelect &&
            onSelect(store.selectedRows.map(function (item) { return item.data; }), store.unSelectedRows.map(function (item) { return item.data; }));
    };
    Table2.syncRows = function (store, props, prevProps) {
        var _a, _b;
        var source = props.source;
        var value = props.value || props.items;
        var rows = [];
        var updateRows = false;
        if (Array.isArray(value) &&
            (!prevProps || (prevProps.value || prevProps.items) !== value)) {
            updateRows = true;
            rows = value;
        }
        else if (typeof source === 'string') {
            var resolved = amisCore.resolveVariableAndFilter(source, props.data, '| raw');
            var prev = prevProps
                ? amisCore.resolveVariableAndFilter(source, prevProps.data, '| raw')
                : null;
            if (prev && prev === resolved) {
                updateRows = false;
            }
            else if (Array.isArray(resolved)) {
                updateRows = true;
                rows = resolved;
            }
        }
        updateRows &&
            store.initRows(rows, props.getEntryId, props.reUseRow, props.childrenColumnName);
        var selectedRowKeys = [];
        // selectedRowKeysExpr比selectedRowKeys优先级高
        if (props.rowSelection && props.rowSelection.selectedRowKeysExpr) {
            rows.forEach(function (row, index) {
                var _a, _b;
                var flag = amisCore.evalExpression(((_a = props.rowSelection) === null || _a === void 0 ? void 0 : _a.selectedRowKeysExpr) || '', {
                    record: row,
                    rowIndex: index
                });
                if (flag) {
                    selectedRowKeys.push(row[((_b = props === null || props === void 0 ? void 0 : props.rowSelection) === null || _b === void 0 ? void 0 : _b.keyField) || 'key']);
                }
            });
        }
        else if (props.rowSelection && props.rowSelection.selectedRowKeys) {
            selectedRowKeys = tslib.__spreadArray([], props.rowSelection.selectedRowKeys, true);
        }
        if (updateRows && selectedRowKeys.length > 0) {
            store.updateSelected(selectedRowKeys, (_a = props.rowSelection) === null || _a === void 0 ? void 0 : _a.keyField);
        }
        var expandedRowKeys = [];
        if (props.expandable && props.expandable.expandedRowKeysExpr) {
            rows.forEach(function (row, index) {
                var _a, _b;
                var flag = amisCore.evalExpression(((_a = props.expandable) === null || _a === void 0 ? void 0 : _a.expandedRowKeysExpr) || '', {
                    record: row,
                    rowIndex: index
                });
                if (flag) {
                    expandedRowKeys.push(row[((_b = props === null || props === void 0 ? void 0 : props.expandable) === null || _b === void 0 ? void 0 : _b.keyField) || 'key']);
                }
            });
        }
        else if (props.expandable && props.expandable.expandedRowKeys) {
            expandedRowKeys = tslib.__spreadArray([], props.expandable.expandedRowKeys, true);
        }
        if (updateRows && expandedRowKeys.length > 0) {
            store.updateExpanded(expandedRowKeys, (_b = props.expandable) === null || _b === void 0 ? void 0 : _b.keyField);
        }
        return updateRows;
    };
    Table2.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if (amisCore.anyChanged(['columnsTogglable'], prevProps, props)) {
            store.update({
                columnsTogglable: props.columnsTogglable
            });
        }
        if (amisCore.anyChanged(['source', 'value', 'items'], prevProps, props) ||
            (!props.value &&
                !props.items &&
                (props.data !== prevProps.data ||
                    (typeof props.source === 'string' && amisCore.isPureVariable(props.source))))) {
            Table2.syncRows(store, props, prevProps) && this.syncSelected();
        }
        if (!isEqual__default["default"](prevProps.columns, props.columns)) {
            store.update({
                columns: props.columns
            });
        }
    };
    Table2.prototype.getPopOverContainer = function () {
        return ReactDOM.findDOMNode(this);
    };
    Table2.prototype.renderCellSchema = function (schema, props) {
        var render = this.props.render;
        // Table Cell SchemaObject转化成ReactNode
        if (schema && amisCore.isObject(schema)) {
            // 在TableCell里会根据width设置div的width
            // 原来的table td/th是最外层标签 设置width没问题
            // table2的拆开了 就不需要再设置div的width了
            // 否则加上padding 就超出单元格的区域了
            // children属性在schema里是一个关键字 在渲染器schema中 自定义的children没有用 去掉
            schema.width; schema.children; var rest = tslib.__rest(schema, ["width", "children"]);
            return render('cell-field', tslib.__assign(tslib.__assign({}, rest), { type: 'cell-field', column: rest, data: props.data, name: schema.name }), props);
        }
        return schema;
    };
    Table2.prototype.renderSchema = function (key, schema, props) {
        var render = this.props.render;
        // Header、Footer等SchemaObject转化成ReactNode
        if (schema && amisCore.isObject(schema)) {
            return render(key || 'field', tslib.__assign(tslib.__assign({}, schema), { data: props.data }), props);
        }
        else if (Array.isArray(schema)) {
            var renderers_1 = [];
            schema.forEach(function (s, i) {
                return renderers_1.push(render(key || 'field', tslib.__assign(tslib.__assign({}, s), { data: props.data }), tslib.__assign(tslib.__assign({}, props), { key: i })));
            });
            return renderers_1;
        }
        return schema;
    };
    // editor传来的处理过的column 还可能包含其他字段
    Table2.prototype.buildColumns = function (columns) {
        var _this = this;
        var _a = this.props, env = _a.env, render = _a.render, store = _a.store, popOverContainer = _a.popOverContainer, canAccessSuperData = _a.canAccessSuperData, showBadge = _a.showBadge, itemBadge = _a.itemBadge, cx = _a.classnames;
        var cols = [];
        var rowSpans = [];
        var colSpans = [];
        Array.isArray(columns) &&
            columns.forEach(function (column, col) {
                var clone = tslib.__assign({}, column);
                var titleSchema = null;
                var titleProps = {
                    popOverContainer: popOverContainer || _this.getPopOverContainer,
                    value: column.title
                };
                if (amisCore.isObject(column.title)) {
                    titleSchema = cloneDeep__default["default"](column.title);
                }
                else if (typeof column.title === 'string') {
                    titleSchema = { type: 'plain' };
                }
                var titleRender = function (children) {
                    var _a;
                    var content = _this.renderCellSchema(titleSchema, titleProps);
                    var remark = null;
                    if (column.remark) {
                        remark = render('remark', {
                            type: 'remark',
                            tooltip: column.remark,
                            container: env && env.getModalContainer ? env.getModalContainer : undefined
                        });
                    }
                    return (React__default["default"].createElement("div", { key: col, className: cx('Table-head-cell-wrapper', (_a = {},
                            _a["".concat(column.className)] = !!column.className,
                            _a["".concat(column.titleClassName)] = !!column.titleClassName,
                            _a)) },
                        content,
                        remark,
                        children));
                };
                Object.assign(clone, {
                    title: titleRender
                });
                // 设置了type值 就完全按渲染器处理了
                if (column.type) {
                    Object.assign(clone, {
                        render: function (text, record, rowIndex, colIndex) {
                            var props = {};
                            var item = store.getRowByIndex(rowIndex) || {};
                            var obj = {
                                children: _this.renderCellSchema(column, {
                                    data: item.locals,
                                    value: column.name
                                        ? amisCore.resolveVariable(column.name, canAccessSuperData ? item.locals : item.data)
                                        : column.name,
                                    popOverContainer: popOverContainer || _this.getPopOverContainer,
                                    onQuickChange: function (values, saveImmediately, savePristine, options) {
                                        _this.handleQuickChange(item, values, saveImmediately, savePristine, options);
                                    },
                                    row: item,
                                    showBadge: showBadge,
                                    itemBadge: itemBadge
                                }),
                                props: props
                            };
                            if (column.rowSpanExpr) {
                                var rowSpan = +amisCore.filter(column.rowSpanExpr, {
                                    record: record,
                                    rowIndex: rowIndex,
                                    colIndex: colIndex
                                });
                                if (rowSpan) {
                                    obj.props.rowSpan = rowSpan;
                                    rowSpans.push({ colIndex: colIndex, rowIndex: rowIndex, rowSpan: rowSpan });
                                }
                            }
                            if (column.colSpanExpr) {
                                var colSpan = +amisCore.filter(column.colSpanExpr, {
                                    record: record,
                                    rowIndex: rowIndex,
                                    colIndex: colIndex
                                });
                                if (colSpan) {
                                    obj.props.colSpan = colSpan;
                                    colSpans.push({ colIndex: colIndex, rowIndex: rowIndex, colSpan: colSpan });
                                }
                            }
                            rowSpans.forEach(function (item) {
                                if (colIndex === item.colIndex &&
                                    rowIndex > item.rowIndex &&
                                    rowIndex < item.rowIndex + (item.rowSpan || 0)) {
                                    obj.props.rowSpan = 0;
                                }
                            });
                            colSpans.forEach(function (item) {
                                if (rowIndex === item.rowIndex &&
                                    colIndex > item.colIndex &&
                                    colIndex < item.colIndex + (item.colSpan || 0)) {
                                    obj.props.colSpan = 0;
                                }
                            });
                            return obj;
                        }
                    });
                }
                // 设置了单元格样式
                if (column.classNameExpr) {
                    clone.className = function (record, rowIndex) {
                        var className = amisCore.filter(column.classNameExpr, { record: record, rowIndex: rowIndex });
                        return "".concat(className).concat(column.className ? " ".concat(column.className) : '');
                    };
                }
                // 设置了列搜索
                if (column.searchable) {
                    clone.filterDropdown = (React__default["default"].createElement(HeadCellSearchDropdown.HeadCellSearchDropDown, tslib.__assign({}, _this.props, { popOverContainer: _this.getPopOverContainer, name: column.name, searchable: column.searchable, orderBy: store.orderBy, orderDir: store.order, data: store.query, key: 'th-search-' + col, store: store })));
                }
                if (column.children) {
                    clone.children = _this.buildColumns(column.children);
                }
                cols.push(clone);
            });
        return cols;
    };
    Table2.prototype.buildSummary = function (key, summary) {
        var _this = this;
        var result = [];
        if (Array.isArray(summary)) {
            summary.forEach(function (s, index) {
                if (amisCore.isObject(s)) {
                    result.push({
                        colSpan: s.colSpan,
                        fixed: s.fixed,
                        render: function (dataSouce) {
                            return _this.renderSchema(key, s, {
                                data: dataSouce
                            });
                        }
                    });
                }
                else if (Array.isArray(s)) {
                    if (!result[index]) {
                        result.push([]);
                    }
                    s.forEach(function (d) {
                        result[index].push({
                            colSpan: d.colSpan,
                            fixed: d.fixed,
                            render: function (dataSouce) {
                                return _this.renderSchema(key, d, {
                                    data: dataSouce
                                });
                            }
                        });
                    });
                }
            });
        }
        return result.length ? result : null;
    };
    Table2.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    Table2.prototype.handleSave = function (rows, diff, indexes, unModifiedItems, rowsOrigin, options) {
        var _this = this;
        var _a = this.props, store = _a.store, quickSaveApi = _a.quickSaveApi, quickSaveItemApi = _a.quickSaveItemApi, primaryField = _a.primaryField, env = _a.env, messages = _a.messages, reload = _a.reload;
        if (Array.isArray(rows)) {
            if (!amisCore.isEffectiveApi(quickSaveApi)) {
                env && env.alert('Table2 quickSaveApi is required');
                return;
            }
            var data_1 = amisCore.createObject(store.data, {
                rows: rows,
                rowsDiff: diff,
                indexes: indexes,
                rowsOrigin: rowsOrigin
            });
            if (rows.length && rows[0].hasOwnProperty(primaryField || 'id')) {
                data_1.ids = rows
                    .map(function (item) { return item[primaryField || 'id']; })
                    .join(',');
            }
            if (unModifiedItems) {
                data_1.unModifiedItems = unModifiedItems;
            }
            store
                .saveRemote(quickSaveApi, data_1, {
                successMessage: messages && messages.saveFailed,
                errorMessage: messages && messages.saveSuccess
            })
                .then(function () {
                reload && _this.reloadTarget(reload, data_1);
            })
                .catch(function () { });
        }
        else {
            if (!amisCore.isEffectiveApi(quickSaveItemApi)) {
                env && env.alert('Table2 quickSaveItemApi is required!');
                return;
            }
            var data_2 = amisCore.createObject(store.data, {
                item: rows,
                modified: diff,
                origin: rowsOrigin
            });
            var sendData = amisCore.createObject(data_2, rows);
            store
                .saveRemote(quickSaveItemApi, sendData)
                .then(function () {
                reload && _this.reloadTarget(reload, data_2);
            })
                .catch(function () {
                (options === null || options === void 0 ? void 0 : options.resetOnFailed) && _this.reset();
            });
        }
    };
    Table2.prototype.handleQuickChange = function (item, values, saveImmediately, savePristine, options) {
        if (!mobxStateTree.isAlive(item)) {
            return;
        }
        var _a = this.props, onSave = _a.onSave, onPristineChange = _a.onPristineChange, primaryField = _a.primaryField, quickSaveItemApi = _a.quickSaveItemApi;
        item.change(values, savePristine);
        // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
        item.modified && this.syncSelected();
        if (savePristine) {
            onPristineChange === null || onPristineChange === void 0 ? void 0 : onPristineChange(item.data, item.path);
            return;
        }
        if (saveImmediately && saveImmediately.api) {
            this.props.onAction &&
                this.props.onAction(null, {
                    actionType: 'ajax',
                    api: saveImmediately.api,
                    reload: options === null || options === void 0 ? void 0 : options.reload
                }, values);
            return;
        }
        onSave
            ? onSave(item.data, amisCore.difference(item.data, item.pristine, ['id', primaryField]), item.path, undefined, item.pristine, options)
            : this.handleSave(quickSaveItemApi ? item.data : [item.data], amisCore.difference(item.data, item.pristine, ['id', primaryField]), [item.path], undefined, item.pristine, options);
    };
    Table2.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        // todo
        onAction && onAction(e, action, ctx);
    };
    Table2.prototype.renderActions = function (region) {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, store = _a.store, cx = _a.classnames, data = _a.data, columnsTogglable = _a.columnsTogglable, $path = _a.$path;
        // 如果table是在crud里面，自定义显示列配置在grid里，这里就不需要渲染了
        var isInCrud = /(?:\/|^)crud2\//.test($path);
        actions = Array.isArray(actions) ? actions.concat() : [];
        var config = amisCore.isObject(columnsTogglable) ? columnsTogglable : {};
        // 现在默认从crud里传进来的columnsTogglable是boolean类型
        // table单独配置的是SchemaNode类型
        if (!isInCrud &&
            store.toggable &&
            region === 'header' &&
            !~this.renderedToolbars.indexOf('columns-toggler')) {
            actions.push({
                type: 'button',
                children: render('column-toggler', tslib.__assign(tslib.__assign({}, config), { type: 'column-toggler' }), {
                    cols: store.columnsData,
                    toggleAllColumns: function () { return store.toggleAllColumns(); },
                    toggleToggle: function (toggled, index) {
                        var column = store.columnsData[index];
                        column.toggleToggle();
                    }
                })
            });
        }
        return Array.isArray(actions) && actions.length ? (React__default["default"].createElement("div", { className: cx('Table-toolbar') }, actions.map(function (action, key) {
            return render("action/".concat(key), tslib.__assign({ type: 'button' }, action), {
                onAction: _this.handleAction,
                key: key,
                btnDisabled: store.dragging,
                data: store.getData(data)
            });
        }))) : null;
    };
    Table2.prototype.handleSelected = function (selectedRows, selectedRowKeys, unSelectedRows) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, rowSelection, onSelect, store, keyField, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, rowSelection = _a.rowSelection, onSelect = _a.onSelect, store = _a.store, keyField = _a.keyField;
                        return [4 /*yield*/, dispatchEvent('selectedChange', amisCore.createObject(data, {
                                selectedItems: selectedRows,
                                unSelectedItems: unSelectedRows
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        store.updateSelected(selectedRowKeys, (rowSelection === null || rowSelection === void 0 ? void 0 : rowSelection.keyField) || keyField);
                        onSelect && onSelect(selectedRows, unSelectedRows);
                        return [2 /*return*/];
                }
            });
        });
    };
    Table2.prototype.handleSort = function (payload) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onSort, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onSort = _a.onSort;
                        return [4 /*yield*/, dispatchEvent('columnSort', amisCore.createObject(data, {
                                orderBy: payload.orderBy,
                                orderDir: payload.order
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        onSort && onSort(payload);
                        return [2 /*return*/];
                }
            });
        });
    };
    Table2.prototype.handleFilter = function (payload) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onFilter, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onFilter = _a.onFilter;
                        return [4 /*yield*/, dispatchEvent('columnFilter', amisCore.createObject(data, payload))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        onFilter && onFilter(payload);
                        return [2 /*return*/];
                }
            });
        });
    };
    Table2.prototype.handleRowClick = function (event, rowItem, rowIndex) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onRow, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onRow = _a.onRow;
                        return [4 /*yield*/, dispatchEvent('rowClick', amisCore.createObject(data, { rowItem: rowItem }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        if (rowItem && onRow) {
                            onRow.onRowClick && onRow.onRowClick(event, rowItem, rowIndex);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Table2.prototype.handleOrderChange = function (oldIndex, newIndex, levels) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var store, rowItem;
            return tslib.__generator(this, function (_a) {
                store = this.props.store;
                rowItem = store.getRowByIndex(oldIndex, levels);
                store.exchange(oldIndex, newIndex, rowItem);
                return [2 /*return*/];
            });
        });
    };
    Table2.prototype.handleSaveOrder = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, onSaveOrder, data, dispatchEvent, movedItems, items, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, onSaveOrder = _a.onSaveOrder, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        movedItems = store.movedRows.map(function (item) { return item.data; });
                        items = store.rows.map(function (item) {
                            return item.getDataWithModifiedChilden();
                        });
                        return [4 /*yield*/, dispatchEvent('orderChange', amisCore.createObject(data, { movedItems: movedItems }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        if (!onSaveOrder || !store.movedRows.length) {
                            return [2 /*return*/];
                        }
                        onSaveOrder(movedItems, items);
                        return [2 /*return*/];
                }
            });
        });
    };
    Table2.prototype.reset = function () {
        var store = this.props.store;
        store.reset();
    };
    Table2.prototype.doAction = function (action, args, throwErrors) {
        var _this = this;
        var _a = this.props, store = _a.store, rowSelection = _a.rowSelection, data = _a.data, key = _a.keyField, expandable = _a.expandable;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var keyField = (rowSelection === null || rowSelection === void 0 ? void 0 : rowSelection.keyField) || key || 'key';
        var dataSource = store.getData(data).items || [];
        switch (actionType) {
            case 'selectAll':
                store.updateSelectedAll(keyField);
                break;
            case 'clearAll':
                store.updateSelected([], keyField);
                break;
            case 'select':
                var selected_1 = [];
                dataSource.forEach(function (item, rowIndex) {
                    var flag = amisCore.evalExpression(args === null || args === void 0 ? void 0 : args.selectedRowKeysExpr, {
                        record: item,
                        rowIndex: rowIndex
                    });
                    if (flag) {
                        selected_1.push(item[keyField]);
                    }
                });
                store.updateSelected(selected_1, keyField);
                break;
            case 'expand':
                var expandableKey_1 = (expandable === null || expandable === void 0 ? void 0 : expandable.keyField) || key || 'key';
                var expanded_1 = [];
                var collapse_1 = [];
                // value值控制展开1个
                if (args === null || args === void 0 ? void 0 : args.value) {
                    var rowIndex = dataSource.findIndex(function (d) { return d[expandableKey_1] === args.value; });
                    var item = dataSource[rowIndex];
                    if (this.tableRef && this.tableRef.isExpandableRow(item, rowIndex)) {
                        if (this.tableRef.isExpanded(item)) {
                            collapse_1.push(item);
                        }
                        else {
                            expanded_1.push(item);
                        }
                    }
                }
                else if (args === null || args === void 0 ? void 0 : args.expandedRowsExpr) {
                    dataSource.forEach(function (item, rowIndex) {
                        var flag = amisCore.evalExpression(args === null || args === void 0 ? void 0 : args.expandedRowsExpr, {
                            record: item,
                            rowIndex: rowIndex
                        });
                        if (flag &&
                            _this.tableRef &&
                            _this.tableRef.isExpandableRow(item, rowIndex)) {
                            if (_this.tableRef.isExpanded(item)) {
                                collapse_1.push(item);
                            }
                            else {
                                expanded_1.push(item);
                            }
                        }
                    });
                }
                if (expanded_1.length > 0) {
                    this.tableRef && this.tableRef.onExpandRows(expanded_1);
                }
                if (collapse_1.length > 0) {
                    this.tableRef && this.tableRef.onCollapseRows(collapse_1);
                }
                break;
        }
    };
    Table2.prototype.getRef = function (ref) {
        this.tableRef = ref;
    };
    Table2.prototype.renderTable = function () {
        var _this = this;
        var _a = this.props, render = _a.render, title = _a.title, footer = _a.footer, rowSelection = _a.rowSelection; _a.columns; var expandable = _a.expandable, footSummary = _a.footSummary, headSummary = _a.headSummary, loading = _a.loading, cx = _a.classnames, placeholder = _a.placeholder, rowClassNameExpr = _a.rowClassNameExpr, itemActions = _a.itemActions, keyField = _a.keyField, onRow = _a.onRow, store = _a.store, rest = tslib.__rest(_a, ["render", "title", "footer", "rowSelection", "columns", "expandable", "footSummary", "headSummary", "loading", "classnames", "placeholder", "rowClassNameExpr", "itemActions", "keyField", "onRow", "store"]);
        var expandableConfig = null;
        if (expandable) {
            expandable.expandedRowKeys; var rest_1 = tslib.__rest(expandable, ["expandedRowKeys"]);
            expandableConfig = tslib.__assign({ expandedRowKeys: store.currentExpandedKeys }, rest_1);
            if (expandable.expandableOn) {
                expandableConfig.rowExpandable = function (record, rowIndex) {
                    return amisCore.evalExpression(expandable.expandableOn, { record: record, rowIndex: rowIndex });
                };
                delete expandableConfig.expandableOn;
            }
            if (expandable && expandable.type) {
                expandableConfig.expandedRowRender = function (record, rowIndex) {
                    return _this.renderSchema('expandableBody', tslib.__assign({}, expandable), { data: record });
                };
            }
            if (expandable.expandedRowClassNameExpr) {
                expandableConfig.expandedRowClassName = function (record, rowIndex) { return amisCore.filter(expandable.expandedRowClassNameExpr, { record: record, rowIndex: rowIndex }); };
                delete expandableConfig.expandedRowClassNameExpr;
            }
        }
        var rowSelectionConfig = null;
        if (rowSelection) {
            rowSelection.selectedRowKeys; var selections = rowSelection.selections, rest_2 = tslib.__rest(rowSelection, ["selectedRowKeys", "selections"]);
            rowSelectionConfig = tslib.__assign({ selectedRowKeys: store.currentSelectedRowKeys, maxSelectedLength: store.maxKeepItemSelectionLength }, rest_2);
            var disableOn_1 = rowSelection.disableOn;
            rowSelectionConfig.getCheckboxProps = function (record, rowIndex) {
                return {
                    disabled: (disableOn_1
                        ? amisCore.evalExpression(disableOn_1, { record: record, rowIndex: rowIndex })
                        : false) ||
                        (store.maxKeepItemSelectionLength &&
                            store.currentSelectedRowKeys.length >=
                                store.maxKeepItemSelectionLength &&
                            !store.currentSelectedRowKeys.includes(record[rowSelection.keyField || keyField || 'key']))
                };
            };
            disableOn_1 && delete rowSelectionConfig.disableOn;
            if (selections && Array.isArray(selections)) {
                rowSelectionConfig.selections = [];
                selections.forEach(function (item) {
                    rowSelectionConfig.selections.push({
                        key: item.key,
                        text: item.text,
                        onSelect: function (changableRowKeys) {
                            var newSelectedRowKeys = [];
                            newSelectedRowKeys = changableRowKeys.filter(function (key, index) {
                                if (item.key === 'all') {
                                    return true;
                                }
                                if (item.key === 'none') {
                                    return false;
                                }
                                if (item.key === 'invert') {
                                    return !store.currentSelectedRowKeys.includes(key);
                                }
                                // 奇数行
                                if (item.key === 'odd') {
                                    if (index % 2 !== 0) {
                                        return false;
                                    }
                                    return true;
                                }
                                // 偶数行
                                if (item.key === 'even') {
                                    if (index % 2 !== 0) {
                                        return true;
                                    }
                                    return false;
                                }
                                return true;
                            });
                            store.updateSelected(newSelectedRowKeys, rowSelection.keyField);
                        }
                    });
                });
            }
        }
        var rowClassName = undefined;
        // 设置了行样式
        if (rowClassNameExpr) {
            rowClassName = function (record, rowIndex) {
                return amisCore.filter(rowClassNameExpr, { record: record, rowIndex: rowIndex });
            };
        }
        var itemActionsConfig = undefined;
        if (itemActions) {
            var finalActions_1 = Array.isArray(itemActions)
                ? itemActions.filter(function (action) { return !action.hiddenOnHover; })
                : [];
            if (!finalActions_1.length) {
                return null;
            }
            itemActionsConfig = function (record, rowIndex) {
                return (React__default["default"].createElement("div", { className: cx('Table-itemActions') }, finalActions_1.map(function (action, index) {
                    return render("itemAction/".concat(index), tslib.__assign(tslib.__assign({}, action), { isMenuItem: true }), {
                        key: index,
                        item: record,
                        data: record,
                        rowIndex: rowIndex
                    });
                })));
            };
        }
        return (React__default["default"].createElement(amisUi.Table, tslib.__assign({}, rest, { onRef: this.getRef, title: this.renderSchema('title', title, { data: this.props.data }), footer: this.renderSchema('footer', footer, { data: this.props.data }), columns: this.buildColumns(store.filteredColumns), dataSource: store.dataSource, rowSelection: rowSelectionConfig, rowClassName: rowClassName, expandable: expandableConfig, footSummary: this.buildSummary('footSummary', footSummary), headSummary: this.buildSummary('headSummary', headSummary), loading: this.renderSchema('loading', loading), placeholder: this.renderSchema('placeholder', placeholder), onSelect: this.handleSelected, onSelectAll: this.handleSelected, onSort: this.handleSort, onFilter: this.handleFilter, onDrag: this.handleOrderChange, itemActions: itemActionsConfig, onRow: tslib.__assign(tslib.__assign({}, onRow), { onRowClick: this.handleRowClick }) })));
    };
    Table2.prototype.renderHeading = function () {
        var _a = this.props, store = _a.store, cx = _a.classnames, headingClassName = _a.headingClassName, __ = _a.translate;
        if (store.moved) {
            return (React__default["default"].createElement("div", { className: cx('Table-heading', headingClassName), key: "heading" }, store.moved ? (React__default["default"].createElement("span", null,
                __('Table.moved', {
                    moved: store.moved
                }),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSaveOrder },
                    React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon m-r-xs" }),
                    __('Form.submit')),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon m-r-xs" }),
                    __('Table.discard')))) : null));
        }
        return null;
    };
    Table2.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, _b = _a.loading, loading = _b === void 0 ? false : _b;
        this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了
        var heading = this.renderHeading();
        return (React__default["default"].createElement("div", { className: cx('Table-render-wrapper') },
            this.renderActions('header'),
            heading,
            this.renderTable(),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, show: loading })));
    };
    Table2.contextType = amisCore.ScopedContext;
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Table2.prototype, "getPopOverContainer", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Array,
            Array, Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table2.prototype, "handleSave", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Object, Boolean, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table2.prototype, "handleQuickChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table2.prototype, "handleAction", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array,
            Array,
            Array]),
        tslib.__metadata("design:returntype", Promise)
    ], Table2.prototype, "handleSelected", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], Table2.prototype, "handleSort", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], Table2.prototype, "handleFilter", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Number]),
        tslib.__metadata("design:returntype", Promise)
    ], Table2.prototype, "handleRowClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number, Number, Array]),
        tslib.__metadata("design:returntype", Promise)
    ], Table2.prototype, "handleOrderChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", Promise)
    ], Table2.prototype, "handleSaveOrder", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Table2.prototype, "reset", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table2.prototype, "getRef", null);
    return Table2;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TableRenderer, _super);
    function TableRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableRenderer.prototype.receive = function (values, subPath) {
        var _this = this;
        var _a, _b;
        var scoped = this.context;
        var parents = (_a = scoped === null || scoped === void 0 ? void 0 : scoped.parent) === null || _a === void 0 ? void 0 : _a.getComponents();
        /**
         * 因为Table在scope上注册，导致getComponentByName查询组件时会优先找到Table，和CRUD联动的动作都会失效
         * 这里先做兼容处理，把动作交给上层的CRUD处理
         */
        if (Array.isArray(parents) && parents.length) {
            // CRUD的name会透传给Table，这样可以保证找到CRUD
            var crud = parents.find(function (cmpt) { var _a, _b; return ((_a = cmpt === null || cmpt === void 0 ? void 0 : cmpt.props) === null || _a === void 0 ? void 0 : _a.name) === ((_b = _this.props) === null || _b === void 0 ? void 0 : _b.name); });
            return (_b = crud === null || crud === void 0 ? void 0 : crud.receive) === null || _b === void 0 ? void 0 : _b.call(crud, values, subPath);
        }
        if (subPath) {
            return scoped.send(subPath, values);
        }
    };
    TableRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'table2',
            storeType: amisCore.TableStore2.name,
            name: 'table2',
            isolateScope: true
        })
    ], TableRenderer);
    return TableRenderer;
})(Table2));

exports["default"] = Table2;
