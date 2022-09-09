/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var inRange = require('lodash/inRange');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var inRange__default = /*#__PURE__*/_interopDefaultLegacy(inRange);

var CheckboxesControl = /** @class */ (function (_super) {
    tslib.__extends(CheckboxesControl, _super);
    function CheckboxesControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxesControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    CheckboxesControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    CheckboxesControl.prototype.handleAddClick = function () {
        var onAdd = this.props.onAdd;
        onAdd && onAdd();
    };
    CheckboxesControl.prototype.handleEditClick = function (e, item) {
        var onEdit = this.props.onEdit;
        e.preventDefault();
        e.stopPropagation();
        onEdit && onEdit(item);
    };
    CheckboxesControl.prototype.handleDeleteClick = function (e, item) {
        var onDelete = this.props.onDelete;
        e.preventDefault();
        e.stopPropagation();
        onDelete && onDelete(item);
    };
    CheckboxesControl.prototype.componentDidMount = function () {
        this.updateBorderStyle();
        window.addEventListener('resize', this.updateBorderStyle);
    };
    CheckboxesControl.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.updateBorderStyle);
    };
    CheckboxesControl.prototype.updateBorderStyle = function () {
        if (this.props.optionType !== 'button') {
            return;
        }
        var wrapDom = this.refs.checkboxRef;
        var wrapWidth = wrapDom.clientWidth;
        var childs = Array.from(wrapDom.children);
        childs.forEach(function (child) {
            child.style.borderRadius = '0';
            child.style.borderLeftWidth = '1px';
            child.style.borderTopWidth = '1px';
        });
        var childTotalWidth = childs.reduce(function (pre, next) { return pre + next.clientWidth; }, 0);
        if (childTotalWidth <= wrapWidth) {
            if (childs.length === 1) {
                childs[0].style.borderRadius = '4px';
            }
            else {
                childs[0].style.borderRadius = '4px 0 0 4px';
                childs[childs.length - 1].style.borderRadius = '0 4px 4px 0';
                childs.forEach(function (child, idx) {
                    idx !== 0 && (child.style.borderLeftWidth = '0');
                });
            }
        }
        else {
            var curRowWidth_1 = 0;
            var curRow_1 = 0;
            var rowNum_1 = Math.floor(childTotalWidth / wrapWidth);
            var rowColArr_1 = [];
            for (var i = 0; i <= rowNum_1; i++) {
                var arr = [];
                rowColArr_1[i] = arr;
            }
            childs.forEach(function (child, idx) {
                curRowWidth_1 += child.clientWidth;
                if (curRowWidth_1 > wrapWidth) {
                    curRowWidth_1 = child.clientWidth;
                    curRow_1++;
                }
                if (curRow_1 > rowNum_1) {
                    return;
                }
                rowColArr_1[curRow_1].push(child);
            });
            rowColArr_1.forEach(function (row, rowIdx) {
                if (rowIdx === 0) {
                    row.forEach(function (r, colIdx) {
                        r.style.borderRadius = '0';
                        colIdx !== 0 && (r.style.borderLeftWidth = '0');
                        row.length > rowColArr_1[rowIdx + 1].length &&
                            (row[row.length - 1].style.borderBottomRightRadius = '4px');
                    });
                    row[0].style.borderTopLeftRadius = '4px';
                    row[row.length - 1].style.borderTopRightRadius = '4px';
                }
                else if (rowIdx === rowNum_1) {
                    row.forEach(function (r, colIdx) {
                        r.style.borderRadius = '0';
                        colIdx !== 0 && (r.style.borderLeftWidth = '0');
                        r.style.borderTopWidth = '0';
                        row[0].style.borderBottomLeftRadius = '4px';
                        row[row.length - 1].style.borderBottomRightRadius = '4px';
                    });
                }
                else {
                    row.forEach(function (r, colIdx) {
                        r.style.borderRadius = '0';
                        colIdx !== 0 && (r.style.borderLeftWidth = '0');
                        r.style.borderTopWidth = '0';
                        row.length > rowColArr_1[rowIdx + 1].length &&
                            (row[row.length - 1].style.borderBottomRightRadius = '4px');
                    });
                }
            });
        }
    };
    CheckboxesControl.prototype.renderGroup = function (option, index) {
        var _this = this;
        var _a;
        var _b = this.props, cx = _b.classnames, labelField = _b.labelField;
        if (!((_a = option.children) === null || _a === void 0 ? void 0 : _a.length)) {
            return null;
        }
        var children = option.children.map(function (option, index) {
            return _this.renderItem(option, index);
        });
        var body = this.columnsSplit(children);
        return (React__default["default"].createElement("div", { key: 'group-' + index, className: cx('CheckboxesControl-group', option.className) },
            React__default["default"].createElement("label", { className: cx('CheckboxesControl-groupLabel', option.labelClassName) }, option[labelField || 'label']),
            body));
    };
    CheckboxesControl.prototype.renderItem = function (option, index) {
        var _this = this;
        if (option.children) {
            return this.renderGroup(option, index);
        }
        var _a = this.props, render = _a.render, itemClassName = _a.itemClassName, onToggle = _a.onToggle, selectedOptions = _a.selectedOptions, disabled = _a.disabled, inline = _a.inline, labelClassName = _a.labelClassName, labelField = _a.labelField, removable = _a.removable, editable = _a.editable, __ = _a.translate, optionType = _a.optionType, menuTpl = _a.menuTpl, data = _a.data;
        var labelText = String(option[labelField || 'label']);
        var optionLabelClassName = option['labelClassName'];
        return (React__default["default"].createElement(amisUi.Checkbox, { className: itemClassName, key: index, onChange: function () { return onToggle(option); }, checked: !!~selectedOptions.indexOf(option), disabled: disabled || option.disabled, inline: inline, labelClassName: optionLabelClassName || labelClassName, description: option.description, optionType: optionType },
            menuTpl
                ? render("checkboxes/".concat(index), menuTpl, {
                    data: amisCore.createObject(data, option)
                })
                : labelText,
            removable && amisCore.hasAbility(option, 'removable') ? (React__default["default"].createElement("a", { "data-tooltip": __('Select.clear'), "data-position": "left" },
                React__default["default"].createElement(amisUi.Icon, { icon: "minus", className: "icon", onClick: function (e) { return _this.handleDeleteClick(e, option); } }))) : null,
            editable && amisCore.hasAbility(option, 'editable') ? (React__default["default"].createElement("a", { "data-tooltip": "\u7F16\u8F91", "data-position": "left" },
                React__default["default"].createElement(amisUi.Icon, { icon: "pencil", className: "icon", onClick: function (e) { return _this.handleEditClick(e, option); } }))) : null));
    };
    CheckboxesControl.prototype.columnsSplit = function (body) {
        var _a = this.props, columnsCount = _a.columnsCount, cx = _a.classnames;
        var result = [];
        var tmp = [];
        body.forEach(function (node) {
            // 如果有分组，组内单独分列
            if (node && node.key && String(node.key).startsWith('group')) {
                // 夹杂在分组间的无分组选项，分别成块
                if (tmp.length) {
                    result.push(amisCore.columnsSplit(tmp, cx, columnsCount));
                    tmp = [];
                }
                result.push(node);
            }
            else {
                tmp.push(node);
            }
        });
        // 收尾
        tmp.length && result.push(amisCore.columnsSplit(tmp, cx, columnsCount));
        return result;
    };
    CheckboxesControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, disabled = _a.disabled, placeholder = _a.placeholder, options = _a.options, inline = _a.inline; _a.columnsCount; var selectedOptions = _a.selectedOptions; _a.onToggle; var onToggleAll = _a.onToggleAll, checkAll = _a.checkAll, cx = _a.classnames, itemClassName = _a.itemClassName, labelClassName = _a.labelClassName, creatable = _a.creatable, addApi = _a.addApi, createBtnLabel = _a.createBtnLabel, __ = _a.translate, optionType = _a.optionType;
        var body = [];
        if (options && options.length) {
            body = options.map(function (option, key) { return _this.renderItem(option, key); });
        }
        if (checkAll && body.length && optionType === 'default') {
            body.unshift(React__default["default"].createElement(amisUi.Checkbox, { key: "checkall", className: itemClassName, onChange: onToggleAll, checked: !!selectedOptions.length, partial: inRange__default["default"](selectedOptions.length, 0, amisCore.flattenTreeWithLeafNodes(options).length), disabled: disabled, inline: inline, labelClassName: labelClassName }, __('Checkboxes.selectAll')));
        }
        body = this.columnsSplit(body);
        return (React__default["default"].createElement("div", { className: cx("CheckboxesControl", className), ref: "checkboxRef" },
            body && body.length ? (body) : (React__default["default"].createElement("span", { className: "Form-placeholder" }, __(placeholder))),
            (creatable || addApi) && !disabled ? (React__default["default"].createElement("a", { className: cx('Checkboxes-addBtn'), onClick: this.handleAddClick },
                React__default["default"].createElement(amisUi.Icon, { icon: "plus", className: "icon" }),
                __(createBtnLabel))) : null));
    };
    CheckboxesControl.defaultProps = {
        columnsCount: 1,
        multiple: true,
        placeholder: 'placeholder.noOption',
        creatable: false,
        inline: true,
        createBtnLabel: 'Select.createLabel',
        optionType: 'default'
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], CheckboxesControl.prototype, "handleAddClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Event, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], CheckboxesControl.prototype, "handleEditClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Event, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], CheckboxesControl.prototype, "handleDeleteClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], CheckboxesControl.prototype, "updateBorderStyle", null);
    return CheckboxesControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CheckboxesControlRenderer, _super);
    function CheckboxesControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxesControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'checkboxes',
            sizeMutable: false
        })
    ], CheckboxesControlRenderer);
    return CheckboxesControlRenderer;
})(CheckboxesControl));

exports["default"] = CheckboxesControl;
