/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var cloneDeep = require('lodash/cloneDeep');
var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var Sortable = require('sortablejs');
var find = require('lodash/find');
var memoize = require('lodash/memoize');
var mobxStateTree = require('mobx-state-tree');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);
var Sortable__default = /*#__PURE__*/_interopDefaultLegacy(Sortable);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var memoize__default = /*#__PURE__*/_interopDefaultLegacy(memoize);

function pickVars(vars, fields) {
    return fields.reduce(function (data, key) {
        data[key] = amisCore.resolveVariable(key, vars);
        return data;
    }, {});
}
var ComboControl = /** @class */ (function (_super) {
    tslib.__extends(ComboControl, _super);
    function ComboControl(props) {
        var _this = _super.call(this, props) || this;
        _this.subForms = [];
        _this.subFormDefaultValues = [];
        _this.keys = [];
        _this.toDispose = [];
        _this.id = amisCore.guid();
        _this.refsMap = {};
        _this.makeFormRef = memoize__default["default"](function (index) { return function (ref) { return _this.formRef(ref, index); }; });
        _this.memoizedFormatValue = memoize__default["default"](function (strictMode, syncFields, value, index, data) {
            return amisCore.createObject(amisCore.extendObject(data, tslib.__assign({ index: index, __index: index }, data)), tslib.__assign(tslib.__assign({}, value), (Array.isArray(syncFields) ? pickVars(data, syncFields) : null)));
        }, function (strictMode, syncFields, value, index, data) {
            return Array.isArray(syncFields)
                ? JSON.stringify([value, index, data, pickVars(data, syncFields)])
                : strictMode
                    ? JSON.stringify([value, index])
                    : JSON.stringify([value, index, data]);
        });
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSingleFormChange = _this.handleSingleFormChange.bind(_this);
        _this.handleSingleFormInit = _this.handleSingleFormInit.bind(_this);
        _this.handleFormInit = _this.handleFormInit.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.addItem = _this.addItem.bind(_this);
        _this.deleteItem = _this.deleteItem.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.flush = _this.flush.bind(_this);
        _this.handleComboTypeChange = _this.handleComboTypeChange.bind(_this);
        _this.defaultValue = tslib.__assign({}, props.scaffold);
        var store = props.store; props.value; var multiple = props.multiple, minLength = props.minLength, maxLength = props.maxLength, formItem = props.formItem, addHook = props.addHook;
        store.config({
            multiple: multiple,
            minLength: minLength,
            maxLength: maxLength,
            length: _this.getValueAsArray(props).length
        });
        formItem && mobxStateTree.isAlive(formItem) && formItem.setSubStore(store);
        addHook && _this.toDispose.push(addHook(_this.flush, 'flush'));
        return _this;
    }
    ComboControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (amisCore.anyChanged(['minLength', 'maxLength', 'value'], prevProps, props)) {
            var store = props.store, minLength = props.minLength, maxLength = props.maxLength, multiple = props.multiple;
            var values_1 = this.getValueAsArray(props);
            store.config({
                multiple: multiple,
                minLength: minLength,
                maxLength: maxLength,
                length: values_1.length
            });
            if (store.activeKey >= values_1.length) {
                store.setActiveKey(Math.max(0, values_1.length - 1));
            }
            // combo 进来了新的值，且这次 form 初始化时带来的新值变化，但是之前的值已经 onInit 过了
            // 所以，之前 onInit 设置进去的初始值是过时了的。这个时候修复一下。
            if (props.value !== prevProps.value &&
                !prevProps.formInited &&
                this.subFormDefaultValues.length) {
                this.subFormDefaultValues = this.subFormDefaultValues.map(function (item, index) {
                    return tslib.__assign(tslib.__assign({}, item), { values: values_1[index] });
                });
            }
        }
    };
    ComboControl.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d;
        var formItem = this.props.formItem;
        formItem && mobxStateTree.isAlive(formItem) && formItem.setSubStore(null);
        this.toDispose.forEach(function (fn) { return fn(); });
        this.toDispose = [];
        (_b = (_a = this.memoizedFormatValue.cache).clear) === null || _b === void 0 ? void 0 : _b.call(_a);
        (_d = (_c = this.makeFormRef.cache).clear) === null || _d === void 0 ? void 0 : _d.call(_c);
    };
    ComboControl.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    ComboControl.prototype.getValueAsArray = function (props) {
        if (props === void 0) { props = this.props; }
        var flat = props.flat, joinValues = props.joinValues, delimiter = props.delimiter; props.type;
        var value = props.value;
        if (joinValues && flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }
        else if (!Array.isArray(value)) {
            value = [];
        }
        else {
            value = value.concat();
        }
        return value;
    };
    ComboControl.prototype.addItemWith = function (condition) {
        var _a = this.props, flat = _a.flat, joinValues = _a.joinValues, addattop = _a.addattop, delimiter = _a.delimiter, scaffold = _a.scaffold, disabled = _a.disabled, submitOnChange = _a.submitOnChange;
        if (disabled) {
            return;
        }
        var value = this.getValueAsArray();
        value.push(flat
            ? condition.scaffold || scaffold || ''
            : tslib.__assign({}, (condition.scaffold || scaffold)));
        this.keys.push(amisCore.guid());
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        if (addattop === true) {
            value.unshift(value.pop());
        }
        this.props.onChange(value, submitOnChange, true);
    };
    ComboControl.prototype.addItem = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, flat, joinValues, addattop, delimiter, scaffold, disabled, submitOnChange, data, dispatchEvent, value, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, flat = _a.flat, joinValues = _a.joinValues, addattop = _a.addattop, delimiter = _a.delimiter, scaffold = _a.scaffold, disabled = _a.disabled, submitOnChange = _a.submitOnChange, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        if (disabled) {
                            return [2 /*return*/];
                        }
                        value = this.getValueAsArray();
                        return [4 /*yield*/, dispatchEvent('add', amisCore.createObject(data, {
                                value: flat && joinValues ? value.join(delimiter || ',') : cloneDeep__default["default"](value)
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        value.push(flat
                            ? scaffold || ''
                            : tslib.__assign({}, scaffold));
                        this.keys.push(amisCore.guid());
                        if (flat && joinValues) {
                            value = value.join(delimiter || ',');
                        }
                        if (addattop === true) {
                            value.unshift(value.pop());
                        }
                        this.props.onChange(value, submitOnChange, true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ComboControl.prototype.deleteItem = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, flat, joinValues, delimiter, disabled, deleteApi, deleteConfirmText, data, env, __, dispatchEvent, value, ctx, rendererEvent, confirmed, result;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, flat = _a.flat, joinValues = _a.joinValues, delimiter = _a.delimiter, disabled = _a.disabled, deleteApi = _a.deleteApi, deleteConfirmText = _a.deleteConfirmText, data = _a.data, env = _a.env, __ = _a.translate, dispatchEvent = _a.dispatchEvent;
                        if (disabled) {
                            return [2 /*return*/];
                        }
                        value = this.getValueAsArray();
                        ctx = amisCore.createObject(data, value[key]);
                        return [4 /*yield*/, dispatchEvent('delete', amisCore.createObject(data, {
                                key: key,
                                value: flat && joinValues ? value.join(delimiter || ',') : cloneDeep__default["default"](value)
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        if (!amisCore.isEffectiveApi(deleteApi, ctx)) return [3 /*break*/, 4];
                        return [4 /*yield*/, env.confirm(deleteConfirmText ? amisCore.filter(deleteConfirmText, ctx) : __('deleteConfirm'))];
                    case 2:
                        confirmed = _b.sent();
                        if (!confirmed) {
                            // 如果不确认，则跳过！
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, env.fetcher(deleteApi, ctx)];
                    case 3:
                        result = _b.sent();
                        if (!result.ok) {
                            env.notify('error', __('deleteFailed'));
                            return [2 /*return*/];
                        }
                        _b.label = 4;
                    case 4:
                        value.splice(key, 1);
                        this.keys.splice(key, 1);
                        if (flat && joinValues) {
                            value = value.join(delimiter || ',');
                        }
                        this.props.onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    ComboControl.prototype.handleChange = function (values, diff, _a) {
        var index = _a.index;
        var _b = this.props, flat = _b.flat, store = _b.store, joinValues = _b.joinValues, delimiter = _b.delimiter, disabled = _b.disabled, submitOnChange = _b.submitOnChange, type = _b.type;
        if (disabled) {
            return;
        }
        var value = this.getValueAsArray();
        value[index] = flat ? values.flat : tslib.__assign({}, values);
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        if (type === 'input-kv') {
            var hasDuplicateKey = false;
            var keys = {};
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var item = value_1[_i];
                if (keys[item.key]) {
                    hasDuplicateKey = true;
                }
                else {
                    keys[item.key] = true;
                }
            }
            // 有重复值就不触发修改，因为 KV 模式下无法支持重复值
            if (!hasDuplicateKey) {
                this.props.onChange(value, submitOnChange, true);
            }
        }
        else if (type === 'input-kvs') {
            // input-kvs 为了避免冲突 key 改成了 _key
            var hasDuplicateKey = false;
            var keys = {};
            for (var _c = 0, value_2 = value; _c < value_2.length; _c++) {
                var item = value_2[_c];
                if ('_key' in item) {
                    if (keys[item._key]) {
                        hasDuplicateKey = true;
                    }
                    else {
                        keys[item._key] = true;
                    }
                }
            }
            // 有重复值就不触发修改，因为 KV 模式下无法支持重复值
            if (!hasDuplicateKey) {
                this.props.onChange(value, submitOnChange, true);
            }
        }
        else {
            this.props.onChange(value, submitOnChange, true);
        }
        store.forms.forEach(function (form) {
            return mobxStateTree.isAlive(form) &&
                form.items.forEach(function (item) { return item.unique && item.syncOptions(undefined, form.data); });
        });
    };
    ComboControl.prototype.handleSingleFormChange = function (values) {
        this.props.onChange(tslib.__assign({}, values), this.props.submitOnChange, true);
    };
    ComboControl.prototype.handleFormInit = function (values, _a) {
        var index = _a.index;
        var _b = this.props, syncDefaultValue = _b.syncDefaultValue, flat = _b.flat, joinValues = _b.joinValues, delimiter = _b.delimiter, formInited = _b.formInited, onChange = _b.onChange, submitOnChange = _b.submitOnChange, setPrinstineValue = _b.setPrinstineValue;
        this.subFormDefaultValues.push({
            index: index,
            values: values,
            setted: false
        });
        if (syncDefaultValue === false ||
            this.subFormDefaultValues.length !==
                this.subForms.filter(function (item) { return item !== undefined; }).length) {
            return;
        }
        var value = this.getValueAsArray();
        var isModified = false;
        this.subFormDefaultValues = this.subFormDefaultValues.map(function (_a) {
            var index = _a.index, values = _a.values, setted = _a.setted;
            var newValue = flat ? values.flat : tslib.__assign({}, values);
            if (!setted && amisCore.isObjectShallowModified(value[index], newValue)) {
                value[index] = flat ? values.flat : tslib.__assign({}, values);
                isModified = true;
            }
            return {
                index: index,
                values: values,
                setted: true
            };
        });
        if (!isModified) {
            return;
        }
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        formInited
            ? onChange(value, submitOnChange, true)
            : setPrinstineValue(value);
    };
    ComboControl.prototype.handleSingleFormInit = function (values) {
        var _a = this.props, syncDefaultValue = _a.syncDefaultValue, setPrinstineValue = _a.setPrinstineValue, value = _a.value, nullable = _a.nullable;
        if (syncDefaultValue !== false &&
            !nullable &&
            amisCore.isObjectShallowModified(value, values)) {
            setPrinstineValue(tslib.__assign({}, values));
        }
    };
    ComboControl.prototype.handleAction = function (e, action) {
        var onAction = this.props.onAction;
        if (action.actionType === 'delete') {
            action.index !== void 0 && this.deleteItem(action.index);
            return;
        }
        onAction && onAction.apply(null, arguments);
    };
    ComboControl.prototype.validate = function () {
        var _a = this.props, minLength = _a.minLength, maxLength = _a.maxLength, messages = _a.messages, nullable = _a.nullable, __ = _a.translate;
        var value = this.getValueAsArray();
        if (minLength && (!Array.isArray(value) || value.length < minLength)) {
            return __((messages && messages.minLengthValidateFailed) || 'Combo.minLength', { minLength: minLength });
        }
        else if (maxLength && Array.isArray(value) && value.length > maxLength) {
            return __((messages && messages.maxLengthValidateFailed) || 'Combo.maxLength', { maxLength: maxLength });
        }
        else if (this.subForms.length && (!nullable || value)) {
            return Promise.all(this.subForms.map(function (item) { return item.validate(); })).then(function (values) {
                if (~values.indexOf(false)) {
                    return __((messages && messages.validateFailed) || 'validateFailed');
                }
                return;
            });
        }
    };
    ComboControl.prototype.flush = function () {
        this.subForms.forEach(function (form) { return form.flush(); });
    };
    ComboControl.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    ComboControl.prototype.initDragging = function () {
        var _this = this;
        var ns = this.props.classPrefix;
        var submitOnChange = this.props.submitOnChange;
        var dom = ReactDOM.findDOMNode(this);
        this.sortable = new Sortable__default["default"](dom.querySelector(".".concat(ns, "Combo-items")), {
            group: "combo-".concat(this.id),
            animation: 150,
            handle: ".".concat(ns, "Combo-itemDrager"),
            ghostClass: "".concat(ns, "Combo-item--dragging"),
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                // 换回来
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                var value = _this.props.value;
                if (!Array.isArray(value)) {
                    return;
                }
                var newValue = value.concat();
                newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
                _this.keys.splice(e.newIndex, 0, _this.keys.splice(e.oldIndex, 1)[0]);
                _this.props.onChange(newValue, submitOnChange, true);
            }
        });
    };
    ComboControl.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    ComboControl.prototype.formRef = function (ref, index) {
        if (index === void 0) { index = 0; }
        if (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.subForms[index] = ref;
            this.refsMap[index] = ref;
        }
        else {
            var form_1 = this.refsMap[index];
            this.subForms = this.subForms.filter(function (item) { return item !== form_1; });
            this.subFormDefaultValues = this.subFormDefaultValues.filter(function (_a) {
                var dIndex = _a.index;
                return dIndex !== index;
            });
            delete this.refsMap[index];
        }
    };
    ComboControl.prototype.formatValue = function (value, index) {
        if (index === void 0) { index = -1; }
        var _a = this.props, flat = _a.flat, data = _a.data, strictMode = _a.strictMode, syncFields = _a.syncFields;
        if (flat) {
            value = {
                flat: value
            };
        }
        value = value || this.defaultValue;
        return this.memoizedFormatValue(strictMode !== false, syncFields, value, index, data);
    };
    ComboControl.prototype.pickCondition = function (value) {
        var conditions = this.props.conditions;
        return find__default["default"](conditions, function (item) { return item.test && amisCore.evalExpression(item.test, value); });
    };
    ComboControl.prototype.handleComboTypeChange = function (index, selection) {
        var _a = this.props, multiple = _a.multiple, onChange = _a.onChange, value = _a.value; _a.flat; var submitOnChange = _a.submitOnChange;
        var conditions = this.props
            .conditions;
        var condition = find__default["default"](conditions, function (item) { return item.label === selection.label; });
        if (!condition) {
            return;
        }
        if (multiple) {
            var newValue = this.getValueAsArray();
            newValue.splice(index, 1, tslib.__assign({}, amisCore.dataMapping(condition.scaffold || {}, newValue[index])));
            // todo 支持 flat
            onChange(newValue, submitOnChange, true);
        }
        else {
            onChange(tslib.__assign({}, amisCore.dataMapping(condition.scaffold || {}, value)), submitOnChange, true);
        }
    };
    ComboControl.prototype.handleTabSelect = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, store, data, dispatchEvent, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        return [4 /*yield*/, dispatchEvent('tabsChange', amisCore.createObject(data, {
                                key: key
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        store.setActiveKey(key);
                        return [2 /*return*/];
                }
            });
        });
    };
    ComboControl.prototype.setNull = function (e) {
        e.preventDefault();
        var onChange = this.props.onChange;
        onChange(null);
        Array.isArray(this.subForms) &&
            this.subForms.forEach(function (subForm) {
                subForm.clearErrors();
            });
    };
    ComboControl.prototype.renderPlaceholder = function () {
        var _a = this.props, placeholder = _a.placeholder, __ = _a.translate;
        return (React__default["default"].createElement("span", { className: "text-muted" }, __(placeholder || 'placeholder.noData')));
    };
    ComboControl.prototype.renderTabsMode = function () {
        var _this = this;
        var _a = this.props; _a.classPrefix; var cx = _a.classnames, tabsStyle = _a.tabsStyle, formClassName = _a.formClassName, render = _a.render, disabled = _a.disabled, store = _a.store, flat = _a.flat, subFormMode = _a.subFormMode; _a.addButtonText; _a.addable; var removable = _a.removable, typeSwitchable = _a.typeSwitchable, itemRemovableOn = _a.itemRemovableOn, delimiter = _a.delimiter, canAccessSuperData = _a.canAccessSuperData; _a.addIcon; var deleteIcon = _a.deleteIcon, tabsLabelTpl = _a.tabsLabelTpl, conditions = _a.conditions, changeImmediately = _a.changeImmediately, addBtnText = _a.addBtnText, __ = _a.translate;
        var items = this.props.items;
        var value = this.props.value;
        if (flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }
        var finnalRemovable = store.removable !== false && // minLength ?
            !disabled && // 控件自身是否禁用
            removable !== false; // 是否可以删除
        if (!Array.isArray(value)) {
            value = []; // 让 tabs 输出，否则会没有新增按钮。
        }
        // todo 支持拖拽排序。
        return (React__default["default"].createElement(amisUi.Tabs, { addBtnText: __(addBtnText || 'add'), className: 'ComboTabs', mode: tabsStyle, activeKey: store.activeKey, onSelect: this.handleTabSelect, additionBtns: !disabled ? (React__default["default"].createElement("li", { className: cx("Tabs-link ComboTabs-addLink") }, this.renderAddBtn())) : null }, value.map(function (value, index) {
            var data = _this.formatValue(value, index);
            var condition = null;
            var toolbar = undefined;
            if (finnalRemovable && // 表达式判断单条是否可删除
                (!itemRemovableOn ||
                    amisCore.evalExpression(itemRemovableOn, value) !== false)) {
                toolbar = (React__default["default"].createElement("div", { onClick: _this.deleteItem.bind(_this, index), key: "delete", className: cx("Combo-tab-delBtn ".concat(!store.removable ? 'is-disabled' : '')), "data-tooltip": __('delete'), "data-position": "bottom" }, deleteIcon ? (React__default["default"].createElement("i", { className: deleteIcon })) : (React__default["default"].createElement(amisUi.Icon, { icon: "status-close", className: "icon" }))));
            }
            if (Array.isArray(conditions) && conditions.length) {
                condition = _this.pickCondition(data);
                items = condition ? condition.items : undefined;
            }
            var finnalControls = flat && items
                ? [
                    tslib.__assign(tslib.__assign({}, (items && items[0])), { name: 'flat' })
                ]
                : items;
            var hasUnique = Array.isArray(finnalControls) &&
                finnalControls.some(function (item) { return item.unique; });
            return (React__default["default"].createElement(amisUi.Tab, { title: amisCore.filter(tabsLabelTpl ||
                    __('{{index}}', { index: data.index + 1 }), data), key: _this.keys[index] || (_this.keys[index] = amisCore.guid()), toolbar: toolbar, eventKey: index, 
                // 不能按需渲染，因为 unique 会失效。
                mountOnEnter: !hasUnique, unmountOnExit: false },
                condition && typeSwitchable !== false ? (React__default["default"].createElement("div", { className: cx('Combo-itemTag') },
                    React__default["default"].createElement("label", null, __('Combo.type')),
                    React__default["default"].createElement(amisUi.Select, { onChange: _this.handleComboTypeChange.bind(_this, index), options: conditions.map(function (item) { return ({
                            label: item.label,
                            value: item.label
                        }); }), value: condition.label, clearable: false }))) : null,
                React__default["default"].createElement("div", { className: cx("Combo-itemInner") }, finnalControls ? (render("multiple/".concat(index), {
                    type: 'form',
                    body: finnalControls,
                    wrapperComponent: 'div',
                    wrapWithPanel: false,
                    mode: subFormMode,
                    className: cx("Combo-form", formClassName)
                }, {
                    index: index,
                    disabled: disabled,
                    data: data,
                    onChange: _this.handleChange,
                    onInit: _this.handleFormInit,
                    onAction: _this.handleAction,
                    ref: _this.makeFormRef(index),
                    canAccessSuperData: canAccessSuperData,
                    lazyChange: changeImmediately ? false : true,
                    formLazyChange: false,
                    value: undefined,
                    formItemValue: undefined,
                    formStore: undefined
                })) : (React__default["default"].createElement(amisUi.Alert2, { level: "warning", className: "m-b-none" }, __('Combo.invalidData'))))));
        })));
    };
    ComboControl.prototype.renderDelBtn = function (value, index) {
        var _this = this;
        var _a = this.props; _a.classPrefix; var cx = _a.classnames, render = _a.render, store = _a.store, deleteIcon = _a.deleteIcon, __ = _a.translate, itemRemovableOn = _a.itemRemovableOn, disabled = _a.disabled, removable = _a.removable, deleteBtn = _a.deleteBtn;
        var finnalRemovable = store.removable !== false && // minLength ?
            !disabled && // 控件自身是否禁用
            removable !== false; // 是否可以删除
        if (!(finnalRemovable && // 表达式判断单条是否可删除
            (!itemRemovableOn || amisCore.evalExpression(itemRemovableOn, value) !== false))) {
            // 不符合删除条件，则不渲染删除按钮
            return null;
        }
        // deleteBtn是对象，则根据自定义配置渲染按钮
        if (amisCore.isObject(deleteBtn)) {
            return render('delete-btn', tslib.__assign(tslib.__assign({}, deleteBtn), { type: 'button', className: cx('Combo-delController', deleteBtn ? deleteBtn.className : ''), onClick: function (e) {
                    if (!deleteBtn.onClick) {
                        _this.deleteItem(index);
                        return;
                    }
                    var originClickHandler = deleteBtn.onClick;
                    if (typeof originClickHandler === 'string') {
                        originClickHandler = amisCore.str2AsyncFunction(deleteBtn.onClick, 'e', 'index', 'props');
                    }
                    var result = originClickHandler(e, index, _this.props);
                    if (result && result.then) {
                        result.then(function () {
                            _this.deleteItem(index);
                        });
                    }
                    else {
                        _this.deleteItem(index);
                    }
                } }));
        }
        // deleteBtn是string，则渲染按钮文本
        if (typeof deleteBtn === 'string') {
            return render('delete-btn', {
                type: 'button',
                className: cx('Combo-delController'),
                label: deleteBtn,
                onClick: this.deleteItem.bind(this, index)
            });
        }
        // 如果上述按钮不满足，则渲染默认按钮
        return (React__default["default"].createElement("a", { onClick: this.deleteItem.bind(this, index), key: "delete", className: cx("Combo-delBtn ".concat(!store.removable ? 'is-disabled' : '')), "data-tooltip": __('delete'), "data-position": "bottom" }, deleteIcon ? (React__default["default"].createElement("i", { className: deleteIcon })) : (React__default["default"].createElement(amisUi.Icon, { icon: "status-close", className: "icon" }))));
    };
    ComboControl.prototype.renderAddBtn = function () {
        var _this = this;
        var _a = this.props; _a.classPrefix; var cx = _a.classnames, render = _a.render, addButtonClassName = _a.addButtonClassName, store = _a.store, addButtonText = _a.addButtonText, addBtn = _a.addBtn, addable = _a.addable, addIcon = _a.addIcon, conditions = _a.conditions, __ = _a.translate, tabsMode = _a.tabsMode;
        var hasConditions = Array.isArray(conditions) && conditions.length;
        return (React__default["default"].createElement(React__default["default"].Fragment, null, store.addable &&
            addable !== false &&
            (hasConditions ? (render('add-button', {
                type: 'dropdown-button',
                icon: addIcon ? React__default["default"].createElement(amisUi.Icon, { icon: "plus", className: "icon" }) : '',
                label: __(addButtonText || 'Combo.add'),
                level: 'info',
                size: 'sm',
                closeOnClick: true
            }, {
                buttons: conditions === null || conditions === void 0 ? void 0 : conditions.map(function (item) { return ({
                    label: item.label,
                    onClick: function (e) {
                        _this.addItemWith(item);
                        return false;
                    }
                }); })
            })) : tabsMode ? (React__default["default"].createElement("a", { onClick: this.addItem },
                addIcon ? React__default["default"].createElement(amisUi.Icon, { icon: "plus", className: "icon" }) : null,
                React__default["default"].createElement("span", null, __(addButtonText || 'Combo.add')))) : amisCore.isObject(addBtn) ? (render('add-button', tslib.__assign(tslib.__assign({}, addBtn), { type: 'button', onClick: function () { return _this.addItem(); } }))) : (React__default["default"].createElement(amisUi.Button, { className: cx("Combo-addBtn", addButtonClassName), onClick: this.addItem },
                addIcon ? React__default["default"].createElement(amisUi.Icon, { icon: "plus", className: "icon" }) : null,
                React__default["default"].createElement("span", null, __(addButtonText || 'Combo.add')))))));
    };
    ComboControl.prototype.renderMultipe = function () {
        var _this = this;
        if (this.props.tabsMode) {
            return this.renderTabsMode();
        }
        var _a = this.props; _a.classPrefix; var cx = _a.classnames, formClassName = _a.formClassName, render = _a.render, multiLine = _a.multiLine; _a.addButtonClassName; var disabled = _a.disabled; _a.store; var flat = _a.flat, subFormMode = _a.subFormMode, draggable = _a.draggable, draggableTip = _a.draggableTip; _a.addButtonText; _a.addable; _a.removable; var typeSwitchable = _a.typeSwitchable, delimiter = _a.delimiter, canAccessSuperData = _a.canAccessSuperData; _a.addIcon; var dragIcon = _a.dragIcon, noBorder = _a.noBorder, conditions = _a.conditions, lazyLoad = _a.lazyLoad, changeImmediately = _a.changeImmediately, placeholder = _a.placeholder, __ = _a.translate, itemClassName = _a.itemClassName, itemsWrapperClassName = _a.itemsWrapperClassName;
        var items = this.props.items;
        var value = this.props.value;
        if (flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }
        return (React__default["default"].createElement("div", { className: cx("Combo Combo--multi", multiLine ? "Combo--ver" : "Combo--hor", noBorder ? "Combo--noBorder" : '', disabled ? 'is-disabled' : '', !disabled && draggable && Array.isArray(value) && value.length > 1
                ? 'is-draggable'
                : '') },
            React__default["default"].createElement("div", { className: cx("Combo-items", itemsWrapperClassName) }, Array.isArray(value) && value.length ? (value.map(function (value, index, thelist) {
                var delBtn = _this.renderDelBtn(value, index);
                var data = _this.formatValue(value, index);
                var condition = null;
                if (Array.isArray(conditions) && conditions.length) {
                    condition = _this.pickCondition(data);
                    items = condition ? condition.items : undefined;
                }
                var finnalControls = flat && items
                    ? [
                        tslib.__assign(tslib.__assign({}, (items && items[0])), { name: 'flat' })
                    ]
                    : items;
                return (React__default["default"].createElement("div", { className: cx("Combo-item", itemClassName), key: _this.keys[index] || (_this.keys[index] = amisCore.guid()) },
                    !disabled && draggable && thelist.length > 1 ? (React__default["default"].createElement("div", { className: cx('Combo-itemDrager') },
                        React__default["default"].createElement("a", { key: "drag", "data-tooltip": __('Combo.dragDropSort'), "data-position": "bottom" }, dragIcon ? (React__default["default"].createElement("i", { className: dragIcon })) : (React__default["default"].createElement(amisUi.Icon, { icon: "drag-bar", className: "icon" }))))) : null,
                    condition && typeSwitchable !== false ? (React__default["default"].createElement("div", { className: cx('Combo-itemTag') },
                        React__default["default"].createElement("label", null, __('Combo.type')),
                        React__default["default"].createElement(amisUi.Select, { onChange: _this.handleComboTypeChange.bind(_this, index), options: conditions.map(function (item) { return ({
                                label: item.label,
                                value: item.label
                            }); }), value: condition.label, clearable: false }))) : null,
                    React__default["default"].createElement("div", { className: cx("Combo-itemInner") }, finnalControls ? (render("multiple/".concat(index), {
                        type: 'form',
                        body: finnalControls,
                        wrapperComponent: 'div',
                        wrapWithPanel: false,
                        mode: multiLine ? subFormMode : 'row',
                        className: cx("Combo-form", formClassName)
                    }, {
                        index: index,
                        disabled: disabled,
                        data: data,
                        onChange: _this.handleChange,
                        onInit: _this.handleFormInit,
                        onAction: _this.handleAction,
                        ref: _this.makeFormRef(index),
                        lazyChange: changeImmediately ? false : true,
                        formLazyChange: false,
                        lazyLoad: lazyLoad,
                        canAccessSuperData: canAccessSuperData,
                        value: undefined,
                        formItemValue: undefined,
                        formStore: undefined
                    })) : (React__default["default"].createElement(amisUi.Alert2, { level: "warning", className: "m-b-none" }, __('Combo.invalidData')))),
                    delBtn));
            })) : placeholder ? (React__default["default"].createElement("div", { className: cx("Combo-placeholder") }, __(placeholder))) : null),
            !disabled ? (React__default["default"].createElement("div", { className: cx("Combo-toolbar") },
                this.renderAddBtn(),
                draggable ? (React__default["default"].createElement("span", { className: cx("Combo-dragableTip"), ref: this.dragTipRef }, Array.isArray(value) && value.length > 1
                    ? __(draggableTip)
                    : '')) : null)) : null));
    };
    ComboControl.prototype.renderSingle = function () {
        var _a = this.props, conditions = _a.conditions, cx = _a.classnames, render = _a.render, value = _a.value, multiLine = _a.multiLine, formClassName = _a.formClassName, canAccessSuperData = _a.canAccessSuperData, noBorder = _a.noBorder, disabled = _a.disabled, typeSwitchable = _a.typeSwitchable, nullable = _a.nullable, __ = _a.translate, itemClassName = _a.itemClassName;
        var items = this.props.items;
        var data = amisCore.isObject(value) ? this.formatValue(value) : this.defaultValue;
        var condition = null;
        if (Array.isArray(conditions) && conditions.length) {
            condition = this.pickCondition(data);
            items = condition ? condition.items : undefined;
        }
        return (React__default["default"].createElement("div", { className: cx("Combo Combo--single", multiLine ? "Combo--ver" : "Combo--hor", noBorder ? "Combo--noBorder" : '', disabled ? 'is-disabled' : '') },
            React__default["default"].createElement("div", { className: cx("Combo-item", itemClassName) },
                condition && typeSwitchable !== false ? (React__default["default"].createElement("div", { className: cx('Combo-itemTag') },
                    React__default["default"].createElement("label", null, __('Combo.type')),
                    React__default["default"].createElement(amisUi.Select, { onChange: this.handleComboTypeChange.bind(this, 0), options: conditions.map(function (item) { return ({
                            label: item.label,
                            value: item.label
                        }); }), value: condition.label, clearable: false }))) : null,
                React__default["default"].createElement("div", { className: cx("Combo-itemInner") }, items ? (render('single', {
                    type: 'form',
                    body: items,
                    wrapperComponent: 'div',
                    wrapWithPanel: false,
                    mode: multiLine ? 'normal' : 'row',
                    className: cx("Combo-form", formClassName)
                }, {
                    disabled: disabled,
                    data: data,
                    onChange: this.handleSingleFormChange,
                    ref: this.makeFormRef(0),
                    onInit: this.handleSingleFormInit,
                    canAccessSuperData: canAccessSuperData,
                    formStore: undefined
                })) : (React__default["default"].createElement(amisUi.Alert2, { level: "warning", className: "m-b-none" }, __('Combo.invalidData'))))),
            value && nullable ? (React__default["default"].createElement("a", { className: cx('Combo-setNullBtn'), href: "#", onClick: this.setNull }, __('clear'))) : null));
    };
    ComboControl.prototype.render = function () {
        var _a = this.props, formInited = _a.formInited, multiple = _a.multiple, className = _a.className; _a.classPrefix; var cx = _a.classnames; _a.disabled;
        return formInited || typeof formInited === 'undefined' ? (React__default["default"].createElement("div", { className: cx("ComboControl", className) }, multiple ? this.renderMultipe() : this.renderSingle())) : null;
    };
    ComboControl.defaultProps = {
        minLength: 0,
        maxLength: 0,
        multiple: false,
        multiLine: false,
        addButtonClassName: '',
        formClassName: '',
        subFormMode: 'normal',
        draggableTip: '',
        addButtonText: 'add',
        canAccessSuperData: false,
        addIcon: true,
        dragIcon: '',
        deleteIcon: '',
        tabsMode: false,
        tabsStyle: '',
        placeholder: 'placeholder.empty',
        itemClassName: '',
        itemsWrapperClassName: ''
    };
    ComboControl.propsList = [
        'minLength',
        'maxLength',
        'multiple',
        'multiLine',
        'addButtonClassName',
        'subFormMode',
        'draggableTip',
        'addButtonText',
        'draggable',
        'scaffold',
        'canAccessSuperData',
        'addIcon',
        'dragIcon',
        'deleteIcon',
        'noBorder',
        'conditions',
        'tabsMode',
        'tabsStyle',
        'lazyLoad',
        'changeImmediately',
        'strictMode',
        'items',
        'conditions',
        'messages',
        'formStore',
        'itemClassName',
        'itemsWrapperClassName'
    ];
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Number]),
        tslib.__metadata("design:returntype", Promise)
    ], ComboControl.prototype, "handleTabSelect", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], ComboControl.prototype, "setNull", null);
    return ComboControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(ComboControlRenderer, _super);
    function ComboControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 支持更新指定索引的值
    ComboControlRenderer.prototype.setData = function (value, index) {
        var _a = this.props, multiple = _a.multiple, onChange = _a.onChange, submitOnChange = _a.submitOnChange;
        if (multiple) {
            if (index !== undefined && ~index) {
                var newValue = tslib.__spreadArray([], this.getValueAsArray(), true);
                newValue.splice(index, 1, tslib.__assign(tslib.__assign({}, newValue[index]), value));
                onChange === null || onChange === void 0 ? void 0 : onChange(newValue, submitOnChange, true);
            }
            else {
                onChange === null || onChange === void 0 ? void 0 : onChange(value, submitOnChange, true);
            }
        }
        else {
            onChange === null || onChange === void 0 ? void 0 : onChange(value, submitOnChange, true);
        }
    };
    ComboControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'combo',
            storeType: amisCore.ComboStore.name,
            extendsData: false
        })
    ], ComboControlRenderer);
    return ComboControlRenderer;
})(ComboControl));
/** @class */ ((function (_super) {
    tslib.__extends(KVControlRenderer, _super);
    function KVControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KVControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-kv',
            storeType: amisCore.ComboStore.name,
            extendsData: false
        })
    ], KVControlRenderer);
    return KVControlRenderer;
})(ComboControl));
/** @class */ ((function (_super) {
    tslib.__extends(KVSControlRenderer, _super);
    function KVSControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KVSControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-kvs',
            storeType: amisCore.ComboStore.name,
            extendsData: false
        })
    ], KVSControlRenderer);
    return KVSControlRenderer;
})(ComboControl));

exports["default"] = ComboControl;
