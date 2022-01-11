import createActions from 'store/createActions'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { AVAILABLES_FETCH_SIZE } from 'microapps/booking/Utils'

const dateToYearMonthDay = (day: Date) => format(day, 'y-MM-dd')

export default createActions({
  openOverview() {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })
      const categories = await api({
        method: 'GET',
        path: 'api/v1/assets/bookable/categories',
      })

      if (categories.status.code === 200) {
        dispatch({ status: 'ok', payload: categories.entity })
        return true
      } else {
        dispatch({ status: 'error' })
        return false
      }
    }
  },

  openAssetList() {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })
      const assets = await api({
        method: 'GET',
        path: 'api/v1/assets/bookable',
      })

      if (assets.status.code === 200) {
        dispatch({ status: 'ok', payload: assets.entity })
        return true
      } else {
        dispatch({ status: 'error' })
        return false
      }
    }
  },
  fetchAvailables(
    assetId: string,
    startDate: Date,
    nrOfDays: number = AVAILABLES_FETCH_SIZE,
  ) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })
      const response = await api({
        method: 'GET',
        path: `api/v1/assets/${assetId}/availability`,
        params: {
          dateFrom: dateToYearMonthDay(startDate),
          dateTo: !nrOfDays
            ? ''
            : dateToYearMonthDay(addDays(startDate, nrOfDays - 1)),
        },
      })
      if (response.status.code === 200) {
        dispatch({ status: 'ok', payload: response.entity._embedded.items })
        return true
      } else {
        return false
      }
    }
  },
  shouldRefetch(shouldRefetch: boolean) {
    return { payload: { shouldRefetch } }
  },
  clearAvailables() {
    return { payload: {} }
  },
  fetchOneAsset() {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })
      const oneAsset = await api({
        method: 'GET',
        path: 'api/v1/assets/bookable',
        params: {
          limit: 1,
        },
      })

      if (oneAsset.status.code === 200) {
        dispatch({ status: 'ok', payload: oneAsset.entity })
        return true
      } else {
        dispatch({ status: 'error' })
        return false
      }
    }
  },
  setPreferredBookingRange({
    date,
    timeFrom,
    timeTo,
  }: {
    date: Date
    timeFrom: string
    timeTo: string
  }) {
    return dispatch => dispatch({ payload: { date, timeFrom, timeTo } })
  },
})
