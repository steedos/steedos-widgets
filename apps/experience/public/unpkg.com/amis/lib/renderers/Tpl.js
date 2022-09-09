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

var Tpl = /** @class */ (function (_super) {
    tslib.__extends(Tpl, _super);
    function Tpl(props) {
        var _this = _super.call(this, props) || this;
        _this.htmlRef = _this.htmlRef.bind(_this);
        return _this;
    }
    Tpl.prototype.componentDidUpdate = function (prevProps) {
        if (amisCore.anyChanged(['data', 'tpl', 'html', 'text', 'raw', 'value'], this.props, prevProps)) {
            this._render();
        }
    };
    Tpl.prototype.htmlRef = function (dom) {
        this.dom = dom;
        this._render();
    };
    Tpl.prototype.getContent = function () {
        var _a = this.props, tpl = _a.tpl, html = _a.html, text = _a.text, raw = _a.raw, data = _a.data, placeholder = _a.placeholder;
        var value = amisCore.getPropValue(this.props);
        if (raw) {
            return raw;
        }
        else if (html) {
            return amisCore.filter(html, data);
        }
        else if (tpl) {
            return amisCore.filter(tpl, data);
        }
        else if (text) {
            return amisCore.escapeHtml(amisCore.filter(text, data));
        }
        else {
            return value == null || value === ''
                ? "<span class=\"text-muted\">".concat(placeholder, "</span>")
                : typeof value === 'string'
                    ? value
                    : JSON.stringify(value);
        }
    };
    Tpl.prototype._render = function () {
        if (!this.dom) {
            return;
        }
        this.dom.firstChild.innerHTML = this.props.env.filterHtml(this.getContent());
    };
    Tpl.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, inline = _a.inline, cx = _a.classnames, style = _a.style, showNativeTitle = _a.showNativeTitle, data = _a.data;
        var Component = wrapperComponent || (inline ? 'span' : 'div');
        var content = this.getContent();
        return (React__default["default"].createElement(Component, tslib.__assign({ ref: this.htmlRef, className: cx('TplField', className), style: amisCore.buildStyle(style, data) }, (showNativeTitle
            ? { title: typeof content === 'string' ? content : '' }
            : {})),
            React__default["default"].createElement("span", null, content)));
    };
    Tpl.defaultProps = {
        inline: true,
        placeholder: ''
    };
    return Tpl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TplRenderer, _super);
    function TplRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TplRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)(?:tpl|html)$/,
            name: 'tpl'
        })
        // @ts-ignore 类型没搞定
        ,
        amisUi.withBadge
    ], TplRenderer);
    return TplRenderer;
})(Tpl));

exports.Tpl = Tpl;
