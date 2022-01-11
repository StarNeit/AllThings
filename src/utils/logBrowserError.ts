import unset from 'lodash-es/unset'
import cloneDeep from 'lodash-es/cloneDeep'

function logBrowserError(err: Error, state = {}) {
  const logState = cloneDeep(state)

  unset(logState, 'app.config.splashScreenImage')
  unset(logState, 'authentication.accessToken')
  unset(logState, 'authentication.user.username')
  unset(logState, 'authentication.deprecatedUser.username')
  unset(logState, 'authentication.user.phoneNumber')
  unset(logState, 'authentication.deprecatedUser.phoneNumber')
  unset(logState, 'authentication.user.email')
  unset(logState, 'authentication.deprecatedUser.email')

  fetch('/client-errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: err.name,
      message: err.message,
      stack: err.stack,
      state: logState,
    }),
  })
}

export default logBrowserError
