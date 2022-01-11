import createReducers from 'store/createReducers'
import { Locale } from 'enums'

const initialState = {
  user: {},
}

interface IProvidedUser {
  readonly id: string
  readonly username: string
  readonly locale: Locale
  readonly _embedded: {
    readonly utilisationPeriods: ReadonlyArray<{
      readonly id: string
    }>
  }
}

function extractUser(user: IProvidedUser) {
  const { id, username, locale, _embedded } = user
  const { utilisationPeriods } = _embedded
  const firstPeriod = utilisationPeriods[0]

  let activePeriod = {}

  if (firstPeriod) {
    activePeriod = {
      id: firstPeriod.id,
    }
  }

  return {
    id,
    locale,
    username,
    activePeriod,
  }
}

export default createReducers(initialState, {
  login(state, { status, payload }) {
    if (status === 'ok') {
      return {
        ...state,
        user: extractUser(payload.user),
      }
    }
    return state
  },
})
