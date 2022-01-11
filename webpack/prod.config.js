const webpack = require('webpack')
const {
  meta: { IS_LEGACY_BUNDLE },
  webpack: webpackConfig,
} = require('./base.config')
const merge = require('webpack-merge')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const { name: packageName, config: packageConfig } = require('../package.json')
process.env.STAGE = process.env.STAGE || 'development'
process.env.STAGE_PREFIX = process.env.STAGE_PREFIX || 'development'
process.env.CDN_HOST_URL_PREFIX = `${packageConfig[process.env.STAGE_PREFIX].cdnHostUrl}/${packageName}/${process.env.STAGE}`

module.exports = merge(webpackConfig, {
  devtool: 'hidden-source-map',
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
  output: {
    path: path.resolve(__dirname, '../public/static/js/prod'),
    publicPath: process.env.CDN_HOST_URL_PREFIX + '/static/js/prod/',
    filename: `${
      IS_LEGACY_BUNDLE ? 'legacy-' : ''
    }bundle.[name].[chunkhash].js`,
    chunkFilename: `${
      IS_LEGACY_BUNDLE ? 'legacy-' : ''
    }app-[name].[chunkhash].js`,
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        CDN_HOST_URL_PREFIX: JSON.stringify(process.env.CDN_HOST_URL_PREFIX),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      quiet: true,
      progress: false,
      stats: false,
    }),
  ],
})
