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

var ColorField = /** @class */ (function (_super) {
    tslib.__extends(ColorField, _super);
    function ColorField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorField.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, defaultColor = _a.defaultColor, showValue = _a.showValue;
        var color = amisCore.getPropValue(this.props);
        return (React__default["default"].createElement("div", { className: cx('ColorField', className) },
            React__default["default"].createElement("i", { className: cx('ColorField-previewIcon'), style: { backgroundColor: color || defaultColor } }),
            showValue ? (React__default["default"].createElement("span", { className: cx('ColorField-value') }, color)) : null));
    };
    ColorField.defaultProps = {
        className: '',
        defaultColor: '#ccc',
        showValue: true
    };
    return ColorField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ColorFieldRenderer, _super);
    function ColorFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'color'
        })
    ], ColorFieldRenderer);
    return ColorFieldRenderer;
})(ColorField));

exports.ColorField = ColorField;
