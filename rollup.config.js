import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'index.js',
  plugins: [sourcemaps()],
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
