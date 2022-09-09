/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var cx = require('classnames');
var matchSorter = require('match-sorter');
var keycode = require('keycode');
var Downshift = require('downshift');
var amisCore = require('amis-core');
var IconPickerIcons = require('./IconPickerIcons.js');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);
var keycode__default = /*#__PURE__*/_interopDefaultLegacy(keycode);
var Downshift__default = /*#__PURE__*/_interopDefaultLegacy(Downshift);

var IconPickerControl = /** @class */ (function (_super) {
    tslib.__extends(IconPickerControl, _super);
    function IconPickerControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpen: false,
            inputValue: '',
            isFocused: false,
            vendorIndex: 0
        };
        return _this;
    }
    IconPickerControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                inputValue: ''
            });
        }
    };
    IconPickerControl.prototype.changeVendor = function (index) {
        this.setState({
            vendorIndex: index
        }, this.formatOptions);
    };
    IconPickerControl.prototype.formatOptions = function () {
        var vendorIndex = this.state.vendorIndex || 0;
        var _a = IconPickerIcons.ICONS[vendorIndex], prefix = _a.prefix, icons = _a.icons;
        return icons.map(function (icon) { return ({
            label: prefix + icon,
            value: prefix + icon
        }); });
    };
    IconPickerControl.prototype.getVendors = function () {
        return IconPickerIcons.ICONS.map(function (icons) { return icons.name; });
    };
    IconPickerControl.prototype.inputRef = function (ref) {
        this.input = ref;
    };
    IconPickerControl.prototype.focus = function () {
        if (!this.input) {
            return;
        }
        this.input.focus();
        var len = this.input.value.length;
        len && this.input.setSelectionRange(len, len);
    };
    IconPickerControl.prototype.handleClick = function () {
        if (this.props.disabled) {
            return;
        }
        this.focus();
        this.setState({
            isOpen: true
        });
    };
    IconPickerControl.prototype.handleFocus = function (e) {
        this.setState({
            isOpen: true,
            isFocused: true
        });
        this.props.onFocus && this.props.onFocus(e);
    };
    IconPickerControl.prototype.handleBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, trimContents = _a.trimContents, value = _a.value, onChange = _a.onChange;
        this.setState({
            isFocused: false
        }, function () {
            if (trimContents && value && typeof value === 'string') {
                onChange(value.trim());
            }
        });
        onBlur && onBlur(e);
    };
    IconPickerControl.prototype.handleInputChange = function (evt) {
        var value = evt.currentTarget.value;
        this.setState({
            inputValue: value
        });
    };
    IconPickerControl.prototype.handleKeyDown = function (evt) {
        var code = keycode__default["default"](evt.keyCode);
        if (code !== 'backspace') {
            return;
        }
        var onChange = this.props.onChange;
        if (!this.state.inputValue) {
            onChange('');
            this.setState({
                inputValue: ''
            });
        }
    };
    IconPickerControl.prototype.handleChange = function (value) {
        var _a = this.props, onChange = _a.onChange, disabled = _a.disabled;
        if (disabled) {
            return;
        }
        onChange(value);
        this.setState({
            isFocused: false,
            inputValue: ''
        });
    };
    IconPickerControl.prototype.handleStateChange = function (changes) {
        switch (changes.type) {
            case Downshift__default["default"].stateChangeTypes.itemMouseEnter:
            case Downshift__default["default"].stateChangeTypes.changeInput:
                this.setState({
                    isOpen: true
                });
                break;
            default:
                var state = {};
                if (typeof changes.isOpen !== 'undefined') {
                    state.isOpen = changes.isOpen;
                }
                if (this.state.isOpen && changes.isOpen === false) {
                    state.inputValue = '';
                }
                this.setState(state);
                break;
        }
    };
    IconPickerControl.prototype.handleClear = function () {
        var _this = this;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange === null || onChange === void 0 ? void 0 : onChange(resetValue);
        this.setState({
            inputValue: resetValue,
            isFocused: true
        }, function () {
            _this.focus();
        });
    };
    IconPickerControl.prototype.renderFontIcons = function () {
        var _this = this;
        var _a = this.props, className = _a.className, inputOnly = _a.inputOnly, placeholder = _a.placeholder, cx = _a.classnames, name = _a.name, value = _a.value, noDataTip = _a.noDataTip, disabled = _a.disabled, clearable = _a.clearable, __ = _a.translate;
        var options = this.formatOptions();
        var vendors = this.getVendors();
        return (React__default["default"].createElement(Downshift__default["default"], { isOpen: this.state.isOpen, inputValue: this.state.inputValue, onChange: this.handleChange, onOuterClick: this.handleBlur, onStateChange: this.handleStateChange, selectedItem: [value] }, function (_a) {
            var getInputProps = _a.getInputProps, getItemProps = _a.getItemProps, isOpen = _a.isOpen, inputValue = _a.inputValue;
            var filteredOptions = inputValue && isOpen
                ? matchSorter.matchSorter(options, inputValue, { keys: ['label', 'value'] })
                : options;
            return (React__default["default"].createElement("div", { className: cx("IconPickerControl-input IconPickerControl-input--withAC", inputOnly ? className : '', {
                    'is-opened': isOpen
                }), onClick: _this.handleClick },
                React__default["default"].createElement("div", { className: cx('IconPickerControl-valueWrap') },
                    placeholder && !value && !_this.state.inputValue ? (React__default["default"].createElement("div", { className: cx('IconPickerControl-placeholder') }, placeholder)) : null,
                    !value || (inputValue && isOpen) ? null : (React__default["default"].createElement("div", { className: cx('IconPickerControl-value') },
                        React__default["default"].createElement("i", { className: cx(value) }),
                        value)),
                    React__default["default"].createElement("input", tslib.__assign({}, getInputProps({
                        name: name,
                        ref: _this.inputRef,
                        onFocus: _this.handleFocus,
                        onChange: _this.handleInputChange,
                        onKeyDown: _this.handleKeyDown,
                        value: _this.state.inputValue
                    }), { autoComplete: "off", disabled: disabled, size: 10 })),
                    clearable && !disabled && value ? (React__default["default"].createElement("a", { onClick: _this.handleClear, className: cx('IconPickerControl-clear') },
                        React__default["default"].createElement(amisUi.Icon, { icon: "input-clear", className: "icon" }))) : null),
                isOpen ? (React__default["default"].createElement("div", { className: cx('IconPickerControl-sugsPanel') },
                    vendors.length > 1 ? (React__default["default"].createElement("div", { className: cx('IconPickerControl-tabs') }, vendors.map(function (vendor, index) { return (React__default["default"].createElement("div", { className: cx('IconPickerControl-tab', {
                            active: _this.state.vendorIndex === index
                        }), onClick: function () { return _this.changeVendor(index); }, key: index }, vendor)); }))) : null,
                    filteredOptions.length ? (React__default["default"].createElement("div", { className: cx('IconPickerControl-sugs', vendors.length > 1
                            ? 'IconPickerControl-multiVendor'
                            : 'IconPickerControl-singleVendor') }, filteredOptions.map(function (option, index) { return (React__default["default"].createElement("div", tslib.__assign({}, getItemProps({
                        item: option.value,
                        className: cx("IconPickerControl-sugItem", {
                            'is-active': value === option.value
                        })
                    }), { key: index }),
                        React__default["default"].createElement("i", { className: cx("".concat(option.value)), title: "".concat(option.value) }))); }))) : (React__default["default"].createElement("div", { className: cx(vendors.length > 1
                            ? 'IconPickerControl-multiVendor'
                            : 'IconPickerControl-singleVendor') }, __(noDataTip))))) : null));
        }));
    };
    IconPickerControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, inputOnly = _a.inputOnly, disabled = _a.disabled;
        var input = this.renderFontIcons();
        if (inputOnly) {
            return input;
        }
        return (React__default["default"].createElement("div", { className: cx__default["default"](className, "".concat(ns, "IconPickerControl"), {
                'is-focused': this.state.isFocused,
                'is-disabled': disabled
            }) }, input));
    };
    IconPickerControl.defaultProps = {
        resetValue: '',
        placeholder: '',
        noDataTip: 'placeholder.noData'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "changeVendor", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "formatOptions", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "getVendors", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "inputRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "focus", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleFocus", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleBlur", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleInputChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleKeyDown", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleStateChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], IconPickerControl.prototype, "handleClear", null);
    return IconPickerControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(IconPickerControlRenderer, _super);
    function IconPickerControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconPickerControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'icon-picker'
        })
    ], IconPickerControlRenderer);
    return IconPickerControlRenderer;
})(IconPickerControl));

exports["default"] = IconPickerControl;
