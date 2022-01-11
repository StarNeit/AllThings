import { createStore, applyMiddleware, compose, Action } from 'redux'
import checkStandardAction from './checkStandardActionMiddlware'
import createRootReducer from './reducers'
import AppActions from './actions/app'
import mixpanelMiddleware from './analytics/mixpanelMiddleware'
import rootReducers from './rootReducers'
import { routerMiddleware } from 'connected-react-router'
import { History } from 'history'

const createApiMiddleware = (
  api: (getState: () => IReduxState) => InjectedSDK,
) => {
  return ({
    dispatch,
    getState,
  }: {
    dispatch: FunctionalDispatch
    getState: () => IReduxState
  }) => (next: (action: Action) => Action) => (
    action: FunctionalAction | Action,
  ) => {
    if (typeof action === 'function') {
      const sdk = api(getState)
      return action(dispatch, sdk, getState()).catch((err: any) => {
        // don't dispatch on loaderrors,
        // these happen when no network connection is available
        if (err.error !== 'loaderror') {
          dispatch(AppActions.error(err))
        }
        throw err
      })
    } else {
      return next(action)
    }
  }
}

export const HYDRATE_STATE = 'HYDRATE_STATE'

const makeHydratable = (
  reducer: (state: Partial<IReduxState>, action: IndexSignature) => IReduxState,
) => (state: IReduxState, action: SimpleAction) =>
  action.type === HYDRATE_STATE
    ? reducer(action.state, action)
    : reducer(state, action)

const configureStore = (
  api: (getState: () => IReduxState) => InjectedSDK,
  initialState = {},
  history: History = null,
) => {
  const devTools =
    typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
      : (f: any) => f

  const enhancers = compose(
    applyMiddleware(
      ...[
        createApiMiddleware(api),
        checkStandardAction(),
        mixpanelMiddleware(),
        routerMiddleware(history),
      ],
    ),
    devTools,
  )

  const reducer = createRootReducer(history)
  const appReducers = makeHydratable(reducer)

  return createStore(
    (state, action) => rootReducers(state, action, appReducers),
    initialState as IReduxState,
    enhancers,
  )
}

export default configureStore
