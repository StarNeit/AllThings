'use strict'

const env = process.env

// Take the site config from the LAUNCH_URL subdomain:
const site = env.LAUNCH_URL.replace(/(^https:\/\/)|(\..+$)/g, '')

module.exports = {
  globals_path: `globals/${site}/index.js`,
  output_folder: false,
  custom_commands_path: 'commands',
  page_objects_path: `pages/${site}`,
  src_folders: [`specs/${site}`],
  test_settings: {
    default: {
      launch_url: env.LAUNCH_URL,
      selenium_host: 'localhost',
      selenium_port: 4723,
      selenium_start_process: false,
      silent: true,
    },
    android: {
      desiredCapabilities: {
        browserName: 'chrome',
        deviceName: 'Android Simulator',
        platformName: 'Android',
      },
    },
    iphone: {
      desiredCapabilities: {
        automationName: 'XCUITest',
        browserName: 'Safari',
        deviceName: 'iPhone Simulator',
        platformName: 'iOS',
      },
    },
  },
}
