const path = require("path");
const { alias } = require("../webpack.parts");
const merge = require("webpack-merge");

module.exports = ({ config, mode }) => {
  let mergeConfig = merge.smart(config, {
    module: {
      rules: [{
        test: /\.{svelte|html}$/,
        loader: 'svelte-loader'
      // }, {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader'],
      //   include: path.resolve(__dirname, '../'),
      }]
    }
  })
  mergeConfig.resolve.alias = {
    ...mergeConfig.resolve.alias, ...alias
  };
  return mergeConfig;
}