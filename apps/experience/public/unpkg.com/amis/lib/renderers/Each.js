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

var Each = /** @class */ (function (_super) {
    tslib.__extends(Each, _super);
    function Each() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Each.prototype.render = function () {
        var _a = this.props, data = _a.data, name = _a.name, className = _a.className, render = _a.render, items = _a.items, placeholder = _a.placeholder, cx = _a.classnames, __ = _a.translate;
        var value = amisCore.getPropValue(this.props, function (props) {
            return props.source && !props.name
                ? amisCore.resolveVariableAndFilter(props.source, props.data, '| raw')
                : undefined;
        });
        var arr = amisCore.isObject(value)
            ? Object.keys(value).map(function (key) { return ({
                key: key,
                value: value[key]
            }); })
            : Array.isArray(value)
                ? value
                : [];
        return (React__default["default"].createElement("div", { className: cx('Each', className) }, Array.isArray(arr) && arr.length && items ? (arr.map(function (item, index) {
            var _a;
            return render("item/".concat(index), items, {
                data: amisCore.createObject(data, amisCore.isObject(item)
                    ? tslib.__assign({ index: index }, item) : (_a = {}, _a[name] = item, _a.item = item, _a.index = index, _a)),
                key: index
            });
        })) : (React__default["default"].createElement("div", { className: cx('Each-placeholder') }, render('placeholder', __(placeholder))))));
    };
    Each.propsList = ['name', 'items', 'value'];
    Each.defaultProps = {
        className: '',
        placeholder: 'placeholder.noData'
    };
    return Each;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(EachRenderer, _super);
    function EachRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EachRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'each'
        })
    ], EachRenderer);
    return EachRenderer;
})(Each));

exports["default"] = Each;
