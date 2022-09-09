/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var tslib = require('tslib');
var amisCore = require('amis-core');
var React = require('react');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** @class */ ((function (_super) {
    tslib.__extends(SearchBoxRenderer, _super);
    function SearchBoxRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: amisCore.getPropValue(props) || ''
        };
        return _this;
    }
    SearchBoxRenderer.prototype.handleChange = function (value) {
        this.setState({ value: value });
    };
    SearchBoxRenderer.prototype.handleCancel = function () {
        var name = this.props.name;
        var onQuery = this.props.onQuery;
        var value = amisCore.getPropValue(this.props);
        if (value !== '') {
            var data = {};
            amisCore.setVariable(data, name, '');
            onQuery === null || onQuery === void 0 ? void 0 : onQuery(data);
        }
    };
    SearchBoxRenderer.prototype.handleSearch = function (text) {
        var _a = this.props, name = _a.name, onQuery = _a.onQuery;
        var data = {};
        amisCore.setVariable(data, name, text);
        onQuery === null || onQuery === void 0 ? void 0 : onQuery(data);
    };
    SearchBoxRenderer.prototype.render = function () {
        var _a = this.props; _a.data; var name = _a.name, onQuery = _a.onQuery, mini = _a.mini, enhance = _a.enhance, clearable = _a.clearable, searchImediately = _a.searchImediately, placeholder = _a.placeholder, onChange = _a.onChange, className = _a.className;
        var value = this.state.value;
        return (React__default["default"].createElement(amisUi.SearchBox, { className: className, name: name, disabled: !onQuery, defaultActive: !!value, defaultValue: onChange ? undefined : value, value: value, mini: mini, enhance: enhance, clearable: clearable, searchImediately: searchImediately, onSearch: this.handleSearch, onCancel: this.handleCancel, placeholder: placeholder, onChange: this.handleChange }));
    };
    SearchBoxRenderer.defaultProps = {
        name: 'keywords',
        mini: false,
        enhance: false,
        clearable: false,
        searchImediately: false
    };
    SearchBoxRenderer.propsList = ['mini', 'searchImediately'];
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], SearchBoxRenderer.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], SearchBoxRenderer.prototype, "handleCancel", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], SearchBoxRenderer.prototype, "handleSearch", null);
    SearchBoxRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'search-box'
        }),
        tslib.__metadata("design:paramtypes", [Object])
    ], SearchBoxRenderer);
    return SearchBoxRenderer;
})(React__default["default"].Component));
