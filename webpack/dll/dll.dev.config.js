const config = require('./dll.base.config')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'source-map',
  stats: 'errors-only',
  output: {
    filename: 'bundle-dev.[name].js',
    path: path.join(__dirname, '../../public/static/js/dev'),
  },
  plugins: [new webpack.NamedModulesPlugin()],
})
