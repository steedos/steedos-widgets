import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';

require('dotenv-flow').config();

const pkg = require('./package.json');

const exportName = 'BuilderAgGrid';

const unpkgUrl = process.env.STEEDOS_UNPKG_URL ? process.env.STEEDOS_UNPKG_URL : 'https://unpkg.com'

const external = [
  "react",
  "react-dom",
  'lodash',
  // 'ag-grid',
  // 'ag-grid-enterprise',
  // 'ag-grid-community',
  // 'ag-grid-react',
]

const globals = { 
  react: 'React',
  'react-dom': 'ReactDOM',
  'lodash': '_',
  // 'ag-grid': 'AgGrid',
}

const options = {
  input: `src/index.ts`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    nodePolyfills(),
    nodeResolve(),
    json(),
    typescript({ 
    }),
    commonjs({
    }),
    postcss({
      extract: true,
      plugins: [require('postcss-simple-vars'), require('postcss-nested')],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser()
  ],
};

export default [
  // React CJS
  // {
  //   ...options,
  //   output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
  //   plugins: options.plugins.concat([]),
  // },
  // ES
  // {
  //   ...options,
  //   output: [{ file: pkg.module, format: 'es', sourcemap: true }],
  //   plugins: options.plugins.concat([]),
  // },
  {
    ...options,
    external,
    output: [
      {
        file: pkg.unpkg,
        name: exportName,
        format: 'umd',
        sourcemap: false,
        strict: false,
        intro: 'const global = window;',
        globals,
        plugins: [getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [['@babel/preset-env', { modules: 'umd' }]],
        })]
      },
    ],
  },
  // meta build
  {
    input: `src/meta.ts`,
    plugins: [
      typescript({ 
      }),
      {
          name: 'assets',
          generateBundle(outputOptions, bundle) {
              // assets build
              const assets = require('./src/assets.json')
              const amis = JSON.stringify(assets, null, 4).replace(/\{\{version\}\}/g, `${pkg.version}`)
              this.emitFile({
                 type: 'asset',
                 fileName: 'assets.json',
                 source: amis
              });
              const amisDev = JSON.stringify(assets, null, 4).replace(/\@\{\{version\}\}/g, ``).replace(/https\:\/\/unpkg.com/g, unpkgUrl)
              this.emitFile({
                 type: 'asset',
                 fileName: 'assets-dev.json',
                 source: amisDev
              });
          }
      }
    ],
    output: {
      file: "dist/meta.js",
      format: "umd",
      name: exportName + 'Meta',
      sourcemap: false
    }
  },
];
