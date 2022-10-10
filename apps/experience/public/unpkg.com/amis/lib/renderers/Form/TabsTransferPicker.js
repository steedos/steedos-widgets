/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var tslib = require('tslib');
var amisCore = require('amis-core');
var React = require('react');
var amisUi = require('amis-ui');
var TabsTransfer = require('./TabsTransfer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** @class */ ((function (_super) {
    tslib.__extends(TabsTransferPickerRenderer, _super);
    function TabsTransferPickerRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            activeKey: 0
        };
        return _this;
    }
    TabsTransferPickerRenderer.prototype.dispatchEvent = function (name) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
        dispatchEvent(name, data);
    };
    TabsTransferPickerRenderer.prototype.optionItemRender = function (option, states) {
        var _a = this.props, menuTpl = _a.menuTpl, render = _a.render, data = _a.data;
        var ctx = arguments[2] || {};
        if (menuTpl) {
            return render("item/".concat(states.index), menuTpl, {
                data: amisCore.createObject(amisCore.createObject(data, tslib.__assign(tslib.__assign({}, states), ctx)), option)
            });
        }
        return amisUi.Selection.itemRender(option, states);
    };
    // 动作
    TabsTransferPickerRenderer.prototype.doAction = function (action) {
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
    TabsTransferPickerRenderer.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, cx = _a.classnames, options = _a.options, selectedOptions = _a.selectedOptions, sortable = _a.sortable, loading = _a.loading, searchResultMode = _a.searchResultMode, showArrow = _a.showArrow, deferLoad = _a.deferLoad, disabled = _a.disabled, selectTitle = _a.selectTitle, resultTitle = _a.resultTitle, pickerSize = _a.pickerSize, leftMode = _a.leftMode, leftOptions = _a.leftOptions;
        return (React__default["default"].createElement("div", { className: cx('TabsTransferControl', className) },
            React__default["default"].createElement(amisUi.TabsTransferPicker, { activeKey: this.state.activeKey, onTabChange: this.onTabChange, value: selectedOptions, disabled: disabled, options: options, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, searchResultMode: searchResultMode, onSearch: this.handleTabSearch, showArrow: showArrow, onDeferLoad: deferLoad, selectTitle: selectTitle, resultTitle: resultTitle, size: pickerSize, leftMode: leftMode, leftOptions: leftOptions, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onFocus: function () { return _this.dispatchEvent('focus'); }, onBlur: function () { return _this.dispatchEvent('blur'); } }),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, key: "info", show: loading })));
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], TabsTransferPickerRenderer.prototype, "dispatchEvent", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TabsTransferPickerRenderer.prototype, "optionItemRender", null);
    TabsTransferPickerRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'tabs-transfer-picker'
        })
    ], TabsTransferPickerRenderer);
    return TabsTransferPickerRenderer;
})(TabsTransfer.BaseTabsTransferRenderer));
