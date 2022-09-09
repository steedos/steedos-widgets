/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var Transition = require('react-transition-group/Transition');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var Image = require('./Image.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Transition__default = /*#__PURE__*/_interopDefaultLegacy(Transition);

var _a;
var animationStyles = (_a = {},
    _a[Transition.ENTERING] = 'in',
    _a[Transition.ENTERED] = 'in',
    _a[Transition.EXITING] = 'out',
    _a);
var defaultSchema = {
    component: function (props) {
        var _a, _b;
        var data = props.data || {};
        var thumbMode = props.thumbMode;
        var cx = props.classnames;
        return (React__default["default"].createElement(React__default["default"].Fragment, null, data.hasOwnProperty('image') ? (React__default["default"].createElement(Image["default"], { src: data.image, title: data.title, href: data.href, blank: data.blank, htmlTarget: data.htmlTarget, imageCaption: data.description, thumbMode: (_b = (_a = data.thumbMode) !== null && _a !== void 0 ? _a : thumbMode) !== null && _b !== void 0 ? _b : 'contain', imageMode: "original", className: cx('Carousel-image') })) : data.hasOwnProperty('html') ? (React__default["default"].createElement(amisUi.Html, { html: data.html })) : data.hasOwnProperty('item') ? (React__default["default"].createElement("span", null, data.item)) : (React__default["default"].createElement("p", null))));
    }
};
var Carousel = /** @class */ (function (_super) {
    tslib.__extends(Carousel, _super);
    function Carousel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapperRef = React__default["default"].createRef();
        _this.state = {
            current: 0,
            options: _this.props.options || amisCore.getPropValue(_this.props) || [],
            nextAnimation: ''
        };
        return _this;
    }
    Carousel.prototype.componentDidMount = function () {
        this.prepareAutoSlide();
    };
    Carousel.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var nextOptions = props.options || amisCore.getPropValue(props) || [];
        var prevOptions = prevProps.options || amisCore.getPropValue(prevProps) || [];
        if (amisCore.isArrayChildrenModified(prevOptions, nextOptions)) {
            this.setState({
                options: nextOptions
            });
        }
    };
    Carousel.prototype.componentWillUnmount = function () {
        this.clearAutoTimeout();
    };
    Carousel.prototype.doAction = function (action, args, throwErrors) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (!!~['next', 'prev'].indexOf(actionType)) {
            this.autoSlide(actionType);
        }
        else if (actionType === 'goto-image') {
            this.changeSlide((args === null || args === void 0 ? void 0 : args.activeIndex) - 1);
        }
    };
    Carousel.prototype.prepareAutoSlide = function () {
        if (this.state.options.length < 2) {
            return;
        }
        this.clearAutoTimeout();
        if (this.props.auto) {
            var interval = this.props.interval;
            this.intervalTimeout = setTimeout(this.autoSlide, typeof interval === 'string'
                ? amisCore.resolveVariableAndFilter(interval, this.props.data) || 5000
                : interval);
        }
    };
    Carousel.prototype.autoSlide = function (rel) {
        this.clearAutoTimeout();
        var animation = this.props.animation;
        var nextAnimation = this.state.nextAnimation;
        switch (rel) {
            case 'prev':
                animation === 'slide'
                    ? (nextAnimation = 'slideRight')
                    : (nextAnimation = '');
                this.transitFramesTowards('right', nextAnimation);
                break;
            case 'next':
            default:
                nextAnimation = '';
                this.transitFramesTowards('left', nextAnimation);
                break;
        }
        this.durationTimeout = setTimeout(this.prepareAutoSlide, this.props.duration);
    };
    Carousel.prototype.transitFramesTowards = function (direction, nextAnimation) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var current, prevIndex, _a, dispatchEvent, data, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        current = this.state.current;
                        prevIndex = current;
                        switch (direction) {
                            case 'left':
                                current = this.getFrameId('next');
                                break;
                            case 'right':
                                current = this.getFrameId('prev');
                                break;
                        }
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                activeIndex: current + 1,
                                prevIndex: prevIndex
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            current: current,
                            nextAnimation: nextAnimation
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Carousel.prototype.getFrameId = function (pos) {
        var _a = this.state, options = _a.options, current = _a.current;
        var total = options.length;
        switch (pos) {
            case 'prev':
                return (current - 1 + total) % total;
            case 'next':
                return (current + 1) % total;
            default:
                return current;
        }
    };
    Carousel.prototype.next = function () {
        this.autoSlide('next');
    };
    Carousel.prototype.prev = function () {
        this.autoSlide('prev');
    };
    Carousel.prototype.clearAutoTimeout = function () {
        clearTimeout(this.intervalTimeout);
        clearTimeout(this.durationTimeout);
    };
    Carousel.prototype.changeSlide = function (index) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var current, _a, dispatchEvent, data, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        current = this.state.current;
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                activeIndex: index,
                                prevIndex: current
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            current: index
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Carousel.prototype.renderDots = function () {
        var _this = this;
        var cx = this.props.classnames;
        var _a = this.state, current = _a.current, options = _a.options;
        return (React__default["default"].createElement("div", { className: cx('Carousel-dotsControl'), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave }, Array.from({ length: options.length }).map(function (_, i) { return (React__default["default"].createElement("span", { key: i, onClick: function () { return _this.changeSlide(i); }, className: cx('Carousel-dot', current === i ? 'is-active' : '') })); })));
    };
    Carousel.prototype.renderArrows = function () {
        var cx = this.props.classnames;
        return (React__default["default"].createElement("div", { className: cx('Carousel-arrowsControl'), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
            React__default["default"].createElement("div", { className: cx('Carousel-leftArrow'), onClick: this.prev },
                React__default["default"].createElement(amisUi.Icon, { icon: "left-arrow", className: "icon" })),
            React__default["default"].createElement("div", { className: cx('Carousel-rightArrow'), onClick: this.next },
                React__default["default"].createElement(amisUi.Icon, { icon: "right-arrow", className: "icon" }))));
    };
    Carousel.prototype.handleMouseEnter = function () {
        this.clearAutoTimeout();
    };
    Carousel.prototype.handleMouseLeave = function () {
        this.prepareAutoSlide();
    };
    Carousel.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, className = _a.className, cx = _a.classnames, itemSchema = _a.itemSchema, animation = _a.animation, width = _a.width, height = _a.height, controls = _a.controls, controlsTheme = _a.controlsTheme, placeholder = _a.placeholder, data = _a.data, name = _a.name;
        var _b = this.state, options = _b.options, current = _b.current, nextAnimation = _b.nextAnimation;
        var body = null;
        var carouselStyles = {};
        width ? (carouselStyles.width = width + 'px') : '';
        height ? (carouselStyles.height = height + 'px') : '';
        var _c = [
            controls.indexOf('dots') > -1,
            controls.indexOf('arrows') > -1
        ], dots = _c[0], arrows = _c[1];
        var animationName = nextAnimation || animation;
        if (Array.isArray(options) && options.length) {
            body = (React__default["default"].createElement("div", { ref: this.wrapperRef, className: cx('Carousel-container'), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave }, options.map(function (option, key) { return (React__default["default"].createElement(Transition__default["default"], { mountOnEnter: true, unmountOnExit: true, in: key === current, timeout: 500, key: key }, function (status) {
                var _a;
                if (status === Transition.ENTERING) {
                    _this.wrapperRef.current &&
                        _this.wrapperRef.current.childNodes.forEach(function (item) { return item.offsetHeight; });
                }
                return (React__default["default"].createElement("div", { className: cx('Carousel-item', animationName, animationStyles[status]) }, render("".concat(current, "/body"), itemSchema ? itemSchema : defaultSchema, {
                    thumbMode: _this.props.thumbMode,
                    data: amisCore.createObject(data, amisCore.isObject(option)
                        ? option
                        : (_a = { item: option }, _a[name] = option, _a))
                })));
            })); })));
        }
        return (React__default["default"].createElement("div", { className: cx("Carousel Carousel--".concat(controlsTheme), className), style: carouselStyles },
            body ? body : placeholder,
            dots ? this.renderDots() : null,
            arrows ? (React__default["default"].createElement("div", { className: cx('Carousel-leftArrow'), onClick: this.prev },
                React__default["default"].createElement(amisUi.Icon, { icon: "left-arrow", className: "icon" }))) : null,
            arrows ? (React__default["default"].createElement("div", { className: cx('Carousel-rightArrow'), onClick: this.next },
                React__default["default"].createElement(amisUi.Icon, { icon: "right-arrow", className: "icon" }))) : null));
    };
    Carousel.defaultProps = {
        auto: true,
        interval: 5000,
        duration: 500,
        controlsTheme: 'light',
        animation: 'fade',
        controls: ['dots', 'arrows'],
        placeholder: '-'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "prepareAutoSlide", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "autoSlide", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, String]),
        tslib.__metadata("design:returntype", Promise)
    ], Carousel.prototype, "transitFramesTowards", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "getFrameId", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "next", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "prev", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "clearAutoTimeout", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", Promise)
    ], Carousel.prototype, "changeSlide", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "handleMouseEnter", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Carousel.prototype, "handleMouseLeave", null);
    return Carousel;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CarouselRenderer, _super);
    function CarouselRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    CarouselRenderer.prototype.componentWillUnmount = function () {
        var _a;
        (_a = _super.prototype.componentWillUnmount) === null || _a === void 0 ? void 0 : _a.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    CarouselRenderer.contextType = amisCore.ScopedContext;
    CarouselRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'carousel'
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], CarouselRenderer);
    return CarouselRenderer;
})(Carousel));

exports.Carousel = Carousel;
