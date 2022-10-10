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
var mobxStateTree = require('mobx-state-tree');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _a;
var Store = amisCore.StoreNode.named('MappingStore')
    .props({
    fetching: false,
    errorMsg: '',
    map: mobxStateTree.types.frozen({})
})
    .actions(function (self) {
    var load = mobxStateTree.flow(function (env, api, data) {
        var ret, data_1, e_1;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    self.fetching = true;
                    return [4 /*yield*/, env.fetcher(api, data)];
                case 1:
                    ret = _a.sent();
                    if (ret.ok) {
                        data_1 = amisCore.normalizeApiResponseData(ret.data);
                        self.setMap(data_1);
                    }
                    else {
                        throw new Error(ret.msg || 'fetch error');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _a.sent();
                    self.errorMsg = e_1.message;
                    return [3 /*break*/, 4];
                case 3:
                    self.fetching = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
    return {
        load: load,
        setMap: function (options) {
            if (amisCore.isObject(options)) {
                self.map = tslib.__assign({}, options);
            }
        }
    };
});
var MappingField = amisUi.withStore(function (props) {
    return Store.create({
        id: amisCore.guid(),
        storeType: Store.name
    }, props.env);
})((_a = /** @class */ (function (_super) {
        tslib.__extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            props.store.syncProps(props, undefined, ['map']);
            return _this;
        }
        class_1.prototype.componentDidMount = function () {
            var _a = this.props; _a.store; _a.source; _a.data;
            this.reload();
        };
        class_1.prototype.componentDidUpdate = function (prevProps) {
            var props = this.props;
            var _a = this.props, store = _a.store, source = _a.source, data = _a.data;
            store.syncProps(props, prevProps, ['map']);
            if (amisCore.isPureVariable(source)) {
                var prev = amisCore.resolveVariableAndFilter(prevProps.source, prevProps.data, '| raw');
                var curr = amisCore.resolveVariableAndFilter(source, data, '| raw');
                if (prev !== curr) {
                    store.setMap(curr);
                }
            }
            else if (amisCore.isApiOutdated(prevProps.source, props.source, prevProps.data, props.data)) {
                this.reload();
            }
        };
        class_1.prototype.reload = function () {
            var _a;
            var _b = this.props, source = _b.source, data = _b.data, env = _b.env;
            var store = this.props.store;
            if (amisCore.isPureVariable(source)) {
                store.setMap(amisCore.resolveVariableAndFilter(source, data, '| raw'));
            }
            else if (amisCore.isEffectiveApi(source, data)) {
                var api = amisCore.normalizeApi(source, 'get');
                api.cache = (_a = api.cache) !== null && _a !== void 0 ? _a : 30 * 1000;
                store.load(env, api, data);
            }
        };
        class_1.prototype.renderSingleValue = function (key, reactKey) {
            var _a;
            var _b = this.props, className = _b.className, placeholder = _b.placeholder, render = _b.render, cx = _b.classnames; _b.name; _b.data; var store = _b.store;
            var viewValue = (React__default["default"].createElement("span", { className: "text-muted" }, placeholder));
            var map = store.map;
            var value = undefined;
            // trim 一下，干掉一些空白字符。
            key = typeof key === 'string' ? key.trim() : key;
            if (typeof key !== 'undefined' &&
                map &&
                (value =
                    (_a = map[key]) !== null && _a !== void 0 ? _a : (key === true && map['1']
                        ? map['1']
                        : key === false && map['0']
                            ? map['0']
                            : map['*'])) !== undefined) {
                viewValue = render('tpl', value);
            }
            return (React__default["default"].createElement("span", { key: "map-".concat(reactKey), className: cx('MappingField', className) }, viewValue));
        };
        class_1.prototype.render = function () {
            var _this = this;
            var mapKey = amisCore.getPropValue(this.props);
            if (Array.isArray(mapKey)) {
                return (React__default["default"].createElement("span", null, mapKey.map(function (singleKey, index) {
                    return _this.renderSingleValue(singleKey, index);
                })));
            }
            else {
                return this.renderSingleValue(mapKey, 0);
            }
        };
        return class_1;
    }(React__default["default"].Component)),
    _a.defaultProps = {
        placeholder: '-',
        map: {
            '*': '通配值'
        }
    },
    _a));
/** @class */ ((function (_super) {
    tslib.__extends(MappingFieldRenderer, _super);
    function MappingFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MappingFieldRenderer.prototype.render = function () {
        return React__default["default"].createElement(MappingField, tslib.__assign({}, this.props));
    };
    MappingFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            test: /(^|\/)(?:map|mapping)$/,
            name: 'mapping'
        })
    ], MappingFieldRenderer);
    return MappingFieldRenderer;
})(React__default["default"].Component));

exports.MappingField = MappingField;
exports.Store = Store;
