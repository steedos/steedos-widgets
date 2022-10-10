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
var mobx = require('mobx');
var ReactDOM = require('react-dom');
var mobxStateTree = require('mobx-state-tree');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Dialog = /** @class */ (function (_super) {
    tslib.__extends(Dialog, _super);
    function Dialog(props) {
        var _this = _super.call(this, props) || this;
        _this.isDead = false;
        _this.$$id = amisCore.guid();
        props.store.setEntered(!!props.show);
        _this.handleSelfClose = _this.handleSelfClose.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleActionSensor = _this.handleActionSensor.bind(_this);
        _this.handleDialogConfirm = _this.handleDialogConfirm.bind(_this);
        _this.handleDialogClose = _this.handleDialogClose.bind(_this);
        _this.handleDrawerConfirm = _this.handleDrawerConfirm.bind(_this);
        _this.handleDrawerClose = _this.handleDrawerClose.bind(_this);
        _this.handleEntered = _this.handleEntered.bind(_this);
        _this.handleExited = _this.handleExited.bind(_this);
        _this.handleFormInit = _this.handleFormInit.bind(_this);
        _this.handleFormSaved = _this.handleFormSaved.bind(_this);
        _this.handleFormChange = _this.handleFormChange.bind(_this);
        _this.handleChildFinished = _this.handleChildFinished.bind(_this);
        var store = props.store;
        _this.reaction = mobx.reaction(function () { return "".concat(store.loading).concat(store.error); }, function () { return _this.forceUpdate(); });
        return _this;
    }
    // shouldComponentUpdate(nextProps:DialogProps, nextState:DialogState) {
    //     const props = this.props;
    //     if (this.state.entered !== nextState.entered) {
    //         return true;
    //     } else if (props.show === nextProps.show && !nextProps.show) {
    //         return false;
    //     }
    //     return isObjectShallowModified(this.props, nextProps);
    // }
    Dialog.prototype.componentWillUnmount = function () {
        this.reaction && this.reaction();
        this.isDead = true;
    };
    Dialog.prototype.buildActions = function () {
        var _a = this.props, actions = _a.actions, confirm = _a.confirm, __ = _a.translate;
        if (typeof actions !== 'undefined') {
            return actions;
        }
        var ret = [];
        ret.push({
            type: 'button',
            actionType: 'cancel',
            label: __('cancel')
        });
        if (confirm) {
            ret.push({
                type: 'button',
                actionType: 'confirm',
                label: __('confirm'),
                primary: true
            });
        }
        return ret;
    };
    Dialog.prototype.handleSelfClose = function (e, confirmed) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onClose, store, dispatchEvent, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onClose = _a.onClose, store = _a.store, dispatchEvent = _a.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('cancel', this.props.data)];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        // clear error
                        store.updateMessage();
                        onClose(confirmed);
                        return [2 /*return*/];
                }
            });
        });
    };
    Dialog.prototype.handleActionSensor = function (p) {
        var _this = this;
        var store = this.props.store;
        var origin = store.busying;
        store.markBusying(true);
        // clear error
        store.updateMessage();
        p.then(function () {
            store.markBusying(origin);
        }).catch(function (e) {
            if (_this.isDead) {
                return;
            }
            store.updateMessage(e.message, true);
            store.markBusying(origin);
        });
    };
    Dialog.prototype.handleAction = function (e, action, data) {
        var _a = this.props, store = _a.store, onAction = _a.onAction;
        if (action.type === 'reset') {
            store.reset();
        }
        else if (action.actionType === 'cancel') {
            this.handleSelfClose();
        }
        else if (onAction) {
            onAction(e, action, data);
        }
    };
    Dialog.prototype.handleDialogConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.props.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var dialog = store.action.dialog;
        if (dialog &&
            dialog.onConfirm &&
            dialog.onConfirm.apply(dialog, tslib.__spreadArray([values, action], args, false)) === false) {
            return;
        }
        store.closeDialog(true);
    };
    Dialog.prototype.handleDialogClose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var store = this.props.store;
        var action = store.action;
        var dialog = action.dialog;
        if (dialog.onClose && dialog.onClose.apply(dialog, args) === false) {
            return;
        }
        store.closeDialog(args[1]);
    };
    Dialog.prototype.handleDrawerConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.props.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var drawer = store.action.drawer;
        if (drawer &&
            drawer.onConfirm &&
            drawer.onConfirm.apply(drawer, tslib.__spreadArray([values, action], args, false)) === false) {
            return;
        }
        store.closeDrawer();
    };
    Dialog.prototype.handleDrawerClose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var store = this.props.store;
        var action = store.action;
        var drawer = action.drawer;
        if (drawer.onClose && drawer.onClose.apply(drawer, args) === false) {
            return;
        }
        store.closeDrawer();
    };
    Dialog.prototype.handleEntered = function () {
        var _a = this.props, lazySchema = _a.lazySchema, store = _a.store;
        store.setEntered(true);
        if (typeof lazySchema === 'function') {
            store.setSchema(lazySchema(this.props));
        }
        var activeElem = document.activeElement;
        if (activeElem) {
            var dom = ReactDOM.findDOMNode(this);
            dom && !dom.contains(activeElem) && activeElem.blur();
        }
    };
    Dialog.prototype.handleExited = function () {
        var _a = this.props, lazySchema = _a.lazySchema, store = _a.store;
        if (mobxStateTree.isAlive(store)) {
            store.reset();
            store.setEntered(false);
            if (typeof lazySchema === 'function') {
                store.setSchema('');
            }
        }
    };
    Dialog.prototype.handleFormInit = function (data) {
        var store = this.props.store;
        store.setFormData(data);
    };
    Dialog.prototype.handleFormChange = function (data, name) {
        var _a;
        var store = this.props.store;
        // 如果 dialog 里面不放 form，而是直接放表单项就会进到这里来。
        if (typeof name === 'string') {
            data = (_a = {},
                _a[name] = data,
                _a);
        }
        store.setFormData(data);
    };
    Dialog.prototype.handleFormSaved = function (data, response) {
        var store = this.props.store;
        store.setFormData(tslib.__assign(tslib.__assign({}, data), response));
    };
    Dialog.prototype.handleChildFinished = function (value, action) {
        // 下面会覆盖
    };
    Dialog.prototype.openFeedback = function (dialog, ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            var store = _this.props.store;
            store.setCurrentAction({
                type: 'button',
                actionType: 'dialog',
                dialog: dialog
            });
            store.openDialog(ctx, undefined, function (confirmed) {
                resolve(confirmed);
            });
        });
    };
    Dialog.prototype.getPopOverContainer = function () {
        return ReactDOM.findDOMNode(this).querySelector(".".concat(this.props.classPrefix, "Modal-content"));
    };
    Dialog.prototype.renderBody = function (body, key) {
        var _this = this;
        var _a = this.props, render = _a.render, store = _a.store;
        if (Array.isArray(body)) {
            return body.map(function (body, key) { return _this.renderBody(body, key); });
        }
        var subProps = {
            key: key,
            disabled: (body && body.disabled) || store.loading,
            onAction: this.handleAction,
            onFinished: this.handleChildFinished,
            popOverContainer: this.getPopOverContainer,
            affixOffsetTop: 0,
            onChange: this.handleFormChange,
            onInit: this.handleFormInit,
            onSaved: this.handleFormSaved,
            onActionSensor: this.handleActionSensor,
            syncLocation: false // 弹框中的 crud 一般不需要同步地址栏
        };
        if (!body.type) {
            return render("body".concat(key ? "/".concat(key) : ''), body, subProps);
        }
        var schema = body;
        if (schema.type === 'form') {
            schema = tslib.__assign({ mode: 'horizontal', wrapWithPanel: false, submitText: null }, schema);
        }
        return render("body".concat(key ? "/".concat(key) : ''), schema, subProps);
    };
    Dialog.prototype.renderFooter = function () {
        var _this = this;
        var actions = this.buildActions();
        if (!actions || !actions.length) {
            return null;
        }
        var _a = this.props, store = _a.store, render = _a.render, cx = _a.classnames, showErrorMsg = _a.showErrorMsg, showLoading = _a.showLoading, show = _a.show;
        return (React__default["default"].createElement("div", { className: cx('Modal-footer') },
            (showLoading !== false && store.loading) ||
                (showErrorMsg !== false && store.error) ? (React__default["default"].createElement("div", { className: cx('Dialog-info'), key: "info" },
                showLoading !== false ? (React__default["default"].createElement(amisUi.Spinner, { size: "sm", key: "info", show: store.loading })) : null,
                store.error && showErrorMsg !== false ? (React__default["default"].createElement("span", { className: cx('Dialog-error') }, store.msg)) : null)) : null,
            actions.map(function (action, key) {
                return render("action/".concat(key), action, {
                    data: store.formData,
                    onAction: _this.handleAction,
                    key: key,
                    disabled: action.disabled || store.loading || !show
                });
            })));
    };
    Dialog.prototype.render = function () {
        var store = this.props.store;
        var _a = tslib.__assign(tslib.__assign({}, this.props), store.schema), className = _a.className, size = _a.size, height = _a.height, width = _a.width, closeOnEsc = _a.closeOnEsc, closeOnOutside = _a.closeOnOutside, title = _a.title, render = _a.render, header = _a.header, body = _a.body, bodyClassName = _a.bodyClassName, headerClassName = _a.headerClassName, show = _a.show, lazyRender = _a.lazyRender, lazySchema = _a.lazySchema, wrapperComponent = _a.wrapperComponent, showCloseButton = _a.showCloseButton, env = _a.env, cx = _a.classnames, classPrefix = _a.classPrefix, __ = _a.translate;
        var Wrapper = wrapperComponent || amisUi.Modal;
        return (React__default["default"].createElement(Wrapper, { classPrefix: classPrefix, className: cx(className), size: size, height: height, width: width, backdrop: "static", onHide: this.handleSelfClose, keyboard: closeOnEsc && !store.loading, closeOnEsc: closeOnEsc, closeOnOutside: !store.dialogOpen && closeOnOutside, show: show, onEntered: this.handleEntered, onExited: this.handleExited, container: env && env.getModalContainer ? env.getModalContainer : undefined, enforceFocus: false, disabled: store.loading },
            title && typeof title === 'string' ? (React__default["default"].createElement("div", { className: cx('Modal-header', headerClassName) },
                showCloseButton !== false && !store.loading ? (React__default["default"].createElement("a", { "data-tooltip": __('Dialog.close'), "data-position": "left", onClick: this.handleSelfClose, className: cx('Modal-close') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" }))) : null,
                React__default["default"].createElement("div", { className: cx('Modal-title') }, amisCore.filter(__(title), store.formData)))) : title ? (React__default["default"].createElement("div", { className: cx('Modal-header', headerClassName) },
                showCloseButton !== false && !store.loading ? (React__default["default"].createElement("a", { "data-tooltip": __('Dialog.close'), onClick: this.handleSelfClose, className: cx('Modal-close') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" }))) : null,
                render('title', title, {
                    data: store.formData,
                    onAction: this.handleAction
                }))) : showCloseButton !== false && !store.loading ? (React__default["default"].createElement("a", { "data-tooltip": __('Dialog.close'), onClick: this.handleSelfClose, className: cx('Modal-close') },
                React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" }))) : null,
            header
                ? render('header', header, {
                    data: store.formData,
                    onAction: this.handleAction
                })
                : null,
            (!store.entered && lazyRender) || (lazySchema && !body) ? (React__default["default"].createElement("div", { className: cx('Modal-body', bodyClassName) },
                React__default["default"].createElement(amisUi.Spinner, { overlay: true, show: true, size: "lg" }))) : body ? (React__default["default"].createElement("div", { className: cx('Modal-body', bodyClassName) }, this.renderBody(body, 'body'))) : null,
            this.renderFooter(),
            body
                ? render('drawer', tslib.__assign(tslib.__assign({}, (store.action &&
                    store.action.drawer)), { type: 'drawer' }), {
                    key: 'drawer',
                    data: store.drawerData,
                    onConfirm: this.handleDrawerConfirm,
                    onClose: this.handleDrawerClose,
                    show: store.drawerOpen,
                    onAction: this.handleAction
                })
                : null,
            body
                ? render('dialog', tslib.__assign(tslib.__assign({}, (store.action &&
                    store.action.dialog)), { type: 'dialog' }), {
                    key: 'dialog',
                    data: store.dialogData,
                    onConfirm: this.handleDialogConfirm,
                    onClose: this.handleDialogClose,
                    show: store.dialogOpen,
                    onAction: this.handleAction
                })
                : null));
    };
    Dialog.propsList = [
        'title',
        'size',
        'closeOnEsc',
        'closeOnOutside',
        'children',
        'bodyClassName',
        'headerClassName',
        'confirm',
        'onClose',
        'onConfirm',
        'show',
        'body',
        'showCloseButton',
        'showErrorMsg',
        'actions',
        'popOverContainer'
    ];
    Dialog.defaultProps = {
        title: 'Dialog.title',
        bodyClassName: '',
        confirm: true,
        show: true,
        lazyRender: false,
        showCloseButton: true,
        wrapperComponent: amisUi.Modal,
        closeOnEsc: false,
        closeOnOutside: false,
        showErrorMsg: true
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Dialog.prototype, "getPopOverContainer", null);
    return Dialog;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(DialogRenderer, _super);
    function DialogRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    DialogRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
        _super.prototype.componentWillUnmount.call(this);
    };
    DialogRenderer.prototype.tryChildrenToHandle = function (action, ctx, rawAction) {
        var _this = this;
        var scoped = this.context;
        var targets = [];
        var _a = this.props, onConfirm = _a.onConfirm, store = _a.store;
        if (action.target) {
            targets.push.apply(targets, action.target
                .split(',')
                .map(function (name) { return scoped.getComponentByName(name); })
                .filter(function (item) { return item && item.doAction; }));
        }
        if (!targets.length) {
            var components = scoped
                .getComponents()
                .filter(function (item) { return !~['drawer', 'dialog'].indexOf(item.props.type); });
            var pool = components.concat();
            while (pool.length) {
                var item = pool.pop();
                if (~['crud', 'form', 'wizard'].indexOf(item.props.type)) {
                    targets.push(item);
                    break;
                }
                else if (~['drawer', 'dialog'].indexOf(item.props.type)) {
                    continue;
                }
                else if (~['page', 'service'].indexOf(item.props.type)) {
                    pool.unshift.apply(pool, item.context.getComponents());
                }
            }
        }
        if (targets.length) {
            store.markBusying(true);
            store.updateMessage();
            Promise.all(targets.map(function (target) {
                return target.doAction(tslib.__assign(tslib.__assign({}, action), { from: _this.$$id }), ctx, true);
            }))
                .then(function (values) {
                if ((action.type === 'submit' ||
                    action.actionType === 'submit' ||
                    action.actionType === 'confirm') &&
                    action.close !== false) {
                    onConfirm && onConfirm(values, rawAction || action, ctx, targets);
                }
                else if (action.close) {
                    action.close === true
                        ? _this.handleSelfClose()
                        : _this.closeTarget(action.close);
                }
                store.markBusying(false);
            })
                .catch(function (reason) {
                if (_this.isDead) {
                    return;
                }
                store.updateMessage(reason.message, true);
                store.markBusying(false);
            });
            return true;
        }
        return false;
    };
    DialogRenderer.prototype.doAction = function (action, data, throwErrors) {
        this.handleAction(undefined, action, data);
    };
    DialogRenderer.prototype.handleAction = function (e, action, data, throwErrors, delegate) {
        if (throwErrors === void 0) { throwErrors = false; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onAction, store, onConfirm, env, dispatchEvent, scoped, rendererEvent, rendererEvent, ret;
            var _this = this;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onAction = _a.onAction, store = _a.store, onConfirm = _a.onConfirm, env = _a.env, dispatchEvent = _a.dispatchEvent;
                        if (action.from === this.$$id) {
                            return [2 /*return*/, onAction
                                    ? onAction(e, action, data, throwErrors, delegate || this.context)
                                    : false];
                        }
                        scoped = this.context;
                        if (!(action.type === 'reset')) return [3 /*break*/, 1];
                        store.setCurrentAction(action);
                        store.reset();
                        return [3 /*break*/, 6];
                    case 1:
                        if (!(action.actionType === 'close' ||
                            action.actionType === 'cancel')) return [3 /*break*/, 3];
                        return [4 /*yield*/, dispatchEvent('cancel', amisCore.createObject(this.props.data, data))];
                    case 2:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        store.setCurrentAction(action);
                        this.handleSelfClose();
                        action.close && this.closeTarget(action.close);
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(action.actionType === 'confirm')) return [3 /*break*/, 5];
                        return [4 /*yield*/, dispatchEvent('confirm', amisCore.createObject(this.props.data, data))];
                    case 4:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        store.setCurrentAction(action);
                        this.tryChildrenToHandle(tslib.__assign(tslib.__assign({}, action), { actionType: 'submit' }), data, action) || this.handleSelfClose(undefined, true);
                        return [3 /*break*/, 6];
                    case 5:
                        if (action.actionType === 'next' || action.actionType === 'prev') {
                            store.setCurrentAction(action);
                            if (action.type === 'submit') {
                                this.tryChildrenToHandle(tslib.__assign(tslib.__assign({}, action), { actionType: 'submit', close: true }), data, action) || this.handleSelfClose(undefined, true);
                            }
                            else {
                                onConfirm([data], action, data, []);
                            }
                        }
                        else if (action.actionType === 'dialog') {
                            store.setCurrentAction(action);
                            store.openDialog(data);
                        }
                        else if (action.actionType === 'drawer') {
                            store.setCurrentAction(action);
                            store.openDrawer(data);
                        }
                        else if (action.actionType === 'reload') {
                            store.setCurrentAction(action);
                            action.target && scoped.reload(action.target, data);
                            if (action.close || action.type === 'submit') {
                                this.handleSelfClose(undefined, action.type === 'submit');
                                this.closeTarget(action.close);
                            }
                        }
                        else if (this.tryChildrenToHandle(action, data)) ;
                        else if (action.actionType === 'ajax') {
                            store.setCurrentAction(action);
                            store
                                .saveRemote(action.api, data, {
                                successMessage: action.messages && action.messages.success,
                                errorMessage: action.messages && action.messages.failed
                            })
                                .then(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                                var reidrect;
                                return tslib.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(action.feedback && amisCore.isVisible(action.feedback, store.data))) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.openFeedback(action.feedback, store.data)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            reidrect = action.redirect && amisCore.filter(action.redirect, store.data);
                                            reidrect && env.jumpTo(reidrect, action);
                                            action.reload && this.reloadTarget(action.reload, store.data);
                                            if (action.close) {
                                                this.handleSelfClose();
                                                this.closeTarget(action.close);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (e) {
                                if (throwErrors || action.countDown) {
                                    throw e;
                                }
                            });
                        }
                        else if (onAction) {
                            ret = onAction(e, tslib.__assign(tslib.__assign({}, action), { close: false }), data, throwErrors, delegate || this.context);
                            action.close &&
                                (ret && ret.then
                                    ? ret.then(this.handleSelfClose)
                                    : setTimeout(this.handleSelfClose, 200));
                        }
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DialogRenderer.prototype.handleChildFinished = function (value, action) {
        if ((action && action.from === this.$$id) || action.close === false) {
            return;
        }
        var scoped = this.context;
        var components = scoped
            .getComponents()
            .filter(function (item) {
            return !~['drawer', 'dialog', 'action', 'button', 'submit', 'reset'].indexOf(item.props.type);
        });
        var onConfirm = this.props.onConfirm;
        var onClose = this.props.onClose;
        if (components.length === 1 &&
            (components[0].props.type === 'form' ||
                components[0].props.type === 'wizard') &&
            (action.close === true ||
                components[0].props.closeDialogOnSubmit !== false)) {
            onConfirm && onConfirm([value], action, {}, components);
        }
        else if (action.close === true) {
            onClose();
        }
    };
    DialogRenderer.prototype.handleDialogConfirm = function (values, action) {
        var _a;
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        _super.prototype.handleDialogConfirm.apply(this, tslib.__spreadArray([values, action], rest, false));
        var scoped = this.context;
        var store = this.props.store;
        var dialogAction = store.action;
        var reload = (_a = action.reload) !== null && _a !== void 0 ? _a : dialogAction.reload;
        if (reload) {
            scoped.reload(reload, store.data);
        }
        else {
            // 没有设置，则自动让页面中 crud 刷新。
            scoped
                .getComponents()
                .filter(function (item) { return item.props.type === 'crud'; })
                .forEach(function (item) { return item.reload && item.reload(); });
        }
    };
    DialogRenderer.prototype.handleDrawerConfirm = function (values, action) {
        _super.prototype.handleDrawerConfirm.call(this, values, action);
        var scoped = this.context;
        var store = this.props.store;
        var drawerAction = store.action;
        // 稍等会，等动画结束。
        setTimeout(function () {
            if (drawerAction.reload) {
                scoped.reload(drawerAction.reload, store.data);
            }
            else if (action.reload) {
                scoped.reload(action.reload, store.data);
            }
            else {
                // 没有设置，则自动让页面中 crud 刷新。
                scoped
                    .getComponents()
                    .filter(function (item) { return item.props.type === 'crud'; })
                    .forEach(function (item) { return item.reload && item.reload(); });
            }
        }, 300);
    };
    DialogRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    DialogRenderer.prototype.closeTarget = function (target) {
        var scoped = this.context;
        scoped.close(target);
    };
    DialogRenderer.prototype.setData = function (values) {
        return this.props.store.updateData(values);
    };
    DialogRenderer.contextType = amisCore.ScopedContext;
    DialogRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'dialog',
            storeType: amisCore.ModalStore.name,
            storeExtendsData: false,
            isolateScope: true,
            shouldSyncSuperStore: function (store, props, prevProps) {
                return !!((store.dialogOpen || props.show) &&
                    (props.show !== prevProps.show ||
                        amisCore.isObjectShallowModified(prevProps.data, props.data)));
            }
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], DialogRenderer);
    return DialogRenderer;
})(Dialog));

exports["default"] = Dialog;
