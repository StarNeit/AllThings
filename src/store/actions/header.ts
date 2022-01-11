import createActions from 'store/createActions'

export default createActions({
  toggleServiceChooser() {
    return { payload: {} }
  },
  setServiceChooserVisibility(status) {
    return { payload: { status } }
  },
  setComposeOverlayVisibility(status) {
    return { payload: { status } }
  },
  setNotificationsOverlayVisibility(status) {
    return { payload: { status } }
  },
  toggleComposeOverlayVisibility() {
    return { payload: {} }
  },
  toggleNotificationsOverlayVisibility() {
    return { payload: {} }
  },
})
