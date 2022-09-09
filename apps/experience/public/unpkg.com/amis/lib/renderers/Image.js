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

var ImageThumb = /** @class */ (function (_super) {
    tslib.__extends(ImageThumb, _super);
    function ImageThumb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageThumb.prototype.handleEnlarge = function () {
        var _a = this.props, onEnlarge = _a.onEnlarge, rest = tslib.__rest(_a, ["onEnlarge"]);
        onEnlarge && onEnlarge(rest);
    };
    ImageThumb.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, imageClassName = _a.imageClassName, thumbClassName = _a.thumbClassName, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio, height = _a.height, width = _a.width, src = _a.src, alt = _a.alt, title = _a.title, caption = _a.caption, href = _a.href, _b = _a.blank, blank = _b === void 0 ? true : _b, htmlTarget = _a.htmlTarget, onLoad = _a.onLoad, enlargeAble = _a.enlargeAble, __ = _a.translate, overlays = _a.overlays, imageMode = _a.imageMode;
        var enlarge = enlargeAble || overlays ? (React__default["default"].createElement("div", { key: "overlay", className: cx('Image-overlay') },
            enlargeAble ? (React__default["default"].createElement("a", { "data-tooltip": __('Image.zoomIn'), "data-position": "bottom", target: "_blank", onClick: this.handleEnlarge },
                React__default["default"].createElement(amisUi.Icon, { icon: "view", className: "icon" }))) : null,
            overlays)) : null;
        var image = (React__default["default"].createElement("div", { className: cx('Image', imageMode === 'original' ? 'Image--original' : 'Image--thumb', className) },
            imageMode === 'original' ? (React__default["default"].createElement("div", { className: cx('Image-origin', thumbMode ? "Image-origin--".concat(thumbMode) : ''), style: { height: height, width: width } },
                React__default["default"].createElement("img", { onLoad: onLoad, className: cx('Image-image', imageClassName), src: src, alt: alt }),
                enlarge)) : (React__default["default"].createElement("div", { className: cx('Image-thumbWrap') },
                React__default["default"].createElement("div", { className: cx('Image-thumb', thumbClassName, thumbMode ? "Image-thumb--".concat(thumbMode) : '', thumbRatio
                        ? "Image-thumb--".concat(thumbRatio.replace(/:/g, '-'))
                        : ''), style: { height: height, width: width } },
                    React__default["default"].createElement("img", { onLoad: onLoad, className: cx('Image-image', imageClassName), src: src, alt: alt })),
                enlarge)),
            title || caption ? (React__default["default"].createElement("div", { key: "caption", className: cx('Image-info') },
                title ? (React__default["default"].createElement("div", { className: cx('Image-title'), title: title }, title)) : null,
                caption ? (React__default["default"].createElement("div", { className: cx('Image-caption'), title: caption }, caption)) : null)) : null));
        if (href) {
            image = (React__default["default"].createElement("a", { href: href, target: htmlTarget || (blank ? '_blank' : '_self'), className: cx('Link', className), title: title }, image));
        }
        return image;
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], ImageThumb.prototype, "handleEnlarge", null);
    return ImageThumb;
}(React__default["default"].Component));
var ThemedImageThumb = amisCore.themeable(amisCore.localeable(ImageThumb));
var imagePlaceholder = "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E";
var ImageField = /** @class */ (function (_super) {
    tslib.__extends(ImageField, _super);
    function ImageField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageField.prototype.handleEnlarge = function (_a) {
        var src = _a.src, originalSrc = _a.originalSrc, title = _a.title, caption = _a.caption, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio;
        var _b = this.props, onImageEnlarge = _b.onImageEnlarge, enlargeTitle = _b.enlargeTitle, enlargeCaption = _b.enlargeCaption;
        onImageEnlarge &&
            onImageEnlarge({
                src: src,
                originalSrc: originalSrc || src,
                title: enlargeTitle || title,
                caption: enlargeCaption || caption,
                thumbMode: thumbMode,
                thumbRatio: thumbRatio
            }, this.props);
    };
    ImageField.prototype.handleClick = function (e) {
        var clickAction = this.props.clickAction;
        if (clickAction) {
            amisCore.handleAction(e, clickAction, this.props);
        }
    };
    ImageField.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, innerClassName = _b.innerClassName, defaultImage = _b.defaultImage, imageCaption = _b.imageCaption, title = _b.title, data = _b.data, imageClassName = _b.imageClassName, thumbClassName = _b.thumbClassName, height = _b.height, width = _b.width, cx = _b.classnames, src = _b.src, href = _b.href, thumbMode = _b.thumbMode, thumbRatio = _b.thumbRatio, placeholder = _b.placeholder, originalSrc = _b.originalSrc, enlargeAble = _b.enlargeAble, imageMode = _b.imageMode;
        var finnalSrc = src ? amisCore.filter(src, data, '| raw') : '';
        var value = finnalSrc || amisCore.getPropValue(this.props) || defaultImage || imagePlaceholder;
        var finnalHref = href ? amisCore.filter(href, data, '| raw') : '';
        return (React__default["default"].createElement("div", { className: cx('ImageField', imageMode === 'original'
                ? 'ImageField--original'
                : 'ImageField--thumb', className), onClick: this.handleClick }, value ? (React__default["default"].createElement(ThemedImageThumb, { className: innerClassName, imageClassName: imageClassName, thumbClassName: thumbClassName, height: height, width: width, src: value, href: finnalHref, title: amisCore.filter(title, data), caption: amisCore.filter(imageCaption, data), thumbMode: thumbMode, thumbRatio: thumbRatio, originalSrc: (_a = amisCore.filter(originalSrc, data, '| raw')) !== null && _a !== void 0 ? _a : value, enlargeAble: enlargeAble && value !== defaultImage, onEnlarge: this.handleEnlarge, imageMode: imageMode })) : (React__default["default"].createElement("span", { className: "text-muted" }, placeholder))));
    };
    ImageField.defaultProps = {
        defaultImage: imagePlaceholder,
        thumbMode: 'contain',
        thumbRatio: '1:1',
        placeholder: '-'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ImageField.prototype, "handleEnlarge", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ImageField.prototype, "handleClick", null);
    return ImageField;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ImageFieldRenderer, _super);
    function ImageFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'image'
        })
    ], ImageFieldRenderer);
    return ImageFieldRenderer;
})(ImageField));

exports.ImageField = ImageField;
exports.ImageThumb = ImageThumb;
exports["default"] = ThemedImageThumb;
exports.imagePlaceholder = imagePlaceholder;
