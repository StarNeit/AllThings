import { push } from 'connected-react-router'
import { Store } from 'redux'
import exposeActions from './exposeActions'
import App from './actions/app'
import Auth from './actions/authentication'
import Form from './actions/form'

export default (store: Store<IReduxState>) => ({
  ...exposeActions(store, {
    openForm: Form.openForm,
    setConnected: App.setConnected,
    updateToken: Auth.updateToken,
  }),
  push: (path: string) => {
    // prevent dispatching push twice because native app sends back a push
    if (path !== store.getState().router.location.pathname) {
      store.dispatch(push(path))
    }
  },
})
