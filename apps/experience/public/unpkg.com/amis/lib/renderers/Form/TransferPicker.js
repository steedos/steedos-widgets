/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var tslib = require('tslib');
var amisCore = require('amis-core');
var React = require('react');
var amisUi = require('amis-ui');
var Transfer = require('./Transfer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** @class */ ((function (_super) {
    tslib.__extends(TransferPickerRenderer, _super);
    function TransferPickerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransferPickerRenderer.prototype.dispatchEvent = function (name) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
        dispatchEvent(name, data);
    };
    // 动作
    TransferPickerRenderer.prototype.doAction = function (action) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        switch (action.actionType) {
            case 'clear':
                onChange === null || onChange === void 0 ? void 0 : onChange('');
                break;
            case 'reset':
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
                break;
        }
    };
    TransferPickerRenderer.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, selectedOptions = _b.selectedOptions, sortable = _b.sortable, loading = _b.loading, searchable = _b.searchable, searchResultMode = _b.searchResultMode, showArrow = _b.showArrow, deferLoad = _b.deferLoad, disabled = _b.disabled, selectTitle = _b.selectTitle, resultTitle = _b.resultTitle, pickerSize = _b.pickerSize, columns = _b.columns, leftMode = _b.leftMode, selectMode = _b.selectMode, borderMode = _b.borderMode;
        // 目前 LeftOptions 没有接口可以动态加载
        // 为了方便可以快速实现动态化，让选项的第一个成员携带
        // LeftOptions 信息
        var _c = this.props, options = _c.options, leftOptions = _c.leftOptions, leftDefaultValue = _c.leftDefaultValue;
        if (selectMode === 'associated' &&
            options &&
            options.length === 1 &&
            options[0].leftOptions &&
            Array.isArray(options[0].children)) {
            leftOptions = options[0].leftOptions;
            leftDefaultValue = (_a = options[0].leftDefaultValue) !== null && _a !== void 0 ? _a : leftDefaultValue;
            options = options[0].children;
        }
        return (React__default["default"].createElement("div", { className: cx('TransferControl', className) },
            React__default["default"].createElement(amisUi.TransferPicker, { borderMode: borderMode, selectMode: selectMode, value: selectedOptions, disabled: disabled, options: options, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, searchResultMode: searchResultMode, onSearch: searchable ? this.handleSearch : undefined, showArrow: showArrow, onDeferLoad: deferLoad, selectTitle: selectTitle, resultTitle: resultTitle, size: pickerSize, columns: columns, leftMode: leftMode, leftOptions: leftOptions, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onFocus: function () { return _this.dispatchEvent('focus'); }, onBlur: function () { return _this.dispatchEvent('blur'); } }),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, key: "info", show: loading })));
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], TransferPickerRenderer.prototype, "dispatchEvent", null);
    TransferPickerRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'transfer-picker'
        })
    ], TransferPickerRenderer);
    return TransferPickerRenderer;
})(Transfer.BaseTransferRenderer));
