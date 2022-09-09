/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function loadComponent() {
    return Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['amis-ui/lib/components/Editor'], function(mod) {fullfill(tslib.__importStar(mod))})})}).then(function (item) { return item.default; });
}
function normalizeValue(value, language) {
    if (value && typeof value !== 'string') {
        value = JSON.stringify(value, null, 2);
    }
    if (language && language === 'json') {
        try {
            value = JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2);
        }
        catch (e) { }
    }
    return value;
}
var DiffEditor = /** @class */ (function (_super) {
    tslib.__extends(DiffEditor, _super);
    function DiffEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            focused: false
        };
        _this.toDispose = [];
        _this.divRef = React__default["default"].createRef();
        _this.prevHeight = 0;
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.editorFactory = _this.editorFactory.bind(_this);
        _this.handleEditorMounted = _this.handleEditorMounted.bind(_this);
        _this.handleModifiedEditorChange =
            _this.handleModifiedEditorChange.bind(_this);
        return _this;
    }
    DiffEditor.prototype.componentWillUnmount = function () {
        this.toDispose.forEach(function (fn) { return fn(); });
    };
    DiffEditor.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
        else if (actionType === 'focus') {
            this.focus();
        }
    };
    DiffEditor.prototype.focus = function () {
        var _a, _b;
        this.editor.focus();
        this.setState({ focused: true });
        // 最近一次光标位置
        var position = (_a = this.editor) === null || _a === void 0 ? void 0 : _a.getPosition();
        (_b = this.editor) === null || _b === void 0 ? void 0 : _b.setPosition(position);
    };
    DiffEditor.prototype.handleFocus = function () {
        this.setState({
            focused: true
        });
    };
    DiffEditor.prototype.handleBlur = function () {
        this.setState({
            focused: false
        });
    };
    DiffEditor.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, data = _a.data, value = _a.value, diffValue = _a.diffValue, language = _a.language;
        if (this.originalEditor &&
            (diffValue !== prevProps.diffValue || data !== prevProps.data)) {
            this.originalEditor.getModel().setValue(amisCore.isPureVariable(diffValue)
                ? normalizeValue(amisCore.resolveVariableAndFilter(diffValue || '', data, '| raw', function () { return ''; }), language)
                : normalizeValue(diffValue, language));
        }
        if (this.modifiedEditor &&
            value !== prevProps.value &&
            !this.state.focused) {
            this.modifiedEditor.getModel().setValue(normalizeValue(value, language));
        }
    };
    DiffEditor.prototype.editorFactory = function (containerElement, monaco, options) {
        return monaco.editor.createDiffEditor(containerElement, options);
    };
    DiffEditor.prototype.handleEditorMounted = function (editor, monaco) {
        var _this = this;
        var _a = this.props, value = _a.value, data = _a.data, language = _a.language, diffValue = _a.diffValue;
        this.monaco = monaco;
        this.editor = editor;
        this.modifiedEditor = editor.getModifiedEditor();
        this.originalEditor = editor.getOriginalEditor();
        this.toDispose.push(this.modifiedEditor.onDidFocusEditorWidget(this.handleFocus).dispose);
        this.toDispose.push(this.modifiedEditor.onDidBlurEditorWidget(this.handleBlur).dispose);
        this.toDispose.push(this.modifiedEditor.onDidChangeModelContent(this.handleModifiedEditorChange).dispose);
        this.toDispose.push(this.modifiedEditor.onDidChangeModelDecorations(function () {
            _this.updateContainerSize(_this.modifiedEditor, monaco); // typing
            requestAnimationFrame(_this.updateContainerSize.bind(_this, _this.modifiedEditor, monaco)); // folding
        }).dispose);
        this.editor.setModel({
            original: this.monaco.editor.createModel(amisCore.isPureVariable(diffValue)
                ? normalizeValue(amisCore.resolveVariableAndFilter(diffValue || '', data, '| raw'), language)
                : normalizeValue(diffValue, language), language),
            modified: this.monaco.editor.createModel(normalizeValue(value, language), language)
        });
    };
    DiffEditor.prototype.handleModifiedEditorChange = function () {
        var onChange = this.props.onChange;
        onChange && onChange(this.modifiedEditor.getModel().getValue());
    };
    DiffEditor.prototype.updateContainerSize = function (editor, monaco) {
        var _a;
        if (!this.divRef.current) {
            return;
        }
        var lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        var lineCount = ((_a = editor.getModel()) === null || _a === void 0 ? void 0 : _a.getLineCount()) || 1;
        var height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;
        if (this.prevHeight !== height) {
            this.prevHeight = height;
            this.divRef.current.style.height = "".concat(height, "px");
            editor.layout();
        }
    };
    DiffEditor.prototype.render = function () {
        var _a = this.props, className = _a.className, value = _a.value, onChange = _a.onChange, disabled = _a.disabled, size = _a.size, options = _a.options, language = _a.language, theme = _a.theme, cx = _a.classnames;
        return (React__default["default"].createElement("div", { ref: this.divRef, className: cx('EditorControl', size ? "EditorControl--".concat(size) : '', className, {
                'is-focused': this.state.focused
            }) },
            React__default["default"].createElement(amisCore.LazyComponent, { getComponent: loadComponent, value: value, onChange: onChange, disabled: disabled, language: language, theme: theme, editorDidMount: this.handleEditorMounted, editorFactory: this.editorFactory, options: tslib.__assign(tslib.__assign({}, options), { readOnly: disabled }), isDiffEditor: true })));
    };
    DiffEditor.defaultProps = {
        language: 'javascript',
        theme: 'vs',
        options: {
            automaticLayout: false,
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            folding: true,
            minimap: {
                enabled: false
            }
        },
        diffValue: ''
    };
    tslib.__decorate([
        amisCore.bindRendererEvent('focus'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], DiffEditor.prototype, "handleFocus", null);
    tslib.__decorate([
        amisCore.bindRendererEvent('blur'),
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], DiffEditor.prototype, "handleBlur", null);
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", void 0)
    ], DiffEditor.prototype, "updateContainerSize", null);
    return DiffEditor;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(DiffEditorControlRenderer, _super);
    function DiffEditorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiffEditorControlRenderer.defaultProps = tslib.__assign({}, DiffEditor.defaultProps);
    DiffEditorControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: "diff-editor",
            sizeMutable: false
        })
    ], DiffEditorControlRenderer);
    return DiffEditorControlRenderer;
})(DiffEditor));
// @Renderer({
//   test: /(^|\/)diff-editor$/,
//   name: 'diff-editor'
// })
// export class DiffEditorRenderer extends DiffEditor {
//   static defaultProps = {
//     ...DiffEditor.defaultProps,
//     disabled: true
//   };
// }

exports.DiffEditor = DiffEditor;
