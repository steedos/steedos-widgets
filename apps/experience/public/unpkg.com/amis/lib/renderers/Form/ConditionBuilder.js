/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var ConditionBuilderControl = /** @class */ (function (_super) {
    tslib.__extends(ConditionBuilderControl, _super);
    function ConditionBuilderControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionBuilderControl.prototype.renderEtrValue = function (schema, data) {
        return this.props.render('inline', Object.assign(schema, { label: false }), data);
    };
    ConditionBuilderControl.prototype.renderPickerIcon = function () {
        var _a = this.props, render = _a.render, pickerIcon = _a.pickerIcon;
        return pickerIcon ? render('picker-icon', pickerIcon) : undefined;
    };
    ConditionBuilderControl.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames; _a.pickerIcon; var rest = tslib.__rest(_a, ["className", "classnames", "pickerIcon"]);
        // 处理一下formula类型值的变量列表
        var formula = this.props.formula ? tslib.__assign({}, this.props.formula) : undefined;
        if (formula && formula.variables && amisCore.isPureVariable(formula.variables)) {
            // 如果 variables 是 ${xxx} 这种形式，将其处理成实际的值
            formula.variables = amisCore.resolveVariableAndFilter(formula.variables, this.props.data, '| raw');
        }
        return (React__default["default"].createElement("div", { className: cx("ConditionBuilderControl", className) },
            React__default["default"].createElement(ConditionBuilderWithRemoteOptions, tslib.__assign({ renderEtrValue: this.renderEtrValue, pickerIcon: this.renderPickerIcon() }, rest, { formula: formula }))));
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ConditionBuilderControl.prototype, "renderEtrValue", null);
    return ConditionBuilderControl;
}(React__default["default"].PureComponent));
var ConditionBuilderWithRemoteOptions = amisUi.withRemoteConfig({
    adaptor: function (data) { return data.fields || data; }
})(/** @class */ (function (_super) {
    tslib.__extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, loading = _a.loading, config = _a.config; _a.deferLoad; var disabled = _a.disabled, renderEtrValue = _a.renderEtrValue, rest = tslib.__rest(_a, ["loading", "config", "deferLoad", "disabled", "renderEtrValue"]);
        return (React__default["default"].createElement(amisUi.ConditionBuilder, tslib.__assign({}, rest, { fields: config || rest.fields || [], disabled: disabled || loading, renderEtrValue: renderEtrValue })));
    };
    return class_1;
}(React__default["default"].Component)));
/** @class */ ((function (_super) {
    tslib.__extends(ConditionBuilderRenderer, _super);
    function ConditionBuilderRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionBuilderRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'condition-builder',
            strictMode: false
        })
    ], ConditionBuilderRenderer);
    return ConditionBuilderRenderer;
})(ConditionBuilderControl));

exports["default"] = ConditionBuilderControl;
