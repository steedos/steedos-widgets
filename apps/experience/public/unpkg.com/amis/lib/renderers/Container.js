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

var Container = /** @class */ (function (_super) {
    tslib.__extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container.prototype.renderBody = function () {
        var _a = this.props, children = _a.children, body = _a.body, render = _a.render, cx = _a.classnames, bodyClassName = _a.bodyClassName, disabled = _a.disabled;
        return (React__default["default"].createElement("div", { className: cx('Container-body', bodyClassName) }, children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body, { disabled: disabled })
                : null));
    };
    Container.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent; _a.size; var cx = _a.classnames, style = _a.style, data = _a.data;
        var Component = wrapperComponent || 'div';
        return (React__default["default"].createElement(Component, { className: cx('Container', className), style: amisCore.buildStyle(style, data) }, this.renderBody()));
    };
    Container.propsList = ['body', 'className'];
    Container.defaultProps = {
        className: ''
    };
    return Container;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ContainerRenderer, _super);
    function ContainerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContainerRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'container'
        })
    ], ContainerRenderer);
    return ContainerRenderer;
})(Container));

exports["default"] = Container;
