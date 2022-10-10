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
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Wizard = /** @class */ (function (_super) {
    tslib.__extends(Wizard, _super);
    function Wizard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.affixDom = React__default["default"].createRef();
        _this.footerDom = React__default["default"].createRef();
        _this.initalValues = {};
        _this.state = {
            currentStep: -1,
            completeStep: -1
        };
        return _this;
    }
    Wizard.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, initApi = _a.initApi, initFetch = _a.initFetch, initAsyncApi = _a.initAsyncApi, initFinishedField = _a.initFinishedField, store = _a.store, _b = _a.messages, fetchSuccess = _b.fetchSuccess, fetchFailed = _b.fetchFailed; _a.onInit;
        if (amisCore.isEffectiveApi(initApi, store.data, initFetch)) {
            store
                .fetchInitData(initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed,
                onSuccess: function () {
                    if (!amisCore.isEffectiveApi(initAsyncApi, store.data) ||
                        store.data[initFinishedField || 'finished']) {
                        return;
                    }
                    return amisCore.until(function () { return store.checkRemote(initAsyncApi, store.data); }, function (ret) { return ret && ret[initFinishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); });
                }
            })
                .then(function (value) {
                _this.handleInitEvent(store.data);
                var state = {
                    currentStep: typeof _this.props.startStep === 'string'
                        ? amisCore.toNumber(amisCore.tokenize(_this.props.startStep, _this.props.data), 1)
                        : 1
                };
                if (value &&
                    value.data &&
                    (typeof value.data.step === 'number' ||
                        (typeof value.data.step === 'string' &&
                            /^\d+$/.test(value.data.step)))) {
                    state.currentStep = amisCore.toNumber(value.data.step, 1);
                }
                _this.setState(state, function () {
                    // 如果 initApi 返回的状态是正在提交，则进入轮顺状态。
                    if (value &&
                        value.data &&
                        (value.data.submiting || value.data.submited)) {
                        _this.checkSubmit();
                    }
                });
                return value;
            });
        }
        else {
            this.setState({
                currentStep: typeof this.props.startStep === 'string'
                    ? amisCore.toNumber(amisCore.tokenize(this.props.startStep, this.props.data), 1)
                    : 1
            }, function () { return _this.handleInitEvent(store.data); });
        }
        var dom = ReactDOM.findDOMNode(this);
        if (!(dom instanceof Element)) {
            return;
        }
        var parent = dom ? amisCore.getScrollParent(dom) : null;
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        parent.addEventListener('scroll', this.affixDetect);
        this.unSensor = amisCore.resizeSensor(dom, this.affixDetect);
        this.affixDetect();
    };
    Wizard.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store, fetchSuccess = props.fetchSuccess, fetchFailed = props.fetchFailed;
        if (amisCore.isApiOutdated(prevProps.initApi, props.initApi, prevProps.data, props.data)) {
            store.fetchData(props.initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            });
        }
    };
    Wizard.prototype.componentWillUnmount = function () {
        this.asyncCancel && this.asyncCancel();
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        this.unSensor && this.unSensor();
    };
    Wizard.prototype.dispatchEvent = function (action, value) {
        var _a;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _b, dispatchEvent, data, rendererEvent;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.props, dispatchEvent = _b.dispatchEvent, data = _b.data;
                        return [4 /*yield*/, dispatchEvent(action, value ? amisCore.createObject(data, value) : data)];
                    case 1:
                        rendererEvent = _c.sent();
                        return [2 /*return*/, (_a = rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) !== null && _a !== void 0 ? _a : false];
                }
            });
        });
    };
    Wizard.prototype.handleInitEvent = function (data) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var onInit;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInit = this.props.onInit;
                        return [4 /*yield*/, this.dispatchEvent('inited', data)];
                    case 1:
                        (_a.sent()) && onInit && onInit(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Wizard.prototype.affixDetect = function () {
        if (!this.props.affixFooter ||
            !this.affixDom.current ||
            !this.footerDom.current) {
            return;
        }
        var affixDom = this.affixDom.current;
        var footerDom = this.footerDom.current;
        var affixed = false;
        footerDom.offsetWidth &&
            (affixDom.style.cssText = "width: ".concat(footerDom.offsetWidth, "px;"));
        if (this.props.affixFooter === 'always') {
            affixed = true;
            footerDom.classList.add('invisible2');
        }
        else {
            var clip = footerDom.getBoundingClientRect();
            var clientHeight = window.innerHeight;
            affixed = clip.top + clip.height / 2 > clientHeight;
        }
        affixed ? affixDom.classList.add('in') : affixDom.classList.remove('in');
    };
    Wizard.prototype.gotoStep = function (index) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var steps;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        steps = this.props.steps || [];
                        index = Math.max(Math.min(steps.length, index), 1);
                        if (!(index != this.state.currentStep)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dispatchEvent('stepChange', {
                                step: index
                            })];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            currentStep: index,
                            completeStep: Math.max(this.state.completeStep, index - 1)
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Wizard.prototype.formRef = function (ref) {
        if (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.form = ref;
        }
        else {
            this.form = undefined;
        }
    };
    Wizard.prototype.submitToTarget = function (target, values) {
        throw new Error('Please implements this!');
    };
    Wizard.prototype.reloadTarget = function (target, data) {
        throw new Error('Please implements this!');
    };
    Wizard.prototype.reload = function (subPath, query, ctx) {
        var _this = this;
        if (query) {
            return this.receive(query);
        }
        var _a = this.props, initApi = _a.initApi, initAsyncApi = _a.initAsyncApi, initFinishedField = _a.initFinishedField, store = _a.store, _b = _a.messages, fetchSuccess = _b.fetchSuccess, fetchFailed = _b.fetchFailed;
        if (amisCore.isEffectiveApi(initApi, store.data) && this.state.currentStep === 1) {
            store
                .fetchInitData(initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed,
                onSuccess: function () {
                    if (!amisCore.isEffectiveApi(initAsyncApi, store.data) ||
                        store.data[initFinishedField || 'finished']) {
                        return;
                    }
                    return amisCore.until(function () { return store.checkRemote(initAsyncApi, store.data); }, function (ret) { return ret && ret[initFinishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); });
                }
            })
                .then(function (value) {
                var state = {
                    currentStep: 1
                };
                if (value &&
                    value.data &&
                    (typeof value.data.step === 'number' ||
                        (typeof value.data.step === 'string' &&
                            /^\d+$/.test(value.data.step)))) {
                    state.currentStep = amisCore.toNumber(value.data.step, 1);
                }
                _this.setState(state, function () {
                    // 如果 initApi 返回的状态是正在提交，则进入轮顺状态。
                    if (value &&
                        value.data &&
                        (value.data.submiting || value.data.submited)) {
                        _this.checkSubmit();
                    }
                });
                return value;
            });
        }
    };
    Wizard.prototype.receive = function (values) {
        var store = this.props.store;
        store.updateData(values);
        this.reload();
    };
    Wizard.prototype.domRef = function (ref) {
        this.dom = ref;
    };
    Wizard.prototype.getPopOverContainer = function () {
        return this.dom;
    };
    // 用来还原异步提交状态。
    Wizard.prototype.checkSubmit = function () {
        var _a;
        var _this = this;
        var _b = this.props, store = _b.store, steps = _b.steps, asyncApi = _b.asyncApi, finishedField = _b.finishedField, env = _b.env;
        var step = steps[this.state.currentStep - 1];
        var finnalAsyncApi = (step && step.asyncApi) ||
            (this.state.currentStep === steps.length && asyncApi);
        if (!step || !amisCore.isEffectiveApi(finnalAsyncApi, store.data)) {
            return;
        }
        store.markSaving(true);
        store.updateData((_a = {},
            _a[finishedField || 'finished'] = false,
            _a));
        amisCore.until(function () { return store.checkRemote(finnalAsyncApi, store.data); }, function (ret) { return ret && ret[finishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); })
            .then(function () {
            store.markSaving(false);
            _this.gotoStep(_this.state.currentStep + 1);
        })
            .catch(function (e) {
            env.notify('error', e.message);
            store.markSaving(false);
        });
    };
    Wizard.prototype.handleAction = function (e, action, data, throwErrors, delegate) {
        var _this = this;
        if (throwErrors === void 0) { throwErrors = false; }
        var _a = this.props, onAction = _a.onAction, store = _a.store, env = _a.env, steps = _a.steps;
        if (action.actionType === 'next' ||
            action.type === 'submit' ||
            action.actionType === 'step-submit') {
            this.form.doAction(tslib.__assign(tslib.__assign({}, action), { actionType: 'submit' }), data);
        }
        else if (action.actionType === 'prev') {
            this.gotoStep(this.state.currentStep - 1);
        }
        else if (action.type === 'reset') {
            this.form.reset();
        }
        else if (action.actionType === 'dialog') {
            store.setCurrentAction(action);
            store.openDialog(data);
        }
        else if (action.actionType === 'ajax') {
            if (!action.api) {
                return env.alert("\u5F53 actionType \u4E3A ajax \u65F6\uFF0C\u8BF7\u8BBE\u7F6E api \u5C5E\u6027");
            }
            return store
                .saveRemote(action.api, data, {
                successMessage: action.messages && action.messages.success,
                errorMessage: action.messages && action.messages.failed
            })
                .then(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                var feedback, confirmed, reidrect;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.form && this.form.isValidated() && this.form.validate(true);
                            feedback = action.feedback;
                            if (!(feedback && amisCore.isVisible(feedback, store.data))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.openFeedback(feedback, store.data)];
                        case 1:
                            confirmed = _a.sent();
                            // 如果 feedback 配置了，取消就跳过原有逻辑。
                            if (feedback.skipRestOnCancel && !confirmed) {
                                throw new amisCore.SkipOperation();
                            }
                            else if (feedback.skipRestOnConfirm && confirmed) {
                                throw new amisCore.SkipOperation();
                            }
                            _a.label = 2;
                        case 2:
                            reidrect = action.redirect && amisCore.filter(action.redirect, store.data);
                            reidrect && env.jumpTo(reidrect, action);
                            action.reload && this.reloadTarget(action.reload, store.data);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (reason) {
                if (reason instanceof amisCore.SkipOperation) {
                    return;
                }
            });
        }
        else if (action.actionType === 'reload') {
            action.target && this.reloadTarget(action.target, data);
        }
        else if (action.actionType === 'goto-step') {
            var targetStep = data.step;
            if (targetStep !== undefined &&
                targetStep <= steps.length &&
                targetStep >= 0) {
                this.gotoStep(data.step);
            }
        }
        else if (action.actionType === 'submit') {
            this.finalSubmit();
        }
        else if (onAction) {
            onAction(e, action, data, throwErrors, delegate || this.context);
        }
    };
    Wizard.prototype.handleQuery = function (query) {
        var _a, _b;
        if (this.props.initApi) {
            this.receive(query);
        }
        else {
            (_b = (_a = this.props).onQuery) === null || _b === void 0 ? void 0 : _b.call(_a, query);
        }
    };
    Wizard.prototype.openFeedback = function (dialog, ctx) {
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
    Wizard.prototype.handleChange = function (values) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var store, previous, final;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = this.props.store;
                        previous = store.data;
                        final = tslib.__assign(tslib.__assign({}, previous), values);
                        return [4 /*yield*/, this.dispatchEvent('change', final)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/];
                        }
                        store.updateData(values);
                        return [2 /*return*/];
                }
            });
        });
    };
    Wizard.prototype.handleInit = function (values) {
        var step = this.state.currentStep;
        this.initalValues[step] = this.initalValues[step] || values;
        var store = this.props.store;
        store.updateData(values);
    };
    Wizard.prototype.handleReset = function (values) {
        var store = this.props.store;
        var initalValue = this.initalValues[this.state.currentStep];
        var reseted = {};
        Object.keys(values).forEach(function (key) {
            reseted[key] = initalValue.hasOwnProperty(key)
                ? initalValue[key]
                : undefined;
        });
        store.updateData(reseted);
    };
    Wizard.prototype.finalSubmit = function (values, action) {
        if (values === void 0) { values = {}; }
        if (action === void 0) { action = { type: 'submit' }; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, steps, api, asyncApi, finishedField, target, redirect, reload, env, onFinished, step, finnalAsyncApi_1, formStore;
            var _b;
            var _this = this;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, store = _a.store, steps = _a.steps, api = _a.api, asyncApi = _a.asyncApi, finishedField = _a.finishedField, target = _a.target, redirect = _a.redirect, reload = _a.reload, env = _a.env, onFinished = _a.onFinished;
                        return [4 /*yield*/, this.dispatchEvent('finished', store.data)];
                    case 1:
                        if (_c.sent()) {
                            return [2 /*return*/];
                        }
                        step = steps[this.state.currentStep - 1];
                        store.updateData(values);
                        // 最后一步
                        if (target) {
                            this.submitToTarget(target, store.data);
                            this.setState({ completeStep: steps.length });
                        }
                        else if (action.api || step.api || api) {
                            finnalAsyncApi_1 = action.asyncApi || step.asyncApi || asyncApi;
                            amisCore.isEffectiveApi(finnalAsyncApi_1, store.data) &&
                                store.updateData((_b = {},
                                    _b[finishedField || 'finished'] = false,
                                    _b));
                            formStore = this.form
                                ? this.form.props.store
                                : store;
                            store.markSaving(true);
                            formStore
                                .saveRemote(action.api || step.api || api, store.data, {
                                onSuccess: function (result) { return tslib.__awaiter(_this, void 0, void 0, function () {
                                    var dispatcher, cbResult;
                                    var _this = this;
                                    return tslib.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.dispatchEvent('submitSucc', amisCore.createObject(this.props.data, { result: result }))];
                                            case 1:
                                                dispatcher = _a.sent();
                                                if (!amisCore.isEffectiveApi(finnalAsyncApi_1, store.data) ||
                                                    store.data[finishedField || 'finished']) {
                                                    return [2 /*return*/, {
                                                            cbResult: null,
                                                            dispatcher: dispatcher
                                                        }];
                                                }
                                                cbResult = amisCore.until(function () { return store.checkRemote(finnalAsyncApi_1, store.data); }, function (ret) { return ret && ret[finishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); });
                                                return [2 /*return*/, {
                                                        cbResult: cbResult,
                                                        dispatcher: dispatcher
                                                    }];
                                        }
                                    });
                                }); },
                                onFailed: function (error) { return tslib.__awaiter(_this, void 0, void 0, function () {
                                    var dispatcher;
                                    return tslib.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                store.markSaving(false);
                                                return [4 /*yield*/, this.dispatchEvent('submitFail', amisCore.createObject(this.props.data, { error: error }))];
                                            case 1:
                                                dispatcher = _a.sent();
                                                return [2 /*return*/, {
                                                        dispatcher: dispatcher
                                                    }];
                                        }
                                    });
                                }); }
                            })
                                .then(function (value) { return tslib.__awaiter(_this, void 0, void 0, function () {
                                var feedback, confirmed, finalRedirect;
                                return tslib.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            feedback = action.feedback;
                                            if (!(feedback && amisCore.isVisible(feedback, value))) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.openFeedback(feedback, value)];
                                        case 1:
                                            confirmed = _a.sent();
                                            // 如果 feedback 配置了，取消就跳过原有逻辑。
                                            if (feedback.skipRestOnCancel && !confirmed) {
                                                throw new amisCore.SkipOperation();
                                            }
                                            else if (feedback.skipRestOnConfirm && confirmed) {
                                                throw new amisCore.SkipOperation();
                                            }
                                            _a.label = 2;
                                        case 2:
                                            this.setState({ completeStep: steps.length });
                                            store.updateData(tslib.__assign(tslib.__assign({}, store.data), value));
                                            store.markSaving(false);
                                            if (value && typeof value.step === 'number') {
                                                this.gotoStep(value.step);
                                            }
                                            else if (onFinished && onFinished(value, action) === false) {
                                                // 如果是 false 后面的操作就不执行
                                                return [2 /*return*/, value];
                                            }
                                            finalRedirect = (action.redirect || step.redirect || redirect) &&
                                                amisCore.filter(action.redirect || step.redirect || redirect, store.data);
                                            if (finalRedirect) {
                                                env.jumpTo(finalRedirect, action);
                                            }
                                            else if (action.reload || step.reload || reload) {
                                                this.reloadTarget(action.reload || step.reload || reload, store.data);
                                            }
                                            return [2 /*return*/, value];
                                    }
                                });
                            }); })
                                .catch(function (error) { });
                        }
                        else {
                            onFinished && onFinished(store.data, action);
                            this.setState({ completeStep: steps.length });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 接管里面 form 的提交，不能直接让 form 提交，因为 wizard 自己需要知道进度。
    Wizard.prototype.handleSubmit = function (values, action) {
        var _a;
        var _this = this;
        var _b = this.props, store = _b.store, steps = _b.steps, finishedField = _b.finishedField;
        if (this.state.currentStep < steps.length) {
            var step = steps[this.state.currentStep - 1];
            store.updateData(values);
            var finnalAsyncApi_2 = action.asyncApi || step.asyncApi;
            amisCore.isEffectiveApi(finnalAsyncApi_2, store.data) &&
                store.updateData((_a = {},
                    _a[finishedField || 'finished'] = false,
                    _a));
            if (amisCore.isEffectiveApi(action.api || step.api, store.data)) {
                store
                    .saveRemote(action.api || step.api, store.data, {
                    onSuccess: function () {
                        _this.dispatchEvent('stepSubmitSucc');
                        if (!amisCore.isEffectiveApi(finnalAsyncApi_2, store.data) ||
                            store.data[finishedField || 'finished']) {
                            return;
                        }
                        return amisCore.until(function () { return store.checkRemote(finnalAsyncApi_2, store.data); }, function (ret) { return ret && ret[finishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); });
                    },
                    onFailed: function (json) {
                        _this.dispatchEvent('stepSubmitFail', { error: json });
                        if (json.status === 422 && json.errors && _this.form) {
                            _this.form.props.store.setFormItemErrors(json.errors);
                        }
                    }
                })
                    .then(function (value) { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var feedback, confirmed;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                feedback = action.feedback;
                                if (!(feedback && amisCore.isVisible(feedback, value))) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.openFeedback(feedback, value)];
                            case 1:
                                confirmed = _a.sent();
                                // 如果 feedback 配置了，取消就跳过原有逻辑。
                                if (feedback.skipRestOnCancel && !confirmed) {
                                    throw new amisCore.SkipOperation();
                                }
                                else if (feedback.skipRestOnConfirm && confirmed) {
                                    throw new amisCore.SkipOperation();
                                }
                                _a.label = 2;
                            case 2:
                                this.gotoStep(value && typeof value.step === 'number'
                                    ? value.step
                                    : this.state.currentStep + 1);
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function (reason) {
                    _this.dispatchEvent('stepSubmitFail', { error: reason });
                    if (reason instanceof amisCore.SkipOperation) {
                        return;
                    }
                    // do nothing
                });
            }
            else {
                this.gotoStep(this.state.currentStep + 1);
            }
        }
        else {
            this.finalSubmit(values, action);
        }
        return false;
    };
    Wizard.prototype.handleDialogConfirm = function (values, action, targets) {
        var store = this.props.store;
        if (action.mergeData &&
            values.length === 1 &&
            values[0] &&
            targets[0].props.type === 'form') {
            store.updateData(values[0]);
        }
        store.closeDialog(true);
    };
    Wizard.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var store = this.props.store;
        store.closeDialog(confirmed);
    };
    Wizard.prototype.renderSteps = function () {
        var _this = this;
        var _a = this.props, steps = _a.steps, store = _a.store; _a.mode; var ns = _a.classPrefix, cx = _a.classnames;
        var _b = this.state, currentStep = _b.currentStep, completeStep = _b.completeStep;
        return (React__default["default"].createElement("div", { className: "".concat(ns, "Wizard-steps"), id: "form-wizard" }, Array.isArray(steps) && steps.length ? (React__default["default"].createElement("ul", null, steps.map(function (step, key) {
            var canJump = isJumpable(step, key, currentStep, store.data);
            var isComplete = canJump || key < completeStep;
            var isActive = currentStep === key + 1;
            return (React__default["default"].createElement("li", { key: key, className: cx({
                    'is-complete': isComplete,
                    'is-active': isActive
                }), onClick: function () { return (canJump ? _this.gotoStep(key + 1) : null); } },
                React__default["default"].createElement("span", { className: cx('Badge', {
                        // 'Badge--success': canJump && currentStep != key + 1,
                        'is-complete': isComplete,
                        'is-active': isActive || (canJump && currentStep != key + 1)
                    }) }, isComplete && !isActive ? (React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon" })) : (key + 1)),
                step.title || step.label || "\u7B2C ".concat(key + 1, " \u6B65")));
        }))) : null));
    };
    Wizard.prototype.renderActions = function () {
        var _this = this;
        var _a = this.props, steps = _a.steps, store = _a.store, readOnly = _a.readOnly, disabled = _a.disabled, actionClassName = _a.actionClassName, actionPrevLabel = _a.actionPrevLabel, actionNextLabel = _a.actionNextLabel, actionNextSaveLabel = _a.actionNextSaveLabel, actionFinishLabel = _a.actionFinishLabel, render = _a.render, __ = _a.translate;
        if (!Array.isArray(steps)) {
            return null;
        }
        var currentStepIndex = this.state.currentStep;
        var nextStep = steps[currentStepIndex];
        var prevStep = steps[currentStepIndex - 2];
        var waiting = store.loading;
        var step = steps[currentStepIndex - 1];
        if (!step) {
            return null;
        }
        var prevCanJump = prevStep
            ? isJumpable(prevStep, currentStepIndex - 2, currentStepIndex, store.data)
            : false;
        if (step.actions && Array.isArray(step.actions)) {
            return step.actions.length ? (React__default["default"].createElement(React__default["default"].Fragment, null, step.actions.map(function (action, index) {
                return render("action/".concat(index), action, {
                    key: index,
                    onAction: _this.handleAction,
                    disabled: action.disabled ||
                        waiting ||
                        disabled ||
                        (action.actionType === 'prev' && !prevCanJump) ||
                        (action.actionType === 'next' &&
                            readOnly &&
                            (!!step.api || !nextStep))
                });
            }))) : null;
        }
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            render("prev-btn", {
                type: 'button',
                label: __(actionPrevLabel),
                actionType: 'prev',
                className: actionClassName
            }, {
                disabled: waiting || !prevCanJump || disabled,
                onAction: this.handleAction
            }),
            render("next-btn", {
                type: 'button',
                label: !nextStep
                    ? __(actionFinishLabel)
                    : !step.api
                        ? __(actionNextLabel)
                        : __(actionNextSaveLabel),
                actionType: 'next',
                primary: !nextStep || !!step.api,
                className: actionClassName
            }, {
                disabled: waiting || disabled || (readOnly && (!!step.api || !nextStep)),
                onAction: this.handleAction
            })));
    };
    Wizard.prototype.renderFooter = function () {
        var actions = this.renderActions();
        if (!actions) {
            return actions;
        }
        var _a = this.props, cx = _a.classnames, affixFooter = _a.affixFooter;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("div", { role: "wizard-footer", ref: this.footerDom, className: cx('Panel-footer Wizard-footer') }, actions),
            affixFooter ? (React__default["default"].createElement("div", { ref: this.affixDom, className: cx('Panel-fixedBottom Wizard-footer') },
                React__default["default"].createElement("div", { className: cx('Panel-footer') }, actions))) : null));
    };
    Wizard.prototype.renderWizard = function () {
        var _a = this.props, className = _a.className, steps = _a.steps, render = _a.render, store = _a.store, ns = _a.classPrefix, cx = _a.classnames, popOverContainer = _a.popOverContainer, mode = _a.mode, __ = _a.translate;
        var currentStep = this.state.currentStep;
        var step = Array.isArray(steps) ? steps[currentStep - 1] : null;
        return (React__default["default"].createElement("div", { ref: this.domRef, className: cx("".concat(ns, "Panel ").concat(ns, "Panel--default ").concat(ns, "Wizard ").concat(ns, "Wizard--").concat(mode), className) },
            React__default["default"].createElement("div", { className: "".concat(ns, "Wizard-step") },
                this.renderSteps(),
                React__default["default"].createElement("div", { role: "wizard-body", className: "".concat(ns, "Wizard-stepContent clearfix") }, step ? (render('body', tslib.__assign(tslib.__assign({}, step), { type: 'form', wrapWithPanel: false, 
                    // 接口相关需要外部来接管
                    api: null }), {
                    key: this.state.currentStep,
                    ref: this.formRef,
                    onInit: this.handleInit,
                    onReset: this.handleReset,
                    onSubmit: this.handleSubmit,
                    onAction: this.handleAction,
                    onQuery: this.handleQuery,
                    disabled: store.loading,
                    popOverContainer: popOverContainer || this.getPopOverContainer,
                    onChange: this.handleChange,
                    formStore: undefined
                })) : currentStep === -1 ? (__('loading')) : (React__default["default"].createElement("p", { className: "text-danger" }, __('Wizard.configError')))),
                this.renderFooter()),
            render('dialog', tslib.__assign(tslib.__assign({}, (store.action &&
                store.action.dialog)), { type: 'dialog' }), {
                key: 'dialog',
                data: store.dialogData,
                onConfirm: this.handleDialogConfirm,
                onClose: this.handleDialogClose,
                show: store.dialogOpen
            }),
            React__default["default"].createElement(amisUi.Spinner, { size: "lg", overlay: true, key: "info", show: store.loading })));
    };
    Wizard.prototype.render = function () {
        return this.renderWizard();
    };
    Wizard.defaultProps = {
        mode: 'horizontal',
        readOnly: false,
        messages: {},
        actionClassName: '',
        actionPrevLabel: 'Wizard.prev',
        actionNextLabel: 'Wizard.next',
        actionNextSaveLabel: 'Wizard.saveAndNext',
        actionFinishLabel: 'Wizard.finish',
        startStep: '1'
    };
    Wizard.propsList = [
        'steps',
        'mode',
        'messages',
        'actionClassName',
        'actionPrevLabel',
        'actionNextLabel',
        'actionNextSaveLabel',
        'actionFinishLabel',
        'onFinished',
        'affixFooter',
        'startStep'
    ];
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "affixDetect", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "formRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "domRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "getPopOverContainer", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Object, Boolean, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleAction", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleQuery", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], Wizard.prototype, "handleChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleInit", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleReset", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleSubmit", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array, Object, Array]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleDialogConfirm", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Wizard.prototype, "handleDialogClose", null);
    return Wizard;
}(React__default["default"].Component));
function isJumpable(step, index, currentStep, data) {
    var canJump = false;
    if (step && step.hasOwnProperty('jumpable')) {
        canJump = step.jumpable;
    }
    else if (step && step.jumpableOn) {
        canJump = amisCore.evalExpression(step.jumpableOn, amisCore.createObject(data, {
            currentStep: currentStep
        }));
    }
    else {
        canJump = index + 1 < currentStep;
    }
    return canJump;
}
/** @class */ ((function (_super) {
    tslib.__extends(WizardRenderer, _super);
    function WizardRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    WizardRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
        _super.prototype.componentWillUnmount.call(this);
    };
    WizardRenderer.prototype.doAction = function (action, data, throwErrors) {
        return this.handleAction(undefined, action, data);
    };
    WizardRenderer.prototype.submitToTarget = function (target, values) {
        var scoped = this.context;
        scoped.send(target, values);
    };
    WizardRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    WizardRenderer.prototype.handleDialogConfirm = function (values, action, targets) {
        _super.prototype.handleDialogConfirm.call(this, values, action, targets);
        var store = this.props.store;
        var scoped = this.context;
        if (action.reload) {
            scoped.reload(action.reload, store.data);
        }
        else if (store.action && store.action.reload) {
            scoped.reload(store.action.reload, store.data);
        }
    };
    WizardRenderer.prototype.setData = function (values) {
        return this.props.store.updateData(values);
    };
    WizardRenderer.contextType = amisCore.ScopedContext;
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array, Object, Array]),
        tslib.__metadata("design:returntype", void 0)
    ], WizardRenderer.prototype, "handleDialogConfirm", null);
    WizardRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'wizard',
            storeType: amisCore.ServiceStore.name,
            isolateScope: true
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], WizardRenderer);
    return WizardRenderer;
})(Wizard));

exports["default"] = Wizard;
