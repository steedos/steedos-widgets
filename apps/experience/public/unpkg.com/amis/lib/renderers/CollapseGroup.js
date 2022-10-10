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

var CollapseGroupRender = /** @class */ (function (_super) {
    tslib.__extends(CollapseGroupRender, _super);
    function CollapseGroupRender(props) {
        return _super.call(this, props) || this;
    }
    CollapseGroupRender.prototype.render = function () {
        var _a = this.props, defaultActiveKey = _a.defaultActiveKey, accordion = _a.accordion, expandIcon = _a.expandIcon, expandIconPosition = _a.expandIconPosition, body = _a.body, className = _a.className, render = _a.render;
        return (React__default["default"].createElement(amisUi.CollapseGroup, { defaultActiveKey: defaultActiveKey, accordion: accordion, expandIcon: expandIcon, expandIconPosition: expandIconPosition, className: className }, render('body', body || '')));
    };
    return CollapseGroupRender;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CollapseGroupRenderer, _super);
    function CollapseGroupRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollapseGroupRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'collapse-group'
        })
    ], CollapseGroupRenderer);
    return CollapseGroupRenderer;
})(CollapseGroupRender));

exports.CollapseGroupRender = CollapseGroupRender;
