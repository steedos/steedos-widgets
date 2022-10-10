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

var IFrame = /** @class */ (function (_super) {
    tslib.__extends(IFrame, _super);
    function IFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.IFrameRef = React__default["default"].createRef();
        _this.state = {
            width: _this.props.width || '100%',
            height: _this.props.height || '100%'
        };
        return _this;
    }
    IFrame.prototype.componentDidMount = function () {
        window.addEventListener('message', this.onMessage);
    };
    IFrame.prototype.componentDidUpdate = function (prevProps) {
        var data = this.props.data;
        if (data !== prevProps.data) {
            this.postMessage('update', data);
        }
        else if (this.props.width !== prevProps.width ||
            this.props.height !== prevProps.height) {
            this.setState({
                width: this.props.width || '100%',
                height: this.props.height || '100%'
            });
        }
    };
    IFrame.prototype.componentWillUnmount = function () {
        window.removeEventListener('message', this.onMessage);
    };
    IFrame.prototype.onMessage = function (e) {
        var _a;
        var _b = this.props, events = _b.events, onAction = _b.onAction, data = _b.data;
        if (typeof ((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.type) !== 'string' || !events) {
            return;
        }
        var _c = e.data.type.split(':'), prefix = _c[0], type = _c[1];
        if (prefix !== 'amis' || !type) {
            return;
        }
        if (type === 'resize' && e.data.data) {
            this.setState({
                width: e.data.data.width || '100%',
                height: e.data.data.height || '100%'
            });
        }
        else {
            var action = events[type];
            action && onAction(e, action, amisCore.createObject(data, e.data.data));
        }
    };
    IFrame.prototype.onLoad = function () {
        var _a = this.props, src = _a.src, data = _a.data;
        src && this.postMessage('init', data);
    };
    // 当别的组件通知 iframe reload 的时候执行。
    IFrame.prototype.reload = function (subpath, query) {
        if (query) {
            return this.receive(query);
        }
        var _a = this.props, src = _a.src, data = _a.data;
        if (src) {
            this.IFrameRef.current.src =
                amisCore.resolveVariableAndFilter(src, data, '| raw');
        }
    };
    // 当别的组件把数据发给 iframe 里面的时候执行。
    IFrame.prototype.receive = function (values) {
        var _a = this.props, src = _a.src, data = _a.data;
        var newData = amisCore.createObject(data, values);
        this.postMessage('receive', newData);
        if (amisCore.isApiOutdated(src, src, data, newData)) {
            this.IFrameRef.current.src =
                amisCore.resolveVariableAndFilter(src, newData, '| raw');
        }
    };
    IFrame.prototype.postMessage = function (type, data) {
        var _a, _b;
        (_b = (_a = this.IFrameRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
            type: "amis:".concat(type),
            data: JSON.parse(JSON.stringify(data))
        }, '*');
    };
    IFrame.prototype.render = function () {
        var _a = this.state, width = _a.width, height = _a.height;
        var _b = this.props, className = _b.className, src = _b.src, name = _b.name, frameBorder = _b.frameBorder, data = _b.data, style = _b.style, allow = _b.allow, sandbox = _b.sandbox, referrerpolicy = _b.referrerpolicy, __ = _b.translate, env = _b.env;
        var tempStyle = {};
        width !== void 0 && (tempStyle.width = width);
        height !== void 0 && (tempStyle.height = height);
        style = tslib.__assign(tslib.__assign({}, tempStyle), style);
        var finalSrc = src
            ? amisCore.resolveVariableAndFilter(src, data, '| raw')
            : undefined;
        if (typeof finalSrc === 'string' &&
            finalSrc &&
            !/^(\.\/|\.\.\/|\/|https?\:\/\/|\/\/)/.test(finalSrc)) {
            return React__default["default"].createElement("p", null, __('Iframe.invalid'));
        }
        if (location.protocol === 'https:' &&
            finalSrc &&
            finalSrc.startsWith('http://')) {
            env.notify('error', __('Iframe.invalidProtocol'));
        }
        return (React__default["default"].createElement("iframe", { name: name, className: className, frameBorder: frameBorder, style: style, ref: this.IFrameRef, onLoad: this.onLoad, src: finalSrc, allow: allow, referrerPolicy: referrerpolicy, sandbox: sandbox }));
    };
    IFrame.propsList = ['src', 'className'];
    IFrame.defaultProps = {
        className: '',
        frameBorder: 0
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [MessageEvent]),
        tslib.__metadata("design:returntype", void 0)
    ], IFrame.prototype, "onMessage", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], IFrame.prototype, "onLoad", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IFrame.prototype, "reload", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IFrame.prototype, "receive", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], IFrame.prototype, "postMessage", null);
    return IFrame;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(IFrameRenderer, _super);
    function IFrameRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    IFrameRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    IFrameRenderer.contextType = amisCore.ScopedContext;
    IFrameRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'iframe'
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], IFrameRenderer);
    return IFrameRenderer;
})(IFrame));

exports["default"] = IFrame;
