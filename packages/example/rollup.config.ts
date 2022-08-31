import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import visualizer from 'rollup-plugin-visualizer';
import builtins from 'rollup-plugin-node-builtins';
import path from 'path';

const rollupPostcssLessLoader = require('rollup-plugin-postcss-webpack-alias-less-loader');
const pkg = require('./package.json');

const external = [
  "react",
  "react-dom"
]

const globals = { 
  react: 'React',
  'react-dom': 'ReactDOM'
}

const options = {
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [,
    builtins(),
    json(),
    // resolve(),
    nodeResolve({
      extensions: [ '.jsx', '.js', '.json', '.node' ],
      browser: true, 
      preferBuiltins: false,
      resolveOnly: [  ]
    }),
    // Compile TypeScript files
    typescript({ 
      // useTsconfigDeclarationDir: true 
    }),
    commonjs({
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: '**/node_modules/**',
      presets: ["@babel/preset-react", "@babel/preset-env"],
      plugins: [
        ["@babel/plugin-proposal-class-properties"],
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        ["@babel/plugin-transform-runtime", {
          "regenerator": true,
          "corejs": false,
        }]
      ]
    }),
    postcss({
      loaders: [rollupPostcssLessLoader({
        nodeModulePath: path.resolve('../../node_modules'),
        aliases: {
          '~': path.resolve('../../node_modules'),
        }
      })],
      use: [["less", { 
        javascriptEnabled: true,
        modifyVars: {
          'root-entry-name': 'default'
        } 
      }]],
      extract: true,
      // minimize: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      'document.body.clientWidth': 'document.body && document.body.clientWidth',
    }),
  ],
};

export default [
  {
    ...options,
    input: `src/index.ts`,
    external,
    output: [
      {
        file: 'dist/example.umd.js',
        name: 'BuilderExample',
        format: 'umd',
        sourcemap: false,
        strict: false,
        intro: 'const global = window;',
        globals,
      },
    ],
    plugins: options.plugins.concat([
      visualizer({
        filename: './stats.html'
      })
    ]),
  },
  // meta build
  {
    input: `src/meta.ts`,
    plugins: [
      typescript(),
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
          }
      }
    ],
    output: {
      file: "dist/meta.js",
      format: "umd",
      name: "BuilderExampleWidgetsMeta",
      sourcemap: false
    }
  },
];
