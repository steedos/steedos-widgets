/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var mapValues = require('lodash/mapValues');
var amisUi = require('amis-ui');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var mapValues__default = /*#__PURE__*/_interopDefaultLegacy(mapValues);

var Portlet = /** @class */ (function (_super) {
    tslib.__extends(Portlet, _super);
    function Portlet(props) {
        var _this = _super.call(this, props) || this;
        var activeKey = props.activeKey || 0;
        _this.state = {
            activeKey: activeKey
        };
        return _this;
    }
    Portlet.prototype.handleSelect = function (key) {
        var _a = this.props, onSelect = _a.onSelect, tabs = _a.tabs;
        if (typeof key === 'number' && key < tabs.length) {
            this.setState({
                activeKey: key
            });
        }
        if (typeof onSelect === 'string') {
            var selectFunc = amisCore.str2AsyncFunction(onSelect, 'key', 'props');
            selectFunc && selectFunc(key, this.props);
        }
        else if (typeof onSelect === 'function') {
            onSelect(key, this.props);
        }
    };
    Portlet.prototype.renderToolbarItem = function (toolbar) {
        var render = this.props.render;
        var actions = [];
        if (Array.isArray(toolbar)) {
            toolbar.forEach(function (action, index) {
                return actions.push(render("toolbar/".concat(index), tslib.__assign({ type: 'button', level: 'link', size: 'sm' }, action), {
                    key: index
                }));
            });
        }
        return actions;
    };
    Portlet.prototype.renderToolbar = function () {
        var _a = this.props, toolbar = _a.toolbar, cx = _a.classnames, ns = _a.classPrefix, tabs = _a.tabs;
        var activeKey = this.state.activeKey;
        var tabToolbar = null;
        var tabToolbarTpl = null;
        // tabs里的toolbar
        var toolbarTpl = toolbar ? (React__default["default"].createElement("div", { className: cx("".concat(ns, "toolbar")) }, this.renderToolbarItem(toolbar))) : null;
        // tab里的toolbar
        if (typeof activeKey !== 'undefined') {
            tabToolbar = tabs[activeKey].toolbar;
            tabToolbarTpl = tabToolbar ? (React__default["default"].createElement("div", { className: cx("".concat(ns, "tab-toolbar")) }, this.renderToolbarItem(tabToolbar))) : null;
        }
        return toolbarTpl || tabToolbarTpl ? (React__default["default"].createElement("div", { className: cx("".concat(ns, "Portlet-toolbar")) },
            toolbarTpl,
            tabToolbarTpl)) : null;
    };
    Portlet.prototype.renderDesc = function () {
        var _a = this.props, descTpl = _a.description; _a.render; var cx = _a.classnames, ns = _a.classPrefix, data = _a.data;
        var desc = amisCore.filter(descTpl, data);
        return desc ? (React__default["default"].createElement("span", { className: cx("".concat(ns, "Portlet-header-desc")) }, desc)) : null;
    };
    Portlet.prototype.renderTabs = function () {
        var _a;
        var _this = this;
        var _b = this.props, cx = _b.classnames, ns = _b.classPrefix, tabsClassName = _b.tabsClassName, contentClassName = _b.contentClassName, linksClassName = _b.linksClassName, tabRender = _b.tabRender, render = _b.render, data = _b.data, dMode = _b.mode, tabsMode = _b.tabsMode, unmountOnExit = _b.unmountOnExit, source = _b.source, mountOnEnter = _b.mountOnEnter, scrollable = _b.scrollable, __ = _b.translate, addBtnText = _b.addBtnText, divider = _b.divider;
        var mode = tabsMode || dMode;
        var arr = amisCore.resolveVariable(source, data);
        var tabs = this.props.tabs;
        if (!tabs) {
            return null;
        }
        tabs = Array.isArray(tabs) ? tabs : [tabs];
        var children = [];
        var tabClassname = cx("".concat(ns, "Portlet-tab"), tabsClassName, (_a = {},
            _a['unactive-select'] = tabs.length <= 1,
            _a['no-divider'] = !divider,
            _a));
        if (Array.isArray(arr)) {
            arr.forEach(function (value, index) {
                var ctx = amisCore.createObject(data, amisCore.isObject(value) ? tslib.__assign({ index: index }, value) : { item: value, index: index });
                children.push.apply(children, tabs.map(function (tab, tabIndex) {
                    return amisCore.isVisible(tab, ctx) ? (React__default["default"].createElement(amisUi.Tab, tslib.__assign({}, tab, { title: amisCore.filter(tab.title, ctx), disabled: amisCore.isDisabled(tab, ctx), key: "".concat(index * 1000 + tabIndex), eventKey: index * 1000 + tabIndex, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                            ? tab.reload
                            : typeof tab.unmountOnExit === 'boolean'
                                ? tab.unmountOnExit
                                : unmountOnExit }), render("item/".concat(index, "/").concat(tabIndex), (tab === null || tab === void 0 ? void 0 : tab.type) ? tab : tab.tab || tab.body, {
                        data: ctx
                    }))) : null;
                }));
            });
        }
        else {
            children = tabs.map(function (tab, index) {
                return amisCore.isVisible(tab, data) ? (React__default["default"].createElement(amisUi.Tab, tslib.__assign({}, tab, { title: amisCore.filter(tab.title, data), disabled: amisCore.isDisabled(tab, data), key: index, eventKey: index, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                        ? tab.reload
                        : typeof tab.unmountOnExit === 'boolean'
                            ? tab.unmountOnExit
                            : unmountOnExit }), _this.renderTab
                    ? _this.renderTab(tab, _this.props, index)
                    : tabRender
                        ? tabRender(tab, _this.props, index)
                        : render("tab/".concat(index), (tab === null || tab === void 0 ? void 0 : tab.type) ? tab : tab.tab || tab.body))) : null;
            });
        }
        return (React__default["default"].createElement(amisUi.Tabs, { addBtnText: __(addBtnText || 'add'), classPrefix: ns, classnames: cx, mode: mode, className: tabClassname, contentClassName: contentClassName, linksClassName: linksClassName, activeKey: this.state.activeKey, onSelect: this.handleSelect, toolbar: this.renderToolbar(), additionBtns: this.renderDesc(), scrollable: scrollable }, children));
    };
    Portlet.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, data = _b.data, cx = _b.classnames, ns = _b.classPrefix, style = _b.style, hideHeader = _b.hideHeader;
        var portletClassname = cx("".concat(ns, "Portlet"), className, (_a = {},
            _a['no-header'] = hideHeader,
            _a));
        var styleVar = typeof style === 'string'
            ? amisCore.resolveVariable(style, data) || {}
            : mapValues__default["default"](style, function (s) { return amisCore.resolveVariable(s, data) || s; });
        return (React__default["default"].createElement("div", { className: portletClassname, style: styleVar }, this.renderTabs()));
    };
    Portlet.defaultProps = {
        className: '',
        mode: 'line',
        divider: true
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", void 0)
    ], Portlet.prototype, "handleSelect", null);
    return Portlet;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(PortletRenderer, _super);
    function PortletRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PortletRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'portlet'
        })
    ], PortletRenderer);
    return PortletRenderer;
})(Portlet));

exports.Portlet = Portlet;
