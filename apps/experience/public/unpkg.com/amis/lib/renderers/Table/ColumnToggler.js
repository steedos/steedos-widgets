/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var Sortable = require('sortablejs');
var cloneDeep = require('lodash/cloneDeep');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Sortable__default = /*#__PURE__*/_interopDefaultLegacy(Sortable);
var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);

var ColumnToggler = /** @class */ (function (_super) {
    tslib.__extends(ColumnToggler, _super);
    function ColumnToggler(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            enableSorting: false,
            tempColumns: cloneDeep__default["default"](_this.props.columns)
        };
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.toggle = _this.toggle.bind(_this);
        _this.domRef = _this.domRef.bind(_this);
        _this.dragRef = _this.dragRef.bind(_this);
        return _this;
    }
    ColumnToggler.prototype.componentDidMount = function () {
        if (this.props.defaultIsOpened) {
            this.setState({
                isOpened: true
            });
        }
    };
    ColumnToggler.prototype.componentDidUpdate = function (prevProps) {
        if (amisCore.anyChanged('activeToggaleColumns', prevProps, this.props)) {
            this.setState({ tempColumns: this.props.columns });
        }
    };
    ColumnToggler.prototype.componentWillUnmount = function () {
        this.destroyDragging();
    };
    ColumnToggler.prototype.domRef = function (ref) {
        this.target = ref;
    };
    ColumnToggler.prototype.toggle = function (e) {
        e.preventDefault();
        this.setState({
            isOpened: !this.state.isOpened
        });
    };
    ColumnToggler.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    ColumnToggler.prototype.close = function () {
        this.setState({
            isOpened: false,
            enableSorting: false,
            tempColumns: cloneDeep__default["default"](this.props.columns)
        });
    };
    ColumnToggler.prototype.swapColumnPosition = function (oldIndex, newIndex) {
        var columns = this.state.tempColumns;
        columns[oldIndex] = columns.splice(newIndex, 1, columns[oldIndex])[0];
        this.setState({ tempColumns: columns });
    };
    ColumnToggler.prototype.updateToggledColumn = function (column, index, value, shift) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, data, dispatchEvent, tempColumns, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        tempColumns = this.state.tempColumns.concat();
                        tempColumns.splice(index, 1, tslib.__assign(tslib.__assign({}, column), { toggled: value }));
                        return [4 /*yield*/, dispatchEvent('columnToggled', amisCore.createObject(data, {
                                columns: tempColumns
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({ tempColumns: tempColumns });
                        return [2 /*return*/];
                }
            });
        });
    };
    ColumnToggler.prototype.dragRef = function (ref) {
        var enableSorting = this.state.enableSorting;
        var draggable = this.props.draggable;
        if (enableSorting && draggable && ref) {
            this.initDragging();
        }
    };
    ColumnToggler.prototype.initDragging = function () {
        var _this = this;
        var dom = ReactDOM.findDOMNode(this);
        var ns = this.props.classPrefix;
        this.sortable = new Sortable__default["default"](dom.querySelector(".".concat(ns, "ColumnToggler-modal-content")), {
            group: "ColumnToggler-modal-content",
            animation: 150,
            handle: ".".concat(ns, "ColumnToggler-menuItem-dragBar"),
            ghostClass: "".concat(ns, "ColumnToggler-menuItem--dragging"),
            onEnd: function (e) {
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
                _this.swapColumnPosition(e.oldIndex, e.newIndex);
            }
        });
    };
    ColumnToggler.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    ColumnToggler.prototype.onConfirm = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var tempColumns, _a, onColumnToggle, data, dispatchEvent, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tempColumns = this.state.tempColumns;
                        _a = this.props, onColumnToggle = _a.onColumnToggle, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('columnToggled', amisCore.createObject(data, {
                                columns: tempColumns
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onColumnToggle && onColumnToggle(tslib.__spreadArray([], tempColumns, true));
                        this.setState({
                            isOpened: false,
                            enableSorting: false
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ColumnToggler.prototype.renderOuter = function () {
        var _this = this;
        var _a;
        var _b = this.props, popOverContainer = _b.popOverContainer, cx = _b.classnames, ns = _b.classPrefix, children = _b.children, closeOnClick = _b.closeOnClick, closeOnOutside = _b.closeOnOutside;
        var body = (React__default["default"].createElement(amisCore.RootClose, { disabled: !this.state.isOpened, onRootClose: closeOnOutside !== false ? this.close : amisCore.noop }, function (ref) {
            return (React__default["default"].createElement("ul", { className: cx('ColumnToggler-menu'), onClick: closeOnClick ? _this.close : amisCore.noop, ref: ref }, children));
        }));
        if (popOverContainer) {
            return (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer, target: function () { return _this.target; }, show: true },
                React__default["default"].createElement(amisCore.PopOver, { overlay: true, onHide: this.close, classPrefix: ns, className: cx('ColumnToggler-popover'), style: { minWidth: (_a = this.target) === null || _a === void 0 ? void 0 : _a.offsetWidth } }, body)));
        }
        return body;
    };
    ColumnToggler.prototype.renderModal = function () {
        var _this = this;
        var _a = this.props; _a.render; var cx = _a.classnames, ns = _a.classPrefix, modalContainer = _a.modalContainer, draggable = _a.draggable, overlay = _a.overlay, __ = _a.translate, footerBtnSize = _a.footerBtnSize;
        var _b = this.state, enableSorting = _b.enableSorting, tempColumns = _b.tempColumns;
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(amisUi.Modal, { closeOnEsc: true, onHide: this.close, show: this.state.isOpened, contentClassName: cx('ColumnToggler-modal'), container: modalContainer || this.target, overlay: typeof overlay === 'boolean' ? overlay : false },
                React__default["default"].createElement("header", { className: cx('ColumnToggler-modal-header') },
                    React__default["default"].createElement("span", { className: cx('ColumnToggler-modal-title') }, __('Table.columnsVisibility')),
                    React__default["default"].createElement("a", { "data-tooltip": __('Dialog.close'), "data-position": "left", className: cx('Modal-close'), onClick: this.close },
                        React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" }))),
                React__default["default"].createElement("ul", { className: cx('ColumnToggler-modal-content'), ref: this.dragRef }, Array.isArray(tempColumns)
                    ? tempColumns.map(function (column, index) { return (React__default["default"].createElement(amisUi.TooltipWrapper, { tooltipClassName: cx('ColumnToggler-tooltip'), placement: "top", tooltip: column.label || '', trigger: enableSorting ? [] : 'hover', key: column.index },
                        React__default["default"].createElement("li", { className: cx('ColumnToggler-menuItem'), key: column.index }, enableSorting && draggable && tempColumns.length > 1 ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement("a", { className: cx('ColumnToggler-menuItem-dragBar') },
                                React__default["default"].createElement(amisUi.Icon, { icon: "drag", className: cx('icon') })),
                            React__default["default"].createElement("span", { className: cx('ColumnToggler-menuItem-label') },
                                React__default["default"].createElement("span", null, column.label || '-')))) : (React__default["default"].createElement(amisUi.Checkbox, { size: "sm", labelClassName: cx('ColumnToggler-menuItem-label'), classPrefix: ns, checked: column.toggled, disabled: !column.toggable || enableSorting, onChange: _this.updateToggledColumn.bind(_this, column, index) },
                            React__default["default"].createElement("span", null, column.label || '-')))))); })
                    : null),
                React__default["default"].createElement("footer", { className: cx('ColumnToggler-modal-footer') },
                    React__default["default"].createElement("div", null,
                        React__default["default"].createElement(amisUi.Button, { className: cx("ColumnToggler-modeSelect", {
                                'is-actived': !enableSorting
                            }), onClick: function () { return _this.setState({ enableSorting: false }); }, level: "link" }, __('Table.toggleColumn')),
                        React__default["default"].createElement(amisUi.Button, { className: cx("ColumnToggler-modeSelect", {
                                'is-actived': enableSorting
                            }), onClick: function () {
                                return _this.setState({ enableSorting: true }, function () {
                                    return _this.state.enableSorting &&
                                        _this.props.draggable &&
                                        _this.initDragging();
                                });
                            }, level: "link", disabled: tempColumns.length < 2 }, __('sort'))),
                    React__default["default"].createElement("div", null,
                        React__default["default"].createElement(amisUi.Button, { size: footerBtnSize, className: "mr-3", onClick: this.close }, __('cancel')),
                        React__default["default"].createElement(amisUi.Button, { size: footerBtnSize, level: "primary", onClick: this.onConfirm }, __('confirm')))))));
    };
    ColumnToggler.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, placement = _a.placement, tooltipContainer = _a.tooltipContainer, tooltipTrigger = _a.tooltipTrigger, tooltipRootClose = _a.tooltipRootClose, disabledTip = _a.disabledTip, block = _a.block, disabled = _a.disabled, btnDisabled = _a.btnDisabled, btnClassName = _a.btnClassName, size = _a.size, label = _a.label, level = _a.level, primary = _a.primary, className = _a.className, cx = _a.classnames, align = _a.align, iconOnly = _a.iconOnly, icon = _a.icon, isActived = _a.isActived, data = _a.data, draggable = _a.draggable, hideExpandIcon = _a.hideExpandIcon;
        var button = (React__default["default"].createElement("button", { onClick: this.toggle, disabled: disabled || btnDisabled, className: cx('Button', btnClassName, typeof level === 'undefined'
                ? 'Button--default'
                : level
                    ? "Button--".concat(level)
                    : '', {
                'Button--block': block,
                'Button--primary': primary,
                'Button--iconOnly': iconOnly
            }, size ? "Button--".concat(size) : '') },
            icon ? (typeof icon === 'string' ? (amisUi.getIcon(icon) ? (React__default["default"].createElement(amisUi.Icon, { icon: icon, className: cx('icon', { 'm-r-xs': !!label }) })) : (amisCore.generateIcon(cx, icon, label ? 'm-r-xs' : ''))) : React__default["default"].isValidElement(icon) ? (React__default["default"].cloneElement(icon, {
                className: cx({ 'm-r-xs': !!label })
            })) : (React__default["default"].createElement(amisUi.Icon, { icon: "columns", className: "icon m-r-none" }))) : (React__default["default"].createElement(amisUi.Icon, { icon: "columns", className: "icon m-r-none" })),
            typeof label === 'string' ? amisCore.filter(label, data) : label,
            hideExpandIcon || draggable ? null : (React__default["default"].createElement("span", { className: cx('ColumnToggler-caret') },
                React__default["default"].createElement(amisUi.Icon, { icon: "caret", className: "icon" })))));
        return (React__default["default"].createElement("div", { className: cx('ColumnToggler', {
                'ColumnToggler-block': block,
                'ColumnToggler--alignRight': align === 'right',
                'is-opened': this.state.isOpened,
                'is-actived': isActived
            }, className), ref: this.domRef },
            draggable ? (button) : (React__default["default"].createElement(amisUi.TooltipWrapper, { placement: placement, tooltip: disabled ? disabledTip : tooltip, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose }, button)),
            this.state.isOpened
                ? draggable
                    ? this.renderModal()
                    : this.renderOuter()
                : null));
    };
    ColumnToggler.defaultProps = {
        placement: 'top',
        tooltipTrigger: ['hover', 'focus'],
        tooltipRootClose: false,
        draggable: false
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ColumnToggler.prototype, "dragRef", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", Promise)
    ], ColumnToggler.prototype, "onConfirm", null);
    return ColumnToggler;
}(React__default["default"].Component));

exports["default"] = ColumnToggler;
