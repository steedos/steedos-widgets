const path = require('path');

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
        (rule) => !String(rule.test).includes('.css')
      ),
      {
        test: /\.module\.css$/,
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
        include: [ 
          path.resolve(__dirname, '../stories'),
          path.resolve(__dirname, '../packages'),
        ],
      },
    ];

    return config;
  },
}