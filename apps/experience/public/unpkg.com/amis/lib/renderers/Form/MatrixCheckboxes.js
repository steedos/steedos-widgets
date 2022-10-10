/**
 * amis v2.3.0
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

/**
 * @file filter
 * @author fex
 */
var MatrixCheckbox = /** @class */ (function (_super) {
    tslib.__extends(MatrixCheckbox, _super);
    function MatrixCheckbox(props) {
        var _this = _super.call(this, props) || this;
        _this.mounted = false;
        _this.state = {
            columns: props.columns || [],
            rows: props.rows || [],
            loading: false
        };
        _this.toggleItem = _this.toggleItem.bind(_this);
        _this.reload = _this.reload.bind(_this);
        _this.initOptions = _this.initOptions.bind(_this);
        _this.mounted = true;
        return _this;
    }
    MatrixCheckbox.prototype.componentDidMount = function () {
        var _a = this.props, formInited = _a.formInited, addHook = _a.addHook;
        formInited || !addHook ? this.reload() : addHook(this.initOptions, 'init');
    };
    MatrixCheckbox.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.columns !== props.columns || prevProps.rows !== props.rows) {
            this.setState({
                columns: props.columns || [],
                rows: props.rows || []
            });
        }
        else if (props.formInited &&
            (props.source !== prevProps.source || prevProps.data !== props.data)) {
            var prevApi = amisCore.buildApi(prevProps.source, prevProps.data, {
                ignoreData: true
            });
            var nextApi = amisCore.buildApi(props.source, props.data, {
                ignoreData: true
            });
            if (prevApi.url !== nextApi.url && amisCore.isValidApi(nextApi.url)) {
                this.reload();
            }
        }
    };
    MatrixCheckbox.prototype.componentWillUnmount = function () {
        this.mounted = false;
        var removeHook = this.props.removeHook;
        removeHook === null || removeHook === void 0 ? void 0 : removeHook(this.initOptions, 'init');
    };
    MatrixCheckbox.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    MatrixCheckbox.prototype.initOptions = function (data) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, formItem, name;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.reload()];
                    case 1:
                        _b.sent();
                        _a = this.props, formItem = _a.formItem, name = _a.name;
                        if (!formItem) {
                            return [2 /*return*/];
                        }
                        if (formItem.value) {
                            amisCore.setVariable(data, name, formItem.value);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MatrixCheckbox.prototype.reload = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, source, data, env, onChange, __;
            var _this = this;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, source = _a.source, data = _a.data, env = _a.env, onChange = _a.onChange, __ = _a.translate;
                        if (!amisCore.isEffectiveApi(source, data) || this.state.loading) {
                            return [2 /*return*/];
                        }
                        if (!env || !env.fetcher) {
                            throw new Error('fetcher is required');
                        }
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                if (!_this.mounted) {
                                    return resolve();
                                }
                                _this.setState({
                                    loading: true
                                }, function () {
                                    if (!_this.mounted) {
                                        return resolve();
                                    }
                                    env
                                        .fetcher(source, data)
                                        .then(function (ret) {
                                        if (!ret.ok) {
                                            throw new Error(ret.msg || __('fetchFailed'));
                                        }
                                        if (!_this.mounted) {
                                            return resolve();
                                        }
                                        _this.setState({
                                            loading: false,
                                            rows: ret.data.rows || [],
                                            columns: ret.data.columns || []
                                        }, function () {
                                            source && source.replaceData;
                                            var value = ret.data.value;
                                            if (value) {
                                                value = source.replaceData
                                                    ? value
                                                    : mergeValue(value, _this.state.columns, _this.state.rows);
                                                onChange(value);
                                            }
                                            resolve();
                                        });
                                    })
                                        .catch(function (reason) {
                                        return _this.setState({
                                            error: reason,
                                            loading: false
                                        }, function () { return resolve(); });
                                    });
                                });
                            })];
                    case 1: 
                    // todo 优化这块
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    MatrixCheckbox.prototype.toggleItem = function (checked, x, y) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, columns, rows, _b, multiple, singleSelectMode, dispatchEvent, data, value, x2, len, y2, len, y2, len, x2, len2, rendererEvent;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.state, columns = _a.columns, rows = _a.rows;
                        _b = this.props, multiple = _b.multiple, singleSelectMode = _b.singleSelectMode, dispatchEvent = _b.dispatchEvent, data = _b.data;
                        value = this.props.value || buildDefaultValue(columns, rows);
                        if (multiple) {
                            value[x][y] = tslib.__assign(tslib.__assign({}, value[x][y]), { checked: checked });
                        }
                        else if (singleSelectMode === 'row') {
                            for (x2 = 0, len = columns.length; x2 < len; x2++) {
                                value[x2][y] = tslib.__assign(tslib.__assign({}, value[x2][y]), { checked: x === x2 ? checked : !checked });
                            }
                        }
                        else if (singleSelectMode === 'column') {
                            for (y2 = 0, len = rows.length; y2 < len; y2++) {
                                value[x][y2] = tslib.__assign(tslib.__assign({}, value[x][y2]), { checked: y === y2 ? checked : !checked });
                            }
                        }
                        else {
                            // 只剩下 cell 了
                            for (y2 = 0, len = rows.length; y2 < len; y2++) {
                                for (x2 = 0, len2 = columns.length; x2 < len2; x2++) {
                                    value[x2][y2] = tslib.__assign(tslib.__assign({}, value[x2][y2]), { checked: x === x2 && y === y2 ? checked : !checked });
                                }
                            }
                        }
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                value: value.concat()
                            }))];
                    case 1:
                        rendererEvent = _c.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.props.onChange(value.concat());
                        return [2 /*return*/];
                }
            });
        });
    };
    MatrixCheckbox.prototype.renderInput = function () {
        var _this = this;
        var _a = this.state, columns = _a.columns, rows = _a.rows;
        var _b = this.props, rowLabel = _b.rowLabel, disabled = _b.disabled, cx = _b.classnames, multiple = _b.multiple;
        var value = this.props.value || buildDefaultValue(columns, rows);
        return (React__default["default"].createElement("div", { className: cx('Table m-b-none') },
            React__default["default"].createElement("div", { className: cx('Table-content') },
                React__default["default"].createElement("table", { className: cx('Table-table') },
                    React__default["default"].createElement("thead", null,
                        React__default["default"].createElement("tr", null,
                            React__default["default"].createElement("th", null, rowLabel),
                            columns.map(function (column, x) { return (React__default["default"].createElement("th", { key: x, className: "text-center" }, column.label)); }))),
                    React__default["default"].createElement("tbody", null, rows.map(function (row, y) { return (React__default["default"].createElement("tr", { key: y },
                        React__default["default"].createElement("td", null,
                            row.label,
                            row.description || row.desc ? (React__default["default"].createElement("span", { className: "m-l-xs text-muted text-xs" }, row.description || row.desc)) : null),
                        columns.map(function (column, x) { return (React__default["default"].createElement("td", { key: x, className: "text-center" },
                            React__default["default"].createElement(amisUi.Checkbox, { type: multiple ? 'checkbox' : 'radio', disabled: disabled, checked: !!(value[x] && value[x][y] && value[x][y].checked), onChange: function (checked) {
                                    return _this.toggleItem(checked, x, y);
                                } }))); }))); }))))));
    };
    MatrixCheckbox.prototype.render = function () {
        var _a = this.props, className = _a.className; _a.render; var cx = _a.classnames;
        var _b = this.state, error = _b.error, loading = _b.loading;
        return (React__default["default"].createElement("div", { key: "input", className: cx('MatrixControl', className || '') },
            error ? (React__default["default"].createElement("div", { className: cx('MatrixControl-error Alert Alert--danger') }, String(error))) : (this.renderInput()),
            React__default["default"].createElement(amisUi.Spinner, { size: "lg", overlay: true, key: "info", show: loading })));
    };
    MatrixCheckbox.defaultProps = {
        columns: [],
        rows: [],
        multiple: true,
        singleSelectMode: 'column' // multiple 为 false 时有效。
    };
    return MatrixCheckbox;
}(React__default["default"].Component));
function buildDefaultValue(columns, rows) {
    if (!Array.isArray(columns)) {
        columns = [];
    }
    if (!Array.isArray(rows)) {
        rows = [];
    }
    return columns.map(function (column) {
        return rows.map(function (row) { return (tslib.__assign(tslib.__assign(tslib.__assign({}, row), column), { checked: false })); });
    });
}
function mergeValue(value, columns, rows) {
    return value.map(function (column, x) {
        return column.map(function (item, y) { return (tslib.__assign(tslib.__assign(tslib.__assign({}, columns[x]), rows[y]), item)); });
    });
}
/** @class */ ((function (_super) {
    tslib.__extends(MatrixRenderer, _super);
    function MatrixRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatrixRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'matrix-checkboxes',
            strictMode: false,
            sizeMutable: false
        })
    ], MatrixRenderer);
    return MatrixRenderer;
})(MatrixCheckbox));

exports["default"] = MatrixCheckbox;
