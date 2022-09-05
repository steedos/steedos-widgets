const postcss = require('rollup-plugin-postcss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        inject: true, // 这里改为了 true
        extract: false, //!!options.writeMeta,
      }),
    );
    return config;
  },
}