/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var TableBody = require('./TableBody.js');
var mobxReact = require('mobx-react');
var ItemActionsWrapper = require('./ItemActionsWrapper.js');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var TableContent = /** @class */ (function (_super) {
    tslib.__extends(TableContent, _super);
    function TableContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableContent.prototype.renderItemActions = function () {
        var _a = this.props, itemActions = _a.itemActions, render = _a.render, store = _a.store, cx = _a.classnames;
        var finalActions = Array.isArray(itemActions)
            ? itemActions.filter(function (action) { return !action.hiddenOnHover; })
            : [];
        if (!finalActions.length) {
            return null;
        }
        return (React__default["default"].createElement(ItemActionsWrapper["default"], { store: store, classnames: cx },
            React__default["default"].createElement("div", { className: cx('Table-itemActions') }, finalActions.map(function (action, index) {
                return render("itemAction/".concat(index), tslib.__assign(tslib.__assign({}, action), { isMenuItem: true }), {
                    key: index,
                    item: store.hoverRow,
                    data: store.hoverRow.locals,
                    rowIndex: store.hoverRow.index
                });
            }))));
    };
    TableContent.prototype.render = function () {
        var _a = this.props, placeholder = _a.placeholder, cx = _a.classnames, render = _a.render, className = _a.className, columns = _a.columns, columnsGroup = _a.columnsGroup, onMouseMove = _a.onMouseMove, onScroll = _a.onScroll, tableRef = _a.tableRef, rows = _a.rows, renderHeadCell = _a.renderHeadCell, renderCell = _a.renderCell, onCheck = _a.onCheck, rowClassName = _a.rowClassName, onQuickChange = _a.onQuickChange, footable = _a.footable, footableColumns = _a.footableColumns, checkOnItemClick = _a.checkOnItemClick, buildItemProps = _a.buildItemProps, onAction = _a.onAction, rowClassNameExpr = _a.rowClassNameExpr, affixRowClassName = _a.affixRowClassName, prefixRowClassName = _a.prefixRowClassName, data = _a.data, prefixRow = _a.prefixRow, locale = _a.locale, translate = _a.translate, itemAction = _a.itemAction, affixRow = _a.affixRow, store = _a.store, dispatchEvent = _a.dispatchEvent, onEvent = _a.onEvent, loading = _a.loading;
        var tableClassName = cx('Table-table', this.props.tableClassName);
        var hideHeader = columns.every(function (column) { return !column.label; });
        return (React__default["default"].createElement("div", { onMouseMove: onMouseMove, className: cx('Table-content', className), onScroll: onScroll },
            store.hoverRow ? this.renderItemActions() : null,
            React__default["default"].createElement("table", { ref: tableRef, className: tableClassName },
                React__default["default"].createElement("thead", null,
                    columnsGroup.length ? (React__default["default"].createElement("tr", null, columnsGroup.map(function (item, index) {
                        /**
                         * 勾选列和展开列的表头单独成列
                         * 如果分组列只有一个元素且未分组时，也要执行表头合并
                         */
                        return !!~['__checkme', '__expandme'].indexOf(item.has[0].type) ||
                            (item.has.length === 1 &&
                                !/^__/.test(item.has[0].type) &&
                                !item.has[0].groupName) ? (renderHeadCell(item.has[0], {
                            'data-index': item.has[0].index,
                            'key': index,
                            'colSpan': item.colSpan,
                            'rowSpan': item.rowSpan
                        })) : (React__default["default"].createElement("th", { key: index, "data-index": item.index, colSpan: item.colSpan, rowSpan: item.rowSpan }, item.label ? render('tpl', item.label) : null));
                    }))) : null,
                    React__default["default"].createElement("tr", { className: hideHeader ? 'fake-hide' : '' }, columns.map(function (column) {
                        var _a;
                        return ((_a = columnsGroup.find(function (group) { return ~group.has.indexOf(column); })) === null || _a === void 0 ? void 0 : _a.rowSpan) === 2
                            ? null
                            : renderHeadCell(column, {
                                'data-index': column.index,
                                'key': column.index
                            });
                    }))),
                !rows.length ? (React__default["default"].createElement("tbody", null,
                    React__default["default"].createElement("tr", { className: cx('Table-placeholder') }, !loading ? (React__default["default"].createElement("td", { colSpan: columns.length }, typeof placeholder === 'string' ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                        React__default["default"].createElement(amisUi.Icon, { icon: "desk-empty", className: cx('Table-placeholder-empty-icon', 'icon') }),
                        translate(placeholder || 'placeholder.noData'))) : (render('placeholder', translate(placeholder || 'placeholder.noData'))))) : null))) : (React__default["default"].createElement(TableBody.TableBody, { itemAction: itemAction, classnames: cx, render: render, renderCell: renderCell, onCheck: onCheck, onQuickChange: onQuickChange, footable: footable, footableColumns: footableColumns, checkOnItemClick: checkOnItemClick, buildItemProps: buildItemProps, onAction: onAction, rowClassNameExpr: rowClassNameExpr, rowClassName: rowClassName, prefixRowClassName: prefixRowClassName, affixRowClassName: affixRowClassName, rows: rows, columns: columns, locale: locale, translate: translate, prefixRow: prefixRow, affixRow: affixRow, data: data, rowsProps: {
                        data: data,
                        dispatchEvent: dispatchEvent,
                        onEvent: onEvent
                    } })))));
    };
    TableContent = tslib.__decorate([
        mobxReact.observer
    ], TableContent);
    return TableContent;
}(React__default["default"].Component));

exports.TableContent = TableContent;
