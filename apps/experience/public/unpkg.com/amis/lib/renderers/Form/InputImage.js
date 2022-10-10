/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var amisCore = require('amis-core');
var DropZone = require('react-dropzone');
require('blueimp-canvastoblob');
var find = require('lodash/find');
var amisUi = require('amis-ui');
var accepts = require('attr-accept');
var InputFile = require('./InputFile.js');
var Image$1 = require('../Image.js');
var isPlainObject = require('lodash/isPlainObject');
var merge = require('lodash/merge');
var omit = require('lodash/omit');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var DropZone__default = /*#__PURE__*/_interopDefaultLegacy(DropZone);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var accepts__default = /*#__PURE__*/_interopDefaultLegacy(accepts);
var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);

// import 'cropperjs/dist/cropper.css';
var Cropper = React__default["default"].lazy(function () { return Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['react-cropper'], function(mod) {fullfill(tslib.__importStar(mod))})})}); });
var preventEvent = function (e) { return e.stopPropagation(); };
var ImageControl = /** @class */ (function (_super) {
    tslib.__extends(ImageControl, _super);
    function ImageControl(props) {
        var _this_1 = _super.call(this, props) || this;
        _this_1.state = {
            uploading: false,
            locked: false,
            files: []
        };
        _this_1.files = [];
        _this_1.fileUploadCancelExecutors = [];
        _this_1.dropzone = React__default["default"].createRef();
        _this_1.frameImageRef = React__default["default"].createRef();
        _this_1.current = null;
        _this_1.unmounted = false;
        // 文件重新上传的位置标记，用以定位替换
        _this_1.reuploadIndex = undefined;
        var value = props.value;
        var multiple = props.multiple;
        var joinValues = props.joinValues;
        var delimiter = props.delimiter;
        var files = [];
        _this_1.initAutoFill = !!props.initAutoFill;
        if (value) {
            // files = (multiple && Array.isArray(value) ? value : joinValues ? (value as string).split(delimiter) : [value])
            files = (Array.isArray(value)
                ? value
                : joinValues && typeof value === 'string' && multiple
                    ? value.split(delimiter)
                    : [value])
                .map(function (item) { return ImageControl.valueToFile(item); })
                .filter(function (item) { return item; });
        }
        _this_1.state = tslib.__assign(tslib.__assign({}, _this_1.state), { files: (_this_1.files = files), crop: _this_1.buildCrop(props), frameImageWidth: 0 });
        _this_1.sendFile = _this_1.sendFile.bind(_this_1);
        _this_1.removeFile = _this_1.removeFile.bind(_this_1);
        _this_1.handleDrop = _this_1.handleDrop.bind(_this_1);
        _this_1.handleClick = _this_1.handleClick.bind(_this_1);
        _this_1.handleClick = _this_1.handleClick.bind(_this_1);
        _this_1.handleCrop = _this_1.handleCrop.bind(_this_1);
        _this_1.handleDropRejected = _this_1.handleDropRejected.bind(_this_1);
        _this_1.cancelCrop = _this_1.cancelCrop.bind(_this_1);
        _this_1.rotatableCrop = _this_1.rotatableCrop.bind(_this_1);
        _this_1.handleImageLoaded = _this_1.handleImageLoaded.bind(_this_1);
        _this_1.handleFrameImageLoaded = _this_1.handleFrameImageLoaded.bind(_this_1);
        _this_1.startUpload = _this_1.startUpload.bind(_this_1);
        _this_1.stopUpload = _this_1.stopUpload.bind(_this_1);
        _this_1.toggleUpload = _this_1.toggleUpload.bind(_this_1);
        _this_1.tick = _this_1.tick.bind(_this_1);
        _this_1.onChange = _this_1.onChange.bind(_this_1);
        _this_1.addFiles = _this_1.addFiles.bind(_this_1);
        _this_1.handleSelect = _this_1.handleSelect.bind(_this_1);
        _this_1.handlePaste = _this_1.handlePaste.bind(_this_1);
        _this_1.syncAutoFill = _this_1.syncAutoFill.bind(_this_1);
        _this_1.handleReSelect = _this_1.handleReSelect.bind(_this_1);
        return _this_1;
    }
    ImageControl.valueToFile = function (value, props) {
        return value
            ? tslib.__assign(tslib.__assign({}, (typeof value === 'string'
                ? {
                    value: value,
                    url: value,
                    id: amisCore.guid()
                }
                : value)), { state: 'init' }) : undefined;
    };
    ImageControl.sizeInfo = function (width, height, __) {
        if (!width) {
            return __('Image.height', { height: height });
        }
        else if (!height) {
            return __('Image.width', { width: width });
        }
        return __('Image.size', { width: width, height: height });
    };
    ImageControl.prototype.componentDidMount = function () {
        if (this.initAutoFill) {
            var _a = this.props, formInited = _a.formInited, addHook = _a.addHook;
            formInited || !addHook
                ? this.syncAutoFill()
                : addHook(this.syncAutoFill, 'init');
        }
        if (this.props.initCrop && this.files.length) {
            this.editImage(0);
        }
    };
    ImageControl.prototype.componentDidUpdate = function (prevProps) {
        var _this_1 = this;
        var props = this.props;
        if (prevProps.value !== props.value) {
            var value = props.value;
            var multiple = props.multiple;
            var joinValues = props.joinValues;
            var delimiter = props.delimiter;
            var files = [];
            if (value) {
                files = (Array.isArray(value)
                    ? value
                    : joinValues && typeof value === 'string' && multiple
                        ? value.split(delimiter)
                        : [value])
                    .map(function (item) {
                    var obj = ImageControl.valueToFile(item, props);
                    var org;
                    if (obj &&
                        (org = find__default["default"](_this_1.files, function (item) { return item.value === obj.value; }))) {
                        obj = tslib.__assign(tslib.__assign(tslib.__assign({}, org), obj), { id: org.id || obj.id });
                    }
                    return obj;
                })
                    .filter(function (item) { return item; });
            }
            this.setState({
                files: (this.files = files)
            }, this.syncAutoFill);
        }
        else if (prevProps.value !== props.value && !this.initAutoFill) {
            this.initAutoFill = true;
            this.syncAutoFill();
        }
        if (prevProps.crop !== props.crop) {
            this.setState({
                crop: this.buildCrop(props)
            });
        }
    };
    ImageControl.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    ImageControl.prototype.buildCrop = function (props) {
        var crop = props.crop;
        var __ = this.props.translate;
        if (crop && props.multiple) {
            props.env && props.env.alert && props.env.alert(__('Image.configError'));
            return null;
        }
        if (crop === true) {
            crop = {};
        }
        if (crop) {
            crop = tslib.__assign({ aspectRatio: undefined, guides: true, dragMode: 'move', viewMode: 1, rotatable: true, scalable: true }, crop);
        }
        return crop;
    };
    ImageControl.prototype.handleDropRejected = function (rejectedFiles, evt) {
        if (evt.type !== 'change' && evt.type !== 'drop') {
            return;
        }
        var _a = this.props; _a.multiple; var env = _a.env, accept = _a.accept, __ = _a.translate;
        var files = rejectedFiles.map(function (fileRejection) { return (tslib.__assign(tslib.__assign({}, fileRejection.file), { state: 'invalid', id: amisCore.guid(), name: fileRejection.file.name })); });
        // this.setState({
        //   files: this.files = multiple
        //     ? this.files.concat(files)
        //     : this.files.length
        //     ? this.files
        //     : files.slice(0, 1)
        // });
        env.alert(__('File.invalidType', {
            files: files.map(function (file) { return "\u300C".concat(file.name, "\u300D"); }).join(' '),
            accept: accept
        }));
    };
    ImageControl.prototype.startUpload = function (retry) {
        if (retry === void 0) { retry = false; }
        if (this.state.uploading) {
            return;
        }
        this.setState({
            uploading: true,
            locked: true,
            files: (this.files = this.files.map(function (file) {
                if (retry && file.state === 'error') {
                    file.state = 'pending';
                    file.progress = 0;
                }
                return file;
            }))
        }, this.tick);
    };
    ImageControl.prototype.toggleUpload = function () {
        return this.state.uploading ? this.stopUpload() : this.startUpload();
    };
    ImageControl.prototype.stopUpload = function () {
        if (!this.state.uploading) {
            return;
        }
        this.setState({
            uploading: false
        });
    };
    ImageControl.prototype.tick = function () {
        var _this_1 = this;
        if (this.current || !this.state.uploading) {
            return;
        }
        var env = this.props.env;
        var __ = this.props.translate;
        var file = find__default["default"](this.files, function (item) { return item.state === 'pending'; });
        if (file) {
            this.current = file;
            file.state = 'uploading';
            this.setState({
                files: (this.files = this.files.concat())
            }, function () {
                return _this_1.sendFile(file, function (error, file, obj) {
                    var files = _this_1.files.concat();
                    var idx = files.indexOf(file);
                    if (!~idx) {
                        return;
                    }
                    var newFile = file;
                    if (error) {
                        newFile.state =
                            file.state !== 'uploading' ? file.state : 'error';
                        newFile.error = error;
                        if (!_this_1.props.multiple && newFile.state === 'invalid') {
                            files.splice(idx, 1);
                            _this_1.current = null;
                            return _this_1.setState({
                                files: (_this_1.files = files),
                                error: error
                            }, _this_1.tick);
                        }
                        env.notify('error', error || __('File.errorRetry'));
                    }
                    else {
                        newFile = tslib.__assign(tslib.__assign({ name: file.name || _this_1.state.cropFileName }, obj), { preview: file.preview });
                    }
                    files.splice(idx, 1, newFile);
                    _this_1.current = null;
                    _this_1.setState({
                        files: (_this_1.files = files)
                    }, _this_1.tick);
                }, function (progress) {
                    var files = _this_1.files.concat();
                    var idx = files.indexOf(file);
                    if (!~idx) {
                        return;
                    }
                    // file 是个非 File 对象，先不copy了直接改。
                    file.progress = progress;
                    _this_1.setState({
                        files: (_this_1.files = files)
                    });
                });
            });
        }
        else {
            this.setState({
                uploading: false,
                locked: false
            }, function () { return tslib.__awaiter(_this_1, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.onChange(!!this.resolve, false)];
                        case 1:
                            _a.sent();
                            if (this.resolve) {
                                this.resolve(this.files.some(function (file) { return file.state === 'error'; })
                                    ? __('File.errorRetry')
                                    : null);
                                this.resolve = undefined;
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ImageControl.prototype.removeFile = function (file, index) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var files, dispatcher, isUploading;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = this.files.concat();
                        return [4 /*yield*/, this.dispatchEvent('remove', file)];
                    case 1:
                        dispatcher = _a.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        this.removeFileCanelExecutor(file, true);
                        files.splice(index, 1);
                        isUploading = this.current === file;
                        if (isUploading) {
                            this.current = null;
                        }
                        this.setState({
                            files: (this.files = files)
                        }, isUploading ? this.tick : this.onChange);
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageControl.prototype.previewImage = function (file, index, e) {
        var onImageEnlarge = this.props.onImageEnlarge;
        if (onImageEnlarge) {
            var files = this.files;
            e.preventDefault();
            onImageEnlarge({
                src: (file.preview || file.url),
                originalSrc: (file.preview || file.url),
                index: index,
                list: files.map(function (file) { return ({
                    src: (file.preview || file.url),
                    originalSrc: (file.preview || file.url),
                    title: file.name || InputFile.getNameFromUrl(file.value || file.url)
                }); })
            });
        }
    };
    ImageControl.prototype.editImage = function (index) {
        var files = this.files;
        this.setState({
            cropFile: {
                preview: files[index].preview || files[index].url,
                name: files[index].name,
                state: 'init'
            },
            cropFileName: files[index].name
        });
    };
    ImageControl.prototype.onChange = function (changeImmediately, changeEvent) {
        if (changeEvent === void 0) { changeEvent = true; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, multiple, onChange, joinValues, extractValue, delimiter, valueField, files, newValue, dispatcher;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, multiple = _a.multiple, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField;
                        files = this.files.filter(function (file) { return file.state == 'uploaded' || file.state == 'init'; });
                        newValue = files.length
                            ? joinValues
                                ? files[0].value
                                : files[0]
                            : '';
                        if (multiple) {
                            newValue = joinValues
                                ? files.map(function (item) { return item.value; }).join(delimiter)
                                : extractValue
                                    ? files.map(function (item) { return item.value; })
                                    : files;
                        }
                        else {
                            newValue = joinValues
                                ? newValue.value || newValue
                                : extractValue
                                    ? newValue[valueField || 'value']
                                    : newValue;
                        }
                        if (!changeEvent) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dispatchEvent('change')];
                    case 1:
                        dispatcher = _b.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        onChange((this.emitValue = newValue || ''), undefined, changeImmediately);
                        this.syncAutoFill();
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageControl.prototype.syncAutoFill = function () {
        var _a = this.props, autoFill = _a.autoFill, multiple = _a.multiple, onBulkChange = _a.onBulkChange, data = _a.data, name = _a.name;
        // 参照录入｜自动填充
        if (autoFill === null || autoFill === void 0 ? void 0 : autoFill.hasOwnProperty('api')) {
            return;
        }
        // 排除自身的字段，否则会无限更新state
        var excludeSelfAutoFill = omit__default["default"](autoFill, name || '');
        if (!amisCore.isEmpty(excludeSelfAutoFill) && onBulkChange && this.initAutoFill) {
            var files = this.state.files.filter(function (file) { return ~['uploaded', 'init', 'ready'].indexOf(file.state); });
            var toSync_1 = amisCore.dataMapping(excludeSelfAutoFill, multiple
                ? {
                    items: files
                }
                : files[0]);
            Object.keys(toSync_1).forEach(function (key) {
                if (isPlainObject__default["default"](toSync_1[key]) && isPlainObject__default["default"](data[key])) {
                    toSync_1[key] = merge__default["default"]({}, data[key], toSync_1[key]);
                }
            });
            onBulkChange(toSync_1);
        }
    };
    ImageControl.prototype.handleSelect = function () {
        // 清除标记，以免影响正常上传
        this.reuploadIndex = undefined;
        this.dropzone.current && this.dropzone.current.open();
    };
    ImageControl.prototype.handleRetry = function (index) {
        var files = this.files.concat();
        var file = files[index];
        if (file.state !== 'invalid' && file.state !== 'error') {
            return;
        }
        file.state = 'pending';
        file.progress = 0;
        this.setState({
            files: files
        }, this.startUpload);
    };
    ImageControl.prototype.handleDrop = function (files, e, event) {
        var _a = this.props, multiple = _a.multiple, crop = _a.crop, dropCrop = _a.dropCrop;
        if (crop && !multiple && dropCrop) {
            var file = files[0];
            if (!file.preview || !file.url) {
                file.preview = window.URL.createObjectURL(file);
            }
            return this.setState({
                cropFile: file,
                cropFileName: file.name
            });
        }
        // 拖拽的情况，没有比他更靠前的方法，只能在这里判断
        if (event && event.type === 'drop' && this.reuploadIndex !== undefined) {
            this.reuploadIndex = undefined;
        }
        this.addFiles(files);
    };
    ImageControl.prototype.handlePaste = function (e) {
        var event = e.nativeEvent;
        var files = [];
        var items = event.clipboardData.items;
        var accept = this.props.accept || '*';
        [].slice.call(items).forEach(function (item) {
            var blob;
            if (item.kind !== 'file' ||
                !(blob = item.getAsFile()) ||
                !accepts__default["default"](blob, accept)) {
                return;
            }
            blob.id = amisCore.guid();
            files.push(blob);
        });
        // 清除标记，以免影响正常上传
        this.reuploadIndex = undefined;
        this.handleDrop(files);
    };
    ImageControl.prototype.handleCrop = function () {
        var _this_1 = this;
        var _a = this.props, cropFormat = _a.cropFormat, cropQuality = _a.cropQuality;
        this.cropper.getCroppedCanvas().toBlob(function (file) {
            _this_1.addFiles([file]);
            _this_1.setState({
                cropFile: undefined,
                locked: false,
                lockedReason: ''
            });
        }, cropFormat || 'image/png', cropQuality || 1);
    };
    ImageControl.prototype.cancelCrop = function () {
        this.setState({
            cropFile: undefined,
            cropFileName: undefined,
            locked: false,
            lockedReason: ''
        }, this.onChange);
    };
    ImageControl.prototype.rotatableCrop = function () {
        this.cropper.rotate(45);
    };
    ImageControl.prototype.addFiles = function (files) {
        var _this_1 = this;
        if (!files.length) {
            return;
        }
        var _a = this.props, multiple = _a.multiple, maxLength = _a.maxLength, maxSize = _a.maxSize; _a.accept; var __ = _a.translate;
        var currentFiles = this.files;
        if (!multiple && currentFiles.length) {
            currentFiles = [];
        }
        var allowed = (multiple
            ? maxLength
                ? maxLength
                : files.length + currentFiles.length
            : 1) - currentFiles.length;
        var inputFiles = [];
        [].slice.call(files, 0, allowed).forEach(function (file) {
            if (maxSize && file.size > maxSize) {
                _this_1.props.env.alert(__('File.maxSize', {
                    filename: file.name,
                    actualSize: amisCore.prettyBytes(file.size, 1024),
                    maxSize: amisCore.prettyBytes(maxSize, 1024)
                }));
                return;
            }
            file.state = 'pending';
            file.id = amisCore.guid();
            if (!file.preview || !file.url) {
                file.preview = URL.createObjectURL(file);
            }
            inputFiles.push(file);
        });
        if (!inputFiles.length) {
            return;
        }
        var finalFiles = [];
        // 替换
        if (this.reuploadIndex !== undefined) {
            finalFiles = currentFiles.concat();
            // 因为单个文件重新上传也能选择多个，都插到一起
            finalFiles.splice.apply(finalFiles, tslib.__spreadArray([this.reuploadIndex, 1], inputFiles, false));
            this.reuploadIndex = undefined;
        }
        else {
            finalFiles = currentFiles.concat(inputFiles);
        }
        this.setState({
            error: undefined,
            files: (this.files = finalFiles),
            locked: true
        }, function () {
            var autoUpload = _this_1.props.autoUpload;
            if (autoUpload) {
                _this_1.startUpload();
            }
        });
    };
    ImageControl.prototype.sendFile = function (file, cb, onProgress) {
        var _this_1 = this;
        var _a = this.props, limit = _a.limit, __ = _a.translate;
        if (!limit) {
            return this._upload(file, cb, onProgress);
        }
        var image = new Image();
        image.onload = function () { return tslib.__awaiter(_this_1, void 0, void 0, function () {
            var width, height, error, dispatcher;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        width = image.width;
                        height = image.height;
                        error = '';
                        if ((limit.width && limit.width != width) ||
                            (limit.height && limit.height != height)) {
                            error = __('Image.sizeNotEqual', {
                                info: ImageControl.sizeInfo(limit.width, limit.height, __)
                            });
                        }
                        else if ((limit.maxWidth && limit.maxWidth < width) ||
                            (limit.maxHeight && limit.maxHeight < height)) {
                            error = __('Image.limitMax', {
                                info: ImageControl.sizeInfo(limit.maxWidth, limit.maxHeight, __)
                            });
                        }
                        else if ((limit.minWidth && limit.minWidth > width) ||
                            (limit.minHeight && limit.minHeight > height)) {
                            error = __('Image.limitMin', {
                                info: ImageControl.sizeInfo(limit.minWidth, limit.minHeight, __)
                            });
                        }
                        else if (limit.aspectRatio &&
                            Math.abs(width / height - limit.aspectRatio) > 0.01) {
                            error = __(limit.aspectRatioLabel || 'Image.limitRatio', {
                                ratio: (+limit.aspectRatio).toFixed(2)
                            });
                        }
                        if (!error) return [3 /*break*/, 2];
                        file.state = 'invalid';
                        return [4 /*yield*/, this.dispatchEvent('fail', { file: file, error: error })];
                    case 1:
                        dispatcher = _a.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        cb(error, file);
                        return [3 /*break*/, 3];
                    case 2:
                        this._upload(file, cb, onProgress);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        image.src = (file.preview || file.url);
    };
    ImageControl.prototype._upload = function (file, cb, onProgress) {
        var _this_1 = this;
        var __ = this.props.translate;
        this._send(file, this.props.receiver, {}, onProgress)
            .then(function (ret) { return tslib.__awaiter(_this_1, void 0, void 0, function () {
            var obj, dispatcher;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ret.status && ret.status !== '0') {
                            throw new Error(ret.msg || __('File.errorRetry'));
                        }
                        obj = tslib.__assign(tslib.__assign({}, ret.data), { state: 'uploaded' });
                        obj.value = obj.value || obj.url;
                        return [4 /*yield*/, this.dispatchEvent('success', tslib.__assign(tslib.__assign({}, file), { value: obj.value, state: 'uploaded' }))];
                    case 1:
                        dispatcher = _a.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        cb(null, file, obj);
                        return [2 /*return*/];
                }
            });
        }); })
            .catch(function (error) { return tslib.__awaiter(_this_1, void 0, void 0, function () {
            var dispatcher;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dispatchEvent('fail', {
                            file: file,
                            error: error
                        })];
                    case 1:
                        dispatcher = _a.sent();
                        if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                            return [2 /*return*/];
                        }
                        cb(error.message || __('File.errorRetry'), file);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ImageControl.prototype._send = function (file, receiver, params, onProgress) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var fd, data, api, fileField, idx, env;
            var _this_1 = this;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fd = new FormData();
                        data = this.props.data;
                        api = amisCore.buildApi(receiver, amisCore.createObject(data, params), {
                            method: 'post'
                        });
                        fileField = this.props.fileField || 'file';
                        idx = api.url.indexOf('?');
                        if (~idx && params) {
                            params = tslib.__assign(tslib.__assign({}, amisCore.qsparse(api.url.substring(idx + 1))), params);
                            api.url = api.url.substring(0, idx) + '?' + amisCore.qsstringify(params);
                        }
                        else if (params) {
                            api.url += '?' + amisCore.qsstringify(params);
                        }
                        if (api.data) {
                            amisCore.qsstringify(api.data)
                                .split('&')
                                .filter(function (item) { return item !== ''; })
                                .forEach(function (item) {
                                var parts = item.split('=');
                                fd.append(parts[0], decodeURIComponent(parts[1]));
                            });
                        }
                        // Note: File类型字段放在后面，可以支持第三方云存储鉴权
                        fd.append(fileField, file, file.name || this.state.cropFileName);
                        env = this.props.env;
                        if (!env || !env.fetcher) {
                            throw new Error('fetcher is required');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, env.fetcher(api, fd, {
                                method: 'post',
                                cancelExecutor: function (cancelExecutor) {
                                    // 记录取消器，取消的时候要调用
                                    _this_1.fileUploadCancelExecutors.push({
                                        file: file,
                                        executor: cancelExecutor
                                    });
                                },
                                onUploadProgress: function (event) {
                                    return onProgress(event.loaded / event.total);
                                }
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        this.removeFileCanelExecutor(file);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ImageControl.prototype.removeFileCanelExecutor = function (file, execute) {
        if (execute === void 0) { execute = false; }
        this.fileUploadCancelExecutors = this.fileUploadCancelExecutors.filter(function (item) {
            if (execute && item.file === file) {
                item.executor();
            }
            return item.file !== file;
        });
    };
    ImageControl.prototype.handleClick = function () {
        this.refs.dropzone.open();
    };
    ImageControl.prototype.handleImageLoaded = function (index, e) {
        var _this_1 = this;
        var imgDom = e.currentTarget;
        var img = new Image();
        img.onload = function () {
            delete img.onload;
            var files = _this_1.files.concat();
            var file = files[index];
            if (!file) {
                return;
            }
            file.info = tslib.__assign(tslib.__assign({}, file.info), { width: img.width, height: img.height });
            files.splice(index, 1, file);
            var needUploading = !!(_this_1.current || find__default["default"](files, function (file) { return file.state === 'pending'; }));
            _this_1.unmounted ||
                _this_1.setState({
                    files: (_this_1.files = files)
                }, !needUploading ? _this_1.onChange : undefined);
        };
        img.src = imgDom.src;
    };
    ImageControl.prototype.handleFrameImageLoaded = function (e) {
        var imgDom = e.currentTarget;
        var img = new Image();
        var clientHeight = this.frameImageRef.current.clientHeight;
        var _this = this;
        img.onload = function () {
            var ratio = this.width / this.height;
            var finalWidth = (ratio * (clientHeight - 2)).toFixed(2);
            _this.setState({
                frameImageWidth: +finalWidth
            });
        };
        img.src = imgDom.src;
    };
    ImageControl.prototype.validate = function () {
        var _this_1 = this;
        var __ = this.props.translate;
        if (this.state.locked && this.state.lockedReason) {
            return this.state.lockedReason;
        }
        else if (this.state.cropFile) {
            return new Promise(function (resolve) {
                _this_1.resolve = resolve;
                _this_1.handleCrop();
            });
        }
        else if (this.state.uploading ||
            this.files.some(function (item) { return item.state === 'pending'; })) {
            return new Promise(function (resolve) {
                _this_1.resolve = resolve;
                _this_1.startUpload();
            });
        }
        else if (this.files.some(function (item) { return item.state === 'error'; })) {
            return __('File.errorRetry');
        }
    };
    ImageControl.prototype.dispatchEvent = function (e, data) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var dispatchEvent, getEventData, value;
            return tslib.__generator(this, function (_a) {
                dispatchEvent = this.props.dispatchEvent;
                getEventData = function (item) { return ({
                    name: item.path || item.name,
                    value: item.value,
                    state: item.state,
                    error: item.error
                }); };
                value = data
                    ? getEventData(data)
                    : this.files.map(function (item) { return getEventData(item); });
                return [2 /*return*/, dispatchEvent(e, amisCore.createObject(this.props.data, { file: value }))];
            });
        });
    };
    // 动作
    ImageControl.prototype.doAction = function (action, data, throwErrors) {
        var onChange = this.props.onChange;
        if (action.actionType === 'clear') {
            this.files = [];
            onChange('');
        }
    };
    // 重新上传
    ImageControl.prototype.handleReSelect = function (index) {
        this.reuploadIndex = index;
        this.dropzone.current && this.dropzone.current.open();
    };
    ImageControl.prototype.render = function () {
        var _this_1 = this;
        var _a = this.props, className = _a.className, cx = _a.classnames, placeholder = _a.placeholder, disabled = _a.disabled, multiple = _a.multiple, accept = _a.accept, maxLength = _a.maxLength, autoUpload = _a.autoUpload, hideUploadButton = _a.hideUploadButton, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio, reCropable = _a.reCropable, frameImage = _a.frameImage, fixedSize = _a.fixedSize, fixedSizeClassName = _a.fixedSizeClassName, __ = _a.translate;
        var _b = this.state, files = _b.files, error = _b.error, crop = _b.crop, uploading = _b.uploading, cropFile = _b.cropFile, frameImageWidth = _b.frameImageWidth;
        var frameImageStyle = {};
        if (fixedSizeClassName && frameImageWidth && fixedSize) {
            frameImageStyle.width = frameImageWidth;
        }
        var filterFrameImage = amisCore.filter(frameImage, this.props.data, '| raw');
        var hasPending = files.some(function (file) { return file.state == 'pending'; });
        return (React__default["default"].createElement("div", { className: cx("ImageControl", className) }, cropFile ? (React__default["default"].createElement("div", { className: cx('ImageControl-cropperWrapper') },
            React__default["default"].createElement(React.Suspense, { fallback: React__default["default"].createElement("div", null, "...") },
                React__default["default"].createElement(Cropper, tslib.__assign({}, crop, { onInitialized: function (instance) {
                        _this_1.cropper = instance;
                    }, src: cropFile.preview }))),
            React__default["default"].createElement("div", { className: cx('ImageControl-croperToolbar') },
                crop.rotatable && (React__default["default"].createElement("a", { className: cx('ImageControl-cropRotatable'), onClick: this.rotatableCrop, "data-tooltip": __('rotate'), "data-position": "left" },
                    React__default["default"].createElement(amisUi.Icon, { icon: "retry", className: "icon" }))),
                React__default["default"].createElement("a", { className: cx('ImageControl-cropCancel'), onClick: this.cancelCrop, "data-tooltip": __('cancel'), "data-position": "left" },
                    React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" })),
                React__default["default"].createElement("a", { className: cx('ImageControl-cropConfirm'), onClick: this.handleCrop, "data-tooltip": __('confirm'), "data-position": "left" },
                    React__default["default"].createElement(amisUi.Icon, { icon: "check", className: "icon" }))))) : (React__default["default"].createElement(DropZone__default["default"], { key: "drop-zone", ref: this.dropzone, onDrop: this.handleDrop, onDropRejected: this.handleDropRejected, accept: accept, multiple: multiple, disabled: disabled }, function (_a) {
            var getRootProps = _a.getRootProps, getInputProps = _a.getInputProps, isDragActive = _a.isDragActive, isDragAccept = _a.isDragAccept, isDragReject = _a.isDragReject, isFocused = _a.isFocused;
            return (React__default["default"].createElement("div", tslib.__assign({}, getRootProps({
                onClick: preventEvent,
                onPaste: _this_1.handlePaste,
                className: cx('ImageControl-dropzone', {
                    'is-disabled': disabled,
                    'is-empty': !files.length,
                    'is-active': isDragActive
                })
            })),
                React__default["default"].createElement("input", tslib.__assign({}, getInputProps())),
                isDragActive || isDragAccept || isDragReject ? (React__default["default"].createElement("div", { className: cx('ImageControl-acceptTip', {
                        'is-accept': isDragAccept,
                        'is-reject': isDragReject
                    }) }, __('Image.dragDrop'))) : (React__default["default"].createElement(React__default["default"].Fragment, null,
                    files && files.length
                        ? files.map(function (file, key) { return (React__default["default"].createElement("div", { key: file.id || key, className: cx('ImageControl-item', {
                                'is-uploaded': file.state !== 'uploading',
                                'is-invalid': file.state === 'error' ||
                                    file.state === 'invalid'
                            }, fixedSize ? 'ImageControl-fixed-size' : '', fixedSize ? fixedSizeClassName : ''), style: frameImageStyle }, file.state === 'invalid' ||
                            file.state === 'error' ? (React__default["default"].createElement("div", { className: cx('Image--thumb') },
                            React__default["default"].createElement("div", { className: cx('Image-thumbWrap') },
                                React__default["default"].createElement("div", { className: cx('Image-thumb', 'ImageControl-filename') },
                                    React__default["default"].createElement(amisUi.Icon, { icon: "image", className: "icon" }),
                                    React__default["default"].createElement("span", { title: file.name ||
                                            InputFile.getNameFromUrl(file.value || file.url) }, file.name ||
                                        InputFile.getNameFromUrl(file.value || file.url))),
                                React__default["default"].createElement("div", { className: cx('Image-overlay') },
                                    React__default["default"].createElement("a", { "data-tooltip": __('File.repick'), "data-position": "bottom", onClick: _this_1.handleRetry.bind(_this_1, key) },
                                        React__default["default"].createElement(amisUi.Icon, { icon: "upload", className: "icon" })),
                                    !disabled ? (React__default["default"].createElement("a", { "data-tooltip": __('Select.clear'), "data-position": "bottom", onClick: _this_1.removeFile.bind(_this_1, file, key) },
                                        React__default["default"].createElement(amisUi.Icon, { icon: "remove", className: "icon" }))) : null)))) : file.state === 'uploading' ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement("a", { onClick: _this_1.removeFile.bind(_this_1, file, key), key: "clear", className: cx('ImageControl-itemClear'), "data-tooltip": __('Select.clear') },
                                React__default["default"].createElement(amisUi.Icon, { icon: "close", className: "icon" })),
                            React__default["default"].createElement("div", { key: "info", className: cx('ImageControl-itemInfo', fixedSize ? 'ImageControl-fixed-size' : '', fixedSize ? fixedSizeClassName : '') },
                                React__default["default"].createElement("div", { className: cx('ImageControl-progress') },
                                    React__default["default"].createElement("span", { style: {
                                            width: "".concat(Math.round(file.progress * 100), "%")
                                        }, className: cx('ImageControl-progressValue') })),
                                React__default["default"].createElement("p", null, __('File.uploading'))))) : (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement(Image$1["default"], { key: "image", className: cx('ImageControl-image', fixedSize ? 'Image-thumb--fixed-size' : ''), onLoad: _this_1.handleImageLoaded.bind(_this_1, key), src: file.preview || file.url, alt: file.name, thumbMode: thumbMode, thumbRatio: thumbRatio, overlays: React__default["default"].createElement(React__default["default"].Fragment, null,
                                    React__default["default"].createElement("a", { "data-tooltip": __('Image.zoomIn'), "data-position": "bottom", target: "_blank", rel: "noopener", href: file.url || file.preview, onClick: _this_1.previewImage.bind(_this_1, file, key) },
                                        React__default["default"].createElement(amisUi.Icon, { icon: "view", className: "icon" })),
                                    !!crop &&
                                        reCropable !== false &&
                                        !disabled ? (React__default["default"].createElement("a", { "data-tooltip": __('Image.crop'), "data-position": "bottom", onClick: _this_1.editImage.bind(_this_1, key) },
                                        React__default["default"].createElement(amisUi.Icon, { icon: "pencil", className: "icon" }))) : null,
                                    !disabled ? (React__default["default"].createElement("a", { "data-tooltip": __('Select.upload'), "data-position": "bottom", onClick: function () {
                                            return _this_1.handleReSelect(key);
                                        } },
                                        React__default["default"].createElement(amisUi.Icon, { icon: "upload", className: "icon" }))) : null,
                                    !disabled ? (React__default["default"].createElement("a", { "data-tooltip": __('Select.clear'), "data-position": "bottom", onClick: _this_1.removeFile.bind(_this_1, file, key) },
                                        React__default["default"].createElement(amisUi.Icon, { icon: "remove", className: "icon" }))) : null) }))))); })
                        : null,
                    (multiple && (!maxLength || files.length < maxLength)) ||
                        (!multiple && !files.length) ? (React__default["default"].createElement("label", { className: cx('ImageControl-addBtn', {
                            'is-disabled': disabled
                        }, fixedSize ? 'ImageControl-fixed-size' : '', fixedSize ? fixedSizeClassName : ''), style: frameImageStyle, onClick: _this_1.handleSelect, "data-tooltip": __(placeholder), "data-position": "right", ref: _this_1.frameImageRef },
                        filterFrameImage ? (React__default["default"].createElement(Image$1["default"], { key: "upload-default-image", src: filterFrameImage, className: cx(fixedSize ? 'Image-thumb--fixed-size' : ''), onLoad: _this_1.handleFrameImageLoaded.bind(_this_1), thumbMode: thumbMode, thumbRatio: thumbRatio })) : (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement(amisUi.Icon, { icon: "plus-fine", className: "icon" }),
                            React__default["default"].createElement("span", { className: cx('ImageControl-addBtn-text') }, __('Image.upload')))),
                        isFocused ? (React__default["default"].createElement("span", { className: cx('ImageControl-pasteTip') }, __('Image.pasteTip'))) : null)) : null,
                    !autoUpload && !hideUploadButton && files.length ? (React__default["default"].createElement(amisUi.Button, { level: "default", className: cx('ImageControl-uploadBtn'), disabled: !hasPending, onClick: _this_1.toggleUpload }, __(uploading ? 'File.pause' : 'File.start'))) : null,
                    error ? (React__default["default"].createElement("div", { className: cx('ImageControl-errorMsg') }, error)) : null))));
        }))));
    };
    ImageControl.defaultProps = {
        limit: undefined,
        accept: 'image/jpeg, image/jpg, image/png, image/gif',
        receiver: '/api/upload',
        hideUploadButton: false,
        placeholder: 'Image.placeholder',
        joinValues: true,
        extractValue: false,
        delimiter: ',',
        autoUpload: true,
        multiple: false,
        dropCrop: true
    };
    return ImageControl;
}(React__default["default"].Component));
var ImageControlRenderer = /** @class */ (function (_super) {
    tslib.__extends(ImageControlRenderer, _super);
    function ImageControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageControlRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'input-image',
            sizeMutable: false
        })
    ], ImageControlRenderer);
    return ImageControlRenderer;
}(ImageControl));

exports.ImageControlRenderer = ImageControlRenderer;
exports["default"] = ImageControl;
