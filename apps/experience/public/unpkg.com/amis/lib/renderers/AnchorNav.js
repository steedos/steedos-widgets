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
var find = require('lodash/find');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var AnchorNav = /** @class */ (function (_super) {
    tslib.__extends(AnchorNav, _super);
    function AnchorNav(props) {
        var _this = _super.call(this, props) || this;
        // 设置默认激活项
        var links = props.links;
        var active = 0;
        if (typeof props.active !== 'undefined') {
            active = props.active;
        }
        else {
            var section = find__default["default"](links, function (section) { return section.href === props.active; });
            active =
                section && section.href
                    ? section.href
                    : (links[0] && links[0].href) || 0;
        }
        _this.state = {
            active: active
        };
        return _this;
    }
    AnchorNav.prototype.handleSelect = function (key) {
        this.setState({
            active: key
        });
    };
    AnchorNav.prototype.locateTo = function (index) {
        var links = this.props.links;
        Array.isArray(links) &&
            links[index] &&
            this.setState({
                active: links[index].href || index
            });
    };
    AnchorNav.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, ns = _a.classPrefix, className = _a.className, linkClassName = _a.linkClassName, sectionClassName = _a.sectionClassName, direction = _a.direction, sectionRender = _a.sectionRender, render = _a.render, data = _a.data;
        var links = this.props.links;
        if (!links) {
            return null;
        }
        links = Array.isArray(links) ? links : [links];
        var children = [];
        children = links.map(function (section, index) {
            return amisCore.isVisible(section, data) ? (React__default["default"].createElement(amisUi.AnchorNavSection, tslib.__assign({}, section, { title: amisCore.filter(section.title, data), key: index, name: section.href || index }), _this.renderSection
                ? _this.renderSection(section, _this.props, index)
                : sectionRender
                    ? sectionRender(section, _this.props, index)
                    : render("section/".concat(index), section.body || ''))) : null;
        });
        return (React__default["default"].createElement(amisUi.AnchorNav, { classPrefix: ns, classnames: cx, className: className, linkClassName: linkClassName, sectionClassName: sectionClassName, onSelect: this.handleSelect, active: this.state.active, direction: direction }, children));
    };
    AnchorNav.defaultProps = {
        className: '',
        linkClassName: '',
        sectionClassName: ''
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], AnchorNav.prototype, "handleSelect", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", void 0)
    ], AnchorNav.prototype, "locateTo", null);
    return AnchorNav;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(AnchorNavRenderer, _super);
    function AnchorNavRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnchorNavRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'anchor-nav'
        })
    ], AnchorNavRenderer);
    return AnchorNavRenderer;
})(AnchorNav));

exports["default"] = AnchorNav;
