import createActions from 'store/createActions'
import appActions from './app'
const JAMES_FETCH_SERVICES = 'jamesServices'

export default createActions({
  placeOrder(service, orderDetails, emailText) {
    return async (dispatch, api, state) => {
      const serviceOrder = await api({
        method: 'POST',
        path: `api/v1/users/${state.authentication.user.id}/service-orders`,
        entity: {
          details: orderDetails,
          service,
          emailText,
        },
      })
      dispatch({ status: 'ok', payload: { order: serviceOrder.entity } })
    }
  },

  fetchServices() {
    return async (dispatch, api) => {
      dispatch(appActions.attachFetcher(JAMES_FETCH_SERVICES))
      const services = await api({
        method: 'GET',
        path: 'api/v1/services',
        params: {
          limit: 30,
        },
      })
      dispatch(appActions.detachFetcher(JAMES_FETCH_SERVICES))
      if (services.status.code === 200) {
        dispatch({ status: 'ok', payload: { services: services.entity } })
      } else {
        dispatch({ status: 'error', error: services.error })
      }
    }
  },
})
