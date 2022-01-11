module.exports.command = function(element, value, callback) {
  return this.perform((browser, done) => {
    browser.setValue(element, [browser.Keys.CONTROL, 'a'])
    if (callback) callback.call(browser)
    done()
  })
}
