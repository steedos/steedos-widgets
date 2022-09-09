/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var amisCore = require('amis-core');
var React = require('react');
var find = require('lodash/find');
var amisUi = require('amis-ui');
var Transfer = require('./Transfer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var BaseTabsTransferRenderer = /** @class */ (function (_super) {
    tslib.__extends(BaseTabsTransferRenderer, _super);
    function BaseTabsTransferRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            activeKey: 0
        };
        return _this;
    }
    BaseTabsTransferRenderer.prototype.onTabChange = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var dispatchEvent, rendererEvent;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatchEvent = this.props.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('tab-change', { key: key })];
                    case 1:
                        rendererEvent = _a.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            activeKey: key
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseTabsTransferRenderer.prototype.handleTabSearch = function (term, option, cancelExecutor) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, options, labelField, valueField, env, data, __, searchApi, payload, result, e_1, regexp_1;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, options = _a.options, labelField = _a.labelField, valueField = _a.valueField, env = _a.env, data = _a.data, __ = _a.translate;
                        searchApi = option.searchApi;
                        if (!searchApi) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, env.fetcher(searchApi, amisCore.createObject(data, { term: term }), {
                                cancelExecutor: cancelExecutor
                            })];
                    case 2:
                        payload = _b.sent();
                        if (!payload.ok) {
                            throw new Error(__(payload.msg || 'networkError'));
                        }
                        result = payload.data.options || payload.data.items || payload.data;
                        if (!Array.isArray(result)) {
                            throw new Error(__('CRUD.invalidArray'));
                        }
                        return [2 /*return*/, result.map(function (item) {
                                var resolved = null;
                                var value = item[valueField || 'value'];
                                // 只有 value 值有意义的时候，再去找；否则直接返回
                                if (Array.isArray(options) && value !== null && value !== undefined) {
                                    resolved = find__default["default"](options, amisCore.optionValueCompare(value, valueField));
                                }
                                return resolved || item;
                            })];
                    case 3:
                        e_1 = _b.sent();
                        if (!env.isCancel(e_1)) {
                            env.notify('error', e_1.message);
                        }
                        return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (term) {
                            regexp_1 = amisCore.string2regExp(term);
                            return [2 /*return*/, amisCore.filterTree(options, function (option) {
                                    return !!((Array.isArray(option.children) && option.children.length) ||
                                        (option[valueField || 'value'] &&
                                            (regexp_1.test(option[labelField || 'label']) ||
                                                regexp_1.test(option[valueField || 'value']))));
                                }, 0, true)];
                        }
                        else {
                            return [2 /*return*/, options];
                        }
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BaseTabsTransferRenderer.prototype.handleChange = function (value, optionModified) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onChange, joinValues, delimiter, valueField, extractValue, options, dispatchEvent, setOptions, __, newValue, newOptions, UN_MATCH_RESULT, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, joinValues = _a.joinValues, delimiter = _a.delimiter, valueField = _a.valueField, extractValue = _a.extractValue, options = _a.options, dispatchEvent = _a.dispatchEvent, setOptions = _a.setOptions, __ = _a.translate;
                        newValue = value;
                        newOptions = options.concat();
                        UN_MATCH_RESULT = 'UN_MATCH_RESULT';
                        if (Array.isArray(value)) {
                            newValue = value.map(function (item) {
                                var indexes = amisCore.findTreeIndex(options, amisCore.optionValueCompare(item[valueField || 'value'], valueField || 'value'));
                                // 这里主要是把查询出来的没有匹配的搜索的结果（一般是DEFFER时）聚合在一个分类下
                                if (!indexes) {
                                    var searchIndexes = amisCore.findTreeIndex(newOptions, function (item) { return item.value === UN_MATCH_RESULT; });
                                    if (!searchIndexes) {
                                        newOptions.push({
                                            label: __('searchResult'),
                                            value: UN_MATCH_RESULT,
                                            visible: false,
                                            children: [item]
                                        });
                                    }
                                    else {
                                        var origin_1 = amisCore.getTree(newOptions, searchIndexes);
                                        if (origin_1 === null || origin_1 === void 0 ? void 0 : origin_1.children) {
                                            origin_1.children.push(item);
                                            newOptions = amisCore.spliceTree(newOptions, searchIndexes, 1, tslib.__assign(tslib.__assign({}, origin_1), item));
                                        }
                                    }
                                }
                                else if (optionModified) {
                                    var origin_2 = amisCore.getTree(newOptions, indexes);
                                    newOptions = amisCore.spliceTree(newOptions, indexes, 1, tslib.__assign(tslib.__assign({}, origin_2), item));
                                }
                                return joinValues || extractValue
                                    ? item[valueField || 'value']
                                    : item;
                            });
                            if (joinValues) {
                                newValue = newValue.join(delimiter || ',');
                            }
                        }
                        else if (value) {
                            newValue =
                                joinValues || extractValue
                                    ? value[valueField || 'value']
                                    : value;
                        }
                        (newOptions.length > options.length || optionModified) &&
                            setOptions(newOptions, true);
                        return [4 /*yield*/, dispatchEvent('change', {
                                value: newValue,
                                options: options
                            })];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", Promise)
    ], BaseTabsTransferRenderer.prototype, "onTabChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object, Function]),
        tslib.__metadata("design:returntype", Promise)
    ], BaseTabsTransferRenderer.prototype, "handleTabSearch", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Boolean]),
        tslib.__metadata("design:returntype", Promise)
    ], BaseTabsTransferRenderer.prototype, "handleChange", null);
    return BaseTabsTransferRenderer;
}(Transfer.BaseTransferRenderer));
/** @class */ ((function (_super) {
    tslib.__extends(TabsTransferRenderer, _super);
    function TabsTransferRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabsTransferRenderer.prototype.optionItemRender = function (option, states) {
        var _a = this.props, menuTpl = _a.menuTpl, render = _a.render, data = _a.data;
        var ctx = arguments[2] || {};
        if (menuTpl) {
            return render("item/".concat(states.index), menuTpl, {
                data: amisCore.createObject(amisCore.createObject(data, tslib.__assign(tslib.__assign({}, states), ctx)), option)
            });
        }
        return amisUi.Selection.itemRender(option, states);
    };
    // 动作
    TabsTransferRenderer.prototype.doAction = function (action, args) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var activeKey = args === null || args === void 0 ? void 0 : args.activeKey;
        switch (action.actionType) {
            case 'clear':
                onChange === null || onChange === void 0 ? void 0 : onChange('');
                break;
            case 'reset':
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
                break;
            case 'changeTabKey':
                this.setState({
                    activeKey: activeKey
                });
                break;
        }
    };
    TabsTransferRenderer.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, options = _a.options, selectedOptions = _a.selectedOptions, sortable = _a.sortable, loading = _a.loading, searchResultMode = _a.searchResultMode, showArrow = _a.showArrow, deferLoad = _a.deferLoad, leftDeferLoad = _a.leftDeferLoad, disabled = _a.disabled, selectTitle = _a.selectTitle, resultTitle = _a.resultTitle;
        return (React__default["default"].createElement("div", { className: cx('TabsTransferControl', className) },
            React__default["default"].createElement(amisUi.TabsTransfer, { activeKey: this.state.activeKey, value: selectedOptions, disabled: disabled, options: options, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, searchResultMode: searchResultMode, onSearch: this.handleTabSearch, showArrow: showArrow, onDeferLoad: deferLoad, onLeftDeferLoad: leftDeferLoad, selectTitle: selectTitle, resultTitle: resultTitle, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onTabChange: this.onTabChange }),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, key: "info", show: loading })));
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TabsTransferRenderer.prototype, "optionItemRender", null);
    TabsTransferRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'tabs-transfer'
        })
    ], TabsTransferRenderer);
    return TabsTransferRenderer;
})(BaseTabsTransferRenderer));

exports.BaseTabsTransferRenderer = BaseTabsTransferRenderer;
