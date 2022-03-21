import { name, version} from '../package.json';

const exportName = "DesignSystemReactWidgets"

export default {
  packages: [
    {
      package: name,
      urls: [`https://unpkg.com/${name}/dist/builder-widgets.umd.js`],
      library: exportName,
    }
  ],
  components: [
    {
      exportName: `${exportName}Meta`,
      npm: {
        package: name,
        version
      },
      url: `https://unpkg.com/${name}/dist/meta.js`,
      urls: {
        default: `https://unpkg.com/${name}/dist/meta.js`,
        design: `https://unpkg.com/${name}/dist/meta.js`
      }
    }
  ]
};
