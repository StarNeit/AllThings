import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import uniqBy from 'lodash-es/uniqBy'

interface IUtilisationPeriod {
  readonly id: string
  readonly grossRent: number
  readonly currency: string
  readonly startDate: string
  readonly netRent: number
  readonly additionalCostsItems: ReadonlyArray<{
    readonly amount: number
    readonly key: string
    readonly description: IMessage
  }>
  readonly noticePeriodDescription: IMessage
  readonly _embedded: {
    readonly unit: Unit
  }
}
interface IState {
  readonly loading: boolean
  readonly items: IUtilisationPeriod[]
}

const initialState: IState = {
  loading: true,
  items: [],
}

export default createReducers(initialState, {
  fetchUtilisationPeriods(state, { payload, status }) {
    switch (status) {
      case 'loading':
        return merge({}, state, { loading: true })
      case 'ok':
        const items = uniqBy(state.items.concat(payload), 'id')
        return Object.assign({}, state, {
          loading: false,
          items,
        })
      case 'error':
        return merge({}, state, { loading: false })
      default:
        return state
    }
  },
})
