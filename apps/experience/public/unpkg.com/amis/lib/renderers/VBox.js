/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var cx = require('classnames');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);

var VBox = /** @class */ (function (_super) {
    tslib.__extends(VBox, _super);
    function VBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VBox.prototype.renderChild = function (region, node) {
        var render = this.props.render;
        return render(region, node);
    };
    VBox.prototype.renderCell = function (row, key) {
        var ns = this.props.classPrefix;
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "Vbox-cell"), row.cellClassName) }, this.renderChild("row/".concat(key), row)));
    };
    VBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, rows = _a.rows, ns = _a.classPrefix;
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "Vbox"), className) }, Array.isArray(rows)
            ? rows.map(function (row, key) { return (React__default["default"].createElement("div", { className: cx__default["default"]('row-row', row.rowClassName), key: key }, _this.renderCell(row, key))); })
            : null));
    };
    VBox.propsList = ['rows'];
    VBox.defaultProps = {};
    return VBox;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(VBoxRenderer, _super);
    function VBoxRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VBoxRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'vbox'
        })
    ], VBoxRenderer);
    return VBoxRenderer;
})(VBox));

exports["default"] = VBox;
