/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var cx = require('classnames');
var amisCore = require('amis-core');
var qrcode_react = require('qrcode.react');
var mapValues = require('lodash/mapValues');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);
var mapValues__default = /*#__PURE__*/_interopDefaultLegacy(mapValues);

var QRCode = /** @class */ (function (_super) {
    tslib.__extends(QRCode, _super);
    function QRCode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取图片配置
     */
    QRCode.prototype.getImageSettings = function () {
        var _a = this.props, imageSettings = _a.imageSettings, data = _a.data;
        if (!imageSettings ||
            !amisCore.isObject(imageSettings) ||
            !imageSettings.src ||
            typeof imageSettings.src !== 'string') {
            return undefined;
        }
        if (amisCore.isPureVariable(imageSettings.src)) {
            imageSettings.src = amisCore.resolveVariableAndFilter(imageSettings.src, data, '| raw');
        }
        return mapValues__default["default"](imageSettings, function (value, key) {
            if (!!~['width', 'height', 'x', 'y'].indexOf(key)) {
                /** 处理非数字格式的输入，QRCodeSVG内部会对空值进行默认赋值 */
                return amisCore.isNumeric(value) ? Number(value) : null;
            }
            return value;
        });
    };
    QRCode.prototype.render = function () {
        var _a = this.props, className = _a.className, qrcodeClassName = _a.qrcodeClassName, codeSize = _a.codeSize, backgroundColor = _a.backgroundColor, foregroundColor = _a.foregroundColor, placeholder = _a.placeholder, level = _a.level, defaultValue = _a.defaultValue, data = _a.data, ns = _a.classPrefix;
        var finalValue = amisCore.getPropValue(this.props, function () { return amisCore.filter(defaultValue, data, '| raw') || undefined; });
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "QrCode"), className) }, !finalValue ? (React__default["default"].createElement("span", { className: "".concat(ns, "QrCode--placeholder") }, placeholder)) : finalValue.length > 2953 ? (
        // https://github.com/zpao/qrcode.react/issues/69
        React__default["default"].createElement("span", { className: "text-danger" }, "\u4E8C\u7EF4\u7801\u503C\u8FC7\u957F\uFF0C\u8BF7\u8BBE\u7F6E2953\u4E2A\u5B57\u7B26\u4EE5\u4E0B\u7684\u6587\u672C")) : (React__default["default"].createElement(qrcode_react.QRCodeSVG
        // @ts-ignore 其实是支持的
        , { 
            // @ts-ignore 其实是支持的
            className: qrcodeClassName, value: finalValue, size: codeSize, bgColor: backgroundColor, fgColor: foregroundColor, level: level || 'L', imageSettings: this.getImageSettings() }))));
    };
    QRCode.defaultProps = {
        codeSize: 128,
        qrcodeClassName: '',
        backgroundColor: '#fff',
        foregroundColor: '#000',
        level: 'L',
        placeholder: '-'
    };
    return QRCode;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(QRCodeRenderer, _super);
    function QRCodeRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QRCodeRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)qr\-?code$/,
            name: 'qrcode'
        })
    ], QRCodeRenderer);
    return QRCodeRenderer;
})(QRCode));

exports["default"] = QRCode;
