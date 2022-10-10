/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var merge = require('lodash/merge');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

var StatusField = /** @class */ (function (_super) {
    tslib.__extends(StatusField, _super);
    function StatusField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusField.prototype.render = function () {
        var _a, _b;
        var _c = this.props, className = _c.className, placeholder = _c.placeholder, cx = _c.classnames, data = _c.data;
        var map = merge__default["default"](StatusField.defaultProps.map, (_a = this.props) === null || _a === void 0 ? void 0 : _a.map);
        var labelMap = merge__default["default"](StatusField.defaultProps.labelMap, (_b = this.props) === null || _b === void 0 ? void 0 : _b.labelMap);
        var value = amisCore.getPropValue(this.props);
        var viewValue = (React__default["default"].createElement("span", { className: "text-muted", key: "status-value" }, placeholder));
        var wrapClassName = '';
        if (value != undefined && value !== '' && map) {
            if (typeof value === 'boolean') {
                value = value ? 1 : 0;
            }
            else if (/^\d+$/.test(value)) {
                value = parseInt(value, 10) || 0;
            }
            wrapClassName = "StatusField--".concat(value);
            var itemClassName = amisCore.filter(map[value], data) || '';
            var svgIcon_1 = '';
            itemClassName = itemClassName.replace(/\bsvg-([^\s|$]+)\b/g, function (_, icon) {
                svgIcon_1 = icon;
                return 'icon';
            });
            if (svgIcon_1) {
                viewValue = (React__default["default"].createElement(amisUi.Icon, { icon: svgIcon_1, className: cx('Status-icon icon', itemClassName), key: "icon" }));
            }
            else if (itemClassName) {
                viewValue = (React__default["default"].createElement("i", { className: cx('Status-icon', itemClassName), key: "icon" }));
            }
            if (labelMap && labelMap[value]) {
                viewValue = [
                    viewValue,
                    React__default["default"].createElement("span", { className: cx('StatusField-label'), key: "label" }, amisCore.filter(labelMap[value], data))
                ];
            }
        }
        return (React__default["default"].createElement("span", { className: cx('StatusField', wrapClassName, className) }, viewValue));
    };
    StatusField.defaultProps = {
        placeholder: '-',
        map: {
            0: 'svg-fail',
            1: 'svg-check-circle',
            success: 'svg-check-circle',
            pending: 'rolling',
            fail: 'svg-fail',
            queue: 'svg-warning',
            schedule: 'svg-schedule'
        },
        labelMap: {
            success: '成功',
            pending: '运行中',
            fail: '失败',
            queue: '排队中',
            schedule: '调度中'
        }
    };
    return StatusField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(StatusFieldRenderer, _super);
    function StatusFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'status'
        })
    ], StatusFieldRenderer);
    return StatusFieldRenderer;
})(StatusField));

exports.StatusField = StatusField;
