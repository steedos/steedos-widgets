export default {
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
