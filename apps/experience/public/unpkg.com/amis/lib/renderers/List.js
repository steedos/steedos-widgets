/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var omit = require('lodash/omit');
var QuickEdit = require('./QuickEdit.js');
var PopOver = require('./PopOver.js');
var Sortable = require('sortablejs');
require('./Table/index.js');
var Copyable = require('./Copyable.js');
var TableCell = require('./Table/TableCell.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);
var Sortable__default = /*#__PURE__*/_interopDefaultLegacy(Sortable);

var List = /** @class */ (function (_super) {
    tslib.__extends(List, _super);
    function List(props) {
        var _this = _super.call(this, props) || this;
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.handleCheckAll = _this.handleCheckAll.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.handleSaveOrder = _this.handleSaveOrder.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        _this.affixDetect = _this.affixDetect.bind(_this);
        _this.bodyRef = _this.bodyRef.bind(_this);
        _this.renderToolbar = _this.renderToolbar.bind(_this);
        var store = props.store, selectable = props.selectable, draggable = props.draggable, orderBy = props.orderBy, orderDir = props.orderDir, multiple = props.multiple, hideCheckToggler = props.hideCheckToggler, itemCheckableOn = props.itemCheckableOn, itemDraggableOn = props.itemDraggableOn;
        store.update({
            multiple: multiple,
            selectable: selectable,
            draggable: draggable,
            orderBy: orderBy,
            orderDir: orderDir,
            hideCheckToggler: hideCheckToggler,
            itemCheckableOn: itemCheckableOn,
            itemDraggableOn: itemDraggableOn
        });
        List.syncItems(store, _this.props) && _this.syncSelected();
        return _this;
    }
    List.syncItems = function (store, props, prevProps) {
        var source = props.source;
        var value = props.value || props.items;
        var items = [];
        var updateItems = false;
        if (Array.isArray(value) &&
            (!prevProps || (prevProps.value || prevProps.items) !== value)) {
            items = value;
            updateItems = true;
        }
        else if (typeof source === 'string') {
            var resolved = amisCore.resolveVariableAndFilter(source, props.data, '| raw');
            var prev = prevProps
                ? amisCore.resolveVariableAndFilter(source, prevProps.data, '| raw')
                : null;
            if (prev && prev === resolved) {
                updateItems = false;
            }
            else if (Array.isArray(resolved)) {
                items = resolved;
                updateItems = true;
            }
        }
        updateItems && store.initItems(items);
        Array.isArray(props.selected) &&
            store.updateSelected(props.selected, props.valueField);
        return updateItems;
    };
    List.prototype.componentDidMount = function () {
        var parent = amisCore.getScrollParent(ReactDOM.findDOMNode(this));
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        this.affixDetect();
        parent.addEventListener('scroll', this.affixDetect);
        window.addEventListener('resize', this.affixDetect);
    };
    List.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if (amisCore.anyChanged([
            'selectable',
            'draggable',
            'orderBy',
            'orderDir',
            'multiple',
            'hideCheckToggler',
            'itemCheckableOn',
            'itemDraggableOn'
        ], prevProps, props)) {
            store.update({
                multiple: props.multiple,
                selectable: props.selectable,
                draggable: props.draggable,
                orderBy: props.orderBy,
                orderDir: props.orderDir,
                hideCheckToggler: props.hideCheckToggler,
                itemCheckableOn: props.itemCheckableOn,
                itemDraggableOn: props.itemDraggableOn
            });
        }
        if (amisCore.anyChanged(['source', 'value', 'items'], prevProps, props) ||
            (!props.value &&
                !props.items &&
                (props.data !== prevProps.data ||
                    (typeof props.source === 'string' && amisCore.isPureVariable(props.source))))) {
            List.syncItems(store, props, prevProps) && this.syncSelected();
        }
        else if (prevProps.selected !== props.selected) {
            store.updateSelected(props.selected || [], props.valueField);
        }
    };
    List.prototype.componentWillUnmount = function () {
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        window.removeEventListener('resize', this.affixDetect);
    };
    List.prototype.bodyRef = function (ref) {
        this.body = ref;
    };
    List.prototype.affixDetect = function () {
        var _a, _b;
        if (!this.props.affixHeader || !this.body) {
            return;
        }
        var ns = this.props.classPrefix;
        var dom = ReactDOM.findDOMNode(this);
        var afixedDom = dom.querySelector(".".concat(ns, "List-fixedTop"));
        if (!afixedDom) {
            return;
        }
        var clip = this.body.getBoundingClientRect();
        var offsetY = (_b = (_a = this.props.affixOffsetTop) !== null && _a !== void 0 ? _a : this.props.env.affixOffsetTop) !== null && _b !== void 0 ? _b : 0;
        var affixed = clip.top < offsetY && clip.top + clip.height - 40 > offsetY;
        this.body.offsetWidth &&
            (afixedDom.style.cssText = "top: ".concat(offsetY, "px;width: ").concat(this.body.offsetWidth, "px;"));
        affixed ? afixedDom.classList.add('in') : afixedDom.classList.remove('in');
        // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
    };
    List.prototype.getPopOverContainer = function () {
        return ReactDOM.findDOMNode(this);
    };
    List.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        // todo
        onAction(e, action, ctx);
    };
    List.prototype.handleCheck = function (item) {
        item.toggle();
        this.syncSelected();
    };
    List.prototype.handleCheckAll = function () {
        var store = this.props.store;
        store.toggleAll();
        this.syncSelected();
    };
    List.prototype.syncSelected = function () {
        var _a = this.props, store = _a.store, onSelect = _a.onSelect;
        onSelect &&
            onSelect(store.selectedItems.map(function (item) { return item.data; }), store.unSelectedItems.map(function (item) { return item.data; }));
    };
    List.prototype.handleQuickChange = function (item, values, saveImmediately, savePristine, options) {
        item.change(values, savePristine);
        if (!saveImmediately || savePristine) {
            return;
        }
        if (saveImmediately && saveImmediately.api) {
            this.props.onAction(null, {
                actionType: 'ajax',
                api: saveImmediately.api,
                reload: options === null || options === void 0 ? void 0 : options.reload
            }, values);
            return;
        }
        var _a = this.props, onSave = _a.onSave, primaryField = _a.primaryField;
        if (!onSave) {
            return;
        }
        onSave(item.data, amisCore.difference(item.data, item.pristine, ['id', primaryField]), item.index, undefined, item.pristine, options);
    };
    List.prototype.handleSave = function () {
        var _a = this.props, store = _a.store, onSave = _a.onSave, primaryField = _a.primaryField;
        if (!onSave || !store.modifiedItems.length) {
            return;
        }
        var items = store.modifiedItems.map(function (item) { return item.data; });
        var itemIndexes = store.modifiedItems.map(function (item) { return item.index; });
        var diff = store.modifiedItems.map(function (item) {
            return amisCore.difference(item.data, item.pristine, ['id', primaryField]);
        });
        var unModifiedItems = store.items
            .filter(function (item) { return !item.modified; })
            .map(function (item) { return item.data; });
        onSave(items, diff, itemIndexes, unModifiedItems, store.modifiedItems.map(function (item) { return item.pristine; }));
    };
    List.prototype.handleSaveOrder = function () {
        var _a = this.props, store = _a.store, onSaveOrder = _a.onSaveOrder;
        if (!onSaveOrder || !store.movedItems.length) {
            return;
        }
        onSaveOrder(store.movedItems.map(function (item) { return item.data; }), store.items.map(function (item) { return item.data; }));
    };
    List.prototype.reset = function () {
        var store = this.props.store;
        store.reset();
    };
    List.prototype.bulkUpdate = function (value, items) {
        var store = this.props.store;
        var items2 = store.items.filter(function (item) { return ~items.indexOf(item.pristine); });
        items2.forEach(function (item) { return item.change(value); });
    };
    List.prototype.getSelected = function () {
        var store = this.props.store;
        return store.selectedItems.map(function (item) { return item.data; });
    };
    List.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    List.prototype.initDragging = function () {
        var store = this.props.store;
        var dom = ReactDOM.findDOMNode(this);
        var ns = this.props.classPrefix;
        this.sortable = new Sortable__default["default"](dom.querySelector(".".concat(ns, "List-items")), {
            group: 'table',
            animation: 150,
            handle: ".".concat(ns, "ListItem-dragBtn"),
            ghostClass: 'is-dragging',
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                store.exchange(e.oldIndex, e.newIndex);
            }
        });
    };
    List.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    List.prototype.renderActions = function (region) {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, store = _a.store; _a.multiple; _a.selectable; _a.env; _a.classPrefix; var cx = _a.classnames;
        var btn;
        actions = Array.isArray(actions) ? actions.concat() : [];
        if (!~this.renderedToolbars.indexOf('check-all') &&
            (btn = this.renderCheckAll())) {
            actions.unshift({
                type: 'button',
                children: btn
            });
        }
        if (region === 'header' &&
            !~this.renderedToolbars.indexOf('drag-toggler') &&
            (btn = this.renderDragToggler())) {
            actions.unshift({
                type: 'button',
                children: btn
            });
        }
        return Array.isArray(actions) && actions.length ? (React__default["default"].createElement("div", { className: cx('List-actions') }, actions.map(function (action, key) {
            return render("action/".concat(key), tslib.__assign({ type: 'button' }, action), {
                onAction: _this.handleAction,
                key: key,
                btnDisabled: store.dragging
            });
        }))) : null;
    };
    List.prototype.renderHeading = function () {
        var _a = this.props, title = _a.title, store = _a.store, hideQuickSaveBtn = _a.hideQuickSaveBtn, cx = _a.classnames, data = _a.data;
        if (title || (store.modified && !hideQuickSaveBtn) || store.moved) {
            return (React__default["default"].createElement("div", { className: cx('List-heading') }, store.modified && !hideQuickSaveBtn ? (React__default["default"].createElement("span", null, "\u5F53\u524D\u6709 ".concat(store.modified, " \u6761\u8BB0\u5F55\u4FEE\u6539\u4E86\u5185\u5BB9, \u4F46\u5E76\u6CA1\u6709\u63D0\u4EA4\u3002\u8BF7\u9009\u62E9:"),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSave },
                    React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon m-r-xs" }),
                    "\u63D0\u4EA4"),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon m-r-xs" }),
                    "\u653E\u5F03"))) : store.moved ? (React__default["default"].createElement("span", null, "\u5F53\u524D\u6709 ".concat(store.moved, " \u6761\u8BB0\u5F55\u4FEE\u6539\u4E86\u987A\u5E8F, \u4F46\u5E76\u6CA1\u6709\u63D0\u4EA4\u3002\u8BF7\u9009\u62E9:"),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSaveOrder },
                    React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon m-r-xs" }),
                    "\u63D0\u4EA4"),
                React__default["default"].createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon m-r-xs" }),
                    "\u653E\u5F03"))) : title ? (amisCore.filter(title, data)) : ('')));
        }
        return null;
    };
    List.prototype.renderHeader = function () {
        var _a = this.props, header = _a.header, headerClassName = _a.headerClassName; _a.headerToolbar; var headerToolbarRender = _a.headerToolbarRender, render = _a.render, showHeader = _a.showHeader, store = _a.store, cx = _a.classnames;
        if (showHeader === false) {
            return null;
        }
        var child = headerToolbarRender
            ? headerToolbarRender(tslib.__assign(tslib.__assign({}, this.props), { selectedItems: store.selectedItems.map(function (item) { return item.data; }), items: store.items.map(function (item) { return item.data; }), unSelectedItems: store.unSelectedItems.map(function (item) { return item.data; }) }), this.renderToolbar)
            : null;
        var actions = this.renderActions('header');
        var toolbarNode = actions || child || store.dragging ? (React__default["default"].createElement("div", { className: cx('List-toolbar', headerClassName), key: "header-toolbar" },
            actions,
            child,
            store.dragging ? (React__default["default"].createElement("div", { className: cx('List-dragTip'), ref: this.dragTipRef }, "\u8BF7\u62D6\u52A8\u5DE6\u8FB9\u7684\u6309\u94AE\u8FDB\u884C\u6392\u5E8F")) : null)) : null;
        var headerNode = header && (!Array.isArray(header) || header.length) ? (React__default["default"].createElement("div", { className: cx('List-header', headerClassName), key: "header" }, render('header', header))) : null;
        return headerNode && toolbarNode
            ? [headerNode, toolbarNode]
            : headerNode || toolbarNode || null;
    };
    List.prototype.renderFooter = function () {
        var _a = this.props, footer = _a.footer, footerClassName = _a.footerClassName; _a.footerToolbar; var footerToolbarRender = _a.footerToolbarRender, render = _a.render, showFooter = _a.showFooter, store = _a.store, cx = _a.classnames;
        if (showFooter === false) {
            return null;
        }
        var child = footerToolbarRender
            ? footerToolbarRender(tslib.__assign(tslib.__assign({}, this.props), { selectedItems: store.selectedItems.map(function (item) { return item.data; }), items: store.items.map(function (item) { return item.data; }), unSelectedItems: store.unSelectedItems.map(function (item) { return item.data; }) }), this.renderToolbar)
            : null;
        var actions = this.renderActions('footer');
        var toolbarNode = actions || child ? (React__default["default"].createElement("div", { className: cx('List-toolbar', footerClassName), key: "footer-toolbar" },
            actions,
            child)) : null;
        var footerNode = footer && (!Array.isArray(footer) || footer.length) ? (React__default["default"].createElement("div", { className: cx('List-footer', footerClassName), key: "footer" }, render('footer', footer))) : null;
        return footerNode && toolbarNode
            ? [toolbarNode, footerNode]
            : footerNode || toolbarNode || null;
    };
    List.prototype.renderCheckAll = function () {
        var _a = this.props, store = _a.store, multiple = _a.multiple, selectable = _a.selectable;
        if (!store.selectable ||
            !multiple ||
            !selectable ||
            store.dragging ||
            !store.items.length) {
            return null;
        }
        return (React__default["default"].createElement(amisUi.Button, { key: "checkall", tooltip: "\u5207\u6362\u5168\u9009", onClick: this.handleCheckAll, size: "sm", level: store.allChecked ? 'info' : 'default' }, "\u5168\u9009"));
    };
    List.prototype.renderDragToggler = function () {
        var _a = this.props, store = _a.store; _a.multiple; _a.selectable; var env = _a.env;
        if (!store.draggable || store.items.length < 2) {
            return null;
        }
        return (React__default["default"].createElement(amisUi.Button, { iconOnly: true, key: "dragging-toggle", tooltip: "\u5BF9\u5217\u8868\u8FDB\u884C\u6392\u5E8F\u64CD\u4F5C", tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, size: "sm", active: store.dragging, onClick: function (e) {
                e.preventDefault();
                store.toggleDragging();
                store.dragging && store.clear();
            } },
            React__default["default"].createElement(amisUi.Icon, { icon: "exchange", className: "icon r90" })));
    };
    List.prototype.renderToolbar = function (toolbar, index) {
        var type = toolbar.type || toolbar;
        if (type === 'drag-toggler') {
            this.renderedToolbars.push(type);
            return this.renderDragToggler();
        }
        else if (type === 'check-all') {
            this.renderedToolbars.push(type);
            return this.renderCheckAll();
        }
        return void 0;
    };
    // editor重写该方法，不要改名或参数
    List.prototype.renderListItem = function (index, template, item, itemClassName) {
        var _a = this.props, render = _a.render, multiple = _a.multiple, store = _a.store, onAction = _a.onAction, hideCheckToggler = _a.hideCheckToggler, checkOnItemClick = _a.checkOnItemClick, itemAction = _a.itemAction, cx = _a.classnames; _a.translate;
        return render("".concat(index), tslib.__assign({ type: 'list-item' }, template), {
            key: item.index,
            className: cx(itemClassName, {
                'is-checked': item.checked,
                'is-modified': item.modified,
                'is-moved': item.moved
            }),
            selectable: store.selectable,
            checkable: item.checkable,
            multiple: multiple,
            item: item,
            itemIndex: item.index,
            hideCheckToggler: hideCheckToggler,
            checkOnItemClick: checkOnItemClick,
            itemAction: itemAction,
            selected: item.checked,
            onCheck: this.handleCheck,
            dragging: store.dragging,
            onAction: onAction,
            data: item.locals,
            onQuickChange: store.dragging ? null : this.handleQuickChange,
            popOverContainer: this.getPopOverContainer
        });
    };
    List.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, className = _b.className, itemClassName = _b.itemClassName, store = _b.store, placeholder = _b.placeholder, render = _b.render; _b.multiple; var listItem = _b.listItem; _b.onAction; _b.hideCheckToggler; _b.checkOnItemClick; _b.itemAction; var affixHeader = _b.affixHeader, cx = _b.classnames, size = _b.size, __ = _b.translate, _c = _b.loading, loading = _c === void 0 ? false : _c;
        this.renderedToolbars = [];
        var heading = this.renderHeading();
        var header = this.renderHeader();
        return (React__default["default"].createElement("div", { className: cx('List', className, (_a = {},
                _a["List--".concat(size)] = size,
                _a['List--unsaved'] = !!store.modified || !!store.moved,
                _a)), ref: this.bodyRef },
            affixHeader && heading && header ? (React__default["default"].createElement("div", { className: cx('List-fixedTop') },
                header,
                heading)) : null,
            header,
            heading,
            store.items.length ? (React__default["default"].createElement("div", { className: cx('List-items') }, store.items.map(function (item, index) {
                return _this.renderListItem(index, listItem, item, itemClassName);
            }))) : (React__default["default"].createElement("div", { className: cx('List-placeholder') }, render('placeholder', __(placeholder)))),
            this.renderFooter(),
            React__default["default"].createElement(amisUi.Spinner, { overlay: true, show: loading })));
    };
    List.propsList = [
        'header',
        'headerToolbarRender',
        'footer',
        'footerToolbarRender',
        'placeholder',
        'source',
        'selectable',
        'headerClassName',
        'footerClassName',
        'hideQuickSaveBtn',
        'hideCheckToggler',
        'itemCheckableOn',
        'itemDraggableOn',
        'actions',
        'items',
        'valueField'
    ];
    List.defaultProps = {
        className: '',
        placeholder: 'placeholder.noData',
        source: '$items',
        selectable: false,
        headerClassName: '',
        footerClassName: '',
        affixHeader: true
    };
    return List;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ListRenderer, _super);
    function ListRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'list',
            storeType: amisCore.ListStore.name
        })
    ], ListRenderer);
    return ListRenderer;
})(List));
var ListItem = /** @class */ (function (_super) {
    tslib.__extends(ListItem, _super);
    function ListItem(props) {
        var _this = _super.call(this, props) || this;
        _this.itemRender = _this.itemRender.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        return _this;
    }
    ListItem.prototype.handleClick = function (e) {
        if (amisCore.isClickOnInput(e)) {
            return;
        }
        var _a = this.props, itemAction = _a.itemAction, onAction = _a.onAction, item = _a.item;
        if (itemAction) {
            onAction && onAction(e, itemAction, item === null || item === void 0 ? void 0 : item.data);
            return;
        }
        this.props.onCheck && this.props.onCheck(item);
    };
    ListItem.prototype.handleCheck = function () {
        var item = this.props.item;
        this.props.onCheck && this.props.onCheck(item);
    };
    ListItem.prototype.handleAction = function (e, action, ctx) {
        var _a = this.props, onAction = _a.onAction, item = _a.item;
        onAction && onAction(e, action, ctx || item.data);
    };
    ListItem.prototype.handleQuickChange = function (values, saveImmediately, savePristine, options) {
        var _a = this.props, onQuickChange = _a.onQuickChange, item = _a.item;
        onQuickChange &&
            onQuickChange(item, values, saveImmediately, savePristine, options);
    };
    ListItem.prototype.renderLeft = function () {
        var _a = this.props, dragging = _a.dragging, selectable = _a.selectable, selected = _a.selected, checkable = _a.checkable, multiple = _a.multiple, hideCheckToggler = _a.hideCheckToggler, checkOnItemClick = _a.checkOnItemClick, cx = _a.classnames, ns = _a.classPrefix;
        if (dragging) {
            return (React__default["default"].createElement("div", { className: cx('ListItem-dragBtn') },
                React__default["default"].createElement(amisUi.Icon, { icon: "drag-bar", className: "icon" })));
        }
        else if (selectable && !hideCheckToggler) {
            return (React__default["default"].createElement("div", { className: cx('ListItem-checkBtn') },
                React__default["default"].createElement(amisUi.Checkbox, { classPrefix: ns, type: multiple ? 'checkbox' : 'radio', disabled: !checkable, checked: selected, onChange: checkOnItemClick ? amisCore.noop : this.handleCheck, inline: true })));
        }
        return null;
    };
    ListItem.prototype.renderRight = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, data = _a.data, dragging = _a.dragging, cx = _a.classnames;
        if (Array.isArray(actions)) {
            return (React__default["default"].createElement("div", { className: cx('ListItem-actions') }, actions.map(function (action, index) {
                if (!amisCore.isVisible(action, data)) {
                    return null;
                }
                return render("action/".concat(index), tslib.__assign({ size: 'sm', level: 'link', type: 'button' }, action // todo 等后面修复了干掉 https://github.com/microsoft/TypeScript/pull/38577
                ), {
                    key: index,
                    disabled: dragging || amisCore.isDisabled(action, data),
                    onAction: _this.handleAction
                });
            })));
        }
        return null;
    };
    ListItem.prototype.renderChild = function (node, region, key) {
        if (region === void 0) { region = 'body'; }
        if (key === void 0) { key = 0; }
        var render = this.props.render;
        /*if (Array.isArray(node)) {
                return (
                    <div className="hbox" key={key}>
                        {node.map((item, index) => (
                            <div key={index} className="col">{this.renderChild(item, `${region}/${index}`)}</div>
                        ))}
                    </div>
                );
            } else */ if (typeof node === 'string' || typeof node === 'number') {
            return render(region, node, { key: key });
        }
        var childNode = node;
        if (childNode.type === 'hbox' || childNode.type === 'grid') {
            return render(region, node, {
                key: key,
                itemRender: this.itemRender
            });
        }
        return this.renderFeild(region, childNode, key, this.props);
    };
    ListItem.prototype.itemRender = function (field, index, props) {
        return this.renderFeild("column/".concat(index), field, index, props);
    };
    ListItem.prototype.renderFeild = function (region, field, key, props) {
        var render = (props === null || props === void 0 ? void 0 : props.render) || this.props.render;
        var data = this.props.data;
        var cx = this.props.classnames;
        var itemIndex = this.props.itemIndex;
        var $$id = field.$$id ? "".concat(field.$$id, "-field") : '';
        if (!amisCore.isVisible(field, data)) {
            return null;
        }
        return (React__default["default"].createElement("div", { key: key, className: cx('ListItem-field') },
            field && field.label ? (React__default["default"].createElement("label", { className: cx('ListItem-fieldLabel', field.labelClassName) }, field.label)) : null,
            render(region, tslib.__assign(tslib.__assign({}, field), { field: field, $$id: $$id, type: 'list-item-field' }), {
                rowIndex: itemIndex,
                colIndex: key,
                className: cx('ListItem-fieldValue', field.className),
                value: field.name ? amisCore.resolveVariable(field.name, data) : undefined,
                onAction: this.handleAction,
                onQuickChange: this.handleQuickChange
            })));
    };
    ListItem.prototype.renderBody = function () {
        var _this = this;
        var body = this.props.body;
        if (!body) {
            return null;
        }
        else if (Array.isArray(body)) {
            return body.map(function (child, index) {
                return _this.renderChild(tslib.__assign({ type: 'plain' }, (typeof child === 'string' ? { type: 'tpl', tpl: child } : child)), "body/".concat(index), index);
            });
        }
        return this.renderChild(body, 'body');
    };
    ListItem.prototype.render = function () {
        var _a = this.props, className = _a.className, data = _a.data, avatarTpl = _a.avatar, titleTpl = _a.title, titleClassName = _a.titleClassName, subTitleTpl = _a.subTitle, descTpl = _a.desc, avatarClassName = _a.avatarClassName, checkOnItemClick = _a.checkOnItemClick, render = _a.render, checkable = _a.checkable, cx = _a.classnames, actionsPosition = _a.actionsPosition, itemAction = _a.itemAction;
        var avatar = amisCore.filter(avatarTpl, data);
        var title = amisCore.filter(titleTpl, data);
        var subTitle = amisCore.filter(subTitleTpl, data);
        var desc = amisCore.filter(descTpl, data);
        return (React__default["default"].createElement("div", { onClick: (checkOnItemClick && checkable) || itemAction
                ? this.handleClick
                : undefined, className: cx("ListItem ListItem--actions-at-".concat(actionsPosition || 'right'), {
                'ListItem--hasItemAction': itemAction
            }, className) },
            this.renderLeft(),
            this.renderRight(),
            avatar ? (React__default["default"].createElement("span", { className: cx('ListItem-avatar', avatarClassName) },
                React__default["default"].createElement("img", { src: avatar, alt: "..." }))) : null,
            React__default["default"].createElement("div", { className: cx('ListItem-content') },
                title ? (React__default["default"].createElement("p", { className: cx('ListItem-title', titleClassName) }, title)) : null,
                subTitle ? (React__default["default"].createElement("div", null,
                    React__default["default"].createElement("small", { className: cx('ListItem-subtitle') }, subTitle))) : null,
                desc ? render('description', desc) : null,
                this.renderBody())));
    };
    ListItem.defaultProps = {
        avatarClassName: 'thumb-sm avatar m-r',
        titleClassName: 'h5'
    };
    ListItem.propsList = [
        'avatarClassName',
        'titleClassName',
        'itemAction'
    ];
    return ListItem;
}(React__default["default"].Component));
var ListItemRenderer = /** @class */ (function (_super) {
    tslib.__extends(ListItemRenderer, _super);
    function ListItemRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListItemRenderer.propsList = tslib.__spreadArray(['multiple'], ListItem.propsList, true);
    ListItemRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)(?:list|list-group)\/(?:.*\/)?list-item$/,
            name: 'list-item'
        })
    ], ListItemRenderer);
    return ListItemRenderer;
}(ListItem));
/** @class */ ((function (_super) {
    tslib.__extends(ListItemFieldRenderer, _super);
    function ListItemFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListItemFieldRenderer.prototype.render = function () {
        var _a = this.props, className = _a.className, render = _a.render, style = _a.style, Component = _a.wrapperComponent; _a.labelClassName; var value = _a.value, data = _a.data, children = _a.children, width = _a.width, innerClassName = _a.innerClassName; _a.label; var tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, field = _a.field, rest = tslib.__rest(_a, ["className", "render", "style", "wrapperComponent", "labelClassName", "value", "data", "children", "width", "innerClassName", "label", "tabIndex", "onKeyUp", "field"]);
        var schema = tslib.__assign(tslib.__assign({}, field), { className: innerClassName, type: (field && field.type) || 'plain' });
        var body = children
            ? children
            : render('field', schema, tslib.__assign(tslib.__assign({}, omit__default["default"](rest, Object.keys(schema))), { value: value, data: data }));
        if (width) {
            style = style || {};
            style.width = style.width || width;
            body = (React__default["default"].createElement("div", { style: { width: !/%/.test(String(width)) ? width : '' } }, body));
        }
        if (!Component) {
            return body;
        }
        return (React__default["default"].createElement(Component, { style: style, className: className, tabIndex: tabIndex, onKeyUp: onKeyUp }, body));
    };
    ListItemFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, TableCell.TableCell.defaultProps), { wrapperComponent: 'div' });
    ListItemFieldRenderer.propsList = tslib.__spreadArray([
        'quickEdit',
        'quickEditEnabledOn',
        'popOver',
        'copyable',
        'inline'
    ], TableCell.TableCell.propsList, true);
    ListItemFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'list-item-field'
        }),
        QuickEdit.HocQuickEdit(),
        PopOver.HocPopOver(),
        Copyable.HocCopyable()
    ], ListItemFieldRenderer);
    return ListItemFieldRenderer;
})(TableCell.TableCell));

exports.ListItem = ListItem;
exports.ListItemRenderer = ListItemRenderer;
exports["default"] = List;
