import createReducers from 'store/createReducers'

interface IState {
  readonly microApps?: IndexSignature<string>
}

const initialState: IState = {}

export default createReducers(initialState, {
  initMicroApps(state, { status, payload }) {
    if (status !== 'error' && payload._embedded.items.length) {
      return {
        ...state,
        microApps: payload._embedded.items.reduce(
          (prev: IState['microApps'], microAppConfig: MicroAppProps) => {
            return { ...prev, [microAppConfig.type]: microAppConfig.color }
          },
          {},
        ),
      }
    } else {
      return state
    }
  },
})
