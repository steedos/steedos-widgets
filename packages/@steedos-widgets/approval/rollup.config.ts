import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import path from 'path';

const rollupPostcssLessLoader = require('rollup-plugin-postcss-webpack-alias-less-loader');

const external = [
  'react',
  'react-dom',
  'antd',
  'lodash',
  '@ant-design/icons',
];

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  antd: 'antd',
  lodash: '_',
  '@ant-design/icons': 'icons',
};

const options = {
  external,
  watch: {
    include: 'src/**',
  },
  plugins: [
    builtins(),
    json(),
    nodeResolve({
      extensions: ['.jsx', '.js', '.json', '.node'],
      browser: true,
      preferBuiltins: false,
    }),
    typescript({}),
    commonjs({}),
    babel({
      babelHelpers: 'runtime',
      exclude: '**/node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env'],
      plugins: [
        ['@babel/plugin-proposal-class-properties'],
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: true,
            corejs: false,
          },
        ],
      ],
    }),
    postcss({
      loaders: [
        rollupPostcssLessLoader({
          nodeModulePath: path.resolve('../../node_modules'),
          aliases: {
            '~': path.resolve('../../node_modules'),
          },
        }),
      ],
      use: [
        [
          'less',
          {
            javascriptEnabled: true,
            modifyVars: {
              'root-entry-name': 'default',
            },
          },
        ],
      ],
      extract: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'document.body.clientWidth':
        'document.body && document.body.clientWidth',
    }),
  ],
};

export default [
  {
    ...options,
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/approval.umd.js',
        name: 'BuilderApproval',
        format: 'umd',
        sourcemap: false,
        strict: false,
        intro: 'const global = window;',
        globals,
      },
    ],
  },
];
