'use strict'

module.exports.command = function(callback) {
  return this.execute(function(client, done) {
    const container = document.getElementById('scroll-container')
    container.scrollTop = container.scrollHeight
    if (callback) callback.call(client)
    done()
  })
}
