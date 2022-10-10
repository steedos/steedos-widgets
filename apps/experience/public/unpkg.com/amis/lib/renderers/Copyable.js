/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var hoistNonReactStatic = require('hoist-non-react-statics');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

/**
 * @file scoped.jsx.
 * @author fex
 */
var HocCopyable = function () {
    return function (Component) {
        var QuickEditComponent = /** @class */ (function (_super) {
            tslib.__extends(QuickEditComponent, _super);
            function QuickEditComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            QuickEditComponent.prototype.handleClick = function (content) {
                var _a = this.props, env = _a.env, copyFormat = _a.copyFormat;
                env.copy && env.copy(content, { format: copyFormat });
            };
            QuickEditComponent.prototype.render = function () {
                var _a = this.props, copyable = _a.copyable, name = _a.name, className = _a.className, data = _a.data, noHoc = _a.noHoc, cx = _a.classnames, __ = _a.translate;
                if (copyable && !noHoc) {
                    var content = amisCore.filter(copyable.content ||
                        '${' + name + ' | raw }', data);
                    if (content) {
                        return (React__default["default"].createElement(Component, tslib.__assign({}, this.props, { className: cx("Field--copyable", className) }),
                            React__default["default"].createElement(Component, tslib.__assign({}, this.props, { wrapperComponent: '', noHoc: true })),
                            React__default["default"].createElement(amisUi.TooltipWrapper, { placement: "right", tooltip: '点击复制', trigger: "hover" },
                                React__default["default"].createElement("a", { key: "edit-btn", "data-tooltip": __('Copyable.tip'), className: cx('Field-copyBtn'), onClick: this.handleClick.bind(this, content) },
                                    React__default["default"].createElement(amisUi.Icon, { icon: "copy", className: "icon" })))));
                    }
                }
                return React__default["default"].createElement(Component, tslib.__assign({}, this.props));
            };
            QuickEditComponent.ComposedComponent = Component;
            return QuickEditComponent;
        }(React__default["default"].PureComponent));
        hoistNonReactStatic__default["default"](QuickEditComponent, Component);
        return QuickEditComponent;
    };
};

exports.HocCopyable = HocCopyable;
exports["default"] = HocCopyable;
