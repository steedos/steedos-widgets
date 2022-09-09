/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var moment = require('moment');
require('moment/locale/zh-cn');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

var DateControl = /** @class */ (function (_super) {
    tslib.__extends(DateControl, _super);
    function DateControl(props) {
        var _this = _super.call(this, props) || this;
        var minDate = props.minDate, maxDate = props.maxDate, value = props.value, defaultValue = props.defaultValue, setPrinstineValue = props.setPrinstineValue, data = props.data, format = props.format, utc = props.utc;
        if (defaultValue && value === defaultValue) {
            var date = amisCore.filterDate(defaultValue, data, format);
            setPrinstineValue((utc ? moment__default["default"].utc(date) : date).format(format));
        }
        var schedulesData = props.schedules;
        if (typeof schedulesData === 'string') {
            var resolved = amisCore.resolveVariableAndFilter(schedulesData, data, '| raw');
            if (Array.isArray(resolved)) {
                schedulesData = resolved;
            }
        }
        _this.state = {
            minDate: minDate ? amisCore.filterDate(minDate, data, format) : undefined,
            maxDate: maxDate ? amisCore.filterDate(maxDate, data, format) : undefined,
            schedules: schedulesData
        };
        return _this;
    }
    DateControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.defaultValue !== props.defaultValue) {
            var date = amisCore.filterDate(props.defaultValue, props.data, props.format);
            props.setPrinstineValue((props.utc ? moment__default["default"].utc(date) : date).format(props.format));
        }
        if (prevProps.minDate !== props.minDate ||
            prevProps.maxDate !== props.maxDate ||
            prevProps.data !== props.data) {
            this.setState({
                minDate: props.minDate
                    ? amisCore.filterDate(props.minDate, props.data, this.props.format)
                    : undefined,
                maxDate: props.maxDate
                    ? amisCore.filterDate(props.maxDate, props.data, this.props.format)
                    : undefined
            });
        }
        if (amisCore.anyChanged(['schedules', 'data'], prevProps, props) &&
            typeof props.schedules === 'string' &&
            amisCore.isPureVariable(props.schedules)) {
            var schedulesData = amisCore.resolveVariableAndFilter(props.schedules, props.data, '| raw');
            var preSchedulesData = amisCore.resolveVariableAndFilter(prevProps.schedules, prevProps.data, '| raw');
            if (Array.isArray(schedulesData) && preSchedulesData !== schedulesData) {
                this.setState({
                    schedules: schedulesData
                });
            }
        }
    };
    // 日程点击事件
    DateControl.prototype.onScheduleClick = function (scheduleData) {
        var _a = this.props, scheduleAction = _a.scheduleAction, onAction = _a.onAction, data = _a.data, __ = _a.translate;
        var defaultscheduleAction = {
            actionType: 'dialog',
            dialog: {
                title: __('Schedule'),
                actions: [],
                closeOnEsc: true,
                body: {
                    type: 'table',
                    columns: [
                        {
                            name: 'time',
                            label: __('Time')
                        },
                        {
                            name: 'content',
                            label: __('Content')
                        }
                    ],
                    data: '${scheduleData}'
                }
            }
        };
        onAction &&
            onAction(null, scheduleAction || defaultscheduleAction, amisCore.createObject(data, scheduleData));
    };
    DateControl.prototype.getRef = function (ref) {
        while (ref && ref.getWrappedInstance) {
            ref = ref.getWrappedInstance();
        }
        this.dateRef = ref;
    };
    // 派发有event的事件
    DateControl.prototype.dispatchEvent = function (e) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
        dispatchEvent(e, data);
    };
    // 动作
    DateControl.prototype.doAction = function (action, data, throwErrors) {
        var _a, _b;
        var resetValue = this.props.resetValue;
        if (action.actionType === 'clear') {
            (_a = this.dateRef) === null || _a === void 0 ? void 0 : _a.clear();
            return;
        }
        if (action.actionType === 'reset' && resetValue) {
            (_b = this.dateRef) === null || _b === void 0 ? void 0 : _b.reset(resetValue);
        }
    };
    // 值的变化
    DateControl.prototype.handleChange = function (nextValue) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, dispatcher;
            return tslib.__generator(this, function (_b) {
                _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                dispatcher = dispatchEvent('change', amisCore.createObject(data, { value: nextValue }));
                if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                    return [2 /*return*/];
                }
                this.props.onChange(nextValue);
                return [2 /*return*/];
            });
        });
    };
    DateControl.prototype.render = function () {
        var _a = this.props, className = _a.className; _a.defaultValue; _a.defaultData; var cx = _a.classnames; _a.minDate; _a.maxDate; var type = _a.type, format = _a.format, timeFormat = _a.timeFormat, valueFormat = _a.valueFormat, env = _a.env, largeMode = _a.largeMode; _a.render; var useMobileUI = _a.useMobileUI, rest = tslib.__rest(_a, ["className", "defaultValue", "defaultData", "classnames", "minDate", "maxDate", "type", "format", "timeFormat", "valueFormat", "env", "largeMode", "render", "useMobileUI"]);
        var mobileUI = useMobileUI && amisCore.isMobile();
        if (type === 'time' && timeFormat) {
            format = timeFormat;
        }
        return (React__default["default"].createElement("div", { className: cx("DateControl", {
                'is-date': /date$/.test(type),
                'is-datetime': /datetime$/.test(type)
            }, className) },
            React__default["default"].createElement(amisUi.DatePicker, tslib.__assign({}, rest, { useMobileUI: useMobileUI, popOverContainer: mobileUI && env && env.getModalContainer
                    ? env.getModalContainer
                    : mobileUI
                        ? undefined
                        : rest.popOverContainer, timeFormat: timeFormat, format: valueFormat || format }, this.state, { classnames: cx, onRef: this.getRef, schedules: this.state.schedules, largeMode: largeMode, onScheduleClick: this.onScheduleClick.bind(this), onChange: this.handleChange, onFocus: this.dispatchEvent, onBlur: this.dispatchEvent }))));
    };
    DateControl.defaultProps = {
        format: 'X',
        viewMode: 'days',
        inputFormat: 'YYYY-MM-DD',
        timeConstraints: {
            minutes: {
                step: 1
            }
        },
        clearable: true
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], DateControl.prototype, "getRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], DateControl.prototype, "dispatchEvent", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], DateControl.prototype, "handleChange", null);
    return DateControl;
}(React__default["default"].PureComponent));
var DateControlRenderer = /** @class */ (function (_super) {
    tslib.__extends(DateControlRenderer, _super);
    function DateControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateControlRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateControl.defaultProps), { placeholder: 'Date.placeholder', dateFormat: 'YYYY-MM-DD', timeFormat: '', strictMode: false });
    DateControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-date',
            weight: -150
        })
    ], DateControlRenderer);
    return DateControlRenderer;
}(DateControl));
/** @class */ ((function (_super) {
    tslib.__extends(DatetimeControlRenderer, _super);
    function DatetimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatetimeControlRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateControl.defaultProps), { placeholder: 'DateTime.placeholder', inputFormat: 'YYYY-MM-DD HH:mm:ss', dateFormat: 'LL', timeFormat: 'HH:mm:ss', closeOnSelect: false, strictMode: false });
    DatetimeControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-datetime'
        })
    ], DatetimeControlRenderer);
    return DatetimeControlRenderer;
})(DateControl));
/** @class */ ((function (_super) {
    tslib.__extends(TimeControlRenderer, _super);
    function TimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeControlRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateControl.defaultProps), { placeholder: 'Time.placeholder', inputFormat: 'HH:mm', dateFormat: '', timeFormat: 'HH:mm', viewMode: 'time', closeOnSelect: false });
    TimeControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-time'
        })
    ], TimeControlRenderer);
    return TimeControlRenderer;
})(DateControl));
/** @class */ ((function (_super) {
    tslib.__extends(MonthControlRenderer, _super);
    function MonthControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonthControlRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateControl.defaultProps), { placeholder: 'Month.placeholder', inputFormat: 'YYYY-MM', dateFormat: 'MM', timeFormat: '', viewMode: 'months', closeOnSelect: true });
    MonthControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-month'
        })
    ], MonthControlRenderer);
    return MonthControlRenderer;
})(DateControl));
/** @class */ ((function (_super) {
    tslib.__extends(QuarterControlRenderer, _super);
    function QuarterControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterControlRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateControl.defaultProps), { placeholder: 'Quarter.placeholder', inputFormat: 'YYYY [Q]Q', dateFormat: 'YYYY [Q]Q', timeFormat: '', viewMode: 'quarters', closeOnSelect: true });
    QuarterControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-quarter'
        })
    ], QuarterControlRenderer);
    return QuarterControlRenderer;
})(DateControl));
/** @class */ ((function (_super) {
    tslib.__extends(YearControlRenderer, _super);
    function YearControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YearControlRenderer.defaultProps = tslib.__assign(tslib.__assign({}, DateControl.defaultProps), { placeholder: 'Year.placeholder', inputFormat: 'YYYY', dateFormat: 'YYYY', timeFormat: '', viewMode: 'years', closeOnSelect: true });
    YearControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-year'
        })
    ], YearControlRenderer);
    return YearControlRenderer;
})(DateControl));

exports.DateControlRenderer = DateControlRenderer;
exports["default"] = DateControl;
