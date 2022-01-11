const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const clearConsole = require('react-dev-utils/clearConsole')
const chalk = require('chalk')
const difference = require('lodash/difference')
const webpack = require('webpack')

const { log, error } = console

module.exports = class MultiLoggerPlugin {
  constructor() {
    this.compilersRunning = 0
    this.previousData = {}
    this.startTime = null
    this.builds = 0

    this.handleDone = this.handleDone.bind(this)
    this.handleWatchRun = this.handleWatchRun.bind(this)
    this.handleProgress = this.handleProgress.bind(this)
  }

  apply(multiCompiler) {
    const { compilers } = multiCompiler

    if (!Array.isArray(compilers)) {
      error(
        chalk.yellow(
          'Error: MultiCompilerLogPlugin expects more than one compiler attached.',
        ),
      )
      process.exit(1)
    }

    // MultiCompiler doesn't emit `watch-run` event, so attach it to all compilers
    // https://github.com/webpack/webpack/issues/5570
    multiCompiler.hooks.watchRun.tap('MultiLoggerPlugin', this.handleWatchRun)
    multiCompiler.hooks.done.tap('MultiLoggerPlugin', this.handleDone)

    new webpack.ProgressPlugin(this.handleProgress).apply(multiCompiler)
  }

  handleWatchRun() {
    if (this.compilersRunning === 0) {
      clearConsole()
      log(chalk.cyan('Compiling...'))
      this.startTime = Date.now()
    }
    this.compilersRunning++
  }

  handleProgress(percentage) {
    if (this.compilersRunning > 0) {
      process.stdout.write(chalk.cyan(`\r${Math.floor(percentage * 100)}%`))
    }
  }

  extractHashes(stats) {
    return stats.stats.reduce((prev, curr) => [...prev, curr.hash], [])
  }

  renderDone({ messages, compileTime }) {
    clearConsole()

    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      log(chalk.green('Compiled successfully! #%d'), this.builds)
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      log(chalk.red('Failed to compile.\n'))
      log(messages.errors.join('\n\n'))
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      log(chalk.yellow('Compiled with warnings.\n'))
      log(messages.warnings.join('\n\n'))
    }

    log()
    log('Compile time: %ds', (compileTime / 1000).toFixed(2))
    log(chalk.gray(new Date().toLocaleTimeString()))
  }

  handleDone(stats) {
    const compileTime = Date.now() - this.startTime
    const currentHashes = this.extractHashes(stats)
    const changedHashes = difference(currentHashes, this.previousData.hashes)
    const messages = formatWebpackMessages(stats.toJson({}, true))

    this.compilersRunning -=
      changedHashes.length > 0 ? changedHashes.length : this.compilersRunning

    const data = {
      hashes: currentHashes,
      messages,
      compileTime,
    }

    if (changedHashes.length > 0) {
      this.builds++
      this.renderDone(data)
    } else {
      this.renderDone(this.previousData)
    }

    this.previousData = data
  }
}
