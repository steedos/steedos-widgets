/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Panel = /** @class */ (function (_super) {
    tslib.__extends(Panel, _super);
    function Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.affixDom = React__default["default"].createRef();
        _this.footerDom = React__default["default"].createRef();
        return _this;
    }
    Panel.prototype.componentDidMount = function () {
        var dom = ReactDOM.findDOMNode(this);
        var parent = dom ? amisCore.getScrollParent(dom) : null;
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        parent.addEventListener('scroll', this.affixDetect);
        this.unSensor = amisCore.resizeSensor(dom, this.affixDetect);
        this.affixDetect();
    };
    Panel.prototype.componentWillUnmount = function () {
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        this.unSensor && this.unSensor();
        clearTimeout(this.timer);
    };
    Panel.prototype.affixDetect = function () {
        var _a, _b;
        if (!this.props.affixFooter ||
            !this.affixDom.current ||
            !this.footerDom.current) {
            return;
        }
        var affixDom = this.affixDom.current;
        var footerDom = this.footerDom.current;
        var offsetBottom = (_b = (_a = this.props.affixOffsetBottom) !== null && _a !== void 0 ? _a : this.props.env.affixOffsetBottom) !== null && _b !== void 0 ? _b : 0;
        var affixed = false;
        if (footerDom.offsetWidth) {
            affixDom.style.cssText = "bottom: ".concat(offsetBottom, "px;width: ").concat(footerDom.offsetWidth, "px");
        }
        else {
            this.timer = setTimeout(this.affixDetect, 250);
            return;
        }
        if (this.props.affixFooter === 'always') {
            affixed = true;
            footerDom.classList.add('invisible2');
        }
        else {
            var clip = footerDom.getBoundingClientRect();
            var clientHeight = window.innerHeight;
            // affixed = clip.top + clip.height / 2 > clientHeight;
            affixed = clip.bottom > clientHeight - offsetBottom;
        }
        affixed ? affixDom.classList.add('in') : affixDom.classList.remove('in');
    };
    Panel.prototype.renderBody = function () {
        var _a = this.props; _a.type; _a.className; var data = _a.data; _a.header; var body = _a.body, render = _a.render; _a.bodyClassName; _a.headerClassName; _a.actionsClassName; _a.footerClassName; var children = _a.children; _a.title; _a.actions; _a.footer; _a.classPrefix; var formMode = _a.formMode, formHorizontal = _a.formHorizontal, subFormMode = _a.subFormMode, subFormHorizontal = _a.subFormHorizontal, rest = tslib.__rest(_a, ["type", "className", "data", "header", "body", "render", "bodyClassName", "headerClassName", "actionsClassName", "footerClassName", "children", "title", "actions", "footer", "classPrefix", "formMode", "formHorizontal", "subFormMode", "subFormHorizontal"]);
        var subProps = tslib.__assign(tslib.__assign({ data: data }, rest), { formMode: subFormMode || formMode, formHorizontal: subFormHorizontal || formHorizontal });
        return children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body, subProps)
                : null;
    };
    Panel.prototype.renderActions = function () {
        var _a = this.props, actions = _a.actions, render = _a.render;
        if (Array.isArray(actions) && actions.length) {
            return actions.map(function (action, key) {
                return render('action', action, {
                    type: action.type || 'button',
                    key: key
                });
            });
        }
        return null;
    };
    Panel.prototype.render = function () {
        var _a = this.props; _a.type; var className = _a.className, data = _a.data, header = _a.header; _a.body; var render = _a.render, bodyClassName = _a.bodyClassName, headerClassName = _a.headerClassName, actionsClassName = _a.actionsClassName, footerClassName = _a.footerClassName, footerWrapClassName = _a.footerWrapClassName; _a.children; var title = _a.title, footer = _a.footer, affixFooter = _a.affixFooter, ns = _a.classPrefix, cx = _a.classnames, rest = tslib.__rest(_a, ["type", "className", "data", "header", "body", "render", "bodyClassName", "headerClassName", "actionsClassName", "footerClassName", "footerWrapClassName", "children", "title", "footer", "affixFooter", "classPrefix", "classnames"]);
        var subProps = tslib.__assign({ data: data }, rest);
        var footerDoms = [];
        var actions = this.renderActions();
        actions &&
            footerDoms.push(React__default["default"].createElement("div", { key: "actions", className: cx("Panel-btnToolbar", actionsClassName || "Panel-footer") }, actions));
        footer &&
            footerDoms.push(React__default["default"].createElement("div", { key: "footer", className: cx(footerClassName || "Panel-footer") }, render('footer', footer, subProps)));
        var footerDom = footerDoms.length ? (React__default["default"].createElement("div", { className: cx('Panel-footerWrap', footerWrapClassName), ref: this.footerDom }, footerDoms)) : null;
        return (React__default["default"].createElement("div", { className: cx("Panel", className || "Panel--default") },
            header ? (React__default["default"].createElement("div", { className: cx(headerClassName || "Panel-heading") }, render('header', header, subProps))) : title ? (React__default["default"].createElement("div", { className: cx(headerClassName || "Panel-heading") },
                React__default["default"].createElement("h3", { className: cx("Panel-title") }, render('title', title, subProps)))) : null,
            React__default["default"].createElement("div", { className: bodyClassName || "".concat(ns, "Panel-body") }, this.renderBody()),
            footerDom,
            affixFooter && footerDoms.length ? (React__default["default"].createElement("div", { ref: this.affixDom, className: cx('Panel-fixedBottom Panel-footerWrap', footerWrapClassName) }, footerDoms)) : null));
    };
    Panel.propsList = [
        'header',
        'actions',
        'children',
        'headerClassName',
        'footerClassName',
        'footerWrapClassName',
        'actionsClassName',
        'bodyClassName'
    ];
    Panel.defaultProps = {
    // className: 'Panel--default',
    // headerClassName: 'Panel-heading',
    // footerClassName: 'Panel-footer bg-light lter Wrapper',
    // actionsClassName: 'Panel-footer',
    // bodyClassName: 'Panel-body'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Panel.prototype, "affixDetect", null);
    return Panel;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(PanelRenderer, _super);
    function PanelRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PanelRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'panel'
        })
    ], PanelRenderer);
    return PanelRenderer;
})(Panel));

exports["default"] = Panel;
