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

var TagField = /** @class */ (function (_super) {
    tslib.__extends(TagField, _super);
    function TagField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagField.prototype.render = function () {
        var _a = this.props, label = _a.label, icon = _a.icon, displayMode = _a.displayMode, color = _a.color, className = _a.className, closable = _a.closable, data = _a.data, _b = _a.style, style = _b === void 0 ? {} : _b;
        label =
            amisCore.getPropValue(this.props) ||
                (label ? amisCore.resolveVariableAndFilter(label, data, '| raw') : null);
        if (amisCore.isPureVariable(icon)) {
            icon = amisCore.resolveVariableAndFilter(icon, data);
        }
        if (amisCore.isPureVariable(displayMode)) {
            displayMode = amisCore.resolveVariableAndFilter(displayMode, data);
        }
        if (amisCore.isPureVariable(color)) {
            color = amisCore.resolveVariableAndFilter(color, data);
        }
        return (React__default["default"].createElement(amisUi.Tag, { className: className, displayMode: displayMode, color: color, icon: icon, closable: closable, style: style }, label));
    };
    TagField.defaultProps = {
        displayMode: 'normal'
    };
    return TagField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TagFieldRenderer, _super);
    function TagFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'tag'
        })
    ], TagFieldRenderer);
    return TagFieldRenderer;
})(TagField));

exports.TagField = TagField;
