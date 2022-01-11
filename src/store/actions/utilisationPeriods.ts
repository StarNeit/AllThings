import createAction from 'store/createActions'
import AppActions from './app'

export default createAction({
  fetchUtilisationPeriods() {
    return async (dispatch, api, state) => {
      const { appID } = state.app.config
      const userId = state.authentication.user.id

      dispatch(AppActions.attachFetcher('utilisationPeriods'))
      dispatch({ status: 'loading' })

      const filter = JSON.stringify({ app: appID })
      const periods = await api({
        method: 'GET',
        path: `api/v1/users/${userId}/utilisation-periods?filter=${filter}`,
        params: {
          limit: -1,
        },
      })
      dispatch(AppActions.detachFetcher('utilisationPeriods'))

      if (periods.status.code === 200) {
        dispatch({ status: 'ok', payload: periods.entity._embedded.items })
      } else {
        dispatch({ status: 'error', error: periods.error })
      }
    }
  },
})
