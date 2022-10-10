/**
 * amis v2.3.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var amisCore = require('amis-core');
var amisUi = require('amis-ui');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

amisCore.extendDefaultEnv({
    alert: amisUi.alert,
    confirm: amisUi.confirm,
    notify: function (type, msg, conf) {
        return amisUi.toast[type] ? amisUi.toast[type](msg, conf) : console.warn('[Notify]', type, msg);
    }
});
amisUi.setRenderSchemaFn(function (controls, value, callback, scopeRef, theme) {
    return amisCore.render({
        name: 'form',
        type: 'form',
        wrapWithPanel: false,
        mode: 'horizontal',
        controls: controls,
        messages: {
            validateFailed: ''
        }
    }, {
        data: value,
        onFinished: callback,
        scopeRef: scopeRef,
        theme: theme
    }, {
        session: 'prompt'
    });
});
amisCore.addRootWrapper(function (props) {
    var env = props.env, children = props.children;
    return (React__default["default"].createElement(amisUi.ImageGallery, { modalContainer: env.getModalContainer }, children));
});
var SimpleSpinner = amisCore.themeable(function (props) {
    var cx = props.classnames;
    return (React__default["default"].createElement("div", { "data-testid": "spinner", className: cx("Spinner", 'in', props.className) },
        React__default["default"].createElement("div", { className: cx("Spinner-icon", 'Spinner-icon--default', props.spinnerClassName) })));
});
amisCore.LazyComponent.defaultProps.placeholder = React__default["default"].createElement(SimpleSpinner, null);
