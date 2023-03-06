/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 10:47:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-14 13:59:31
 * @Description: 
 */
const path = require('path');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
require('dotenv-flow').config({path: path.join(__dirname, '../')});

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  staticDirs: ['../apps/experience/public'],
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