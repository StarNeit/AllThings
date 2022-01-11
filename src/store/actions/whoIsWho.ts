import createActions from 'store/createActions'

const PAGE_LIMIT = 25

export default createActions({
  openUserList() {
    return async (dispatch, api, state) => {
      const { appID } = state.app.config
      const users = await api({
        method: 'GET',
        path: `api/v1/apps/${appID}/users`,
        params: {
          'sort-by': 'transliteratedUsername',
          'sort-direction': 'asc',
          page: 1,
          limit: PAGE_LIMIT,
        },
      })
      dispatch({ status: 'ok', payload: { users: users.entity } })
    }
  },

  fetchNextUserListPage() {
    return async (
      dispatch,
      api,
      {
        app: {
          config: { appID },
        },
        whoIsWho: { currentPageNum, isLoadingNextPage, totalPages },
      },
    ) => {
      // Ensure not to trigger the action if loading is already in progress.
      // Fixes https://allthings.atlassian.net/browse/APP-804.
      if (!isLoadingNextPage && totalPages > currentPageNum) {
        dispatch({ status: 'loading' })
        const { entity: payload } = await api({
          method: 'GET',
          path: `api/v1/apps/${appID}/users`,
          params: {
            'sort-by': 'transliteratedUsername',
            'sort-direction': 'asc',
            page: currentPageNum + 1,
            limit: PAGE_LIMIT,
          },
        })
        dispatch({ status: 'ok', payload })
      }
    }
  },

  openProfile(userId) {
    return async (dispatch, api) => {
      const user = await api({
        method: 'GET',
        path: `api/v1/users/${userId}`,
      })
      dispatch({
        status: 'ok',
        payload: { userId, profile: user.entity },
      })
    }
  },

  sendMessageToUser(message, userId) {
    return async (dispatch, api) => {
      const mail = await api({
        method: 'POST',
        path: `api/v1/users/${userId}/messages`,
        entity: {
          content: message,
        },
      })
      dispatch({ status: 'ok', payload: { message: mail.entity } })
    }
  },
})
