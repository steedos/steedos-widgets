/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var omit = require('lodash/omit');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var QuickEdit = require('./QuickEdit.js');
var PopOver = require('./PopOver.js');
require('./Table/index.js');
var Copyable = require('./Copyable.js');
var ReactDOM = require('react-dom');
var TableCell = require('./Table/TableCell.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);

var CardRenderer = /** @class */ (function (_super) {
    tslib.__extends(CardRenderer, _super);
    function CardRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        return _this;
    }
    CardRenderer.prototype.isHaveLink = function () {
        var _a = this.props, href = _a.href, itemAction = _a.itemAction, onCheck = _a.onCheck, checkOnItemClick = _a.checkOnItemClick, checkable = _a.checkable;
        return href || itemAction || onCheck || (checkOnItemClick && checkable);
    };
    CardRenderer.prototype.handleClick = function (e) {
        var _a = this.props, item = _a.item, href = _a.href, data = _a.data, env = _a.env, blank = _a.blank, itemAction = _a.itemAction, onAction = _a.onAction, onCheck = _a.onCheck, selectable = _a.selectable;
        if (href) {
            env.jumpTo(amisCore.filter(href, data), {
                type: 'button',
                actionType: 'url',
                blank: blank
            });
            return;
        }
        if (itemAction) {
            onAction && onAction(e, itemAction, (item === null || item === void 0 ? void 0 : item.data) || data);
            return;
        }
        selectable && (onCheck === null || onCheck === void 0 ? void 0 : onCheck(item));
    };
    CardRenderer.prototype.handleAction = function (e, action, ctx) {
        var _a = this.props, onAction = _a.onAction, item = _a.item;
        onAction && onAction(e, action, ctx || item.data);
    };
    CardRenderer.prototype.handleCheck = function (e) {
        var item = this.props.item;
        this.props.onCheck && this.props.onCheck(item);
    };
    CardRenderer.prototype.getPopOverContainer = function () {
        return ReactDOM.findDOMNode(this);
    };
    CardRenderer.prototype.handleQuickChange = function (values, saveImmediately, savePristine, options) {
        var _a = this.props, onQuickChange = _a.onQuickChange, item = _a.item;
        onQuickChange &&
            onQuickChange(item, values, saveImmediately, savePristine, options);
    };
    CardRenderer.prototype.renderToolbar = function () {
        var _a = this.props, selectable = _a.selectable, checkable = _a.checkable, selected = _a.selected, checkOnItemClick = _a.checkOnItemClick, multiple = _a.multiple, hideCheckToggler = _a.hideCheckToggler, cx = _a.classnames, toolbar = _a.toolbar, render = _a.render, dragging = _a.dragging, data = _a.data, header = _a.header;
        var toolbars = [];
        if (header) {
            var highlightClassName = header.highlightClassName, highlight = header.highlight;
            if (typeof highlight === 'string'
                ? amisCore.evalExpression(highlight, data)
                : highlight) {
                toolbars.push(React__default["default"].createElement("i", { key: "highlight", className: cx('Card-highlight', highlightClassName) }));
            }
        }
        if (selectable && !hideCheckToggler) {
            toolbars.push(React__default["default"].createElement(amisUi.Checkbox, { key: "check", className: cx('Card-checkbox'), type: multiple ? 'checkbox' : 'radio', disabled: !checkable, checked: selected, onChange: checkOnItemClick ? amisCore.noop : this.handleCheck }));
        }
        if (Array.isArray(toolbar)) {
            toolbar.forEach(function (action, index) {
                return toolbars.push(render("toolbar/".concat(index), tslib.__assign({ type: 'button', level: 'link', size: 'sm' }, action), {
                    key: index
                }));
            });
        }
        if (dragging) {
            toolbars.push(React__default["default"].createElement("div", { className: cx('Card-dragBtn') },
                React__default["default"].createElement(amisUi.Icon, { icon: "drag-bar", className: "icon" })));
        }
        return toolbars.length ? (React__default["default"].createElement("div", { className: cx('Card-toolbar') }, toolbars)) : null;
    };
    CardRenderer.prototype.renderActions = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, dragging = _a.dragging, actionsCount = _a.actionsCount, data = _a.data, cx = _a.classnames;
        if (Array.isArray(actions)) {
            var group = amisCore.padArr(actions.filter(function (item) { return amisCore.isVisible(item, data); }), actionsCount);
            return group.map(function (actions, groupIndex) { return (React__default["default"].createElement("div", { key: groupIndex, className: cx('Card-actions') }, actions.map(function (action, index) {
                var size = action.size || 'sm';
                return render("action/".concat(index), tslib.__assign(tslib.__assign({ level: 'link', type: 'button' }, action), { size: size }), {
                    isMenuItem: true,
                    key: index,
                    index: index,
                    disabled: dragging || amisCore.isDisabled(action, data),
                    className: cx('Card-action', action.className || "".concat(size ? "Card-action--".concat(size) : '')),
                    componentClass: 'a',
                    onAction: _this.handleAction
                });
            }))); });
        }
        return;
    };
    CardRenderer.prototype.renderChild = function (node, region, key) {
        if (region === void 0) { region = 'body'; }
        if (key === void 0) { key = 0; }
        var render = this.props.render;
        if (typeof node === 'string' || typeof node === 'number') {
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
    CardRenderer.prototype.itemRender = function (field, index, props) {
        return this.renderFeild("column/".concat(index), field, index, props);
    };
    CardRenderer.prototype.renderFeild = function (region, field, key, props) {
        var render = props.render, cx = props.classnames, itemIndex = props.itemIndex;
        var useCardLabel = (props === null || props === void 0 ? void 0 : props.useCardLabel) !== false;
        var data = this.props.data;
        if (!field || !amisCore.isVisible(field, data)) {
            return;
        }
        var $$id = field.$$id ? "".concat(field.$$id, "-field") : '';
        return (React__default["default"].createElement("div", { className: cx('Card-field'), key: key },
            useCardLabel && field.label ? (React__default["default"].createElement("label", { className: cx('Card-fieldLabel', field.labelClassName) }, field.label)) : null,
            render(region, tslib.__assign(tslib.__assign({}, field), { field: field, $$id: $$id, type: 'card-item-field' }), {
                useCardLabel: useCardLabel,
                className: cx('Card-fieldValue', field.className),
                rowIndex: itemIndex,
                colIndex: key,
                value: field.name ? amisCore.resolveVariable(field.name, data) : undefined,
                popOverContainer: this.getPopOverContainer,
                onAction: this.handleAction,
                onQuickChange: this.handleQuickChange
            })));
    };
    CardRenderer.prototype.renderBody = function () {
        var _this = this;
        var body = this.props.body;
        if (!body) {
            return null;
        }
        if (Array.isArray(body)) {
            return body.map(function (child, index) {
                return _this.renderChild(child, "body/".concat(index), index);
            });
        }
        return this.renderChild(body, 'body');
    };
    CardRenderer.prototype.rederTitle = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var titleTpl = (header || {}).title;
            var title = amisCore.filter(titleTpl, data);
            return title ? render('title', titleTpl) : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderSubTitle = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var subTitleTpl = (header || {}).subTitle;
            var subTitle = amisCore.filter(subTitleTpl, data);
            return subTitle ? render('sub-title', subTitleTpl) : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderSubTitlePlaceholder = function () {
        var _a = this.props, render = _a.render, header = _a.header, cx = _a.classnames;
        if (header) {
            var subTitlePlaceholder = (header || {}).subTitlePlaceholder;
            return subTitlePlaceholder
                ? render('sub-title', subTitlePlaceholder, {
                    className: cx('Card-placeholder')
                })
                : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderDesc = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var _b = header || {}, descTpl = _b.desc, descriptionTpl = _b.description;
            var desc = amisCore.filter(descriptionTpl || descTpl, data);
            return desc
                ? render('desc', descriptionTpl || descTpl, {
                    className: !desc ? 'text-muted' : null
                })
                : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderDescPlaceholder = function () {
        var _a = this.props, render = _a.render, header = _a.header;
        if (header) {
            var descPlaceholder = header.descriptionPlaceholder || header.descPlaceholder;
            return descPlaceholder
                ? render('desc', descPlaceholder, {
                    className: !descPlaceholder ? 'text-muted' : null
                })
                : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderAvatar = function () {
        var _a = this.props, data = _a.data, header = _a.header;
        if (header) {
            var avatarTpl = (header || {}).avatar;
            var avatar = amisCore.filter(avatarTpl, data, '| raw');
            return avatar ? avatar : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderAvatarText = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var avatarTextTpl = (header || {}).avatarText;
            var avatarText = amisCore.filter(avatarTextTpl, data);
            return avatarText ? render('avatarText', avatarTextTpl) : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderSecondary = function () {
        var _a = this.props, render = _a.render, data = _a.data, secondaryTextTpl = _a.secondary;
        var secondary = amisCore.filter(secondaryTextTpl, data);
        return secondary ? render('secondary', secondaryTextTpl) : undefined;
    };
    CardRenderer.prototype.renderAvatarTextStyle = function () {
        var _a = this.props, header = _a.header, data = _a.data;
        if (header) {
            var avatarTextTpl = header.avatarText, avatarTextBackground = header.avatarTextBackground;
            var avatarText = amisCore.filter(avatarTextTpl, data);
            var avatarTextStyle = {};
            if (avatarText && avatarTextBackground && avatarTextBackground.length) {
                avatarTextStyle['background'] =
                    avatarTextBackground[Math.abs(amisCore.hashCode(avatarText)) % avatarTextBackground.length];
            }
            return avatarTextStyle;
        }
        return;
    };
    CardRenderer.prototype.renderMedia = function () {
        var _a = this.props, media = _a.media, cx = _a.classnames, render = _a.render, region = _a.region, data = _a.data;
        if (media) {
            var type = media.type, url = media.url, className = media.className, autoPlay = media.autoPlay, isLive = media.isLive, poster = media.poster;
            var mediaUrl = amisCore.resolveVariableAndFilter(url, data, '| raw');
            if (type === 'image' && mediaUrl) {
                return (React__default["default"].createElement("img", { className: cx('Card-multiMedia-img', className), src: mediaUrl }));
            }
            else if (type === 'video' && mediaUrl) {
                return (React__default["default"].createElement("div", { className: cx('Card-multiMedia-video', className) }, render(region, {
                    type: type,
                    autoPlay: autoPlay,
                    poster: poster,
                    src: mediaUrl,
                    isLive: isLive
                })));
            }
        }
        return;
    };
    CardRenderer.prototype.render = function () {
        var _a = this.props, header = _a.header, className = _a.className, avatarClassName = _a.avatarClassName, avatarTextClassName = _a.avatarTextClassName, descClassName = _a.descClassName, descriptionClassName = _a.descriptionClassName, titleClassName = _a.titleClassName, subTitleClassName = _a.subTitleClassName, bodyClassName = _a.bodyClassName, imageClassName = _a.imageClassName, headerClassName = _a.headerClassName, secondaryClassName = _a.secondaryClassName, footerClassName = _a.footerClassName; _a.mediaClassName; var media = _a.media, rest = tslib.__rest(_a, ["header", "className", "avatarClassName", "avatarTextClassName", "descClassName", "descriptionClassName", "titleClassName", "subTitleClassName", "bodyClassName", "imageClassName", "headerClassName", "secondaryClassName", "footerClassName", "mediaClassName", "media"]);
        var headerCn = (header === null || header === void 0 ? void 0 : header.className) || headerClassName;
        var titleCn = (header === null || header === void 0 ? void 0 : header.titleClassName) || titleClassName;
        var subTitleCn = (header === null || header === void 0 ? void 0 : header.subTitleClassName) || subTitleClassName;
        var descCn = (header === null || header === void 0 ? void 0 : header.descClassName) || descClassName;
        var descriptionCn = (header === null || header === void 0 ? void 0 : header.descriptionClassName) || descriptionClassName || descCn;
        var avatarTextCn = (header === null || header === void 0 ? void 0 : header.avatarTextClassName) || avatarTextClassName;
        var avatarCn = (header === null || header === void 0 ? void 0 : header.avatarClassName) || avatarClassName;
        var imageCn = (header === null || header === void 0 ? void 0 : header.imageClassName) || imageClassName;
        var mediaPosition = media === null || media === void 0 ? void 0 : media.position;
        return (React__default["default"].createElement(amisUi.Card, tslib.__assign({}, rest, { title: this.rederTitle(), subTitle: this.renderSubTitle(), subTitlePlaceholder: this.renderSubTitlePlaceholder(), description: this.renderDesc(), descriptionPlaceholder: this.renderDescPlaceholder(), children: this.renderBody(), actions: this.renderActions(), avatar: this.renderAvatar(), avatarText: this.renderAvatarText(), secondary: this.renderSecondary(), toolbar: this.renderToolbar(), avatarClassName: avatarCn, avatarTextStyle: this.renderAvatarTextStyle(), avatarTextClassName: avatarTextCn, className: className, titleClassName: titleCn, media: this.renderMedia(), subTitleClassName: subTitleCn, mediaPosition: mediaPosition, descriptionClassName: descriptionCn, imageClassName: imageCn, headerClassName: headerCn, footerClassName: footerClassName, secondaryClassName: secondaryClassName, bodyClassName: bodyClassName, onClick: this.isHaveLink() ? this.handleClick : undefined })));
    };
    CardRenderer.defaultProps = {
        className: '',
        avatarClassName: '',
        headerClassName: '',
        footerClassName: '',
        secondaryClassName: '',
        avatarTextClassName: '',
        bodyClassName: '',
        actionsCount: 4,
        titleClassName: '',
        highlightClassName: '',
        subTitleClassName: '',
        descClassName: '',
        descriptionClassName: '',
        imageClassName: '',
        highlight: false,
        blank: true,
        dragging: false,
        selectable: false,
        checkable: true,
        selected: false,
        hideCheckToggler: false,
        useCardLabel: true
    };
    CardRenderer.propsList = [
        'avatarClassName',
        'avatarTextClassName',
        'bodyClassName',
        'actionsCount',
        'titleClassName',
        'highlightClassName',
        'subTitleClassName',
        'descClassName',
        'descriptionClassName',
        'imageClassName',
        'hideCheckToggler'
    ];
    CardRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'card'
        }),
        tslib.__metadata("design:paramtypes", [Object])
    ], CardRenderer);
    return CardRenderer;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CardItemFieldRenderer, _super);
    function CardItemFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardItemFieldRenderer.prototype.render = function () {
        var _a = this.props; _a.type; var className = _a.className, render = _a.render, style = _a.style, Component = _a.wrapperComponent; _a.labelClassName; var value = _a.value, data = _a.data, children = _a.children, width = _a.width, innerClassName = _a.innerClassName; _a.label; var tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, field = _a.field, useCardLabel = _a.useCardLabel, rest = tslib.__rest(_a, ["type", "className", "render", "style", "wrapperComponent", "labelClassName", "value", "data", "children", "width", "innerClassName", "label", "tabIndex", "onKeyUp", "field", "useCardLabel"]);
        var schema = tslib.__assign(tslib.__assign({}, field), { 
            /** 针对带有label的表单项组件，默认不渲染组件自带的label，否则会出现重复的label */
            renderLabel: !useCardLabel, className: innerClassName, type: (field && field.type) || 'plain' });
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
    CardItemFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, TableCell.TableCell.defaultProps), { wrapperComponent: 'div' });
    CardItemFieldRenderer.propsList = tslib.__spreadArray([
        'quickEdit',
        'quickEditEnabledOn',
        'popOver',
        'copyable',
        'inline'
    ], TableCell.TableCell.propsList, true);
    CardItemFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'card-item-field'
        }),
        QuickEdit.HocQuickEdit(),
        PopOver.HocPopOver(),
        Copyable.HocCopyable()
    ], CardItemFieldRenderer);
    return CardItemFieldRenderer;
})(TableCell.TableCell));

exports.CardRenderer = CardRenderer;
