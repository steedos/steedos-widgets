/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var ChartRadiosControl = /** @class */ (function (_super) {
    tslib.__extends(ChartRadiosControl, _super);
    function ChartRadiosControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.highlightIndex = -1;
        _this.prevIndex = -1;
        return _this;
    }
    ChartRadiosControl.prototype.chartRef = function (chart) {
        var _this = this;
        var _a;
        this.chart = chart;
        (_a = this.chart) === null || _a === void 0 ? void 0 : _a.on('click', 'series', function (params) {
            _this.props.onToggle(_this.props.options[params.dataIndex]);
        });
        // 因为会要先 setOptions 再来。
        setTimeout(function () { return _this.highlight(); });
    };
    ChartRadiosControl.prototype.highlight = function (index) {
        if (index === void 0) { index = this.highlightIndex; }
        this.highlightIndex = index;
        if (!this.chart || this.prevIndex === index) {
            return;
        }
        if (~this.prevIndex) {
            this.chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: this.prevIndex
            });
        }
        if (~index) {
            this.chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: index
            });
            // 显示 tooltip
            if (this.props.showTooltipOnHighlight) {
                this.chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: index
                });
            }
        }
        this.prevIndex = index;
    };
    ChartRadiosControl.prototype.compoonentDidMount = function () {
        if (this.props.selectedOptions.length) {
            this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
        }
    };
    ChartRadiosControl.prototype.componentDidUpdate = function () {
        if (this.props.selectedOptions.length) {
            this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
        }
    };
    ChartRadiosControl.prototype.render = function () {
        var _a = this.props, options = _a.options, labelField = _a.labelField, chartValueField = _a.chartValueField, valueField = _a.valueField, render = _a.render;
        var config = tslib.__assign(tslib.__assign({ legend: {
                top: 10
            }, tooltip: {
                formatter: function (params) {
                    return "".concat(params.name, "\uFF1A").concat(params.value[chartValueField || valueField || 'value'], "\uFF08").concat(params.percent, "%\uFF09");
                }
            }, series: [
                {
                    type: 'pie',
                    top: 30,
                    bottom: 0
                }
            ] }, this.props.config), { dataset: {
                dimensions: [
                    labelField || 'label',
                    chartValueField || valueField || 'value'
                ],
                source: options
            } });
        return render('chart', {
            type: 'chart'
        }, {
            config: config,
            chartRef: this.chartRef
        });
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ChartRadiosControl.prototype, "chartRef", null);
    return ChartRadiosControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(RadiosControlRenderer, _super);
    function RadiosControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RadiosControlRenderer.defaultProps = {
        multiple: false
    };
    RadiosControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'chart-radios',
            sizeMutable: false
        })
    ], RadiosControlRenderer);
    return RadiosControlRenderer;
})(ChartRadiosControl));

exports["default"] = ChartRadiosControl;
