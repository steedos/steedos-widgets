/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var ColumnToggler = require('../Table/ColumnToggler.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** @class */ ((function (_super) {
    tslib.__extends(ColumnTogglerRenderer, _super);
    function ColumnTogglerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnTogglerRenderer.prototype.render = function () {
        var _this = this;
        var _a = this.props; _a.className; _a.store; var render = _a.render, ns = _a.classPrefix, cx = _a.classnames, tooltip = _a.tooltip, align = _a.align, cols = _a.cols, toggleAllColumns = _a.toggleAllColumns, toggleToggle = _a.toggleToggle, data = _a.data, rest = tslib.__rest(_a, ["className", "store", "render", "classPrefix", "classnames", "tooltip", "align", "cols", "toggleAllColumns", "toggleToggle", "data"]);
        var __ = rest.translate;
        var env = rest.env;
        if (!cols) {
            return null;
        }
        var toggableColumns = cols.filter(function (item) {
            return amisCore.isVisible(item.pristine || item, data) && item.toggable !== false;
        });
        var activeToggaleColumns = toggableColumns.filter(function (item) { return item.toggled !== false; });
        return (React__default["default"].createElement(ColumnToggler["default"], tslib.__assign({}, rest, { render: render, tooltip: tooltip || __('Table.columnsVisibility'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, isActived: cols.findIndex(function (column) { return !column.toggled; }) !== -1, align: align !== null && align !== void 0 ? align : 'right', classnames: cx, classPrefix: ns, key: "columns-toggable", columns: cols, activeToggaleColumns: activeToggaleColumns, data: data }),
            (toggableColumns === null || toggableColumns === void 0 ? void 0 : toggableColumns.length) ? (React__default["default"].createElement("li", { className: cx('ColumnToggler-menuItem'), key: 'selectAll', onClick: function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var _a, data, dispatchEvent, allToggled, rendererEvent;
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent;
                                allToggled = !((activeToggaleColumns === null || activeToggaleColumns === void 0 ? void 0 : activeToggaleColumns.length) === (toggableColumns === null || toggableColumns === void 0 ? void 0 : toggableColumns.length));
                                return [4 /*yield*/, dispatchEvent('columnToggled', amisCore.createObject(data, {
                                        columns: allToggled
                                            ? toggableColumns === null || toggableColumns === void 0 ? void 0 : toggableColumns.map(function (column) { return column; })
                                            : []
                                    }))];
                            case 1:
                                rendererEvent = _b.sent();
                                if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                                    return [2 /*return*/];
                                }
                                toggleAllColumns && toggleAllColumns(allToggled);
                                return [2 /*return*/];
                        }
                    });
                }); } },
                React__default["default"].createElement(amisUi.Checkbox, { size: "sm", classPrefix: ns, key: "checkall", checked: !!(activeToggaleColumns === null || activeToggaleColumns === void 0 ? void 0 : activeToggaleColumns.length), partial: !!((activeToggaleColumns === null || activeToggaleColumns === void 0 ? void 0 : activeToggaleColumns.length) &&
                        (activeToggaleColumns === null || activeToggaleColumns === void 0 ? void 0 : activeToggaleColumns.length) !== (toggableColumns === null || toggableColumns === void 0 ? void 0 : toggableColumns.length)) }, __('Checkboxes.selectAll')))) : null, toggableColumns === null || toggableColumns === void 0 ? void 0 :
            toggableColumns.map(function (column, index) { return (React__default["default"].createElement("li", { className: cx('ColumnToggler-menuItem'), key: 'item' + (column.index || index), onClick: function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var _a, data, dispatchEvent, columns, rendererEvent;
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent;
                                columns = activeToggaleColumns.map(function (item) { return item; });
                                if (column.toggled !== false) {
                                    columns.push(column);
                                }
                                else {
                                    columns = columns.filter(function (c) { return c.name !== column.name; });
                                }
                                return [4 /*yield*/, dispatchEvent('columnToggled', amisCore.createObject(data, {
                                        columns: columns
                                    }))];
                            case 1:
                                rendererEvent = _b.sent();
                                if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                                    return [2 /*return*/];
                                }
                                toggleToggle && toggleToggle(!(column.toggled !== false), index);
                                return [2 /*return*/];
                        }
                    });
                }); } },
                React__default["default"].createElement(amisUi.Checkbox, { size: "sm", classPrefix: ns, checked: column.toggled !== false }, column.title ? render('tpl', column.title) : null))); })));
    };
    ColumnTogglerRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'column-toggler',
            name: 'column-toggler'
        })
    ], ColumnTogglerRenderer);
    return ColumnTogglerRenderer;
})(React__default["default"].Component));
