/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var cx = require('classnames');
var mobxStateTree = require('mobx-state-tree');
var debouce = require('lodash/debounce');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);
var debouce__default = /*#__PURE__*/_interopDefaultLegacy(debouce);

var EVAL_CACHE = {};
/**
 * ECharts 中有些配置项可以写函数，但 JSON 中无法支持，为了实现这个功能，需要将看起来像函数的字符串转成函数类型
 * 目前 ECharts 中可能有函数的配置项有如下：interval、formatter、color、min、max、labelFormatter、pageFormatter、optionToContent、contentToOption、animationDelay、animationDurationUpdate、animationDelayUpdate、animationDuration、position、sort
 * @param config ECharts 配置
 */
function recoverFunctionType(config) {
    [
        'interval',
        'formatter',
        'color',
        'min',
        'max',
        'labelFormatter',
        'valueFormatter',
        'pageFormatter',
        'optionToContent',
        'contentToOption',
        'animationDelay',
        'animationDurationUpdate',
        'animationDelayUpdate',
        'animationDuration',
        'position',
        'sort',
        'renderItem'
    ].forEach(function (key) {
        var objects = amisCore.findObjectsWithKey(config, key);
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var object = objects_1[_i];
            var code = object[key];
            if (typeof code === 'string' && code.trim().startsWith('function')) {
                try {
                    if (!(code in EVAL_CACHE)) {
                        EVAL_CACHE[code] = eval('(' + code + ')');
                    }
                    object[key] = EVAL_CACHE[code];
                }
                catch (e) {
                    console.warn(code, e);
                }
            }
        }
    });
}
var Chart = /** @class */ (function (_super) {
    tslib.__extends(Chart, _super);
    function Chart(props) {
        var _this = _super.call(this, props) || this;
        _this.refFn = _this.refFn.bind(_this);
        _this.reload = _this.reload.bind(_this);
        _this.reloadEcharts = debouce__default["default"](_this.reloadEcharts.bind(_this), 300); //过于频繁更新 ECharts 会报错
        _this.handleClick = _this.handleClick.bind(_this);
        _this.mounted = true;
        props.config && _this.renderChart(props.config);
        return _this;
    }
    Chart.prototype.componentDidMount = function () {
        var _a = this.props, api = _a.api, data = _a.data, initFetch = _a.initFetch, source = _a.source;
        if (source && amisCore.isPureVariable(source)) {
            var ret = amisCore.resolveVariableAndFilter(source, data, '| raw');
            ret && this.renderChart(ret);
        }
        else if (api && initFetch !== false) {
            this.reload();
        }
    };
    Chart.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (amisCore.isApiOutdated(prevProps.api, props.api, prevProps.data, props.data)) {
            this.reload();
        }
        else if (props.source && amisCore.isPureVariable(props.source)) {
            var prevRet = prevProps.source
                ? amisCore.resolveVariableAndFilter(prevProps.source, prevProps.data, '| raw')
                : null;
            var ret = amisCore.resolveVariableAndFilter(props.source, props.data, '| raw');
            if (prevRet !== ret) {
                this.renderChart(ret || {});
            }
        }
        else if (props.config !== prevProps.config) {
            this.renderChart(props.config || {});
        }
        else if (props.config &&
            props.trackExpression &&
            amisCore.filter(props.trackExpression, props.data) !==
                amisCore.filter(prevProps.trackExpression, prevProps.data)) {
            this.renderChart(props.config || {});
        }
    };
    Chart.prototype.componentWillUnmount = function () {
        this.mounted = false;
        this.reloadEcharts.cancel();
        clearTimeout(this.timer);
    };
    Chart.prototype.handleClick = function (ctx) {
        var _a = this.props, onAction = _a.onAction, clickAction = _a.clickAction, data = _a.data;
        clickAction &&
            onAction &&
            onAction(null, clickAction, amisCore.createObject(data, ctx));
    };
    Chart.prototype.refFn = function (ref) {
        var _this = this;
        var chartRef = this.props.chartRef;
        var _a = this.props, chartTheme = _a.chartTheme, onChartWillMount = _a.onChartWillMount, onChartUnMount = _a.onChartUnMount, env = _a.env;
        var onChartMount = this.props.onChartMount;
        if (ref) {
            Promise.all([
                Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['echarts'], function(mod) {fullfill(tslib.__importStar(mod))})})}),
                Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['echarts-stat'], function(mod) {fullfill(tslib.__importStar(mod))})})}),
                // @ts-ignore 官方没提供 type
                Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['echarts/extension/dataTool'], function(mod) {fullfill(tslib.__importStar(mod))})})}),
                // @ts-ignore 官方没提供 type
                Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['echarts/extension/bmap/bmap'], function(mod) {fullfill(tslib.__importStar(mod))})})})
            ]).then(function (_a) {
                var echarts = _a[0], ecStat = _a[1];
                return tslib.__awaiter(_this, void 0, void 0, function () {
                    var theme;
                    var _this = this;
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                window.echarts = echarts;
                                window.ecStat = ecStat;
                                theme = 'default';
                                if (chartTheme) {
                                    echarts.registerTheme('custom', chartTheme);
                                    theme = 'custom';
                                }
                                if (!onChartWillMount) return [3 /*break*/, 2];
                                return [4 /*yield*/, onChartWillMount(echarts)];
                            case 1:
                                _b.sent();
                                _b.label = 2;
                            case 2:
                                echarts.registerTransform(ecStat.transform.regression);
                                echarts.registerTransform(ecStat.transform.histogram);
                                echarts.registerTransform(ecStat.transform.clustering);
                                if (!env.loadChartExtends) return [3 /*break*/, 4];
                                return [4 /*yield*/, env.loadChartExtends()];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4:
                                this.echarts = echarts.init(ref, theme);
                                if (typeof onChartMount === 'string') {
                                    onChartMount = new Function('chart', 'echarts');
                                }
                                onChartMount === null || onChartMount === void 0 ? void 0 : onChartMount(this.echarts, echarts);
                                this.echarts.on('click', this.handleClick);
                                this.unSensor = amisCore.resizeSensor(ref, function () {
                                    var _a;
                                    var width = ref.offsetWidth;
                                    var height = ref.offsetHeight;
                                    (_a = _this.echarts) === null || _a === void 0 ? void 0 : _a.resize({
                                        width: width,
                                        height: height
                                    });
                                });
                                chartRef && chartRef(this.echarts);
                                this.renderChart();
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
        else {
            chartRef && chartRef(null);
            this.unSensor && this.unSensor();
            if (this.echarts) {
                onChartUnMount === null || onChartUnMount === void 0 ? void 0 : onChartUnMount(this.echarts, window.echarts);
                this.echarts.dispose();
                delete this.echarts;
            }
        }
        this.ref = ref;
    };
    Chart.prototype.reload = function (subpath, query) {
        var _this = this;
        var _a, _b;
        var _c = this.props, api = _c.api, env = _c.env, store = _c.store, interval = _c.interval, __ = _c.translate;
        if (query) {
            return this.receive(query);
        }
        else if (!env || !env.fetcher || !amisCore.isEffectiveApi(api, store.data)) {
            return;
        }
        clearTimeout(this.timer);
        if (this.reloadCancel) {
            this.reloadCancel();
            delete this.reloadCancel;
            (_a = this.echarts) === null || _a === void 0 ? void 0 : _a.hideLoading();
        }
        (_b = this.echarts) === null || _b === void 0 ? void 0 : _b.showLoading();
        store.markFetching(true);
        env
            .fetcher(api, store.data, {
            cancelExecutor: function (executor) { return (_this.reloadCancel = executor); }
        })
            .then(function (result) {
            var _a;
            mobxStateTree.isAlive(store) && store.markFetching(false);
            if (!result.ok) {
                return env.notify('error', result.msg || __('fetchFailed'), result.msgTimeout !== undefined
                    ? {
                        closeButton: true,
                        timeout: result.msgTimeout
                    }
                    : undefined);
            }
            delete _this.reloadCancel;
            var data = amisCore.normalizeApiResponseData(result.data);
            // 说明返回的是数据接口。
            if (!data.series && _this.props.config) {
                var ctx = amisCore.createObject(_this.props.data, data);
                _this.renderChart(_this.props.config, ctx);
            }
            else {
                _this.renderChart(result.data || {});
            }
            (_a = _this.echarts) === null || _a === void 0 ? void 0 : _a.hideLoading();
            interval &&
                _this.mounted &&
                (_this.timer = setTimeout(_this.reload, Math.max(interval, 1000)));
        })
            .catch(function (reason) {
            var _a;
            if (env.isCancel(reason)) {
                return;
            }
            mobxStateTree.isAlive(store) && store.markFetching(false);
            env.notify('error', reason);
            (_a = _this.echarts) === null || _a === void 0 ? void 0 : _a.hideLoading();
        });
    };
    Chart.prototype.receive = function (data) {
        var store = this.props.store;
        store.updateData(data);
        this.reload();
    };
    Chart.prototype.renderChart = function (config, data) {
        var _a, _b;
        config && (this.pending = config);
        data && (this.pendingCtx = data);
        if (!this.echarts) {
            return;
        }
        var store = this.props.store;
        var onDataFilter = this.props.onDataFilter;
        var dataFilter = this.props.dataFilter;
        if (!onDataFilter && typeof dataFilter === 'string') {
            onDataFilter = new Function('config', 'echarts', 'data', dataFilter);
        }
        config = config || this.pending;
        data = data || this.pendingCtx || this.props.data;
        if (typeof config === 'string') {
            config = new Function('return ' + config)();
        }
        try {
            onDataFilter &&
                (config =
                    onDataFilter(config, window.echarts, data) || config);
        }
        catch (e) {
            console.warn(e);
        }
        if (config) {
            try {
                if (!this.props.disableDataMapping) {
                    config = amisCore.dataMapping(config, data, function (key, value) {
                        return typeof value === 'function' ||
                            (typeof value === 'string' && value.startsWith('function'));
                    });
                }
                recoverFunctionType(config);
                if (mobxStateTree.isAlive(store) && store.loading) {
                    (_a = this.echarts) === null || _a === void 0 ? void 0 : _a.showLoading();
                }
                else {
                    (_b = this.echarts) === null || _b === void 0 ? void 0 : _b.hideLoading();
                }
                this.reloadEcharts(config);
            }
            catch (e) {
                console.warn(e);
            }
        }
    };
    Chart.prototype.reloadEcharts = function (config) {
        var _a;
        (_a = this.echarts) === null || _a === void 0 ? void 0 : _a.setOption(config, this.props.replaceChartOption);
    };
    Chart.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, width = _a.width, height = _a.height, ns = _a.classPrefix, unMountOnHidden = _a.unMountOnHidden;
        var style = this.props.style || {};
        width && (style.width = width);
        height && (style.height = height);
        return (React__default["default"].createElement("div", { className: cx__default["default"]("".concat(ns, "Chart"), className), style: style },
            React__default["default"].createElement(amisCore.LazyComponent, { unMountOnHidden: unMountOnHidden, placeholder: "..." // 之前那个 spinner 会导致 sensor 失效
                , component: function () { return (React__default["default"].createElement("div", { className: "".concat(ns, "Chart-content"), ref: _this.refFn })); } })));
    };
    Chart.defaultProps = {
        replaceChartOption: false,
        unMountOnHidden: false
    };
    Chart.propsList = [];
    return Chart;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ChartRenderer, _super);
    function ChartRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    ChartRenderer.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    ChartRenderer.prototype.setData = function (values) {
        var store = this.props.store;
        store.updateData(values);
        // 重新渲染
        this.renderChart(this.props.config, values);
    };
    ChartRenderer.contextType = amisCore.ScopedContext;
    ChartRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'chart',
            storeType: amisCore.ServiceStore.name
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], ChartRenderer);
    return ChartRenderer;
})(Chart));

exports.Chart = Chart;
