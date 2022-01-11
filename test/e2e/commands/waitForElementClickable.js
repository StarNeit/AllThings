'use strict'

const assert = require('assert')
const events = require('events')
const util = require('util')

const INTERNAL_TIMEOUT = 500 // ms
let WAIT_CONDITION_TIMEOUT

const deepStrictEqual = (a, b) => {
  try {
    assert.deepStrictEqual(a, b)
  } catch (e) {
    return false
  }
  return true
}

function waitForElementClickable() {
  events.EventEmitter.call(this)

  this.startTimeInMilliseconds = null
}

util.inherits(waitForElementClickable, events.EventEmitter)

waitForElementClickable.prototype.command = function(
  element,
  timeoutInMilliseconds
) {
  WAIT_CONDITION_TIMEOUT = this.api.globals.waitForConditionTimeout
  this.startTimeInMilliseconds = new Date().getTime()
  const self = this
  let message

  if (typeof timeoutInMilliseconds !== 'number') {
    timeoutInMilliseconds = WAIT_CONDITION_TIMEOUT
  }

  this.check(
    element,
    (result, loadedTimeInMilliseconds) => {
      message = `Element <${element}>`

      if (result) {
        message += ` was clickable after ${loadedTimeInMilliseconds -
          self.startTimeInMilliseconds} ms.`
      } else {
        message += ` was still not clickable after ${timeoutInMilliseconds} ms.`
      }

      self.client.assertion(
        result,
        'not visible or disabled',
        'visible and not disabled',
        message,
        true
      )
      self.emit('complete')
    },
    timeoutInMilliseconds
  )

  return this
}

waitForElementClickable.prototype.check = function(
  element,
  cb,
  maxTimeInMilliseconds
) {
  const self = this
  const promises = []

  const getCSS = () =>
    new Promise(resolve =>
      self.api.execute(
        function(element) {
          const domElement = document.querySelector(element)
          const computedStyle = window.getComputedStyle(domElement)
          const styles = {}
          for (const prop in computedStyle) {
            // Proper way of getting the styles.
            styles[prop] = computedStyle.getPropertyValue(prop)
          }
          return styles
        },
        [element],
        result => {
          resolve(result.value)
        }
      )
    )

  const waitForEvents = () =>
    new Promise(resolve => {
      self.api
        .timeoutsAsyncScript(WAIT_CONDITION_TIMEOUT) // Otherwise default to 0!
        .executeAsync(
          function(element, INTERNAL_TIMEOUT, done) {
            const EVENTS = ['animation', 'transition']
            let hasStarted = false
            const startListener = () => {
              hasStarted = true
              // eslint-disable-next-line
              console.log(
                `⏳ Animation or transition start event detected on element <${
                  element
                }>. Waiting...`
              )
            }
            const endListener = () => {
              removeEventListeners()
              done()
            }
            const removeEventListeners = () =>
              EVENTS.map(e => {
                element.removeEventListener(`${e}start`, startListener)
                element.removeEventListener(`${e}end`, endListener)
              })
            // Add event listeners for both animation and transition.
            EVENTS.map(e => {
              element.addEventListener(`${e}start`, startListener)
              element.addEventListener(`${e}end`, endListener)
            })
            // After a predefined timeout, if none of the events has started,
            // we consider the element to be stable, i.e clickable.
            setTimeout(() => !hasStarted && endListener(), INTERNAL_TIMEOUT)
          },
          [element, INTERNAL_TIMEOUT],
          resolve
        )
    })

  // First promise, element must visible.
  promises.push(
    new Promise(resolve =>
      self.api.waitForElementVisible(
        element,
        WAIT_CONDITION_TIMEOUT,
        false, // Do not abort, we want to retry!
        result => {
          if (result.status === -1) {
            // Try again.
            self.api.waitForElementVisible(
              element,
              WAIT_CONDITION_TIMEOUT,
              result => resolve(result.status === 0 && result.value === true)
            )
          } else {
            resolve(result.status === 0 && result.value === true)
          }
        },
        'Element <%s> was not visible after %d ms. Retrying...'
      )
    )
  )

  // Second promise, check animation and transition event listeners.
  promises.push(
    new Promise(resolve =>
      waitForEvents().then(() => {
        resolve(true)
      })
    )
  )

  // Third promise, CSS properties must be stable, i.e. no more animations.
  promises.push(
    new Promise(resolve => {
      const animationPolling = this.api.globals.animationPolling
      const check = () =>
        getCSS().then(props =>
          setTimeout(
            () =>
              getCSS().then(nextProps => {
                if (deepStrictEqual(props, nextProps)) {
                  resolve(true)
                } else {
                  // eslint-disable-next-line
                  console.log(
                    `⏳ Animation detected on element <${element}>. Waiting ${
                      animationPolling
                    }ms...`
                  )
                  // Recursive call.
                  check()
                }
              }),
            animationPolling
          )
        )

      // Perform a recursive call until the element's CSS properties are stable.
      check()
    })
  )

  // Last promise, a disabled element is not clickable.
  promises.push(
    new Promise(resolve =>
      self.api.getAttribute(element, 'disabled', result => {
        resolve(result.status === 0 && result.value === null)
      })
    )
  )

  Promise.all(promises)
    .then(results => {
      const now = new Date().getTime()
      const shouldBeClickable = results.reduce((s, a) => s && a, true)

      if (shouldBeClickable) {
        // eslint-disable-next-line
        cb(true, now)
      } else if (now - self.startTimeInMilliseconds < maxTimeInMilliseconds) {
        setTimeout(() => {
          self.check(element, cb, maxTimeInMilliseconds)
        }, INTERNAL_TIMEOUT)
      } else {
        // eslint-disable-next-line
        cb(false)
      }
    })
    .catch(e =>
      setTimeout(() => {
        self.check(element, cb, maxTimeInMilliseconds)
      }, INTERNAL_TIMEOUT)
    )
}

module.exports = waitForElementClickable
