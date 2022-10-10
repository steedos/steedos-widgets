/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var amisCore = require('amis-core');
var forEach = require('lodash/forEach');
var amisUi = require('amis-ui');
var debouce = require('lodash/debounce');
var Sortable = require('sortablejs');
var find = require('lodash/find');
var TableCell = require('./TableCell.js');
var HeadCellFilterDropdown = require('./HeadCellFilterDropdown.js');
var HeadCellSearchDropdown = require('./HeadCellSearchDropdown.js');
var TableContent = require('./TableContent.js');
var TableBody = require('./TableBody.js');
var mobxStateTree = require('mobx-state-tree');
var ColumnToggler = require('./ColumnToggler.js');
var exportExcel = require('./exportExcel.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var forEach__default = /*#__PURE__*/_interopDefaultLegacy(forEach);
var debouce__default = /*#__PURE__*/_interopDefaultLegacy(debouce);
var Sortable__default = /*#__PURE__*/_interopDefaultLegacy(Sortable);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var Table = /** @class */ (function (_super) {
    tslib.__extends(Table, _super);
    function Table(props, context) {
        var _this = _super.call(this, props) || this;
        _this.lastScrollLeft = -1;
        _this.lastScrollTop = 0;
        _this.totalWidth = 0;
        _this.totalHeight = 0;
        _this.outterWidth = 0;
        _this.outterHeight = 0;
        _this.widths = {};
        _this.widths2 = {};
        _this.heights = {};
        _this.renderedToolbars = [];
        _this.subForms = {};
        var scoped = context;
        scoped.registerComponent(_this);
        _this.handleOutterScroll = _this.handleOutterScroll.bind(_this);
        _this.affixDetect = _this.affixDetect.bind(_this);
        _this.updateTableInfoLazy = debouce__default["default"](_this.updateTableInfo.bind(_this), 250, {
            trailing: true,
            leading: true
        });
        _this.tableRef = _this.tableRef.bind(_this);
        _this.affixedTableRef = _this.affixedTableRef.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.handleCheckAll = _this.handleCheckAll.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.handleSaveOrder = _this.handleSaveOrder.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        _this.renderCell = _this.renderCell.bind(_this);
        _this.renderHeadCell = _this.renderHeadCell.bind(_this);
        _this.renderToolbar = _this.renderToolbar.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
        _this.subFormRef = _this.subFormRef.bind(_this);
        _this.handleColumnToggle = _this.handleColumnToggle.bind(_this);
        _this.updateAutoFillHeight = _this.updateAutoFillHeight.bind(_this);
        var store = props.store, columns = props.columns, selectable = props.selectable, columnsTogglable = props.columnsTogglable, draggable = props.draggable, orderBy = props.orderBy, orderDir = props.orderDir, multiple = props.multiple, footable = props.footable, primaryField = props.primaryField, itemCheckableOn = props.itemCheckableOn, itemDraggableOn = props.itemDraggableOn, hideCheckToggler = props.hideCheckToggler, combineFromIndex = props.combineFromIndex, expandConfig = props.expandConfig, formItem = props.formItem, keepItemSelectionOnPageChange = props.keepItemSelectionOnPageChange, maxKeepItemSelectionLength = props.maxKeepItemSelectionLength;
        var combineNum = props.combineNum;
        if (typeof combineNum === 'string') {
            combineNum = parseInt(amisCore.resolveVariableAndFilter(combineNum, props.data, '| raw'), 10);
        }
        store.update({
            selectable: selectable,
            draggable: draggable,
            columns: columns,
            columnsTogglable: columnsTogglable,
            orderBy: orderBy,
            orderDir: orderDir,
            multiple: multiple,
            footable: footable,
            expandConfig: expandConfig,
            primaryField: primaryField,
            itemCheckableOn: itemCheckableOn,
            itemDraggableOn: itemDraggableOn,
            hideCheckToggler: hideCheckToggler,
            combineNum: combineNum,
            combineFromIndex: combineFromIndex,
            keepItemSelectionOnPageChange: keepItemSelectionOnPageChange,
            maxKeepItemSelectionLength: maxKeepItemSelectionLength
        });
        formItem && mobxStateTree.isAlive(formItem) && formItem.setSubStore(store);
        Table.syncRows(store, _this.props, undefined) && _this.syncSelected();
        return _this;
    }
    Table.syncRows = function (store, props, prevProps) {
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
        updateRows && store.initRows(rows, props.getEntryId, props.reUseRow);
        typeof props.selected !== 'undefined' &&
            store.updateSelected(props.selected, props.valueField);
        return updateRows;
    };
    Table.prototype.componentDidMount = function () {
        var currentNode = ReactDOM.findDOMNode(this);
        var parent = amisCore.getScrollParent(currentNode);
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        this.updateTableInfo();
        var dom = ReactDOM.findDOMNode(this);
        if (dom.closest('.modal-body')) {
            return;
        }
        this.affixDetect();
        parent.addEventListener('scroll', this.affixDetect);
        window.addEventListener('resize', this.affixDetect);
        this.updateAutoFillHeight();
        window.addEventListener('resize', this.updateAutoFillHeight);
        var _a = this.props, store = _a.store, autoGenerateFilter = _a.autoGenerateFilter, onSearchableFromInit = _a.onSearchableFromInit;
        // autoGenerateFilter 开启后
        // 如果没有一个 searchable 的 column crud 就不会初始化加载
        // 所以这里加个判断默认初始加载一次
        if (autoGenerateFilter &&
            !store.searchableColumns.length &&
            onSearchableFromInit) {
            onSearchableFromInit({});
        }
    };
    /**
     * 自动设置表格高度占满界面剩余区域
     * 用 css 实现有点麻烦，要改很多结构，所以先用 dom hack 了，避免对之前的功能有影响
     */
    Table.prototype.updateAutoFillHeight = function () {
        var _this = this;
        var _a = this.props, autoFillHeight = _a.autoFillHeight, footerToolbar = _a.footerToolbar, ns = _a.classPrefix;
        if (!autoFillHeight) {
            return;
        }
        var table = ReactDOM.findDOMNode(this);
        var tableContent = table.querySelector(".".concat(ns, "Table-content"));
        var tableContentWrap = table.querySelector(".".concat(ns, "Table-contentWrap"));
        var footToolbar = table.querySelector(".".concat(ns, "Table-footToolbar"));
        var leftFixedColumns = table.querySelector(".".concat(ns, "Table-fixedLeft"));
        var rightFixedColumns = table.querySelector(".".concat(ns, "Table-fixedRight"));
        if (!tableContent) {
            return;
        }
        // 计算 table-content 在 dom 中的位置
        var tableContentTop = amisCore.offset(tableContent).top;
        var viewportHeight = window.innerHeight;
        // 有时候会拿不到 footToolbar？
        var footToolbarHeight = footToolbar ? amisCore.offset(footToolbar).height : 0;
        // 有时候会拿不到 footToolbar，等一下在执行
        if (!footToolbarHeight && footerToolbar && footerToolbar.length) {
            this.timer = setTimeout(function () {
                _this.updateAutoFillHeight();
            }, 100);
            return;
        }
        var tableContentWrapMarginButtom = amisCore.getStyleNumber(tableContentWrap, 'margin-bottom');
        // 循环计算父级节点的 pddding，这里不考虑父级节点还可能会有其它兄弟节点的情况了
        var allParentPaddingButtom = 0;
        var parentNode = tableContent.parentElement;
        while (parentNode) {
            var paddingButtom = amisCore.getStyleNumber(parentNode, 'padding-bottom');
            var borderBottom = amisCore.getStyleNumber(parentNode, 'border-bottom-width');
            allParentPaddingButtom =
                allParentPaddingButtom + paddingButtom + borderBottom;
            parentNode = parentNode.parentElement;
        }
        var height = amisCore.isObject(autoFillHeight)
            ? autoFillHeight.height
            : 0;
        var tableContentHeight = height
            ? "".concat(height, "px")
            : "".concat(viewportHeight -
                tableContentTop -
                tableContentWrapMarginButtom -
                footToolbarHeight -
                allParentPaddingButtom, "px");
        tableContent.style.height = tableContentHeight;
        /**autoFillHeight开启后固定列会溢出Table高度，需要同步一下 */
        if (leftFixedColumns) {
            leftFixedColumns.style.height = tableContentHeight;
            leftFixedColumns.style.overflowY = 'auto';
        }
        if (rightFixedColumns) {
            rightFixedColumns.style.height = tableContentHeight;
            rightFixedColumns.style.overflowY = 'auto';
        }
    };
    Table.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if (amisCore.anyChanged([
            'selectable',
            'columnsTogglable',
            'draggable',
            'orderBy',
            'orderDir',
            'multiple',
            'footable',
            'primaryField',
            'itemCheckableOn',
            'itemDraggableOn',
            'hideCheckToggler',
            'combineNum',
            'combineFromIndex',
            'expandConfig'
        ], prevProps, props)) {
            var combineNum = props.combineNum;
            if (typeof combineNum === 'string') {
                combineNum = parseInt(amisCore.resolveVariableAndFilter(combineNum, props.data, '| raw'), 10);
            }
            store.update({
                selectable: props.selectable,
                columnsTogglable: props.columnsTogglable,
                draggable: props.draggable,
                orderBy: props.orderBy,
                orderDir: props.orderDir,
                multiple: props.multiple,
                primaryField: props.primaryField,
                footable: props.footable,
                itemCheckableOn: props.itemCheckableOn,
                itemDraggableOn: props.itemDraggableOn,
                hideCheckToggler: props.hideCheckToggler,
                combineNum: combineNum,
                combineFromIndex: props.combineFromIndex,
                expandConfig: props.expandConfig
            });
        }
        if (prevProps.columns !== props.columns) {
            store.update({
                columns: props.columns
            });
        }
        if (amisCore.anyChanged(['source', 'value', 'items'], prevProps, props) ||
            (!props.value &&
                !props.items &&
                (props.data !== prevProps.data ||
                    (typeof props.source === 'string' && amisCore.isPureVariable(props.source))))) {
            Table.syncRows(store, props, prevProps) && this.syncSelected();
        }
        else if (amisCore.isArrayChildrenModified(prevProps.selected, props.selected)) {
            var prevSelectedRows = store.selectedRows
                .map(function (item) { return item.id; })
                .join(',');
            store.updateSelected(props.selected || [], props.valueField);
            var selectedRows = store.selectedRows.map(function (item) { return item.id; }).join(',');
            prevSelectedRows !== selectedRows && this.syncSelected();
        }
        this.updateTableInfoLazy();
    };
    Table.prototype.componentWillUnmount = function () {
        var formItem = this.props.formItem;
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        window.removeEventListener('resize', this.affixDetect);
        window.removeEventListener('resize', this.updateAutoFillHeight);
        this.updateTableInfoLazy.cancel();
        this.unSensor && this.unSensor();
        formItem && mobxStateTree.isAlive(formItem) && formItem.setSubStore(null);
        clearTimeout(this.timer);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    Table.prototype.subFormRef = function (form, x, y) {
        var quickEditFormRef = this.props.quickEditFormRef;
        quickEditFormRef && quickEditFormRef(form, x, y);
        this.subForms["".concat(x, "-").concat(y)] = form;
        form && this.props.store.addForm(form.props.store, y);
    };
    Table.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        // todo
        onAction(e, action, ctx);
    };
    Table.prototype.handleCheck = function (item, value, shift) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, data, dispatchEvent, selectedItems, unSelectedItems, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        selectedItems = value
                            ? tslib.__spreadArray(tslib.__spreadArray([], store.selectedRows.map(function (row) { return row.data; }), true), [item.data], false) : store.selectedRows.filter(function (row) { return row.id !== item.id; });
                        unSelectedItems = value
                            ? store.unSelectedRows.filter(function (row) { return row.id !== item.id; })
                            : tslib.__spreadArray(tslib.__spreadArray([], store.unSelectedRows.map(function (row) { return row.data; }), true), [item.data], false);
                        return [4 /*yield*/, dispatchEvent('selectedChange', amisCore.createObject(data, {
                                selectedItems: selectedItems,
                                unSelectedItems: unSelectedItems
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        if (shift) {
                            store.toggleShift(item);
                        }
                        else {
                            item.toggle();
                        }
                        this.syncSelected();
                        return [2 /*return*/];
                }
            });
        });
    };
    Table.prototype.handleCheckAll = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, data, dispatchEvent, items, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        items = store.getSelectedRows().map(function (item) { return item.data; });
                        return [4 /*yield*/, dispatchEvent('selectedChange', amisCore.createObject(data, {
                                selectedItems: store.allChecked ? [] : items,
                                unSelectedItems: store.allChecked ? items : []
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        store.toggleAll();
                        this.syncSelected();
                        return [2 /*return*/];
                }
            });
        });
    };
    Table.prototype.handleQuickChange = function (item, values, saveImmediately, savePristine, options) {
        if (!mobxStateTree.isAlive(item)) {
            return;
        }
        var _a = this.props, onSave = _a.onSave, onPristineChange = _a.onPristineChange, propsSaveImmediately = _a.saveImmediately, primaryField = _a.primaryField;
        item.change(values, savePristine);
        // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
        item.modified && this.syncSelected();
        if (savePristine) {
            onPristineChange === null || onPristineChange === void 0 ? void 0 : onPristineChange(item.data, item.path);
            return;
        }
        else if (!saveImmediately && !propsSaveImmediately) {
            return;
        }
        if (saveImmediately && saveImmediately.api) {
            this.props.onAction(null, {
                actionType: 'ajax',
                api: saveImmediately.api,
                reload: options === null || options === void 0 ? void 0 : options.reload
            }, values);
            return;
        }
        if (!onSave) {
            return;
        }
        onSave(item.data, amisCore.difference(item.data, item.pristine, ['id', primaryField]), item.path, undefined, item.pristine, options);
    };
    Table.prototype.handleSave = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, onSave, primaryField, subForms, result, rows, rowIndexes, diff, unModifiedRows;
            var _this = this;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, onSave = _a.onSave, primaryField = _a.primaryField;
                        if (!onSave || !store.modifiedRows.length) {
                            return [2 /*return*/];
                        }
                        subForms = [];
                        Object.keys(this.subForms).forEach(function (key) { return _this.subForms[key] && subForms.push(_this.subForms[key]); });
                        if (!subForms.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(subForms.map(function (item) { return item.validate(); }))];
                    case 1:
                        result = _b.sent();
                        if (~result.indexOf(false)) {
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        rows = store.modifiedRows.map(function (item) { return item.data; });
                        rowIndexes = store.modifiedRows.map(function (item) { return item.path; });
                        diff = store.modifiedRows.map(function (item) {
                            return amisCore.difference(item.data, item.pristine, ['id', primaryField]);
                        });
                        unModifiedRows = store.rows
                            .filter(function (item) { return !item.modified; })
                            .map(function (item) { return item.data; });
                        onSave(rows, diff, rowIndexes, unModifiedRows, store.modifiedRows.map(function (item) { return item.pristine; }));
                        return [2 /*return*/];
                }
            });
        });
    };
    Table.prototype.handleSaveOrder = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, onSaveOrder, data, dispatchEvent, movedItems, items, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, onSaveOrder = _a.onSaveOrder, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        movedItems = store.movedRows.map(function (item) { return item.data; });
                        items = store.rows.map(function (item) { return item.getDataWithModifiedChilden(); });
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
    Table.prototype.syncSelected = function () {
        var _a = this.props, store = _a.store, onSelect = _a.onSelect;
        onSelect &&
            onSelect(store.selectedRows.map(function (item) { return item.data; }), store.unSelectedRows.map(function (item) { return item.data; }));
    };
    Table.prototype.reset = function () {
        var _this = this;
        var store = this.props.store;
        store.reset();
        var subForms = [];
        Object.keys(this.subForms).forEach(function (key) { return _this.subForms[key] && subForms.push(_this.subForms[key]); });
        subForms.forEach(function (item) { return item.clearErrors(); });
    };
    Table.prototype.bulkUpdate = function (value, items) {
        var _a = this.props, store = _a.store, primaryField = _a.primaryField;
        if (primaryField && value.ids) {
            var ids_1 = value.ids.split(',');
            var rows = store.rows.filter(function (item) {
                return find__default["default"](ids_1, function (id) { return id && id == item.data[primaryField]; });
            });
            var newValue_1 = tslib.__assign(tslib.__assign({}, value), { ids: undefined });
            rows.forEach(function (row) { return row.change(newValue_1); });
        }
        else {
            var rows = store.rows.filter(function (item) { return ~items.indexOf(item.pristine); });
            rows.forEach(function (row) { return row.change(value); });
        }
    };
    Table.prototype.getSelected = function () {
        var store = this.props.store;
        return store.selectedRows.map(function (item) { return item.data; });
    };
    Table.prototype.affixDetect = function () {
        var _a, _b, _c, _d;
        if (!this.props.affixHeader || !this.table || this.props.autoFillHeight) {
            return;
        }
        var ns = this.props.classPrefix;
        var dom = ReactDOM.findDOMNode(this);
        var clip = this.table.getBoundingClientRect();
        var offsetY = (_b = (_a = this.props.affixOffsetTop) !== null && _a !== void 0 ? _a : this.props.env.affixOffsetTop) !== null && _b !== void 0 ? _b : 0;
        var headingHeight = ((_c = dom.querySelector(".".concat(ns, "Table-heading"))) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().height) || 0;
        var headerHeight = ((_d = dom.querySelector(".".concat(ns, "Table-headToolbar"))) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect().height) || 0;
        var affixed = clip.top - headerHeight - headingHeight < offsetY &&
            clip.top + clip.height - 40 > offsetY;
        var affixedDom = dom.querySelector(".".concat(ns, "Table-fixedTop"));
        var affixedShadowDom = dom.querySelector(".".concat(ns, "Table-fixedTop-shadow"));
        var affixedDomHeight = getComputedStyle(affixedDom).getPropertyValue('height');
        affixedDom.style.cssText += "top: ".concat(offsetY, "px;width: ").concat(this.table.parentNode.offsetWidth, "px");
        affixedShadowDom.style.cssText += "top: ".concat(affixedDomHeight, ";width: ").concat(this.table.parentNode.offsetWidth, "px");
        affixed
            ? affixedDom.classList.add('in')
            : affixedDom.classList.remove('in');
        // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
    };
    Table.prototype.updateTableInfo = function () {
        if (!this.table) {
            return;
        }
        var table = this.table;
        var outter = table.parentNode;
        var affixHeader = this.props.affixHeader;
        var ns = this.props.classPrefix;
        // 完成宽高都没有变化就直接跳过了。
        // if (this.totalWidth === table.scrollWidth && this.totalHeight === table.scrollHeight) {
        //     return;
        // }
        this.totalWidth = table.scrollWidth;
        this.totalHeight = table.scrollHeight;
        this.outterWidth = outter.offsetWidth;
        this.outterHeight = outter.offsetHeight;
        var widths = (this.widths = {});
        var widths2 = (this.widths2 = {});
        var heights = (this.heights = {});
        heights.header = table
            .querySelector('thead>tr:last-child')
            .getBoundingClientRect().height;
        heights.header2 = table
            .querySelector('thead>tr:first-child')
            .getBoundingClientRect().height;
        forEach__default["default"](table.querySelectorAll('thead>tr:last-child>th'), function (item) {
            widths[item.getAttribute('data-index')] =
                item.getBoundingClientRect().width;
        });
        forEach__default["default"](table.querySelectorAll('thead>tr:first-child>th'), function (item) {
            widths2[item.getAttribute('data-index')] =
                item.getBoundingClientRect().width;
        });
        forEach__default["default"](table.querySelectorAll('tbody>tr>*:last-child'), 
        /**
         * ! 弹窗中的特殊说明
         * ! 在弹窗中，modal 有一个 scale 的动画，导致 getBoundingClientRect 获取的高度不准确
         * ! width 准确是因为 table-layout: auto 导致
         */
        function (item, index) {
            return (heights[index] = getComputedStyle(item).height);
        });
        // 让 react 去更新非常慢，还是手动更新吧。
        var dom = ReactDOM.findDOMNode(this);
        forEach__default["default"](
        // 折叠 footTable 不需要改变
        dom.querySelectorAll(".".concat(ns, "Table-fixedTop table, .").concat(ns, "Table-fixedLeft>table, .").concat(ns, "Table-fixedRight>table")), function (table) {
            var totalWidth = 0;
            var totalWidth2 = 0;
            forEach__default["default"](table.querySelectorAll('thead>tr:last-child>th'), function (item) {
                var width = widths[item.getAttribute('data-index')];
                item.style.cssText += "width: ".concat(width, "px; height: ").concat(heights.header, "px");
                totalWidth += width;
            });
            forEach__default["default"](table.querySelectorAll('thead>tr:first-child>th'), function (item) {
                var rowSpan = Number(item.getAttribute('rowspan'));
                var colSpan = Number(item.getAttribute('colspan'));
                var thWidth = widths2[item.getAttribute('data-index')];
                var thHeight = Number(heights.header2);
                /* 考虑表头分组的情况，需要将固定列中对应的表头的高度按照rowSpan扩大指定倍数 */
                if (!isNaN(thHeight) && !isNaN(rowSpan)) {
                    thHeight *= rowSpan;
                }
                /* 考虑表头分组的情况，需要将分组表头按照colSpan缩小至指定倍数 */
                if (!isNaN(thWidth) && !isNaN(colSpan) && colSpan !== 0) {
                    thWidth /= colSpan;
                }
                item.style.cssText += "width: ".concat(thWidth, "px; height: ").concat(thHeight, "px");
                totalWidth2 += thWidth;
            });
            forEach__default["default"](table.querySelectorAll('colgroup>col'), function (item) {
                var width = widths[item.getAttribute('data-index')];
                item.setAttribute('width', "".concat(width));
            });
            forEach__default["default"](table.querySelectorAll('tbody>tr'), function (item, index) {
                item.style.cssText += "height: ".concat(heights[index]);
            });
            table.style.cssText += "width: ".concat(Math.max(totalWidth, totalWidth2), "px;table-layout: auto;");
        });
        if (affixHeader) {
            dom.querySelector(".".concat(ns, "Table-fixedTop>.").concat(ns, "Table-wrapper")).style.cssText += "width: ".concat(this.outterWidth, "px");
        }
        this.lastScrollLeft = -1;
        this.handleOutterScroll();
    };
    Table.prototype.handleOutterScroll = function () {
        var outter = this.table.parentNode;
        var scrollLeft = outter.scrollLeft;
        var ns = this.props.classPrefix;
        var dom = ReactDOM.findDOMNode(this);
        var fixedLeft = dom.querySelectorAll(".".concat(ns, "Table-fixedLeft"));
        var fixedRight = dom.querySelectorAll(".".concat(ns, "Table-fixedRight"));
        if (scrollLeft !== this.lastScrollLeft) {
            this.lastScrollLeft = scrollLeft;
            var leading = scrollLeft === 0;
            var trailing = Math.ceil(scrollLeft) + this.outterWidth >= this.totalWidth;
            // console.log(scrollLeft, store.outterWidth, store.totalWidth, (scrollLeft + store.outterWidth) === store.totalWidth);
            // store.setLeading(leading);
            // store.setTrailing(trailing);
            if (fixedLeft && fixedLeft.length) {
                for (var i = 0, len = fixedLeft.length; i < len; i++) {
                    var node = fixedLeft[i];
                    leading ? node.classList.remove('in') : node.classList.add('in');
                }
            }
            if (fixedRight && fixedRight.length) {
                for (var i = 0, len = fixedRight.length; i < len; i++) {
                    var node = fixedRight[i];
                    trailing ? node.classList.remove('in') : node.classList.add('in');
                }
            }
            var table = this.affixedTable;
            if (table) {
                table.style.cssText += "transform: translateX(-".concat(scrollLeft, "px)");
            }
        }
        /* 同步固定列内容的垂直滚动 */
        if (outter.scrollTop !== this.lastScrollTop) {
            this.lastScrollTop = outter.scrollTop;
            if (fixedLeft && fixedLeft.length) {
                forEach__default["default"](fixedLeft, function (node) { return node.scrollTo({ top: outter.scrollTop }); });
            }
            if (fixedRight && fixedRight.length) {
                forEach__default["default"](fixedRight, function (node) { return node.scrollTo({ top: outter.scrollTop }); });
            }
        }
    };
    Table.prototype.handleFixedColumnsScroll = function (event) {
        /** table内容区当前Top */
        var currentScrollTop = this.lastScrollTop;
        /** 固定列的新Top */
        var fixedScrollTop = event.currentTarget.scrollTop;
        if (currentScrollTop !== fixedScrollTop) {
            this.lastScrollTop = fixedScrollTop;
            var tableContentDom = this.table
                .parentNode;
            tableContentDom.scrollTo({ top: fixedScrollTop });
        }
    };
    Table.prototype.tableRef = function (ref) {
        this.table = ref;
        if (ref) {
            this.unSensor = amisCore.resizeSensor(ref.parentNode, this.updateTableInfoLazy);
        }
        else {
            this.unSensor && this.unSensor();
            delete this.unSensor;
        }
    };
    Table.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    Table.prototype.affixedTableRef = function (ref) {
        this.affixedTable = ref;
    };
    Table.prototype.initDragging = function () {
        var _this = this;
        var _a = this.props, store = _a.store, ns = _a.classPrefix;
        this.sortable = new Sortable__default["default"](this.table.querySelector('tbody'), {
            group: 'table',
            animation: 150,
            handle: ".".concat(ns, "Table-dragCell"),
            filter: ".".concat(ns, "Table-dragCell.is-dragDisabled"),
            ghostClass: 'is-dragging',
            onEnd: function (e) { return tslib.__awaiter(_this, void 0, void 0, function () {
                var parent;
                return tslib.__generator(this, function (_a) {
                    // 没有移动
                    if (e.newIndex === e.oldIndex) {
                        return [2 /*return*/];
                    }
                    parent = e.to;
                    if (e.oldIndex < parent.childNodes.length - 1) {
                        parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                    }
                    else {
                        parent.appendChild(e.item);
                    }
                    store.exchange(e.oldIndex, e.newIndex);
                    return [2 /*return*/];
                });
            }); }
        });
    };
    Table.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    Table.prototype.getPopOverContainer = function () {
        return ReactDOM.findDOMNode(this);
    };
    Table.prototype.handleMouseMove = function (e) {
        var tr = e.target.closest('tr[data-id]');
        if (!tr) {
            return;
        }
        var _a = this.props, store = _a.store, affixColumns = _a.affixColumns, itemActions = _a.itemActions;
        if ((affixColumns === false ||
            (store.leftFixedColumns.length === 0 &&
                store.rightFixedColumns.length === 0)) &&
            (!itemActions || !itemActions.filter(function (item) { return !item.hiddenOnHover; }).length)) {
            return;
        }
        var id = tr.getAttribute('data-id');
        var row = store.hoverRow;
        if ((row === null || row === void 0 ? void 0 : row.id) === id) {
            return;
        }
        amisCore.eachTree(store.rows, function (item) { return item.setIsHover(item.id === id); });
    };
    Table.prototype.handleMouseLeave = function () {
        var store = this.props.store;
        var row = store.hoverRow;
        row === null || row === void 0 ? void 0 : row.setIsHover(false);
    };
    Table.prototype.handleDragStart = function (e) {
        var store = this.props.store;
        var target = e.currentTarget;
        var tr = (this.draggingTr = target.closest('tr'));
        var id = tr.getAttribute('data-id');
        var tbody = tr.parentNode;
        this.originIndex = Array.prototype.indexOf.call(tbody.childNodes, tr);
        tr.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.setDragImage(tr, 0, 0);
        var item = store.getRowById(id);
        store.collapseAllAtDepth(item.depth);
        var siblings = store.rows;
        if (item.parentId) {
            var parent_1 = store.getRowById(item.parentId);
            siblings = parent_1.children;
        }
        siblings = siblings.filter(function (sibling) { return sibling !== item; });
        tbody.addEventListener('dragover', this.handleDragOver);
        tbody.addEventListener('drop', this.handleDrop);
        this.draggingSibling = siblings.map(function (item) {
            var tr = tbody.querySelector("tr[data-id=\"".concat(item.id, "\"]"));
            tr.classList.add('is-drop-allowed');
            return tr;
        });
        tr.addEventListener('dragend', this.handleDragEnd);
    };
    Table.prototype.handleDragOver = function (e) {
        if (!e.target) {
            return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        var overTr = e.target.closest('tr');
        if (!overTr ||
            !~overTr.className.indexOf('is-drop-allowed') ||
            overTr === this.draggingTr) {
            return;
        }
        var tbody = overTr.parentElement;
        var dRect = this.draggingTr.getBoundingClientRect();
        var tRect = overTr.getBoundingClientRect();
        var ratio = dRect.top < tRect.top ? 0.1 : 0.9;
        var next = (e.clientY - tRect.top) / (tRect.bottom - tRect.top) > ratio;
        tbody.insertBefore(this.draggingTr, (next && overTr.nextSibling) || overTr);
    };
    Table.prototype.handleDrop = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var store, tr, tbody, index, item;
            return tslib.__generator(this, function (_a) {
                store = this.props.store;
                tr = this.draggingTr;
                tbody = tr.parentElement;
                index = Array.prototype.indexOf.call(tbody.childNodes, tr);
                item = store.getRowById(tr.getAttribute('data-id'));
                // destroy
                this.handleDragEnd();
                store.exchange(this.originIndex, index, item);
                return [2 /*return*/];
            });
        });
    };
    Table.prototype.handleDragEnd = function () {
        var tr = this.draggingTr;
        var tbody = tr.parentElement;
        var index = Array.prototype.indexOf.call(tbody.childNodes, tr);
        tbody.insertBefore(tr, tbody.childNodes[index < this.originIndex ? this.originIndex + 1 : this.originIndex]);
        tr.classList.remove('is-dragging');
        tr.removeEventListener('dragend', this.handleDragEnd);
        tbody.removeEventListener('dragover', this.handleDragOver);
        tbody.removeEventListener('drop', this.handleDrop);
        this.draggingSibling.forEach(function (item) {
            return item.classList.remove('is-drop-allowed');
        });
    };
    Table.prototype.handleImageEnlarge = function (info, target) {
        var onImageEnlarge = this.props.onImageEnlarge;
        // 如果已经是多张了，直接跳过
        if (Array.isArray(info.list)) {
            return onImageEnlarge && onImageEnlarge(info, target);
        }
        // 从列表中收集所有图片，然后作为一个图片集合派送出去。
        var store = this.props.store;
        var column = store.columns[target.colIndex].pristine;
        var index = target.rowIndex;
        var list = [];
        store.rows.forEach(function (row, i) {
            var src = amisCore.resolveVariable(column.name, row.data);
            if (!src) {
                if (i < target.rowIndex) {
                    index--;
                }
                return;
            }
            list.push({
                src: src,
                originalSrc: column.originalSrc
                    ? amisCore.filter(column.originalSrc, row.data)
                    : src,
                title: column.enlargeTitle
                    ? amisCore.filter(column.enlargeTitle, row.data)
                    : column.title
                        ? amisCore.filter(column.title, row.data)
                        : undefined,
                caption: column.enlargeCaption
                    ? amisCore.filter(column.enlargeCaption, row.data)
                    : column.caption
                        ? amisCore.filter(column.caption, row.data)
                        : undefined
            });
        });
        if (list.length > 1) {
            onImageEnlarge &&
                onImageEnlarge(tslib.__assign(tslib.__assign({}, info), { list: list, index: index }), target);
        }
        else {
            onImageEnlarge && onImageEnlarge(info, target);
        }
    };
    // 开始列宽度调整
    Table.prototype.handleColResizeMouseDown = function (e) {
        this.lineStartX = e.clientX;
        var currentTarget = e.currentTarget;
        this.resizeLine = currentTarget;
        this.resizeLineLeft = parseInt(getComputedStyle(this.resizeLine).getPropertyValue('left'), 10);
        this.targetTh = this.resizeLine.parentElement;
        this.targetThWidth = this.targetTh.getBoundingClientRect().width;
        document.addEventListener('mousemove', this.handleColResizeMouseMove);
        document.addEventListener('mouseup', this.handleColResizeMouseUp);
    };
    // 垂直线拖拽移动
    Table.prototype.handleColResizeMouseMove = function (e) {
        var moveX = e.clientX - this.lineStartX;
        // 光标right为-4px，列宽改变时会自动跟随，不需要单独处理位置
        // this.resizeLine.style.left = this.resizeLineLeft + moveX + 'px';
        this.targetTh.style.width = this.targetThWidth + moveX + 'px';
    };
    // 垂直线拖拽结束
    Table.prototype.handleColResizeMouseUp = function (e) {
        document.removeEventListener('mousemove', this.handleColResizeMouseMove);
        document.removeEventListener('mouseup', this.handleColResizeMouseUp);
    };
    Table.prototype.handleColumnToggle = function (columns) {
        var store = this.props.store;
        store.updateColumns(columns);
    };
    Table.prototype.renderAutoFilterForm = function () {
        var _a = this.props, render = _a.render, store = _a.store, onSearchableFromReset = _a.onSearchableFromReset, onSearchableFromSubmit = _a.onSearchableFromSubmit, onSearchableFromInit = _a.onSearchableFromInit, cx = _a.classnames, __ = _a.translate;
        var searchableColumns = store.searchableColumns;
        var activedSearchableColumns = store.activedSearchableColumns;
        if (!searchableColumns.length) {
            return null;
        }
        var body = [];
        amisCore.padArr(activedSearchableColumns, 3, true).forEach(function (group) {
            var children = [];
            group.forEach(function (column) {
                var _a, _b, _c, _d;
                children.push(column
                    ? tslib.__assign(tslib.__assign({}, (column.searchable === true
                        ? {
                            type: 'input-text',
                            name: column.name,
                            label: column.label
                        }
                        : tslib.__assign({ type: 'input-text', name: column.name }, column.searchable))), { name: (_b = (_a = column.searchable) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : column.name, label: (_d = (_c = column.searchable) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : column.label }) : {
                    type: 'tpl',
                    tpl: ''
                });
            });
            body.push({
                type: 'group',
                body: children
            });
        });
        var showExpander = body.length > 1;
        // todo 以后做动画
        if (!store.searchFormExpanded) {
            body.splice(1, body.length - 1);
        }
        return render('searchable-form', {
            type: 'form',
            api: null,
            title: '',
            mode: 'horizontal',
            submitText: __('search'),
            body: body,
            actions: [
                {
                    type: 'dropdown-button',
                    label: __('Table.searchFields'),
                    className: cx('Table-searchableForm-dropdown', 'mr-2'),
                    level: 'link',
                    trigger: 'click',
                    size: 'sm',
                    align: 'right',
                    buttons: searchableColumns.map(function (column) {
                        var _a, _b, _c, _d;
                        return {
                            type: 'checkbox',
                            className: cx('Table-searchableForm-checkbox'),
                            inputClassName: cx('Table-searchableForm-checkbox-inner'),
                            name: "__search_".concat((_b = (_a = column.searchable) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : column.name),
                            option: (_d = (_c = column.searchable) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : column.label,
                            value: column.enableSearch,
                            badge: {
                                offset: [-10, 5],
                                visibleOn: "".concat(column.toggable && !column.toggled && column.enableSearch)
                            },
                            onChange: function (value) {
                                column.setEnableSearch(value);
                                store.setSearchFormExpanded(true);
                            }
                        };
                    })
                },
                {
                    type: 'submit',
                    label: __('search'),
                    level: 'primary',
                    className: 'w-18'
                },
                {
                    type: 'reset',
                    label: __('reset'),
                    className: 'w-18'
                },
                showExpander
                    ? {
                        children: function () { return (React__default["default"].createElement("a", { className: cx('Table-SFToggler', store.searchFormExpanded ? 'is-expanded' : ''), onClick: store.toggleSearchFormExpanded },
                            __(store.searchFormExpanded ? 'collapse' : 'expand'),
                            React__default["default"].createElement("span", { className: cx('Table-SFToggler-arrow') },
                                React__default["default"].createElement(amisUi.Icon, { icon: "right-arrow-bold", className: "icon" })))); }
                    }
                    : null
            ].filter(function (item) { return item; })
        }, {
            key: 'searchable-form',
            panelClassName: cx('Table-searchableForm'),
            actionsClassName: cx('Table-searchableForm-footer'),
            onReset: onSearchableFromReset,
            onSubmit: onSearchableFromSubmit,
            onInit: onSearchableFromInit,
            formStore: undefined
        });
    };
    Table.prototype.renderHeading = function () {
        var _a = this.props, title = _a.title, store = _a.store, hideQuickSaveBtn = _a.hideQuickSaveBtn, data = _a.data, cx = _a.classnames, saveImmediately = _a.saveImmediately, headingClassName = _a.headingClassName, quickSaveApi = _a.quickSaveApi, __ = _a.translate;
        if (title ||
            (quickSaveApi &&
                !saveImmediately &&
                store.modified &&
                !hideQuickSaveBtn) ||
            store.moved) {
            return (React__default["default"].createElement("div", { className: cx('Table-heading', headingClassName), key: "heading" }, !saveImmediately && store.modified && !hideQuickSaveBtn ? (React__default["default"].createElement("span", null,
                __('Table.modified', {
                    modified: store.modified
                }),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSave },
                    React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon m-r-xs" }),
                    __('Form.submit')),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon m-r-xs" }),
                    __('Table.discard')))) : store.moved ? (React__default["default"].createElement("span", null,
                __('Table.moved', {
                    moved: store.moved
                }),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSaveOrder },
                    React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon m-r-xs" }),
                    __('Form.submit')),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon m-r-xs" }),
                    __('Table.discard')))) : title ? (amisCore.filter(title, data)) : ('')));
        }
        return null;
    };
    Table.prototype.renderHeadCell = function (column, props) {
        var _this = this;
        var _a = this.props, store = _a.store, query = _a.query, onQuery = _a.onQuery, multiple = _a.multiple, env = _a.env, render = _a.render, ns = _a.classPrefix, resizable = _a.resizable, cx = _a.classnames, autoGenerateFilter = _a.autoGenerateFilter, dispatchEvent = _a.dispatchEvent, data = _a.data;
        if (column.type === '__checkme') {
            return (React__default["default"].createElement("th", tslib.__assign({}, props, { className: cx(column.pristine.className) }), store.rows.length && multiple ? (React__default["default"].createElement(amisUi.Checkbox, { classPrefix: ns, partial: store.someChecked && !store.allChecked, checked: store.someChecked, disabled: store.disabledHeadCheckbox, onChange: this.handleCheckAll })) : ('\u00A0')));
        }
        else if (column.type === '__dragme') {
            return React__default["default"].createElement("th", tslib.__assign({}, props, { className: cx(column.pristine.className) }));
        }
        else if (column.type === '__expandme') {
            return (React__default["default"].createElement("th", tslib.__assign({}, props, { className: cx(column.pristine.className) }), (store.footable &&
                (store.footable.expandAll === false || store.footable.accordion)) ||
                (store.expandConfig &&
                    (store.expandConfig.expandAll === false ||
                        store.expandConfig.accordion)) ? null : (React__default["default"].createElement("a", { className: cx('Table-expandBtn', store.allExpanded ? 'is-active' : ''), 
                // data-tooltip="展开/收起全部"
                // data-position="top"
                onClick: store.toggleExpandAll },
                React__default["default"].createElement(amisUi.Icon, { icon: "right-arrow-bold", className: "icon" })))));
        }
        var affix = [];
        if (column.searchable && column.name && !autoGenerateFilter) {
            affix.push(React__default["default"].createElement(HeadCellSearchDropdown.HeadCellSearchDropDown, tslib.__assign({}, this.props, { onQuery: onQuery, name: column.name, searchable: column.searchable, sortable: false, type: column.type, data: query, orderBy: store.orderBy, orderDir: store.orderDir, popOverContainer: this.getPopOverContainer })));
        }
        if (column.sortable && column.name) {
            affix.push(React__default["default"].createElement("span", { className: cx('TableCell-sortBtn'), onClick: function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var orderBy, orderDir, order, rendererEvent;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                orderBy = '';
                                orderDir = '';
                                if (column.name === store.orderBy) {
                                    if (store.orderDir !== 'desc') {
                                        // 升序之后降序
                                        orderBy = column.name;
                                        orderDir = 'desc';
                                    }
                                }
                                else {
                                    orderBy = column.name;
                                }
                                order = orderDir ? 'desc' : 'asc';
                                return [4 /*yield*/, dispatchEvent('columnSort', amisCore.createObject(data, {
                                        orderBy: orderBy,
                                        orderDir: order
                                    }))];
                            case 1:
                                rendererEvent = _a.sent();
                                if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                                    return [2 /*return*/];
                                }
                                store.setOrderByInfo(orderBy, order);
                                onQuery &&
                                    onQuery({
                                        orderBy: store.orderBy,
                                        orderDir: store.orderDir
                                    });
                                return [2 /*return*/];
                        }
                    });
                }); } },
                React__default["default"].createElement("i", { className: cx('TableCell-sortBtn--down', store.orderBy === column.name && store.orderDir === 'desc'
                        ? 'is-active'
                        : '') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "sort-desc", className: "icon" })),
                React__default["default"].createElement("i", { className: cx('TableCell-sortBtn--up', store.orderBy === column.name && store.orderDir === 'asc'
                        ? 'is-active'
                        : '') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "sort-asc", className: "icon" })),
                React__default["default"].createElement("i", { className: cx('TableCell-sortBtn--default', store.orderBy === column.name ? '' : 'is-active') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "sort-default", className: "icon" }))));
        }
        if (!column.searchable && column.filterable && column.name) {
            affix.push(React__default["default"].createElement(HeadCellFilterDropdown.HeadCellFilterDropDown, tslib.__assign({}, this.props, { onQuery: onQuery, name: column.name, type: column.type, data: query, filterable: column.filterable, popOverContainer: this.getPopOverContainer })));
        }
        if (column.pristine.width) {
            props.style = props.style || {};
            props.style.width = column.pristine.width;
        }
        if (column.pristine.align) {
            props.style = props.style || {};
            props.style.textAlign = column.pristine.align;
        }
        var resizeLine = (React__default["default"].createElement("div", { className: cx('Table-content-colDragLine'), key: "resize-".concat(column.index), onMouseDown: this.handleColResizeMouseDown }));
        return (React__default["default"].createElement("th", tslib.__assign({}, props, { className: cx(props ? props.className : '', {
                'TableCell--sortable': column.sortable,
                'TableCell--searchable': column.searchable,
                'TableCell--filterable': column.filterable,
                'Table-operationCell': column.type === 'operation'
            }) }),
            React__default["default"].createElement("div", { className: cx("".concat(ns, "TableCell--title"), column.pristine.className, column.pristine.labelClassName), style: props.style },
                column.label ? render('tpl', column.label) : null,
                column.remark
                    ? render('remark', {
                        type: 'remark',
                        tooltip: column.remark,
                        container: env && env.getModalContainer
                            ? env.getModalContainer
                            : undefined
                    })
                    : null),
            affix,
            resizable === false ? null : resizeLine));
    };
    Table.prototype.renderCell = function (region, column, item, props, ignoreDrag) {
        if (ignoreDrag === void 0) { ignoreDrag = false; }
        var _a = this.props, render = _a.render, store = _a.store, multiple = _a.multiple, ns = _a.classPrefix, cx = _a.classnames, checkOnItemClick = _a.checkOnItemClick, popOverContainer = _a.popOverContainer, canAccessSuperData = _a.canAccessSuperData, itemBadge = _a.itemBadge;
        if (column.name && item.rowSpans[column.name] === 0) {
            return null;
        }
        if (column.type === '__checkme') {
            return (React__default["default"].createElement("td", { key: props.key, className: cx(column.pristine.className) },
                React__default["default"].createElement(amisUi.Checkbox, { classPrefix: ns, type: multiple ? 'checkbox' : 'radio', checked: item.checked, disabled: item.checkdisable || !item.checkable, onChange: checkOnItemClick ? amisCore.noop : this.handleCheck.bind(this, item) })));
        }
        else if (column.type === '__dragme') {
            return (React__default["default"].createElement("td", { key: props.key, className: cx(column.pristine.className, {
                    'is-dragDisabled': !item.draggable
                }) }, item.draggable ? React__default["default"].createElement(amisUi.Icon, { icon: "drag", className: "icon" }) : null));
        }
        else if (column.type === '__expandme') {
            return (React__default["default"].createElement("td", { key: props.key, className: cx(column.pristine.className) },
                item.depth > 2
                    ? Array.from({ length: item.depth - 2 }).map(function (_, index) { return (React__default["default"].createElement("i", { key: index, className: cx('Table-divider-' + (index + 1)) })); })
                    : null,
                item.expandable ? (React__default["default"].createElement("a", { className: cx('Table-expandBtn', item.expanded ? 'is-active' : ''), 
                    // data-tooltip="展开/收起"
                    // data-position="top"
                    onClick: item.toggleExpanded },
                    React__default["default"].createElement(amisUi.Icon, { icon: "right-arrow-bold", className: "icon" }))) : null));
        }
        var prefix = null;
        if (!ignoreDrag &&
            column.isPrimary &&
            store.isNested &&
            store.draggable &&
            item.draggable) {
            prefix = (React__default["default"].createElement("a", { draggable: true, onDragStart: this.handleDragStart, className: cx('Table-dragBtn') },
                React__default["default"].createElement(amisUi.Icon, { icon: "drag", className: "icon" })));
        }
        var subProps = tslib.__assign(tslib.__assign({}, props), { 
            // 操作列不下发loading，否则会导致操作栏里面的所有按钮都出现loading
            loading: column.type === 'operation' ? false : props.loading, btnDisabled: store.dragging, data: item.locals, value: column.name
                ? amisCore.resolveVariable(column.name, canAccessSuperData ? item.locals : item.data)
                : column.value, popOverContainer: popOverContainer || this.getPopOverContainer, rowSpan: item.rowSpans[column.name], quickEditFormRef: this.subFormRef, prefix: prefix, onImageEnlarge: this.handleImageEnlarge, canAccessSuperData: canAccessSuperData, row: item, itemBadge: itemBadge, showBadge: !props.isHead &&
                itemBadge &&
                store.firstToggledColumnIndex === props.colIndex });
        delete subProps.label;
        return render(region, tslib.__assign(tslib.__assign({}, column.pristine), { column: column.pristine, type: 'cell' }), subProps);
    };
    Table.prototype.renderAffixHeader = function (tableClassName) {
        var _this = this;
        var _a = this.props, store = _a.store, affixHeader = _a.affixHeader, render = _a.render, cx = _a.classnames;
        var hideHeader = store.filteredColumns.every(function (column) { return !column.label; });
        var columnsGroup = store.columnGroup;
        return affixHeader ? (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("div", { className: cx('Table-fixedTop', {
                    'is-fakeHide': hideHeader
                }) },
                this.renderHeader(false),
                this.renderHeading(),
                React__default["default"].createElement("div", { className: cx('Table-fixedLeft') }, store.leftFixedColumns.length
                    ? this.renderFixedColumns(store.rows, store.leftFixedColumns, true, tableClassName)
                    : null),
                React__default["default"].createElement("div", { className: cx('Table-fixedRight') }, store.rightFixedColumns.length
                    ? this.renderFixedColumns(store.rows, store.rightFixedColumns, true, tableClassName)
                    : null),
                React__default["default"].createElement("div", { className: cx('Table-wrapper') },
                    React__default["default"].createElement("table", { ref: this.affixedTableRef, className: tableClassName },
                        React__default["default"].createElement("colgroup", null, store.filteredColumns.map(function (column) { return (React__default["default"].createElement("col", { key: column.index, "data-index": column.index })); })),
                        React__default["default"].createElement("thead", null,
                            columnsGroup.length ? (React__default["default"].createElement("tr", null, columnsGroup.map(function (item, index) { return (React__default["default"].createElement("th", { key: index, "data-index": item.index, colSpan: item.colSpan, rowSpan: item.rowSpan }, item.label ? render('tpl', item.label) : null)); }))) : null,
                            React__default["default"].createElement("tr", null, store.filteredColumns.map(function (column) {
                                var _a;
                                return ((_a = columnsGroup.find(function (group) { return ~group.has.indexOf(column); })) === null || _a === void 0 ? void 0 : _a.rowSpan) === 2
                                    ? null
                                    : _this.renderHeadCell(column, {
                                        'key': column.index,
                                        'data-index': column.index
                                    });
                            })))))),
            React__default["default"].createElement("div", { className: cx('Table-fixedTop-shadow') }))) : null;
    };
    Table.prototype.renderFixedColumns = function (rows, columns, headerOnly, tableClassName) {
        var _this = this;
        if (headerOnly === void 0) { headerOnly = false; }
        if (tableClassName === void 0) { tableClassName = ''; }
        var _a = this.props, placeholder = _a.placeholder, store = _a.store, cx = _a.classnames, render = _a.render, data = _a.data, translate = _a.translate, locale = _a.locale, checkOnItemClick = _a.checkOnItemClick, buildItemProps = _a.buildItemProps, rowClassNameExpr = _a.rowClassNameExpr, rowClassName = _a.rowClassName, itemAction = _a.itemAction, dispatchEvent = _a.dispatchEvent, onEvent = _a.onEvent;
        var hideHeader = store.filteredColumns.every(function (column) { return !column.label; });
        var columnsGroup = store.columnGroup;
        return (React__default["default"].createElement("table", { className: cx('Table-table', tableClassName, {
                'Table-table--withCombine': store.combineNum > 0
            }) },
            React__default["default"].createElement("thead", null,
                columnsGroup.length ? (React__default["default"].createElement("tr", null, columnsGroup.map(function (item, index) {
                    var renderColumns = columns.filter(function (a) { return ~item.has.indexOf(a); });
                    return renderColumns.length ? (React__default["default"].createElement("th", { key: index, "data-index": item.index, colSpan: renderColumns.length, rowSpan: item.rowSpan }, item.label)) : null;
                }))) : null,
                React__default["default"].createElement("tr", { className: hideHeader ? 'fake-hide' : '' }, columns.map(function (column) {
                    var _a;
                    return ((_a = columnsGroup.find(function (group) { return ~group.has.indexOf(column); })) === null || _a === void 0 ? void 0 : _a.rowSpan) === 2
                        ? null
                        : _this.renderHeadCell(column, {
                            'key': column.index,
                            'data-index': column.index
                        });
                }))),
            headerOnly ? null : !rows.length ? (React__default["default"].createElement("tbody", null,
                React__default["default"].createElement("tr", { className: cx('Table-placeholder') },
                    React__default["default"].createElement("td", { colSpan: columns.length }, render('placeholder', translate(placeholder || 'placeholder.noData')))))) : (React__default["default"].createElement(TableBody.TableBody, { tableClassName: cx(tableClassName, {
                    'Table-table--withCombine': store.combineNum > 0
                }), itemAction: itemAction, classnames: cx, render: render, renderCell: this.renderCell, onCheck: this.handleCheck, onQuickChange: store.dragging ? undefined : this.handleQuickChange, footable: store.footable, ignoreFootableContent: true, footableColumns: store.footableColumns, checkOnItemClick: checkOnItemClick, buildItemProps: buildItemProps, onAction: this.handleAction, rowClassNameExpr: rowClassNameExpr, rowClassName: rowClassName, columns: columns, rows: rows, locale: locale, translate: translate, rowsProps: {
                    regionPrefix: 'fixed/',
                    renderCell: function (region, column, item, props) { return _this.renderCell(region, column, item, props, true); },
                    data: data,
                    dispatchEvent: dispatchEvent,
                    onEvent: onEvent
                } }))));
    };
    Table.prototype.renderToolbar = function (toolbar) {
        var type = toolbar.type || toolbar;
        if (type === 'columns-toggler') {
            this.renderedToolbars.push(type);
            return this.renderColumnsToggler(toolbar);
        }
        else if (type === 'drag-toggler') {
            this.renderedToolbars.push(type);
            return this.renderDragToggler();
        }
        else if (type === 'export-excel') {
            this.renderedToolbars.push(type);
            return this.renderExportExcel(toolbar);
        }
        return void 0;
    };
    Table.prototype.renderColumnsToggler = function (config) {
        var _this = this;
        var _a;
        var _b = this.props; _b.className; var store = _b.store, ns = _b.classPrefix, cx = _b.classnames, rest = tslib.__rest(_b, ["className", "store", "classPrefix", "classnames"]);
        var __ = rest.translate;
        var env = rest.env;
        var render = this.props.render;
        if (!store.columnsTogglable) {
            return null;
        }
        return (React__default["default"].createElement(ColumnToggler["default"], tslib.__assign({}, rest, (amisCore.isObject(config) ? config : {}), { tooltip: (config === null || config === void 0 ? void 0 : config.tooltip) || __('Table.columnsVisibility'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, align: (_a = config === null || config === void 0 ? void 0 : config.align) !== null && _a !== void 0 ? _a : 'left', isActived: store.hasColumnHidden(), classnames: cx, classPrefix: ns, key: "columns-toggable", size: (config === null || config === void 0 ? void 0 : config.size) || 'sm', icon: config === null || config === void 0 ? void 0 : config.icon, label: config === null || config === void 0 ? void 0 : config.label, draggable: config === null || config === void 0 ? void 0 : config.draggable, columns: store.columnsData, activeToggaleColumns: store.activeToggaleColumns, onColumnToggle: this.handleColumnToggle }),
            store.toggableColumns.length ? (React__default["default"].createElement("li", { className: cx('ColumnToggler-menuItem'), key: 'selectAll', onClick: function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var _a, data, dispatchEvent, allToggled, rendererEvent;
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent;
                                allToggled = !(store.activeToggaleColumns.length ===
                                    store.toggableColumns.length);
                                return [4 /*yield*/, dispatchEvent('columnToggled', amisCore.createObject(data, {
                                        columns: allToggled
                                            ? store.toggableColumns.map(function (column) { return column.pristine; })
                                            : []
                                    }))];
                            case 1:
                                rendererEvent = _b.sent();
                                if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                                    return [2 /*return*/];
                                }
                                store.toggleAllColumns();
                                return [2 /*return*/];
                        }
                    });
                }); } },
                React__default["default"].createElement(amisUi.Checkbox, { size: "sm", classPrefix: ns, key: "checkall", checked: !!store.activeToggaleColumns.length, partial: !!(store.activeToggaleColumns.length &&
                        store.activeToggaleColumns.length !==
                            store.toggableColumns.length) }, __('Checkboxes.selectAll')))) : null,
            store.toggableColumns.map(function (column) { return (React__default["default"].createElement("li", { className: cx('ColumnToggler-menuItem'), key: column.index, onClick: function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var _a, data, dispatchEvent, columns, rendererEvent;
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent;
                                columns = store.activeToggaleColumns.map(function (item) { return item.pristine; });
                                if (!column.toggled) {
                                    columns.push(column.pristine);
                                }
                                else {
                                    columns = columns.filter(function (c) { return c.name !== column.pristine.name; });
                                }
                                return [4 /*yield*/, dispatchEvent('columnToggled', amisCore.createObject(data, {
                                        columns: columns
                                    }))];
                            case 1:
                                rendererEvent = _b.sent();
                                if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                                    return [2 /*return*/];
                                }
                                column.toggleToggle();
                                return [2 /*return*/];
                        }
                    });
                }); } },
                React__default["default"].createElement(amisUi.Checkbox, { size: "sm", classPrefix: ns, checked: column.toggled }, column.label ? render('tpl', column.label) : null))); })));
    };
    Table.prototype.renderDragToggler = function () {
        var _a = this.props, store = _a.store, env = _a.env, draggable = _a.draggable, ns = _a.classPrefix, __ = _a.translate;
        if (!draggable || store.isNested) {
            return null;
        }
        return (React__default["default"].createElement(amisUi.Button, { disabled: !!store.modified, classPrefix: ns, key: "dragging-toggle", tooltip: __('Table.startSort'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, size: "sm", active: store.dragging, onClick: function (e) {
                e.preventDefault();
                store.toggleDragging();
                store.dragging && store.clear();
            }, iconOnly: true },
            React__default["default"].createElement(amisUi.Icon, { icon: "exchange", className: "icon" })));
    };
    Table.prototype.renderExportExcel = function (toolbar) {
        var _this = this;
        var _a = this.props, store = _a.store; _a.env; _a.classPrefix; _a.classnames; var __ = _a.translate; _a.data; var render = _a.render;
        var columns = store.filteredColumns || [];
        if (!columns) {
            return null;
        }
        return render('exportExcel', tslib.__assign(tslib.__assign({ label: __('CRUD.exportExcel') }, toolbar), { type: 'button' }), {
            onAction: function () {
                Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['exceljs'], function(mod) {fullfill(tslib.__importStar(mod))})})}).then(function (ExcelJS) { return tslib.__awaiter(_this, void 0, void 0, function () {
                    return tslib.__generator(this, function (_a) {
                        exportExcel.exportExcel(ExcelJS, this.props, toolbar);
                        return [2 /*return*/];
                    });
                }); });
            }
        });
    };
    Table.prototype.renderActions = function (region) {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, store = _a.store, cx = _a.classnames, data = _a.data;
        actions = Array.isArray(actions) ? actions.concat() : [];
        if (store.toggable &&
            region === 'header' &&
            !~this.renderedToolbars.indexOf('columns-toggler')) {
            actions.push({
                type: 'button',
                children: this.renderColumnsToggler()
            });
        }
        if (store.draggable &&
            !store.isNested &&
            region === 'header' &&
            store.rows.length > 1 &&
            !~this.renderedToolbars.indexOf('drag-toggler')) {
            actions.push({
                type: 'button',
                children: this.renderDragToggler()
            });
        }
        return Array.isArray(actions) && actions.length ? (React__default["default"].createElement("div", { className: cx('Table-actions') }, actions.map(function (action, key) {
            return render("action/".concat(key), tslib.__assign({ type: 'button' }, action), {
                onAction: _this.handleAction,
                key: key,
                btnDisabled: store.dragging,
                data: store.getData(data)
            });
        }))) : null;
    };
    Table.prototype.renderHeader = function (editable) {
        var _a = this.props, header = _a.header, headerClassName = _a.headerClassName, toolbarClassName = _a.toolbarClassName, headerToolbarClassName = _a.headerToolbarClassName, headerToolbarRender = _a.headerToolbarRender, render = _a.render, showHeader = _a.showHeader, store = _a.store, cx = _a.classnames, data = _a.data, __ = _a.translate;
        if (showHeader === false) {
            return null;
        }
        var otherProps = {};
        // editable === false && (otherProps.$$editable = false);
        var child = headerToolbarRender
            ? headerToolbarRender(tslib.__assign(tslib.__assign(tslib.__assign({}, this.props), { selectedItems: store.selectedRows.map(function (item) { return item.data; }), items: store.rows.map(function (item) { return item.data; }), unSelectedItems: store.unSelectedRows.map(function (item) { return item.data; }) }), otherProps), this.renderToolbar)
            : null;
        var actions = this.renderActions('header');
        var toolbarNode = actions || child || store.dragging ? (React__default["default"].createElement("div", { className: cx('Table-toolbar Table-headToolbar', toolbarClassName, headerToolbarClassName), key: "header-toolbar" },
            actions,
            child,
            store.dragging ? (React__default["default"].createElement("div", { className: cx('Table-dragTip'), ref: this.dragTipRef }, __('Table.dragTip'))) : null)) : null;
        var headerNode = header && (!Array.isArray(header) || header.length) ? (React__default["default"].createElement("div", { className: cx('Table-header', headerClassName), key: "header" }, render('header', header, tslib.__assign(tslib.__assign({}, (editable === false ? otherProps : null)), { data: store.getData(data) })))) : null;
        return headerNode && toolbarNode
            ? [headerNode, toolbarNode]
            : headerNode || toolbarNode || null;
    };
    Table.prototype.renderFooter = function () {
        var _a = this.props, footer = _a.footer, toolbarClassName = _a.toolbarClassName, footerToolbarClassName = _a.footerToolbarClassName, footerClassName = _a.footerClassName, footerToolbarRender = _a.footerToolbarRender, render = _a.render, showFooter = _a.showFooter, store = _a.store, data = _a.data, cx = _a.classnames;
        if (showFooter === false) {
            return null;
        }
        var child = footerToolbarRender
            ? footerToolbarRender(tslib.__assign(tslib.__assign({}, this.props), { selectedItems: store.selectedRows.map(function (item) { return item.data; }), items: store.rows.map(function (item) { return item.data; }) }), this.renderToolbar)
            : null;
        var actions = this.renderActions('footer');
        var toolbarNode = actions || child ? (React__default["default"].createElement("div", { className: cx('Table-toolbar Table-footToolbar', toolbarClassName, footerToolbarClassName), key: "footer-toolbar" },
            actions,
            child)) : null;
        var footerNode = footer && (!Array.isArray(footer) || footer.length) ? (React__default["default"].createElement("div", { className: cx('Table-footer', footerClassName), key: "footer" }, render('footer', footer, {
            data: store.getData(data)
        }))) : null;
        return footerNode && toolbarNode
            ? [toolbarNode, footerNode]
            : footerNode || toolbarNode || null;
    };
    Table.prototype.renderTableContent = function () {
        var _a = this.props, cx = _a.classnames, tableClassName = _a.tableClassName, store = _a.store, placeholder = _a.placeholder, render = _a.render, checkOnItemClick = _a.checkOnItemClick, buildItemProps = _a.buildItemProps, rowClassNameExpr = _a.rowClassNameExpr, rowClassName = _a.rowClassName, prefixRow = _a.prefixRow, locale = _a.locale, affixRow = _a.affixRow, tableContentClassName = _a.tableContentClassName, translate = _a.translate, itemAction = _a.itemAction; _a.affixRowClassNameExpr; var affixRowClassName = _a.affixRowClassName; _a.prefixRowClassNameExpr; var prefixRowClassName = _a.prefixRowClassName; _a.autoFillHeight; var itemActions = _a.itemActions, dispatchEvent = _a.dispatchEvent, onEvent = _a.onEvent, _b = _a.loading, loading = _b === void 0 ? false : _b;
        // 理论上来说 store.rows 应该也行啊
        // 不过目前看来只有这样写它才会重新更新视图
        store.rows.length;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(TableContent.TableContent, { tableClassName: cx({
                    'Table-table--checkOnItemClick': checkOnItemClick,
                    'Table-table--withCombine': store.combineNum > 0
                }, tableClassName), className: tableContentClassName, itemActions: itemActions, itemAction: itemAction, store: store, classnames: cx, columns: store.filteredColumns, columnsGroup: store.columnGroup, rows: store.rows, placeholder: placeholder, render: render, onMouseMove: this.handleMouseMove, onScroll: this.handleOutterScroll, tableRef: this.tableRef, renderHeadCell: this.renderHeadCell, renderCell: this.renderCell, onCheck: this.handleCheck, onQuickChange: store.dragging ? undefined : this.handleQuickChange, footable: store.footable, footableColumns: store.footableColumns, checkOnItemClick: checkOnItemClick, buildItemProps: buildItemProps, onAction: this.handleAction, rowClassNameExpr: rowClassNameExpr, rowClassName: rowClassName, data: store.data, prefixRow: prefixRow, affixRow: affixRow, prefixRowClassName: prefixRowClassName, affixRowClassName: affixRowClassName, locale: locale, translate: translate, dispatchEvent: dispatchEvent, onEvent: onEvent, loading: loading }),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, show: loading })));
    };
    Table.prototype.doAction = function (action, args, throwErrors) {
        var _a = this.props, store = _a.store, valueField = _a.valueField, data = _a.data;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        switch (actionType) {
            case 'selectAll':
                store.clear();
                store.toggleAll();
                break;
            case 'clearAll':
                store.clear();
                break;
            case 'select':
                var dataSource = store.getData(data);
                var selected_1 = [];
                dataSource.items.forEach(function (item, rowIndex) {
                    var flag = amisCore.evalExpression(args === null || args === void 0 ? void 0 : args.selected, { record: item, rowIndex: rowIndex });
                    if (flag) {
                        selected_1.push(item);
                    }
                });
                store.updateSelected(selected_1, valueField);
                break;
            case 'initDrag':
                store.stopDragging();
                store.toggleDragging();
                break;
            default:
                this.handleAction(undefined, action, data);
                break;
        }
    };
    Table.prototype.render = function () {
        var _a = this.props, className = _a.className, store = _a.store, cx = _a.classnames, affixColumns = _a.affixColumns, autoFillHeight = _a.autoFillHeight, autoGenerateFilter = _a.autoGenerateFilter;
        this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
        var heading = this.renderHeading();
        var header = this.renderHeader();
        var footer = this.renderFooter();
        var tableClassName = cx('Table-table', this.props.tableClassName, {
            'Table-table--withCombine': store.combineNum > 0
        });
        return (React__default["default"].createElement("div", { className: cx('Table', className, {
                'Table--unsaved': !!store.modified || !!store.moved,
                'Table--autoFillHeight': autoFillHeight
            }) },
            autoGenerateFilter ? this.renderAutoFilterForm() : null,
            header,
            heading,
            React__default["default"].createElement("div", { className: cx('Table-contentWrap'), onMouseLeave: this.handleMouseLeave },
                React__default["default"].createElement("div", { className: cx('Table-fixedLeft', {
                        'Table-fixedLeft--autoFillHeight': autoFillHeight
                    }), onMouseMove: this.handleMouseMove, onScroll: this.handleFixedColumnsScroll }, affixColumns !== false && store.leftFixedColumns.length
                    ? this.renderFixedColumns(store.rows, store.leftFixedColumns, false, tableClassName)
                    : null),
                React__default["default"].createElement("div", { className: cx('Table-fixedRight', {
                        'Table-fixedLeft--autoFillHeight': autoFillHeight
                    }), onMouseMove: this.handleMouseMove, onScroll: this.handleFixedColumnsScroll }, affixColumns !== false && store.rightFixedColumns.length
                    ? this.renderFixedColumns(store.rows, store.rightFixedColumns, false, tableClassName)
                    : null),
                this.renderTableContent()),
            this.renderAffixHeader(tableClassName),
            footer));
    };
    Table.contextType = amisCore.ScopedContext;
    Table.propsList = [
        'header',
        'headerToolbarRender',
        'footer',
        'footerToolbarRender',
        'footable',
        'expandConfig',
        'placeholder',
        'tableClassName',
        'headingClassName',
        'source',
        'selectable',
        'columnsTogglable',
        'affixHeader',
        'affixColumns',
        'headerClassName',
        'footerClassName',
        'selected',
        'multiple',
        'primaryField',
        'hideQuickSaveBtn',
        'itemCheckableOn',
        'itemDraggableOn',
        'checkOnItemClick',
        'hideCheckToggler',
        'itemAction',
        'itemActions',
        'combineNum',
        'combineFromIndex',
        'items',
        'columns',
        'valueField',
        'saveImmediately',
        'rowClassName',
        'rowClassNameExpr',
        'affixRowClassNameExpr',
        'prefixRowClassNameExpr',
        'popOverContainer',
        'headerToolbarClassName',
        'toolbarClassName',
        'footerToolbarClassName',
        'itemBadge',
        'autoFillHeight',
        'onSelect',
        'keepItemSelectionOnPageChange',
        'maxKeepItemSelectionLength'
    ];
    Table.defaultProps = {
        className: '',
        placeholder: 'placeholder.noData',
        tableClassName: '',
        source: '$items',
        selectable: false,
        columnsTogglable: 'auto',
        affixHeader: true,
        headerClassName: '',
        footerClassName: '',
        toolbarClassName: '',
        headerToolbarClassName: '',
        footerToolbarClassName: '',
        primaryField: 'id',
        itemCheckableOn: '',
        itemDraggableOn: '',
        hideCheckToggler: false,
        canAccessSuperData: false,
        resizable: true
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleFixedColumnsScroll", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleDragStart", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleDragOver", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", Promise)
    ], Table.prototype, "handleDrop", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleDragEnd", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleImageEnlarge", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleColResizeMouseDown", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [MouseEvent]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleColResizeMouseMove", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [MouseEvent]),
        tslib.__metadata("design:returntype", void 0)
    ], Table.prototype, "handleColResizeMouseUp", null);
    return Table;
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
    TableRenderer.prototype.reload = function (subPath, query, ctx) {
        var _this = this;
        var _a, _b;
        var scoped = this.context;
        var parents = (_a = scoped === null || scoped === void 0 ? void 0 : scoped.parent) === null || _a === void 0 ? void 0 : _a.getComponents();
        if (Array.isArray(parents) && parents.length) {
            // CRUD的name会透传给Table，这样可以保证找到CRUD
            var crud = parents.find(function (cmpt) { var _a, _b; return ((_a = cmpt === null || cmpt === void 0 ? void 0 : cmpt.props) === null || _a === void 0 ? void 0 : _a.name) === ((_b = _this.props) === null || _b === void 0 ? void 0 : _b.name); });
            return (_b = crud === null || crud === void 0 ? void 0 : crud.reload) === null || _b === void 0 ? void 0 : _b.call(crud, subPath, query, ctx);
        }
        if (subPath) {
            return scoped.reload(subPath, ctx);
        }
    };
    TableRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'table',
            storeType: amisCore.TableStore.name,
            name: 'table'
        })
    ], TableRenderer);
    return TableRenderer;
})(Table));

exports.TableCell = TableCell.TableCell;
exports["default"] = Table;
