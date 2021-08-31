const path = require("path");

const alias = {
  svelte: path.resolve('node_modules', 'svelte'),
  '@lib': path.resolve(__dirname, 'src/lib'),
}

module.exports = { alias };