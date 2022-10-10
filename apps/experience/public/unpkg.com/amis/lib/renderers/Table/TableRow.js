/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxReact = require('mobx-react');
var React = require('react');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var TableRow = /** @class */ (function (_super) {
    tslib.__extends(TableRow, _super);
    // reaction?: () => void;
    function TableRow(props) {
        var _this = _super.call(this, props) || this;
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleItemClick = _this.handleItemClick.bind(_this);
        return _this;
    }
    // 定义点击一行的行为，通过 itemAction配置
    TableRow.prototype.handleItemClick = function (e) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, itemAction, onAction, item, data, dispatchEvent, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (amisCore.isClickOnInput(e)) {
                            return [2 /*return*/];
                        }
                        _a = this.props, itemAction = _a.itemAction, onAction = _a.onAction, item = _a.item, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('rowClick', amisCore.createObject(data, {
                                rowItem: item === null || item === void 0 ? void 0 : item.data
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        if (itemAction) {
                            onAction && onAction(e, itemAction, item === null || item === void 0 ? void 0 : item.data);
                            item.toggle();
                        }
                        else {
                            this.props.onCheck(this.props.item);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRow.prototype.handleAction = function (e, action, ctx) {
        var _a = this.props, onAction = _a.onAction, item = _a.item;
        onAction && onAction(e, action, ctx || item.data);
    };
    TableRow.prototype.handleQuickChange = function (values, saveImmediately, savePristine, options) {
        var _a = this.props, onQuickChange = _a.onQuickChange, item = _a.item;
        onQuickChange &&
            onQuickChange(item, values, saveImmediately, savePristine, options);
    };
    TableRow.prototype.handleChange = function (value, name, submit, changePristine) {
        var _a;
        if (!name || typeof name !== 'string') {
            return;
        }
        var _b = this.props, item = _b.item, onQuickChange = _b.onQuickChange;
        onQuickChange === null || onQuickChange === void 0 ? void 0 : onQuickChange(item, (_a = {},
            _a[name] = value,
            _a), submit, changePristine);
    };
    TableRow.prototype.render = function () {
        var _a, _b;
        var _this = this;
        var _c = this.props, itemClassName = _c.itemClassName, itemIndex = _c.itemIndex, item = _c.item, columns = _c.columns, renderCell = _c.renderCell; _c.children; var footableMode = _c.footableMode, ignoreFootableContent = _c.ignoreFootableContent, footableColSpan = _c.footableColSpan, regionPrefix = _c.regionPrefix, checkOnItemClick = _c.checkOnItemClick; _c.classPrefix; var render = _c.render, cx = _c.classnames, parent = _c.parent, itemAction = _c.itemAction, onEvent = _c.onEvent, rest = tslib.__rest(_c, ["itemClassName", "itemIndex", "item", "columns", "renderCell", "children", "footableMode", "ignoreFootableContent", "footableColSpan", "regionPrefix", "checkOnItemClick", "classPrefix", "render", "classnames", "parent", "itemAction", "onEvent"]);
        if (footableMode) {
            if (!item.expanded) {
                return null;
            }
            return (React__default["default"].createElement("tr", { "data-id": item.id, "data-index": item.newIndex, onClick: checkOnItemClick || itemAction || (onEvent === null || onEvent === void 0 ? void 0 : onEvent.rowClick)
                    ? this.handleItemClick
                    : undefined, className: cx(itemClassName, (_a = {
                        'is-hovered': item.isHover,
                        'is-checked': item.checked,
                        'is-modified': item.modified,
                        'is-moved': item.moved
                    },
                    _a["Table-tr--hasItemAction"] = itemAction,
                    _a["Table-tr--odd"] = itemIndex % 2 === 0,
                    _a["Table-tr--even"] = itemIndex % 2 === 1,
                    _a)) },
                React__default["default"].createElement("td", { className: cx("Table-foot"), colSpan: footableColSpan },
                    React__default["default"].createElement("table", { className: cx("Table-footTable") },
                        React__default["default"].createElement("tbody", null, ignoreFootableContent
                            ? columns.map(function (column) { return (React__default["default"].createElement("tr", { key: column.index },
                                column.label !== false ? React__default["default"].createElement("th", null) : null,
                                React__default["default"].createElement("td", null))); })
                            : columns.map(function (column) { return (React__default["default"].createElement("tr", { key: column.index },
                                column.label !== false ? (React__default["default"].createElement("th", null, render("".concat(regionPrefix).concat(itemIndex, "/").concat(column.index, "/tpl"), column.label))) : null,
                                renderCell("".concat(regionPrefix).concat(itemIndex, "/").concat(column.index), column, item, tslib.__assign(tslib.__assign({}, rest), { width: null, rowIndex: itemIndex, colIndex: column.index, key: column.index, onAction: _this.handleAction, onQuickChange: _this.handleQuickChange, onChange: _this.handleChange })))); }))))));
        }
        if (parent && !parent.expanded) {
            return null;
        }
        return (React__default["default"].createElement("tr", { onClick: checkOnItemClick || itemAction || (onEvent === null || onEvent === void 0 ? void 0 : onEvent.rowClick)
                ? this.handleItemClick
                : undefined, "data-index": item.depth === 1 ? item.newIndex : undefined, "data-id": item.id, className: cx(itemClassName, (_b = {
                    'is-hovered': item.isHover,
                    'is-checked': item.checked,
                    'is-modified': item.modified,
                    'is-moved': item.moved,
                    'is-expanded': item.expanded && item.expandable,
                    'is-expandable': item.expandable
                },
                _b["Table-tr--hasItemAction"] = itemAction,
                _b["Table-tr--odd"] = itemIndex % 2 === 0,
                _b["Table-tr--even"] = itemIndex % 2 === 1,
                _b), "Table-tr--".concat(item.depth, "th")) }, columns.map(function (column) {
            return renderCell("".concat(itemIndex, "/").concat(column.index), column, item, tslib.__assign(tslib.__assign({}, rest), { rowIndex: itemIndex, colIndex: column.index, key: column.index, onAction: _this.handleAction, onQuickChange: _this.handleQuickChange, onChange: _this.handleChange }));
        })));
    };
    TableRow = tslib.__decorate([
        mobxReact.observer,
        tslib.__metadata("design:paramtypes", [Object])
    ], TableRow);
    return TableRow;
}(React__default["default"].Component));

exports.TableRow = TableRow;
