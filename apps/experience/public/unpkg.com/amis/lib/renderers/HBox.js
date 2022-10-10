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

var HBox = /** @class */ (function (_super) {
    tslib.__extends(HBox, _super);
    function HBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HBox.prototype.renderChild = function (region, node, props) {
        if (props === void 0) { props = {}; }
        var render = this.props.render;
        return render(region, node, props);
    };
    HBox.prototype.renderColumn = function (column, key, length) {
        var _a;
        var _b = this.props, itemRender = _b.itemRender, data = _b.data, cx = _b.classnames, subFormMode = _b.subFormMode, subFormHorizontal = _b.subFormHorizontal, formMode = _b.formMode, formHorizontal = _b.formHorizontal;
        if (!amisCore.isVisible(column, data) || !column) {
            return null;
        }
        var style = tslib.__assign({ width: column.width, height: column.height }, column.style);
        return (React__default["default"].createElement("div", { key: key, className: cx("Hbox-col", style.width === 'auto'
                ? 'Hbox-col--auto'
                : style.width
                    ? 'Hbox-col--customWidth'
                    : '', (_a = {},
                _a["Hbox-col--v".concat(amisCore.ucFirst(column.valign))] = column.valign,
                _a), column.columnClassName), style: style }, itemRender
            ? itemRender(column, key, length, this.props)
            : this.renderChild("column/".concat(key), column.body, {
                formMode: column.mode || subFormMode || formMode,
                formHorizontal: column.horizontal || subFormHorizontal || formHorizontal
            })));
    };
    HBox.prototype.renderColumns = function () {
        var _this = this;
        var columns = this.props.columns;
        return columns.map(function (column, key) {
            return _this.renderColumn(column, key, columns.length);
        });
    };
    HBox.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, gap = _b.gap, vAlign = _b.valign, hAlign = _b.align;
        return (React__default["default"].createElement("div", { className: cx("Hbox", className, (_a = {},
                _a["Hbox--".concat(gap)] = gap,
                _a["Hbox--v".concat(amisCore.ucFirst(vAlign))] = vAlign,
                _a["Hbox--h".concat(amisCore.ucFirst(hAlign))] = hAlign,
                _a)) }, this.renderColumns()));
    };
    HBox.propsList = ['columns'];
    HBox.defaultProps = {
        gap: 'xs'
    };
    return HBox;
}(React__default["default"].Component));
var HBoxRenderer = /** @class */ (function (_super) {
    tslib.__extends(HBoxRenderer, _super);
    function HBoxRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HBoxRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'hbox'
        })
    ], HBoxRenderer);
    return HBoxRenderer;
}(HBox));

exports.HBoxRenderer = HBoxRenderer;
exports["default"] = HBox;
