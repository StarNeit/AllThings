const { webpack: webpackConfig } = require('./base.config')
const fs = require('fs')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const yaml = require('js-yaml')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const appendIf = (cond, ...array) => (cond ? array : [])

const dllManifestPath = path.resolve(
  __dirname,
  '../public/static/js/manifests/dll.vendor.json',
)

if (!fs.existsSync(dllManifestPath)) {
  /* eslint-disable no-console */
  console.log('Please build Webpack DLL first:')
  console.log('npm run webpack:dll')
  /* eslint-enable */
  process.exit()
}

const { functions: slsFunctions } = yaml.load(
  fs.readFileSync('./serverless.yml'),
)

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  context: path.resolve('./'),
  resolve: webpackConfig.resolve,
  bail: true,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: [/\.tsx?$/],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      { type: 'javascript/auto', test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: false,
          },
        },
      },
      {
        test: /\.md$/,
        loader: 'null-loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          sourceMap: true,
          ecma: 6,
          ie8: false,
          toplevel: true,
          mangle: false, // breaks
          compress: {
            // Don't remove, otherwise it breaks:
            // > Serverless: Uncaught error in your 'connection-status' handler
            // > [ 'TypeError: (0 , _apiGatewayResponse2.default)(...).html is not a function',
            reduce_funcs: false,
          },
          output: {
            comments: false,
            beautify: false,
            ecma: 6,
          },
        },
      }),
    ],
  },
  externals: [
    // Allow Lodash-es which is exported as ES modules!
    ...appendIf(!IS_PRODUCTION, nodeExternals({ whitelist: [/^lodash/] })),
  ],
  plugins: [
    ...appendIf(
      IS_PRODUCTION,
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ),
  ],
  devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
  target: 'node',
  node: {
    __dirname: true,
  },
  entry: Object.keys(slsFunctions)
    .reduce((functions, key) => [...functions, slsFunctions[key]], [])
    .reduce((entries, lambdaFunction) => {
      const handlerEntry = lambdaFunction.handler
        .split('.')[0]
        .replace('dist/', '')
      const handlerFile = `src/ssr/handlers/${handlerEntry.replace(
        'handler-',
        '',
      )}.ts`

      return Object.assign(entries, {
        [handlerEntry]: ['cross-fetch/polyfill', path.resolve(handlerFile)],
      })
    }, {}),
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve('dist'),
    // filename: '[name].js',
    // webpack is fucked. This fixes an issue where the entrypoint
    // filename is mixed up with a chunk filename (like cobot.js)
    // which then breaks the deployment as it can't find the expected entry file.
    filename: chunkData =>
      chunkData.chunk.hasEntryModule()
        ? `${chunkData.chunk.entryModule.name}.js`
        : '[name].js',
  },
}
