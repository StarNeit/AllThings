import { Dispatch, Action } from 'redux'

function addTypeToAction(type: string, payload: any = {}): Action {
  if (typeof payload === 'function') {
    return payload
  }

  return {
    type,
    ...payload,
  }
}

function wrapDispatch(actionName: string, dispatch: FunctionalDispatch) {
  return (payload: IndexSignature) =>
    dispatch(addTypeToAction(actionName, payload))
}

export default function createActions<
  T extends {
    [key: string]: (...args: unknown[]) => FunctionalAction | SimpleAction
  }
>(
  actions: T,
): {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>
} {
  const result = {} as any

  // tslint:disable:forin
  for (const actionName in actions) {
    let actionCreator = actions[actionName]
    actionCreator = actionCreator.bind(result)
    result[actionName] = (...args: any[]) => {
      let action = actionCreator(...args)

      if (typeof action === 'function') {
        action = action.bind(result)

        return async (
          dispatch: FunctionalDispatch,
          sdk: InjectedSDK,
          state: IReduxState,
        ) => {
          const wrappedDispatch = wrapDispatch(actionName, dispatch)

          return (action as FunctionalAction)(
            wrappedDispatch as Dispatch,
            sdk,
            state,
          )
        }
      } else {
        return addTypeToAction(actionName, action)
      }
    }
  }
  // tslint:enable:forin

  return result
}
