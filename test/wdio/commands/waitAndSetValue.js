module.exports = function(selector, value) {
  browser.waitForInteractive(selector)
  $(selector).setValue(value)
}
