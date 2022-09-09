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

var DropDownButton = /** @class */ (function (_super) {
    tslib.__extends(DropDownButton, _super);
    function DropDownButton(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false
        };
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.toogle = _this.toogle.bind(_this);
        _this.keepOpen = _this.keepOpen.bind(_this);
        _this.domRef = _this.domRef.bind(_this);
        return _this;
    }
    DropDownButton.prototype.componentDidMount = function () {
        if (this.props.defaultIsOpened) {
            this.setState({
                isOpened: true
            });
        }
    };
    DropDownButton.prototype.domRef = function (ref) {
        this.target = ref;
    };
    DropDownButton.prototype.toogle = function (e) {
        e.preventDefault();
        this.setState({
            isOpened: !this.state.isOpened
        });
    };
    DropDownButton.prototype.open = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.props.dispatchEvent('mouseenter', { data: this.props.buttons })];
                    case 1:
                        _a.sent();
                        this.setState({
                            isOpened: true
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DropDownButton.prototype.close = function () {
        var _this = this;
        this.timer = setTimeout(function () {
            _this.props.dispatchEvent('mouseleave', { data: _this.props.buttons });
            _this.setState({
                isOpened: false
            });
        }, 200);
    };
    DropDownButton.prototype.keepOpen = function () {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };
    DropDownButton.prototype.renderButton = function (button, index) {
        var _a;
        var _this = this;
        var _b = this.props, render = _b.render, cx = _b.classnames, data = _b.data;
        index = typeof index === 'number' ? index.toString() : index;
        if (typeof button !== 'string' && Array.isArray(button === null || button === void 0 ? void 0 : button.children)) {
            return (React__default["default"].createElement("div", { key: index, className: cx('DropDown-menu') },
                React__default["default"].createElement("li", { key: "".concat(index, "/0"), className: cx('DropDown-groupTitle') },
                    button.icon ? amisCore.generateIcon(cx, button.icon, 'm-r-xs') : null,
                    React__default["default"].createElement("span", null, button.label)),
                button.children.map(function (child, childIndex) {
                    return _this.renderButton(child, "".concat(index, "/").concat(childIndex + 1));
                })));
        }
        if (typeof button !== 'string' && !amisCore.isVisible(button, data)) {
            return null;
        }
        else if (button === 'divider' || button.type === 'divider') {
            return React__default["default"].createElement("li", { key: index, className: cx('DropDown-divider') });
        }
        else {
            return (React__default["default"].createElement("li", { key: index, className: cx('DropDown-button', (_a = {},
                    _a['is-disabled'] = amisCore.isDisabled(button, data),
                    _a)) }, render("button/".concat(index), tslib.__assign(tslib.__assign({ type: 'button' }, button), { isMenuItem: true }))));
        }
    };
    DropDownButton.prototype.renderOuter = function () {
        var _this = this;
        var _a;
        var _b = this.props; _b.render; var buttons = _b.buttons; _b.data; var popOverContainer = _b.popOverContainer, cx = _b.classnames, ns = _b.classPrefix, children = _b.children; _b.align; var closeOnClick = _b.closeOnClick, closeOnOutside = _b.closeOnOutside, menuClassName = _b.menuClassName;
        var body = (React__default["default"].createElement(amisCore.RootClose, { disabled: !this.state.isOpened, onRootClose: closeOnOutside !== false ? this.close : amisCore.noop }, function (ref) {
            return (React__default["default"].createElement("ul", { className: cx('DropDown-menu-root', 'DropDown-menu', menuClassName), onClick: closeOnClick ? _this.close : amisCore.noop, onMouseEnter: _this.keepOpen, ref: ref }, children
                ? children
                : Array.isArray(buttons)
                    ? buttons.map(function (button, index) {
                        return _this.renderButton(button, index);
                    })
                    : null));
        }));
        if (popOverContainer) {
            return (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer, target: function () { return _this.target; }, show: true },
                React__default["default"].createElement(amisCore.PopOver, { overlay: true, onHide: this.close, classPrefix: ns, className: cx('DropDown-popover', menuClassName), style: { minWidth: (_a = this.target) === null || _a === void 0 ? void 0 : _a.offsetWidth } }, body)));
        }
        return body;
    };
    DropDownButton.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, placement = _a.placement, tooltipContainer = _a.tooltipContainer, tooltipTrigger = _a.tooltipTrigger, tooltipRootClose = _a.tooltipRootClose, disabledTip = _a.disabledTip, block = _a.block, disabled = _a.disabled, btnDisabled = _a.btnDisabled, btnClassName = _a.btnClassName, size = _a.size, label = _a.label, level = _a.level, primary = _a.primary, className = _a.className, cx = _a.classnames, align = _a.align, iconOnly = _a.iconOnly, icon = _a.icon, rightIcon = _a.rightIcon, isActived = _a.isActived, trigger = _a.trigger, data = _a.data, hideCaret = _a.hideCaret;
        return (React__default["default"].createElement("div", { className: cx('DropDown ', {
                'DropDown--block': block,
                'DropDown--alignRight': align === 'right',
                'is-opened': this.state.isOpened,
                'is-actived': isActived
            }, className), onMouseEnter: trigger === 'hover' ? this.open : function () { }, onMouseLeave: trigger === 'hover' ? this.close : function () { }, ref: this.domRef },
            React__default["default"].createElement(amisUi.TooltipWrapper, { placement: placement, tooltip: disabled ? disabledTip : tooltip, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose },
                React__default["default"].createElement("button", { onClick: this.toogle, disabled: disabled || btnDisabled, className: cx('Button', btnClassName, typeof level === 'undefined'
                        ? 'Button--default'
                        : level
                            ? "Button--".concat(level)
                            : '', {
                        'Button--block': block,
                        'Button--primary': primary,
                        'Button--iconOnly': iconOnly
                    }, size ? "Button--".concat(size) : '') },
                    amisUi.hasIcon(icon)
                        ? React__default["default"].createElement(amisUi.Icon, { icon: icon, className: "icon" })
                        : amisCore.generateIcon(cx, icon, 'm-r-xs'),
                    typeof label === 'string' ? amisCore.filter(label, data) : label,
                    rightIcon && amisUi.hasIcon(rightIcon)
                        ? React__default["default"].createElement(amisUi.Icon, { icon: icon, className: "icon" })
                        : amisCore.generateIcon(cx, rightIcon, 'm-l-xs'),
                    !hideCaret ? (React__default["default"].createElement("span", { className: cx('DropDown-caret') },
                        React__default["default"].createElement(amisUi.Icon, { icon: "caret", className: "icon" }))) : null)),
            this.state.isOpened ? this.renderOuter() : null));
    };
    DropDownButton.defaultProps = {
        placement: 'top',
        tooltipTrigger: ['hover', 'focus'],
        tooltipRootClose: false
    };
    return DropDownButton;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(DropDownButtonRenderer, _super);
    function DropDownButtonRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropDownButtonRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'dropdown-button'
        })
    ], DropDownButtonRenderer);
    return DropDownButtonRenderer;
})(DropDownButton));

exports["default"] = DropDownButton;
