const VALIDITY_STATES = [
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
]

const isValid = inputValidityState =>
  VALIDITY_STATES.every(state => inputValidityState[state] === false)

exports.assertion = function(selector, expected = true) {
  const expectation = expected ? 'valid' : 'invalid'
  this.message = `Testing if input <${selector}> is ${expectation}`
  this.expected = expected

  this.pass = value => value === this.expected

  this.value = result => isValid(result.value)

  this.command = function(callback) {
    return this.api.execute(
      function(selector) {
        return document.querySelector(selector).validity
      },
      [selector],
      callback
    )
  }
}
