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

var TooltipWrapper = /** @class */ (function (_super) {
    tslib.__extends(TooltipWrapper, _super);
    function TooltipWrapper(props) {
        return _super.call(this, props) || this;
    }
    TooltipWrapper.prototype.renderBody = function () {
        var _a = this.props, render = _a.render, cx = _a.classnames, body = _a.body, className = _a.className, wrapperComponent = _a.wrapperComponent, inline = _a.inline, style = _a.style, data = _a.data; _a.wrap;
        var Comp = wrapperComponent ||
            (inline ? 'span' : 'div');
        return (React__default["default"].createElement(Comp, { className: cx('TooltipWrapper', className, {
                'TooltipWrapper--inline': inline
            }), style: amisCore.buildStyle(style, data) }, render('body', body)));
    };
    TooltipWrapper.prototype.render = function () {
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames, tooltipClassName = _a.tooltipClassName, tooltipTheme = _a.tooltipTheme, container = _a.container, placement = _a.placement, rootClose = _a.rootClose, tooltipStyle = _a.tooltipStyle, title = _a.title, content = _a.content, tooltip = _a.tooltip, mouseEnterDelay = _a.mouseEnterDelay, mouseLeaveDelay = _a.mouseLeaveDelay, trigger = _a.trigger, offset = _a.offset, showArrow = _a.showArrow, disabled = _a.disabled, enterable = _a.enterable, data = _a.data, env = _a.env;
        var tooltipObj = {
            title: amisCore.filter(title, data),
            content: amisCore.filter(content || tooltip, data),
            style: amisCore.buildStyle(tooltipStyle, data),
            placement: placement,
            trigger: trigger,
            rootClose: rootClose,
            container: container !== undefined ? container : (env && env.getModalContainer ? env.getModalContainer : undefined),
            tooltipTheme: tooltipTheme,
            tooltipClassName: tooltipClassName,
            mouseEnterDelay: mouseEnterDelay,
            mouseLeaveDelay: mouseLeaveDelay,
            offset: offset,
            showArrow: showArrow,
            disabled: disabled,
            enterable: enterable
        };
        return (React__default["default"].createElement(amisUi.TooltipWrapper, { classPrefix: ns, classnames: cx, tooltip: tooltipObj }, this.renderBody()));
    };
    TooltipWrapper.defaultProps = {
        placement: 'top',
        trigger: 'hover',
        rootClose: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 200,
        inline: false,
        wrap: false,
        tooltipTheme: 'light'
    };
    return TooltipWrapper;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TooltipWrapperRenderer, _super);
    function TooltipWrapperRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TooltipWrapperRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'tooltip-wrapper'
        })
    ], TooltipWrapperRenderer);
    return TooltipWrapperRenderer;
})(TooltipWrapper));

exports["default"] = TooltipWrapper;
