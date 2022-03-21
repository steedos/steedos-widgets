(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Meta = factory());
})(this, (function () { 'use strict';

    var components = [];
    var componentList = [
        {
            title: "Design System",
            icon: "",
            children: []
        }
    ];
    var meta = {
        componentList: componentList,
        components: components
    };

    return meta;

}));
