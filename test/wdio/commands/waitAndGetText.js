module.exports = function(selector) {
  browser.waitForInteractive(selector)
  return $(selector).getText()
}
