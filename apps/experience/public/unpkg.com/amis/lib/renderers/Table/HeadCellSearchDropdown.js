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
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var HeadCellSearchDropDown = /** @class */ (function (_super) {
    tslib.__extends(HeadCellSearchDropDown, _super);
    function HeadCellSearchDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false
        };
        _this.formItems = [];
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        return _this;
    }
    HeadCellSearchDropDown.prototype.buildSchema = function () {
        var _a;
        var _b = this.props, searchable = _b.searchable, sortable = _b.sortable, name = _b.name, label = _b.label, __ = _b.translate;
        var schema;
        if (searchable === true) {
            schema = {
                title: '',
                controls: [
                    {
                        type: 'text',
                        name: name,
                        placeholder: label,
                        clearable: true
                    }
                ]
            };
        }
        else if (searchable) {
            if (searchable.controls || searchable.tabs || searchable.fieldSet) {
                schema = tslib.__assign(tslib.__assign({ title: '' }, searchable), { controls: Array.isArray(searchable.controls)
                        ? searchable.controls.concat()
                        : undefined });
            }
            else {
                schema = {
                    title: '',
                    className: searchable.formClassName,
                    controls: [
                        tslib.__assign({ type: searchable.type || 'text', name: searchable.name || name, placeholder: label }, searchable)
                    ]
                };
            }
        }
        if (schema && schema.controls && sortable) {
            schema.controls.unshift({
                type: 'hidden',
                name: 'orderBy',
                value: name
            }, {
                type: 'button-group',
                name: 'orderDir',
                label: __('sort'),
                options: [
                    {
                        label: __('asc'),
                        value: 'asc'
                    },
                    {
                        label: __('desc'),
                        value: 'desc'
                    }
                ]
            });
        }
        if (schema) {
            var formItems_1 = [];
            (_a = schema.controls) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                return item.name &&
                    item.name !== 'orderBy' &&
                    item.name !== 'orderDir' &&
                    formItems_1.push(item.name);
            });
            this.formItems = formItems_1;
            schema = tslib.__assign(tslib.__assign({}, schema), { type: 'form', wrapperComponent: 'div', actions: [
                    {
                        type: 'button',
                        label: __('reset'),
                        actionType: 'clear-and-submit'
                    },
                    {
                        type: 'button',
                        label: __('cancel'),
                        actionType: 'cancel'
                    },
                    {
                        label: __('search'),
                        type: 'submit',
                        primary: true
                    }
                ] });
        }
        return schema || 'error';
    };
    HeadCellSearchDropDown.prototype.handleClickOutside = function () {
        this.close();
    };
    HeadCellSearchDropDown.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    HeadCellSearchDropDown.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    HeadCellSearchDropDown.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        if (action.actionType === 'cancel' || action.actionType === 'close') {
            this.close();
            return;
        }
        if (action.actionType === 'reset') {
            this.close();
            this.handleReset();
            return;
        }
        onAction && onAction(e, action, ctx);
    };
    HeadCellSearchDropDown.prototype.handleReset = function () {
        var _a = this.props, onQuery = _a.onQuery, data = _a.data, name = _a.name;
        var values = tslib.__assign({}, data);
        this.formItems.forEach(function (key) { return amisCore.setVariable(values, key, undefined); });
        if (values.orderBy === name) {
            values.orderBy = '';
            values.orderDir = 'asc';
        }
        onQuery(values);
    };
    HeadCellSearchDropDown.prototype.handleSubmit = function (values) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onQuery, name, data, dispatchEvent, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onQuery = _a.onQuery, name = _a.name, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        if (values.orderDir) {
                            values = tslib.__assign(tslib.__assign({}, values), { orderBy: name });
                        }
                        return [4 /*yield*/, dispatchEvent('columnSearch', amisCore.createObject(data, {
                                searchName: name,
                                searchValue: values
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.close();
                        onQuery(values);
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellSearchDropDown.prototype.isActive = function () {
        var _a = this.props, data = _a.data, name = _a.name, orderBy = _a.orderBy;
        return orderBy === name || this.formItems.some(function (key) { return data === null || data === void 0 ? void 0 : data[key]; });
    };
    HeadCellSearchDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, name = _a.name, data = _a.data, searchable = _a.searchable, store = _a.store, orderBy = _a.orderBy, popOverContainer = _a.popOverContainer, ns = _a.classPrefix, cx = _a.classnames;
        var formSchema = this.buildSchema();
        var isActive = this.isActive();
        return (React__default["default"].createElement("span", { className: cx("".concat(ns, "TableCell-searchBtn"), isActive ? 'is-active' : '', this.state.isOpened ? 'is-opened' : '') },
            React__default["default"].createElement("span", { onClick: this.open },
                React__default["default"].createElement(amisUi.Icon, { icon: "search", className: "icon" })),
            this.state.isOpened ? (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer || (function () { return ReactDOM.findDOMNode(_this); }), placement: "left-bottom-left-top right-bottom-right-top", target: popOverContainer ? function () { return ReactDOM.findDOMNode(_this).parentNode; } : null, show: true },
                React__default["default"].createElement(amisCore.PopOver, { classPrefix: ns, onHide: this.close, className: cx("".concat(ns, "TableCell-searchPopOver"), searchable.className), overlay: true }, render('quick-search-form', formSchema, {
                    data: tslib.__assign(tslib.__assign({}, data), { orderBy: orderBy, orderDir: orderBy === name ? store.orderDir : '' }),
                    onSubmit: this.handleSubmit,
                    onAction: this.handleAction
                })))) : null));
    };
    return HeadCellSearchDropDown;
}(React__default["default"].Component));

exports.HeadCellSearchDropDown = HeadCellSearchDropDown;
