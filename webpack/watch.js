#!/usr/bin/env node

/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const MultiLoggerPlugin = require('./MultiLoggerPlugin')

const manifestsDir = path.resolve(__dirname, '../public/static/js/manifests')

const dllManifestPath = path.resolve(manifestsDir, 'dll.vendor.json')
const assetManifestPath = path.resolve(manifestsDir, 'assets.main.json')

const checkManifests = new Promise(resolve => {
  // Manifest files are needed to create a build
  if (!fs.existsSync(dllManifestPath) || !fs.existsSync(assetManifestPath)) {
    console.log('Running initial build to create manifest files...')
    execSync('yarn build')
    console.log('Done.')
  }
  resolve()
})

async function main() {
  await checkManifests
  const ssrConfig = require('./serverless.config')
  const clientConfig = require('./config')
  const configs = [clientConfig, ssrConfig]
  // prevent early exit
  configs.forEach(config => (config.bail = false))
  const compiler = webpack(configs)

  new MultiLoggerPlugin().apply(compiler)
  compiler.watch({ ignored: /node_modules/ }, () => {})
}

main()
