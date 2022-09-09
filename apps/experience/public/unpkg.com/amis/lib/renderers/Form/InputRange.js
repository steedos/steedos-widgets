/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var isNumber = require('lodash/isNumber');
var isObject = require('lodash/isObject');
var isEqual = require('lodash/isEqual');
var forEach = require('lodash/forEach');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var isNumber__default = /*#__PURE__*/_interopDefaultLegacy(isNumber);
var isObject__default = /*#__PURE__*/_interopDefaultLegacy(isObject);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
var forEach__default = /*#__PURE__*/_interopDefaultLegacy(forEach);

/**
 * 格式化初始value值
 * @param value 初始value值 Value
 * @param props RangeProps
 * @returns number | {min: number, max: number}
 */
function formatValue(value, props) {
    var _a;
    if (props.multiple) {
        var min = props.min, max = props.max;
        // value是字符串
        if (typeof value === 'string') {
            _a = value.split(props.delimiter || ',').map(function (v) { return Number(v); }), min = _a[0], max = _a[1];
        }
        // value是数组
        else if (Array.isArray(value)) {
            min = value[0], max = value[1];
        }
        // value是对象
        else if (typeof value === 'object') {
            min = value.min;
            max = value.max;
        }
        return {
            min: min === undefined || min < props.min ? props.min : min,
            max: max === undefined || max > props.max ? props.max : max
        };
    }
    return +value < props.min ? props.min : Math.min(+value, props.max);
}
/**
 * 输入框
 */
