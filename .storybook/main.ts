const path = require('path');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
require('dotenv-flow').config();

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  reactOptions: {
    legacyRootApi: false,
  },
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config) => {
    config.module.rules = [
      ...config.module.rules.filter(
        (rule) => { return !String(rule.test).includes('.css')}
      ),
      {
        test: /\.module.css$/,
        sideEffects: true,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-simple-vars', 'postcss-nested'],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-simple-vars', 'postcss-nested'],
              },
            },
          },
        ],
        exclude: /\.module\.css$/,
      },
    ];


    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "../tsconfig.json"),
      })
    );
    
    return config;
  },
}