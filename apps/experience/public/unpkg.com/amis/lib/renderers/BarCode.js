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

var BarCode = React__default["default"].lazy(function () { return Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['amis-ui/lib/components/BarCode'], function(mod) {fullfill(tslib.__importStar(mod))})})}); });
var BarCodeField = /** @class */ (function (_super) {
    tslib.__extends(BarCodeField, _super);
    function BarCodeField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarCodeField.prototype.render = function () {
        var _a = this.props, className = _a.className; _a.width; _a.height; var cx = _a.classnames, options = _a.options;
        var value = amisCore.getPropValue(this.props);
        return (React__default["default"].createElement(React.Suspense, { fallback: React__default["default"].createElement("div", null, "...") },
            React__default["default"].createElement("div", { "data-testid": "barcode", className: cx('BarCode', className) },
                React__default["default"].createElement(BarCode, { value: value, options: options }))));
    };
    return BarCodeField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(BarCodeFieldRenderer, _super);
    function BarCodeFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarCodeFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'barcode'
        })
    ], BarCodeFieldRenderer);
    return BarCodeFieldRenderer;
})(BarCodeField));

exports.BarCodeField = BarCodeField;
