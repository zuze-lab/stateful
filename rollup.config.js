import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'index.js',
  plugins: [babel({ babelHelpers: 'bundled' }), sourcemaps()],
  output: [
    {
      file: 'build/bundle.min.js',
      sourcemap: true,
      format: 'iife',
      name: 'stateful',
      plugins: [terser()],
    },
  ],
};
