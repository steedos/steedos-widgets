/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var hoistNonReactStatic = require('hoist-non-react-statics');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

/**
 * @file scoped.jsx.
 * @author fex
 */
var HocPopOver = function (config) {
    if (config === void 0) { config = {}; }
    return function (Component) {
        var lastOpenedInstance = null;
        var PopOverComponent = /** @class */ (function (_super) {
            tslib.__extends(PopOverComponent, _super);
            function PopOverComponent(props) {
                var _this = _super.call(this, props) || this;
                _this.openPopOver = _this.openPopOver.bind(_this);
                _this.closePopOver = _this.closePopOver.bind(_this);
                _this.closePopOverLater = _this.closePopOverLater.bind(_this);
                _this.clearCloseTimer = _this.clearCloseTimer.bind(_this);
                _this.targetRef = _this.targetRef.bind(_this);
                // this.handleClickOutside = this.handleClickOutside.bind(this);
                _this.state = {
                    isOpened: false
                };
                return _this;
            }
            PopOverComponent.prototype.targetRef = function (ref) {
                this.target = ref;
            };
            PopOverComponent.prototype.openPopOver = function () {
                var _this = this;
                var onPopOverOpened = this.props.onPopOverOpened;
                lastOpenedInstance === null || lastOpenedInstance === void 0 ? void 0 : lastOpenedInstance.closePopOver();
                lastOpenedInstance = this;
                this.setState({
                    isOpened: true
                }, function () { return onPopOverOpened && onPopOverOpened(_this.props.popOver); });
            };
            PopOverComponent.prototype.closePopOver = function () {
                var _this = this;
                clearTimeout(this.timer);
                if (!this.state.isOpened) {
                    return;
                }
                lastOpenedInstance = null;
                var onPopOverClosed = this.props.onPopOverClosed;
                this.setState({
                    isOpened: false
                }, function () { return onPopOverClosed && onPopOverClosed(_this.props.popOver); });
            };
            PopOverComponent.prototype.closePopOverLater = function () {
                // 5s 后自动关闭。
                this.timer = setTimeout(this.closePopOver, 2000);
            };
            PopOverComponent.prototype.clearCloseTimer = function () {
                clearTimeout(this.timer);
            };
            PopOverComponent.prototype.buildSchema = function () {
                var _a = this.props, popOver = _a.popOver, name = _a.name; _a.label; var __ = _a.translate;
                var schema;
                if (popOver === true) {
                    schema = {
                        type: 'panel',
                        body: "${".concat(name, "}")
                    };
                }
                else if (popOver &&
                    (popOver.mode === 'dialog' || popOver.mode === 'drawer')) {
                    schema = tslib.__assign(tslib.__assign({ actions: [
                            {
                                label: __('Dialog.close'),
                                type: 'button',
                                actionType: 'cancel'
                            }
                        ] }, popOver), { type: popOver.mode });
                }
                else if (typeof popOver === 'string') {
                    schema = {
                        type: 'panel',
                        body: popOver
                    };
                }
                else if (popOver) {
                    schema = tslib.__assign({ type: 'panel' }, popOver);
                }
                return schema || 'error';
            };
            PopOverComponent.prototype.getOffset = function () {
                var popOver = this.props.popOver;
                if (typeof popOver === 'boolean' || !popOver.offset) {
                    return undefined;
                }
                // PopOver 组件接收的 offset 格式为 { x: number, y: number }
                return {
                    x: popOver.offset.left || 0,
                    y: popOver.offset.top || 0
                };
            };
            PopOverComponent.prototype.renderPopOver = function () {
                var _this = this;
                var _a = this.props, popOver = _a.popOver, render = _a.render, popOverContainer = _a.popOverContainer, cx = _a.classnames, ns = _a.classPrefix;
                if (popOver &&
                    (popOver.mode === 'dialog' ||
                        popOver.mode === 'drawer')) {
                    return render('popover-detail', this.buildSchema(), {
                        show: true,
                        onClose: this.closePopOver,
                        onConfirm: this.closePopOver
                    });
                }
                var content = render('popover-detail', this.buildSchema(), {
                    className: cx(popOver.className)
                });
                if (!popOverContainer) {
                    popOverContainer = function () { return ReactDOM.findDOMNode(_this); };
                }
                var position = (popOver && popOver.position) || '';
                var isFixed = /^fixed\-/.test(position);
                return isFixed ? (React__default["default"].createElement(amisCore.RootClose, { disabled: !this.state.isOpened, onRootClose: this.closePopOver }, function (ref) {
                    return (React__default["default"].createElement("div", { className: cx("PopOverAble--fixed PopOverAble--".concat(position)), onMouseLeave: (popOver === null || popOver === void 0 ? void 0 : popOver.trigger) === 'hover'
                            ? _this.closePopOver
                            : undefined, onMouseEnter: (popOver === null || popOver === void 0 ? void 0 : popOver.trigger) === 'hover'
                            ? _this.clearCloseTimer
                            : undefined, ref: ref }, content));
                })) : (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer, placement: position || config.position || 'center', target: function () { return _this.target; }, onHide: this.closePopOver, rootClose: true, show: true },
                    React__default["default"].createElement(amisCore.PopOver, { classPrefix: ns, className: cx('PopOverAble-popover', popOver.popOverClassName), offset: this.getOffset(), onMouseLeave: (popOver === null || popOver === void 0 ? void 0 : popOver.trigger) === 'hover'
                            ? this.closePopOver
                            : undefined, onMouseEnter: (popOver === null || popOver === void 0 ? void 0 : popOver.trigger) === 'hover'
                            ? this.clearCloseTimer
                            : undefined }, content)));
            };
            PopOverComponent.prototype.render = function () {
                var _a = this.props, popOver = _a.popOver, popOverEnabled = _a.popOverEnabled, popOverEnable = _a.popOverEnable, className = _a.className, noHoc = _a.noHoc, cx = _a.classnames; _a.showIcon;
                if (!popOver ||
                    popOverEnabled === false ||
                    noHoc ||
                    popOverEnable === false) {
                    return React__default["default"].createElement(Component, tslib.__assign({}, this.props));
                }
                var triggerProps = {};
                var trigger = popOver === null || popOver === void 0 ? void 0 : popOver.trigger;
                if (trigger === 'hover') {
                    triggerProps.onMouseEnter = this.openPopOver;
                    triggerProps.onMouseLeave = this.closePopOverLater;
                }
                else {
                    triggerProps.onClick = this.openPopOver;
                }
                return (React__default["default"].createElement(Component, tslib.__assign({}, this.props, { className: cx("Field--popOverAble", className, {
                        in: this.state.isOpened
                    }), ref: config.targetOutter ? this.targetRef : undefined }), (popOver === null || popOver === void 0 ? void 0 : popOver.showIcon) !== false ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                    React__default["default"].createElement(Component, tslib.__assign({}, this.props, { wrapperComponent: '', noHoc: true })),
                    React__default["default"].createElement("span", tslib.__assign({ key: "popover-btn", className: cx('Field-popOverBtn') }, triggerProps, { ref: config.targetOutter ? undefined : this.targetRef }),
                        React__default["default"].createElement(amisUi.Icon, { icon: "zoom-in", className: "icon" })),
                    this.state.isOpened ? this.renderPopOver() : null)) : (React__default["default"].createElement(React__default["default"].Fragment, null,
                    React__default["default"].createElement("div", tslib.__assign({ className: cx('Field-popOverWrap') }, triggerProps, { ref: config.targetOutter ? undefined : this.targetRef }),
                        React__default["default"].createElement(Component, tslib.__assign({}, this.props, { wrapperComponent: '', noHoc: true }))),
                    this.state.isOpened ? this.renderPopOver() : null))));
            };
            PopOverComponent.ComposedComponent = Component;
            return PopOverComponent;
        }(React__default["default"].Component));
        hoistNonReactStatic__default["default"](PopOverComponent, Component);
        return PopOverComponent;
    };
};

exports.HocPopOver = HocPopOver;
exports["default"] = HocPopOver;
