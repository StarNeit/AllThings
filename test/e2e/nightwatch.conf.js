'use strict'

const env = process.env

// Take the site config from the LAUNCH_URL subdomain:
const site = env.LAUNCH_URL.replace(/(^https:\/\/)|(\..+$)/g, '')

module.exports = {
  globals_path: `globals/${site}/index.js`,
  output_folder: false,
  custom_commands_path: 'commands',
  custom_assertions_path: 'assertions',
  page_objects_path: `pages/${site}`,
  src_folders: [`specs/${site}`],
  test_settings: {
    default: {
      selenium_host: env.SELENIUM_HOST,
      launch_url: env.LAUNCH_URL,
      default_path_prefix: '',
      screenshots: {
        enabled: env.SELENIUM_HOST !== 'hub.browserstack.com',
        on_failure: true,
        diff: env.SCREENSHOTS_DIFF === 'true',
        path: 'screenshots',
      },
      videos: {
        enabled: env.VIDEOS_ENABLED === 'true',
        delete_on_success: true,
        path: 'videos',
        display: ':0',
      },
      desiredCapabilities: {
        'browserstack.debug': 'true',
        'browserstack.local': env.BROWSERSTACK_LOCAL,
        'browserstack.localIdentifier': env.BROWSERSTACK_LOCAL_ID,
        'browserstack.user': env.BROWSERSTACK_USER,
        'browserstack.key': env.BROWSERSTACK_KEY,
        browserName: 'chrome',
        chromeOptions: {
          args: ['window-size=1440,900'],
        },
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        os: 'WINDOWS',
        os_version: '10',
      },
    },
    edge: {
      desiredCapabilities: {
        browserName: 'edge',
        os: 'WINDOWS',
        os_version: '10',
      },
    },
    // We need to reset the default_path_prefix and the chromeOptions properties
    // in order not to make the IE session failing on Browserstack!
    ie: {
      default_path_prefix: null,
      desiredCapabilities: {
        browserName: 'internet explorer',
        chromeOptions: null,
        os_version: '8.1',
        os: 'WINDOWS',
      },
    },
    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        os: 'OS X',
        os_version: 'El Capitan',
      },
    },
    iphone: {
      desiredCapabilities: {
        browserName: 'iPhone',
        device: 'iPhone 6S',
      },
    },
    android: {
      desiredCapabilities: {
        browserName: 'android',
        device: 'Google Nexus 5',
      },
    },
  },
}
