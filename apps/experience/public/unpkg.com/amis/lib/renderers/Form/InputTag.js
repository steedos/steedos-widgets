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
var find = require('lodash/find');
var isInteger = require('lodash/isInteger');
var unionWith = require('lodash/unionWith');
var ReactDOM = require('react-dom');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Downshift__default = /*#__PURE__*/_interopDefaultLegacy(Downshift);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var isInteger__default = /*#__PURE__*/_interopDefaultLegacy(isInteger);
var unionWith__default = /*#__PURE__*/_interopDefaultLegacy(unionWith);

var TagControl = /** @class */ (function (_super) {
    tslib.__extends(TagControl, _super);
    function TagControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.input = React__default["default"].createRef();
        _this.state = {
            isOpened: false,
            inputValue: '',
            isFocused: false
        };
        return _this;
    }
    TagControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                inputValue: ''
            });
        }
    };
    TagControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    TagControl.prototype.dispatchEvent = function (eventName, eventData) {
        if (eventData === void 0) { eventData = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, options, data, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, options = _a.options, data = _a.data;
                        return [4 /*yield*/, dispatchEvent(eventName, amisCore.createObject(data, tslib.__assign({ options: options }, eventData)))];
                    case 1:
                        rendererEvent = _b.sent();
                        // 返回阻塞标识
                        return [2 /*return*/, !!(rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented)];
                }
            });
        });
    };
    /** 处理输入的内容 */
    TagControl.prototype.normalizeInputValue = function (inputValue) {
        var _a = this.props, enableBatchAdd = _a.enableBatchAdd, separator = _a.separator;
        var batchValues = [];
        if (enableBatchAdd && separator && typeof separator === 'string') {
            batchValues = inputValue.split(separator);
        }
        else {
            batchValues.push(inputValue);
        }
        return batchValues
            .filter(Boolean)
            .map(function (item) { return ({ value: item, label: item }); });
    };
    TagControl.prototype.normalizeOptions = function (options) {
        var _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField;
        return joinValues
            ? options.map(function (item) { return item[valueField || 'value']; }).join(delimiter || ',')
            : extractValue
                ? options.map(function (item) { return item[valueField || 'value']; })
                : options;
    };
    /** 输入的内容和存量的内容合并，过滤掉value值相同的 */
    TagControl.prototype.normalizeMergedValue = function (inputValue, normalized) {
        if (normalized === void 0) { normalized = true; }
        var selectedOptions = this.props.selectedOptions;
        var options = unionWith__default["default"](selectedOptions.concat(), this.normalizeInputValue(inputValue), function (origin, input) { return origin.value === input.value; });
        return normalized ? this.normalizeOptions(options) : options;
    };
    TagControl.prototype.validateInputValue = function (inputValue) {
        var _a = this.props, max = _a.max, maxTagLength = _a.maxTagLength; _a.enableBatchAdd; _a.separator; var onInputValidateFailed = _a.onInputValidateFailed;
        var normalizedValue = this.normalizeMergedValue(inputValue, false);
        if (max != null && isInteger__default["default"](max) && normalizedValue.length > max) {
            onInputValidateFailed === null || onInputValidateFailed === void 0 ? void 0 : onInputValidateFailed(normalizedValue.map(function (item) { return item.value; }), 'max');
            return false;
        }
        var addedValues = this.normalizeInputValue(inputValue);
        if (maxTagLength != null &&
            isInteger__default["default"](maxTagLength) &&
            addedValues.some(function (item) { return item.value.length > maxTagLength; })) {
            onInputValidateFailed === null || onInputValidateFailed === void 0 ? void 0 : onInputValidateFailed(addedValues.map(function (item) { return item.value; }), 'maxLength');
            return false;
        }
        return true;
    };
    TagControl.prototype.getValue = function (type, option) {
        if (type === void 0) { type = 'normal'; }
        if (option === void 0) { option = {}; }
        var _a = this.props, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField;
        var newValue = selectedOptions.concat();
        if (type === 'push') {
            newValue.push(option);
        }
        else if (type === 'pop') {
            newValue.pop();
        }
        return joinValues
            ? newValue.map(function (item) { return item[valueField || 'value']; }).join(delimiter || ',')
            : extractValue
                ? newValue.map(function (item) { return item[valueField || 'value']; })
                : newValue;
    };
    TagControl.prototype.addItem = function (option) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, selectedOptions, onChange, newValue, newValueRes, isPrevented;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isReachMax()) {
                            return [2 /*return*/];
                        }
                        _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange;
                        newValue = selectedOptions.concat();
                        if (find__default["default"](newValue, function (item) { return item.value == option.value; })) {
                            return [2 /*return*/];
                        }
                        newValueRes = this.getValue('push', option);
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValueRes);
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.handleFocus = function (e) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var newValueRes, isPrevented;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.setState({
                            isFocused: true,
                            isOpened: true
                        });
                        newValueRes = this.getValue('normal');
                        return [4 /*yield*/, this.dispatchEvent('focus', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _c.sent();
                        isPrevented || ((_b = (_a = this.props).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, e));
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.handleBlur = function (e) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _c, selectedOptions, onChange, value, newValueRes, isPrevented;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = this.props, selectedOptions = _c.selectedOptions, onChange = _c.onChange;
                        value = this.state.inputValue.trim();
                        if (!this.validateInputValue(value)) {
                            this.setState({ isFocused: false, isOpened: false });
                            return [2 /*return*/];
                        }
                        newValueRes = this.normalizeMergedValue(value);
                        return [4 /*yield*/, this.dispatchEvent('blur', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _d.sent();
                        isPrevented || ((_b = (_a = this.props).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, e));
                        this.setState({
                            isFocused: false,
                            isOpened: false,
                            inputValue: ''
                        }, value
                            ? function () {
                                if (selectedOptions.length !== newValueRes.length) {
                                    onChange === null || onChange === void 0 ? void 0 : onChange(newValueRes);
                                }
                            }
                            : undefined);
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    TagControl.prototype.handleInputChange = function (text) {
        this.setState({ inputValue: text });
    };
    TagControl.prototype.handleChange = function (value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, joinValues, extractValue, delimiter, valueField, onChange, newValue, isPrevented;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, onChange = _a.onChange;
                        newValue = Array.isArray(value) ? value.concat() : [];
                        if (joinValues || extractValue) {
                            newValue = value.map(function (item) { return item[valueField || 'value']; });
                        }
                        if (joinValues) {
                            newValue = newValue.join(delimiter || ',');
                        }
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValue
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.renderItem = function (item) {
        var labelField = this.props.labelField;
        return "".concat(item[labelField || 'label']);
    };
    TagControl.prototype.handleKeyDown = function (evt) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, selectedOptions, onChange, delimiter, value, newValueRes, isPrevented, newValueRes, isPrevented;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange, delimiter = _a.delimiter;
                        value = this.state.inputValue.trim();
                        if (!(selectedOptions.length && !value && evt.key == 'Backspace')) return [3 /*break*/, 2];
                        newValueRes = this.getValue('pop');
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValueRes
                            })];
                    case 1:
                        isPrevented = _b.sent();
                        isPrevented || onChange(newValueRes);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(value && (evt.key === 'Enter' || evt.key === delimiter))) return [3 /*break*/, 4];
                        evt.preventDefault();
                        evt.stopPropagation();
                        newValueRes = this.normalizeMergedValue(value);
                        return [4 /*yield*/, this.dispatchEvent('change', {
                                value: newValueRes
                            })];
                    case 3:
                        isPrevented = _b.sent();
                        if (!this.validateInputValue(value)) {
                            this.setState({ isFocused: false, isOpened: false });
                            return [2 /*return*/];
                        }
                        if (!isPrevented && selectedOptions.length !== newValueRes.length) {
                            onChange(newValueRes);
                        }
                        this.setState({
                            inputValue: ''
                        });
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TagControl.prototype.handleOptionChange = function (option) {
        if (this.isReachMax() || this.state.inputValue || !option) {
            return;
        }
        this.addItem(option);
    };
    TagControl.prototype.getTarget = function () {
        return this.input.current;
    };
    TagControl.prototype.getParent = function () {
        return this.input.current && ReactDOM.findDOMNode(this.input.current).parentElement;
    };
    TagControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload === null || reload === void 0 ? void 0 : reload();
    };
    TagControl.prototype.isReachMax = function () {
        var _a = this.props, max = _a.max, selectedOptions = _a.selectedOptions;
        return max != null && isInteger__default["default"](max) && selectedOptions.length >= max;
    };
    TagControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, cx = _a.classnames, disabled = _a.disabled, placeholder = _a.placeholder, name = _a.name, clearable = _a.clearable, selectedOptions = _a.selectedOptions, loading = _a.loading, popOverContainer = _a.popOverContainer, dropdown = _a.dropdown, options = _a.options, optionsTip = _a.optionsTip, maxTagCount = _a.maxTagCount, overflowTagPopover = _a.overflowTagPopover, __ = _a.translate;
        var finnalOptions = Array.isArray(options)
            ? amisCore.filterTree(options, function (item) {
                return (Array.isArray(item.children) && !!item.children.length) ||
                    (item.value !== undefined && !~selectedOptions.indexOf(item));
            }, 0, true)
            : [];
        var reachMax = this.isReachMax();
        return (React__default["default"].createElement(Downshift__default["default"], { selectedItem: selectedOptions, isOpen: this.state.isFocused, inputValue: this.state.inputValue, onChange: this.handleOptionChange, itemToString: this.renderItem }, function (_a) {
            var isOpen = _a.isOpen, highlightedIndex = _a.highlightedIndex, getItemProps = _a.getItemProps, getInputProps = _a.getInputProps;
            return (React__default["default"].createElement("div", { className: cx(className, "TagControl") },
                React__default["default"].createElement(amisUi.ResultBox, tslib.__assign({}, getInputProps({
                    name: name,
                    ref: _this.input,
                    placeholder: __(placeholder !== null && placeholder !== void 0 ? placeholder : 'Tag.placeholder'),
                    value: _this.state.inputValue,
                    onKeyDown: _this.handleKeyDown,
                    onFocus: _this.handleFocus,
                    onBlur: _this.handleBlur,
                    disabled: disabled
                }), { inputPlaceholder: '', onChange: _this.handleInputChange, className: cx('TagControl-input'), result: selectedOptions, onResultChange: _this.handleChange, itemRender: _this.renderItem, clearable: clearable, maxTagCount: maxTagCount, overflowTagPopover: overflowTagPopover, allowInput: true }), loading ? React__default["default"].createElement(amisUi.Spinner, { size: "sm" }) : undefined),
                dropdown !== false ? (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer || _this.getParent, target: _this.getTarget, placement: 'auto', show: isOpen && !!finnalOptions.length },
                    React__default["default"].createElement(amisCore.PopOver, { overlay: true, className: cx('TagControl-popover'), onHide: _this.close },
                        React__default["default"].createElement(amisUi.ListMenu, { options: finnalOptions, itemRender: _this.renderItem, highlightIndex: highlightedIndex, getItemProps: function (_a) {
                                var item = _a.item, index = _a.index;
                                return (tslib.__assign({}, getItemProps({
                                    index: index,
                                    item: item,
                                    disabled: reachMax || item.disabled,
                                    className: cx('ListMenu-item', {
                                        'is-disabled': reachMax
                                    }),
                                })));
                            } })))) : (
                // 保留原来的展现方式，不推荐
                React__default["default"].createElement("div", { className: cx('TagControl-sug') },
                    optionsTip ? (React__default["default"].createElement("div", { className: cx('TagControl-sugTip') }, __(optionsTip))) : null,
                    options.map(function (item, index) { return (React__default["default"].createElement("div", { className: cx('TagControl-sugItem', {
                            'is-disabled': item.disabled || disabled || reachMax
                        }), key: index, onClick: _this.addItem.bind(_this, item) }, item.label)); })))));
        }));
    };
    TagControl.defaultProps = {
        resetValue: '',
        labelField: 'label',
        valueField: 'value',
        multiple: true,
        placeholder: 'Tag.placeholder',
        optionsTip: 'Tag.tip',
        separator: '-'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object]),
        tslib.__metadata("design:returntype", Promise)
    ], TagControl.prototype, "dispatchEvent", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "getValue", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], TagControl.prototype, "handleFocus", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], TagControl.prototype, "handleBlur", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "close", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "handleInputChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array]),
        tslib.__metadata("design:returntype", Promise)
    ], TagControl.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Object)
    ], TagControl.prototype, "renderItem", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], TagControl.prototype, "handleKeyDown", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "handleOptionChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "getTarget", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "getParent", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], TagControl.prototype, "isReachMax", null);
    return TagControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(TagControlRenderer, _super);
    function TagControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'input-tag'
        })
    ], TagControlRenderer);
    return TagControlRenderer;
})(TagControl));

exports["default"] = TagControl;
