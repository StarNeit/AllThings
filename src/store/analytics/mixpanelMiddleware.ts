import reducer from './analyticsReducer'
import { mixpanel } from 'utils/track'
import sendNativeEvent from 'utils/sendNativeEvent'
import { Action } from 'redux'

export default function mixpanelMiddleware() {
  return ({ getState }: { getState: () => IReduxState }) => (
    next: (action: Action) => void,
  ) => (action: Action) => {
    const store = getState()
    const isNative = store.app.embeddedLayout
    const { accessToken } = store.authentication
    if (
      action.type in reducer &&
      (!(action as SimpleAction).status ||
        (action as SimpleAction).status === 'ok')
    ) {
      const trackInformation = reducer[action.type](action) || {}
      if (isNative && accessToken) {
        sendNativeEvent(accessToken, {
          name: 'mixpanel',
          data: { eventName: action.type, trackInformation },
        })
      } else {
        mixpanel(action.type, trackInformation)
      }
    }
    next(action)
  }
}
