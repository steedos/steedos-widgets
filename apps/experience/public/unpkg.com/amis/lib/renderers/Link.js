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

var LinkCmpt = /** @class */ (function (_super) {
    tslib.__extends(LinkCmpt, _super);
    function LinkCmpt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkCmpt.prototype.handleClick = function (e) {
        var _a = this.props, env = _a.env, href = _a.href, blank = _a.blank, body = _a.body;
        env === null || env === void 0 ? void 0 : env.tracker({
            eventType: 'url',
            // 需要和 action 里命名一致方便后续分析
            eventData: { url: href, blank: blank, label: body }
        }, this.props);
    };
    LinkCmpt.prototype.getHref = function () { };
    LinkCmpt.prototype.render = function () {
        var _a = this.props, className = _a.className, body = _a.body, href = _a.href; _a.classnames; var blank = _a.blank, disabled = _a.disabled, htmlTarget = _a.htmlTarget, data = _a.data, render = _a.render, __ = _a.translate, title = _a.title, icon = _a.icon, rightIcon = _a.rightIcon;
        var value = (typeof href === 'string' && href
            ? amisCore.filter(href, data, '| raw')
            : undefined) || amisCore.getPropValue(this.props);
        return (React__default["default"].createElement(amisUi.Link, { className: className, href: value, disabled: disabled, title: title, htmlTarget: htmlTarget || (blank ? '_blank' : '_self'), icon: icon, rightIcon: rightIcon, onClick: this.handleClick }, body ? render('body', body) : value || __('link')));
    };
    LinkCmpt.defaultProps = {
        blank: true,
        disabled: false,
        htmlTarget: ''
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], LinkCmpt.prototype, "handleClick", null);
    return LinkCmpt;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(LinkFieldRenderer, _super);
    function LinkFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'link'
        })
        // @ts-ignore 类型没搞定
        ,
        amisUi.withBadge
    ], LinkFieldRenderer);
    return LinkFieldRenderer;
})(LinkCmpt));

exports.LinkCmpt = LinkCmpt;
