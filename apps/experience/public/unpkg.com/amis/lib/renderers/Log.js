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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Log = /** @class */ (function (_super) {
    tslib.__extends(Log, _super);
    function Log(props) {
        var _this = _super.call(this, props) || this;
        _this.isDone = false;
        _this.autoScroll = false;
        _this.state = {
            lastLine: '',
            logs: [],
            originLogs: [],
            refresh: true,
            showLineNumber: false,
            filterWord: ''
        };
        _this.refresh = function (e) {
            var origin = _this.state.refresh;
            _this.setState({
                refresh: !origin
            });
            if (!origin) {
                _this.clear(e);
                _this.loadLogs();
            }
            e.preventDefault();
        };
        _this.clear = function (e) {
            _this.setState({
                logs: [],
                lastLine: ''
            });
            e.preventDefault();
        };
        _this.changeFilterWord = function (value) {
            var logs = _this.state.originLogs;
            if (value !== '' &&
                value !== undefined &&
                value !== null &&
                value.length > 0) {
                logs = logs.filter(function (line) { return line.includes(value); });
            }
            _this.setState({
                filterWord: value,
                logs: logs
            });
        };
        _this.logRef = React__default["default"].createRef();
        _this.autoScroll = props.autoScroll || false;
        _this.pauseOrResumeScrolling = _this.pauseOrResumeScrolling.bind(_this);
        return _this;
    }
    Log.prototype.componentWillUnmount = function () {
        if (this.logRef && this.logRef.current) {
            this.logRef.current.removeEventListener('scroll', this.pauseOrResumeScrolling);
        }
    };
    Log.prototype.componentDidMount = function () {
        if (this.autoScroll && this.logRef && this.logRef.current) {
            this.logRef.current.addEventListener('scroll', this.pauseOrResumeScrolling);
        }
        if (this.props.source) {
            this.loadLogs();
        }
    };
    Log.prototype.componentDidUpdate = function (prevProps) {
        if (this.autoScroll && this.logRef && this.logRef.current) {
            this.logRef.current.scrollTop = this.logRef.current.scrollHeight;
        }
        if (amisCore.isApiOutdated(prevProps.source, this.props.source, prevProps.data, this.props.data)) {
            this.loadLogs();
        }
    };
    // 如果向上滚动就停止自动滚动，除非滚到底部
    Log.prototype.pauseOrResumeScrolling = function () {
        if (this.logRef && this.logRef.current) {
            var _a = this.logRef.current, scrollHeight = _a.scrollHeight, scrollTop = _a.scrollTop, offsetHeight = _a.offsetHeight;
            this.autoScroll = scrollHeight - (scrollTop + offsetHeight) < 50;
        }
    };
    Log.prototype.loadLogs = function () {
        var _a;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _b, source, data, env, __, encoding, maxLength, api, res, body, reader, lastline, logs, _c, done, value, text, lines;
            var _this = this;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = this.props, source = _b.source, data = _b.data, env = _b.env, __ = _b.translate, encoding = _b.encoding, maxLength = _b.maxLength;
                        api = amisCore.buildApi(source, data);
                        if (!api.url) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch(api.url, {
                                method: ((_a = api.method) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()) || 'GET',
                                headers: api.headers || undefined,
                                body: api.data ? JSON.stringify(api.data) : undefined,
                                credentials: 'include'
                            })];
                    case 1:
                        res = _d.sent();
                        if (!(res.status === 200)) return [3 /*break*/, 8];
                        body = res.body;
                        if (!body) {
                            return [2 /*return*/];
                        }
                        reader = body.getReader();
                        lastline = '';
                        logs = [];
                        _d.label = 2;
                    case 2:
                        if (!!this.state.refresh) return [3 /*break*/, 4];
                        return [4 /*yield*/, reader.cancel('click cancel button').then(function () {
                                _this.props.env.notify('success', '日志已经停止刷新');
                                return;
                            })];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4: return [4 /*yield*/, reader.read()];
                    case 5:
                        _c = _d.sent(), done = _c.done, value = _c.value;
                        if (value) {
                            text = new TextDecoder(encoding).decode(value, { stream: true });
                            lines = text.split('\n');
                            // 如果没有换行符就只更新最后一行
                            if (lines.length === 1) {
                                lastline += lines[0];
                                this.setState({
                                    lastLine: lastline
                                });
                            }
                            else {
                                // 将之前的数据补上
                                lines[0] = lastline + lines[0];
                                // 最后一个要么是空，要么是下一行的数据
                                lastline = lines.pop() || '';
                                if (maxLength) {
                                    if (logs.length + lines.length > maxLength) {
                                        logs.splice(0, logs.length + lines.length - maxLength);
                                    }
                                }
                                logs = logs.concat(lines);
                                this.setState({
                                    logs: logs,
                                    originLogs: logs,
                                    lastLine: lastline
                                });
                            }
                        }
                        this.changeFilterWord(this.state.filterWord);
                        if (done) {
                            this.isDone = true;
                            return [2 /*return*/];
                        }
                        _d.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        env.notify('error', __('fetchFailed'));
                        _d.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Log.prototype.renderHighlightWord = function (line) {
        var cx = this.props.classnames;
        var filterWord = this.state.filterWord;
        if (filterWord === '') {
            return line;
        }
        var items = line.split(filterWord);
        return items.map(function (item, index) {
            if (index < items.length - 1) {
                return (React__default["default"].createElement("span", null,
                    item,
                    React__default["default"].createElement("span", { className: cx('Log-line-highlight') }, filterWord)));
            }
            return item;
        });
    };
    /**
     * 渲染某一行
     */
    Log.prototype.renderLine = function (index, line, showLineNumber) {
        var _a = this.props, cx = _a.classnames; _a.disableColor;
        return (React__default["default"].createElement("div", { className: cx('Log-line'), key: index },
            showLineNumber && (React__default["default"].createElement("span", { className: cx('Log-line-number') },
                index + 1,
                " ")),
            this.renderHighlightWord(line)));
    };
    Log.prototype.render = function () {
        var _this = this;
        var _a = this.props, source = _a.source, className = _a.className, cx = _a.classnames, placeholder = _a.placeholder, height = _a.height, rowHeight = _a.rowHeight; _a.disableColor; var __ = _a.translate, operation = _a.operation;
        var _b = this.state, refresh = _b.refresh, showLineNumber = _b.showLineNumber;
        var loading = __(placeholder);
        if (!source) {
            loading = __('Log.mustHaveSource');
        }
        var lines;
        var logs = this.state.lastLine
            ? this.state.logs.concat([this.state.lastLine])
            : this.state.logs;
        // 如果设置 rowHeight 就开启延迟渲染
        var useVirtualRender = rowHeight;
        if (useVirtualRender) {
            lines = (React__default["default"].createElement(amisUi.VirtualList, { height: height, itemCount: logs.length, itemSize: rowHeight, renderItem: function (_a) {
                    var index = _a.index, style = _a.style;
                    return (React__default["default"].createElement("div", { className: cx('Log-line'), key: index, style: tslib.__assign(tslib.__assign({}, style), { whiteSpace: 'nowrap' }) },
                        showLineNumber && (React__default["default"].createElement("span", { className: cx('Log-line-number') },
                            index + 1,
                            " ")),
                        _this.renderHighlightWord(logs[index])));
                } }));
        }
        else {
            lines = logs.map(function (line, index) {
                return _this.renderLine(index, line, showLineNumber);
            });
        }
        return (React__default["default"].createElement("div", { className: cx('Log', className) },
            React__default["default"].createElement("div", { className: cx('Log-operation') }, operation && (operation === null || operation === void 0 ? void 0 : operation.length) > 0 && (React__default["default"].createElement(React__default["default"].Fragment, null,
                operation.includes('stop') && (React__default["default"].createElement("a", { title: __('stop'), className: !refresh ? 'is-disabled' : '', onClick: this.refresh },
                    React__default["default"].createElement(amisUi.Icon, { icon: "pause" }))),
                operation.includes('restart') && (React__default["default"].createElement("a", { title: __('reload'), className: refresh ? 'is-disabled' : '', onClick: this.refresh },
                    React__default["default"].createElement(amisUi.Icon, { icon: "refresh" }))),
                operation.includes('showLineNumber') && (React__default["default"].createElement("a", { title: showLineNumber
                        ? __('Log.notShowLineNumber')
                        : __('Log.showLineNumber'), onClick: function (e) {
                        _this.setState({ showLineNumber: !showLineNumber });
                        e.preventDefault();
                    } },
                    React__default["default"].createElement(amisUi.Icon, { icon: showLineNumber ? 'invisible' : 'view' }))),
                operation.includes('clear') && (React__default["default"].createElement("a", { onClick: this.clear, title: __('clear') },
                    React__default["default"].createElement(amisUi.Icon, { icon: "remove" }))),
                operation && operation.includes('filter') && (React__default["default"].createElement(amisUi.SearchBox, { className: cx('Log-filter-box'), placeholder: "\u8FC7\u6EE4\u8BCD", onChange: this.changeFilterWord }))))),
            React__default["default"].createElement("div", { ref: this.logRef, className: cx('Log-body'), style: { height: useVirtualRender ? 'auto' : height } }, useVirtualRender ? lines : lines.length ? lines : loading)));
    };
    Log.defaultProps = {
        height: 500,
        autoScroll: true,
        placeholder: 'loading',
        encoding: 'utf-8'
    };
    return Log;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(LogRenderer, _super);
    function LogRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'log'
        })
    ], LogRenderer);
    return LogRenderer;
})(Log));

exports.Log = Log;
