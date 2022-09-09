/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var Overflow = require('rc-overflow');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Overflow__default = /*#__PURE__*/_interopDefaultLegacy(Overflow);

var Navigation = /** @class */ (function (_super) {
    tslib.__extends(Navigation, _super);
    function Navigation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startPoint = {
            y: 0,
            x: 0
        };
        _this.state = {};
        return _this;
    }
    Navigation.prototype.handleClick = function (link) {
        var _a = this.props, env = _a.env, onSelect = _a.onSelect;
        // 和 action 里命名一致方便分析
        if (link && link.to) {
            env === null || env === void 0 ? void 0 : env.tracker({
                eventType: 'link',
                eventData: {
                    label: link.label,
                    link: link.to
                }
            });
        }
        onSelect === null || onSelect === void 0 ? void 0 : onSelect(link);
    };
    Navigation.prototype.toggleLink = function (target, forceFold) {
        var _a, _b;
        (_b = (_a = this.props).onToggle) === null || _b === void 0 ? void 0 : _b.call(_a, target, forceFold);
    };
    Navigation.prototype.getDropInfo = function (e, id, depth) {
        var _a, _b;
        var _c = this.props, dragOnSameLevel = _c.dragOnSameLevel, indentSize = _c.indentSize;
        var rect = e.target.getBoundingClientRect();
        var dragLink = (_a = this.dragNode) === null || _a === void 0 ? void 0 : _a.link;
        var top = rect.top, height = rect.height, width = rect.width;
        var clientY = e.clientY, clientX = e.clientX;
        var left = depth * ((_b = parseInt(indentSize, 10)) !== null && _b !== void 0 ? _b : 24);
        var deltaX = left + width * 0.2;
        var position;
        if (clientY >= top + height / 2) {
            position = 'bottom';
        }
        else {
            position = 'top';
        }
        if (!dragOnSameLevel &&
            position === 'bottom' &&
            clientX >= this.startPoint.x + deltaX) {
            position = 'self';
        }
        return {
            nodeId: id,
            dragLink: dragLink,
            position: position,
            rect: rect,
            height: height,
            left: left
        };
    };
    Navigation.prototype.updateDropIndicator = function (e) {
        var _a, _b;
        var dragOnSameLevel = this.props.dragOnSameLevel;
        var target = e.target; // a标签
        var targetId = target.getAttribute('data-id');
        var targetDepth = Number(target.getAttribute('data-depth'));
        if (dragOnSameLevel &&
            ((_a = this.dragNode) === null || _a === void 0 ? void 0 : _a.node.parentElement) !== ((_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement)) {
            this.setState({ dropIndicator: undefined });
            this.dropInfo = null;
            return;
        }
        this.dropInfo = this.getDropInfo(e, targetId, targetDepth);
        var _c = this.dropInfo, position = _c.position, rect = _c.rect, dragLink = _c.dragLink, height = _c.height, left = _c.left;
        if (targetId === (dragLink === null || dragLink === void 0 ? void 0 : dragLink.__id)) {
            this.setState({ dropIndicator: undefined });
            this.dropInfo = null;
            return;
        }
        var ul = ReactDOM.findDOMNode(this).firstChild;
        if (position === 'self') {
            this.setState({
                dropIndicator: {
                    top: rect.top - ul.getBoundingClientRect().top,
                    left: left,
                    width: ul.getBoundingClientRect().width - left,
                    height: height,
                    opacity: 0.2
                }
            });
        }
        else {
            this.setState({
                dropIndicator: {
                    top: (position === 'bottom' ? rect.top + rect.height : rect.top) -
                        ul.getBoundingClientRect().top,
                    left: left,
                    width: ul.getBoundingClientRect().width - left
                }
            });
        }
    };
    Navigation.prototype.handleDragStart = function (link) {
        var _this = this;
        return function (e) {
            e.stopPropagation();
            var currentTarget = e.currentTarget;
            e.dataTransfer.effectAllowed = 'copyMove';
            e.dataTransfer.setDragImage(currentTarget, 0, 0);
            _this.dragNode = {
                node: currentTarget,
                link: link
            };
            _this.dropInfo = null;
            _this.startPoint = {
                x: e.clientX,
                y: e.clientY
            };
            currentTarget.addEventListener('dragend', _this.handleDragEnd);
            document.body.addEventListener('dragover', _this.handleDragOver);
        };
    };
    Navigation.prototype.handleDragOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.dragNode) {
            return;
        }
        var target = e.target;
        var id = target.getAttribute('data-id');
        if (!id) {
            return;
        }
        this.updateDropIndicator(e);
    };
    Navigation.prototype.handleDragEnd = function (e) {
        var _a, _b, _c;
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dropIndicator: undefined
        });
        var currentTarget = e.currentTarget;
        var id = currentTarget.getAttribute('data-id');
        var nodeId = (_a = this.dropInfo) === null || _a === void 0 ? void 0 : _a.nodeId;
        if (!this.dropInfo || !nodeId || id === nodeId) {
            return;
        }
        currentTarget.removeEventListener('dragend', this.handleDragEnd);
        document.body.removeEventListener('dragover', this.handleDragOver);
        (_c = (_b = this.props).onDragUpdate) === null || _c === void 0 ? void 0 : _c.call(_b, this.dropInfo);
        this.dragNode = null;
        this.dropInfo = null;
    };
    Navigation.prototype.renderItem = function (link, index, depth) {
        var _this = this;
        var _a, _b;
        if (depth === void 0) { depth = 1; }
        if (link.hidden === true || link.visible === false) {
            return null;
        }
        var isActive = !!link.active;
        var _c = this.props, disabled = _c.disabled, togglerClassName = _c.togglerClassName, cx = _c.classnames, indentSize = _c.indentSize, render = _c.render, itemActions = _c.itemActions, draggable = _c.draggable; _c.links; var itemBadge = _c.itemBadge, defaultData = _c.data;
        var hasSub = (link.defer && !link.loaded) || (link.children && link.children.length);
        return (React__default["default"].createElement("li", { key: (_a = link.__id) !== null && _a !== void 0 ? _a : index, "data-id": link.__id, className: cx('Nav-item', link.className, {
                'is-disabled': disabled || link.disabled || link.loading,
                'is-active': isActive,
                'is-unfolded': link.unfolded,
                'has-sub': hasSub
            }), onDragStart: this.handleDragStart(link) },
            React__default["default"].createElement(amisUi.Badge, { classnames: cx, badge: itemBadge, data: amisCore.createObject(defaultData, link) },
                React__default["default"].createElement("a", { "data-id": link.__id, "data-depth": depth, title: typeof (link === null || link === void 0 ? void 0 : link.label) === 'string' ? link === null || link === void 0 ? void 0 : link.label : undefined, onClick: this.handleClick.bind(this, link), style: {
                        paddingLeft: depth * ((_b = parseInt(indentSize, 10)) !== null && _b !== void 0 ? _b : 24)
                    } },
                    !disabled && draggable ? (React__default["default"].createElement("div", { className: cx('Nav-itemDrager'), draggable: true, onMouseDown: function (e) {
                            _this.toggleLink(link, true);
                            e.stopPropagation();
                        } },
                        React__default["default"].createElement(amisUi.Icon, { icon: "drag-bar", className: "icon" }))) : null,
                    link.loading ? (React__default["default"].createElement(amisUi.Spinner, { size: "sm", show: true, icon: "reload", spinnerClassName: cx('Nav-spinner') })) : hasSub ? (React__default["default"].createElement("span", { onClick: function (e) {
                            _this.toggleLink(link);
                            e.stopPropagation();
                        }, className: cx('Nav-itemToggler', togglerClassName) },
                        React__default["default"].createElement(amisUi.Icon, { icon: "caret", className: "icon" }))) : null,
                    amisCore.generateIcon(cx, link.icon, 'Nav-itemIcon'),
                    link.label &&
                        (typeof link.label === 'string'
                            ? link.label
                            : render('inline', link.label))),
                // 更多操作
                itemActions ? (React__default["default"].createElement("div", { className: cx('Nav-item-atcions') }, render('inline', itemActions, {
                    data: amisCore.createObject(defaultData, link)
                }))) : null,
                Array.isArray(link.children) && link.children.length ? (React__default["default"].createElement("ul", { className: cx('Nav-subItems') }, link.children.map(function (link, index) {
                    return _this.renderItem(link, index, depth + 1);
                }))) : null)));
    };
    Navigation.prototype.renderOverflowNavs = function (overflowConfig) {
        var _this = this;
        var _a = this.props, render = _a.render, cx = _a.classnames, className = _a.className, loading = _a.loading, _b = _a.links, links = _b === void 0 ? [] : _b;
        var overflowClassName = overflowConfig.overflowClassName, overflowPopoverClassName = overflowConfig.overflowPopoverClassName, overflowListClassName = overflowConfig.overflowListClassName, overflowLabel = overflowConfig.overflowLabel, overflowIndicator = overflowConfig.overflowIndicator, _c = overflowConfig.itemWidth, itemWidth = _c === void 0 ? 160 : _c, overflowSuffix = overflowConfig.overflowSuffix, popOverContainer = overflowConfig.popOverContainer, style = overflowConfig.style, maxVisibleCount = overflowConfig.maxVisibleCount, _d = overflowConfig.wrapperComponent, wrapperComponent = _d === void 0 ? 'ul' : _d;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(amisUi.Spinner, { show: !!loading, overlay: true, icon: "reload" }),
            React__default["default"].createElement(Overflow__default["default"], { className: cx('Nav-list--tabs', className), prefixCls: cx('Nav-list'), itemWidth: itemWidth, style: style, component: wrapperComponent, data: links, suffix: overflowSuffix
                    ? render('nav-overflow-suffix', overflowSuffix)
                    : null, renderRawItem: function (item, index) {
                    return _this.renderItem(item, index);
                }, renderRawRest: function (overFlowedItems) {
                    return (React__default["default"].createElement(amisUi.PopOverContainer, { popOverContainer: popOverContainer, popOverClassName: cx('Nav-item-overflow-popover', overflowPopoverClassName), popOverRender: function (_a) {
                            var onClose = _a.onClose;
                            return (React__default["default"].createElement("div", { className: cx('Nav-list', 'Nav-list--stacked', // 浮层菜单为垂直布局
                                'Nav-list-overflow', overflowListClassName) }, overFlowedItems.map(function (item, index) {
                                return React__default["default"].cloneElement(_this.renderItem(item, index), {
                                    onClick: onClose
                                });
                            })));
                        } }, function (_a) {
                        var onClick = _a.onClick, ref = _a.ref, isOpened = _a.isOpened;
                        return (React__default["default"].createElement("li", { ref: ref, className: cx('Nav-item', 'Nav-item-overflow', {
                                'is-overflow-opened': isOpened
                            }, overflowClassName), onClick: onClick },
                            React__default["default"].createElement("a", { "data-id": amisCore.guid(), "data-depth": 1 },
                                amisUi.getIcon(overflowIndicator) ? (React__default["default"].createElement(amisUi.Icon, { icon: overflowIndicator, className: "icon" })) : (amisCore.generateIcon(cx, overflowIndicator, 'Nav-itemIcon')),
                                overflowLabel && amisCore.isObject(overflowLabel)
                                    ? render('nav-overflow-label', overflowLabel)
                                    : overflowLabel)));
                    }));
                }, maxCount: maxVisibleCount && Number.isInteger(maxVisibleCount)
                    ? maxVisibleCount
                    : 'responsive' })));
    };
    Navigation.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, stacked = _a.stacked, cx = _a.classnames, links = _a.links, loading = _a.loading, overflow = _a.overflow;
        var dropIndicator = this.state.dropIndicator;
        return (React__default["default"].createElement("div", { className: cx('Nav') }, overflow && amisCore.isObject(overflow) && overflow.enable ? (this.renderOverflowNavs(tslib.__assign({ overflowIndicator: 'fa fa-ellipsis', wrapperComponent: 'ul', itemWidth: 160 }, overflow))) : (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("ul", { className: cx('Nav-list', className, stacked ? 'Nav-list--stacked' : 'Nav-list--tabs') },
                Array.isArray(links)
                    ? links.map(function (item, index) { return _this.renderItem(item, index); })
                    : null,
                React__default["default"].createElement(amisUi.Spinner, { show: !!loading, overlay: true, icon: "reload" })),
            dropIndicator ? (React__default["default"].createElement("div", { className: cx('Nav-dropIndicator'), style: dropIndicator })) : null))));
    };
    Navigation.defaultProps = {
        indentSize: 24
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Navigation.prototype, "handleClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Boolean]),
        tslib.__metadata("design:returntype", void 0)
    ], Navigation.prototype, "toggleLink", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [DragEvent, String, Number]),
        tslib.__metadata("design:returntype", Object)
    ], Navigation.prototype, "getDropInfo", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [DragEvent]),
        tslib.__metadata("design:returntype", void 0)
    ], Navigation.prototype, "updateDropIndicator", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], Navigation.prototype, "handleDragStart", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [DragEvent]),
        tslib.__metadata("design:returntype", void 0)
    ], Navigation.prototype, "handleDragOver", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [DragEvent]),
        tslib.__metadata("design:returntype", void 0)
    ], Navigation.prototype, "handleDragEnd", null);
    return Navigation;
}(React__default["default"].Component));
var ThemedNavigation = amisCore.themeable(Navigation);
var ConditionBuilderWithRemoteOptions = amisUi.withRemoteConfig({
    adaptor: function (config, props) {
        var links = Array.isArray(config)
            ? config
            : config.links || config.options || config.items || config.rows;
        if (!Array.isArray(links)) {
            throw new Error('payload.data.options is not array.');
        }
        return links;
    },
    afterLoad: function (response, config, props) {
        if (response.value && !amisCore.someTree(config, function (item) { return item.active; })) {
            var env = props.env;
            env.jumpTo(amisCore.filter(response.value, props.data));
        }
    },
    normalizeConfig: function (links, origin, props, motivation) {
        if (Array.isArray(links) && motivation !== 'toggle') {
            var data_1 = props.data, env_1 = props.env, unfoldedField_1 = props.unfoldedField, foldedField_1 = props.foldedField;
            links = amisCore.mapTree(links, function (link) {
                var _a;
                var item = tslib.__assign(tslib.__assign(tslib.__assign({}, link), amisCore.getExprProperties(link, data_1)), { active: (motivation !== 'location-change' && link.active) ||
                        (link.activeOn
                            ? amisCore.evalExpression(link.activeOn, data_1)
                            : !!(link.hasOwnProperty('to') &&
                                env_1 &&
                                env_1.isCurrentUrl(amisCore.filter(link.to, data_1)))), __id: (_a = link.__id) !== null && _a !== void 0 ? _a : amisCore.guid() });
                item.unfolded =
                    amisCore.isUnfolded(item, { unfoldedField: unfoldedField_1, foldedField: foldedField_1 }) ||
                        (link.children && link.children.some(function (link) { return !!link.active; }));
                return item;
            }, 1, true);
        }
        return links;
    },
    beforeDeferLoad: function (item, indexes, links) {
        return amisCore.spliceTree(links, indexes, 1, tslib.__assign(tslib.__assign({}, item), { loading: true }));
    },
    afterDeferLoad: function (item, indexes, ret, links) {
        var newItem = tslib.__assign(tslib.__assign({}, item), { loading: false, loaded: true, error: ret.ok ? undefined : ret.msg });
        var children = Array.isArray(ret.data)
            ? ret.data
            : ret.data.links || ret.data.options || ret.data.items || ret.data.rows;
        if (Array.isArray(children)) {
            newItem.children = children.concat();
            newItem.unfolded = true;
        }
        return amisCore.spliceTree(links, indexes, 1, newItem);
    }
})(/** @class */ (function (_super) {
    tslib.__extends(class_1, _super);
    function class_1(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleLink = _this.toggleLink.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.dragUpdate = _this.dragUpdate.bind(_this);
        return _this;
    }
    class_1.prototype.componentDidMount = function () {
        if (Array.isArray(this.props.links)) {
            this.props.updateConfig(this.props.links, 'mount');
        }
    };
    class_1.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.location !== prevProps.location) {
            this.props.updateConfig(this.props.config, 'location-change');
        }
        else if (this.props.links !== prevProps.links) {
            this.props.updateConfig(this.props.links, 'update');
        }
    };
    class_1.prototype.toggleLink = function (target, forceFold) {
        var _a = this.props, config = _a.config, updateConfig = _a.updateConfig, deferLoad = _a.deferLoad;
        if (target.defer && !target.loaded) {
            deferLoad(target);
        }
        else {
            updateConfig(amisCore.mapTree(config, function (link) {
                return target === link
                    ? tslib.__assign(tslib.__assign({}, link), { unfolded: forceFold ? false : !link.unfolded }) : link;
            }), 'toggle');
        }
    };
    class_1.prototype.dragUpdate = function (dropInfo) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var links, nodeId, dragLink, position, sourceIdx, idx;
            return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        links = this.props.config;
                        nodeId = dropInfo.nodeId, dragLink = dropInfo.dragLink, position = dropInfo.position;
                        if (dragLink) {
                            sourceIdx = amisCore.findTreeIndex(links, function (link) { return link.__id === dragLink.__id; });
                            links = amisCore.spliceTree(links, sourceIdx, 1);
                            if (position === 'self') {
                                // 插入到对应节点的children中
                                amisCore.mapTree(links, function (link) {
                                    if (link.__id === nodeId) {
                                        if (!link.children) {
                                            link.children = [];
                                        }
                                        link.children.push(dragLink);
                                    }
                                    return link;
                                });
                            }
                            else {
                                idx = amisCore.findTreeIndex(links, function (link) { return link.__id === nodeId; });
                                // 插入节点之后
                                if (position === 'bottom') {
                                    idx.push(idx.pop() + 1);
                                }
                                links = amisCore.spliceTree(links, idx, 0, dragLink);
                            }
                        }
                        this.props.updateConfig(links, 'update');
                        (_b = (_a = this.props).onOrderChange) === null || _b === void 0 ? void 0 : _b.call(_a, links);
                        return [4 /*yield*/, this.saveOrder(amisCore.mapTree(links, function (link) {
                                // 清除内部加的字段
                                for (var key in link) {
                                    if (/^__.*$/.test(key)) {
                                        delete link[key];
                                    }
                                }
                                return link;
                            }))];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 在接口存在的时候，调用接口保存排序结果
     * @param links 排序后的结果
     */
    class_1.prototype.saveOrder = function (links) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, saveOrderApi, env, data, reload;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, saveOrderApi = _a.saveOrderApi, env = _a.env, data = _a.data, reload = _a.reload;
                        if (!(saveOrderApi && amisCore.isEffectiveApi(saveOrderApi))) return [3 /*break*/, 2];
                        return [4 /*yield*/, env.fetcher(saveOrderApi, amisCore.createObject(data, { data: links }), { method: 'post' })];
                    case 1:
                        _b.sent();
                        reload();
                        return [3 /*break*/, 3];
                    case 2:
                        if (!this.props.onOrderChange) {
                            env.alert('NAV saveOrderApi is required!');
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.handleSelect = function (link) {
        var _a = this.props, onSelect = _a.onSelect, env = _a.env, data = _a.data;
        if (onSelect && onSelect(link) === false) {
            return;
        }
        if (!link.to &&
            ((link.children && link.children.length) ||
                (link.defer && !link.loaded))) {
            this.toggleLink(link);
            return;
        }
        env === null || env === void 0 ? void 0 : env.jumpTo(amisCore.filter(link.to, data), link);
    };
    class_1.prototype.render = function () {
        var _a = this.props, loading = _a.loading, config = _a.config; _a.deferLoad; _a.updateConfig; var rest = tslib.__rest(_a, ["loading", "config", "deferLoad", "updateConfig"]);
        return (React__default["default"].createElement(ThemedNavigation, tslib.__assign({}, rest, { loading: loading, links: config || [], disabled: loading, onSelect: this.handleSelect, onToggle: this.toggleLink, onDragUpdate: this.dragUpdate })));
    };
    return class_1;
}(React__default["default"].Component)));
/** @class */ ((function (_super) {
    tslib.__extends(NavigationRenderer, _super);
    function NavigationRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        _this.remoteRef = undefined;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    NavigationRenderer.prototype.remoteConfigRef = function (ref) {
        this.remoteRef = ref;
    };
    NavigationRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    NavigationRenderer.prototype.reload = function (target, query, values) {
        var _a;
        if (query) {
            return this.receive(query);
        }
        var _b = this.props, data = _b.data; _b.env; _b.source; _b.translate;
        var finalData = values ? amisCore.createObject(data, values) : data;
        (_a = this.remoteRef) === null || _a === void 0 ? void 0 : _a.loadConfig(finalData);
    };
    NavigationRenderer.prototype.receive = function (values) {
        this.reload(undefined, undefined, values);
    };
    NavigationRenderer.prototype.render = function () {
        var rest = tslib.__rest(this.props, []);
        return (React__default["default"].createElement(ConditionBuilderWithRemoteOptions, tslib.__assign({}, rest, { reload: this.reload, remoteConfigRef: this.remoteConfigRef })));
    };
    NavigationRenderer.contextType = amisCore.ScopedContext;
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], NavigationRenderer.prototype, "remoteConfigRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String, Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], NavigationRenderer.prototype, "reload", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], NavigationRenderer.prototype, "receive", null);
    NavigationRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)(?:nav|navigation)$/,
            name: 'nav'
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], NavigationRenderer);
    return NavigationRenderer;
})(React__default["default"].Component));

exports.Navigation = Navigation;
exports["default"] = ThemedNavigation;
