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
var ReactDOM = require('react-dom');
var xor = require('lodash/xor');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var xor__default = /*#__PURE__*/_interopDefaultLegacy(xor);

var HeadCellFilterDropDown = /** @class */ (function (_super) {
    tslib.__extends(HeadCellFilterDropDown, _super);
    function HeadCellFilterDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            filterOptions: []
        };
        _this.sourceInvalid = false;
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        return _this;
    }
    HeadCellFilterDropDown.prototype.componentDidMount = function () {
        var _a;
        var _b = this.props, filterable = _b.filterable; _b.name; _b.store;
        if (filterable.source) {
            this.fetchOptions();
        }
        else if (((_a = filterable.options) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.setState({
                filterOptions: this.alterOptions(filterable.options)
            });
        }
    };
    HeadCellFilterDropDown.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a, _b, _c, _d;
        var name = this.props.name;
        var props = this.props;
        if (prevProps.name !== props.name ||
            prevProps.filterable !== props.filterable ||
            prevProps.data !== props.data) {
            if (props.filterable.source) {
                this.sourceInvalid = amisCore.isApiOutdated(prevProps.filterable.source, props.filterable.source, prevProps.data, props.data);
            }
            else if (props.filterable.options) {
                this.setState({
                    filterOptions: this.alterOptions(props.filterable.options || [])
                });
            }
            else if (name &&
                !this.state.filterOptions.length &&
                (Array.isArray((_a = props.store) === null || _a === void 0 ? void 0 : _a.data.itemsRaw) ||
                    Array.isArray((_b = props.store) === null || _b === void 0 ? void 0 : _b.data.items))) {
                var itemsRaw = ((_c = props.store) === null || _c === void 0 ? void 0 : _c.data.itemsRaw) || ((_d = props.store) === null || _d === void 0 ? void 0 : _d.data.items);
                var values_1 = [];
                itemsRaw.forEach(function (item) {
                    var value = amisCore.getVariable(item, name);
                    if (!~values_1.indexOf(value)) {
                        values_1.push(value);
                    }
                });
                if (values_1.length) {
                    this.setState({
                        filterOptions: this.alterOptions(values_1)
                    });
                }
            }
        }
        var value = this.props.data ? this.props.data[name] : undefined;
        var prevValue = prevProps.data ? prevProps.data[name] : undefined;
        if (value !== prevValue &&
            this.state.filterOptions.length &&
            prevState.filterOptions !== this.props.filterOptions) {
            this.setState({
                filterOptions: this.alterOptions(this.state.filterOptions)
            });
        }
        this.sourceInvalid && this.fetchOptions();
    };
    HeadCellFilterDropDown.prototype.fetchOptions = function () {
        var _this = this;
        var _a = this.props, env = _a.env, filterable = _a.filterable, data = _a.data;
        if (!amisCore.isEffectiveApi(filterable.source, data)) {
            return;
        }
        var api = amisCore.normalizeApi(filterable.source);
        api.cache = 3000; // 开启 3s 缓存，因为固顶位置渲染1次会额外多次请求。
        env.fetcher(api, data).then(function (ret) {
            var options = (ret.data && ret.data.options) || [];
            _this.setState({
                filterOptions: ret && ret.data && _this.alterOptions(options)
            });
        });
    };
    HeadCellFilterDropDown.prototype.alterOptions = function (options) {
        var _this = this;
        var _a = this.props, data = _a.data, filterable = _a.filterable, name = _a.name;
        var filterValue = data && typeof data[name] !== 'undefined' ? data[name] : '';
        options = amisCore.normalizeOptions(options);
        if (filterable.multiple) {
            options = options.map(function (option) { return (tslib.__assign(tslib.__assign({}, option), { selected: filterValue.split(',').indexOf(option.value) > -1 })); });
        }
        else {
            options = options.map(function (option) { return (tslib.__assign(tslib.__assign({}, option), { selected: _this.optionComparator(option, filterValue) })); });
        }
        return options;
    };
    HeadCellFilterDropDown.prototype.optionComparator = function (option, selected) {
        var filterable = this.props.filterable;
        /**
         * 无论是否严格模式，需要考虑CRUD开启syncLocation后，参数值会被转化为string的情况：
         * 数字类需要特殊处理，如果两边都为数字类时才进行比较，否则不相等，排除 1 == true 这种情况
         */
        if (amisCore.isNumeric(option.value)) {
            return amisCore.isNumeric(selected) ? option.value == selected : false;
        }
        return (filterable === null || filterable === void 0 ? void 0 : filterable.strictMode) === true
            ? option.value === selected
            : option.value == selected;
    };
    HeadCellFilterDropDown.prototype.handleClickOutside = function () {
        this.close();
    };
    HeadCellFilterDropDown.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    HeadCellFilterDropDown.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    HeadCellFilterDropDown.prototype.handleClick = function (value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onQuery, name, data, dispatchEvent, rendererEvent;
            var _b;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, onQuery = _a.onQuery, name = _a.name, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('columnFilter', amisCore.createObject(data, {
                                filterName: name,
                                filterValue: value
                            }))];
                    case 1:
                        rendererEvent = _c.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onQuery((_b = {},
                            _b[name] = value,
                            _b));
                        this.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellFilterDropDown.prototype.handleCheck = function (value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, data, name, onQuery, dispatchEvent, query, rendererEvent;
            var _b;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, data = _a.data, name = _a.name, onQuery = _a.onQuery, dispatchEvent = _a.dispatchEvent;
                        if (data[name] && data[name] === value) {
                            query = '';
                        }
                        else {
                            query =
                                (data[name] && xor__default["default"](data[name].split(','), [value]).join(',')) || value;
                        }
                        return [4 /*yield*/, dispatchEvent('columnFilter', amisCore.createObject(data, {
                                filterName: name,
                                filterValue: query
                            }))];
                    case 1:
                        rendererEvent = _c.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onQuery((_b = {},
                            _b[name] = query,
                            _b));
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellFilterDropDown.prototype.handleReset = function () {
        var _a;
        var _b = this.props, name = _b.name, onQuery = _b.onQuery;
        onQuery((_a = {},
            _a[name] = undefined,
            _a));
        this.close();
    };
    HeadCellFilterDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.state, isOpened = _a.isOpened, filterOptions = _a.filterOptions;
        var _b = this.props, data = _b.data, name = _b.name, filterable = _b.filterable, popOverContainer = _b.popOverContainer, ns = _b.classPrefix, cx = _b.classnames, __ = _b.translate;
        return (React__default["default"].createElement("span", { className: cx("".concat(ns, "TableCell-filterBtn"), data && typeof data[name] !== 'undefined' ? 'is-active' : '') },
            React__default["default"].createElement("span", { onClick: this.open },
                React__default["default"].createElement(amisUi.Icon, { icon: "column-filter", className: "icon" })),
            isOpened ? (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer || (function () { return ReactDOM.findDOMNode(_this); }), placement: "left-bottom-left-top right-bottom-right-top", target: popOverContainer ? function () { return ReactDOM.findDOMNode(_this).parentNode; } : null, show: true },
                React__default["default"].createElement(amisCore.PopOver, { classPrefix: ns, onHide: this.close, className: cx("".concat(ns, "TableCell-filterPopOver"), filterable.className), overlay: true }, filterOptions && filterOptions.length > 0 ? (React__default["default"].createElement("ul", { className: cx('DropDown-menu') },
                    !filterable.multiple
                        ? filterOptions.map(function (option, index) { return (React__default["default"].createElement("li", { key: index, className: cx({
                                'is-active': option.selected
                            }), onClick: _this.handleClick.bind(_this, option.value) }, option.label)); })
                        : filterOptions.map(function (option, index) { return (React__default["default"].createElement("li", { key: index },
                            React__default["default"].createElement(amisUi.Checkbox, { classPrefix: ns, onChange: _this.handleCheck.bind(_this, option.value), checked: option.selected }, option.label))); }),
                    filterOptions.some(function (item) { return item.selected; }) ? (React__default["default"].createElement("li", { key: "DropDown-menu-reset", onClick: this.handleReset.bind(this) }, __('reset'))) : null)) : null))) : null));
    };
    return HeadCellFilterDropDown;
}(React__default["default"].Component));

exports.HeadCellFilterDropDown = HeadCellFilterDropDown;
