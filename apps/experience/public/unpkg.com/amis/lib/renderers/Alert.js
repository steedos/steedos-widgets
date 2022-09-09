/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var tslib = require('tslib');
var amisCore = require('amis-core');
var React = require('react');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** @class */ ((function (_super) {
    tslib.__extends(TplRenderer, _super);
    function TplRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TplRenderer.prototype.render = function () {
        var _a = this.props, render = _a.render, body = _a.body, level = _a.level, icon = _a.icon, showIcon = _a.showIcon, rest = tslib.__rest(_a, ["render", "body", "level", "icon", "showIcon"]);
        if (amisCore.isPureVariable(level)) {
            level = amisCore.resolveVariableAndFilter(level, this.props.data);
        }
        if (amisCore.isPureVariable(icon)) {
            icon = amisCore.resolveVariableAndFilter(icon, this.props.data);
        }
        if (amisCore.isPureVariable(showIcon)) {
            showIcon = amisCore.resolveVariableAndFilter(showIcon, this.props.data);
        }
        return (React__default["default"].createElement(amisUi.Alert2, tslib.__assign({}, rest, { level: level, icon: icon, showIcon: showIcon }), render('body', body)));
    };
    TplRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'alert'
        })
    ], TplRenderer);
    return TplRenderer;
})(React__default["default"].Component));
