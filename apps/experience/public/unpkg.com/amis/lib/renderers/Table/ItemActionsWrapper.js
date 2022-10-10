/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mobxReact = require('mobx-react');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ItemActionsWrapper(props) {
    var _a;
    var cx = props.classnames;
    var children = props.children;
    var store = props.store;
    var divRef = React.useRef(null);
    React.useEffect(function () {
        var _a;
        var row = store.hoverRow;
        if (!row) {
            return;
        }
        var frame = (_a = divRef.current.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('table');
        var dom = frame === null || frame === void 0 ? void 0 : frame.querySelector("tr[data-id=\"".concat(row.id, "\"]"));
        if (!dom) {
            return;
        }
        var rect = dom.getBoundingClientRect();
        var height = rect.height;
        var top = rect.top - frame.getBoundingClientRect().top;
        divRef.current.style.cssText += "top: ".concat(top, "px;height: ").concat(height, "px;");
    }, [(_a = store.hoverRow) === null || _a === void 0 ? void 0 : _a.id]);
    return (React__default["default"].createElement("div", { className: cx('Table-itemActions-wrap'), ref: divRef }, children));
}
var ItemActionsWrapper$1 = mobxReact.observer(ItemActionsWrapper);

exports["default"] = ItemActionsWrapper$1;
