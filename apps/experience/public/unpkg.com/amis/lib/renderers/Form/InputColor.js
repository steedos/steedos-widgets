/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var cx = require('classnames');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);

// todo amis-ui 里面组件直接改成按需加载
var ColorPicker = React__default["default"].lazy(function () { return Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['amis-ui/lib/components/ColorPicker'], function(mod) {fullfill(tslib.__importStar(mod))})})}); });
var ColorControl = /** @class */ (function (_super) {
    tslib.__extends(ColorControl, _super);
    function ColorControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            open: false
        };
        return _this;
    }
    ColorControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, value = _a.value, env = _a.env, useMobileUI = _a.useMobileUI, rest = tslib.__rest(_a, ["className", "classPrefix", "value", "env", "useMobileUI"]);
        var mobileUI = useMobileUI && amisCore.isMobile();
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "ColorControl"), className) },
            React__default["default"].createElement(React.Suspense, { fallback: React__default["default"].createElement("div", null, "...") },
                React__default["default"].createElement(ColorPicker, tslib.__assign({ classPrefix: ns }, rest, { useMobileUI: useMobileUI, popOverContainer: mobileUI && env && env.getModalContainer
                        ? env.getModalContainer
                        : mobileUI
                            ? undefined
                            : rest.popOverContainer, value: value || '' })))));
    };
    ColorControl.defaultProps = {
        format: 'hex',
        clearable: true
    };
    return ColorControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(ColorControlRenderer, _super);
    function ColorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-color'
        })
    ], ColorControlRenderer);
    return ColorControlRenderer;
})(ColorControl));

exports.ColorPicker = ColorPicker;
exports["default"] = ColorControl;
