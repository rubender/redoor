const terser = require("rollup-plugin-terser").terser;
const babel  = require("rollup-plugin-babel");

export default {
  input: './src/provider.js',
  output: {
      name:'rprovider',
      file: './lib/index.js',
      format: 'umd',
  },
  plugins: [
    babel(),
    terser(),
  ]
};
