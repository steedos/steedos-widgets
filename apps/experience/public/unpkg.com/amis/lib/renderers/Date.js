/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var moment = require('moment');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

var DateField = /** @class */ (function (_super) {
    tslib.__extends(DateField, _super);
    function DateField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 动态显示相对时间时，用来触发视图更新
        _this.state = {
            random: 0
        };
        return _this;
    }
    DateField.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, fromNow = _a.fromNow, updateFrequency = _a.updateFrequency;
        if (fromNow && updateFrequency) {
            this.refreshInterval = setInterval(function () {
                _this.setState({
                    random: Math.random()
                });
            }, updateFrequency);
        }
    };
    DateField.prototype.componentWillUnmount = function () {
        clearInterval(this.refreshInterval);
    };
    DateField.prototype.render = function () {
        var _a = this.props, valueFormat = _a.valueFormat, format = _a.format, placeholder = _a.placeholder, fromNow = _a.fromNow, className = _a.className, cx = _a.classnames, __ = _a.translate;
        var viewValue = (React__default["default"].createElement("span", { className: "text-muted" }, placeholder));
        var value = amisCore.getPropValue(this.props);
        // 主要是给 fromNow 用的
        var date;
        if (value) {
            var ISODate = moment__default["default"](value, moment__default["default"].ISO_8601);
            var NormalDate = moment__default["default"](value, valueFormat);
            viewValue = ISODate.isValid()
                ? ISODate.format(format)
                : NormalDate.isValid()
                    ? NormalDate.format(format)
                    : false;
            if (viewValue) {
                date = viewValue;
            }
        }
        if (fromNow) {
            viewValue = moment__default["default"](viewValue).fromNow();
        }
        viewValue = !viewValue ? (React__default["default"].createElement("span", { className: "text-danger" }, __('Date.invalid'))) : (viewValue);
        return (React__default["default"].createElement("span", { className: cx('DateField', className), title: fromNow ? date : undefined }, viewValue));
    };
    DateField.defaultProps = {
        placeholder: '-',
        format: 'YYYY-MM-DD',
        valueFormat: 'X',
        fromNow: false,
        updateFrequency: 60000
    };
    return DateField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(DateFieldRenderer, _super);
    function DateFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateField.defaultProps), { format: 'YYYY-MM-DD' });
    DateFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'date'
        })
    ], DateFieldRenderer);
    return DateFieldRenderer;
})(DateField));
/** @class */ ((function (_super) {
    tslib.__extends(DateTimeFieldRenderer, _super);
    function DateTimeFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateTimeFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateField.defaultProps), { format: 'YYYY-MM-DD HH:mm:ss' });
    DateTimeFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'datetime'
        })
    ], DateTimeFieldRenderer);
    return DateTimeFieldRenderer;
})(DateField));
/** @class */ ((function (_super) {
    tslib.__extends(TimeFieldRenderer, _super);
    function TimeFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateField.defaultProps), { format: 'HH:mm' });
    TimeFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'time'
        })
    ], TimeFieldRenderer);
    return TimeFieldRenderer;
})(DateField));
/** @class */ ((function (_super) {
    tslib.__extends(MonthFieldRenderer, _super);
    function MonthFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonthFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateField.defaultProps), { format: 'YYYY-MM' });
    MonthFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'month'
        })
    ], MonthFieldRenderer);
    return MonthFieldRenderer;
})(DateField));

exports.DateField = DateField;
