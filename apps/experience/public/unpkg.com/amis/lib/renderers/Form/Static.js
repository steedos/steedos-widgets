/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
require('../Table/index.js');
var PopOver = require('../PopOver.js');
var QuickEdit = require('../QuickEdit.js');
var Copyable = require('../Copyable.js');
var omit = require('lodash/omit');
var TableCell = require('../Table/TableCell.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);

var StaticControl = /** @class */ (function (_super) {
    tslib.__extends(StaticControl, _super);
    function StaticControl(props) {
        var _this = _super.call(this, props) || this;
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        return _this;
    }
    StaticControl.prototype.handleQuickChange = function (values, saveImmediately, savePristine, options) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onBulkChange, onAction, data;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onBulkChange = _a.onBulkChange, onAction = _a.onAction, data = _a.data;
                        if (!(saveImmediately && saveImmediately.api)) return [3 /*break*/, 2];
                        return [4 /*yield*/, onAction(null, {
                                actionType: 'ajax',
                                api: saveImmediately.api,
                                reload: options === null || options === void 0 ? void 0 : options.reload
                            }, amisCore.extendObject(data, values), true)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        onBulkChange && onBulkChange(values, saveImmediately === true);
                        return [2 /*return*/];
                }
            });
        });
    };
    StaticControl.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, value = _b.value, label = _b.label, type = _b.type, render = _b.render; _b.children; var data = _b.data, cx = _b.classnames, name = _b.name, disabled = _b.disabled, $schema = _b.$schema, defaultValue = _b.defaultValue, borderMode = _b.borderMode, rest = tslib.__rest(_b, ["className", "value", "label", "type", "render", "children", "data", "classnames", "name", "disabled", "$schema", "defaultValue", "borderMode"]);
        var subType = /^static/.test(type)
            ? type.substring(7) || (rest.tpl ? 'tpl' : 'plain')
            : type;
        var field = tslib.__assign(tslib.__assign({ label: label, name: name }, $schema), { type: subType });
        return (React__default["default"].createElement("div", { className: cx('Form-static', (_a = {},
                _a["Form-static--border".concat(amisCore.ucFirst(borderMode))] = borderMode,
                _a)) },
            React__default["default"].createElement(StaticFieldRenderer, tslib.__assign({}, tslib.__assign(tslib.__assign({}, rest), { name: name, render: render, field: field, value: value === defaultValue ? undefined : value, className: className, onQuickChange: this.handleQuickChange, data: data, disabled: disabled, classnames: cx })))));
    };
    StaticControl.defaultProps = {
        placeholder: '-'
    };
    return StaticControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(StaticControlRenderer, _super);
    function StaticControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            test: /(^|\/)static(\-[^\/]+)?$/,
            weight: -90,
            strictMode: false,
            sizeMutable: false,
            name: 'static'
        })
    ], StaticControlRenderer);
    return StaticControlRenderer;
})(StaticControl));
var StaticFieldRenderer = /** @class */ (function (_super) {
    tslib.__extends(StaticFieldRenderer, _super);
    function StaticFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticFieldRenderer.prototype.render = function () {
        var _a = this.props; _a.type; var className = _a.className, render = _a.render, style = _a.style, Component = _a.wrapperComponent; _a.labelClassName; var value = _a.value, data = _a.data, children = _a.children, width = _a.width, inputClassName = _a.inputClassName; _a.label; var tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, field = _a.field, rest = tslib.__rest(_a, ["type", "className", "render", "style", "wrapperComponent", "labelClassName", "value", "data", "children", "width", "inputClassName", "label", "tabIndex", "onKeyUp", "field"]);
        var schema = tslib.__assign(tslib.__assign({}, field), { className: inputClassName, type: (field && field.type) || 'plain' });
        var body = children
            ? children
            : render('field', schema, tslib.__assign(tslib.__assign({}, omit__default["default"](rest, Object.keys(schema))), { value: value, data: data }));
        if (width) {
            style = style || {};
            style.width = style.width || width;
        }
        if (!Component) {
            return body;
        }
        return (React__default["default"].createElement(Component, { style: style, className: className, tabIndex: tabIndex, onKeyUp: onKeyUp }, body));
    };
    StaticFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, TableCell.TableCell.defaultProps), { wrapperComponent: 'div' });
    StaticFieldRenderer = tslib.__decorate([
        QuickEdit.HocQuickEdit(),
        PopOver.HocPopOver({
            position: 'right'
        }),
        Copyable.HocCopyable()
    ], StaticFieldRenderer);
    return StaticFieldRenderer;
}(TableCell.TableCell));

exports.StaticFieldRenderer = StaticFieldRenderer;
exports["default"] = StaticControl;
