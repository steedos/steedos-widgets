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
      package: "@steedos-ui/builder-widgets",
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
        package: "@steedos-ui/builder-widgets"
      },
      url: "https://unpkg.com/@steedos-ui/steedos-object/dist/meta.js",
      urls: {
        default: "https://unpkg.com/@steedos-widgets/steedos-object/dist/meta.js",
        design: "https://unpkg.com/@steedos-widgets/steedos-object/dist/meta.js"
      }
    }
  ]
};
