const terser = require("rollup-plugin-terser").terser;
const babel  = require("rollup-plugin-babel");

export default [{
  input: './src/redoor.js',
  output: {
      name:'redoor',
      file: './lib/redoor.min.js',
      format: 'umd',
  },
  plugins: [ babel(), terser() ]
}, {
  input: './src/redoor.js',
  output: {
      name:'redoor',
      file: './lib/redoor.js',
      format: 'umd',
  },
  plugins: [ babel() ]
}];
