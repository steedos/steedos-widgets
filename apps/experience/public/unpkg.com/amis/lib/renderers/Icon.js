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
var icons = require('amis-ui/lib/components/icons');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Icon = /** @class */ (function (_super) {
    tslib.__extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Icon.prototype.render = function () {
        var _a = this.props, vendor = _a.vendor, cx = _a.classnames, className = _a.className, data = _a.data;
        var icon = this.props.icon;
        icon = amisCore.filter(icon, data);
        var CustomIcon = icons.getIcon(icon);
        if (CustomIcon) {
            return React__default["default"].createElement(CustomIcon, { className: cx(className, "icon-".concat(icon)) });
        }
        var isURLIcon = (icon === null || icon === void 0 ? void 0 : icon.indexOf('.')) !== -1;
        var iconPrefix = '';
        if (vendor === 'iconfont') {
            iconPrefix = "iconfont icon-".concat(icon);
        }
        else if (vendor === 'fa') {
            //默认是fontawesome v4，兼容之前配置
            iconPrefix = "".concat(vendor, " ").concat(vendor, "-").concat(icon);
        }
        else {
            // 如果vendor为空，则不设置前缀,这样可以支持fontawesome v5、fontawesome v6或者其他框架
            iconPrefix = "".concat(icon);
        }
        return isURLIcon ? (React__default["default"].createElement("img", { className: cx('Icon'), src: icon })) : (React__default["default"].createElement("i", { className: cx(iconPrefix, className) }));
    };
    Icon.defaultProps = {
        icon: '',
        vendor: 'fa'
    };
    return Icon;
}(React__default["default"].Component));
/** @class */ ((function (_super) {
    tslib.__extends(IconRenderer, _super);
    function IconRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'icon'
        })
        // @ts-ignore 类型没搞定
        ,
        amisUi.withBadge
    ], IconRenderer);
    return IconRenderer;
})(Icon));

exports.Icon = Icon;
