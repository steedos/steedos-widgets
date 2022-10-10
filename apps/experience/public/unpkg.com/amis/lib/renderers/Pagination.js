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

var Pagination = /** @class */ (function (_super) {
    tslib.__extends(Pagination, _super);
    function Pagination() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pagination.prototype.render = function () {
        return React__default["default"].createElement(amisUi.Pagination, tslib.__assign({}, this.props));
    };
    return Pagination;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(PaginationRenderer, _super);
    function PaginationRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaginationRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)(?:pagination|pager)$/,
            name: 'pagination'
        })
    ], PaginationRenderer);
    return PaginationRenderer;
})(Pagination));

exports["default"] = Pagination;
