import commonjs from '@rollup/plugin-commonjs';
import resolve, {nodeResolve} from '@rollup/plugin-node-resolve';
import json from 'rollup-plugin-json';
import regexReplace from 'rollup-plugin-re';
import replace from 'rollup-plugin-replace';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel'
import path from 'path';
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg';
import image from '@rollup/plugin-image';
import alias from '@rollup/plugin-alias';
import visualizer from 'rollup-plugin-visualizer'
import uglify from "@lopatnov/rollup-plugin-uglify";
import builtins from 'rollup-plugin-node-builtins';

const rollupPostcssLessLoader = require('rollup-plugin-postcss-webpack-alias-less-loader')

const pkg = require('./package.json');

const libraryName = 'builder-widgets';

const resolvePlugin = resolve();

const externalDependencies = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.optionalDependencies || {}))
  .concat(Object.keys(pkg.peerDependencies || {}))
  .filter(name => !name.startsWith('lodash'));
// console.log(externalDependencies)


const external = [
  "react",
  "react-dom",
  'vm2',
  'lodash',
  "@steedos-builder/sdk",
  "@steedos-builder/react",
  // "@salesforce-ux/design-system/",
  "@steedos-widgets/design-system",
  // "@chakra-ui/react",
  // "antd",
]
const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'lodash': '_',
  '@steedos-builder/sdk': 'BuilderSDK',
  '@steedos-builder/react': 'BuilderReact',
  "@steedos-widgets/design-system": 'DesignSystem',
}

const options = {
  input: `src/${libraryName}.tsx`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  watch: {
    include: 'src/**',
  },
  plugins: [
    builtins(),
    nodeResolve({
      browser: true,
      // preferBuiltins:true,
    }),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // Allow json resolution
    json(),
    image(),
    svg(),
    postcss({
      config: false,
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
    }),
    

    babel({
      babelHelpers: "bundled",
    }),
    
    // babel({
    //   include: [
    //     'node_modules/@salesforce/design-system-react/**',
    //     'node_modules/antd/**',
    //     'node_modules/@ant-design/**'
    //   ],
    //   // exclude: 'node_modules/',
    //   exclude: [
    //     "node_modules/tslib/**", 
    //   ],
    //   presets: ["@babel/preset-react", "@babel/preset-env"],
    //   plugins: [
    //     ['import', { libraryName: 'antd', style: true, "libraryDirectory": "es" }, 'antd'],
    //     ['import', { libraryName: 'lodash' }, 'lodash'],
    //     ["@babel/plugin-proposal-class-properties", { loose: true }],
    //     '@babel/plugin-proposal-object-rest-spread',
    //     '@babel/plugin-proposal-export-default-from',
    //     '@babel/plugin-proposal-export-namespace-from',
    //   ]
    // }),

    // Compile TypeScript files
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      // exclude: [
      //   '../../node_modules/tslib/**',
      // ],
      // include: [
        
      //   '../../node_modules/**',
      // ],
      // namedExports: {
      //   react: Object.keys(react),
      //   'react-dom': Object.keys(reactDom),
      //   'react-is': Object.keys(reactIs),
      //   'prop-types': Object.keys(propTypes),
      // },
    }),
    // Resolve source maps to the original source
    // sourceMaps(),
  ],
};

export default [
  // {
  //   ...options,
  //   external,
  //   output: [
  //     { 
  //       file: 'dist/builder-widgets.react.js', 
  //       format: 'cjs', 
  //       sourcemap: false,
  //       strict: false,
  //       globals,
  //     }
  //   ],
  //   plugins: options.plugins.concat([
  //     // sourceMaps(),
  //   ]),
  // },
  {
    ...options,
    output: {
      format: 'umd',
      file: 'dist/builder-widgets.umd.js',
      name: 'SteedosObjectWidgets',
      sourcemap: false,
      globals
    },
    external,
    plugins: options.plugins.concat([
      visualizer({
        filename: 'stats.html'
      }),
      // uglify(), 
      // sourceMaps()
    ]),
  },
  // {
  //   ...options,
  //   output: [
  //     { file: pkg.module, format: 'es', sourcemap: true },
  //     { file: pkg.main, format: 'cjs', sourcemap: true },
  //   ],
  //   // Do not resolve for es module build
  //   // TODO: should really do a cjs build too (probably for the default build instead of umd...)
  //   external: externalDependencies,
  //   plugins: options.plugins
  //     .filter(plugin => plugin !== resolvePlugin)
  //     .concat([
  //       resolve({
  //         only: [/^\.{0,2}\//, /lodash\-es/],
  //       }),
  //     ]),
  // },
  // {
  //   ...options,
  //   input: 'src/builder-widgets-async.tsx',
  //   output: [{ dir: 'dist/builder-widgets-async', format: 'es', sourcemap: true }],
  //   // Do not resolve for es module build
  //   // TODO: should really do a cjs build too (probably for the default build instead of umd...)
  //   external: externalDependencies,
  //   plugins: options.plugins
  //     .filter(plugin => plugin !== resolvePlugin)
  //     .concat([
  //       resolve({
  //         only: [/^\.{0,2}\//, /lodash\-es/],
  //       }),
  //     ]),
  // },
  // meta build
  {
    input: `src/meta.ts`,
    plugins: [typescript()],
    output: {
      file: "dist/meta.js",
      format: "umd",
      name: "SteedosObjectWidgetsMeta",
      sourcemap: false
    }
  },
  // assets build
  {
    input: `src/assets.ts`,
    plugins: [typescript()],
    output: {
      file: "dist/assets.js",
      format: "umd",
      name: "SteedosObjectWidgetsAssets",
      sourcemap: false
    }
  }
];
