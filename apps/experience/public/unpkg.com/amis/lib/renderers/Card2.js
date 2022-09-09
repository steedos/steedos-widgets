/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisUi = require('amis-ui');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Card2 = /** @class */ (function (_super) {
    tslib.__extends(Card2, _super);
    function Card2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Card2.prototype.handleClick = function (e) {
        var _a = this.props, checkOnItemClick = _a.checkOnItemClick, selectable = _a.selectable;
        // 控制选中
        if (checkOnItemClick && selectable) {
            this.handleCheck();
        }
        // TODO 触发事件动作
    };
    Card2.prototype.handleCheck = function () {
        var _a, _b;
        (_b = (_a = this.props).onCheck) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    Card2.prototype.renderCheckbox = function () {
        var _a = this.props, selectable = _a.selectable, cx = _a.classnames, multiple = _a.multiple, disabled = _a.disabled, selected = _a.selected, hideCheckToggler = _a.hideCheckToggler, checkOnItemClick = _a.checkOnItemClick, checkboxClassname = _a.checkboxClassname;
        if (!selectable || (checkOnItemClick && hideCheckToggler)) {
            return null;
        }
        return (React__default["default"].createElement(amisUi.Checkbox, { className: cx('Card2-checkbox', checkboxClassname), type: multiple ? 'checkbox' : 'radio', disabled: disabled, checked: selected, onChange: this.handleCheck }));
    };
    /**
     * 渲染内容区
     */
    Card2.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, render = _a.render, cx = _a.classnames, bodyClassName = _a.bodyClassName, rest = tslib.__rest(_a, ["body", "render", "classnames", "bodyClassName"]);
        return (React__default["default"].createElement("div", { className: cx('Card2-body', bodyClassName), onClick: this.handleClick }, body ? render('body', body, rest) : null));
    };
    Card2.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, cx = _a.classnames, style = _a.style, item = _a.item, selected = _a.selected, checkOnItemClick = _a.checkOnItemClick;
        var Component = wrapperComponent || 'div';
        return (React__default["default"].createElement(Component, { className: cx('Card2', className, {
                'checkOnItem': checkOnItemClick,
                'is-checked': selected
            }), style: amisCore.buildStyle(style, item) },
            this.renderBody(),
            this.renderCheckbox()));
    };
    Card2.propsList = ['body', 'className'];
    Card2.defaultProps = {
        className: ''
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Card2.prototype, "handleClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Card2.prototype, "handleCheck", null);
    return Card2;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(Card2Renderer, _super);
    function Card2Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Card2Renderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'card2'
        })
    ], Card2Renderer);
    return Card2Renderer;
})(Card2));

exports["default"] = Card2;
