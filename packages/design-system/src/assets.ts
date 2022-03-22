const exportName = "DesignSystem"

export default {
  packages: [
    {
      package: '@steedos-widgets/design-system',
      urls: [
        `https://unpkg.com/@steedos-widgets/design-system/dist/builder-widgets.umd.js`,
        `https://unpkg.com/@steedos-widgets/design-system/dist/builder-widgets.umd.css`
      ],
      library: exportName,
    }
  ],
  components: [
    {
      exportName: `${exportName}Meta`,
      npm: {
        package: '@steedos-widgets/design-system',
      },
      url: `https://unpkg.com/@steedos-widgets/design-system/dist/meta.js`,
      urls: {
        default: `https://unpkg.com/@steedos-widgets/design-system/dist/meta.js`,
        design: `https://unpkg.com/@steedos-widgets/design-system/dist/meta.js`
      }
    }
  ]
};
