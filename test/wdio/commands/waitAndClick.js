module.exports = function(selector) {
  browser.waitForInteractive(selector)
  $(selector).click()
}
