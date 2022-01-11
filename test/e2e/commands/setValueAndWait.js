'use strict'

// Wraps .setValue() with .perform() to always wait for completion:
module.exports.command = function(selector, value, callback) {
  return this.perform(function(client, done) {
    client.setValue(selector, value, function() {
      if (callback) callback.call(client)
      done()
    })
  })
}
