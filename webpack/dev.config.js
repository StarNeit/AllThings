const {
  meta: { IS_LEGACY_BUNDLE },
  webpack: webpackConfig,
} = require('./base.config')
const merge = require('webpack-merge')
const path = require('path')

process.env.STAGE = process.env.STAGE || 'development'
process.env.CDN_HOST_URL_PREFIX = process.env.CDN_HOST_URL
  ? `${process.env.CDN_HOST_URL}/app/${process.env.STAGE}`
  : ''

module.exports = merge(webpackConfig, {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  output: {
    filename: `${IS_LEGACY_BUNDLE ? 'legacy-' : ''}bundle-dev.[name].js`,
    path: path.resolve(__dirname, '../public/static/js/dev'),
    chunkFilename: `${IS_LEGACY_BUNDLE ? 'legacy-' : ''}app-[name].js`,
    publicPath: process.env.CDN_HOST_URL_PREFIX + '/static/js/dev/',
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
})
