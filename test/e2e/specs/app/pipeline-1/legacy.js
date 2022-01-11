'use strict'

/*
 * Legacy bundle test
 */

const LEGACY_BUNDLE_QUERY_PARAMETER = 'force-legacy-bundle'

const appIsReady = '[data-e2e=app-ready]'
const legacyBundleScriptElement = '[data-e2e=legacy-bundle-script]'
const onlyLegacyBundleScriptElement = '[data-e2e=legacy-testing-bundle-script]'
const modernBundleScriptElement = '[data-e2e=modern-bundle-script]'

module.exports = {
  tags: ['legacy'],
  'Test for the legacy bundle': browser => {
    // Force the legacy bundle to be parsed by the browser by appending a
    // specific query parameter.
    // In this test, only a single bundle script file for the legacy bundle
    // should be present, thus forcing the use of the legacy bundle (since no
    // modern bundle is included.)
    // If this test fails, then there's probably an issue with the legacy
    // bundle.
    browser
      .url(`${browser.launchUrl}?${LEGACY_BUNDLE_QUERY_PARAMETER}`)
      .waitForElementClickable(appIsReady)
      .expect.element(onlyLegacyBundleScriptElement).to.be.present

    browser.expect.element(legacyBundleScriptElement).to.not.be.present
    browser.expect.element(modernBundleScriptElement).to.not.be.present

    browser.end()
  },
  'Test for the default bundles': browser => {
    // By default, we should get the legacy and the modern bundles as scripts.
    // The browser will take care of picking the correct one automatically, i.e.
    // the modern one in the CI.
    // In this test, the opposite of the above. Both legacy and modern bundles
    // should be present in the HTML.
    browser
      .url(browser.launchUrl)
      .waitForElementClickable(appIsReady)
      .expect.element(onlyLegacyBundleScriptElement).to.not.be.present

    browser.expect.element(legacyBundleScriptElement).to.be.present
    browser.expect.element(modernBundleScriptElement).to.be.present

    browser.end()
  },
}
