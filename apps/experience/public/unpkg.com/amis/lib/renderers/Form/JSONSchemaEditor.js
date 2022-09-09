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

var JSONSchemaEditorControl = /** @class */ (function (_super) {
    tslib.__extends(JSONSchemaEditorControl, _super);
    function JSONSchemaEditorControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONSchemaEditorControl.prototype.renderModalProps = function (value, onChange) {
        var _a = this.props, render = _a.render, advancedSettings = _a.advancedSettings;
        var fields = (advancedSettings === null || advancedSettings === void 0 ? void 0 : advancedSettings[value === null || value === void 0 ? void 0 : value.type]) || [];
        return render("modal", {
            type: 'form',
            wrapWithPanel: false,
            body: fields,
            submitOnChange: true
        }, {
            data: value,
            onSubmit: function (value) { return onChange(value); }
        });
    };
    JSONSchemaEditorControl.prototype.render = function () {
        var _a = this.props, enableAdvancedSetting = _a.enableAdvancedSetting, rest = tslib.__rest(_a, ["enableAdvancedSetting"]);
        return (React__default["default"].createElement(amisUi.JSONSchemaEditor, tslib.__assign({}, rest, { enableAdvancedSetting: enableAdvancedSetting, renderModalProps: this.renderModalProps })));
    };
    JSONSchemaEditorControl.defaultProps = {
        enableAdvancedSetting: false
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Function]),
        tslib.__metadata("design:returntype", void 0)
    ], JSONSchemaEditorControl.prototype, "renderModalProps", null);
    return JSONSchemaEditorControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(JSONSchemaEditorRenderer, _super);
    function JSONSchemaEditorRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONSchemaEditorRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'json-schema-editor'
        })
    ], JSONSchemaEditorRenderer);
    return JSONSchemaEditorRenderer;
})(JSONSchemaEditorControl));

exports["default"] = JSONSchemaEditorControl;
