/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisUi = require('amis-ui');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var App = /** @class */ (function (_super) {
    tslib.__extends(App, _super);
    function App(props) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this, props) || this;
        var store = props.store;
        store.syncProps(props, undefined, ['pages']);
        store.updateActivePage(Object.assign({}, (_a = props.env) !== null && _a !== void 0 ? _a : {}, {
            showFullBreadcrumbPath: (_b = props.showFullBreadcrumbPath) !== null && _b !== void 0 ? _b : false,
            showBreadcrumbHomePath: (_c = props.showBreadcrumbHomePath) !== null && _c !== void 0 ? _c : true
        }));
        if (props.env.watchRouteChange) {
            _this.unWatchRouteChange = props.env.watchRouteChange(function () {
                var _a, _b, _c;
                return store.updateActivePage(Object.assign({}, (_a = props.env) !== null && _a !== void 0 ? _a : {}, {
                    showFullBreadcrumbPath: (_b = props.showFullBreadcrumbPath) !== null && _b !== void 0 ? _b : false,
                    showBreadcrumbHomePath: (_c = props.showBreadcrumbHomePath) !== null && _c !== void 0 ? _c : true
                }));
            });
        }
        return _this;
    }
    App.prototype.componentDidMount = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                this.reload();
                return [2 /*return*/];
            });
        });
    };
    App.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b, _c;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var props, store;
            return tslib.__generator(this, function (_d) {
                props = this.props;
                store = props.store;
                store.syncProps(props, prevProps, ['pages']);
                if (amisCore.isApiOutdated(prevProps.api, props.api, prevProps.data, props.data)) {
                    this.reload();
                }
                else if (props.location && props.location !== prevProps.location) {
                    store.updateActivePage(Object.assign({}, (_a = props.env) !== null && _a !== void 0 ? _a : {}, {
                        showFullBreadcrumbPath: (_b = props.showFullBreadcrumbPath) !== null && _b !== void 0 ? _b : false,
                        showBreadcrumbHomePath: (_c = props.showBreadcrumbHomePath) !== null && _c !== void 0 ? _c : true
                    }));
                }
                return [2 /*return*/];
            });
        });
    };
    App.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.unWatchRouteChange) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    App.prototype.reload = function (subpath, query, ctx, silent) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, api, store, env, _b, showFullBreadcrumbPath, _c, showBreadcrumbHomePath, json;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (query) {
                            return [2 /*return*/, this.receive(query)];
                        }
                        _a = this.props, api = _a.api, store = _a.store, env = _a.env, _b = _a.showFullBreadcrumbPath, showFullBreadcrumbPath = _b === void 0 ? false : _b, _c = _a.showBreadcrumbHomePath, showBreadcrumbHomePath = _c === void 0 ? true : _c;
                        if (!amisCore.isEffectiveApi(api, store.data)) return [3 /*break*/, 2];
                        return [4 /*yield*/, store.fetchInitData(api, store.data, {})];
                    case 1:
                        json = _d.sent();
                        if (env.replaceText) {
                            amisCore.replaceText(json.data, env.replaceText, env.replaceTextIgnoreKeys);
                        }
                        if (json === null || json === void 0 ? void 0 : json.data.pages) {
                            store.setPages(json.data.pages);
                            store.updateActivePage(Object.assign({}, env !== null && env !== void 0 ? env : {}, {
                                showFullBreadcrumbPath: showFullBreadcrumbPath,
                                showBreadcrumbHomePath: showBreadcrumbHomePath
                            }));
                        }
                        _d.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.receive = function (values) {
        var store = this.props.store;
        store.updateData(values);
        this.reload();
    };
    App.prototype.handleNavClick = function (e) {
        e.preventDefault();
        var env = this.props.env;
        var link = e.currentTarget.getAttribute('href');
        env.jumpTo(link);
    };
    App.prototype.renderHeader = function () {
        var _a = this.props, cx = _a.classnames, brandName = _a.brandName, header = _a.header, render = _a.render, store = _a.store, logo = _a.logo;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("div", { className: cx('Layout-brandBar') },
                React__default["default"].createElement("div", { onClick: store.toggleOffScreen, className: cx('Layout-offScreenBtn') },
                    React__default["default"].createElement("i", { className: "bui-icon iconfont icon-collapse" })),
                React__default["default"].createElement("div", { className: cx('Layout-brand') },
                    logo && ~logo.indexOf('<svg') ? (React__default["default"].createElement(amisUi.Html, { className: cx('AppLogo-html'), html: logo })) : logo ? (React__default["default"].createElement("img", { className: cx('AppLogo'), src: logo })) : null,
                    React__default["default"].createElement("span", { className: "hidden-folded m-l-sm" }, brandName))),
            React__default["default"].createElement("div", { className: cx('Layout-headerBar') },
                React__default["default"].createElement("a", { onClick: store.toggleFolded, type: "button", className: cx('AppFoldBtn') },
                    React__default["default"].createElement("i", { className: "fa fa-".concat(store.folded ? 'indent' : 'dedent', " fa-fw") })),
                header ? render('header', header) : null)));
    };
    App.prototype.renderAside = function () {
        var _this = this;
        var _a = this.props, store = _a.store, env = _a.env, asideBefore = _a.asideBefore, asideAfter = _a.asideAfter, render = _a.render;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            asideBefore ? render('aside-before', asideBefore) : null,
            React__default["default"].createElement(amisUi.AsideNav, { navigations: store.navigations, renderLink: function (_a, key) {
                    var link = _a.link; _a.active; var toggleExpand = _a.toggleExpand, cx = _a.classnames, depth = _a.depth, subHeader = _a.subHeader;
                    var children = [];
                    if (link.visible === false) {
                        return null;
                    }
                    if (!subHeader && link.children && link.children.length) {
                        children.push(React__default["default"].createElement("span", { key: "expand-toggle", className: cx('AsideNav-itemArrow'), onClick: function (e) { return toggleExpand(link, e); } }));
                    }
                    link.badge &&
                        children.push(React__default["default"].createElement("b", { key: "badge", className: cx("AsideNav-itemBadge", link.badgeClassName || 'bg-info') }, link.badge));
                    if (!subHeader && link.icon) {
                        children.push(amisCore.generateIcon(cx, link.icon, 'AsideNav-itemIcon'));
                    }
                    else if (store.folded && depth === 1 && !subHeader) {
                        children.push(React__default["default"].createElement("i", { key: "icon", className: cx("AsideNav-itemIcon", link.children ? 'fa fa-folder' : 'fa fa-info') }));
                    }
                    children.push(React__default["default"].createElement("span", { className: cx('AsideNav-itemLabel'), key: "label" }, link.label));
                    return link.path ? (/^https?\:/.test(link.path) ? (React__default["default"].createElement("a", { target: "_blank", href: link.path, rel: "noopener" }, children)) : (React__default["default"].createElement("a", { onClick: _this.handleNavClick, href: link.path || (link.children && link.children[0].path) }, children))) : (React__default["default"].createElement("a", { onClick: link.children ? function () { return toggleExpand(link); } : undefined }, children));
                }, isActive: function (link) { return !!env.isCurrentUrl(link === null || link === void 0 ? void 0 : link.path, link); } }),
            asideAfter ? render('aside-before', asideAfter) : null));
    };
    App.prototype.renderFooter = function () {
        var _a = this.props, render = _a.render, footer = _a.footer;
        return footer ? render('footer', footer) : null;
    };
    App.prototype.render = function () {
        var _this = this;
        var _a;
        var _b = this.props; _b.className; _b.size; var cx = _b.classnames, store = _b.store, render = _b.render, _c = _b.showBreadcrumb, showBreadcrumb = _c === void 0 ? true : _c;
        return (React__default["default"].createElement(amisUi.Layout, { header: this.renderHeader(), aside: this.renderAside(), footer: this.renderFooter(), folded: store.folded, offScreen: store.offScreen },
            store.activePage && store.schema ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                showBreadcrumb && store.bcn.length ? (React__default["default"].createElement("ul", { className: cx('AppBcn') }, store.bcn.map(function (item, index) {
                    return (React__default["default"].createElement("li", { key: index, className: cx('AppBcn-item') }, item.path ? (React__default["default"].createElement("a", { href: item.path, onClick: _this.handleNavClick }, item.label)) : index !== store.bcn.length - 1 ? (React__default["default"].createElement("a", null, item.label)) : (item.label)));
                }))) : null,
                render('page', store.schema, {
                    key: "".concat((_a = store.activePage) === null || _a === void 0 ? void 0 : _a.id, "-").concat(store.schemaKey),
                    data: store.pageData
                }))) : store.pages && !store.activePage ? (React__default["default"].createElement(amisUi.NotFound, null,
                React__default["default"].createElement("div", { className: "text-center" }, "\u9875\u9762\u4E0D\u5B58\u5728"))) : null,
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, show: store.loading || !store.pages, size: "lg" })));
    };
    App.propsList = [
        'brandName',
        'logo',
        'header',
        'asideBefore',
        'asideAfter',
        'pages',
        'footer'
    ];
    App.defaultProps = {};
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], App.prototype, "handleNavClick", null);
    return App;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(AppRenderer, _super);
    function AppRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    AppRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
        _super.prototype.componentWillUnmount.call(this);
    };
    AppRenderer.prototype.setData = function (values) {
        return this.props.store.updateData(values);
    };
    AppRenderer.contextType = amisCore.ScopedContext;
    AppRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'app',
            storeType: amisCore.AppStore.name
        }),
        tslib.__metadata("design:paramtypes", [Object, Object])
    ], AppRenderer);
    return AppRenderer;
})(App));

exports["default"] = App;
