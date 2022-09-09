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

function TimelineCmpt(props) {
    var items = props.items, mode = props.mode, direction = props.direction, reverse = props.reverse, data = props.data, config = props.config; props.source; var render = props.render;
    // 获取源数据
    var timelineItemsRow = config || items || [];
    // 渲染内容
    var resolveRender = function (region, val) {
        return typeof val === 'string' ? amisCore.filter(val, data) : val && render(region, val);
    };
    // 处理源数据
    var resolveTimelineItems = timelineItemsRow === null || timelineItemsRow === void 0 ? void 0 : timelineItemsRow.map(function (timelineItem) {
        return tslib.__assign(tslib.__assign({}, timelineItem), { icon: resolveRender('icon', timelineItem.icon), title: resolveRender('title', timelineItem.title) });
    });
    return (React__default["default"].createElement(amisUi.Timeline, { items: resolveTimelineItems, direction: direction, reverse: reverse, mode: mode }));
}
var TimelineWithRemoteConfig = amisUi.withRemoteConfig({
    adaptor: function (data) { return data.items || data; }
})(/** @class */ (function (_super) {
    tslib.__extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, config = _a.config; _a.deferLoad; _a.loading; _a.updateConfig; var rest = tslib.__rest(_a, ["config", "deferLoad", "loading", "updateConfig"]);
        return React__default["default"].createElement(TimelineCmpt, tslib.__assign({ config: config }, rest));
    };
    return class_1;
}(React__default["default"].Component)));
/** @class */ ((function (_super) {
    tslib.__extends(TimelineRenderer, _super);
    function TimelineRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimelineRenderer.prototype.render = function () {
        return React__default["default"].createElement(TimelineWithRemoteConfig, tslib.__assign({}, this.props));
    };
    TimelineRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'timeline'
        })
    ], TimelineRenderer);
    return TimelineRenderer;
})(React__default["default"].Component));

exports.TimelineCmpt = TimelineCmpt;
