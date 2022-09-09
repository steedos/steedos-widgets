/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var HeadCellSearchDropDown = /** @class */ (function (_super) {
    tslib.__extends(HeadCellSearchDropDown, _super);
    function HeadCellSearchDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.formItems = [];
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
                name: 'order',
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
                    item.name !== 'order' &&
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
    HeadCellSearchDropDown.prototype.handleAction = function (e, action, ctx, confirm) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onAction, data, dispatchEvent, name, values, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onAction = _a.onAction, data = _a.data, dispatchEvent = _a.dispatchEvent, name = _a.name;
                        if (action.actionType === 'cancel' || action.actionType === 'close') {
                            confirm();
                            return [2 /*return*/];
                        }
                        if (action.actionType === 'reset') {
                            confirm();
                            this.handleReset();
                            return [2 /*return*/];
                        }
                        values = tslib.__assign({}, data);
                        this.formItems.forEach(function (key) { return amisCore.setVariable(values, key, undefined); });
                        return [4 /*yield*/, dispatchEvent('columnSearch', amisCore.createObject(data, {
                                searchName: name,
                                searchValue: values
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onAction && onAction(e, action, ctx);
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellSearchDropDown.prototype.handleReset = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onSearch, data, name, store, values;
            return tslib.__generator(this, function (_b) {
                _a = this.props, onSearch = _a.onSearch, data = _a.data, name = _a.name, store = _a.store;
                values = tslib.__assign({}, data);
                this.formItems.forEach(function (key) { return amisCore.setVariable(values, key, undefined); });
                if (values.orderBy === name) {
                    values.orderBy = '';
                    values.order = 'asc';
                }
                store.updateQuery(values);
                onSearch && onSearch(values);
                return [2 /*return*/];
            });
        });
    };
    HeadCellSearchDropDown.prototype.handleSubmit = function (values, confirm) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onSearch, name, store, dispatchEvent, data, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onSearch = _a.onSearch, name = _a.name, store = _a.store, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        if (values.order) {
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
                        store.updateQuery(values);
                        onSearch && onSearch(values);
                        confirm();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellSearchDropDown.prototype.isActive = function () {
        var _a = this.props, data = _a.data, name = _a.name, orderBy = _a.orderBy;
        return ((orderBy && orderBy === name) || this.formItems.some(function (key) { return data === null || data === void 0 ? void 0 : data[key]; }));
    };
    HeadCellSearchDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, name = _a.name, data = _a.data, searchable = _a.searchable, store = _a.store, orderBy = _a.orderBy, popOverContainer = _a.popOverContainer, ns = _a.classPrefix, cx = _a.classnames;
        var formSchema = this.buildSchema();
        var isActive = this.isActive();
        return (React__default["default"].createElement(amisUi.HeadCellDropDown, { className: "".concat(ns, "TableCell-searchBtn"), layerClassName: cx("".concat(ns, "TableCell-searchPopOver"), searchable.className), active: isActive, filterIcon: React__default["default"].createElement(amisUi.Icon, { icon: "search", className: "icon" }), popOverContainer: popOverContainer ? popOverContainer : function () { return ReactDOM.findDOMNode(_this); }, filterDropdown: function (_a) {
                _a.setSelectedKeys; _a.selectedKeys; var confirm = _a.confirm; _a.clearFilters;
                return render('quick-search-form', formSchema, {
                    data: tslib.__assign(tslib.__assign({}, data), { orderBy: orderBy, order: orderBy && orderBy === name ? store.order : '' }),
                    onSubmit: function (values) { return _this.handleSubmit(values, confirm); },
                    onAction: function (e, action, ctx) {
                        _this.handleAction(e, action, ctx, confirm);
                    }
                });
            } }));
    };
    return HeadCellSearchDropDown;
}(React__default["default"].Component));

exports.HeadCellSearchDropDown = HeadCellSearchDropDown;
