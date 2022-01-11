import createReducers from 'store/createReducers'

interface IService {
  readonly id: string
}
interface IState {
  readonly loading: boolean
  readonly services: readonly IService[]
}
const initialState: IState = {
  services: [],
  loading: true,
}

export default createReducers(initialState, {
  fetchServices(state, { status, payload }) {
    if (status === 'ok') {
      return {
        ...state,
        services: payload.services._embedded.items || [],
        loading: false,
      }
    } else {
      return {
        ...state,
        services: [],
        loading: false,
      }
    }
  },
})
