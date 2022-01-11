import createActions from 'store/createActions'
import app from './app'
import {
  getRefreshToken,
  getLogoutUrl,
  getOAuthState,
  getAccessToken,
} from 'utils/accountsOAuth'

export default createActions({
  login({ accessToken, accessTokenExpires = null, refreshToken = null }) {
    return async (dispatch, api, state) => {
      const { appID } = state.app.config
      await dispatch(app.initMicroApps(appID, accessToken))

      const user = await api({
        method: 'GET',
        path: 'api/v1/me',
        accessToken,
      })

      if (user && user.status && user.status.code === 200) {
        dispatch(app.chooseLanguage(user.entity.locale))
        dispatch({
          status: 'ok',
          payload: {
            accessToken,
            accessTokenExpires,
            refreshToken,
            user: user.entity,
          },
        })

        return user.entity
      } else {
        dispatch({
          status: 'error',
          message: 'Could not login',
        })
      }
    }
  },

  loggingIn() {
    return { payload: { loggingIn: true } }
  },

  redirectAfterLogin(redirectTo) {
    return { payload: { redirectTo } }
  },

  checkIn(utilisationPeriod) {
    return { payload: { utilisationPeriod } }
  },

  loginWithAuthenticationCode(
    authCode: string,
    authState: string,
    cookie: string,
  ) {
    return async (dispatch, _, state) => {
      try {
        dispatch(this.redirectAfterLogin(getOAuthState(cookie, authState)))

        const {
          app: {
            config: { clientID: clientId },
            hostname,
          },
        } = state

        const token = await getAccessToken({
          clientId,
          authCode,
          hostname,
        })

        return dispatch(
          this.login({
            ...token,
            accessTokenExpires: token.expiresIn,
          }),
        )
      } catch (err) {
        return dispatch({
          status: 'error',
        })
      }
    }
  },

  setOnboardingFinished() {
    return this.changeDetails({
      properties: [
        {
          key: 'onboardingFinished',
          value: 'true',
          type: 'boolean',
        },
      ],
    })
  },

  changeDetails(updatedUser: any) {
    return async (dispatch, api, state) => {
      dispatch({
        status: 'pending',
        affectedFields: Object.keys(updatedUser),
      })
      if (updatedUser.locale) {
        dispatch(app.chooseLanguage(updatedUser.locale))
      }
      const newUser = await api({
        method: 'PATCH',
        path: 'api/v1/users/' + state.authentication.user.id,
        entity: updatedUser,
      })

      /**
       * The user patch request returns a different response structure than '/me'.
       * Therefore fetch the 'correct' user again
       */
      const correctUserObject = await api({
        method: 'GET',
        path: 'api/v1/me',
      })
      const { appID } = state.app.config

      if (newUser.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: { user: correctUserObject.entity },
          affectedFields: Object.keys(updatedUser),
          appID,
        })
      } else {
        dispatch({
          status: 'error',
          affectedFields: Object.keys(updatedUser),
          payload: newUser?.entity?.errors,
        })
      }
    }
  },

  changeNotificationSettings({
    summary,
  }: {
    summary: 'daily' | 'weekly' | 'off'
  }) {
    return async (dispatch, api, state) => {
      dispatch({ status: 'pending' })
      const newSettings = await api({
        method: 'PATCH',
        path:
          'api/v1/users/' +
          state.authentication.user.id +
          '/notification-settings',
        entity: {
          notificationSettings: {
            'app-digest-email': summary,
          },
        },
      })

      if (newSettings.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: { notificationSettings: newSettings.entity },
        })
      } else {
        dispatch({ status: 'error' })
      }
    }
  },

  updateAvatar(avatarBlob: Blob, name: string) {
    return async (dispatch, api) => {
      const fd = new FormData()
      fd.append('file', avatarBlob, name)

      dispatch({ status: 'pending' })

      const uploadFile = await api({
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        path: 'api/v1/files',
        entity: fd,
      })

      if (uploadFile.status.code === 201) {
        dispatch(this.changeDetails({ profileImage: uploadFile.entity.id }))
        dispatch({ status: 'ok', payload: uploadFile.entity })
      } else {
        dispatch({ status: 'error', payload: uploadFile })
      }
    }
  },

  sessionReady() {
    return { payload: {} }
  },

  updateToken(accessToken) {
    return { payload: { accessToken } }
  },

  refreshToken(force = false) {
    return async (dispatch, _, state) => {
      if (state.authentication.loggedIn && state.app.connected) {
        const {
          accessTokenExpires,
          accessTokenFetching,
          refreshToken,
        } = state.authentication
        if (!accessTokenExpires) {
          throw new Error(
            `Cannot refresh access-token if it was passed as header. Please keep the token valid by always passing a valid one.`,
          )
        }
        if (
          force === true ||
          (!accessTokenFetching && accessTokenExpires - Date.now() <= 30000)
        ) {
          dispatch({ status: 'pending' })
          try {
            const {
              accessToken,
              refreshToken: updatedRefreshToken,
              expiresIn,
            } = await getRefreshToken({
              clientId: state.app.config.clientID,
              hostname: state.app.hostname,
              refreshToken,
            })

            dispatch({
              status: 'ok',
              payload: {
                accessToken,
                refreshToken: updatedRefreshToken,
                accessTokenExpires: expiresIn,
              },
            })
          } catch (err) {
            dispatch({ status: 'error', error: err })
            throw err
          }
        }
      }
    }
  },

  logout() {
    return async dispatch => {
      dispatch({ status: 'pending' })

      try {
        await fetch(getLogoutUrl(window.location.hostname), {
          credentials: 'include',
          redirect: 'manual',
        })
      } catch {
        // don't do anything with it yet
      }

      dispatch({ status: 'ok', payload: {} })
    }
  },

  deleteAccount() {
    return async (dispatch, api, state) => {
      dispatch({ status: 'pending' })
      const { id } = state.authentication.user
      const deleteAccount = await api({
        method: 'DELETE',
        path: `auth/users/${id}`,
      })
      if (deleteAccount.status.code === 204) {
        dispatch({ status: 'ok', payload: {} })
        return true
      } else {
        dispatch({ status: 'error' })
        return false
      }
    }
  },

  invite(statusCode: number) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })

      if (statusCode === 201) {
        const updatedUser = await api({
          method: 'GET',
          path: 'api/v1/me',
        })

        if (updatedUser.status.code === 200) {
          dispatch({
            status: 'ok',
            payload: { user: updatedUser.entity },
          })
          return
        } else {
          dispatch({ status: 'error' })
        }
      } else {
        dispatch({ status: 'error' })
      }
    }
  },

  changePassword() {
    return { payload: {} }
  },
})
