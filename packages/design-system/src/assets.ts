const { name, version} = require('../package.json');

const exportName = "DesignSystem"

export default {
  packages: [
    {
      package: name,
      urls: [
        `https://unpkg.com/${name}/dist/builder-widgets.umd.js`,
        `https://unpkg.com/${name}/dist/builder-widgets.umd.css`
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
