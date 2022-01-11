import { Store } from 'redux'
export default (store: Store<IReduxState>, actions: any) =>
  Object.keys(actions).reduce(
    (prev: any, prop) => ({
      ...prev,
      [prop]: (...args: any[]) => store.dispatch(actions[prop](...args)),
    }),
    {},
  )
