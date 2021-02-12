const { merge } = require('webpack-merge')
const common = require('../webpack.common.js')

module.exports = merge(common, {
  output: {
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: './src',
    compress: true,
    hot: true,
    open: true,
    port: 8080,
    historyApiFallback: true,
  },
})
