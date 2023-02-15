/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 09:11:13
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 10:52:00
 * @Description: 
 */
import typescript from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import fg from 'fast-glob';

import pkg from './package.json';

const external = [
  "react",
  "react-dom"
]

const globals = { 
  react: 'React',
  'react-dom': 'ReactDOM'
}

const options = {
  input: './src/index.ts',

  context: 'window',

  plugins: [
    typescript({}),
    json(),
    commonjs({
      namedExports: {
        'js-cookie': ['get', 'set'],
        './node_modules/es6-promise/dist/es6-promise.j': ['polyfill'],
      },
    }),
    {
        name: 'watch-src',
        async buildStart(){
            const files = await fg('src/**/*');
            for(let file of files){
                this.addWatchFile(file);
            }
        }
    },
    process.env.NODE_ENV === 'production' && uglify()
  ],
};

export default [
  {
    ...options,
    input: `src/index.ts`,
    external,
    output: [
      {
        file: pkg.unpkg,
        name: 'amis-lib',
        format: 'umd',
        sourcemap: true,
        strict: false,
        intro: 'const global = window;',
        globals,
      },
      {
        format: 'cjs',
        file: pkg.main,
        sourcemap: true,
      },
      {
        format: 'es',
        file: pkg.module,
        sourcemap: true,
      },
    ]
  },
];
