import createReducers from 'store/createReducers'

const initialState = {
  serviceChooserVisible: false,
  composeOverlayVisible: false,
  notificationsOverlayVisible: false,
}

export default createReducers(initialState, {
  toggleServiceChooser(state) {
    return {
      ...state,
      serviceChooserVisible: !state.serviceChooserVisible,
    }
  },
  setServiceChooserVisibility(state, { payload }) {
    return {
      ...state,
      serviceChooserVisible: payload.status,
    }
  },
  setComposeOverlayVisibility(state, { payload }) {
    return {
      ...state,
      composeOverlayVisible: payload.status,
    }
  },
  setNotificationsOverlayVisibility(state, { payload }) {
    return {
      ...state,
      notificationsOverlayVisible: payload.status,
    }
  },
  toggleComposeOverlayVisibility(state) {
    return {
      ...state,
      composeOverlayVisible: !state.composeOverlayVisible,
    }
  },
  toggleNotificationsOverlayVisibility(state) {
    return {
      ...state,
      notificationsOverlayVisible: !state.notificationsOverlayVisible,
    }
  },
})
