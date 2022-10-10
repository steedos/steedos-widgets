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

var BreadcrumbField = /** @class */ (function (_super) {
    tslib.__extends(BreadcrumbField, _super);
    function BreadcrumbField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbField.prototype.render = function () {
        var _a = this.props, items = _a.items, source = _a.source, data = _a.data, env = _a.env, restProps = tslib.__rest(_a, ["items", "source", "data", "env"]);
        var crumbItems = items
            ? items
            : amisCore.resolveVariableAndFilter(source, data, '| raw');
        crumbItems = crumbItems.map(function (item) {
            if (item.label) {
                item.label = amisCore.filter(item.label, data);
            }
            if (item.href) {
                item.href = amisCore.resolveVariableAndFilter(item.href, data, '| raw');
            }
            if (item.dropdown) {
                item.dropdown = item.dropdown.map(function (dropdownItem) {
                    if (dropdownItem.label) {
                        dropdownItem.label = amisCore.filter(dropdownItem.label, data);
                    }
                    if (dropdownItem.href) {
                        dropdownItem.href = amisCore.resolveVariableAndFilter(dropdownItem.href, data, '| raw');
                    }
                    return dropdownItem;
                });
            }
            return item;
        });
        return (React__default["default"].createElement(amisUi.Breadcrumb, tslib.__assign({ items: crumbItems, tooltipContainer: env === null || env === void 0 ? void 0 : env.getModalContainer }, restProps)));
    };
    return BreadcrumbField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(BreadcrumbFieldRenderer, _super);
    function BreadcrumbFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'breadcrumb'
        })
    ], BreadcrumbFieldRenderer);
    return BreadcrumbFieldRenderer;
})(BreadcrumbField));

exports.BreadcrumbField = BreadcrumbField;
