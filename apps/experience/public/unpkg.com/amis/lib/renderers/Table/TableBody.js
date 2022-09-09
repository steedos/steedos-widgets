/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var TableRow = require('./TableRow.js');
var amisCore = require('amis-core');
var mobxReact = require('mobx-react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var TableBody = /** @class */ (function (_super) {
    tslib.__extends(TableBody, _super);
    function TableBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableBody.prototype.renderRows = function (rows, columns, rowProps) {
        var _this = this;
        if (columns === void 0) { columns = this.props.columns; }
        if (rowProps === void 0) { rowProps = {}; }
        var _a = this.props, rowClassName = _a.rowClassName, rowClassNameExpr = _a.rowClassNameExpr, onAction = _a.onAction, buildItemProps = _a.buildItemProps, checkOnItemClick = _a.checkOnItemClick, cx = _a.classnames, render = _a.render, renderCell = _a.renderCell, onCheck = _a.onCheck, onQuickChange = _a.onQuickChange, footable = _a.footable, ignoreFootableContent = _a.ignoreFootableContent, footableColumns = _a.footableColumns, itemAction = _a.itemAction;
        return rows.map(function (item, rowIndex) {
            var itemProps = buildItemProps ? buildItemProps(item, rowIndex) : null;
            var doms = [
                React__default["default"].createElement(TableRow.TableRow, tslib.__assign({}, itemProps, { itemAction: itemAction, classnames: cx, checkOnItemClick: checkOnItemClick, key: item.id, itemIndex: rowIndex, item: item, itemClassName: cx(rowClassNameExpr
                        ? amisCore.filter(rowClassNameExpr, item.data)
                        : rowClassName, {
                        'is-last': item.depth > 1 && rowIndex === rows.length - 1
                    }), columns: columns, renderCell: renderCell, render: render, onAction: onAction, onCheck: onCheck, 
                    // todo 先注释 quickEditEnabled={item.depth === 1}
                    onQuickChange: onQuickChange }, rowProps))
            ];
            if (footable && footableColumns.length) {
                if (item.depth === 1) {
                    doms.push(React__default["default"].createElement(TableRow.TableRow, tslib.__assign({}, itemProps, { itemAction: itemAction, classnames: cx, checkOnItemClick: checkOnItemClick, key: "foot-".concat(item.id), itemIndex: rowIndex, item: item, itemClassName: cx(rowClassNameExpr
                            ? amisCore.filter(rowClassNameExpr, item.data)
                            : rowClassName), columns: footableColumns, renderCell: renderCell, render: render, onAction: onAction, onCheck: onCheck, footableMode: true, footableColSpan: columns.length, onQuickChange: onQuickChange, ignoreFootableContent: ignoreFootableContent }, rowProps)));
                }
            }
            else if (item.children.length && item.expanded) {
                // 嵌套表格
                doms.push.apply(doms, _this.renderRows(item.children, columns, tslib.__assign(tslib.__assign({}, rowProps), { parent: item })));
            }
            return doms;
        });
    };
    TableBody.prototype.renderSummaryRow = function (position, items, rowIndex) {
        var _a = this.props, columns = _a.columns, render = _a.render, data = _a.data, cx = _a.classnames, rows = _a.rows, prefixRowClassName = _a.prefixRowClassName, affixRowClassName = _a.affixRowClassName;
        if (!(Array.isArray(items) && items.length)) {
            return null;
        }
        var filterColumns = columns.filter(function (item) { return item.toggable; });
        var result = [];
        for (var index = 0; index < filterColumns.length; index++) {
            var item = items[filterColumns[index].rawIndex];
            item && result.push(tslib.__assign({}, item));
        }
        //  如果是勾选栏，让它和下一列合并。
        if (columns[0].type === '__checkme' && result[0]) {
            result[0].colSpan = (result[0].colSpan || 1) + 1;
        }
        //  如果是展开栏，让它和下一列合并。
        if (columns[0].type === '__expandme' && result[0]) {
            result[0].colSpan = (result[0].colSpan || 1) + 1;
        }
        // 缺少的单元格补齐
        var appendLen = columns.length - result.reduce(function (p, c) { return p + (c.colSpan || 1); }, 0);
        if (appendLen) {
            var item = result.pop();
            result.push(tslib.__assign(tslib.__assign({}, item), { colSpan: (item.colSpan || 1) + appendLen }));
        }
        var ctx = amisCore.createObject(data, {
            items: rows.map(function (row) { return row.locals; })
        });
        return (React__default["default"].createElement("tr", { className: cx('Table-tr', 'is-summary', position === 'prefix' ? prefixRowClassName : '', position === 'affix' ? affixRowClassName : ''), key: "summary-".concat(position, "-").concat(rowIndex || 0) }, result.map(function (item, index) {
            var Com = item.isHead ? 'th' : 'td';
            return (React__default["default"].createElement(Com, { key: index, colSpan: item.colSpan, className: item.cellClassName }, render("summary-row/".concat(index), item, {
                data: ctx
            })));
        })));
    };
    TableBody.prototype.renderSummary = function (position, items) {
        var _this = this;
        return Array.isArray(items)
            ? items.some(function (i) { return Array.isArray(i); })
                ? items.map(function (i, rowIndex) {
                    return _this.renderSummaryRow(position, Array.isArray(i) ? i : [i], rowIndex);
                })
                : this.renderSummaryRow(position, items)
            : null;
    };
    TableBody.prototype.render = function () {
        var _a = this.props; _a.classnames; var className = _a.className; _a.render; var rows = _a.rows, columns = _a.columns, rowsProps = _a.rowsProps, prefixRow = _a.prefixRow, affixRow = _a.affixRow; _a.translate;
        return (React__default["default"].createElement("tbody", { className: className }, rows.length ? (React__default["default"].createElement(React__default["default"].Fragment, null,
            this.renderSummary('prefix', prefixRow),
            this.renderRows(rows, columns, rowsProps),
            this.renderSummary('affix', affixRow))) : null));
    };
    TableBody = tslib.__decorate([
        mobxReact.observer
    ], TableBody);
    return TableBody;
}(React__default["default"].Component));

exports.TableBody = TableBody;
