import createReducers from 'store/createReducers'
import concat from 'lodash/concat'
import { MAX_AVAILABLES_LENGTH_SIZE } from 'microapps/booking/Utils'
import { IAvailability } from 'microapps/booking'

interface IState {
  readonly categories: {
    readonly loading: boolean
    readonly items: ReadonlyArray<{
      readonly id: string
      readonly key: string
      readonly name: IndexSignature<string>
      readonly description: string | null
    }>
  }
  readonly shouldRefetch: boolean
  readonly availables: readonly IAvailability[]
  readonly availablesUpdatedAt: number
  readonly availablesStatus: string
  readonly numberOfAssets: number | null
  readonly preferredBookingRange: {
    readonly date: Date | null
    readonly timeFrom: string | null
    readonly timeTo: string | null
  }
}

const initialState: IState = {
  categories: {
    loading: true,
    items: [],
  },
  shouldRefetch: false,
  availables: [],
  availablesUpdatedAt: 0,
  availablesStatus: 'pending',
  numberOfAssets: null,
  preferredBookingRange: { date: null, timeFrom: null, timeTo: null },
}

export default createReducers(initialState, {
  openOverview(state, { payload, status }) {
    switch (status) {
      case 'pending':
        return {
          ...state,
          categories: {
            loading: true,
            items: [],
          },
        }
      case 'ok':
        return {
          ...state,
          categories: {
            loading: false,
            items: payload._embedded.items,
          },
        }
      default:
        return state
    }
  },
  fetchAvailables(state, { status, payload }) {
    switch (status) {
      case 'pending':
        return { ...state, availablesStatus: status }
      case 'ok': {
        const newAvailables = concat(state.availables, payload)
        if (newAvailables.length >= MAX_AVAILABLES_LENGTH_SIZE) {
          newAvailables.splice(
            0,
            newAvailables.length - MAX_AVAILABLES_LENGTH_SIZE,
          )
        }
        return {
          ...state,
          availables: newAvailables,
          availablesUpdatedAt: new Date().getTime(),
          availablesStatus: status,
        }
      }
      default:
        return { ...state, availablesStatus: status }
    }
  },
  shouldRefetch(state, { payload: { shouldRefetch } }) {
    return {
      ...state,
      shouldRefetch,
    }
  },
  clearAvailables(state) {
    return { ...state, availables: [], availablesStatus: 'ok' }
  },
  fetchOneAsset(state, { payload, status }) {
    switch (status) {
      case 'ok':
        return {
          ...state,
          numberOfAssets: payload.total,
        }
      default:
        return state
    }
  },
  setPreferredBookingRange(state, { payload: { date, timeFrom, timeTo } }) {
    return { ...state, preferredBookingRange: { date, timeFrom, timeTo } }
  },
})
