/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var cx = require('classnames');
var find = require('lodash/find');
var findIndex = require('lodash/findIndex');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var findIndex__default = /*#__PURE__*/_interopDefaultLegacy(findIndex);

var PickerControl = /** @class */ (function (_super) {
    tslib.__extends(PickerControl, _super);
    function PickerControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpened: false,
            schema: _this.buildSchema(_this.props),
            isFocused: false
        };
        _this.input = React__default["default"].createRef();
        return _this;
    }
    PickerControl.prototype.componentDidMount = function () {
        this.fetchOptions();
    };
    PickerControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (amisCore.anyChanged(['pickerSchema', 'multiple', 'source'], prevProps, props)) {
            this.setState({
                schema: this.buildSchema(props)
            });
        }
        else if (JSON.stringify(props.value) !== JSON.stringify(prevProps.value)) {
            this.fetchOptions();
        }
        else if (amisCore.isApiOutdated(prevProps.source, props.source, prevProps.data, props.data)) {
            this.fetchOptions();
        }
    };
    PickerControl.prototype.fetchOptions = function () {
        var _a = this.props, value = _a.value, formItem = _a.formItem, valueField = _a.valueField, labelField = _a.labelField, source = _a.source, data = _a.data;
        var selectedOptions;
        if (!source ||
            !formItem ||
            (valueField || 'value') === (labelField || 'label') ||
            ((selectedOptions = formItem.getSelectedOptions(value)) &&
                (!selectedOptions.length ||
                    selectedOptions[0][valueField || 'value'] !==
                        selectedOptions[0][labelField || 'label']))) {
            return;
        }
        var ctx = amisCore.createObject(data, {
            value: value,
            op: 'loadOptions'
        });
        if (amisCore.isPureVariable(source)) {
            formItem.setOptions(amisCore.resolveVariableAndFilter(source, data, '| raw'));
        }
        else if (amisCore.isEffectiveApi(source, ctx)) {
            formItem.loadOptions(source, ctx, {
                autoAppend: true
            });
        }
    };
    PickerControl.prototype.buildSchema = function (props) {
        var _a, _b;
        var isScopeData = amisCore.isPureVariable(props.source);
        return tslib.__assign(tslib.__assign({ checkOnItemClick: true }, props.pickerSchema), { labelTpl: (_b = (_a = props.pickerSchema) === null || _a === void 0 ? void 0 : _a.labelTpl) !== null && _b !== void 0 ? _b : props.labelTpl, type: 'crud', pickerMode: true, syncLocation: false, api: isScopeData ? null : props.source, source: isScopeData ? props.source : null, keepItemSelectionOnPageChange: true, valueField: props.valueField, labelField: props.labelField, 
            // 不支持批量操作，会乱套
            bulkActions: props.multiple
                ? props.pickerSchema.bulkActions
                : [] });
    };
    PickerControl.prototype.crudRef = function (ref) {
        while (ref && ref.getWrappedInstance) {
            ref = ref.getWrappedInstance();
        }
        this.crud = ref;
    };
    PickerControl.prototype.reload = function () {
        if (this.crud) {
            this.crud.search();
        }
        else {
            var reload = this.props.reloadOptions;
            reload && reload();
        }
    };
    PickerControl.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    PickerControl.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    PickerControl.prototype.handleModalConfirm = function (values, action, ctx, components) {
        var idx = findIndex__default["default"](components, function (item) { return item.props.type === 'crud'; });
        this.handleChange(values[idx].items);
        this.close();
    };
    PickerControl.prototype.handleChange = function (items) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, joinValues, valueField, delimiter, extractValue, multiple, options, data, dispatchEvent, setOptions, onChange, value, additionalOptions, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, joinValues = _a.joinValues, valueField = _a.valueField, delimiter = _a.delimiter, extractValue = _a.extractValue, multiple = _a.multiple, options = _a.options, data = _a.data, dispatchEvent = _a.dispatchEvent, setOptions = _a.setOptions, onChange = _a.onChange;
                        value = items;
                        if (joinValues) {
                            value = items
                                .map(function (item) { return item[valueField || 'value']; })
                                .join(delimiter || ',');
                        }
                        else if (extractValue) {
                            value = multiple
                                ? items.map(function (item) { return item[valueField || 'value']; })
                                : (items[0] && items[0][valueField || 'value']) || '';
                        }
                        else {
                            value = multiple ? items : items[0];
                        }
                        additionalOptions = [];
                        items.forEach(function (item) {
                            if (!find__default["default"](options, function (option) { return item[valueField || 'value'] == option[valueField || 'value']; })) {
                                additionalOptions.push(item);
                            }
                        });
                        additionalOptions.length && setOptions(options.concat(additionalOptions));
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, { value: value, option: items[0] }))];
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
    PickerControl.prototype.removeItem = function (index) {
        var _a = this.props, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, onChange = _a.onChange, multiple = _a.multiple;
        var items = selectedOptions.concat();
        items.splice(index, 1);
        var value = items;
        if (joinValues) {
            value = items
                .map(function (item) { return item[valueField || 'value']; })
                .join(delimiter || ',');
        }
        else if (extractValue) {
            value = multiple
                ? items.map(function (item) { return item[valueField || 'value']; })
                : (items[0] && items[0][valueField || 'value']) || '';
        }
        else {
            value = multiple ? items : items[0];
        }
        onChange(value);
    };
    PickerControl.prototype.handleKeyDown = function (e) {
        var selectedOptions = this.props.selectedOptions;
        if (e.key === ' ') {
            this.open();
            e.preventDefault();
        }
        else if (selectedOptions.length && e.key == 'Backspace') {
            this.removeItem(selectedOptions.length - 1);
        }
    };
    PickerControl.prototype.handleFocus = function () {
        this.setState({
            isFocused: true
        });
    };
    PickerControl.prototype.handleBlur = function () {
        this.setState({
            isFocused: false
        });
    };
    PickerControl.prototype.handleClick = function () {
        this.input.current && this.input.current.focus();
        this.open();
    };
    PickerControl.prototype.clearValue = function () {
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange(resetValue !== void 0 ? resetValue : '');
    };
    PickerControl.prototype.renderValues = function () {
        var _this = this;
        var _a = this.props, ns = _a.classPrefix, selectedOptions = _a.selectedOptions, labelField = _a.labelField, labelTpl = _a.labelTpl, __ = _a.translate, disabled = _a.disabled;
        return (React__default["default"].createElement("div", { className: "".concat(ns, "Picker-values") }, selectedOptions.map(function (item, index) { return (React__default["default"].createElement("div", { key: index, className: cx__default["default"]("".concat(ns, "Picker-value"), {
                'is-disabled': disabled
            }) },
            React__default["default"].createElement("span", { "data-tooltip": __('delete'), "data-position": "bottom", className: "".concat(ns, "Picker-valueIcon"), onClick: function (e) {
                    e.stopPropagation();
                    _this.removeItem(index);
                } }, "\u00D7"),
            React__default["default"].createElement("span", { className: "".concat(ns, "Picker-valueLabel") }, labelTpl ? (React__default["default"].createElement(amisUi.Html, { html: amisCore.filter(labelTpl, item) })) : ("".concat(amisCore.getVariable(item, labelField || 'label') ||
                amisCore.getVariable(item, 'id')))))); })));
    };
    PickerControl.prototype.renderBody = function (_a) {
        var _b = _a === void 0 ? {} : _a, popOverContainer = _b.popOverContainer;
        var _c = this.props, render = _c.render, selectedOptions = _c.selectedOptions, options = _c.options, multiple = _c.multiple, valueField = _c.valueField, embed = _c.embed, source = _c.source;
        return render('modal-body', this.state.schema, {
            value: selectedOptions,
            valueField: valueField,
            primaryField: valueField,
            options: source ? [] : options,
            multiple: multiple,
            onSelect: embed ? this.handleChange : undefined,
            ref: this.crudRef,
            popOverContainer: popOverContainer
        });
    };
    PickerControl.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, disabled = _a.disabled, render = _a.render, modalMode = _a.modalMode, source = _a.source, size = _a.size; _a.env; var clearable = _a.clearable, multiple = _a.multiple, placeholder = _a.placeholder, embed = _a.embed; _a.value; var selectedOptions = _a.selectedOptions, __ = _a.translate, popOverContainer = _a.popOverContainer;
        return (React__default["default"].createElement("div", { className: cx("PickerControl", className) }, embed ? (React__default["default"].createElement("div", { className: cx('Picker') }, this.renderBody({ popOverContainer: popOverContainer }))) : (React__default["default"].createElement("div", { className: cx("Picker", {
                'Picker--single': !multiple,
                'Picker--multi': multiple,
                'is-focused': this.state.isFocused,
                'is-disabled': disabled
            }) },
            React__default["default"].createElement("div", { onClick: this.handleClick, className: cx('Picker-input') },
                !selectedOptions.length && placeholder ? (React__default["default"].createElement("div", { className: cx('Picker-placeholder') }, __(placeholder))) : null,
                React__default["default"].createElement("div", { className: cx('Picker-valueWrap') },
                    this.renderValues(),
                    React__default["default"].createElement("input", { onChange: amisCore.noop, value: '', ref: this.input, onKeyDown: this.handleKeyDown, onFocus: this.handleFocus, onBlur: this.handleBlur })),
                clearable && !disabled && selectedOptions.length ? (React__default["default"].createElement("a", { onClick: this.clearValue, className: cx('Picker-clear') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "input-clear", className: "icon" }))) : null,
                React__default["default"].createElement("span", { onClick: this.open, className: cx('Picker-btn') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "window-restore", className: "icon" }))),
            render('modal', {
                title: __('Select.placeholder'),
                size: size,
                type: modalMode,
                body: {
                    children: this.renderBody
                }
            }, {
                key: 'modal',
                lazyRender: !!source,
                onConfirm: this.handleModalConfirm,
                onClose: this.close,
                show: this.state.isOpened
            })))));
    };
    PickerControl.propsList = [
        'modalMode',
        'pickerSchema',
        'labelField',
        'onChange',
        'options',
        'value',
        'inline',
        'multiple',
        'embed',
        'resetValue',
        'placeholder',
        'onQuery' // 防止 Form 的 onQuery 事件透传下去，不然会导致 table 先后触发 Form 和 Crud 的 onQuery
    ];
    PickerControl.defaultProps = {
        modalMode: 'dialog',
        multiple: false,
        placeholder: 'Picker.placeholder',
        labelField: 'label',
        valueField: 'value',
        pickerSchema: {
            mode: 'list',
            listItem: {
                title: '${label|raw}'
            }
        },
        embed: false
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "crudRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "open", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "close", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array, Object, Object, Array]),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "handleModalConfirm", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array]),
        tslib.__metadata("design:returntype", Promise)
    ], PickerControl.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "handleKeyDown", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "handleFocus", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "handleBlur", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "handleClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "clearValue", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], PickerControl.prototype, "renderBody", null);
    return PickerControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(PickerControlRenderer, _super);
    function PickerControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PickerControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'picker',
            autoLoadOptionsFromSource: false,
            sizeMutable: false
        })
    ], PickerControlRenderer);
    return PickerControlRenderer;
})(PickerControl));

exports["default"] = PickerControl;
