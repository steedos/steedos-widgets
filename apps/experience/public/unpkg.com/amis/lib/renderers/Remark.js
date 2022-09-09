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

function filterContents(tooltip, data) {
    if (typeof tooltip === 'string') {
        return amisCore.filter(tooltip, data);
    }
    else if (tooltip) {
        var title = tooltip.title, content = tooltip.content, body = tooltip.body, rest = tslib.__rest(tooltip, ["title", "content", "body"]);
        return title || content || body
            ? tslib.__assign(tslib.__assign({}, rest), { title: amisCore.filter(title, data), content: content || body ? amisCore.filter(content || body || '', data) : undefined }) : undefined;
    }
    return tooltip;
}
var Remark = /** @class */ (function (_super) {
    tslib.__extends(Remark, _super);
    function Remark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Remark.prototype.showModalTip = function (tooltip) {
        var _a = this.props, onAction = _a.onAction, data = _a.data;
        return function (e) {
            onAction &&
                onAction(e, {
                    actionType: 'dialog',
                    dialog: {
                        title: tooltip && typeof tooltip !== 'string' ? tooltip.title : '',
                        body: tooltip && typeof tooltip !== 'string'
                            ? tooltip.content
                            : tooltip,
                        actions: []
                    }
                }, data);
        };
    };
    Remark.prototype.renderLabel = function (finalIcon, finalLabel, cx, shape) {
        var shapeClass = shape ? "Remark-icon--".concat(shape) : undefined;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            finalLabel ? React__default["default"].createElement("span", null, finalLabel) : null,
            finalIcon ? (amisUi.hasIcon(finalIcon) ? (React__default["default"].createElement("span", { className: cx('Remark-icon', shapeClass) },
                React__default["default"].createElement(amisUi.Icon, { icon: finalIcon }))) : (React__default["default"].createElement("i", { className: cx('Remark-icon', finalIcon) }))) : finalIcon === false && finalLabel ? null : (React__default["default"].createElement("span", { className: cx('Remark-icon icon', shapeClass) },
                React__default["default"].createElement(amisUi.Icon, { icon: "question-mark" })))));
    };
    Remark.prototype.render = function () {
        var _a, _b, _c;
        var _d = this.props, className = _d.className, icon = _d.icon, label = _d.label, shape = _d.shape, tooltip = _d.tooltip, placement = _d.placement, rootClose = _d.rootClose, trigger = _d.trigger, container = _d.container, ns = _d.classPrefix, cx = _d.classnames, content = _d.content, data = _d.data, env = _d.env, tooltipClassName = _d.tooltipClassName, useMobileUI = _d.useMobileUI;
        var finalIcon = (_a = tooltip === null || tooltip === void 0 ? void 0 : tooltip.icon) !== null && _a !== void 0 ? _a : icon;
        var finalLabel = (_b = tooltip === null || tooltip === void 0 ? void 0 : tooltip.label) !== null && _b !== void 0 ? _b : label;
        var finalShape = (_c = tooltip === null || tooltip === void 0 ? void 0 : tooltip.shape) !== null && _c !== void 0 ? _c : shape;
        var parsedTip = filterContents(tooltip || content, data);
        // 移动端使用弹框提示
        if (amisCore.isMobile() && useMobileUI) {
            return (React__default["default"].createElement("div", { className: cx("Remark", (tooltip && tooltip.className) || className || "Remark--warning"), onClick: this.showModalTip(parsedTip) }, this.renderLabel(finalIcon, finalLabel, cx, finalShape)));
        }
        return (React__default["default"].createElement(amisUi.TooltipWrapper, { classPrefix: ns, classnames: cx, tooltip: parsedTip, tooltipClassName: (tooltip && tooltip.tooltipClassName) || tooltipClassName, placement: (tooltip && tooltip.placement) || placement, rootClose: (tooltip && tooltip.rootClose) || rootClose, trigger: (tooltip && tooltip.trigger) || trigger, container: container || env.getModalContainer, delay: tooltip && tooltip.delay },
            React__default["default"].createElement("div", { className: cx("Remark", (tooltip && tooltip.className) || className || "Remark--warning") }, this.renderLabel(finalIcon, finalLabel, cx, finalShape))));
    };
    Remark.propsList = [];
    Remark.defaultProps = {
        icon: '',
        trigger: ['hover', 'focus']
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Remark.prototype, "showModalTip", null);
    return Remark;
}(React__default["default"].Component));
amisCore.themeable(Remark);
/** @class */ ((function (_super) {
    tslib.__extends(RemarkRenderer, _super);
    function RemarkRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemarkRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'remark'
        })
    ], RemarkRenderer);
    return RemarkRenderer;
})(Remark));

exports.filterContents = filterContents;
