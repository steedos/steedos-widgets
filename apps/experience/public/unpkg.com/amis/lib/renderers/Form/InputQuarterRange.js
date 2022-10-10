/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var cx = require('classnames');
var InputDateRange = require('./InputDateRange.js');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);

var QuarterRangeControl = /** @class */ (function (_super) {
    tslib.__extends(QuarterRangeControl, _super);
    function QuarterRangeControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterRangeControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, minDate = _a.minDate, maxDate = _a.maxDate, minDuration = _a.minDuration, maxDuration = _a.maxDuration, data = _a.data, format = _a.format; _a.env; var rest = tslib.__rest(_a, ["className", "classPrefix", "minDate", "maxDate", "minDuration", "maxDuration", "data", "format", "env"]);
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "DateRangeControl"), className) },
            React__default["default"].createElement(amisUi.DateRangePicker, tslib.__assign({ viewMode: "quarters", format: format, classPrefix: ns, data: data }, rest, { minDate: minDate ? amisCore.filterDate(minDate, data, format) : undefined, maxDate: maxDate ? amisCore.filterDate(maxDate, data, format) : undefined, minDuration: minDuration ? amisCore.parseDuration(minDuration) : undefined, maxDuration: maxDuration ? amisCore.parseDuration(maxDuration) : undefined, onChange: this.handleChange, onFocus: this.dispatchEvent, onBlur: this.dispatchEvent }))));
    };
    return QuarterRangeControl;
}(InputDateRange["default"]));
/** @class */ ((function (_super) {
    tslib.__extends(QuarterRangeControlRenderer, _super);
    function QuarterRangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterRangeControlRenderer.defaultProps = {
        format: 'X',
        inputFormat: 'YYYY-[Q]Q',
        joinValues: true,
        delimiter: ',',
        timeFormat: '',
        ranges: 'thisquarter,prevquarter',
        animation: true
    };
    QuarterRangeControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-quarter-range'
        })
    ], QuarterRangeControlRenderer);
    return QuarterRangeControlRenderer;
})(QuarterRangeControl));

exports["default"] = QuarterRangeControl;
