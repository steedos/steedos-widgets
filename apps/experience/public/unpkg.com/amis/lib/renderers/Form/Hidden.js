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

var HiddenControl = /** @class */ (function (_super) {
    tslib.__extends(HiddenControl, _super);
    function HiddenControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HiddenControl.prototype.render = function () {
        return null;
    };
    return HiddenControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(HiddenControlRenderer, _super);
    function HiddenControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HiddenControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'hidden',
            wrap: false,
            sizeMutable: false
        })
    ], HiddenControlRenderer);
    return HiddenControlRenderer;
})(HiddenControl));

exports["default"] = HiddenControl;
