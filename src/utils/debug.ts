import API from 'store/api'
import { Store } from 'redux'

export function installHelpers(store: Store) {
  ;(window as any).Store = store
  ;(window as any).API = API(store.getState)
}
