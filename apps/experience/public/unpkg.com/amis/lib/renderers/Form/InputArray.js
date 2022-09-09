/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var Combo = require('./Combo.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var InputArrayControl = /** @class */ (function (_super) {
    tslib.__extends(InputArrayControl, _super);
    function InputArrayControl(props) {
        var _this = _super.call(this, props) || this;
        _this.comboRef = _this.comboRef.bind(_this);
        return _this;
    }
    InputArrayControl.prototype.comboRef = function (ref) {
        this.comboInstance = ref;
    };
    InputArrayControl.prototype.validate = function (args) {
        var _a;
        return this.comboInstance ? (_a = this.comboInstance).validate.apply(_a, args) : null;
    };
    InputArrayControl.prototype.render = function () {
        var _a = this.props, items = _a.items, rest = tslib.__rest(_a, ["items"]);
        return (React__default["default"].createElement(Combo["default"], tslib.__assign({}, rest, { items: [items], flat: true, multiple: true, multiLine: false, ref: this.comboRef })));
    };
    return InputArrayControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ArrayControlRenderer, _super);
    function ArrayControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-array',
            storeType: amisCore.ComboStore.name
        })
    ], ArrayControlRenderer);
    return ArrayControlRenderer;
})(InputArrayControl));

exports["default"] = InputArrayControl;
