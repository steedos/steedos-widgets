/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * @file 表格的方式显示只读信息，比如产品详情
 */
var Property = /** @class */ (function (_super) {
    tslib.__extends(Property, _super);
    function Property(props) {
        return _super.call(this, props) || this;
    }
    /**
     * 算好每行的分布情况，方便后续渲染
     */
    Property.prototype.prepareRows = function () {
        var _a = this.props, _b = _a.column, column = _b === void 0 ? 3 : _b, items = _a.items, source = _a.source, data = _a.data;
        var propertyItems = items ? items : source || [];
        var rows = [];
        var row = [];
        var columnLeft = column;
        var index = 0;
        var filteredItems = amisCore.visibilityFilter(propertyItems, data);
        for (var _i = 0, filteredItems_1 = filteredItems; _i < filteredItems_1.length; _i++) {
            var item = filteredItems_1[_i];
            index = index + 1;
            var span = Math.min(item.span || 1, column);
            columnLeft = columnLeft - span;
            var rowItem = {
                label: item.label,
                content: item.content,
                span: span
            };
            // 如果还能放得下就放这一行
            if (columnLeft >= 0) {
                row.push(rowItem);
            }
            else {
                rows.push(row);
                columnLeft = column - span;
                row = [rowItem];
            }
            // 最后一行将最后的数据 push
            if (index === filteredItems.length) {
                rows.push(row);
            }
        }
        return rows;
    };
    Property.prototype.renderRow = function (rows) {
        var _a = this.props, render = _a.render, contentStyle = _a.contentStyle, labelStyle = _a.labelStyle, _b = _a.separator, separator = _b === void 0 ? ': ' : _b, _c = _a.mode, mode = _c === void 0 ? 'table' : _c, data = _a.data;
        return rows.map(function (row, key) {
            return (React__default["default"].createElement("tr", { key: key }, row.map(function (property, index) {
                return mode === 'table' ? (React__default["default"].createElement(React__default["default"].Fragment, { key: "item-".concat(index) },
                    React__default["default"].createElement("th", { style: amisCore.buildStyle(labelStyle, data) }, render('label', property.label)),
                    React__default["default"].createElement("td", { colSpan: property.span + property.span - 1, style: amisCore.buildStyle(contentStyle, data) }, render('content', property.content)))) : (React__default["default"].createElement("td", { colSpan: property.span, style: amisCore.buildStyle(contentStyle, data), key: "item-".concat(index) },
                    React__default["default"].createElement("span", { style: amisCore.buildStyle(labelStyle, data) }, render('label', property.label)),
                    separator,
                    render('content', property.content)));
            })));
        });
    };
    Property.prototype.render = function () {
        var _a = this.props, style = _a.style, title = _a.title, _b = _a.column, column = _b === void 0 ? 3 : _b, cx = _a.classnames, className = _a.className, titleStyle = _a.titleStyle, data = _a.data, _c = _a.mode, mode = _c === void 0 ? 'table' : _c;
        var rows = this.prepareRows();
        return (React__default["default"].createElement("div", { className: cx('Property', "Property--".concat(mode), className), style: amisCore.buildStyle(style, data) },
            React__default["default"].createElement("table", null,
                title ? (React__default["default"].createElement("thead", null,
                    React__default["default"].createElement("tr", null,
                        React__default["default"].createElement("th", { colSpan: mode === 'table' ? column + column : column, style: amisCore.buildStyle(titleStyle, data) }, title)))) : null,
                React__default["default"].createElement("tbody", null, this.renderRow(rows)))));
    };
    return Property;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(PropertyRenderer, _super);
    function PropertyRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropertyRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'property',
            autoVar: true
        })
    ], PropertyRenderer);
    return PropertyRenderer;
})(Property));

exports["default"] = Property;