var Input = /** @class */ (function (_super) {
    tslib.__extends(Input, _super);
    function Input() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * onChange事件，只能输入数字
     * @param e React.ChangeEvent
     */
    Input.prototype.onChange = function (value) {
        var _a;
        var _b = this.props, multiple = _b.multiple, originValue = _b.value, type = _b.type, min = _b.min;
        var _value = this.getValue(value, type);
        this.props.updateValue(multiple
            ? tslib.__assign(tslib.__assign({}, originValue), (_a = {}, _a[type] = _value, _a)) : value !== null && value !== void 0 ? value : min);
    };
    /**
     * 双滑块 更新value
     * @param value 输入的value值
     */
    Input.prototype.onUpdateValue = function (value) {
        var _a;
        var _b = this.props, multiple = _b.multiple, originValue = _b.value, type = _b.type;
        var _value = this.getValue(value, type);
        this.props.updateValue(multiple ? tslib.__assign(tslib.__assign({}, originValue), (_a = {}, _a[type] = _value, _a)) : value);
    };
    Input.prototype.checkNum = function (value) {
        if (typeof value !== 'number') {
            value = amisCore.filter(value, this.props.data);
            value = /^[-]?\d+/.test(value) ? +value : undefined;
        }
        return value;
    };
    /**
     * 获取步长小数精度
     * @returns
     */
    Input.prototype.getStepPrecision = function () {
        var _a;
        var step = this.props.step;
        var stepIsDecimal = /^\d+\.\d+$/.test(step.toString());
        return !stepIsDecimal || step < 0
            ? 0
            : (_a = step.toString().split('.')[1]) === null || _a === void 0 ? void 0 : _a.length;
    };
    /**
     * 处理数据
     * @param value input数据
     * @param type min | max 双滑块
     * @returns 处理之后数据
     */
    Input.prototype.getValue = function (value, type) {
        var _a = this.props, max = _a.max, min = _a.min, step = _a.step, stateValue = _a.value;
        // value为null、undefined时，取对应的min/max
        value = value !== null && value !== void 0 ? value : (type === 'min' ? min : max);
        // 校正value为step的倍数
        var _value = Math.round(parseFloat(value + '') / step) * step;
        // 同步value与步长小数位数
        _value = parseFloat(_value.toFixed(this.getStepPrecision()));
        // 单滑块只用考虑 轨道边界 ，双滑块需要考虑 两端滑块边界
        switch (type) {
            case 'min': {
                if (isObject__default["default"](stateValue) && isNumber__default["default"](stateValue.max)) {
                    // 如果 大于当前双滑块最大值 取 当前双滑块max值 - 步长
                    if (_value >= stateValue.max) {
                        return stateValue.max - step;
                    }
                    return _value;
                }
                return min;
            }
            case 'max':
                if (isObject__default["default"](stateValue) && isNumber__default["default"](stateValue.min)) {
                    // 如果 小于当前双滑块最大值 取 当前双滑块min值 + 步长
                    if (_value <= stateValue.min) {
                        return stateValue.min + step;
                    }
                    return _value;
                }
                return max;
            default:
                // 轨道边界
                return (_value < min && min) || (_value > max && max) || _value;
        }
    };
    /**
     * 失焦事件
     */
    Input.prototype.onBlur = function () {
        var _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent, value = _a.value;
        dispatchEvent('blur', amisCore.createObject(data, {
            value: value
        }));
    };
    /**
     * 聚焦事件
     */
    Input.prototype.onFocus = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, data, dispatchEvent, value;
            return tslib.__generator(this, function (_b) {
                _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent, value = _a.value;
                dispatchEvent('focus', amisCore.createObject(data, {
                    value: value
                }));
                return [2 /*return*/];
            });
        });
    };
    Input.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, value = _a.value, multiple = _a.multiple, type = _a.type, step = _a.step, ns = _a.classPrefix, disabled = _a.disabled, max = _a.max, min = _a.min;
        var _value = multiple
            ? type === 'min'
                ? Math.min(value.min, value.max)
                : Math.max(value.min, value.max)
            : value;
        return (React__default["default"].createElement("div", { className: cx("".concat(ns, "InputRange-input")) },
            React__default["default"].createElement(amisUi.NumberInput, { value: +_value, step: step, max: this.checkNum(max), min: this.checkNum(min), onChange: this.onChange, disabled: disabled, onBlur: this.onBlur, onFocus: this.onFocus })));
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", void 0)
    ], Input.prototype, "onChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", void 0)
    ], Input.prototype, "onUpdateValue", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Input.prototype, "onBlur", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", Promise)
    ], Input.prototype, "onFocus", null);
    return Input;
}(React__default["default"].Component));
var RangeControl = /** @class */ (function (_super) {
    tslib.__extends(RangeControl, _super);
    function RangeControl(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, propsValue = _a.value, multiple = _a.multiple, delimiter = _a.delimiter, min = _a.min, max = _a.max;
        var value = formatValue(propsValue, {
            multiple: multiple,
            delimiter: delimiter,
            min: min,
            max: max
        });
        _this.state = {
            value: _this.getValue(value)
        };
        return _this;
    }
    RangeControl.prototype.componentDidUpdate = function (prevProps) {
        var value = prevProps.value, min = prevProps.min, max = prevProps.max;
        var _a = this.props, nextPropsValue = _a.value, multiple = _a.multiple, delimiter = _a.delimiter, nextPropsMin = _a.min, nextPropsMax = _a.max; _a.onChange;
        if (value !== nextPropsValue ||
            min !== nextPropsMin ||
            max !== nextPropsMax) {
            var value_1 = formatValue(nextPropsValue, {
                multiple: multiple,
                delimiter: delimiter,
                min: nextPropsMin,
                max: nextPropsMax
            });
            this.setState({
                value: this.getValue(value_1)
            });
        }
    };
    RangeControl.prototype.doAction = function (action, data, throwErrors) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props; _a.multiple; _a.min; _a.max;
        if (!!~['clear', 'reset'].indexOf(actionType)) {
            this.clearValue(actionType);
        }
    };
    RangeControl.prototype.clearValue = function (type) {
        if (type === void 0) { type = 'clear'; }
        var _a = this.props, multiple = _a.multiple, min = _a.min, max = _a.max, onChange = _a.onChange;
        var resetValue = this.props.resetValue;
        if (type === 'clear') {
            resetValue = undefined;
        }
        var value = this.getFormatValue(resetValue !== null && resetValue !== void 0 ? resetValue : (multiple ? { min: min, max: max } : min));
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    RangeControl.prototype.getValue = function (value) {
        var multiple = this.props.multiple;
        return multiple
            ? {
                max: amisCore.stripNumber(value.max),
                min: amisCore.stripNumber(value.min)
            }
            : amisCore.stripNumber(value);
    };
    /**
     * 所有触发value变换 -> updateValue
     * @param value
     */
    RangeControl.prototype.updateValue = function (value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onChange, data, dispatchEvent, result, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setState({ value: this.getValue(value) });
                        _a = this.props, onChange = _a.onChange, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        result = this.getFormatValue(value);
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                value: result
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange === null || onChange === void 0 ? void 0 : onChange(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 鼠标松开事件
     */
    RangeControl.prototype.onAfterChange = function () {
        var value = this.state.value;
        var _a = this.props, onAfterChange = _a.onAfterChange; _a.dispatchEvent; _a.data;
        var result = this.getFormatValue(value);
        onAfterChange && onAfterChange(result);
    };
    /**
     * 获取导出格式数据
     */
    RangeControl.prototype.getFormatValue = function (value) {
        var _a = this.props, multiple = _a.multiple, joinValues = _a.joinValues, delimiter = _a.delimiter;
        return multiple
            ? joinValues
                ? [value.min, value.max].join(delimiter || ',')
                : {
                    min: value.min,
                    max: value.max
                }
            : value;
    };
    RangeControl.prototype.render = function () {
        var _this = this;
        var value = this.state.value;
        var props = tslib.__assign(tslib.__assign({}, this.props), { value: value, updateValue: this.updateValue, onAfterChange: this.onAfterChange });
        var ns = props.classPrefix, multiple = props.multiple; props.parts; var showInput = props.showInput, cx = props.classnames, className = props.className, disabled = props.disabled, clearable = props.clearable, min = props.min, max = props.max, render = props.render, marks = props.marks, region = props.region;
        // 处理自定义json配置
        var renderMarks = marks ? tslib.__assign({}, marks) : marks;
        marks &&
            forEach__default["default"](marks, function (item, key) {
                if (isObject__default["default"](item) && item.type) {
                    renderMarks &&
                        (renderMarks[key] = render(region, item));
                }
            });
        return (React__default["default"].createElement("div", { className: cx('RangeControl', "".concat(ns, "InputRange"), { 'is-disabled': disabled }, className) },
            showInput && multiple && React__default["default"].createElement(Input, tslib.__assign({}, props, { type: "min" })),
            React__default["default"].createElement(amisUi.Range, tslib.__assign({}, props, { marks: renderMarks })),
            showInput && React__default["default"].createElement(Input, tslib.__assign({}, props, { type: "max" })),
            clearable && !disabled && showInput ? (React__default["default"].createElement("a", { onClick: function () { return _this.clearValue(); }, className: cx('InputRange-clear', {
                    'is-active': multiple
                        ? isEqual__default["default"](this.state.value, { min: min, max: max })
                        : this.state.value !== min
                }) },
                React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" }))) : null));
    };
    RangeControl.defaultProps = {
        value: 0,
        max: 100,
        min: 0,
        step: 1,
        unit: '',
        clearable: true,
        disabled: false,
        showInput: false,
        multiple: false,
        joinValues: true,
        delimiter: ',',
        showSteps: false,
        parts: 1,
        tooltipPlacement: 'auto'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], RangeControl.prototype, "clearValue", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], RangeControl.prototype, "getValue", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], RangeControl.prototype, "updateValue", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], RangeControl.prototype, "onAfterChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], RangeControl.prototype, "getFormatValue", null);
    return RangeControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(RangeControlRenderer, _super);
    function RangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-range'
        })
    ], RangeControlRenderer);
    return RangeControlRenderer;
})(RangeControl));

exports.Input = Input;
exports["default"] = RangeControl;
exports.formatValue = formatValue;
