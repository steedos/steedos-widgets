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

var Plain = /** @class */ (function (_super) {
    tslib.__extends(Plain, _super);
    function Plain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Plain.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, text = _a.text, data = _a.data, tpl = _a.tpl, inline = _a.inline, placeholder = _a.placeholder, cx = _a.classnames;
        var value = amisCore.getPropValue(this.props);
        var Component = wrapperComponent || (inline ? 'span' : 'div');
        return (React__default["default"].createElement(Component, { className: cx('PlainField', className) }, tpl || text ? (amisCore.filter(tpl || text, data)) : typeof value === 'undefined' || value === '' || value === null ? (React__default["default"].createElement("span", { className: "text-muted" }, placeholder)) : (String(value))));
    };
    Plain.defaultProps = {
        wrapperComponent: '',
        inline: true,
        placeholder: '-'
    };
    return Plain;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(PlainRenderer, _super);
    function PlainRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlainRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)(?:plain|text)$/,
            name: 'plain'
        })
    ], PlainRenderer);
    return PlainRenderer;
})(Plain));

exports.Plain = Plain;
