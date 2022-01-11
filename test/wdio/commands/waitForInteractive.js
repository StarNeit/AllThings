const assert = require('assert').strict

const TIMEOUT_MS = 10000
const ANIMATION_POLLING_MS = 250

const deepStrictEqual = (a, b) => {
  try {
    assert.deepStrictEqual(a, b)
  } catch (e) {
    return false
  }

  return true
}

module.exports = function(selector) {
  const getStyles = selector =>
    browser.execute(selector => {
      const element = document.querySelector(selector)

      if (element === null) {
        throw new Error(`Element ${selector} was not found in the document!`)
      }

      const computedStyle = window.getComputedStyle(element)
      const styles = {}

      // Use a for loop for speed.
      for (const prop in computedStyle) {
        // Proper way of getting the styles.
        styles[prop] = computedStyle.getPropertyValue(prop)
      }

      return styles
    }, selector)

  const isMethodTruthyForSelector = (method, selector, count = 0) => {
    try {
      $(selector)[method](TIMEOUT_MS, false)

      return true
    } catch (e) {
      // Recursive call, stop after third retry.
      return count === 2
        ? false
        : isMethodTruthyForSelector(method, selector, count + 1)
    }
  }

  const waitForAnimation = selector => {
    let prevStyles = getStyles(selector)

    browser.waitUntil(
      () => {
        const nextStyles = getStyles(selector)

        if (deepStrictEqual(prevStyles, nextStyles)) {
          return true
        } else {
          // Fast deep clone.
          prevStyles = JSON.parse(JSON.stringify(nextStyles))

          return false
        }
      },
      TIMEOUT_MS * 6,
      `Animation on element ${selector} is taking more than 60s!`,
      ANIMATION_POLLING_MS,
    )
  }

  // 1. Ensure that the element is displayed (with 3 retries).
  if (!isMethodTruthyForSelector('waitForExist', selector)) {
    throw new Error(
      `Element ${selector} was not present within the DOM after 3 retries!`,
    )
  }

  // 2. Wait for CSS properties to stabilize.
  waitForAnimation(selector)

  // 3. Ensure that the element is enabled (with 3 retries).
  if (!isMethodTruthyForSelector('waitForEnabled', selector)) {
    throw new Error(`Element ${selector} was not enabled after 3 retries!`)
  }

  return true
}
