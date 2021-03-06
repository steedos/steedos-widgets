import commonjs from '@rollup/plugin-commonjs';
import resolve, {nodeResolve} from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import regexReplace from 'rollup-plugin-re';
import replace from 'rollup-plugin-replace';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel'
import path from 'path';
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg';
import alias from '@rollup/plugin-alias';
import visualizer from 'rollup-plugin-visualizer'
import uglify from "@lopatnov/rollup-plugin-uglify";
import builtins from 'rollup-plugin-node-builtins';

const rollupPostcssLessLoader = require('rollup-plugin-postcss-webpack-alias-less-loader')

const libraryName = 'builder-widgets';

const external = [
  "react",
  "react-dom",
  'lodash',
]
const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'lodash': '_',
}

const options = {
  input: `src/${libraryName}.tsx`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    svg(),
    builtins(),
    nodeResolve({
      browser: true,
      // preferBuiltins:true,
    }),
    typescript({}),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    postcss({
      config: false,
      loaders: [rollupPostcssLessLoader({
        nodeModulePath: path.resolve('../../node_modules'),
        aliases: {
          '~': path.resolve('../../node_modules'),
        }
      })],
      use: [["less", { javascriptEnabled: true }]],
      extract: true,
    }),
    

    babel({
      babelHelpers: "bundled",
    }),
    
    // Compile TypeScript files
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
    }),
  ],
};

export default [
  {
    ...options,
    output: {
      format: 'umd',
      file: `dist/${libraryName}.umd.js`,
      name: 'DesignSystem',
      sourcemap: false,
      globals
    },
    external,
    plugins: options.plugins.concat([
      visualizer({
        filename: 'stats.html'
      }),
      uglify(), 
      // sourceMaps()
    ]),
  },
  // meta build
  {
    input: `src/meta.ts`,
    plugins: [typescript()],
    output: {
      file: "dist/meta.js",
      format: "umd",
      name: "DesignSystemMeta",
      sourcemap: false
    }
  },
];
