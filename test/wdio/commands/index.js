const waitAndClick = require('../commands/waitAndClick')
const waitAndGetText = require('../commands/waitAndGetText')
const waitAndSetValue = require('../commands/waitAndSetValue')
const waitForInteractive = require('../commands/waitForInteractive')

module.exports = function(browser) {
  browser.addCommand('waitAndClick', waitAndClick)
  browser.addCommand('waitAndGetText', waitAndGetText)
  browser.addCommand('waitAndSetValue', waitAndSetValue)
  browser.addCommand('waitForInteractive', waitForInteractive)
}
