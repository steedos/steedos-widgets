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

var OperationField = /** @class */ (function (_super) {
    tslib.__extends(OperationField, _super);
    function OperationField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationField.prototype.render = function () {
        var _a = this.props, className = _a.className, buttons = _a.buttons, render = _a.render, cx = _a.classnames;
        return (React__default["default"].createElement("div", { className: cx('OperationField', className) }, Array.isArray(buttons)
            ? buttons.map(function (button, index) {
                return render("".concat(index), tslib.__assign({ type: 'button', size: button.size || 'sm', level: button.level ||
                        (button.icon && !button.label ? 'link' : '') }, button), {
                    key: index
                });
            })
            : null));
    };
    OperationField.propsList = ['buttons', 'label'];
    OperationField.defaultProps = {};
    return OperationField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(OperationFieldRenderer, _super);
    function OperationFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'operation'
        })
    ], OperationFieldRenderer);
    return OperationFieldRenderer;
})(OperationField));

exports.OperationField = OperationField;
