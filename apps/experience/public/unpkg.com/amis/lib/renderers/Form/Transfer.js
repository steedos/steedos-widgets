/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var find = require('lodash/find');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var BaseTransferRenderer = /** @class */ (function (_super) {
    tslib.__extends(BaseTransferRenderer, _super);
    function BaseTransferRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseTransferRenderer.prototype.reload = function () {
        var reloadOptions = this.props.reloadOptions;
        reloadOptions === null || reloadOptions === void 0 ? void 0 : reloadOptions();
    };
    BaseTransferRenderer.prototype.handleChange = function (value, optionModified) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onChange, joinValues, delimiter, valueField, extractValue, options, dispatchEvent, setOptions, newValue, newOptions, indexes, origin_1, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, joinValues = _a.joinValues, delimiter = _a.delimiter, valueField = _a.valueField, extractValue = _a.extractValue, options = _a.options, dispatchEvent = _a.dispatchEvent, setOptions = _a.setOptions;
                        newValue = value;
                        newOptions = options.concat();
                        if (Array.isArray(value)) {
                            newValue = value.map(function (item) {
                                var indexes = amisCore.findTreeIndex(options, amisCore.optionValueCompare(item[valueField || 'value'], valueField || 'value'));
                                if (!indexes) {
                                    newOptions.push(item);
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
                            indexes = amisCore.findTreeIndex(options, amisCore.optionValueCompare(value[valueField || 'value'], valueField || 'value'));
                            if (!indexes) {
                                newOptions.push(value);
                            }
                            else if (optionModified) {
                                origin_1 = amisCore.getTree(newOptions, indexes);
                                newOptions = amisCore.spliceTree(newOptions, indexes, 1, tslib.__assign(tslib.__assign({}, origin_1), value));
                            }
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
    BaseTransferRenderer.prototype.option2value = function (option) {
        return option;
    };
    BaseTransferRenderer.prototype.handleSearch = function (term, cancelExecutor) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, searchApi, options, labelField, valueField, env, data, __, payload, result, e_1, regexp_1;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, searchApi = _a.searchApi, options = _a.options, labelField = _a.labelField, valueField = _a.valueField, env = _a.env, data = _a.data, __ = _a.translate;
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
    BaseTransferRenderer.prototype.handleResultSearch = function (term, item) {
        var valueField = this.props.valueField;
        var regexp = amisCore.string2regExp(term);
        return regexp.test(item[valueField || 'value']);
    };
    BaseTransferRenderer.prototype.optionItemRender = function (option, states) {
        var _a = this.props, menuTpl = _a.menuTpl, render = _a.render, data = _a.data;
        if (menuTpl) {
            return render("item/".concat(states.index), menuTpl, {
                data: amisCore.createObject(amisCore.createObject(data, states), option)
            });
        }
        return amisUi.Selection.itemRender(option, states);
    };
    BaseTransferRenderer.prototype.resultItemRender = function (option, states) {
        var _a = this.props, valueTpl = _a.valueTpl, render = _a.render, data = _a.data;
        if (valueTpl) {
            return render("value/".concat(states.index), valueTpl, {
                onChange: states.onChange,
                data: amisCore.createObject(amisCore.createObject(data, states), option)
            });
        }
        return amisUi.ResultList.itemRender(option, states);
    };
    BaseTransferRenderer.prototype.renderCell = function (column, option, colIndex, rowIndex) {
        var _a = this.props, render = _a.render, data = _a.data;
        return render("cell/".concat(colIndex, "/").concat(rowIndex), tslib.__assign({ type: 'text' }, column), {
            value: amisCore.resolveVariable(column.name, option),
            data: amisCore.createObject(data, option)
        });
    };
    BaseTransferRenderer.prototype.getRef = function (ref) {
        while (ref && ref.getWrappedInstance) {
            ref = ref.getWrappedInstance();
        }
        this.tranferRef = ref;
    };
    BaseTransferRenderer.prototype.onSelectAll = function (options) {
        var dispatchEvent = this.props.dispatchEvent;
        dispatchEvent('selectAll', options);
    };
    // 动作
    BaseTransferRenderer.prototype.doAction = function (action, data, throwErrors) {
        var _a;
        var _b = this.props, resetValue = _b.resetValue, onChange = _b.onChange;
        switch (action.actionType) {
            case 'clear':
                onChange === null || onChange === void 0 ? void 0 : onChange('');
                break;
            case 'reset':
                onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
                break;
            case 'selectAll':
                (_a = this.tranferRef) === null || _a === void 0 ? void 0 : _a.selectAll();
                break;
        }
    };
    BaseTransferRenderer.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, selectedOptions = _b.selectedOptions, showArrow = _b.showArrow, sortable = _b.sortable, selectMode = _b.selectMode, columns = _b.columns, loading = _b.loading, searchable = _b.searchable, searchResultMode = _b.searchResultMode, searchResultColumns = _b.searchResultColumns, deferLoad = _b.deferLoad, leftMode = _b.leftMode, rightMode = _b.rightMode, disabled = _b.disabled, selectTitle = _b.selectTitle, resultTitle = _b.resultTitle; _b.menuTpl; var searchPlaceholder = _b.searchPlaceholder, _c = _b.resultListModeFollowSelect, resultListModeFollowSelect = _c === void 0 ? false : _c, resultSearchPlaceholder = _b.resultSearchPlaceholder, _d = _b.resultSearchable, resultSearchable = _d === void 0 ? false : _d, statistics = _b.statistics, labelField = _b.labelField;
        // 目前 LeftOptions 没有接口可以动态加载
        // 为了方便可以快速实现动态化，让选项的第一个成员携带
        // LeftOptions 信息
        var _e = this.props, options = _e.options, leftOptions = _e.leftOptions, leftDefaultValue = _e.leftDefaultValue;
        if (selectMode === 'associated' &&
            options &&
            options.length &&
            options[0].leftOptions &&
            Array.isArray(options[0].children)) {
            leftOptions = options[0].leftOptions;
            leftDefaultValue = (_a = options[0].leftDefaultValue) !== null && _a !== void 0 ? _a : leftDefaultValue;
            options = options[0].children;
        }
        return (React__default["default"].createElement("div", { className: cx('TransferControl', className) },
            React__default["default"].createElement(amisUi.Transfer, { value: selectedOptions, options: options, disabled: disabled, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, showArrow: showArrow, selectMode: selectMode, searchResultMode: searchResultMode, searchResultColumns: searchResultColumns, columns: columns, onSearch: searchable ? this.handleSearch : undefined, onDeferLoad: deferLoad, leftOptions: leftOptions, leftMode: leftMode, rightMode: rightMode, cellRender: this.renderCell, selectTitle: selectTitle, resultTitle: resultTitle, resultListModeFollowSelect: resultListModeFollowSelect, onResultSearch: this.handleResultSearch, searchPlaceholder: searchPlaceholder, resultSearchable: resultSearchable, resultSearchPlaceholder: resultSearchPlaceholder, statistics: statistics, labelField: labelField, optionItemRender: this.optionItemRender, resultItemRender: this.resultItemRender, onSelectAll: this.onSelectAll, onRef: this.getRef }),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, key: "info", show: loading })));
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Boolean]),
        tslib.__metadata("design:returntype", Promise)
    ], BaseTransferRenderer.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "option2value", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Function]),
        tslib.__metadata("design:returntype", Promise)
    ], BaseTransferRenderer.prototype, "handleSearch", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "handleResultSearch", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "optionItemRender", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "resultItemRender", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Number, Number]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "renderCell", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "getRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array]),
        tslib.__metadata("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "onSelectAll", null);
    return BaseTransferRenderer;
}(React__default["default"].Component));
// ts 3.9 里面非得这样才不报错，鬼知道为何。
var TransferRender = /** @class */ (function (_super) {
    tslib.__extends(TransferRender, _super);
    function TransferRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TransferRender;
}(BaseTransferRenderer));
amisCore.OptionsControl({
    type: 'transfer'
})(TransferRender);

exports.BaseTransferRenderer = BaseTransferRenderer;
exports.TransferRender = TransferRender;
