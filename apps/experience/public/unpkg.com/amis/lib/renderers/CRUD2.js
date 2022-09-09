/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var pick = require('lodash/pick');
var ReactDOM = require('react-dom');
var findIndex = require('lodash/findIndex');
var amisUi = require('amis-ui');
var lodash = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
var findIndex__default = /*#__PURE__*/_interopDefaultLegacy(findIndex);

var CRUD2 = /** @class */ (function (_super) {
    tslib.__extends(CRUD2, _super);
    function CRUD2(props) {
        var _this = _super.call(this, props) || this;
        _this.stopingAutoRefresh = false;
        var location = props.location, store = props.store, syncLocation = props.syncLocation, pageField = props.pageField, perPageField = props.perPageField;
        _this.mounted = true;
        if (syncLocation && location && (location.query || location.search)) {
            store.updateQuery(amisCore.qsparse(location.search.substring(1)), undefined, pageField, perPageField);
        }
        else if (syncLocation && !location && window.location.search) {
            store.updateQuery(amisCore.qsparse(window.location.search.substring(1)), undefined, pageField, perPageField);
        }
        // 如果有 api，data 里面先写个 空数组，面得继承外层的 items
        // 比如 crud 打开一个弹框，里面也是个 crud，默认一开始其实显示
        // 的是外层 crud 的数据，等接口回来后就会变成新的。
        // 加上这个就是为了解决这种情况
        if (_this.props.api) {
            _this.props.store.updateData({
                items: []
            });
        }
        // 自定义列需要用store里的数据同步显示列
        // 所以需要先初始化一下
        var mode = props.mode, columns = props.columns;
        if (mode === 'table2' && columns) {
            store.updateColumns(columns);
        }
        return _this;
    }
    CRUD2.prototype.componentDidMount = function () {
        var _a = this.props, store = _a.store, pickerMode = _a.pickerMode, loadType = _a.loadType, loadDataOnce = _a.loadDataOnce, perPage = _a.perPage;
        // 初始化分页
        var pagination = loadType && !!loadDataOnce;
        if (pagination) {
            store.changePage(store.page, perPage);
        }
        // 初始化筛选条件
        this.initQuery({});
        if (pickerMode) {
            // 解析picker组件默认值
            var val = amisCore.getPropValue(this.props);
            val && store.setSelectedItems(val);
        }
    };
    CRUD2.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = prevProps.store;
        if (prevProps.columns !== props.columns) {
            store.updateColumns(props.columns);
        }
        // picker外部引起的值变化处理
        var val;
        if (this.props.pickerMode &&
            amisCore.isArrayChildrenModified((val = amisCore.getPropValue(this.props)), amisCore.getPropValue(prevProps))) {
            store.setSelectedItems(val);
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
            this.getData();
        }
    };
    CRUD2.prototype.componentWillUnmount = function () {
        this.mounted = false;
        clearTimeout(this.timer);
    };
    CRUD2.prototype.controlRef = function (control) {
        // 因为 control 有可能被 n 层 hoc 包裹。
        while (control && control.getWrappedInstance) {
            control = control.getWrappedInstance();
        }
        this.control = control;
    };
    CRUD2.prototype.initQuery = function (values) {
        var _a = this.props, store = _a.store, orderBy = _a.orderBy, orderDir = _a.orderDir;
        var params = {};
        if (orderBy) {
            params['orderBy'] = orderBy;
            params['orderDir'] = orderDir || 'asc';
        }
        this.handleSearch({
            query: tslib.__assign(tslib.__assign(tslib.__assign({}, params), values), store.query),
            replaceQuery: this.props.initFetch !== false
        });
        // 保留一次用于重置查询条件
        store.setPristineQuery();
    };
    /**
     * 加载更多动作处理器
     */
    CRUD2.prototype.handleLoadMore = function () {
        this.getData(undefined, undefined, undefined, true);
    };
    /**
     * 发起一次新的查询，查询条件不同，需要从第一页数据加载
     */
    CRUD2.prototype.handleSearch = function (data) {
        var _a = this.props, store = _a.store, syncLocation = _a.syncLocation, env = _a.env, pageField = _a.pageField, perPageField = _a.perPageField;
        var query = data.query, resetQuery = data.resetQuery, replaceQuery = data.replaceQuery;
        query = syncLocation ? amisCore.qsparse(amisCore.qsstringify(query, undefined, true)) : query;
        store.updateQuery(resetQuery ? this.props.store.pristineQuery : query, syncLocation && env && env.updateLocation
            ? function (location) { return env.updateLocation(location, true); }
            : undefined, pageField, perPageField, replaceQuery);
        this.lastQuery = store.query;
        this.getData(undefined, undefined, undefined);
    };
    CRUD2.prototype.handleStopAutoRefresh = function () {
        this.timer && clearTimeout(this.timer);
        this.stopingAutoRefresh = true;
    };
    CRUD2.prototype.handleStartAutoRefresh = function () {
        this.stopingAutoRefresh = false;
        this.reload();
    };
    CRUD2.prototype.reloadTarget = function (target, data) {
        // implement this.
    };
    CRUD2.prototype.closeTarget = function (target) {
        // implement this.
    };
    CRUD2.prototype.updateQuery = function (newQuery) {
        this.props.store;
    };
    /**
     * 更新列表数据
     */
    CRUD2.prototype.getData = function (
    /** 静默更新，不显示加载状态 */
    silent, 
    /** 清空已选择数据 */
    clearSelection, 
    /** 强制重新加载 */
    forceReload, 
    /** 加载更多数据，默认模式取props中的配置，只有事件动作需要直接触发 */
    loadMore) {
        var _this = this;
        var _a;
        if (forceReload === void 0) { forceReload = false; }
        var _b = this.props, store = _b.store, api = _b.api, messages = _b.messages, pageField = _b.pageField, perPageField = _b.perPageField, interval = _b.interval, stopAutoRefreshWhen = _b.stopAutoRefreshWhen, silentPolling = _b.silentPolling; _b.syncLocation; var syncResponse2Query = _b.syncResponse2Query, keepItemSelectionOnPageChange = _b.keepItemSelectionOnPageChange, stopAutoRefreshWhenModalIsOpen = _b.stopAutoRefreshWhenModalIsOpen, pickerMode = _b.pickerMode; _b.env; var loadType = _b.loadType, loadDataOnce = _b.loadDataOnce, loadDataOnceFetchOnFilter = _b.loadDataOnceFetchOnFilter, source = _b.source, columns = _b.columns;
        // reload 需要清空用户选择
        if (!loadMore &&
            keepItemSelectionOnPageChange &&
            clearSelection &&
            !pickerMode) {
            store.setSelectedItems([]);
            store.setUnSelectedItems([]);
        }
        clearTimeout(this.timer);
        this.lastQuery = store.query;
        var loadDataMode = loadMore !== null && loadMore !== void 0 ? loadMore : loadType === 'more';
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
                columns: (_a = store.columns) !== null && _a !== void 0 ? _a : columns,
                isTable2: true
            })
                .then(function (value) {
                interval &&
                    !_this.stopingAutoRefresh &&
                    _this.mounted &&
                    (!stopAutoRefreshWhen ||
                        !(stopAutoRefreshWhen &&
                            amisCore.evalExpression(stopAutoRefreshWhen, amisCore.createObject(store.data, store.query)))) &&
                    // 弹窗期间不进行刷新
                    (!stopAutoRefreshWhenModalIsOpen || !store.dialogOpen) &&
                    (_this.timer = setTimeout(_this.getData.bind(_this, silentPolling, undefined, true), Math.max(interval, 1000)));
                return value;
            })
            : source && store.initFromScope(data, source);
    };
    CRUD2.prototype.handleChangePage = function (page, perPage) {
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
        this.getData();
        if (autoJumpToTopOnPagerChange && this.control) {
            ReactDOM.findDOMNode(this.control).scrollIntoView();
            var scrolledY = window.scrollY;
            var offsetTop = (_b = affixOffsetTop !== null && affixOffsetTop !== void 0 ? affixOffsetTop : env === null || env === void 0 ? void 0 : env.affixOffsetTop) !== null && _b !== void 0 ? _b : 0;
            scrolledY && window.scroll(0, scrolledY - offsetTop);
        }
    };
    CRUD2.prototype.handleSave = function (rows, diff, indexes, unModifiedItems, rowsOrigin, options) {
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
                reload && _this.reloadTarget(reload, data_1);
                _this.getData(undefined, undefined, true, true);
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
                reload && _this.reloadTarget(reload, data_2);
                _this.getData(undefined, undefined, true, true);
            })
                .catch(function () {
                (options === null || options === void 0 ? void 0 : options.resetOnFailed) && _this.control.reset();
            });
        }
    };
    CRUD2.prototype.handleSaveOrder = function (moved, rows) {
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
                _this.getData(undefined, undefined, true, true);
            })
                .catch(function () { });
    };
    CRUD2.prototype.handleSelect = function (items, unSelectedItems) {
        var _a = this.props, store = _a.store, keepItemSelectionOnPageChange = _a.keepItemSelectionOnPageChange, primaryField = _a.primaryField, multiple = _a.multiple, pickerMode = _a.pickerMode, onSelect = _a.onSelect;
        var newItems = items;
        var newUnSelectedItems = unSelectedItems;
        // cards等组件初始化的时候也会抛出来，感觉不太合理，但是只能用这个先暂时规避一下了
        if (!amisCore.isArrayChildrenModified(store.selectedItemsAsArray, newItems)) {
            return;
        }
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
        store.updateSelectData(newItems, newUnSelectedItems);
        onSelect && onSelect(newItems);
    };
    /**
     * 表格列上的筛选触发
     */
    CRUD2.prototype.handleTableQuery = function (values, forceReload) {
        var _a;
        if (forceReload === void 0) { forceReload = false; }
        var _b = this.props, store = _b.store, syncLocation = _b.syncLocation, env = _b.env, pageField = _b.pageField, perPageField = _b.perPageField;
        store.updateQuery(tslib.__assign(tslib.__assign({}, values), (_a = {}, _a[pageField || 'page'] = 1, _a)), syncLocation && env && env.updateLocation
            ? env.updateLocation
            : undefined, pageField, perPageField);
        this.getData(undefined, undefined, undefined, forceReload);
    };
    CRUD2.prototype.reload = function (subpath, query) {
        if (query) {
            return this.receive(query);
        }
        else {
            this.getData(undefined, undefined, true, true);
        }
    };
    CRUD2.prototype.receive = function (values) {
        this.handleTableQuery(values, true);
    };
    CRUD2.prototype.doAction = function (action, data, throwErrors) {
        if (action.actionType &&
            ~['stopAutoRefresh', 'reload', 'search', 'startAutoRefresh'].includes(action.actionType)) {
            // @ts-ignore
            return this["handle".concat(lodash.upperFirst(action.actionType))](data);
        }
        // const {onAction, data: ctx} = this.props;
        // return this.props.onAction?.(
        //   undefined,
        //   action,
        //   ctx,
        //   throwErrors,
        //   undefined
        // );
    };
    CRUD2.prototype.unSelectItem = function (item, index) {
        var store = this.props.store;
        var selected = store.selectedItems.concat();
        var unSelected = store.unSelectedItems.concat();
        var idx = selected.indexOf(item);
        ~idx && unSelected.push.apply(unSelected, selected.splice(idx, 1));
        store.setSelectedItems(selected);
        store.setUnSelectedItems(unSelected);
    };
    CRUD2.prototype.clearSelection = function () {
        var store = this.props.store;
        var selected = store.selectedItems.concat();
        var unSelected = store.unSelectedItems.concat();
        store.setSelectedItems([]);
        store.setUnSelectedItems(unSelected.concat(selected));
    };
    CRUD2.prototype.toggleAllColumns = function (value) {
        var store = this.props.store;
        store.updateColumns(store.columns.map(function (c) { return (tslib.__assign(tslib.__assign({}, c), { toggled: value })); }));
    };
    CRUD2.prototype.toggleToggle = function (toggled, index) {
        var store = this.props.store;
        store.updateColumns(store.columns.map(function (c, i) { return (tslib.__assign(tslib.__assign({}, c), { toggled: index === i ? toggled : c.toggled !== false })); }));
    };
    CRUD2.prototype.renderChild = function (region, schema, props) {
        if (props === void 0) { props = {}; }
        var _a = this.props, render = _a.render, store = _a.store;
        // 覆盖所有分页组件
        var childProps = {
            activePage: store.page,
            lastPage: store.lastPage,
            perPage: store.perPage,
            total: store.total,
            onPageChange: this.handleChangePage,
            cols: store.columns,
            toggleAllColumns: this.toggleAllColumns,
            toggleToggle: this.toggleToggle
            // onAction: onAction
        };
        return render(region, schema, tslib.__assign(tslib.__assign(tslib.__assign({}, props), { 
            // 包两层，主要是为了处理以下 case
            // 里面放了个 form，form 提交过来的时候不希望把 items 这些发送过来。
            // 因为会把数据呈现在地址栏上。
            data: amisCore.createObject(amisCore.createObject(store.filterData, store.getData(this.props.data)), {}), render: this.renderChild }), childProps));
    };
    CRUD2.prototype.renderToolbar = function (region, toolbar) {
        var _this = this;
        if (!toolbar) {
            return null;
        }
        toolbar = [].concat(toolbar);
        return toolbar.map(function (item, index) {
            return _this.renderChild("".concat(region, "/").concat(index), item, {
                key: index + ''
            });
        });
    };
    CRUD2.prototype.renderFilter = function (filter) {
        var _this = this;
        if (!filter || filter.length === 0) {
            return null;
        }
        return filter.map(function (item, index) {
            return _this.renderChild("filter/".concat(index), item, {
                key: index + '',
                onSubmit: function (data) { return _this.handleSearch({ query: data }); }
            });
        });
    };
    CRUD2.prototype.renderSelection = function () {
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
    CRUD2.prototype.render = function () {
        var _a = this.props, columns = _a.columns, className = _a.className, bodyClassName = _a.bodyClassName, filter = _a.filter, render = _a.render, store = _a.store, _b = _a.mode, mode = _b === void 0 ? 'table2' : _b; _a.syncLocation; _a.children; _a.bulkActions; var pickerMode = _a.pickerMode, selectable = _a.selectable, multiple = _a.multiple, valueField = _a.valueField, primaryField = _a.primaryField; _a.value; _a.hideQuickSaveBtn; var itemActions = _a.itemActions, cx = _a.classnames, keepItemSelectionOnPageChange = _a.keepItemSelectionOnPageChange, maxKeepItemSelectionLength = _a.maxKeepItemSelectionLength; _a.onAction; var popOverContainer = _a.popOverContainer; _a.translate; _a.onQuery; var autoGenerateFilter = _a.autoGenerateFilter; _a.onSelect; var autoFillHeight = _a.autoFillHeight, showSelection = _a.showSelection, headerToolbar = _a.headerToolbar, footerToolbar = _a.footerToolbar, rest = tslib.__rest(_a, ["columns", "className", "bodyClassName", "filter", "render", "store", "mode", "syncLocation", "children", "bulkActions", "pickerMode", "selectable", "multiple", "valueField", "primaryField", "value", "hideQuickSaveBtn", "itemActions", "classnames", "keepItemSelectionOnPageChange", "maxKeepItemSelectionLength", "onAction", "popOverContainer", "translate", "onQuery", "autoGenerateFilter", "onSelect", "autoFillHeight", "showSelection", "headerToolbar", "footerToolbar"]);
        return (React__default["default"].createElement("div", { className: cx('Crud2', className, {
                'is-loading': store.loading
            }) },
            React__default["default"].createElement("div", { className: cx('Crud2-filter') }, this.renderFilter(filter)),
            React__default["default"].createElement("div", { className: cx('Crud2-toolbar') }, this.renderToolbar('headerToolbar', headerToolbar)),
            showSelection && keepItemSelectionOnPageChange && multiple !== false
                ? this.renderSelection()
                : null,
            render('body', tslib.__assign(tslib.__assign({}, rest), { type: mode, columns: mode.startsWith('table')
                    ? store.columns || columns
                    : undefined }), {
                key: 'body',
                className: cx('Crud2-body', bodyClassName),
                ref: this.controlRef,
                autoGenerateFilter: !filter && autoGenerateFilter,
                autoFillHeight: autoFillHeight,
                checkAll: false,
                selectable: !!(selectable !== null && selectable !== void 0 ? selectable : pickerMode),
                itemActions: itemActions,
                multiple: multiple,
                selected: pickerMode || keepItemSelectionOnPageChange
                    ? store.selectedItemsAsArray
                    : undefined,
                keepItemSelectionOnPageChange: keepItemSelectionOnPageChange,
                maxKeepItemSelectionLength: maxKeepItemSelectionLength,
                valueField: valueField || primaryField,
                primaryField: primaryField,
                items: store.data.items,
                query: store.query,
                orderBy: store.query.orderBy,
                orderDir: store.query.orderDir,
                popOverContainer: popOverContainer,
                onSave: this.handleSave,
                onSaveOrder: this.handleSaveOrder,
                onSearch: this.handleTableQuery,
                onSort: this.handleTableQuery,
                onSelect: this.handleSelect,
                data: store.mergedData,
                loading: store.loading
            }),
            React__default["default"].createElement("div", { className: cx('Crud2-toolbar') }, this.renderToolbar('footerToolbar', footerToolbar))));
    };
    CRUD2.propsList = [
        'mode',
        'syncLocation',
        'value',
        'multiple',
        'valueField',
        'pageField',
        'perPageField',
        'hideQuickSaveBtn',
        'autoJumpToTopOnPagerChange',
        'interval',
        'silentPolling',
        'stopAutoRefreshWhen',
        'stopAutoRefreshWhenModalIsOpen',
        'api',
        'headerToolbar',
        'footerToolbar',
        'autoGenerateFilter',
        'syncResponse2Query',
        'keepItemSelectionOnPageChange',
        'source',
        'onChange',
        'onInit',
        'onSaved',
        'onQuery',
        'autoFillHeight',
        'showSelection'
    ];
    CRUD2.defaultProps = {
        toolbarInline: true,
        syncLocation: true,
        hideQuickSaveBtn: false,
        autoJumpToTopOnPagerChange: true,
        silentPolling: false,
        autoFillHeight: false,
        showSelection: true,
        perPage: 10
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "controlRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number, Number]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "handleChangePage", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array, Array]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "handleSelect", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Boolean]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "handleTableQuery", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object, Boolean]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "doAction", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Boolean]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "toggleAllColumns", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Boolean, Number]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "toggleToggle", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], CRUD2.prototype, "renderChild", null);
    return CRUD2;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CRUD2Renderer, _super);
    function CRUD2Renderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    CRUD2Renderer.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    CRUD2Renderer.prototype.reload = function (subpath, query, ctx) {
        var scoped = this.context;
        if (subpath) {
            return scoped.reload(query ? "".concat(subpath, "?").concat(amisCore.qsstringify(query)) : subpath, ctx);
        }
        return _super.prototype.reload.call(this, subpath, query);
    };
    CRUD2Renderer.prototype.receive = function (values, subPath) {
        var scoped = this.context;
        if (subPath) {
            return scoped.send(subPath, values);
        }
        return _super.prototype.receive.call(this, values);
    };
    CRUD2Renderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    CRUD2Renderer.prototype.closeTarget = function (target) {
        var scoped = this.context;
        scoped.close(target);
    };
    CRUD2Renderer.contextType = amisCore.ScopedContext;
    CRUD2Renderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'crud2',
            storeType: amisCore.CRUDStore.name,
            isolateScope: true
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], CRUD2Renderer);
    return CRUD2Renderer;
})(CRUD2));

exports["default"] = CRUD2;
