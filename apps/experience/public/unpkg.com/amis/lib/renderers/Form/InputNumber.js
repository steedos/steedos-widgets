/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var MiniDecimal = require('../../node_modules/rc-input-number/lib/utils/MiniDecimal.js');
var amisCore = require('amis-core');
var cx = require('classnames');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);

var NumberControl = /** @class */ (function (_super) {
    tslib.__extends(NumberControl, _super);
    function NumberControl(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleChangeUnit = _this.handleChangeUnit.bind(_this);
        var unit = _this.getUnit();
        var unitOptions = amisCore.normalizeOptions(props.unitOptions);
        var formItem = props.formItem, setPrinstineValue = props.setPrinstineValue, precision = props.precision, value = props.value;
        var normalizedPrecision = _this.filterNum(precision);
        /**
         * 如果设置了precision需要处理入参value的精度
         * 如果是带有单位的输入，则不支持精度处理
         */
        if (formItem &&
            value != null &&
            normalizedPrecision != null &&
            (!unit || unitOptions.length === 0)) {
            var normalizedValue = parseFloat(MiniDecimal.toFixed(value.toString(), '.', normalizedPrecision));
            if (!isNaN(normalizedValue)) {
                setPrinstineValue(normalizedValue);
            }
        }
        _this.state = { unit: unit, unitOptions: unitOptions };
        return _this;
    }
    /**
     * 动作处理
     */
    NumberControl.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            var value = this.getValue(resetValue !== null && resetValue !== void 0 ? resetValue : '');
            onChange === null || onChange === void 0 ? void 0 : onChange(value);
        }
    };
    // 解析出单位
    NumberControl.prototype.getUnit = function () {
        var props = this.props;
        if (props.unitOptions && props.unitOptions.length) {
            var optionValues = amisCore.normalizeOptions(props.unitOptions).map(function (option) { return option.value; });
            // 如果有值就解析出来作为单位
            if (props.value && typeof props.value === 'string') {
                var unit = optionValues[0];
                // 先找长的字符，这样如果有 ab 和 b 两种后缀相同的也能识别
                optionValues.sort(function (a, b) { return b.length - a.length; });
                for (var _i = 0, optionValues_1 = optionValues; _i < optionValues_1.length; _i++) {
                    var optionValue = optionValues_1[_i];
                    if (props.value.endsWith(optionValue)) {
                        unit = optionValue;
                        break;
                    }
                }
                return unit;
            }
            else {
                // 没有值就使用第一个单位
                return optionValues[0];
            }
        }
        return undefined;
    };
    NumberControl.prototype.getValue = function (inputValue) {
        var _a = this.props, resetValue = _a.resetValue, unitOptions = _a.unitOptions;
        if (inputValue && typeof inputValue !== 'number') {
            return;
        }
        if (inputValue !== null && unitOptions && this.state.unit) {
            inputValue = inputValue + this.state.unit;
        }
        return inputValue === null ? resetValue !== null && resetValue !== void 0 ? resetValue : null : inputValue;
    };
    // 派发有event的事件
    NumberControl.prototype.dispatchEvent = function (eventName) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, value;
            return tslib.__generator(this, function (_b) {
                _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, value = _a.value;
                dispatchEvent(eventName, amisCore.createObject(data, {
                    value: value
                }));
                return [2 /*return*/];
            });
        });
    };
    NumberControl.prototype.handleChange = function (inputValue) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onChange, data, dispatchEvent, value, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        value = this.getValue(inputValue);
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                value: value
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    NumberControl.prototype.filterNum = function (value) {
        if (typeof value !== 'number') {
            value = amisCore.filter(value, this.props.data);
            value = /^[-]?\d+/.test(value) ? +value : undefined;
        }
        return value;
    };
    // 单位选项的变更
    NumberControl.prototype.handleChangeUnit = function (option) {
        var _this = this;
        var value = this.props.value;
        var prevUnitValue = this.state.unit;
        this.setState({ unit: option.value }, function () {
            if (value) {
                value = value.replace(prevUnitValue, '');
                _this.props.onChange(value + _this.state.unit);
            }
        });
    };
    NumberControl.prototype.componentDidUpdate = function (prevProps) {
        if (!isNaN(this.props.value) &&
            !isNaN(prevProps.value) &&
            this.props.value !== prevProps.value) {
            var unit = this.getUnit();
            this.setState({ unit: unit });
        }
        if (this.props.unitOptions !== prevProps.unitOptions) {
            this.setState({ unitOptions: amisCore.normalizeOptions(this.props.unitOptions) });
        }
    };
    NumberControl.prototype.inputRef = function (ref) {
        this.input = ref;
    };
    NumberControl.prototype.focus = function () {
        if (!this.input) {
            return;
        }
        this.input.focus();
    };
    NumberControl.prototype.render = function () {
        var _a;
        var _this = this;
        var _b;
        var _c = this.props, className = _c.className, ns = _c.classPrefix, value = _c.value, step = _c.step, precision = _c.precision, max = _c.max, min = _c.min, disabled = _c.disabled, placeholder = _c.placeholder, showSteps = _c.showSteps, borderMode = _c.borderMode, suffix = _c.suffix, prefix = _c.prefix, kilobitSeparator = _c.kilobitSeparator, unitOptions = _c.unitOptions, readOnly = _c.readOnly, keyboard = _c.keyboard, displayMode = _c.displayMode;
        var finalPrecision = this.filterNum(precision);
        var unit = (_b = this.state) === null || _b === void 0 ? void 0 : _b.unit;
        // 数据格式化
        var formatter = function (value) {
            // 增加千分分隔
            if (kilobitSeparator && value) {
                value = (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            return (prefix ? prefix : '') + value + (suffix ? suffix : '');
        };
        // 将数字还原
        var parser = function (value) {
            if (value) {
                prefix && (value = value.replace(prefix, ''));
                suffix && (value = value.replace(suffix, ''));
                kilobitSeparator && (value = value.replace(/,/g, ''));
            }
            return value;
        };
        var finalValue = unit && value && typeof value === 'string'
            ? value.replace(unit, '')
            : value;
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "NumberControl"), (_a = {},
                _a["".concat(ns, "NumberControl--withUnit")] = unitOptions,
                _a), className) },
            React__default["default"].createElement(amisUi.NumberInput, { inputRef: this.inputRef, value: finalValue, step: step, max: this.filterNum(max), min: this.filterNum(min), formatter: formatter, parser: parser, onChange: this.handleChange, disabled: disabled, placeholder: placeholder, precision: finalPrecision, showSteps: showSteps, borderMode: borderMode, readOnly: readOnly, onFocus: function () { return _this.dispatchEvent('focus'); }, onBlur: function () { return _this.dispatchEvent('blur'); }, keyboard: keyboard, displayMode: displayMode }),
            unitOptions ? (React__default["default"].createElement(amisUi.Select, { value: unit, clearable: false, options: this.state.unitOptions || [], onChange: this.handleChangeUnit })) : null));
    };
    NumberControl.defaultProps = {
        step: 1,
        resetValue: ''
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", Promise)
    ], NumberControl.prototype, "dispatchEvent", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], NumberControl.prototype, "inputRef", null);
    return NumberControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(NumberControlRenderer, _super);
    function NumberControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberControlRenderer.defaultProps = tslib.__assign({ validations: 'isNumeric' }, NumberControl.defaultProps);
    NumberControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-number'
        })
    ], NumberControlRenderer);
    return NumberControlRenderer;
})(NumberControl));

exports["default"] = NumberControl;
