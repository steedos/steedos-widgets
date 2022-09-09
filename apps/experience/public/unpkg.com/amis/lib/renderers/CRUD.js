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
var pick = require('lodash/pick');
var ReactDOM = require('react-dom');
var omit = require('lodash/omit');
var find = require('lodash/find');
var findIndex = require('lodash/findIndex');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var findIndex__default = /*#__PURE__*/_interopDefaultLegacy(findIndex);

var CRUD = /** @class */ (function (_super) {
    tslib.__extends(CRUD, _super);
    function CRUD(props) {
        var _this = _super.call(this, props) || this;
        _this.controlRef = _this.controlRef.bind(_this);
        _this.handleFilterReset = _this.handleFilterReset.bind(_this);
        _this.handleFilterSubmit = _this.handleFilterSubmit.bind(_this);
        _this.handleFilterInit = _this.handleFilterInit.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleBulkAction = _this.handleBulkAction.bind(_this);
        _this.handleChangePage = _this.handleChangePage.bind(_this);
        _this.handleBulkGo = _this.handleBulkGo.bind(_this);
        _this.handleDialogConfirm = _this.handleDialogConfirm.bind(_this);
        _this.handleDialogClose = _this.handleDialogClose.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.handleSaveOrder = _this.handleSaveOrder.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleChildPopOverOpen = _this.handleChildPopOverOpen.bind(_this);
        _this.handleChildPopOverClose = _this.handleChildPopOverClose.bind(_this);
        _this.search = _this.search.bind(_this);
        _this.silentSearch = _this.silentSearch.bind(_this);
        _this.handleQuery = _this.handleQuery.bind(_this);
        _this.renderHeaderToolbar = _this.renderHeaderToolbar.bind(_this);
        _this.renderFooterToolbar = _this.renderFooterToolbar.bind(_this);
        _this.clearSelection = _this.clearSelection.bind(_this);
        var location = props.location, store = props.store, pageField = props.pageField, perPageField = props.perPageField, syncLocation = props.syncLocation; props.loadDataOnce;
        _this.mounted = true;
        if (syncLocation && location && (location.query || location.search)) {
            store.updateQuery(amisCore.qsparse(location.search.substring(1)), undefined, pageField, perPageField);
        }
        else if (syncLocation && !location && window.location.search) {
            store.updateQuery(amisCore.qsparse(window.location.search.substring(1)), undefined, pageField, perPageField);
        }
        _this.props.store.setFilterTogglable(!!_this.props.filterTogglable, _this.props.filterDefaultVisible);
        // 如果有 api，data 里面先写个 空数组，面得继承外层的 items
        // 比如 crud 打开一个弹框，里面也是个 crud，默认一开始其实显示
        // 的是外层 crud 的数据，等接口回来后就会变成新的。
        // 加上这个就是为了解决这种情况
        if (_this.props.api) {
            _this.props.store.updateData({
                items: []
            });
        }
        return _this;
    }
    CRUD.prototype.componentDidMount = function () {
        var _a = this.props, store = _a.store, autoGenerateFilter = _a.autoGenerateFilter; _a.columns;
        if (this.props.perPage) {
            store.changePage(store.page, this.props.perPage);
        }
        // 没有 filter 或者 没有展示 filter 时应该默认初始化一次，
        // 否则就应该等待 filter 里面的表单初始化的时候才初始化
        // 另外autoGenerateFilter时，table 里面会单独处理这块逻辑
        // 所以这里应该忽略 autoGenerateFilter 情况
        if ((!this.props.filter && !autoGenerateFilter) ||
            (store.filterTogggable && !store.filterVisible)) {
            this.handleFilterInit({});
        }
        var val;
        if (this.props.pickerMode && (val = amisCore.getPropValue(this.props))) {
            store.setSelectedItems(val);
        }
    };
    CRUD.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = prevProps.store;
        if (amisCore.anyChanged(['toolbar', 'headerToolbar', 'footerToolbar', 'bulkActions'], prevProps, props)) {
            // 来点参数变化。
            this.renderHeaderToolbar = this.renderHeaderToolbar.bind(this);
            this.renderFooterToolbar = this.renderFooterToolbar.bind(this);
        }
        var val;
        if (this.props.pickerMode &&
            amisCore.isArrayChildrenModified((val = amisCore.getPropValue(this.props)), amisCore.getPropValue(prevProps))) {
            store.setSelectedItems(val);
        }
        if (this.props.filterTogglable !== prevProps.filterTogglable) {
            store.setFilterTogglable(!!props.filterTogglable, props.filterDefaultVisible);
        }
        var dataInvalid = false;
        if (prevProps.syncLocation &&
            prevProps.location &&
            prevProps.location.search !== props.location.search) {
            // 同步地址栏，那么直接检测 query 是否变了，变了就重新拉数据
            store.updateQuery(amisCore.qsparse(props.location.search.substring(1)), undefined, props.pageField, props.perPageField);
            dataInvalid = !!(props.api && amisCore.isObjectShallowModified(store.query, this.lastQuery, false));
        }
        if (dataInvalid) ;
        else if (prevProps.api &&
            props.api &&
            amisCore.isApiOutdated(prevProps.api, props.api, store.fetchCtxOf(prevProps.data, {
                pageField: prevProps.pageField,
                perPageField: prevProps.perPageField
            }), store.fetchCtxOf(props.data, {
                pageField: props.pageField,
                perPageField: props.perPageField
            }))) {
            dataInvalid = true;
        }
        else if (!props.api && amisCore.isPureVariable(props.source)) {
            var next = amisCore.resolveVariableAndFilter(props.source, props.data, '| raw');
            if (!this.lastData || this.lastData !== next) {
                store.initFromScope(props.data, props.source);
                this.lastData = next;
            }
        }
        if (dataInvalid) {
            this.search();
        }
    };
    CRUD.prototype.componentWillUnmount = function () {
        this.mounted = false;
        clearTimeout(this.timer);
    };
    CRUD.prototype.controlRef = function (control) {
        // 因为 control 有可能被 n 层 hoc 包裹。
        while (control && control.getWrappedInstance) {
            control = control.getWrappedInstance();
        }
        this.control = control;
    };
    CRUD.prototype.handleAction = function (e, action, ctx, throwErrors, delegate) {
        var _this = this;
        if (throwErrors === void 0) { throwErrors = false; }
        var _a = this.props, onAction = _a.onAction, store = _a.store, messages = _a.messages, pickerMode = _a.pickerMode, env = _a.env; _a.pageField; var stopAutoRefreshWhenModalIsOpen = _a.stopAutoRefreshWhenModalIsOpen;
        if (action.actionType === 'dialog') {
            store.setCurrentAction(action);
            var idx = ctx.index;
            var length_1 = store.items.length;
            stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
            store.openDialog(ctx, {
                hasNext: idx < length_1 - 1,
                nextIndex: idx + 1,
                hasPrev: idx > 0,
                prevIndex: idx - 1,
                index: idx
            });
        }
        else if (action.actionType === 'ajax') {
            store.setCurrentAction(action);
            var data = ctx;
            // 由于 ajax 一段时间后再弹出，肯定被浏览器给阻止掉的，所以提前弹。
            var redirect = action.redirect && amisCore.filter(action.redirect, data);
            redirect && action.blank && env.jumpTo(redirect, action);
            return store
                .saveRemote(action.api, data, {
                successMessage: (action.messages && action.messages.success) ||
                    (messages && messages.saveSuccess),
                errorMessage: (action.messages && action.messages.failed) ||
                    (messages && messages.saveFailed)
            })
                .then(function (payload) { return tslib.__awaiter(_this, void 0, void 0, function () {
                var data, redirect;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = amisCore.createObject(ctx, payload);
                            if (!(action.feedback && amisCore.isVisible(action.feedback, data))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.openFeedback(action.feedback, data)];
                        case 1:
                            _a.sent();
                            stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
                            _a.label = 2;
                        case 2:
                            redirect = action.redirect && amisCore.filter(action.redirect, data);
                            redirect && !action.blank && env.jumpTo(redirect, action);
                            action.reload
                                ? this.reloadTarget(action.reload, data)
                                : redirect
                                    ? null
                                    : this.search(undefined, undefined, true, true);
                            action.close && this.closeTarget(action.close);
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
        else if (action.actionType === 'reload' && !action.target) {
            this.reload();
        }
        else if (pickerMode &&
            (action.actionType === 'confirm' || action.actionType === 'submit')) {
            store.setCurrentAction(action);
            return Promise.resolve({
                items: store.selectedItems.concat()
            });
        }
        else if (action.onClick) {
            store.setCurrentAction(action);
            var onClick = action.onClick;
            if (typeof onClick === 'string') {
                onClick = amisCore.str2function(onClick, 'event', 'props', 'data');
            }
            onClick && onClick(e, this.props, ctx);
        }
        else {
            onAction(e, action, ctx, throwErrors, delegate || this.context);
        }
    };
    CRUD.prototype.handleBulkAction = function (selectedItems, unSelectedItems, e, action) {
        var _this = this;
        var _a = this.props, store = _a.store, primaryField = _a.primaryField, onAction = _a.onAction, messages = _a.messages, pageField = _a.pageField, stopAutoRefreshWhenModalIsOpen = _a.stopAutoRefreshWhenModalIsOpen, env = _a.env;
        if (!selectedItems.length && action.requireSelected !== false) {
            return;
        }
        var ids = selectedItems
            .map(function (item) {
            return item.hasOwnProperty(primaryField) ? item[primaryField] : null;
        })
            .filter(function (item) { return item; })
            .join(',');
        var ctx = amisCore.createObject(store.mergedData, tslib.__assign(tslib.__assign({}, selectedItems[0]), { rows: selectedItems, items: selectedItems, selectedItems: selectedItems, unSelectedItems: unSelectedItems, ids: ids }));
        var fn = function () {
            if (action.actionType === 'dialog') {
                return _this.handleAction(e, tslib.__assign(tslib.__assign({}, action), { __from: 'bulkAction' }), ctx);
            }
            else if (action.actionType === 'ajax') {
                amisCore.isEffectiveApi(action.api, ctx) &&
                    store
                        .saveRemote(action.api, ctx, {
                        successMessage: (action.messages && action.messages.success) ||
                            (messages && messages.saveSuccess),
                        errorMessage: (action.messages && action.messages.failed) ||
                            (messages && messages.saveFailed)
                    })
                        .then(function (payload) { return tslib.__awaiter(_this, void 0, void 0, function () {
                        var data, redirect;
                        var _a;
                        return tslib.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    data = amisCore.createObject(ctx, payload);
                                    if (!(action.feedback && amisCore.isVisible(action.feedback, data))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.openFeedback(action.feedback, data)];
                                case 1:
                                    _b.sent();
                                    stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
                                    _b.label = 2;
                                case 2:
                                    action.reload
                                        ? this.reloadTarget(action.reload, data)
                                        : this.search((_a = {}, _a[pageField || 'page'] = 1, _a), undefined, true, true);
                                    action.close && this.closeTarget(action.close);
                                    redirect = action.redirect && amisCore.filter(action.redirect, data);
                                    redirect && env.jumpTo(redirect, action);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function () { return null; });
            }
            else if (onAction) {
                onAction(e, action, ctx, false, _this.context);
            }
        };
        // Action如果配了事件动作也会处理二次确认，这里需要处理一下忽略
        if (!action.ignoreConfirm && action.confirmText && env.confirm) {
            env
                .confirm(amisCore.filter(action.confirmText, ctx))
                .then(function (confirmed) { return confirmed && fn(); });
        }
        else {
            fn();
        }
    };
    CRUD.prototype.handleItemAction = function (action, ctx) {
        this.doAction(action, ctx);
    };
    CRUD.prototype.handleFilterInit = function (values) {
        var _a = this.props, defaultParams = _a.defaultParams; _a.data; var store = _a.store, orderBy = _a.orderBy, orderDir = _a.orderDir;
        var params = tslib.__assign({}, defaultParams);
        if (orderBy) {
            params['orderBy'] = orderBy;
            params['orderDir'] = orderDir || 'asc';
        }
        this.handleFilterSubmit(tslib.__assign(tslib.__assign(tslib.__assign({}, params), values), store.query), false, true, this.props.initFetch !== false);
        store.setPristineQuery();
        var _b = this.props, pickerMode = _b.pickerMode, options = _b.options;
        pickerMode &&
            store.updateData({
                items: options || []
            });
    };
    CRUD.prototype.handleFilterReset = function (values, action) {
        var _a = this.props, store = _a.store, syncLocation = _a.syncLocation, env = _a.env, pageField = _a.pageField, perPageField = _a.perPageField;
        store.updateQuery(store.pristineQuery, syncLocation && env && env.updateLocation
            ? function (location) { return env.updateLocation(location); }
            : undefined, pageField, perPageField, true);
        this.lastQuery = store.query;
        // 对于带 submit 的 reset(包括 actionType 为 reset-and-submit clear-and-submit 和 form 的 resetAfterSubmit 属性)
        // 不执行 search，否则会多次触发接口请求
        if ((action === null || action === void 0 ? void 0 : action.actionType) &&
            ['reset-and-submit', 'clear-and-submit', 'submit'].includes(action.actionType)) {
            return;
        }
        this.search();
    };
    CRUD.prototype.handleFilterSubmit = function (values, jumpToFirstPage, replaceLocation, search) {
        var _a;
        if (jumpToFirstPage === void 0) { jumpToFirstPage = true; }
        if (replaceLocation === void 0) { replaceLocation = false; }
        if (search === void 0) { search = true; }
        var _b = this.props, store = _b.store, syncLocation = _b.syncLocation, env = _b.env, pageField = _b.pageField, perPageField = _b.perPageField, loadDataOnceFetchOnFilter = _b.loadDataOnceFetchOnFilter;
        values = syncLocation
            ? amisCore.qsparse(amisCore.qsstringify(values, undefined, true))
            : values;
        store.updateQuery(tslib.__assign(tslib.__assign({}, values), (_a = {}, _a[pageField || 'page'] = jumpToFirstPage ? 1 : store.page, _a)), syncLocation && env && env.updateLocation
            ? function (location) { return env.updateLocation(location, replaceLocation); }
            : undefined, pageField, perPageField);
        this.lastQuery = store.query;
        search &&
            this.search(undefined, undefined, undefined, loadDataOnceFetchOnFilter);
    };
    CRUD.prototype.handleBulkGo = function (selectedItems, unSelectedItems, e) {
        var _this = this;
        var action = this.props.store.selectedAction;
        var env = this.props.env;
        if (action.confirmText) {
            return env
                .confirm(action.confirmText)
                .then(function (confirmed) {
                return confirmed &&
                    _this.handleBulkAction(selectedItems, unSelectedItems, e, action);
            });
        }
        return this.handleBulkAction(selectedItems, unSelectedItems, e, action);
    };
    CRUD.prototype.handleDialogConfirm = function (values, action, ctx, components) {
        var _a;
        var _b, _c, _d;
        var _e = this.props, store = _e.store, pageField = _e.pageField, stopAutoRefreshWhenModalIsOpen = _e.stopAutoRefreshWhenModalIsOpen, interval = _e.interval, silentPolling = _e.silentPolling, env = _e.env;
        store.closeDialog(true);
        var dialogAction = store.action;
        if (stopAutoRefreshWhenModalIsOpen && interval) {
            this.timer = setTimeout(silentPolling ? this.silentSearch : this.search, Math.max(interval, 1000));
        }
        if (action.actionType === 'next' &&
            typeof ctx.nextIndex === 'number' &&
            store.data.items[ctx.nextIndex]) {
            return this.handleAction(undefined, tslib.__assign({}, dialogAction), amisCore.createObject(amisCore.createObject(store.data, {
                index: ctx.nextIndex
            }), store.data.items[ctx.nextIndex]));
        }
        else if (action.actionType === 'prev' &&
            typeof ctx.prevIndex === 'number' &&
            store.data.items[ctx.prevIndex]) {
            return this.handleAction(undefined, tslib.__assign({}, dialogAction), amisCore.createObject(amisCore.createObject(store.data, {
                index: ctx.prevIndex
            }), store.data.items[ctx.prevIndex]));
        }
        else if (values.length) {
            var value = values[0];
            ctx = amisCore.createObject(ctx, value);
            var component = components[0];
            // 提交来自 form
            if (component && component.props.type === 'form') {
                // 数据保存了，说明列表数据已经无效了，重新刷新。
                if (value && value.__saved) {
                    var reload_1 = (_b = action.reload) !== null && _b !== void 0 ? _b : dialogAction.reload;
                    // 配置了 reload 则跳过自动更新。
                    reload_1 ||
                        this.search(dialogAction.__from ? (_a = {}, _a[pageField || 'page'] = 1, _a) : undefined, undefined, true, true);
                }
                else if (value &&
                    ((value.hasOwnProperty('items') && value.items) ||
                        value.hasOwnProperty('ids')) &&
                    this.control.bulkUpdate) {
                    this.control.bulkUpdate(value, value.items);
                }
            }
        }
        var reload = (_c = action.reload) !== null && _c !== void 0 ? _c : dialogAction.reload;
        if (reload) {
            this.reloadTarget(reload, ctx);
        }
        var redirect = (_d = action.redirect) !== null && _d !== void 0 ? _d : dialogAction.redirect;
        redirect = redirect && amisCore.filter(redirect, ctx);
        redirect && env.jumpTo(redirect, dialogAction);
    };
    CRUD.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var _a = this.props, store = _a.store, stopAutoRefreshWhenModalIsOpen = _a.stopAutoRefreshWhenModalIsOpen, silentPolling = _a.silentPolling, interval = _a.interval;
        store.closeDialog(confirmed);
        if (stopAutoRefreshWhenModalIsOpen && interval) {
            this.timer = setTimeout(silentPolling ? this.silentSearch : this.search, Math.max(interval, 1000));
        }
    };
    CRUD.prototype.openFeedback = function (dialog, ctx) {
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
    CRUD.prototype.search = function (values, silent, clearSelection, forceReload) {
        var _this = this;
        var _a;
        if (forceReload === void 0) { forceReload = false; }
        var _b = this.props, store = _b.store, api = _b.api, messages = _b.messages, pageField = _b.pageField, perPageField = _b.perPageField, interval = _b.interval, stopAutoRefreshWhen = _b.stopAutoRefreshWhen, stopAutoRefreshWhenModalIsOpen = _b.stopAutoRefreshWhenModalIsOpen, silentPolling = _b.silentPolling, syncLocation = _b.syncLocation, syncResponse2Query = _b.syncResponse2Query, keepItemSelectionOnPageChange = _b.keepItemSelectionOnPageChange, pickerMode = _b.pickerMode, env = _b.env, loadDataOnce = _b.loadDataOnce, loadDataOnceFetchOnFilter = _b.loadDataOnceFetchOnFilter, source = _b.source, columns = _b.columns;
        // reload 需要清空用户选择。
        if (keepItemSelectionOnPageChange && clearSelection && !pickerMode) {
            store.setSelectedItems([]);
            store.setUnSelectedItems([]);
        }
        var loadDataMode = '';
        if (values && typeof values.loadDataMode === 'string') {
            loadDataMode = 'load-more';
            delete values.loadDataMode;
        }
        clearTimeout(this.timer);
        values &&
            store.updateQuery(values, !loadDataMode && syncLocation && env && env.updateLocation
                ? env.updateLocation
                : undefined, pageField, perPageField);
        this.lastQuery = store.query;
        var data = amisCore.createObject(store.data, store.query);
        amisCore.isEffectiveApi(api, data)
            ? store
                .fetchInitData(api, data, {
                successMessage: messages && messages.fetchSuccess,
                errorMessage: messages && messages.fetchFailed,
                autoAppend: true,
                forceReload: forceReload,
                loadDataOnce: loadDataOnce,
                loadDataOnceFetchOnFilter: loadDataOnceFetchOnFilter,
                source: source,
                silent: silent,
                pageField: pageField,
                perPageField: perPageField,
                loadDataMode: loadDataMode,
                syncResponse2Query: syncResponse2Query,
                columns: (_a = store.columns) !== null && _a !== void 0 ? _a : columns
            })
                .then(function (value) {
                var _a;
                var page = store.page, lastPage = store.lastPage;
                // 空列表 且 页数已经非法超出，则跳转到最后的合法页数
                if (!store.data.items.length &&
                    !interval &&
                    page > 1 &&
                    lastPage < page) {
                    _this.search(tslib.__assign(tslib.__assign({}, store.query), (_a = {}, _a[pageField || 'page'] = lastPage, _a)), false, undefined);
                }
                interval &&
                    _this.mounted &&
                    (!stopAutoRefreshWhen ||
                        !((stopAutoRefreshWhenModalIsOpen && store.hasModalOpened) ||
                            amisCore.evalExpression(stopAutoRefreshWhen, amisCore.createObject(store.data, store.query)))) &&
                    (_this.timer = setTimeout(silentPolling
                        ? _this.silentSearch.bind(_this, undefined, undefined, true)
                        : _this.search.bind(_this, undefined, undefined, undefined, true), Math.max(interval, 1000)));
                return value;
            })
            : source && store.initFromScope(data, source);
    };
    CRUD.prototype.silentSearch = function (values, clearSelection, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return this.search(values, true, clearSelection, forceReload);
    };
    CRUD.prototype.handleChangePage = function (page, perPage) {
        var _a;
        var _b;
        var _c = this.props, store = _c.store, syncLocation = _c.syncLocation, env = _c.env, pageField = _c.pageField, perPageField = _c.perPageField, autoJumpToTopOnPagerChange = _c.autoJumpToTopOnPagerChange, affixOffsetTop = _c.affixOffsetTop;
        var query = (_a = {},
            _a[pageField || 'page'] = page,
            _a);
        if (perPage) {
            query[perPageField || 'perPage'] = perPage;
        }
        store.updateQuery(query, syncLocation && (env === null || env === void 0 ? void 0 : env.updateLocation) ? env.updateLocation : undefined, pageField, perPageField);
        this.search(undefined, undefined, undefined);
        if (autoJumpToTopOnPagerChange && this.control) {
            ReactDOM.findDOMNode(this.control).scrollIntoView();
            var scrolledY = window.scrollY;
            var offsetTop = (_b = affixOffsetTop !== null && affixOffsetTop !== void 0 ? affixOffsetTop : env === null || env === void 0 ? void 0 : env.affixOffsetTop) !== null && _b !== void 0 ? _b : 0;
            scrolledY && window.scroll(0, scrolledY - offsetTop);
        }
    };
    CRUD.prototype.handleSave = function (rows, diff, indexes, unModifiedItems, rowsOrigin, options) {
        var _this = this;
        var _a = this.props, store = _a.store, quickSaveApi = _a.quickSaveApi, quickSaveItemApi = _a.quickSaveItemApi, primaryField = _a.primaryField, env = _a.env, messages = _a.messages, reload = _a.reload;
        if (Array.isArray(rows)) {
            if (!amisCore.isEffectiveApi(quickSaveApi)) {
                env && env.alert('CRUD quickSaveApi is required');
                return;
            }
            var data_1 = amisCore.createObject(store.data, {
                rows: rows,
                rowsDiff: diff,
                indexes: indexes,
                rowsOrigin: rowsOrigin
            });
            if (rows.length && rows[0].hasOwnProperty(primaryField || 'id')) {
                data_1.ids = rows
                    .map(function (item) { return item[primaryField || 'id']; })
                    .join(',');
            }
            if (unModifiedItems) {
                data_1.unModifiedItems = unModifiedItems;
            }
            store
                .saveRemote(quickSaveApi, data_1, {
                successMessage: messages && messages.saveFailed,
                errorMessage: messages && messages.saveSuccess
            })
                .then(function () {
                var _a;
                var finalReload = (_a = options === null || options === void 0 ? void 0 : options.reload) !== null && _a !== void 0 ? _a : reload;
                finalReload
                    ? _this.reloadTarget(finalReload, data_1)
                    : _this.search(undefined, undefined, true, true);
            })
                .catch(function () { });
        }
        else {
            if (!amisCore.isEffectiveApi(quickSaveItemApi)) {
                env && env.alert('CRUD quickSaveItemApi is required!');
                return;
            }
            var data_2 = amisCore.createObject(store.data, {
                item: rows,
                modified: diff,
                origin: rowsOrigin
            });
            var sendData = amisCore.createObject(data_2, rows);
            store
                .saveRemote(quickSaveItemApi, sendData)
                .then(function () {
                var _a;
                var finalReload = (_a = options === null || options === void 0 ? void 0 : options.reload) !== null && _a !== void 0 ? _a : reload;
                finalReload
                    ? _this.reloadTarget(finalReload, data_2)
                    : _this.search(undefined, undefined, true, true);
            })
                .catch(function () {
                (options === null || options === void 0 ? void 0 : options.resetOnFailed) && _this.control.reset();
            });
        }
    };
    CRUD.prototype.handleSaveOrder = function (moved, rows) {
        var _this = this;
        var _a = this.props, store = _a.store, saveOrderApi = _a.saveOrderApi, orderField = _a.orderField, primaryField = _a.primaryField, env = _a.env, reload = _a.reload;
        if (!saveOrderApi) {
            env && env.alert('CRUD saveOrderApi is required!');
            return;
        }
        var model = amisCore.createObject(store.data);
        var insertAfter;
        var insertBefore;
        var holding = [];
        var hasIdField = primaryField &&
            rows[0] &&
            rows[0].hasOwnProperty(primaryField);
        hasIdField || (model.idMap = {});
        model.insertAfter = {};
        rows.forEach(function (item) {
            if (~moved.indexOf(item)) {
                if (insertAfter) {
                    var insertAfterId = hasIdField
                        ? insertAfter[primaryField]
                        : rows.indexOf(insertAfter);
                    model.insertAfter[insertAfterId] =
                        model.insertAfter[insertAfterId] || [];
                    hasIdField || (model.idMap[insertAfterId] = insertAfter);
                    model.insertAfter[insertAfterId].push(hasIdField ? item[primaryField] : item);
                }
                else {
                    holding.push(item);
                }
            }
            else {
                insertAfter = item;
                insertBefore = insertBefore || item;
            }
        });
        if (insertBefore && holding.length) {
            var insertBeforeId = hasIdField
                ? insertBefore[primaryField]
                : rows.indexOf(insertBefore);
            hasIdField || (model.idMap[insertBeforeId] = insertBefore);
            model.insertBefore = {};
            model.insertBefore[insertBeforeId] = holding.map(function (item) {
                return hasIdField ? item[primaryField] : item;
            });
        }
        else if (holding.length) {
            var first = holding[0];
            var firstId = hasIdField
                ? first[primaryField]
                : rows.indexOf(first);
            hasIdField || (model.idMap[firstId] = first);
            model.insertAfter[firstId] = holding
                .slice(1)
                .map(function (item) { return (hasIdField ? item[primaryField] : item); });
        }
        if (orderField) {
            var start_1 = (store.page - 1) * store.perPage || 0;
            rows = rows.map(function (item, key) {
                var _a;
                return amisCore.extendObject(item, (_a = {},
                    _a[orderField] = start_1 + key + 1,
                    _a));
            });
        }
        model.rows = rows.concat();
        hasIdField &&
            (model.ids = rows
                .map(function (item) { return item[primaryField]; })
                .join(','));
        hasIdField &&
            orderField &&
            (model.order = rows.map(function (item) {
                return pick__default["default"](item, [primaryField, orderField]);
            }));
        amisCore.isEffectiveApi(saveOrderApi, model) &&
            store
                .saveRemote(saveOrderApi, model)
                .then(function () {
                reload && _this.reloadTarget(reload, model);
                _this.search(undefined, undefined, true, true);
            })
                .catch(function () { });
    };
    CRUD.prototype.handleSelect = function (items, unSelectedItems) {
        var _a = this.props, store = _a.store, keepItemSelectionOnPageChange = _a.keepItemSelectionOnPageChange, primaryField = _a.primaryField, multiple = _a.multiple, pickerMode = _a.pickerMode, onSelect = _a.onSelect;
        var newItems = items;
        var newUnSelectedItems = unSelectedItems;
        if (keepItemSelectionOnPageChange && store.selectedItems.length) {
            var oldItems_1 = store.selectedItems.concat();
            var oldUnselectedItems_1 = store.unSelectedItems.concat();
            items.forEach(function (item) {
                var idx = findIndex__default["default"](oldItems_1, function (a) {
                    return a === item ||
                        (a[primaryField || 'id'] &&
                            a[primaryField || 'id'] == item[primaryField || 'id']);
                });
                if (~idx) {
                    oldItems_1[idx] = item;
                }
                else {
                    oldItems_1.push(item);
                }
                var idx2 = findIndex__default["default"](oldUnselectedItems_1, function (a) {
                    return a === item ||
                        (a[primaryField || 'id'] &&
                            a[primaryField || 'id'] == item[primaryField || 'id']);
                });
                if (~idx2) {
                    oldUnselectedItems_1.splice(idx2, 1);
                }
            });
            unSelectedItems.forEach(function (item) {
                var idx = findIndex__default["default"](oldUnselectedItems_1, function (a) {
                    return a === item ||
                        (a[primaryField || 'id'] &&
                            a[primaryField || 'id'] == item[primaryField || 'id']);
                });
                var idx2 = findIndex__default["default"](oldItems_1, function (a) {
                    return a === item ||
                        (a[primaryField || 'id'] &&
                            a[primaryField || 'id'] == item[primaryField || 'id']);
                });
                if (~idx) {
                    oldUnselectedItems_1[idx] = item;
                }
                else {
                    oldUnselectedItems_1.push(item);
                }
                ~idx2 && oldItems_1.splice(idx2, 1);
            });
            newItems = oldItems_1;
            newUnSelectedItems = oldUnselectedItems_1;
            // const thisBatch = items.concat(unSelectedItems);
            // let notInThisBatch = (item: any) =>
            //   !find(
            //     thisBatch,
            //     a => a[primaryField || 'id'] == item[primaryField || 'id']
            //   );
            // newItems = store.selectedItems.filter(notInThisBatch);
            // newUnSelectedItems = store.unSelectedItems.filter(notInThisBatch);
            // newItems.push(...items);
            // newUnSelectedItems.push(...unSelectedItems);
        }
        if (pickerMode && multiple === false && newItems.length > 1) {
            newUnSelectedItems.push.apply(newUnSelectedItems, newItems.splice(0, newItems.length - 1));
        }
        store.setSelectedItems(newItems);
        store.setUnSelectedItems(newUnSelectedItems);
        onSelect && onSelect(newItems);
    };
    CRUD.prototype.handleChildPopOverOpen = function (popOver) {
        if (this.props.interval &&
            popOver &&
            ~['dialog', 'drawer'].indexOf(popOver.mode)) {
            this.props.stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
            this.props.store.setInnerModalOpened(true);
        }
    };
    CRUD.prototype.handleChildPopOverClose = function (popOver) {
        var _a = this.props, stopAutoRefreshWhenModalIsOpen = _a.stopAutoRefreshWhenModalIsOpen, silentPolling = _a.silentPolling, interval = _a.interval;
        if (popOver && ~['dialog', 'drawer'].indexOf(popOver.mode)) {
            this.props.store.setInnerModalOpened(false);
            if (stopAutoRefreshWhenModalIsOpen && interval) {
                this.timer = setTimeout(silentPolling ? this.silentSearch : this.search, Math.max(interval, 1000));
            }
        }
    };
    CRUD.prototype.handleQuery = function (values, forceReload) {
        var _a;
        if (forceReload === void 0) { forceReload = false; }
        var _b = this.props, store = _b.store, syncLocation = _b.syncLocation, env = _b.env, pageField = _b.pageField, perPageField = _b.perPageField;
        store.updateQuery(tslib.__assign(tslib.__assign({}, values), (_a = {}, _a[pageField || 'page'] = 1, _a)), syncLocation && env && env.updateLocation
            ? env.updateLocation
            : undefined, pageField, perPageField);
        this.search(undefined, undefined, undefined, forceReload);
    };
    CRUD.prototype.reload = function (subpath, query) {
        if (query) {
            return this.receive(query);
        }
        else {
            this.search(undefined, undefined, true, true);
        }
    };
    CRUD.prototype.receive = function (values) {
        this.handleQuery(values, true);
    };
    CRUD.prototype.reloadTarget = function (target, data) {
        // implement this.
    };
    CRUD.prototype.closeTarget = function (target) {
        // implement this.
    };
    CRUD.prototype.doAction = function (action, data, throwErrors) {
        if (throwErrors === void 0) { throwErrors = false; }
        return this.handleAction(undefined, action, data, throwErrors);
    };
    CRUD.prototype.unSelectItem = function (item, index) {
        var store = this.props.store;
        var selected = store.selectedItems.concat();
        var unSelected = store.unSelectedItems.concat();
        var idx = selected.indexOf(item);
        ~idx && unSelected.push.apply(unSelected, selected.splice(idx, 1));
        store.setSelectedItems(selected);
        store.setUnSelectedItems(unSelected);
    };
    CRUD.prototype.clearSelection = function () {
        var store = this.props.store;
        var selected = store.selectedItems.concat();
        var unSelected = store.unSelectedItems.concat();
        store.setSelectedItems([]);
        store.setUnSelectedItems(unSelected.concat(selected));
    };
    CRUD.prototype.hasBulkActionsToolbar = function () {
        var _a = this.props, headerToolbar = _a.headerToolbar, footerToolbar = _a.footerToolbar;
        var isBulkActions = function (item) {
            return ~['bulkActions', 'bulk-actions'].indexOf(item.type || item);
        };
        return ((Array.isArray(headerToolbar) && find__default["default"](headerToolbar, isBulkActions)) ||
            (Array.isArray(footerToolbar) && find__default["default"](footerToolbar, isBulkActions)));
    };
    CRUD.prototype.hasBulkActions = function () {
        var _a = this.props, bulkActions = _a.bulkActions; _a.itemActions; var store = _a.store;
        if (!bulkActions || !bulkActions.length) {
            return false;
        }
        var bulkBtns = [];
        var ctx = store.mergedData;
        if (bulkActions && bulkActions.length) {
            bulkBtns = bulkActions
                .map(function (item) { return (tslib.__assign(tslib.__assign({}, item), amisCore.getExprProperties(item, ctx))); })
                .filter(function (item) { return !item.hidden && item.visible !== false; });
        }
        return bulkBtns.length;
    };
    CRUD.prototype.renderBulkActions = function (childProps) {
        var _this = this;
        var _a = this.props, bulkActions = _a.bulkActions, itemActions = _a.itemActions, store = _a.store, render = _a.render, cx = _a.classnames;
        if (!bulkActions || !bulkActions.length) {
            return null;
        }
        var selectedItems = store.selectedItems;
        var unSelectedItems = store.unSelectedItems;
        var bulkBtns = [];
        var itemBtns = [];
        var ctx = amisCore.createObject(store.mergedData, {
            selectedItems: selectedItems.concat(),
            unSelectedItems: unSelectedItems.concat()
        });
        // const ctx = createObject(store.data, {
        //     ...store.query,
        //     items: childProps.items,
        //     selectedItems: childProps.selectedItems,
        //     unSelectedItems: childProps.unSelectedItems
        // });
        if (bulkActions &&
            bulkActions.length &&
            (!itemActions || !itemActions.length || selectedItems.length > 1)) {
            bulkBtns = bulkActions
                .map(function (item) { return (tslib.__assign(tslib.__assign({}, item), amisCore.getExprProperties(item, ctx))); })
                .filter(function (item) { return !item.hidden && item.visible !== false; });
        }
        var itemData = amisCore.createObject(store.data, selectedItems.length ? selectedItems[0] : {});
        if (itemActions && selectedItems.length <= 1) {
            itemBtns = itemActions
                .map(function (item) { return (tslib.__assign(tslib.__assign({}, item), amisCore.getExprProperties(item, itemData))); })
                .filter(function (item) { return !item.hidden && item.visible !== false; });
        }
        return bulkBtns.length || itemBtns.length ? (React__default["default"].createElement("div", { className: cx('Crud-actions') },
            bulkBtns.map(function (btn, index) {
                return render("bulk-action/".concat(index), tslib.__assign(tslib.__assign({}, omit__default["default"](btn, ['visibleOn', 'hiddenOn', 'disabledOn'])), { type: btn.type || 'button', ignoreConfirm: true }), {
                    key: "bulk-".concat(index),
                    data: ctx,
                    disabled: btn.disabled ||
                        (btn.requireSelected !== false ? !selectedItems.length : false),
                    onAction: _this.handleBulkAction.bind(_this, selectedItems.concat(), unSelectedItems.concat())
                });
            }),
            itemBtns.map(function (btn, index) {
                return render("bulk-action/".concat(index), tslib.__assign(tslib.__assign({}, omit__default["default"](btn, ['visibleOn', 'hiddenOn', 'disabledOn'])), { type: 'button' }), {
                    key: "item-".concat(index),
                    data: itemData,
                    disabled: btn.disabled || selectedItems.length !== 1,
                    onAction: _this.handleItemAction.bind(_this, btn, itemData)
                });
            }))) : null;
    };
    CRUD.prototype.renderPagination = function (toolbar) {
        var _a = this.props, store = _a.store, render = _a.render, cx = _a.classnames, alwaysShowPagination = _a.alwaysShowPagination;
        var page = store.page, lastPage = store.lastPage;
        if (store.mode !== 'simple' &&
            store.lastPage < 2 &&
            !alwaysShowPagination) {
            return null;
        }
        var extraProps = {};
        /** 优先级：showPageInput显性配置 > (lastPage > 9) */
        if (typeof toolbar !== 'string') {
            var showPageInput = toolbar.showPageInput;
            extraProps.showPageInput =
                showPageInput === true || (lastPage > 9 && showPageInput == null);
            extraProps.maxButtons = toolbar.maxButtons;
            extraProps.layout = toolbar.layout;
        }
        else {
            extraProps.showPageInput = lastPage > 9;
        }
        return (React__default["default"].createElement("div", { className: cx('Crud-pager') }, render('pagination', {
            type: 'pagination'
        }, tslib.__assign(tslib.__assign({}, extraProps), { activePage: page, lastPage: lastPage, hasNext: store.hasNext, mode: store.mode, perPage: store.perPage, onPageChange: this.handleChangePage }))));
    };
    CRUD.prototype.renderStatistics = function () {
        var _a = this.props, store = _a.store, cx = _a.classnames, __ = _a.translate, alwaysShowPagination = _a.alwaysShowPagination;
        if (store.lastPage <= 1 && !alwaysShowPagination) {
            return null;
        }
        return (React__default["default"].createElement("div", { className: cx('Crud-statistics') }, __('CRUD.stat', {
            page: store.page,
            lastPage: store.lastPage,
            total: store.total
        })));
    };
    CRUD.prototype.renderSwitchPerPage = function (childProps) {
        var _this = this;
        var _a = this.props, store = _a.store, perPageAvailable = _a.perPageAvailable, cx = _a.classnames, ns = _a.classPrefix, __ = _a.translate;
        var items = childProps.items;
        if (!items.length) {
            return null;
        }
        var perPages = (perPageAvailable || [5, 10, 20, 50, 100]).map(function (item) { return ({
            label: item,
            value: item + ''
        }); });
        return (React__default["default"].createElement("div", { className: cx('Crud-pageSwitch') },
            React__default["default"].createElement("span", null, __('CRUD.perPage')),
            React__default["default"].createElement(amisUi.Select, { classPrefix: ns, searchable: false, placeholder: __('Select.placeholder'), options: perPages, value: store.perPage + '', onChange: function (value) { return _this.handleChangePage(1, value.value); }, clearable: false })));
    };
    CRUD.prototype.renderLoadMore = function () {
        var _this = this;
        var _a = this.props, store = _a.store, ns = _a.classPrefix, cx = _a.classnames, __ = _a.translate;
        var page = store.page, lastPage = store.lastPage;
        return page < lastPage ? (React__default["default"].createElement("div", { className: cx('Crud-loadMore') },
            React__default["default"].createElement(amisUi.Button, { classPrefix: ns, onClick: function () {
                    return _this.search({ page: page + 1, loadDataMode: 'load-more' });
                }, size: "sm" }, __('CRUD.loadMore')))) : ('');
    };
    CRUD.prototype.renderFilterToggler = function () {
        var _a = this.props, store = _a.store, cx = _a.classnames, __ = _a.translate;
        if (!store.filterTogggable) {
            return null;
        }
        return (React__default["default"].createElement("button", { onClick: function () { return store.setFilterVisible(!store.filterVisible); }, className: cx('Button Button--sm Button--default', {
                'is-active': store.filterVisible
            }) },
            React__default["default"].createElement(amisUi.Icon, { icon: "filter", className: "icon m-r-xs" }),
            __('CRUD.filter')));
    };
    CRUD.prototype.renderExportCSV = function (toolbar) {
        var _a = this.props, store = _a.store, ns = _a.classPrefix; _a.classnames; var __ = _a.translate, loadDataOnce = _a.loadDataOnce, data = _a.data;
        var api = toolbar.api;
        return (React__default["default"].createElement(amisUi.Button, { classPrefix: ns, onClick: function () {
                return store.exportAsCSV({
                    loadDataOnce: loadDataOnce,
                    api: api,
                    data: data
                });
            } }, toolbar.label || __('CRUD.exportCSV')));
    };
    CRUD.prototype.renderToolbar = function (toolbar, index, childProps, toolbarRenderer) {
        var _this = this;
        if (index === void 0) { index = 0; }
        if (childProps === void 0) { childProps = {}; }
        if (!toolbar) {
            return null;
        }
        var _a = this.props, render = _a.render, store = _a.store, __ = _a.translate;
        var type = toolbar.type || toolbar;
        if (type === 'bulkActions' || type === 'bulk-actions') {
            return this.renderBulkActions(childProps);
        }
        else if (type === 'pagination') {
            return this.renderPagination(toolbar);
        }
        else if (type === 'statistics') {
            return this.renderStatistics();
        }
        else if (type === 'switch-per-page') {
            return this.renderSwitchPerPage(childProps);
        }
        else if (type === 'load-more') {
            return this.renderLoadMore();
        }
        else if (type === 'filter-toggler') {
            return this.renderFilterToggler();
        }
        else if (type === 'export-csv') {
            return this.renderExportCSV(toolbar);
        }
        else if (type === 'reload') {
            var reloadButton = {
                label: '',
                icon: 'fa fa-sync',
                tooltip: __('reload'),
                tooltipPlacement: 'top',
                type: 'button'
            };
            if (typeof toolbar === 'object') {
                reloadButton = tslib.__assign(tslib.__assign({}, reloadButton), omit__default["default"](toolbar, ['type', 'align']));
            }
            return render("toolbar/".concat(index), reloadButton, {
                onAction: function () {
                    _this.reload();
                }
            });
        }
        else if (Array.isArray(toolbar)) {
            var children = toolbar
                .filter(function (toolbar) { return amisCore.isVisible(toolbar, store.filterData); })
                .map(function (toolbar, index) { return ({
                dom: _this.renderToolbar(toolbar, index, childProps, toolbarRenderer),
                toolbar: toolbar
            }); })
                .filter(function (item) { return item.dom; });
            var len = children.length;
            var cx_1 = this.props.classnames;
            if (len) {
                return (React__default["default"].createElement("div", { className: cx_1('Crud-toolbar'), key: index }, children.map(function (_a, index) {
                    var toolbar = _a.toolbar, child = _a.dom;
                    var type = toolbar.type || toolbar;
                    var align = toolbar.align || (type === 'pagination' ? 'right' : 'left');
                    return (React__default["default"].createElement("div", { key: index, className: cx_1('Crud-toolbar-item', align ? "Crud-toolbar-item--".concat(align) : ''
                        // toolbar.className
                        ) }, child));
                })));
            }
            return null;
        }
        var result = toolbarRenderer
            ? toolbarRenderer(toolbar, index)
            : undefined;
        if (result !== void 0) {
            return result;
        }
        var $$editable = childProps.$$editable;
        return render("toolbar/".concat(index), toolbar, {
            // 包两层，主要是为了处理以下 case
            // 里面放了个 form，form 提交过来的时候不希望把 items 这些发送过来。
            // 因为会把数据呈现在地址栏上。
            data: amisCore.createObject(amisCore.createObject(store.filterData, {
                items: childProps.items,
                selectedItems: childProps.selectedItems,
                unSelectedItems: childProps.unSelectedItems
            }), {}),
            page: store.page,
            lastPage: store.lastPage,
            perPage: store.perPage,
            total: store.total,
            onQuery: this.handleQuery,
            onAction: this.handleAction,
            onChangePage: this.handleChangePage,
            onBulkAction: this.handleBulkAction,
            $$editable: $$editable
        });
    };
    CRUD.prototype.renderHeaderToolbar = function (childProps, toolbarRenderer) {
        var _a = this.props, toolbar = _a.toolbar, toolbarInline = _a.toolbarInline, headerToolbar = _a.headerToolbar;
        if (toolbar) {
            if (Array.isArray(headerToolbar)) {
                headerToolbar = toolbarInline
                    ? headerToolbar.concat(toolbar)
                    : [headerToolbar, toolbar];
            }
            else if (headerToolbar) {
                headerToolbar = [headerToolbar, toolbar];
            }
            else {
                headerToolbar = toolbar;
            }
        }
        return this.renderToolbar(headerToolbar || [], 0, childProps, toolbarRenderer);
    };
    CRUD.prototype.renderFooterToolbar = function (childProps, toolbarRenderer) {
        var _a = this.props, toolbar = _a.toolbar, toolbarInline = _a.toolbarInline, footerToolbar = _a.footerToolbar;
        if (toolbar) {
            if (Array.isArray(footerToolbar)) {
                footerToolbar = toolbarInline
                    ? footerToolbar.concat(toolbar)
                    : [footerToolbar, toolbar];
            }
            else if (footerToolbar) {
                footerToolbar = [footerToolbar, toolbar];
            }
            else {
                footerToolbar = toolbar;
            }
        }
        return this.renderToolbar(footerToolbar, 0, childProps, toolbarRenderer);
    };
    CRUD.prototype.renderSelection = function () {
        var _this = this;
        var _a = this.props, store = _a.store, cx = _a.classnames, labelField = _a.labelField, labelTpl = _a.labelTpl, primaryField = _a.primaryField, __ = _a.translate;
        if (!store.selectedItems.length) {
            return null;
        }
        return (React__default["default"].createElement("div", { className: cx('Crud-selection') },
            React__default["default"].createElement("div", { className: cx('Crud-selectionLabel') }, __('CRUD.selected', { total: store.selectedItems.length })),
            store.selectedItems.map(function (item, index) { return (React__default["default"].createElement("div", { key: index, className: cx("Crud-value") },
                React__default["default"].createElement("span", { "data-tooltip": __('delete'), "data-position": "bottom", className: cx('Crud-valueIcon'), onClick: _this.unSelectItem.bind(_this, item, index) }, "\u00D7"),
                React__default["default"].createElement("span", { className: cx('Crud-valueLabel') }, labelTpl ? (React__default["default"].createElement(amisUi.Html, { html: amisCore.filter(labelTpl, item) })) : (amisCore.getVariable(item, labelField || 'label') ||
                    amisCore.getVariable(item, primaryField || 'id'))))); }),
            React__default["default"].createElement("a", { onClick: this.clearSelection, className: cx('Crud-selectionClear') }, __('clear'))));
    };
    CRUD.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, bodyClassName = _b.bodyClassName, filter = _b.filter, render = _b.render, store = _b.store, mode = _b.mode; _b.syncLocation; _b.children; var bulkActions = _b.bulkActions, pickerMode = _b.pickerMode, multiple = _b.multiple, valueField = _b.valueField, primaryField = _b.primaryField; _b.value; var hideQuickSaveBtn = _b.hideQuickSaveBtn, itemActions = _b.itemActions, cx = _b.classnames, keepItemSelectionOnPageChange = _b.keepItemSelectionOnPageChange, maxKeepItemSelectionLength = _b.maxKeepItemSelectionLength; _b.onAction; var popOverContainer = _b.popOverContainer, __ = _b.translate; _b.onQuery; var autoGenerateFilter = _b.autoGenerateFilter; _b.onSelect; var autoFillHeight = _b.autoFillHeight; _b.onEvent; var rest = tslib.__rest(_b, ["className", "bodyClassName", "filter", "render", "store", "mode", "syncLocation", "children", "bulkActions", "pickerMode", "multiple", "valueField", "primaryField", "value", "hideQuickSaveBtn", "itemActions", "classnames", "keepItemSelectionOnPageChange", "maxKeepItemSelectionLength", "onAction", "popOverContainer", "translate", "onQuery", "autoGenerateFilter", "onSelect", "autoFillHeight", "onEvent"]);
        return (React__default["default"].createElement("div", { className: cx('Crud', className, {
                'is-loading': store.loading
            }) },
            filter && (!store.filterTogggable || store.filterVisible)
                ? render('filter', tslib.__assign(tslib.__assign({ title: __('CRUD.filter'), mode: 'inline', submitText: __('search') }, filter), { type: 'form', api: null }), {
                    key: 'filter',
                    panelClassName: cx('Crud-filter', filter.panelClassName || 'Panel--default'),
                    data: store.filterData,
                    onReset: this.handleFilterReset,
                    onSubmit: this.handleFilterSubmit,
                    onInit: this.handleFilterInit,
                    formStore: undefined
                })
                : null,
            keepItemSelectionOnPageChange && multiple !== false
                ? this.renderSelection()
                : null,
            render('body', tslib.__assign(tslib.__assign({}, rest), { columns: (_a = store.columns) !== null && _a !== void 0 ? _a : rest.columns, type: mode || 'table' }), {
                key: 'body',
                className: cx('Crud-body', bodyClassName),
                ref: this.controlRef,
                autoGenerateFilter: !filter && autoGenerateFilter,
                autoFillHeight: autoFillHeight,
                selectable: !!((this.hasBulkActionsToolbar() && this.hasBulkActions()) ||
                    pickerMode),
                itemActions: itemActions,
                multiple: multiple === void 0
                    ? bulkActions && bulkActions.length > 0
                        ? true
                        : false
                    : multiple,
                selected: pickerMode || keepItemSelectionOnPageChange
                    ? store.selectedItemsAsArray
                    : undefined,
                keepItemSelectionOnPageChange: keepItemSelectionOnPageChange,
                maxKeepItemSelectionLength: maxKeepItemSelectionLength,
                valueField: valueField || primaryField,
                primaryField: primaryField,
                hideQuickSaveBtn: hideQuickSaveBtn,
                items: store.data.items,
                query: store.query,
                orderBy: store.query.orderBy,
                orderDir: store.query.orderDir,
                popOverContainer: popOverContainer,
                onAction: this.handleAction,
                onSave: this.handleSave,
                onSaveOrder: this.handleSaveOrder,
                onQuery: this.handleQuery,
                onSelect: this.handleSelect,
                onPopOverOpened: this.handleChildPopOverOpen,
                onPopOverClosed: this.handleChildPopOverClose,
                onSearchableFromReset: this.handleFilterReset,
                onSearchableFromSubmit: this.handleFilterSubmit,
                onSearchableFromInit: this.handleFilterInit,
                headerToolbarRender: this.renderHeaderToolbar,
                footerToolbarRender: this.renderFooterToolbar,
                data: store.mergedData,
                loading: store.loading
            }),
            render('dialog', tslib.__assign(tslib.__assign({}, (store.action &&
                store.action.dialog)), { type: 'dialog' }), {
                key: 'dialog',
                data: store.dialogData,
                onConfirm: this.handleDialogConfirm,
                onClose: this.handleDialogClose,
                show: store.dialogOpen
            })));
    };
    CRUD.propsList = [
        'bulkActions',
        'itemActions',
        'mode',
        'orderField',
        'syncLocation',
        'toolbar',
        'toolbarInline',
        'messages',
        'value',
        'options',
        'multiple',
        'valueField',
        'defaultParams',
        'bodyClassName',
        'perPageAvailable',
        'pageField',
        'perPageField',
        'hideQuickSaveBtn',
        'autoJumpToTopOnPagerChange',
        'interval',
        'silentPolling',
        'stopAutoRefreshWhen',
        'stopAutoRefreshWhenModalIsOpen',
        'api',
        'affixHeader',
        'columnsTogglable',
        'placeholder',
        'tableClassName',
        'headerClassName',
        'footerClassName',
        // 'toolbarClassName',
        'headerToolbar',
        'footerToolbar',
        'filterTogglable',
        'filterDefaultVisible',
        'autoGenerateFilter',
        'syncResponse2Query',
        'keepItemSelectionOnPageChange',
        'labelTpl',
        'labelField',
        'loadDataOnce',
        'loadDataOnceFetchOnFilter',
        'source',
        'header',
        'columns',
        'size',
        'onChange',
        'onInit',
        'onSaved',
        'onQuery',
        'formStore',
        'autoFillHeight'
    ];
    CRUD.defaultProps = {
        toolbarInline: true,
        headerToolbar: ['bulkActions'],
        footerToolbar: ['statistics', 'pagination'],
        primaryField: 'id',
        syncLocation: true,
        pageField: 'page',
        perPageField: 'perPage',
        hideQuickSaveBtn: false,
        autoJumpToTopOnPagerChange: true,
        silentPolling: false,
        filterTogglable: false,
        filterDefaultVisible: true,
        loadDataOnce: false,
        loadDataOnceFetchOnFilter: true,
        autoFillHeight: false
    };
    return CRUD;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CRUDRenderer, _super);
    function CRUDRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    CRUDRenderer.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    CRUDRenderer.prototype.reload = function (subpath, query, ctx) {
        var scoped = this.context;
        if (subpath) {
            return scoped.reload(query ? "".concat(subpath, "?").concat(amisCore.qsstringify(query)) : subpath, ctx);
        }
        return _super.prototype.reload.call(this, subpath, query);
    };
    CRUDRenderer.prototype.receive = function (values, subPath) {
        var scoped = this.context;
        if (subPath) {
            return scoped.send(subPath, values);
        }
        return _super.prototype.receive.call(this, values);
    };
    CRUDRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    CRUDRenderer.prototype.closeTarget = function (target) {
        var scoped = this.context;
        scoped.close(target);
    };
    CRUDRenderer.contextType = amisCore.ScopedContext;
    CRUDRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'crud',
            storeType: amisCore.CRUDStore.name,
            isolateScope: true
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], CRUDRenderer);
    return CRUDRenderer;
})(CRUD));

exports["default"] = CRUD;
