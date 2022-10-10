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

var LocationControl = /** @class */ (function (_super) {
    tslib.__extends(LocationControl, _super);
    function LocationControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationControl.prototype.render = function () {
        return (React__default["default"].createElement("div", { className: this.props.classnames('LocationControl') },
            React__default["default"].createElement(amisUi.LocationPicker, tslib.__assign({}, this.props, { ak: amisCore.filter(this.props.ak, this.props.data) }))));
    };
    LocationControl.defaultProps = {
        vendor: 'baidu',
        coordinatesType: 'bd09'
    };
    return LocationControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(LocationRenderer, _super);
    function LocationRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'location-picker'
        })
    ], LocationRenderer);
    return LocationRenderer;
})(LocationControl));

exports.LocationControl = LocationControl;
