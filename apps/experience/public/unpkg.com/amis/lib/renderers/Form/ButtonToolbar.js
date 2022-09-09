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

var ButtonToolbar = /** @class */ (function (_super) {
    tslib.__extends(ButtonToolbar, _super);
    function ButtonToolbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 这个方法editor里要用作hack，所以不能删掉这个方法
     * @returns
     */
    ButtonToolbar.prototype.renderButtons = function () {
        var _a = this.props, render = _a.render; _a.classPrefix; var buttons = _a.buttons;
        return Array.isArray(buttons)
            ? buttons.map(function (button, key) {
                return render("button/".concat(key), button, {
                    key: key
                });
            })
            : null;
    };
    ButtonToolbar.prototype.render = function () {
        var _a = this.props; _a.buttons; var className = _a.className, cx = _a.classnames; _a.render;
        return (React__default["default"].createElement("div", { className: cx('ButtonToolbar', className) }, this.renderButtons()));
    };
    ButtonToolbar.propsList = ['buttons', 'className'];
    return ButtonToolbar;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ButtonToolbarRenderer, _super);
    function ButtonToolbarRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonToolbarRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'button-toolbar',
            strictMode: false
        })
    ], ButtonToolbarRenderer);
    return ButtonToolbarRenderer;
})(ButtonToolbar));

exports["default"] = ButtonToolbar;
