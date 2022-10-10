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

var SwitchControl = /** @class */ (function (_super) {
    tslib.__extends(SwitchControl, _super);
    function SwitchControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchControl.prototype.handleChange = function (checked) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onChange, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onChange = _a.onChange;
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                value: checked
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange && onChange(checked);
                        return [2 /*return*/];
                }
            });
        });
    };
    SwitchControl.prototype.render = function () {
        var _a = this.props, size = _a.size, className = _a.className, ns = _a.classPrefix, cx = _a.classnames, value = _a.value, trueValue = _a.trueValue, falseValue = _a.falseValue, onText = _a.onText, offText = _a.offText, option = _a.option; _a.onChange; var disabled = _a.disabled, optionAtLeft = _a.optionAtLeft;
        var on = amisCore.isObject(onText)
            ? amisCore.generateIcon(cx, onText.icon, 'Switch-icon')
            : onText;
        var off = amisCore.isObject(offText)
            ? amisCore.generateIcon(cx, offText.icon, 'Switch-icon')
            : offText;
        return (React__default["default"].createElement("div", { className: cx("SwitchControl", className) },
            optionAtLeft ? (React__default["default"].createElement("span", { className: cx('Switch-option') }, option)) : null,
            React__default["default"].createElement(amisUi.Switch, { classPrefix: ns, value: value, trueValue: trueValue, falseValue: falseValue, onText: on, offText: off, disabled: disabled, onChange: this.handleChange, size: size }),
            optionAtLeft ? null : (React__default["default"].createElement("span", { className: cx('Switch-option') }, option))));
    };
    SwitchControl.defaultProps = {
        trueValue: true,
        falseValue: false,
        optionAtLeft: false
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], SwitchControl.prototype, "handleChange", null);
    return SwitchControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(SwitchControlRenderer, _super);
    function SwitchControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'switch',
            sizeMutable: false
        })
    ], SwitchControlRenderer);
    return SwitchControlRenderer;
})(SwitchControl));

exports["default"] = SwitchControl;
