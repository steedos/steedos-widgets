(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Assets = factory());
})(this, (function () { 'use strict';

    var _a = require('../package.json'), name = _a.name; _a.version;
    var exportName = "DesignSystem";
    var assets = {
        packages: [
            {
                package: name,
                urls: [
                    "https://unpkg.com/".concat(name, "/dist/builder-widgets.umd.js"),
                    "https://unpkg.com/".concat(name, "/dist/builder-widgets.umd.css")
                ],
                library: exportName,
            }
        ],
        components: [
        // {
        //   exportName: `${exportName}Meta`,
        //   npm: {
        //     package: name,
        //     version
        //   },
        //   url: `https://unpkg.com/${name}/dist/meta.js`,
        //   urls: {
        //     default: `https://unpkg.com/${name}/dist/meta.js`,
        //     design: `https://unpkg.com/${name}/dist/meta.js`
        //   }
        // }
        ]
    };

    return assets;

}));
