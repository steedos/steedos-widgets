/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var mapValues = require('lodash/mapValues');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var mapValues__default = /*#__PURE__*/_interopDefaultLegacy(mapValues);

var WebComponent = /** @class */ (function (_super) {
    tslib.__extends(WebComponent, _super);
    function WebComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebComponent.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, render = _a.render;
        return body ? render('body', body) : null;
    };
    WebComponent.prototype.render = function () {
        var _a = this.props, tag = _a.tag, props = _a.props, data = _a.data;
        var propsValues = mapValues__default["default"](props, function (s) {
            if (typeof s === 'string') {
                return amisCore.resolveVariableAndFilter(s, data, '| raw') || s;
            }
            else {
                return s;
            }
        });
        var Component = tag || 'div';
        return React__default["default"].createElement(Component, tslib.__assign({}, propsValues), this.renderBody());
    };
    return WebComponent;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(WebComponentRenderer, _super);
    function WebComponentRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebComponentRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'web-component'
        })
    ], WebComponentRenderer);
    return WebComponentRenderer;
})(WebComponent));

exports["default"] = WebComponent;
