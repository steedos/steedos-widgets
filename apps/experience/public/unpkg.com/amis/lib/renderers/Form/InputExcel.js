/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var DropZone = require('react-dropzone');
var amisCore = require('amis-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var DropZone__default = /*#__PURE__*/_interopDefaultLegacy(DropZone);

var ExcelControl = /** @class */ (function (_super) {
    tslib.__extends(ExcelControl, _super);
    function ExcelControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            filename: ''
        };
        return _this;
    }
    ExcelControl.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.value !== this.props.value && !this.props.value) {
            this.setState({ filename: '' });
        }
    };
    ExcelControl.prototype.handleDrop = function (files) {
        var _this = this;
        var _a = this.props, allSheets = _a.allSheets, onChange = _a.onChange; _a.dispatchEvent; _a.data;
        var excel = files[0];
        var reader = new FileReader();
        reader.readAsArrayBuffer(excel);
        reader.onload = function () { return tslib.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib.__generator(this, function (_a) {
                if (reader.result) {
                    Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['exceljs'], function(mod) {fullfill(tslib.__importStar(mod))})})}).then(function (ExcelJS) { return tslib.__awaiter(_this, void 0, void 0, function () {
                        var workbook, sheetsResult, worksheet, dispatcher;
                        var _this = this;
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.ExcelJS = ExcelJS;
                                    workbook = new ExcelJS.Workbook();
                                    return [4 /*yield*/, workbook.xlsx.load(reader.result)];
                                case 1:
                                    _a.sent();
                                    sheetsResult = [];
                                    if (allSheets) {
                                        workbook.eachSheet(function (worksheet) {
                                            sheetsResult.push({
                                                sheetName: worksheet.name,
                                                data: _this.readWorksheet(worksheet)
                                            });
                                        });
                                    }
                                    else {
                                        worksheet = workbook.worksheets[0];
                                        sheetsResult = this.readWorksheet(worksheet);
                                    }
                                    return [4 /*yield*/, this.dispatchEvent('change', sheetsResult)];
                                case 2:
                                    dispatcher = _a.sent();
                                    if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                                        return [2 /*return*/];
                                    }
                                    onChange(sheetsResult);
                                    this.setState({ filename: files[0].name });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [2 /*return*/];
            });
        }); };
    };
    ExcelControl.prototype.dispatchEvent = function (eventName, eventData) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, dispatchEvent, data;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent(eventName, amisCore.createObject(data, {
                                value: eventData
                            }))];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * 读取单个 sheet 的内容
     */
    ExcelControl.prototype.readWorksheet = function (worksheet) {
        var _this = this;
        var result = [];
        var _a = this.props, parseMode = _a.parseMode, plainText = _a.plainText, includeEmpty = _a.includeEmpty;
        if (parseMode === 'array') {
            worksheet.eachRow(function (row, rowNumber) {
                var values = row.values;
                values.shift(); // excel 返回的值是从 1 开始的，0 节点永远是 null
                result.push(values);
            });
            return result;
        }
        else {
            var firstRowValues_1 = [];
            worksheet.eachRow(function (row, rowNumber) {
                // 将第一列作为字段名
                if (rowNumber == 1) {
                    firstRowValues_1 = row.values;
                }
                else {
                    var data_1 = {};
                    if (includeEmpty) {
                        firstRowValues_1.forEach(function (item) {
                            data_1[item] = '';
                        });
                    }
                    row.eachCell(function (cell, colNumber) {
                        if (firstRowValues_1[colNumber]) {
                            var value = cell.value;
                            if (plainText) {
                                var ExcelValueType = _this.ExcelJS.ValueType;
                                if (cell.type === ExcelValueType.Hyperlink) {
                                    value = cell.value.hyperlink;
                                }
                                else if (cell.type === ExcelValueType.Formula) {
                                    value = cell.value.result;
                                }
                                else if (cell.type === ExcelValueType.RichText) {
                                    value = cell.value.richText
                                        .map(function (item) { return item.text; })
                                        .join('');
                                }
                                else if (cell.type === ExcelValueType.Error) {
                                    value = '';
                                }
                            }
                            data_1[firstRowValues_1[colNumber]] = value;
                        }
                    });
                    result.push(data_1);
                }
            });
            return result;
        }
    };
    ExcelControl.prototype.doAction = function (action, data, throwErrors) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    ExcelControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, cx = _a.classnames; _a.classPrefix; _a.value; var disabled = _a.disabled, __ = _a.translate;
        return (React__default["default"].createElement("div", { className: cx('ExcelControl', className) },
            React__default["default"].createElement(DropZone__default["default"], { key: "drop-zone", onDrop: this.handleDrop, accept: ".xlsx", multiple: false, disabled: disabled }, function (_a) {
                var getRootProps = _a.getRootProps, getInputProps = _a.getInputProps;
                return (React__default["default"].createElement("section", { className: cx('ExcelControl-container', className) },
                    React__default["default"].createElement("div", tslib.__assign({}, getRootProps({ className: cx('ExcelControl-dropzone') })),
                        React__default["default"].createElement("input", tslib.__assign({}, getInputProps())),
                        _this.state.filename ? (__('Excel.parsed', {
                            filename: _this.state.filename
                        })) : (React__default["default"].createElement("p", null, __('Excel.placeholder'))))));
            })));
    };
    ExcelControl.defaultProps = {
        allSheets: false,
        parseMode: 'object',
        includeEmpty: true,
        plainText: true
    };
    tslib.__decorate([
        amisCore.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array]),
        tslib.__metadata("design:returntype", void 0)
    ], ExcelControl.prototype, "handleDrop", null);
    return ExcelControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(ExcelControlRenderer, _super);
    function ExcelControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExcelControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-excel'
        })
    ], ExcelControlRenderer);
    return ExcelControlRenderer;
})(ExcelControl));

exports["default"] = ExcelControl;
