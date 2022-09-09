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

var Divider = /** @class */ (function (_super) {
    tslib.__extends(Divider, _super);
    function Divider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Divider.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, lineStyle = _a.lineStyle;
        return (React__default["default"].createElement("div", { className: cx('Divider', lineStyle ? "Divider--".concat(lineStyle) : '', className) }));
    };
    Divider.defaultProps = {
        className: '',
        lineStyle: 'dashed'
    };
    return Divider;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(DividerRenderer, _super);
    function DividerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DividerRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'divider'
        })
    ], DividerRenderer);
    return DividerRenderer;
})(Divider));

exports["default"] = Divider;
