/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var InputGroup = /** @class */ (function (_super) {
    tslib.__extends(InputGroup, _super);
    function InputGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.state = {
            isFocused: false
        };
        return _this;
    }
    InputGroup.prototype.handleFocus = function () {
        this.setState({
            isFocused: true
        });
    };
    InputGroup.prototype.handleBlur = function () {
        this.setState({
            isFocused: false
        });
    };
    InputGroup.prototype.renderControl = function (control, index, otherProps) {
        var _a = this.props, render = _a.render, onChange = _a.onChange;
        if (!control) {
            return null;
        }
        var subSchema = control;
        return render("".concat(index), subSchema, tslib.__assign({ onChange: onChange }, otherProps));
    };
    InputGroup.prototype.validate = function () {
        var formItem = this.props.formItem;
        var errors = [];
        // issue 处理这个，按理不需要这么弄。
        formItem === null || formItem === void 0 ? void 0 : formItem.subFormItems.forEach(function (item) {
            if (item.errors.length) {
                errors.push.apply(errors, item.errors);
            }
        });
        return errors.length ? errors : '';
    };
    InputGroup.prototype.render = function () {
        var _this = this;
        var _a = this.props, body = _a.body, controls = _a.controls, className = _a.className; _a.mode; var horizontal = _a.horizontal; _a.formMode; var formHorizontal = _a.formHorizontal, data = _a.data, cx = _a.classnames;
        var inputs = Array.isArray(controls) ? controls : body;
        if (!Array.isArray(inputs)) {
            inputs = [];
        }
        inputs = inputs.filter(function (item) {
            if (item && (item.hidden || item.visible === false)) {
                return false;
            }
            var exprProps = amisCore.getExprProperties(item || {}, data);
            if (exprProps.hidden || exprProps.visible === false) {
                return false;
            }
            return true;
        });
        var horizontalDeeper = horizontal ||
            (formHorizontal
                ? amisCore.makeHorizontalDeeper(formHorizontal, inputs.length)
                : undefined);
        return (React__default["default"].createElement("div", { className: cx("InputGroup", className, {
                'is-focused': this.state.isFocused
            }) }, inputs.map(function (control, index) {
            var isAddOn = ~[
                'icon',
                'plain',
                'tpl',
                'button',
                'submit',
                'reset'
            ].indexOf(control && control.type);
            var dom = _this.renderControl(control, index, {
                formHorizontal: horizontalDeeper,
                formMode: 'normal',
                inputOnly: true,
                key: index,
                onFocus: _this.handleFocus,
                onBlur: _this.handleBlur
            });
            return isAddOn ? (React__default["default"].createElement("span", { key: index, className: cx(control.addOnclassName, ~['button', 'submit', 'reset'].indexOf(control && control.type)
                    ? 'InputGroup-btn'
                    : 'InputGroup-addOn') }, dom)) : (dom);
        })));
    };
    return InputGroup;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(InputGroupRenderer, _super);
    function InputGroupRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InputGroupRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-group',
            strictMode: false
        })
    ], InputGroupRenderer);
    return InputGroupRenderer;
})(InputGroup));

exports.InputGroup = InputGroup;
