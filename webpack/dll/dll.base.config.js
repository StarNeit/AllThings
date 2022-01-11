const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const AssetsPlugin = require('assets-webpack-plugin')

const WEBPACK_REPORT = process.env.WEBPACK_REPORT

const insertIf = (cond, ...array) => (cond ? array : [])

module.exports = {
  entry: {
    vendor: [
      path.resolve(__dirname, '../../node_modules/@allthings/colors'),
      path.resolve(__dirname, '../../node_modules/@allthings/elements'),
      path.resolve(__dirname, '../../node_modules/@allthings/sdk'),
      '@allthings/js-sdk',
      'classnames',
      'connected-react-router',
      'dompurify',
      'glamor',
      'kewler',
      'lodash-es/cloneDeep',
      'lodash-es/filter',
      'lodash-es/find',
      'lodash-es/findIndex',
      'lodash-es/get',
      'lodash-es/indexOf',
      'lodash-es/isEqual',
      'lodash-es/last',
      'lodash-es/merge',
      'lodash-es/omit',
      'lodash-es/size',
      'lodash-es/sortBy',
      'lodash-es/uniqBy',
      'lodash-es/unset',
      'react-broadcast',
      'react-dom',
      'react-dropzone',
      'react-flip-move',
      'react-gateway',
      'react-google-recaptcha',
      'react-helmet',
      'react-loadable',
      'react-media',
      'react-motion',
      'react-redux',
      'react-router-dom',
      'react-router',
      'react-transition-group',
      'react',
      'redux',
      'rest',
      'validate.js',
    ],
  },
  bail: true,
  output: {
    library: '[name]_[chunkhash]',
  },
  plugins: [
    ...insertIf(
      WEBPACK_REPORT,
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: false,
        openAnalyzer: true,
        reportFilename: path.join(__dirname, '../report/vendor-bundle.html'),
      }),
    ),
    new webpack.DllPlugin({
      name: '[name]_[chunkhash]',
      path: path.join(
        path.join(__dirname, '../../public/static/js/manifests'),
        'dll.[name].json',
      ),
    }),
    new AssetsPlugin({
      filename: 'assets.vendor.json',
      fullPath: false,
      path: path.join(__dirname, '../../public/static/js/manifests'),
    }),
  ],
  module: {
    rules: [
      {
        include: [/node_modules\/@allthings\/sdk\//],
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                target: 'es5',
                sourceMap: false,
              },
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
}
