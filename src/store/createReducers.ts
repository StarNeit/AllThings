// Creates reducers with keys from given object, needs an according action with
// the same key.
export default function createReducers<
  S extends IndexSignature,
  K extends string
>(initialState: S, handlers: { [key in K]: (s: S, a: unknown) => S }) {
  return (state = initialState, action: SimpleAction): S =>
    handlers[action.type] ? handlers[action.type](state, action) : state
}
