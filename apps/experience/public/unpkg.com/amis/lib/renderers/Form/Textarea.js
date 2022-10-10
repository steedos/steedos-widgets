/**
 * amis v2.3.0
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

var TextAreaControl = /** @class */ (function (_super) {
    tslib.__extends(TextAreaControl, _super);
    function TextAreaControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputRef = React__default["default"].createRef();
        return _this;
    }
    TextAreaControl.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var onChange = this.props.onChange;
        if (!!~['clear', 'reset'].indexOf(actionType)) {
            onChange === null || onChange === void 0 ? void 0 : onChange(this.props.resetValue);
            this.focus();
        }
        else if (actionType === 'focus') {
            this.focus();
        }
    };
    TextAreaControl.prototype.focus = function () {
        var _a;
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    TextAreaControl.prototype.handleChange = function (e) {
        var onChange = this.props.onChange;
        onChange && onChange(e);
    };
    TextAreaControl.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        this.setState({
            focused: true
        }, function () {
            onFocus && onFocus(e);
        });
    };
    TextAreaControl.prototype.handleBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, trimContents = _a.trimContents, value = _a.value, onChange = _a.onChange;
        this.setState({
            focused: false
        }, function () {
            if (trimContents && value && typeof value === 'string') {
                onChange(value.trim());
            }
            onBlur && onBlur(e);
        });
    };
    TextAreaControl.prototype.render = function () {
        var rest = tslib.__rest(this.props, []);
        return (React__default["default"].createElement(amisUi.Textarea, tslib.__assign({}, rest, { onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange })));
    };
    TextAreaControl.defaultProps = {
        minRows: 3,
        maxRows: 20,
        trimContents: true,
        resetValue: '',
        clearable: false
    };
    tslib.__decorate([
        amisCore.autobind,
        amisCore.bindRendererEvent('change', undefined, false),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TextAreaControl.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        amisCore.bindRendererEvent('focus'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TextAreaControl.prototype, "handleFocus", null);
    tslib.__decorate([
        amisCore.autobind,
        amisCore.bindRendererEvent('blur'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TextAreaControl.prototype, "handleBlur", null);
    return TextAreaControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TextAreaControlRenderer, _super);
    function TextAreaControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextAreaControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'textarea'
        })
    ], TextAreaControlRenderer);
    return TextAreaControlRenderer;
})(TextAreaControl));

exports["default"] = TextAreaControl;
