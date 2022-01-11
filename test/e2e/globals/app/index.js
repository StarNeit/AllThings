'use strict'

/*
 * Globals availability:
 * - "browser.globals" in the specs
 * - "this.api.globals" in the page objects
 */

const globals = {
  // Animation polling:
  animationPolling: 250,
  // Global wait timeout setting:
  waitForConditionTimeout: 10000,
  // Throw when waitFor commands return multiple elements for a selector:
  throwOnMultipleElementsReturned: true,
  // Disable file upload tests by default:
  fileUploadEnabled: false,
  // Check-in code.
  checkInCode: 'space-pilot-3000',
  // Dummy image for file upload.
  dummy: {
    fileName: 'dummy.jpg',
    filePath: '/home/webdriver/assets/app/dummy.jpg',
  },
  // Second dummy image for file upload
  dummy2: {
    fileName: 'dummy2.jpg',
    filePath: '/home/webdriver/assets/app/dummy2.jpg',
  },
  // Article with files in it.
  information: {
    articleId: '5aa6869fd4959e00432981c4',
  },
  // Define the main e2e test user.
  user: {
    email: 'e2e-testing@allthings.me',
    password: 'PleaseInsertLiquor!',
  },
  // Define the secondary e2e user:
  user2: {
    email: 'e2e-testing2@allthings.me',
    password: 'WhyMotZoidberg?',
  },
  uuid: require('@allthings/uuid'),
}

module.exports = require('../../index')(globals)
