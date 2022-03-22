(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Assets = factory());
})(this, (function () { 'use strict';

  var assets = {
      packages: [
          {
              package: "@steedos-widgets/design-system",
              urls: [
                  "https://unpkg.com/@steedos-widgets/design-system/dist/builder-widgets.umd.js",
              ],
              library: "DesignSystem"
          },
          {
              package: "@steedos-widgets/steedos-object",
              urls: [
                  "https://unpkg.com/@steedos-widgets/steedos-object/dist/builder-widgets.umd.js",
                  "https://unpkg.com/@steedos-widgets/steedos-object/dist/builder-widgets.umd.css"
              ],
              library: "BuilderWidgets"
          }
      ],
      components: [
          {
              exportName: "BuilderWidgetsMeta",
              npm: {
                  package: "@steedos-widgets/steedos-object"
              },
              url: "https://unpkg.com/@steedos-widgets/steedos-object/dist/meta.js",
              urls: {
                  default: "https://unpkg.com/@steedos-widgets/steedos-object/dist/meta.js",
                  design: "https://unpkg.com/@steedos-widgets/steedos-object/dist/meta.js"
              }
          }
      ]
  };

  return assets;

}));
