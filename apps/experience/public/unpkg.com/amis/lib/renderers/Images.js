/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var Image = require('./Image.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var ImagesField = /** @class */ (function (_super) {
    tslib.__extends(ImagesField, _super);
    function ImagesField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.list = [];
        return _this;
    }
    ImagesField.prototype.handleEnlarge = function (info) {
        var _a = this.props, onImageEnlarge = _a.onImageEnlarge, src = _a.src, originalSrc = _a.originalSrc;
        onImageEnlarge &&
            onImageEnlarge(tslib.__assign(tslib.__assign({}, info), { originalSrc: info.originalSrc || info.src, list: this.list.map(function (item) { return ({
                    src: src
                        ? amisCore.filter(src, item, '| raw')
                        : (item && item.image) || item,
                    originalSrc: originalSrc
                        ? amisCore.filter(originalSrc, item, '| raw')
                        : (item === null || item === void 0 ? void 0 : item.src) || amisCore.filter(src, item, '| raw') || (item === null || item === void 0 ? void 0 : item.image) || item,
                    title: item && (item.enlargeTitle || item.title),
                    caption: item && (item.enlargeCaption || item.description || item.caption)
                }); }) }), this.props);
    };
    ImagesField.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, defaultImage = _a.defaultImage, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio, data = _a.data; _a.name; var placeholder = _a.placeholder, cx = _a.classnames, source = _a.source, delimiter = _a.delimiter, enlargeAble = _a.enlargeAble, src = _a.src, originalSrc = _a.originalSrc, listClassName = _a.listClassName, options = _a.options, showToolbar = _a.showToolbar, toolbarActions = _a.toolbarActions;
        var value;
        var list;
        if (typeof source === 'string' && amisCore.isPureVariable(source)) {
            list = amisCore.resolveVariableAndFilter(source, data, '| raw') || undefined;
        }
        else if (Array.isArray((value = amisCore.getPropValue(this.props))) ||
            typeof value === 'string') {
            list = value;
        }
        else if (Array.isArray(options)) {
            list = options;
        }
        if (typeof list === 'string') {
            list = list.split(delimiter);
        }
        else if (list && !Array.isArray(list)) {
            list = [list];
        }
        this.list = list;
        return (React__default["default"].createElement("div", { className: cx('ImagesField', className) }, Array.isArray(list) ? (React__default["default"].createElement("div", { className: cx('Images', listClassName) }, list.map(function (item, index) { return (React__default["default"].createElement(Image["default"], { index: index, className: cx('Images-item'), key: index, src: (src ? amisCore.filter(src, item, '| raw') : item && item.image) ||
                item, originalSrc: (originalSrc
                ? amisCore.filter(originalSrc, item, '| raw')
                : item && item.src) || item, title: item && item.title, caption: item && (item.description || item.caption), thumbMode: thumbMode, thumbRatio: thumbRatio, enlargeAble: enlargeAble, onEnlarge: _this.handleEnlarge, showToolbar: showToolbar, toolbarActions: toolbarActions })); }))) : defaultImage ? (React__default["default"].createElement("div", { className: cx('Images', listClassName) },
            React__default["default"].createElement(Image["default"], { className: cx('Images-item'), src: defaultImage, thumbMode: thumbMode, thumbRatio: thumbRatio }))) : (placeholder)));
    };
    ImagesField.defaultProps = {
        className: '',
        delimiter: ',',
        defaultImage: Image.imagePlaceholder,
        placehoder: '-',
        thumbMode: 'contain',
        thumbRatio: '1:1'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ImagesField.prototype, "handleEnlarge", null);
    return ImagesField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ImagesFieldRenderer, _super);
    function ImagesFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImagesFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'images'
        })
    ], ImagesFieldRenderer);
    return ImagesFieldRenderer;
})(ImagesField));

exports.ImagesField = ImagesField;
