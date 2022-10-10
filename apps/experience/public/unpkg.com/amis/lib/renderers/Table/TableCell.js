/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var QuickEdit = require('../QuickEdit.js');
var Copyable = require('../Copyable.js');
var PopOver = require('../PopOver.js');
var mobxReact = require('mobx-react');
var omit = require('lodash/omit');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);

var TableCell = /** @class */ (function (_super) {
    tslib.__extends(TableCell, _super);
    function TableCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableCell.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className; _a.classNameExpr; var render = _a.render, _b = _a.style, style = _b === void 0 ? {} : _b, Component = _a.wrapperComponent, column = _a.column, value = _a.value, data = _a.data, children = _a.children, width = _a.width, align = _a.align, innerClassName = _a.innerClassName; _a.label; var tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, rowSpan = _a.rowSpan; _a.body; _a.tpl; _a.remark; var prefix = _a.prefix, affix = _a.affix, isHead = _a.isHead; _a.colIndex; var row = _a.row, showBadge = _a.showBadge, itemBadge = _a.itemBadge, rest = tslib.__rest(_a, ["classnames", "className", "classNameExpr", "render", "style", "wrapperComponent", "column", "value", "data", "children", "width", "align", "innerClassName", "label", "tabIndex", "onKeyUp", "rowSpan", "body", "tpl", "remark", "prefix", "affix", "isHead", "colIndex", "row", "showBadge", "itemBadge"]);
        var schema = tslib.__assign(tslib.__assign({}, column), { className: innerClassName, type: (column && column.type) || 'plain' });
        var canAccessSuperData = (schema === null || schema === void 0 ? void 0 : schema.canAccessSuperData) !== false;
        // 如果本来就是 type 为 button，不要删除，其他情况下都应该删除。
        if (schema.type !== 'button' && schema.type !== 'dropdown-button') {
            delete schema.label;
        }
        var body = children
            ? children
            : render('field', schema, tslib.__assign(tslib.__assign({}, omit__default["default"](rest, Object.keys(schema))), { inputOnly: true, 
                /** value没有返回值时设置默认值，避免错误获取到父级数据域的值 */
                value: canAccessSuperData ? value : value !== null && value !== void 0 ? value : '', data: data }));
        if (width) {
            style = tslib.__assign(tslib.__assign({}, style), { width: (style && style.width) || width });
            if (!/%$/.test(String(style.width))) {
                body = (React__default["default"].createElement("div", { style: { width: style.width } },
                    prefix,
                    body,
                    affix));
                prefix = null;
                affix = null;
                // delete style.width;
            }
        }
        if (align) {
            style = tslib.__assign(tslib.__assign({}, style), { textAlign: align });
        }
        if (column.backgroundScale) {
            var backgroundScale = column.backgroundScale;
            var min = backgroundScale.min;
            var max = backgroundScale.max;
            if (amisCore.isPureVariable(min)) {
                min = amisCore.resolveVariableAndFilter(min, data, '| raw');
            }
            if (amisCore.isPureVariable(max)) {
                max = amisCore.resolveVariableAndFilter(max, data, '| raw');
            }
            if (typeof min === 'undefined') {
                min = Math.min.apply(Math, data.rows.map(function (r) { return r[column.name]; }));
            }
            if (typeof max === 'undefined') {
                max = Math.max.apply(Math, data.rows.map(function (r) { return r[column.name]; }));
            }
            var colorScale = new amisCore.ColorScale(min, max, backgroundScale.colors || ['#FFEF9C', '#FF7127']);
            var value_1 = data[column.name];
            if (amisCore.isPureVariable(backgroundScale.source)) {
                value_1 = amisCore.resolveVariableAndFilter(backgroundScale.source, data, '| raw');
            }
            var color = colorScale.getColor(Number(value_1)).toHexString();
            style.background = color;
        }
        if (!Component) {
            return body;
        }
        if (isHead) {
            Component = 'th';
        }
        return (React__default["default"].createElement(Component, { rowSpan: rowSpan > 1 ? rowSpan : undefined, style: style, className: cx(className, column.classNameExpr ? amisCore.filter(column.classNameExpr, data) : null), tabIndex: tabIndex, onKeyUp: onKeyUp },
            showBadge ? (React__default["default"].createElement(amisUi.Badge, { classnames: cx, badge: tslib.__assign(tslib.__assign({}, itemBadge), { className: cx("Table-badge", itemBadge === null || itemBadge === void 0 ? void 0 : itemBadge.className) }), data: row.data })) : null,
            prefix,
            body,
            affix));
    };
    TableCell.defaultProps = {
        wrapperComponent: 'td'
    };
    TableCell.propsList = [
        'type',
        'label',
        'column',
        'body',
        'tpl',
        'rowSpan',
        'remark'
    ];
    return TableCell;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TableCellRenderer, _super);
    function TableCellRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableCellRenderer.propsList = tslib.__spreadArray([
        'quickEdit',
        'quickEditEnabledOn',
        'popOver',
        'copyable',
        'inline'
    ], TableCell.propsList, true);
    TableCellRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)table\/(?:.*\/)?cell$/,
            name: 'table-cell'
        }),
        QuickEdit.HocQuickEdit(),
        PopOver.HocPopOver({
            targetOutter: true
        }),
        Copyable.HocCopyable(),
        mobxReact.observer
    ], TableCellRenderer);
    return TableCellRenderer;
})(TableCell));
/** @class */ ((function (_super) {
    tslib.__extends(FieldRenderer, _super);
    function FieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, TableCell.defaultProps), { wrapperComponent: 'div' });
    FieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'field',
            name: 'field'
        }),
        PopOver.HocPopOver(),
        Copyable.HocCopyable()
    ], FieldRenderer);
    return FieldRenderer;
})(TableCell));

exports.TableCell = TableCell;
