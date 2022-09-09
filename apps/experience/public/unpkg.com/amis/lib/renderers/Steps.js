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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function StepsCmpt(props) {
    var _a;
    var className = props.className, steps = props.steps, status = props.status, mode = props.mode, labelPlacement = props.labelPlacement, progressDot = props.progressDot, data = props.data, source = props.source, config = props.config, render = props.render, useMobileUI = props.useMobileUI;
    var sourceResult = amisCore.resolveVariableAndFilter(source, data, '| raw');
    /** 步骤数据源 */
    var stepsRow = (Array.isArray(sourceResult) ? sourceResult : undefined) ||
        config ||
        steps ||
        [];
    /** 状态数据源 */
    var statusValue = amisCore.isPureVariable(status)
        ? amisCore.resolveVariableAndFilter(status, data, '| raw')
        : status;
    var resolveRender = function (val) {
        return typeof val === 'string' ? amisCore.filter(val, data) : val && render('inner', val);
    };
    var value = (_a = amisCore.getPropValue(props)) !== null && _a !== void 0 ? _a : 0;
    var resolveValue = typeof value === 'string' && isNaN(+value)
        ? +amisCore.resolveVariable(value, data) || +value
        : +value;
    var valueIndex = stepsRow.findIndex(function (item) { return item.value && item.value === resolveValue; });
    var currentValue = valueIndex !== -1 ? valueIndex : resolveValue;
    var resolveSteps = stepsRow.map(function (step, i) {
        var stepStatus = getStepStatus(step, i);
        return tslib.__assign(tslib.__assign({}, step), { status: stepStatus, title: resolveRender(step.title), subTitle: resolveRender(step.subTitle), description: resolveRender(step.description) });
    });
    function getStepStatus(step, i) {
        var stepStatus;
        if (typeof statusValue === 'string') {
            if (i === currentValue) {
                stepStatus = statusValue || status || amisUi.StepStatus.process;
            }
        }
        else if (typeof statusValue === 'object') {
            var key = step.value;
            key && statusValue[key] && (stepStatus = statusValue[key]);
        }
        return stepStatus;
    }
    return (React__default["default"].createElement(amisUi.Steps, { current: currentValue, steps: resolveSteps, className: className, status: statusValue, mode: mode, progressDot: progressDot, labelPlacement: labelPlacement, useMobileUI: useMobileUI }));
}
var StepsWithRemoteConfig = amisUi.withRemoteConfig({
    adaptor: function (data) { return data.steps || data; }
})(/** @class */ (function (_super) {
    tslib.__extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, config = _a.config; _a.deferLoad; _a.loading; _a.updateConfig; var rest = tslib.__rest(_a, ["config", "deferLoad", "loading", "updateConfig"]);
        return React__default["default"].createElement(StepsCmpt, tslib.__assign({ config: config }, rest));
    };
    return class_1;
}(React__default["default"].Component)));
/** @class */ ((function (_super) {
    tslib.__extends(StepsRenderer, _super);
    function StepsRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StepsRenderer.prototype.render = function () {
        return React__default["default"].createElement(StepsWithRemoteConfig, tslib.__assign({}, this.props));
    };
    StepsRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'steps'
        })
    ], StepsRenderer);
    return StepsRenderer;
})(React__default["default"].Component));

exports.StepsCmpt = StepsCmpt;
