'use strict'

// Symbols and colors for Nightwatch style console output:
const warningSymbol = String.fromCharCode(10006)
const doneSymbol = String.fromCharCode(10004)
const green = '\x1B[32m'
const yellow = '\x1B[33m'
const noColor = '\x1B[0m'

// See https://buildkite.com/docs/builds/images-in-log-output
function displayImages() {
  for (const path of arguments) {
    console.log(`\n\x1B]1338;url=artifact://test/e2e/${path}\x07`)
  }
}

module.exports.command = function(suffix, callback) {
  // Wrap in a perform call as this is an asynchronous operation:
  return this.perform(function(client, done) {
    let result
    function cb() {
      if (callback) callback.call(client, result)
      done()
    }
    const settings = client.globals.test_settings
    const caps = client.capabilities
    // Return if screenshots are disabled or the browser does not support them:
    if (
      !client.options.screenshots ||
      !settings.screenshots.diff ||
      !caps.takesScreenshot
    ) {
      return cb()
    }
    const prefix = `${caps.browserName}-${caps.platform}/`
    const test = client.currentTest
    const name = `${prefix}${test.module}/${test.name}${suffix || ''}`
      .replace(/[^\w/]/g, '-')
      .toLowerCase()
    const fileName = `${client.options.screenshotsPath}/${name}-new.png`
    const fileNameRef = fileName.replace('-new.png', '-ref.png')
    const fileNameDiff = fileName.replace('-new.png', '-diff.png')
    client.saveScreenshot(fileName, function() {
      const fs = require('fs')
      if (!fs.existsSync(fileNameRef)) {
        // Use the new screenshot as reference file:
        fs.renameSync(fileName, fileNameRef)
        return cb()
      }
      const imageDiff = require('ffmpeg-image-diff')
      imageDiff(fileNameRef, fileName, fileNameDiff).then(result => {
        // Result has the form { R: 1, G: 1, B: 1, All: 1 }
        if (result.All < 1) {
          const p = ((1 - result.All) * 100).toFixed(2)
          const message = `Screenshot <${name}> differs from the reference image by ${p} %.`
          // eslint-disable-next-line no-console
          console.warn(` ${yellow}${warningSymbol} ${message}${noColor}`)
          displayImages(fileNameRef, fileName, fileNameDiff)
        } else {
          const message = `Screenshot <${name}> is identical with the reference image.`
          // eslint-disable-next-line no-console
          console.log(` ${green}${doneSymbol}${noColor} ${message}`)
          // Delete the obsolete identical screenshot and empty diff:
          fs.unlinkSync(fileName)
          fs.unlinkSync(fileNameDiff)
        }
        cb()
      })
    })
  })
}
