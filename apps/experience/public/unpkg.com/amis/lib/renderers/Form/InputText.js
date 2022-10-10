/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var Downshift = require('downshift');
var matchSorter = require('match-sorter');
var debouce = require('lodash/debounce');
var find = require('lodash/find');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Downshift__default = /*#__PURE__*/_interopDefaultLegacy(Downshift);
var debouce__default = /*#__PURE__*/_interopDefaultLegacy(debouce);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var TextControl = /** @class */ (function (_super) {
    tslib.__extends(TextControl, _super);
    function TextControl(props) {
        var _this = _super.call(this, props) || this;
        var value = props.value;
        _this.state = {
            isOpen: false,
            inputValue: props.multiple || props.creatable === false
                ? ''
                : _this.valueToString(value),
            isFocused: false,
            revealPassword: false
        };
        _this.focus = _this.focus.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.toggleRevealPassword = _this.toggleRevealPassword.bind(_this);
        _this.inputRef = _this.inputRef.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);
        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleStateChange = _this.handleStateChange.bind(_this);
        _this.loadAutoComplete = debouce__default["default"](_this.loadAutoComplete.bind(_this), 250, {
            trailing: true,
            leading: false
        });
        return _this;
    }
    TextControl.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, formItem = _a.formItem, autoComplete = _a.autoComplete, addHook = _a.addHook, formInited = _a.formInited, data = _a.data, name = _a.name;
        if (amisCore.isEffectiveApi(autoComplete, data) && formItem) {
            if (formInited) {
                formItem.loadOptions(autoComplete, amisCore.createObject(data, {
                    term: ''
                }));
            }
            else if (addHook) {
                this.unHook = addHook(function (data) { return tslib.__awaiter(_this, void 0, void 0, function () {
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, formItem.loadOptions(autoComplete, amisCore.createObject(data, {
                                    term: ''
                                }))];
                            case 1:
                                _a.sent();
                                if (formItem.value) {
                                    amisCore.setVariable(data, name, formItem.value);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }, 'init');
            }
        }
    };
    TextControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                inputValue: props.multiple || props.creatable === false
                    ? ''
                    : this.valueToString(props.value)
            });
        }
        if (prevProps.revealPassword !== props.revealPassword) {
            /** 隐藏按钮的同时将密码设置为隐藏态 */
            !props.revealPassword && this.setState({ revealPassword: false });
        }
    };
    TextControl.prototype.componentWillUnmount = function () {
        this.unHook && this.unHook();
    };
    TextControl.prototype.inputRef = function (ref) {
        this.input = ref;
    };
    TextControl.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (!!~['clear', 'reset'].indexOf(actionType)) {
            this.clearValue();
        }
        else if (actionType === 'focus') {
            this.focus();
        }
    };
    TextControl.prototype.focus = function () {
        if (!this.input) {
            return;
        }
        this.input.focus();
        // 光标放到最后
        var len = this.input.value.length;
        if (len) {
            // type为email的input元素不支持setSelectionRange，先改为text
            if (this.input.type === 'email') {
                this.input.type = 'text';
                this.input.setSelectionRange(len, len);
                this.input.type = 'email';
            }
            else {
                this.input.setSelectionRange(len, len);
            }
        }
    };
    TextControl.prototype.clearValue = function () {
        var _this = this;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange(resetValue);
        this.setState({
            inputValue: resetValue
        }, function () {
            _this.focus();
            _this.loadAutoComplete();
        });
    };
    TextControl.prototype.removeItem = function (index) {
        var _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange;
        var newValue = selectedOptions.concat();
        newValue.splice(index, 1);
        onChange(this.normalizeValue(newValue));
    };
    TextControl.prototype.handleClick = function () {
        // 已经 focus 的就不重复执行，否则总重新定位光标
        this.state.isFocused || this.focus();
        this.setState({
            isOpen: true
        });
    };
    TextControl.prototype.handleFocus = function (e) {
        this.setState({
            isOpen: true,
            isFocused: true
        });
        this.props.onFocus && this.props.onFocus(e);
    };
    TextControl.prototype.handleBlur = function (e) {
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
    TextControl.prototype.handleInputChange = function (evt) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var value, _a, creatable, multiple, onChange, dispatcher;
            var _this = this;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        value = this.transformValue(evt.currentTarget.value);
                        _a = this.props, creatable = _a.creatable, multiple = _a.multiple, onChange = _a.onChange;
                        return [4 /*yield*/, amisCore.rendererEventDispatcher(this.props, 'change', { value: value })];
                    case 1:
                        dispatcher = _b.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            inputValue: value
                        }, function () {
                            if (creatable !== false && !multiple) {
                                onChange === null || onChange === void 0 ? void 0 : onChange(value);
                            }
                            _this.loadAutoComplete();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TextControl.prototype.handleKeyDown = function (evt) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, selectedOptions, onChange, multiple, creatable, newValue, value_1, newValue, dispatcher;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange, multiple = _a.multiple, creatable = _a.creatable;
                        if (!(selectedOptions.length && !this.state.inputValue && evt.keyCode === 8)) return [3 /*break*/, 1];
                        evt.preventDefault();
                        newValue = selectedOptions.concat();
                        newValue.pop();
                        onChange(this.normalizeValue(newValue));
                        this.setState({
                            inputValue: ''
                        }, this.loadAutoComplete);
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(evt.key === 'Enter' &&
                            this.state.inputValue &&
                            typeof this.highlightedIndex !== 'number' &&
                            creatable !== false)) return [3 /*break*/, 3];
                        evt.preventDefault();
                        value_1 = this.state.inputValue;
                        if (multiple &&
                            value_1 &&
                            !find__default["default"](selectedOptions, function (item) { return item.value == value_1; })) {
                            newValue = selectedOptions.concat();
                            newValue.push({
                                label: value_1,
                                value: value_1
                            });
                            value_1 = this.normalizeValue(newValue).concat();
                        }
                        return [4 /*yield*/, amisCore.rendererEventDispatcher(this.props, 'enter', { value: value_1 })];
                    case 2:
                        dispatcher = _b.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(value_1);
                        this.setState({
                            inputValue: '',
                            isOpen: false
                        }, this.loadAutoComplete);
                        return [3 /*break*/, 4];
                    case 3:
                        if (evt.key === 'Enter' &&
                            this.state.isOpen &&
                            typeof this.highlightedIndex !== 'number') {
                            this.setState({
                                isOpen: false
                            });
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TextControl.prototype.handleChange = function (value) {
        var _a = this.props, onChange = _a.onChange, multiple = _a.multiple, options = _a.options, selectedOptions = _a.selectedOptions, creatable = _a.creatable, valueField = _a.valueField;
        // Downshift传入的selectedItem是valueField字段，需要取回选项
        var toggledOption = options.find(function (item) { return item[valueField || 'value'] === value; });
        if (multiple) {
            var newValue = selectedOptions.concat();
            toggledOption && newValue.push(toggledOption);
            onChange(this.normalizeValue(newValue));
        }
        else {
            onChange(toggledOption ? this.normalizeValue(toggledOption) : value);
        }
        if (multiple || creatable === false) {
            this.setState({
                inputValue: ''
            }, this.loadAutoComplete);
        }
    };
    TextControl.prototype.handleStateChange = function (changes) {
        var creatable = this.props.creatable;
        var multiple = this.props.multiple || this.props.multi;
        switch (changes.type) {
            case Downshift__default["default"].stateChangeTypes.itemMouseEnter:
                this.setState({
                    isOpen: true
                });
                break;
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
                if (typeof changes.highlightedIndex !== 'undefined') {
                    this.highlightedIndex = changes.highlightedIndex;
                }
                // 输入框清空
                if (!multiple &&
                    creatable === false &&
                    this.state.isOpen &&
                    changes.isOpen === false) {
                    state.inputValue = '';
                }
                this.setState(state);
                break;
        }
    };
    TextControl.prototype.handleNormalInputChange = function (e) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var onChange, value, dispatcher;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = this.props.onChange;
                        value = e.currentTarget.value;
                        return [4 /*yield*/, amisCore.rendererEventDispatcher(this.props, 'change', { value: this.transformValue(value) })];
                    case 1:
                        dispatcher = _a.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(this.transformValue(value));
                        return [2 /*return*/];
                }
            });
        });
    };
    TextControl.prototype.normalizeValue = function (value) {
        var _a = this.props, multiple = _a.multiple, delimiter = _a.delimiter, joinValues = _a.joinValues, extractValue = _a.extractValue, valueField = _a.valueField;
        var selectedOptions = Array.isArray(value) ? value : value ? [value] : [];
        if (joinValues) {
            return selectedOptions
                .map(function (item) { return item[valueField || 'value']; })
                .join(delimiter || ',');
        }
        else if (extractValue) {
            var mappedValue = selectedOptions.map(function (item) { return item[valueField || 'value']; });
            return multiple ? mappedValue : mappedValue[0];
        }
        else {
            return multiple ? selectedOptions : selectedOptions[0];
        }
    };
    TextControl.prototype.transformValue = function (value) {
        var transform = this.props.transform;
        if (!transform) {
            return value;
        }
        Object.keys(transform).forEach(function (key) {
            var propValue = transform[key];
            switch (key) {
                case 'lowerCase':
                    propValue && (value = value.toLowerCase());
                    break;
                case 'upperCase':
                    propValue && (value = value.toUpperCase());
                    break;
            }
        });
        return value;
    };
    TextControl.prototype.loadAutoComplete = function () {
        var _a = this.props, formItem = _a.formItem, autoComplete = _a.autoComplete, data = _a.data;
        if (amisCore.isEffectiveApi(autoComplete, data) && formItem) {
            formItem.loadOptions(autoComplete, amisCore.createObject(data, {
                term: this.state.inputValue || '' // (multiple ? '' : selectedOptions[selectedOptions.length - 1]?.value)
            }), {
                extendsOptions: true
            });
        }
    };
    TextControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    TextControl.prototype.valueToString = function (value) {
        return typeof value === 'undefined' || value === null
            ? ''
            : typeof value === 'string'
                ? value
                : value instanceof Date
                    ? value.toISOString()
                    : JSON.stringify(value);
    };
    TextControl.prototype.renderSugestMode = function () {
        var _this = this;
        var _a;
        var _b = this.props, className = _b.className, inputControlClassName = _b.inputControlClassName, nativeInputClassName = _b.nativeInputClassName, inputOnly = _b.inputOnly, value = _b.value, placeholder = _b.placeholder, cx = _b.classnames, disabled = _b.disabled, readOnly = _b.readOnly, name = _b.name, loading = _b.loading, clearable = _b.clearable, options = _b.options, selectedOptions = _b.selectedOptions, autoComplete = _b.autoComplete, labelField = _b.labelField, valueField = _b.valueField, multiple = _b.multiple, creatable = _b.creatable, borderMode = _b.borderMode, showCounter = _b.showCounter, maxLength = _b.maxLength, minLength = _b.minLength, __ = _b.translate;
        var type = (_a = this.props.type) === null || _a === void 0 ? void 0 : _a.replace(/^(?:native|input)\-/, '');
        return (React__default["default"].createElement(Downshift__default["default"], { isOpen: this.state.isOpen && !disabled && !readOnly, inputValue: this.state.inputValue, onChange: this.handleChange, onStateChange: this.handleStateChange, selectedItem: selectedOptions.map(function (item) { return item[valueField || 'value']; }) }, function (_a) {
            var _b, _c;
            var _d;
            var getInputProps = _a.getInputProps, getItemProps = _a.getItemProps, isOpen = _a.isOpen, inputValue = _a.inputValue, selectedItem = _a.selectedItem, highlightedIndex = _a.highlightedIndex;
            var filtedOptions = inputValue && isOpen && !autoComplete
                ? matchSorter.matchSorter(options, inputValue, {
                    keys: [labelField || 'label', valueField || 'value']
                })
                : options;
            var indices = isOpen
                ? mapItemIndex(filtedOptions, selectedItem)
                : {};
            filtedOptions = filtedOptions.filter(function (option) { return !~selectedItem.indexOf(option.value); });
            if (_this.state.inputValue &&
                creatable !== false &&
                multiple &&
                !filtedOptions.some(function (option) { return option.value === _this.state.inputValue; })) {
                filtedOptions.push((_b = {},
                    _b[labelField || 'label'] = _this.state.inputValue,
                    _b[valueField || 'value'] = _this.state.inputValue,
                    _b.isNew = true,
                    _b));
            }
            return (React__default["default"].createElement("div", { className: cx("TextControl-input TextControl-input--withAC", inputControlClassName, inputOnly ? className : '', (_c = {
                        'is-opened': isOpen,
                        'TextControl-input--multiple': multiple
                    },
                    _c["TextControl-input--border".concat(amisCore.ucFirst(borderMode))] = borderMode,
                    _c)), onClick: _this.handleClick },
                React__default["default"].createElement(React__default["default"].Fragment, null,
                    placeholder &&
                        !selectedOptions.length &&
                        !_this.state.inputValue &&
                        !_this.state.isFocused ? (React__default["default"].createElement("div", { className: cx('TextControl-placeholder') }, placeholder)) : null,
                    selectedOptions.map(function (item, index) {
                        return multiple ? (React__default["default"].createElement("div", { className: cx('TextControl-value'), key: index },
                            React__default["default"].createElement("span", { className: cx('TextControl-valueLabel') }, "".concat(item[labelField || 'label'])),
                            React__default["default"].createElement(amisUi.Icon, { icon: "close", className: cx('TextControl-valueIcon', 'icon'), onClick: _this.removeItem.bind(_this, index) }))) : (inputValue && isOpen) || creatable !== false ? null : (React__default["default"].createElement("div", { className: cx('TextControl-value'), key: index }, item.label));
                    }),
                    React__default["default"].createElement(amisUi.Input, tslib.__assign({}, getInputProps({
                        name: name,
                        ref: _this.inputRef,
                        disabled: disabled,
                        readOnly: readOnly,
                        type: type,
                        onFocus: _this.handleFocus,
                        onBlur: _this.handleBlur,
                        onChange: _this.handleInputChange,
                        onKeyDown: _this.handleKeyDown,
                        maxLength: maxLength,
                        minLength: minLength
                    }), { autoComplete: "off", size: 10, className: cx(nativeInputClassName) }))),
                clearable && !disabled && !readOnly && value ? (React__default["default"].createElement("a", { onClick: _this.clearValue, className: cx('TextControl-clear') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "input-clear", className: "icon" }))) : null,
                showCounter ? (React__default["default"].createElement("span", { className: cx('TextControl-counter') }, "".concat((_d = _this.valueToString(value)) === null || _d === void 0 ? void 0 : _d.length).concat(typeof maxLength === 'number' && maxLength
                    ? "/".concat(maxLength)
                    : ''))) : null,
                loading ? (React__default["default"].createElement(amisUi.Spinner, { show: true, icon: "reload", size: "sm", spinnerClassName: cx('TextControl-spinner') })) : null,
                isOpen && filtedOptions.length ? (React__default["default"].createElement("div", { className: cx('TextControl-sugs') }, filtedOptions.map(function (option) {
                    var label = option[labelField || 'label'];
                    var value = option[valueField || 'value'];
                    return (React__default["default"].createElement("div", tslib.__assign({}, getItemProps({
                        item: value,
                        disabled: option.disabled,
                        className: cx("TextControl-sugItem", {
                            'is-highlight': highlightedIndex === indices[value],
                            'is-disabled': option.disabled
                        })
                    }), { key: value }), option.isNew ? (React__default["default"].createElement("span", null,
                        __('Text.add', { label: label }),
                        React__default["default"].createElement(amisUi.Icon, { icon: "enter", className: "icon" }))) : (React__default["default"].createElement("span", null,
                        option.disabled
                            ? label
                            : amisCore.highlight(label, inputValue),
                        option.tip))));
                }))) : null));
        }));
    };
    TextControl.prototype.toggleRevealPassword = function () {
        this.setState({ revealPassword: !this.state.revealPassword });
    };
    TextControl.prototype.renderNormal = function () {
        var _a;
        var _b, _c;
        var _d = this.props, ns = _d.classPrefix, cx = _d.classnames, className = _d.className, inputControlClassName = _d.inputControlClassName, nativeInputClassName = _d.nativeInputClassName, inputOnly = _d.inputOnly, value = _d.value, placeholder = _d.placeholder; _d.onChange; var disabled = _d.disabled, readOnly = _d.readOnly, max = _d.max, min = _d.min, step = _d.step, clearable = _d.clearable, _e = _d.revealPassword, revealPassword = _e === void 0 ? true : _e, name = _d.name, borderMode = _d.borderMode, prefix = _d.prefix, suffix = _d.suffix, data = _d.data, showCounter = _d.showCounter, maxLength = _d.maxLength, minLength = _d.minLength;
        var type = (_b = this.props.type) === null || _b === void 0 ? void 0 : _b.replace(/^(?:native|input)\-/, '');
        return (React__default["default"].createElement("div", { className: cx('TextControl-input', (_a = {},
                _a["TextControl-input--border".concat(amisCore.ucFirst(borderMode))] = borderMode,
                _a), inputControlClassName, inputOnly ? className : '') },
            prefix ? (React__default["default"].createElement("span", { className: cx('TextControl-inputPrefix') }, amisCore.filter(prefix, data))) : null,
            React__default["default"].createElement(amisUi.Input, { name: name, placeholder: placeholder, ref: this.inputRef, disabled: disabled, readOnly: readOnly, type: this.state.revealPassword ? 'text' : type, onFocus: this.handleFocus, onBlur: this.handleBlur, max: max, min: min, maxLength: maxLength, minLength: minLength, autoComplete: "off", size: 10, step: step, onChange: this.handleNormalInputChange, value: this.valueToString(value), className: cx(nativeInputClassName, {
                    'TextControl-input-password': type === 'password' && revealPassword
                }) }),
            clearable && !disabled && !readOnly && value ? (React__default["default"].createElement("a", { onClick: this.clearValue, className: "".concat(ns, "TextControl-clear") },
                React__default["default"].createElement(amisUi.Icon, { icon: "input-clear", className: "icon" }))) : null,
            type === 'password' && revealPassword && !disabled ? (React__default["default"].createElement("a", { onClick: this.toggleRevealPassword, className: "".concat(ns, "TextControl-revealPassword") }, this.state.revealPassword ? (React__default["default"].createElement(amisUi.Icon, { icon: "view", className: "icon" })) : (React__default["default"].createElement(amisUi.Icon, { icon: "invisible", className: "icon" })))) : null,
            showCounter ? (React__default["default"].createElement("span", { className: cx('TextControl-counter') }, "".concat((_c = this.valueToString(value)) === null || _c === void 0 ? void 0 : _c.length).concat(typeof maxLength === 'number' && maxLength ? "/".concat(maxLength) : ''))) : null,
            suffix ? (React__default["default"].createElement("span", { className: cx('TextControl-inputSuffix') }, amisCore.filter(suffix, data))) : null));
    };
    TextControl.prototype.render = function () {
        var _a;
        var _b = this.props, cx = _b.classnames, className = _b.className, ns = _b.classPrefix, options = _b.options, source = _b.source, autoComplete = _b.autoComplete, addOnRaw = _b.addOn, render = _b.render, data = _b.data, disabled = _b.disabled, inputOnly = _b.inputOnly;
        var addOn = typeof addOnRaw === 'string'
            ? {
                label: addOnRaw,
                type: 'plain'
            }
            : addOnRaw;
        var input = autoComplete !== false && (source || options.length || autoComplete)
            ? this.renderSugestMode()
            : this.renderNormal();
        var iconElement = amisCore.generateIcon(cx, addOn === null || addOn === void 0 ? void 0 : addOn.icon, 'Icon');
        var addOnDom = addOn ? (addOn.actionType ||
            ~['button', 'submit', 'reset', 'action'].indexOf(addOn.type) ? (React__default["default"].createElement("div", { className: cx("".concat(ns, "TextControl-button"), addOn.className) }, render('addOn', addOn, {
            disabled: disabled
        }))) : (React__default["default"].createElement("div", { className: cx("".concat(ns, "TextControl-addOn"), addOn.className) },
            iconElement,
            addOn.label ? amisCore.filter(addOn.label, data) : null))) : null;
        if (inputOnly) {
            return input;
        }
        return (React__default["default"].createElement("div", { className: cx(className, "".concat(ns, "TextControl"), (_a = {},
                _a["".concat(ns, "TextControl--withAddOn")] = !!addOnDom,
                _a['is-focused'] = this.state.isFocused,
                _a['is-disabled'] = disabled,
                _a)) },
            addOn && addOn.position === 'left' ? addOnDom : null,
            input,
            addOn && addOn.position !== 'left' ? addOnDom : null));
    };
    TextControl.defaultProps = {
        resetValue: '',
        labelField: 'label',
        valueField: 'value',
        placeholder: '',
        allowInputText: true,
        trimContents: true
    };
    tslib.__decorate([
        amisCore.bindRendererEvent('click'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], TextControl.prototype, "handleClick", null);
    tslib.__decorate([
        amisCore.bindRendererEvent('focus'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TextControl.prototype, "handleFocus", null);
    tslib.__decorate([
        amisCore.bindRendererEvent('blur'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TextControl.prototype, "handleBlur", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], TextControl.prototype, "handleNormalInputChange", null);
    return TextControl;
}(React__default["default"].PureComponent));
function mapItemIndex(items, values, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return items
        .filter(function (item) { return values.indexOf(item[valueField || 'value']) === -1; })
        .reduce(function (prev, next, i) {
        prev[next[valueField || 'value']] = i;
        return prev;
    }, {});
}
/** @class */ ((function (_super) {
    tslib.__extends(TextControlRenderer, _super);
    function TextControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'input-text'
        })
    ], TextControlRenderer);
    return TextControlRenderer;
})(TextControl));
/** @class */ ((function (_super) {
    tslib.__extends(PasswordControlRenderer, _super);
    function PasswordControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PasswordControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'input-password'
        })
    ], PasswordControlRenderer);
    return PasswordControlRenderer;
})(TextControl));
/** @class */ ((function (_super) {
    tslib.__extends(EmailControlRenderer, _super);
    function EmailControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmailControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'input-email',
            validations: 'isEmail'
        })
    ], EmailControlRenderer);
    return EmailControlRenderer;
})(TextControl));
/** @class */ ((function (_super) {
    tslib.__extends(UrlControlRenderer, _super);
    function UrlControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UrlControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'input-url',
            validations: 'isUrl'
        })
    ], UrlControlRenderer);
    return UrlControlRenderer;
})(TextControl));
/** @class */ ((function (_super) {
    tslib.__extends(NativeDateControlRenderer, _super);
    function NativeDateControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeDateControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'native-date'
        })
    ], NativeDateControlRenderer);
    return NativeDateControlRenderer;
})(TextControl));
/** @class */ ((function (_super) {
    tslib.__extends(NativeTimeControlRenderer, _super);
    function NativeTimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeTimeControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'native-time'
        })
    ], NativeTimeControlRenderer);
    return NativeTimeControlRenderer;
})(TextControl));
/** @class */ ((function (_super) {
    tslib.__extends(NativeNumberControlRenderer, _super);
    function NativeNumberControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeNumberControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'native-number'
        })
    ], NativeNumberControlRenderer);
    return NativeNumberControlRenderer;
})(TextControl));

exports["default"] = TextControl;
exports.mapItemIndex = mapItemIndex;
