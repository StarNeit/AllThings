import { Action, Reducer } from 'redux'

export default function rootReducers(
  state: IReduxState,
  action: Action,
  appReducers: Reducer<IReduxState>,
) {
  if (action.type === 'logout' || action.type === 'deleteAccount') {
    // Only keep in state what is app-related, nothing user-centric.
    // This ensure not to have uncleared elements in state when
    // switching accounts.
    const {
      app,
      authentication, // still needed for the access-token when loggin out!
      form,
      header,
      router,
      theme,
    } = state

    state = {
      app,
      authentication,
      form,
      header,
      router,
      theme,
    } as IReduxState
  }

  return appReducers(state, action)
}
