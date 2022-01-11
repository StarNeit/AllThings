import { Action } from 'redux'

// Exceptions
const exceptions: string[] = []

export default function checkStandardAction() {
  return () => (next: (action: Action) => Action) => (
    action: Action & { payload?: IndexSignature; status?: string },
  ) => {
    if (typeof action === 'object') {
      if (typeof action.type === 'undefined') {
        // tslint:disable-next-line:no-console
        console.warn('Action MUST include the property `type`.', action)
      }

      if (exceptions.indexOf(action.type) !== -1) {
        next(action)
        return
      }

      if (
        typeof action.payload === 'undefined' &&
        typeof action.status === 'undefined'
      ) {
        // tslint:disable-next-line:no-console
        console.warn(
          'Action MUST include one of the properties `status` or `payload`.',
          action,
        )
      }

      if (
        typeof action.payload !== 'undefined' &&
        typeof action.payload !== 'function' &&
        typeof action.payload !== 'object'
      ) {
        // tslint:disable-next-line:no-console
        console.warn(
          'Payload MUST be one of of the types `Object` or `Function`.',
          action,
        )
      }
    }

    next(action)
  }
}
