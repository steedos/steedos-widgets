/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var ButtonGroupControl = /** @class */ (function (_super) {
    tslib.__extends(ButtonGroupControl, _super);
    function ButtonGroupControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonGroupControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    ButtonGroupControl.prototype.handleToggle = function (option) {
        var _a = this.props, onToggle = _a.onToggle; _a.multiple; _a.autoFill; _a.onBulkChange;
        onToggle(option);
    };
    ButtonGroupControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    ButtonGroupControl.prototype.render = function (props) {
        var _a;
        var _this = this;
        if (props === void 0) { props = this.props; }
        var render = props.render, ns = props.classPrefix, cx = props.classnames, className = props.className, disabled = props.disabled, options = props.options; props.value; var labelField = props.labelField, placeholder = props.placeholder, btnClassName = props.btnClassName, btnActiveClassName = props.btnActiveClassName, selectedOptions = props.selectedOptions, buttons = props.buttons, size = props.size, block = props.block, vertical = props.vertical, tiled = props.tiled, __ = props.translate;
        var body = [];
        var btnLevel = props.btnLevel;
        var btnActiveLevel = props.btnActiveLevel;
        btnClassName && (btnLevel = amisCore.getLevelFromClassName(btnClassName));
        btnActiveClassName &&
            (btnActiveLevel = amisCore.getLevelFromClassName(btnActiveClassName));
        if (options && options.length) {
            body = options.map(function (option, key) {
                var active = !!~selectedOptions.indexOf(option);
                return render("option/".concat(key), {
                    label: option[labelField || 'label'],
                    icon: option.icon,
                    size: option.size || size,
                    type: 'button',
                    block: block
                }, {
                    key: key,
                    active: active,
                    level: (active ? btnActiveLevel : '') || option.level || btnLevel,
                    className: cx(option.className, btnClassName),
                    disabled: option.disabled || disabled,
                    onClick: function (e) {
                        if (disabled) {
                            return;
                        }
                        _this.handleToggle(option);
                        e.preventDefault(); // 禁止 onAction 触发
                    }
                });
            });
        }
        else if (Array.isArray(buttons)) {
            body = buttons.map(function (button, key) {
                return render("button/".concat(key), tslib.__assign({ size: size, block: block, activeLevel: btnActiveLevel, level: btnLevel, disabled: disabled }, button), {
                    key: key,
                    className: cx(button.className, btnClassName)
                });
            });
        }
        return (React__default["default"].createElement("div", { className: cx("ButtonGroup", (_a = {
                    'ButtonGroup--block': block,
                    'ButtonGroup--vertical': vertical,
                    'ButtonGroup--tiled': tiled
                },
                _a["ButtonGroup--".concat(size)] = size,
                _a), className) }, body.length ? (body) : (React__default["default"].createElement("span", { className: "".concat(ns, "ButtonGroup-placeholder") }, __(placeholder)))));
    };
    ButtonGroupControl.defaultProps = {
        btnLevel: 'default',
        btnActiveLevel: 'primary',
        clearable: false,
        vertical: false
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ButtonGroupControl.prototype, "handleToggle", null);
    return ButtonGroupControl;
}(React__default["default"].Component));
var ButtonGroupControlRenderer = /** @class */ (function (_super) {
    tslib.__extends(ButtonGroupControlRenderer, _super);
    function ButtonGroupControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonGroupControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'button-group-select',
            sizeMutable: false,
            strictMode: false
        })
    ], ButtonGroupControlRenderer);
    return ButtonGroupControlRenderer;
}(ButtonGroupControl));

exports.ButtonGroupControlRenderer = ButtonGroupControlRenderer;
exports["default"] = ButtonGroupControl;
