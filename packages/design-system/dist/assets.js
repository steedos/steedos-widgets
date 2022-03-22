(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Assets = factory());
})(this, (function () { 'use strict';

    var exportName = "DesignSystem";
    var assets = {
        packages: [
            {
                package: '@steedos-widgets/design-system',
                urls: [
                    "https://unpkg.com/@steedos-widgets/design-system/dist/builder-widgets.umd.js",
                    "https://unpkg.com/@steedos-widgets/design-system/dist/builder-widgets.umd.css"
                ],
                library: exportName,
            }
        ],
        components: [
            {
                exportName: "".concat(exportName, "Meta"),
                npm: {
                    package: '@steedos-widgets/design-system',
                },
                url: "https://unpkg.com/@steedos-widgets/design-system/dist/meta.js",
                urls: {
                    default: "https://unpkg.com/@steedos-widgets/design-system/dist/meta.js",
                    design: "https://unpkg.com/@steedos-widgets/design-system/dist/meta.js"
                }
            }
        ]
    };

    return assets;

}));
