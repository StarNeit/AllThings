const AssetsPlugin = require('assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const insertIf = (cond, ...array) => (cond ? array : [])

const LEGACY_FLAG = 'legacy'

const [legacy] = process.argv.reverse()

const [IS_LEGACY_BUNDLE, LEGACY_POLYFILLS, { WEBPACK_REPORT }] = [
  // Drop the dashes since the flag is also used via the watch task.
  legacy.replace(/\-/g, '') === LEGACY_FLAG,
  // We use the Babel polyfill for the legacy bundle, especially for IE 11...
  // It provides all the necessary CoreJS polyfills under the hood.
  // https://babeljs.io/docs/en/babel-polyfill#tc39-proposals
  ['@babel/polyfill', 'cross-fetch/polyfill', 'intl'],
  process.env,
]

const dllManifestPath = path.resolve(
  __dirname,
  '../public/static/js/manifests/dll.vendor.json',
)

if (!fs.existsSync(dllManifestPath)) {
  console.log('Please build Webpack DLL first:')
  console.log('npm run webpack:dll')
  process.exit()
}

const manifest = require(dllManifestPath)

module.exports = {
  meta: {
    IS_LEGACY_BUNDLE,
  },
  webpack: {
    context: path.resolve(__dirname, '..'),
    resolve: {
      alias: {
        // webpack requires `mathjs` es6 module export, and vendor bundle is not transpiled,
        // that causing IE to break.
        // overriding it here to force es5 version to be included.
        // https://allthings.atlassian.net/browse/APP-3862
        mathjs: 'mathjs/main/es5',
      },
      modules: ['node_modules'],
      ...(IS_LEGACY_BUNDLE
        ? {
            mainFields: ['browser', 'main'],
          }
        : {}),
      plugins: [
        // This plugin is generating aliases from the tsconfig paths.
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, '../tsconfig.json'),
        }),
      ],
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    entry: {
      main: [
        ...insertIf(IS_LEGACY_BUNDLE, ...LEGACY_POLYFILLS),
        './src/Main.tsx',
      ],
    },
    bail: true,
    plugins: [
      ...insertIf(
        WEBPACK_REPORT,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: false,
          openAnalyzer: true,
          reportFilename: path.join(__dirname, 'report/main-bundle.html'),
        }),
      ),
      new webpack.DefinePlugin({
        'process.env': {
          STAGE: JSON.stringify(process.env.STAGE || 'development'),
        },
      }),
      new webpack.DllReferencePlugin({
        context: path.resolve(__dirname, '..'),
        manifest,
      }),
      new AssetsPlugin({
        filename: `${IS_LEGACY_BUNDLE ? 'legacy-' : ''}assets.main.json`,
        fullPath: false,
        path: path.resolve(__dirname, '../public/static/js/manifests'),
      }),
      new ForkTsCheckerWebpackPlugin({
        memoryLimit: 4096,
        workers: 1,
      }),
    ],
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: [/\.tsx?$/],
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  // See https://blog.mariusschulz.com/2017/06/30/typescript-2-3-downlevel-iteration-for-es3-es5
                  // and https://github.com/Microsoft/TypeScript/issues/6842#issuecomment-355766099
                  downlevelIteration: IS_LEGACY_BUNDLE,
                  lib: ['dom', 'es2016', 'es2017', 'esnext'],
                  // Modern bundle is using ES2017 in order to avoid unnessary
                  // transpiled async functions, see the support here:
                  // https://caniuse.com/#feat=async-functions
                  target: IS_LEGACY_BUNDLE ? 'es5' : 'es2017',
                },
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: [/\.md$/, /\.snap$/, /\.test.tsx$/],
          loader: 'null-loader',
        },
      ],
    },
  },
}
