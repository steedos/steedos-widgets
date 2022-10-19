/**
 * amis-core v2.3.1
 * Copyright 2018-2022 fex
 */

import { __assign } from 'tslib';
import isPlainObject from 'lodash/isPlainObject';
import { keyToPath } from './keyToPath.js';

// 方便取值的时候能够把上层的取到，但是获取的时候不会全部把所有的数据获取到。
function createObject(superProps, props, properties) {
    if (superProps && Object.isFrozen(superProps)) {
        superProps = cloneObject(superProps);
    }
    var obj = superProps
        ? Object.create(superProps, __assign(__assign({}, properties), { __super: {
                value: superProps,
                writable: false,
                enumerable: false
            } }))
        : Object.create(Object.prototype, properties);
    props &&
        isObject(props) &&
        Object.keys(props).forEach(function (key) { return (obj[key] = props[key]); });
    return obj;
}
function cloneObject(target, persistOwnProps) {
    if (persistOwnProps === void 0) { persistOwnProps = true; }
    var obj = target && target.__super
        ? Object.create(target.__super, {
            __super: {
                value: target.__super,
                writable: false,
                enumerable: false
            }
        })
        : Object.create(Object.prototype);
    persistOwnProps &&
        target &&
        Object.keys(target).forEach(function (key) { return (obj[key] = target[key]); });
    return obj;
}
function extendObject(target, src, persistOwnProps) {
    if (persistOwnProps === void 0) { persistOwnProps = true; }
    var obj = cloneObject(target, persistOwnProps);
    src && Object.keys(src).forEach(function (key) { return (obj[key] = src[key]); });
    return obj;
}
function isObject(obj) {
    var typename = typeof obj;
    return (obj &&
        typename !== 'string' &&
        typename !== 'number' &&
        typename !== 'boolean' &&
        typename !== 'function' &&
        !Array.isArray(obj));
}
function setVariable(data, key, value, convertKeyToPath) {
    data = data || {};
    if (key in data) {
        data[key] = value;
        return;
    }
    var parts = convertKeyToPath !== false ? keyToPath(key) : [key];
    var last = parts.pop();
    while (parts.length) {
        var key_1 = parts.shift();
        if (isPlainObject(data[key_1])) {
            data = data[key_1] = __assign({}, data[key_1]);
        }
        else if (Array.isArray(data[key_1])) {
            data[key_1] = data[key_1].concat();
            data = data[key_1];
        }
        else if (data[key_1]) {
            // throw new Error(`目标路径不是纯对象，不能覆盖`);
            // 强行转成对象
            data[key_1] = {};
            data = data[key_1];
        }
        else {
            data[key_1] = {};
            data = data[key_1];
        }
    }
    data[last] = value;
}
function deleteVariable(data, key) {
    if (!data) {
        return;
    }
    else if (data.hasOwnProperty(key)) {
        delete data[key];
        return;
    }
    var parts = keyToPath(key);
    var last = parts.pop();
    while (parts.length) {
        var key_2 = parts.shift();
        if (isPlainObject(data[key_2])) {
            data = data[key_2] = __assign({}, data[key_2]);
        }
        else if (data[key_2]) {
            throw new Error("\u76EE\u6807\u8DEF\u5F84\u4E0D\u662F\u7EAF\u5BF9\u8C61\uFF0C\u4E0D\u80FD\u4FEE\u6539");
        }
        else {
            break;
        }
    }
    if (data && data.hasOwnProperty && data.hasOwnProperty(last)) {
        delete data[last];
    }
}
export { cloneObject, createObject, deleteVariable, extendObject, isObject, setVariable };
