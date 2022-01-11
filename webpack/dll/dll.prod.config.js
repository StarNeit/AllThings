const webpack = require('webpack')
const config = require('./dll.base.config')
const merge = require('webpack-merge')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(config, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
          },
          comments: false,
          sourceMap: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
      }),
    ],
  },
  devtool: 'hidden-source-map',
  output: {
    filename: 'bundle.[name].[chunkhash].js',
    path: path.join(__dirname, '../../public/static/js/prod'),
  },
  plugins: [new webpack.HashedModuleIdsPlugin()],
})
