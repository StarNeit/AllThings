import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import sendNativeEvent from 'utils/sendNativeEvent'
import { mixpanel } from 'utils/track'

const useMixpanel = () => {
  const { accessToken, isNative } = useSelector((state: IReduxState) => ({
    accessToken: state.authentication.accessToken,
    isNative: state.app.embeddedLayout,
  }))

  return useCallback(
    (eventName: string, trackInformation?: IndexSignature) => {
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line:no-console
        console.info('mixpanel', eventName, trackInformation)
      }

      if (isNative) {
        sendNativeEvent(accessToken, {
          name: 'mixpanel',
          data: { eventName, trackInformation },
        })
      } else {
        mixpanel(eventName, trackInformation)
      }
    },
    [accessToken, isNative],
  )
}

export default useMixpanel
