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
var matchSorter = require('match-sorter');
var debouce = require('lodash/debounce');
var find = require('lodash/find');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debouce__default = /*#__PURE__*/_interopDefaultLegacy(debouce);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var TreeSelectControl = /** @class */ (function (_super) {
    tslib.__extends(TreeSelectControl, _super);
    function TreeSelectControl(props) {
        var _this = _super.call(this, props) || this;
        _this.container = React__default["default"].createRef();
        _this.input = React__default["default"].createRef();
        _this.cache = {};
        _this.targetRef = function (ref) {
            return (_this.target = ref ? ReactDOM.findDOMNode(ref) : null);
        };
        _this.state = {
            inputValue: '',
            isOpened: false
        };
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
        _this.handleInputChange = debouce__default["default"](_this.handleInputChange.bind(_this), 150, {
            trailing: true,
            leading: false
        });
        _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
        _this.loadRemote = debouce__default["default"](_this.loadRemote.bind(_this), 250, {
            trailing: true,
            leading: false
        });
        return _this;
    }
    TreeSelectControl.prototype.componentDidMount = function () {
        this.loadRemote('');
    };
    TreeSelectControl.prototype.open = function (fn) {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            isOpened: true
        }, fn);
    };
    TreeSelectControl.prototype.close = function () {
        var _this = this;
        this.setState({
            isOpened: false,
            inputValue: this.props.multiple ? this.state.inputValue : ''
        }, function () { return _this.loadRemote(_this.state.inputValue); });
    };
    TreeSelectControl.prototype.handleFocus = function (e) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, value = _a.value, data = _a.data;
        dispatchEvent('focus', amisCore.createObject(data, {
            value: value
        }));
    };
    TreeSelectControl.prototype.handleBlur = function (e) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, value = _a.value, data = _a.data;
        dispatchEvent('blur', amisCore.createObject(data, {
            value: value
        }));
    };
    TreeSelectControl.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleOutClick(e);
            e.preventDefault();
        }
    };
    TreeSelectControl.prototype.validate = function () {
        var _a = this.props, value = _a.value, minLength = _a.minLength, maxLength = _a.maxLength, delimiter = _a.delimiter;
        var curValue = Array.isArray(value)
            ? value
            : (value ? String(value) : '').split(delimiter || ',');
        if (minLength && curValue.length < minLength) {
            return "\u5DF2\u9009\u62E9\u6570\u91CF\u4F4E\u4E8E\u8BBE\u5B9A\u7684\u6700\u5C0F\u4E2A\u6570".concat(minLength, "\uFF0C\u8BF7\u9009\u62E9\u66F4\u591A\u7684\u9009\u9879\u3002");
        }
        else if (maxLength && curValue.length > maxLength) {
            return "\u5DF2\u9009\u62E9\u6570\u91CF\u8D85\u51FA\u8BBE\u5B9A\u7684\u6700\u5927\u4E2A\u6570".concat(maxLength, "\uFF0C\u8BF7\u53D6\u6D88\u9009\u62E9\u8D85\u51FA\u7684\u9009\u9879\u3002");
        }
    };
    TreeSelectControl.prototype.removeItem = function (index, e) {
        var _a = this.props, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, onChange = _a.onChange, disabled = _a.disabled;
        e && e.stopPropagation();
        if (disabled) {
            return;
        }
        var items = selectedOptions.concat();
        items.splice(index, 1);
        var value = items;
        if (joinValues) {
            value = items
                .map(function (item) { return item[valueField || 'value']; })
                .join(delimiter || ',');
        }
        else if (extractValue) {
            value = items.map(function (item) { return item[valueField || 'value']; });
        }
        onChange(value);
    };
    TreeSelectControl.prototype.handleChange = function (value) {
        var _this = this;
        var multiple = this.props.multiple;
        if (!multiple) {
            this.close();
        }
        this.setState({
            inputValue: ''
        }, function () { return _this.resultChangeEvent(value); });
    };
    TreeSelectControl.prototype.handleInputChange = function (value) {
        var _this = this;
        var _a = this.props, autoComplete = _a.autoComplete, data = _a.data;
        this.setState({
            inputValue: value
        }, amisCore.isEffectiveApi(autoComplete, data)
            ? function () { return _this.loadRemote(_this.state.inputValue); }
            : undefined);
    };
    TreeSelectControl.prototype.handleInputKeyDown = function (event) {
        var inputValue = this.state.inputValue;
        var _a = this.props, multiple = _a.multiple, selectedOptions = _a.selectedOptions;
        if (event.key === 'Backspace' &&
            !inputValue &&
            selectedOptions.length &&
            multiple) {
            this.removeItem(selectedOptions.length - 1);
        }
    };
    TreeSelectControl.prototype.clearValue = function () {
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange(typeof resetValue === 'undefined' ? '' : resetValue);
    };
    TreeSelectControl.prototype.filterOptions = function (options, keywords) {
        var _this = this;
        var _a = this.props, labelField = _a.labelField, valueField = _a.valueField;
        return options.map(function (option) {
            option = tslib.__assign({}, option);
            option.visible = !!matchSorter.matchSorter([option], keywords, {
                keys: [labelField || 'label', valueField || 'value']
            }).length;
            if (!option.visible && option.children) {
                option.children = _this.filterOptions(option.children, keywords);
                var visibleCount = option.children.filter(function (item) { return item.visible; }).length;
                option.visible = !!visibleCount;
            }
            option.visible && (option.collapsed = false);
            return option;
        });
    };
    TreeSelectControl.prototype.loadRemote = function (input) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, autoComplete, env, data, setOptions, setLoading, options, combinedOptions, ret, options, combinedOptions;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, autoComplete = _a.autoComplete, env = _a.env, data = _a.data, setOptions = _a.setOptions, setLoading = _a.setLoading;
                        if (!amisCore.isEffectiveApi(autoComplete, data)) {
                            return [2 /*return*/];
                        }
                        else if (!env || !env.fetcher) {
                            throw new Error('fetcher is required');
                        }
                        if (this.cache[input] || ~input.indexOf("'") /*中文没输完 233*/) {
                            options = this.cache[input] || [];
                            combinedOptions = this.mergeOptions(options);
                            setOptions(combinedOptions);
                            return [2 /*return*/, Promise.resolve({
                                    options: combinedOptions
                                })];
                        }
                        setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, env.fetcher(autoComplete, tslib.__assign(tslib.__assign({}, data), { term: input, value: input }))];
                    case 2:
                        ret = _b.sent();
                        options = (ret.data && ret.data.options) || ret.data || [];
                        this.cache[input] = options;
                        combinedOptions = this.mergeOptions(options);
                        setOptions(combinedOptions);
                        return [2 /*return*/, {
                                options: combinedOptions
                            }];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TreeSelectControl.prototype.mergeOptions = function (options) {
        var selectedOptions = this.props.selectedOptions;
        var combinedOptions = amisCore.normalizeOptions(options).concat();
        if (Array.isArray(selectedOptions) && selectedOptions.length) {
            selectedOptions.forEach(function (option) {
                if (!find__default["default"](combinedOptions, function (item) { return item.value == option.value; })) {
                    combinedOptions.push(tslib.__assign(tslib.__assign({}, option), { visible: false }));
                }
            });
        }
        return combinedOptions;
    };
    TreeSelectControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    TreeSelectControl.prototype.handleOutClick = function (e) {
        e.defaultPrevented ||
            this.setState({
                isOpened: true
            });
    };
    TreeSelectControl.prototype.handleResultChange = function (value) {
        var _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, multiple = _a.multiple;
        var newValue = Array.isArray(value) ? value.concat() : [];
        if (!multiple && !newValue.length) {
            this.resultChangeEvent('');
            return;
        }
        if (joinValues || extractValue) {
            newValue = value.map(function (item) { return item[valueField || 'value']; });
        }
        if (joinValues) {
            newValue = newValue.join(delimiter || ',');
        }
        this.resultChangeEvent(newValue);
    };
    TreeSelectControl.prototype.doAction = function (action, data, throwErrors) {
        if (action.actionType && ['clear', 'reset'].includes(action.actionType)) {
            this.clearValue();
        }
    };
    TreeSelectControl.prototype.resultChangeEvent = function (value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, onChange, dispatchEvent, data, rendererEvent;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', amisCore.createObject(data, {
                                value: value
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange && onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeSelectControl.prototype.renderItem = function (item) {
        var _a = this.props, labelField = _a.labelField, options = _a.options, hideNodePathLabel = _a.hideNodePathLabel;
        if (hideNodePathLabel) {
            return item[labelField || 'label'];
        }
        // 将所有祖先节点也展现出来
        var ancestors = amisCore.getTreeAncestors(options, item, true);
        return "".concat(ancestors
            ? ancestors.map(function (item) { return "".concat(item[labelField || 'label']); }).join(' / ')
            : item[labelField || 'label']);
    };
    TreeSelectControl.prototype.domRef = function (ref) {
        this.treeRef = ref;
    };
    TreeSelectControl.prototype.renderOuter = function () {
        var _a = this.props, value = _a.value, enableNodePath = _a.enableNodePath, _b = _a.pathSeparator, pathSeparator = _b === void 0 ? '/' : _b, disabled = _a.disabled, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter; _a.placeholder; var options = _a.options, multiple = _a.multiple, valueField = _a.valueField, initiallyOpen = _a.initiallyOpen, unfoldedLevel = _a.unfoldedLevel, withChildren = _a.withChildren, rootLabel = _a.rootLabel, cascade = _a.cascade, rootValue = _a.rootValue, showIcon = _a.showIcon, showRadio = _a.showRadio; _a.popOverContainer; var onlyChildren = _a.onlyChildren, onlyLeaf = _a.onlyLeaf, ns = _a.classPrefix, optionsPlaceholder = _a.optionsPlaceholder, searchable = _a.searchable, autoComplete = _a.autoComplete, maxLength = _a.maxLength, minLength = _a.minLength, labelField = _a.labelField, nodePath = _a.nodePath, onAdd = _a.onAdd, creatable = _a.creatable, createTip = _a.createTip, addControls = _a.addControls, onEdit = _a.onEdit, editable = _a.editable, editTip = _a.editTip, editControls = _a.editControls, removable = _a.removable, removeTip = _a.removeTip, onDelete = _a.onDelete, rootCreatable = _a.rootCreatable, rootCreateTip = _a.rootCreateTip, __ = _a.translate, deferLoad = _a.deferLoad, expandTreeOptions = _a.expandTreeOptions, selfDisabledAffectChildren = _a.selfDisabledAffectChildren, showOutline = _a.showOutline, autoCheckChildren = _a.autoCheckChildren;
        var filtedOptions = !amisCore.isEffectiveApi(autoComplete) && searchable && this.state.inputValue
            ? this.filterOptions(options, this.state.inputValue)
            : options;
        return (React__default["default"].createElement(amisUi.Tree, { classPrefix: ns, onRef: this.domRef, onlyChildren: onlyChildren, onlyLeaf: onlyLeaf, labelField: labelField, valueField: valueField, disabled: disabled, onChange: this.handleChange, joinValues: joinValues, extractValue: extractValue, delimiter: delimiter, placeholder: __(optionsPlaceholder), options: filtedOptions, highlightTxt: this.state.inputValue, multiple: multiple, initiallyOpen: initiallyOpen, unfoldedLevel: unfoldedLevel, withChildren: withChildren, autoCheckChildren: autoCheckChildren, rootLabel: __(rootLabel), rootValue: rootValue, showIcon: showIcon, showRadio: showRadio, showOutline: showOutline, cascade: cascade, foldedField: "collapsed", hideRoot: true, value: value || '', nodePath: nodePath, enableNodePath: enableNodePath, pathSeparator: pathSeparator, maxLength: maxLength, minLength: minLength, onAdd: onAdd, creatable: creatable, createTip: createTip, rootCreatable: rootCreatable, rootCreateTip: rootCreateTip, onEdit: onEdit, editable: editable, editTip: editTip, removable: removable, removeTip: removeTip, onDelete: onDelete, bultinCUD: !addControls && !editControls, onDeferLoad: deferLoad, onExpandTree: expandTreeOptions, selfDisabledAffectChildren: selfDisabledAffectChildren }));
    };
    TreeSelectControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, disabled = _a.disabled, inline = _a.inline, loading = _a.loading, multiple = _a.multiple; _a.value; var clearable = _a.clearable, ns = _a.classPrefix, cx = _a.classnames, searchable = _a.searchable, autoComplete = _a.autoComplete, selectedOptions = _a.selectedOptions, placeholder = _a.placeholder, popOverContainer = _a.popOverContainer, useMobileUI = _a.useMobileUI, __ = _a.translate, env = _a.env;
        var isOpened = this.state.isOpened;
        var mobileUI = useMobileUI && amisCore.isMobile();
        return (React__default["default"].createElement("div", { ref: this.container, className: cx("TreeSelectControl", className) },
            React__default["default"].createElement(amisUi.ResultBox, { disabled: disabled, ref: this.targetRef, placeholder: __(placeholder !== null && placeholder !== void 0 ? placeholder : 'placeholder.empty'), inputPlaceholder: '', className: cx("TreeSelect", {
                    'TreeSelect--inline': inline,
                    'TreeSelect--single': !multiple,
                    'TreeSelect--multi': multiple,
                    'TreeSelect--searchable': searchable || amisCore.isEffectiveApi(autoComplete),
                    'is-opened': this.state.isOpened,
                    'is-disabled': disabled
                }), result: multiple
                    ? selectedOptions
                    : selectedOptions.length
                        ? this.renderItem(selectedOptions[0])
                        : '', onResultClick: this.handleOutClick, value: this.state.inputValue, onChange: this.handleInputChange, onResultChange: this.handleResultChange, itemRender: this.renderItem, onKeyPress: this.handleKeyPress, onFocus: this.handleFocus, onBlur: this.handleBlur, onKeyDown: this.handleInputKeyDown, clearable: clearable, allowInput: searchable || amisCore.isEffectiveApi(autoComplete), hasDropDownArrow: true }, loading ? React__default["default"].createElement(amisUi.Spinner, { size: "sm" }) : undefined),
            !mobileUI && isOpened ? (React__default["default"].createElement(amisCore.Overlay, { container: popOverContainer || (function () { return _this.container.current; }), target: function () { return _this.target; }, show: true },
                React__default["default"].createElement(amisCore.PopOver, { classPrefix: ns, className: "".concat(ns, "TreeSelect-popover"), style: {
                        minWidth: this.target ? this.target.offsetWidth : undefined
                    }, onHide: this.close, overlay: true }, this.renderOuter()))) : null,
            mobileUI ? (React__default["default"].createElement(amisUi.PopUp, { container: env && env.getModalContainer ? env.getModalContainer : undefined, className: cx("".concat(ns, "TreeSelect-popup")), isShow: isOpened, onHide: this.close }, this.renderOuter())) : null));
    };
    TreeSelectControl.defaultProps = {
        placeholder: 'Select.placeholder',
        optionsPlaceholder: 'placeholder.noData',
        multiple: false,
        clearable: true,
        rootLabel: 'Tree.root',
        rootValue: '',
        showIcon: true,
        joinValues: true,
        extractValue: false,
        delimiter: ',',
        resetValue: '',
        hideNodePathLabel: false,
        enableNodePath: false,
        pathSeparator: '/',
        selfDisabledAffectChildren: true
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TreeSelectControl.prototype, "handleOutClick", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array]),
        tslib.__metadata("design:returntype", void 0)
    ], TreeSelectControl.prototype, "handleResultChange", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", Promise)
    ], TreeSelectControl.prototype, "resultChangeEvent", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TreeSelectControl.prototype, "renderItem", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], TreeSelectControl.prototype, "domRef", null);
    return TreeSelectControl;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(TreeSelectControlRenderer, _super);
    function TreeSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeSelectControlRenderer = tslib.__decorate([
        amisCore.OptionsControl({
            type: 'tree-select'
        })
    ], TreeSelectControlRenderer);
    return TreeSelectControlRenderer;
})(TreeSelectControl));

exports["default"] = TreeSelectControl;
