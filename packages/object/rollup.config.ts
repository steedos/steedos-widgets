import typescript from 'rollup-plugin-typescript2';
export default [
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
];
