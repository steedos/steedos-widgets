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

/**
 * @file 简化版 Flex 布局，主要用于不熟悉 CSS 的开发者
 */
var Flex = /** @class */ (function (_super) {
    tslib.__extends(Flex, _super);
    function Flex(props) {
        return _super.call(this, props) || this;
    }
    Flex.prototype.render = function () {
        var _a = this.props, items = _a.items, direction = _a.direction, justify = _a.justify, alignItems = _a.alignItems, alignContent = _a.alignContent, style = _a.style, className = _a.className, render = _a.render, disabled = _a.disabled;
        var flexStyle = tslib.__assign({ display: 'flex', flexDirection: direction, justifyContent: justify, alignItems: alignItems, alignContent: alignContent }, style);
        return (React__default["default"].createElement("div", { style: flexStyle, className: className }, (Array.isArray(items) ? items : items ? [items] : []).map(function (item, key) {
            var _a;
            return render("flexItem/".concat(key), item, {
                key: "flexItem/".concat(key),
                disabled: (_a = item === null || item === void 0 ? void 0 : item.disabled) !== null && _a !== void 0 ? _a : disabled
            });
        })));
    };
    Flex.defaultProps = {
        direction: 'row',
        justify: 'center',
        alignItems: 'center',
        alignContent: 'center'
    };
    return Flex;
}(React__default["default"].Component));
var FlexItem = /** @class */ (function (_super) {
    tslib.__extends(FlexItem, _super);
    function FlexItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexItem.prototype.renderBody = function () {
        var _a = this.props, children = _a.children, body = _a.body, render = _a.render, disabled = _a.disabled;
        return children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body, { disabled: disabled })
                : null;
    };
    FlexItem.prototype.render = function () {
        var _a = this.props, className = _a.className; _a.size; _a.classnames; var style = _a.style;
        return (React__default["default"].createElement("div", { className: className, style: style }, this.renderBody()));
    };
    FlexItem.propsList = ['body', 'className', 'children'];
    return FlexItem;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(FlexRenderer, _super);
    function FlexRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'flex'
        })
    ], FlexRenderer);
    return FlexRenderer;
})(Flex));
/** @class */ ((function (_super) {
    tslib.__extends(FlexItemRenderer, _super);
    function FlexItemRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexItemRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'flex-item'
        })
    ], FlexItemRenderer);
    return FlexItemRenderer;
})(FlexItem));

exports.FlexItem = FlexItem;
exports["default"] = Flex;
