'use strict'

const cmds = require('wdio-screen-commands')
const loadCustomCommands = require('../commands/index')

module.exports = {
  before: () => {
    global.should = require('chai').should()
    global.uuidv4 = require('uuid/v4')
    const mailhog = require('mailhog')(browser.config.mailhog)
    browser.addCommand('mailhog', async (cmd, ...args) => {
      return mailhog[cmd].call(mailhog, args)
    })
    browser.addCommand('saveScreenshotByName', cmds.saveScreenshotByName)
    browser.addCommand('saveAndDiffScreenshot', cmds.saveAndDiffScreenshot)
    if (browser.config.appium) browser.updateSettings(browser.config.appium)
    if (browser.config.maximizeWindow) browser.maximizeWindow()
    // Load project specific code:
    const indexCode = `${__dirname}/../test/${browser.config.project}/index.js`
    if (require('fs').existsSync(indexCode)) require(indexCode)
    loadCustomCommands(browser)
  },
  beforeTest: test => {
    cmds.startScreenRecording(test)
  },
  afterTest: async test => {
    await cmds.stopScreenRecording(test)
    cmds.saveScreenshotByTest(test)
  }
}
