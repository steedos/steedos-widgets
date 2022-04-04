module.exports = ({ context, onGetWebpackConfig }) => {
  // 这里面可以写哪些，具体请查看插件开发章节
  onGetWebpackConfig((config) => {
    console.log(config)

    if (!config.module.rules)
      config.module.rules = []
    config.module.rules.push({
      test: /\.less$/,
      use: [
        { 
          loader: 'style-loader', 
        }, 
        { 
          loader: 'css-loader', 
        }, 
        { 
          loader: 'less-loader',
          options: {
            lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
              javascriptEnabled: true,
              modifyVars: {
                'root-entry-name': 'default',
                'primary-color-hover': 'blue'
              } 
            },
          },
        },
      ],
    });
  });
}