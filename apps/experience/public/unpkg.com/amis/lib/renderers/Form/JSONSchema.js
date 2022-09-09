/**
 * amis v2.2.0
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

var EnhancedInputJSONSchema = amisUi.withRemoteConfig({
    sourceField: 'schema',
    injectedPropsFilter: function (injectedProps, props) {
        return {
            schema: injectedProps.config,
            loading: injectedProps.loading
        };
    }
})(amisUi.InputJSONSchema);
var JSONSchemaControl = /** @class */ (function (_super) {
    tslib.__extends(JSONSchemaControl, _super);
    function JSONSchemaControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONSchemaControl.prototype.render = function () {
        var rest = tslib.__rest(this.props, []);
        return React__default["default"].createElement(EnhancedInputJSONSchema, tslib.__assign({}, rest));
    };
    return JSONSchemaControl;
}(React__default["default"].PureComponent));
/** @class */ ((function (_super) {
    tslib.__extends(JSONSchemaRenderer, _super);
    function JSONSchemaRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONSchemaRenderer = tslib.__decorate([
        amisCore.FormItem({
            type: 'json-schema',
            strictMode: false
        })
    ], JSONSchemaRenderer);
    return JSONSchemaRenderer;
})(JSONSchemaControl));

exports["default"] = JSONSchemaControl;
