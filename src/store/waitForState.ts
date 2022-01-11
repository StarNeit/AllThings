import { Store } from 'redux'

const storeIsReady = ({ app, authentication }: IReduxState) =>
  app.status === 'error' ||
  (authentication.sessionReady &&
    (!authentication.loggedIn || app.microAppsReady))

let timeoutId: NodeJS.Timeout

export default function waitForState(store: Store<IReduxState>, timeout = 0) {
  return Promise.race([
    new Promise(resolve => {
      const state = store.getState()
      if (storeIsReady(store.getState())) {
        clearTimeout(timeoutId)

        resolve(state)
      }
    }),
    new Promise(resolve => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState()
        if (storeIsReady(state)) {
          unsubscribe()
          clearTimeout(timeoutId)

          resolve(state)
        }
      })
    }),
    timeout > 0
      ? new Promise((_, reject) => {
          timeoutId = setTimeout(
            reject,
            timeout,
            new Error(`State not ready after ${timeout} ms, aborted`),
          )
        })
      : null,
  ])
}
