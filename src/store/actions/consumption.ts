import createActions from 'store/createActions'
import AppActions from 'store/actions/app'

export interface IFetchDataParams {
  readonly dateTo?: any
  readonly previous?: boolean
}

export default createActions({
  fetchData({ dateTo, previous }: IFetchDataParams) {
    return async (dispatch, api, state) => {
      const size = (state.authentication.user.unit as any).size || 0
      const { appID } = state.app.config
      const { id, startDate } = state.authentication.user.activePeriod
      const fetcherId = 'consumption.fetch.data'
      const prevDateTo = previous && state.consumption.dateTo.split('-')
      const dateToObj = {
        dateTo: previous
          ? `${(prevDateTo[0] as any) - 1}-${prevDateTo[1]}`
          : dateTo,
      }
      const [splitStartDateYear, splitStartDateMonth] = startDate.split('-')
      const [splitDateToYear, splitDateToMonth] = dateToObj.dateTo.split('-')
      const compStartDate = new Date(
        splitStartDateYear as any,
        splitStartDateMonth as any,
      )
      const compDateFrom = new Date(splitDateToYear - 1, splitDateToMonth)

      dispatch({ status: 'pending', previous })

      dispatch(AppActions.attachFetcher(fetcherId))

      const data = await api({
        path: `/api/v1/utilisation-periods/${id}/consumption`,
        params: dateToObj,
      })

      const average = await api({
        path: `/api/v1/apps/${appID}/average-consumptions`,
        params: dateToObj,
      })

      dispatch(AppActions.detachFetcher(fetcherId))

      if (average.status.code === 200 && data.status.code === 200) {
        dispatch({
          status: 'ok',
          dataPayload: data.entity,
          averagePayload: average.entity,
          previous,
          outOfRange: compStartDate > compDateFrom,
          ...dateToObj,
          unitSize: size,
        })
      }
    }
  },
})
