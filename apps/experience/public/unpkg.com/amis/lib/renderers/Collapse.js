/**
 * amis v2.2.0
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

var Collapse = /** @class */ (function (_super) {
    tslib.__extends(Collapse, _super);
    function Collapse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collapse.prototype.render = function () {
        var _a = this.props, id = _a.id, ns = _a.classPrefix, cx = _a.classnames, size = _a.size, wrapperComponent = _a.wrapperComponent, headingComponent = _a.headingComponent, className = _a.className, headingClassName = _a.headingClassName, children = _a.children, titlePosition = _a.titlePosition, headerPosition = _a.headerPosition, title = _a.title, collapseTitle = _a.collapseTitle, collapseHeader = _a.collapseHeader, header = _a.header, body = _a.body, bodyClassName = _a.bodyClassName, render = _a.render, collapsable = _a.collapsable; _a.translate; var mountOnEnter = _a.mountOnEnter, unmountOnExit = _a.unmountOnExit, showArrow = _a.showArrow, expandIcon = _a.expandIcon, disabled = _a.disabled, collapsed = _a.collapsed, propsUpdate = _a.propsUpdate, onCollapse = _a.onCollapse;
        return (React__default["default"].createElement(amisUi.Collapse, { id: id, classnames: cx, classPrefix: ns, mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit, size: size, wrapperComponent: wrapperComponent, headingComponent: headingComponent, className: className, headingClassName: headingClassName, bodyClassName: bodyClassName, headerPosition: titlePosition || headerPosition, collapsable: collapsable, collapsed: collapsed, showArrow: showArrow, disabled: disabled, propsUpdate: propsUpdate, expandIcon: expandIcon
                ? render('arrow-icon', expandIcon || '', {
                    className: cx('Collapse-icon-tranform')
                })
                : null, collapseHeader: collapseTitle || collapseHeader
                ? render('heading', collapseTitle || collapseHeader)
                : null, header: render('heading', title || header || ''), body: children
                ? typeof children === 'function'
                    ? children(this.props)
                    : children
                : body
                    ? render('body', body)
                    : null, onCollapse: onCollapse }));
    };
    return Collapse;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CollapseRenderer, _super);
    function CollapseRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollapseRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'collapse'
        })
    ], CollapseRenderer);
    return CollapseRenderer;
})(Collapse));

exports["default"] = Collapse;
