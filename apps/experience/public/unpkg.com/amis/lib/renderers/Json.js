/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var JsonView = require('react-json-view');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var JsonView__default = /*#__PURE__*/_interopDefaultLegacy(JsonView);

var JSONField = /** @class */ (function (_super) {
    tslib.__extends(JSONField, _super);
    function JSONField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONField.prototype.emitChange = function (e) {
        var _a = this.props, onChange = _a.onChange, name = _a.name;
        if (!name || !onChange) {
            return false;
        }
        onChange(e.updated_src, name);
        return true;
    };
    JSONField.prototype.shouldExpandNode = function (_a) {
        var namespace = _a.namespace;
        var levelExpand = this.props.levelExpand;
        if (typeof levelExpand !== 'number') {
            return false;
        }
        return namespace.length > levelExpand;
    };
    JSONField.prototype.render = function () {
        var _a;
        var _b;
        var _c = this.props, className = _c.className, jsonTheme = _c.jsonTheme, cx = _c.classnames, placeholder = _c.placeholder, source = _c.source; _c.levelExpand; var mutable = _c.mutable, displayDataTypes = _c.displayDataTypes, enableClipboard = _c.enableClipboard, iconStyle = _c.iconStyle, quotesOnKeys = _c.quotesOnKeys, sortKeys = _c.sortKeys, name = _c.name, ellipsisThreshold = _c.ellipsisThreshold;
        var value = amisCore.getPropValue(this.props);
        var data = value;
        if (source !== undefined && amisCore.isPureVariable(source)) {
            data = amisCore.resolveVariableAndFilter(source, this.props.data, '| raw');
        }
        else if (typeof value === 'string') {
            // 尝试解析 json
            try {
                data = JSON.parse(value);
            }
            catch (e) { }
        }
        var jsonThemeValue = jsonTheme;
        if (amisCore.isPureVariable(jsonTheme)) {
            jsonThemeValue = amisCore.resolveVariableAndFilter(jsonTheme, this.props.data, '| raw');
        }
        // JsonView 只支持对象，所以不是对象格式需要转成对象格式。
        if (data && ~['string', 'number'].indexOf(typeof data)) {
            data = (_a = {},
                _a[typeof data] = data,
                _a);
        }
        return (React__default["default"].createElement("div", { className: cx('JsonField', className) }, typeof data === 'undefined' || data === null ? (placeholder) : (React__default["default"].createElement(JsonView__default["default"], { name: false, src: data, theme: (_b = jsonThemeValue) !== null && _b !== void 0 ? _b : 'rjv-default', shouldCollapse: this.shouldExpandNode, enableClipboard: enableClipboard, displayDataTypes: displayDataTypes, collapseStringsAfterLength: ellipsisThreshold, iconStyle: iconStyle, quotesOnKeys: quotesOnKeys, sortKeys: sortKeys, onEdit: name && mutable ? this.emitChange : false, onDelete: name && mutable ? this.emitChange : false, onAdd: name && mutable ? this.emitChange : false }))));
    };
    JSONField.defaultProps = {
        placeholder: '-',
        levelExpand: 1,
        source: '',
        displayDataTypes: false,
        enableClipboard: false,
        iconStyle: 'square',
        quotesOnKeys: true,
        sortKeys: false,
        ellipsisThreshold: false
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], JSONField.prototype, "emitChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], JSONField.prototype, "shouldExpandNode", null);
    return JSONField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(JSONFieldRenderer, _super);
    function JSONFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'json'
        })
    ], JSONFieldRenderer);
    return JSONFieldRenderer;
})(JSONField));

exports.JSONField = JSONField;
