/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var isEqual = require('lodash/isEqual');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);

var Code = /** @class */ (function (_super) {
    tslib.__extends(Code, _super);
    function Code(props) {
        var _this = _super.call(this, props) || this;
        _this.toDispose = [];
        _this.codeRef = React__default["default"].createRef();
        return _this;
    }
    Code.prototype.componentDidMount = function () {
        var _this = this;
        Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['monaco-editor'], function(mod) {fullfill(tslib.__importStar(mod))})})}).then(function (monaco) { return _this.handleMonaco(monaco); });
    };
    Code.prototype.componentDidUpdate = function (preProps) {
        var _this = this;
        var props = this.props;
        var sourceCode = amisCore.getPropValue(this.props);
        var preSourceCode = amisCore.getPropValue(this.props);
        if (sourceCode !== preSourceCode ||
            (props.customLang && !isEqual__default["default"](props.customLang, preProps.customLang))) {
            var dom_1 = this.codeRef.current;
            dom_1.innerHTML = sourceCode;
            var theme_1 = this.registTheme() || this.props.editorTheme || 'vs';
            setTimeout(function () {
                _this.monaco.editor.colorizeElement(dom_1, {
                    tabSize: _this.props.tabSize,
                    theme: theme_1
                });
            }, 16);
        }
    };
    Code.prototype.handleMonaco = function (monaco) {
        var _this = this;
        this.monaco = monaco;
        if (this.codeRef.current) {
            var dom_2 = this.codeRef.current;
            var theme_2 = this.registTheme() || this.props.editorTheme || 'vs';
            // 这里必须是异步才能准确，可能是因为 monaco 里注册主题是异步的
            setTimeout(function () {
                monaco.editor.colorizeElement(dom_2, {
                    tabSize: _this.props.tabSize,
                    theme: theme_2
                });
            }, 16);
        }
    };
    Code.prototype.registTheme = function () {
        var monaco = this.monaco;
        if (!monaco) {
            return null;
        }
        if (this.customLang &&
            this.customLang.name &&
            this.customLang.tokens &&
            this.customLang.tokens.length) {
            var langName = this.customLang.name;
            monaco.languages.register({ id: langName });
            var tokenizers = [];
            var rules = [];
            for (var _i = 0, _a = this.customLang.tokens; _i < _a.length; _i++) {
                var token = _a[_i];
                var regex = new RegExp(token.regex, token.regexFlags || undefined);
                tokenizers.push([regex, token.name]);
                rules.push({
                    token: token.name,
                    foreground: token.color,
                    background: token.background,
                    fontStyle: token.fontStyle
                });
            }
            monaco.languages.setMonarchTokensProvider(langName, {
                tokenizer: {
                    root: tokenizers
                }
            });
            monaco.editor.defineTheme(langName, {
                base: 'vs',
                inherit: false,
                rules: rules
            });
            return langName;
        }
        return null;
    };
    Code.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, data = _a.data, customLang = _a.customLang, wordWrap = _a.wordWrap;
        var language = this.props.language;
        var sourceCode = amisCore.getPropValue(this.props);
        if (amisCore.isPureVariable(language)) {
            language = amisCore.resolveVariableAndFilter(language, data);
        }
        if (customLang) {
            if (customLang.name) {
                language = customLang.name;
            }
            this.customLang = customLang;
        }
        return (React__default["default"].createElement("code", { ref: this.codeRef, className: cx("Code", { 'word-break': wordWrap }, className), "data-lang": language }, sourceCode));
    };
    Code.defaultProps = {
        language: 'plaintext',
        editorTheme: 'vs',
        tabSize: 4,
        wordWrap: true
    };
    return Code;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(CodeRenderer, _super);
    function CodeRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CodeRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'code'
        })
    ], CodeRenderer);
    return CodeRenderer;
})(Code));

exports["default"] = Code;
