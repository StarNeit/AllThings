import Auth from './authentication'
import createActions from 'store/createActions'
import getServiceHost from 'utils/getServiceHost'
import { storeCookie } from 'utils/cookie'
import { Locale } from 'enums'

export default createActions({
  initApp({
    accessToken = null,
    embeddedLayout = false,
    headers = null,
    hostname,
    locale = null,
    userAgent = null,
    userLoggedInBefore = null,
  }: {
    accessToken?: string
    Cookie?: string
    embeddedLayout?: boolean
    headers?: IndexSignature<string>
    hostname: string
    locale: Locale
    userAgent: string
    userLoggedInBefore: boolean
  }) {
    return async (dispatch, api) => {
      try {
        const configRequest = await fetch(
          `https://${getServiceHost(hostname)}/api/v1/apps/${process.env
            .APP_DOMAIN || hostname}/configuration`,
        )

        if (!configRequest.ok) {
          dispatch({
            status: 'error',
            payload: { configError: configRequest.status },
          })
        } else {
          const appConfig = await configRequest.json()
          const config = {
            ...appConfig,

            // Allow overriding OAuth Client ID (e.g. for standalone dev env)
            ...(process.env.OAUTH_CLIENT_ID && {
              clientID: process.env.OAUTH_CLIENT_ID,
            }),
          }

          const environment = process.env.NODE_ENV || 'development'
          dispatch({
            status: 'ok',
            payload: {
              config,
              embeddedLayout,
              environment,
              hostname,
              userAgent,
              userLoggedInBefore,
            },
          })

          if (!locale) {
            const lang = await api({
              path: 'api/v1/helpers/locale',
              clientID: appConfig.clientID,
              headers,
            })

            locale = lang.entity.locale
          }
          dispatch(this.chooseLanguage(locale))

          if (accessToken) {
            dispatch(Auth.login({ accessToken }))
          } else {
            dispatch(Auth.sessionReady())
          }
        }
      } catch (err) {
        dispatch({ status: 'error', payload: { error: err } })
        throw err
      }
    }
  },

  initMicroApps(appId: string, accessToken: string) {
    return async (dispatch, api) => {
      try {
        const microApps = await api({
          method: 'GET',
          path: `api/v1/apps/${appId}/micro-app-configurations`,
          accessToken,
          params: {
            limit: 100,
          },
        })

        if (microApps.status.code === 200) {
          dispatch({ status: 'ok', payload: microApps.entity })
        } else {
          dispatch({ status: 'error' })
        }
      } catch (e) {
        dispatch({ status: 'error' })
        throw e
      }
    }
  },

  setConnected(connected: boolean) {
    return { payload: { connected } }
  },

  chooseLanguage(locale: Locale) {
    storeCookie('locale', locale)

    return async dispatch => {
      dispatch({ payload: { locale } })
    }
  },

  error(exception: Error) {
    return { payload: { exception } }
  },

  attachFetcher(id: string) {
    return { payload: { id } }
  },

  detachFetcher(id: string) {
    return { payload: { id } }
  },

  userLoggedInBefore(userLoggedInBefore: boolean) {
    storeCookie('user_logged_in_before', userLoggedInBefore ? 1 : 0)

    return { payload: { userLoggedInBefore } }
  },

  sendMailToUser(userId, content) {
    return async (dispatch, api) => {
      const send = await api({
        path: `api/v1/users/${userId}/messages`,
        method: 'POST',
        entity: {
          content,
        },
      })

      if (send.status.code === 201) {
        dispatch({ status: 'ok', payload: send.entity })
      }
    }
  },
})
