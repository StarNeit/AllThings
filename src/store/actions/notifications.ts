import createActions from 'store/createActions'
import size from 'lodash-es/size'

export default createActions({
  refreshAll() {
    return async (dispatch, api, state) => {
      const userId = state.authentication.user.id
      const notifications = await api({
        method: 'GET',
        params: {
          page: 1,
          limit: Math.max(10, size(state.notifications.items)),
        },
        path: 'api/v1/users/' + userId + '/notifications',
      })

      if (notifications.status.code === 200) {
        dispatch({ status: 'ok', payload: notifications })
      }
    }
  },

  getNextPage(page = 1) {
    return async (dispatch, api, state) => {
      const userId = state.authentication.user.id
      const notifications = await api({
        method: 'GET',
        params: {
          page,
          limit: 10,
        },
        path: 'api/v1/users/' + userId + '/notifications',
      })

      if (notifications.status.code === 200) {
        dispatch({ status: 'ok', payload: notifications })
      }
    }
  },

  setRead(nid) {
    return async (dispatch, api) => {
      const notifications = await api({
        method: 'PATCH',
        entity: {
          read: 'true',
        },
        path: 'api/v1/notifications/' + nid,
      })

      dispatch({ status: 'ok', payload: notifications })
    }
  },

  setAllRead() {
    return async (dispatch, api, state) => {
      const userId = state.authentication.user.id
      const update = await api({
        method: 'PATCH',
        entity: {
          lastReadAt: new Date().toISOString(),
        },
        path: 'api/v1/users/' + userId + '/notifications',
      })

      if (update.status.code === 204) {
        dispatch({ status: 'ok' })
      }
    }
  },
})
