import createActions from 'store/createActions'
import AppActions from './app'
import filters from 'utils/filters'

const THINGS_LIMIT = 30

export default createActions({
  createThing(thing: object) {
    return { payload: thing }
  },

  deleteThing(id: string) {
    return async (dispatch, api) => {
      dispatch(AppActions.attachFetcher('deleteThing'))
      dispatch({ status: 'loading' })
      const thing = await api({
        method: 'DELETE',
        path: `api/v1/things/${id}`,
      })
      dispatch(AppActions.detachFetcher('deleteThing'))

      if (thing.status.code === 204) {
        dispatch({ status: 'ok', payload: { id } })
      } else {
        dispatch({ status: 'error', error: thing.error })
      }
    }
  },

  fetchThing(id: string) {
    return async (dispatch, api) => {
      dispatch(AppActions.attachFetcher('fetchThing'))
      dispatch({ status: 'loading' })
      const thing = await api({
        method: 'GET',
        path: `api/v1/things/${id}`,
      })
      dispatch(AppActions.detachFetcher('fetchThing'))

      if (thing.status.code === 200) {
        dispatch({ status: 'ok', payload: thing.entity, needsReFetch: true })
      } else {
        dispatch({ status: 'error', error: thing.error })
      }
    }
  },

  fetchThings({
    reset = false,
    filter,
    previous = null,
    next = null,
    since = null,
  }: IPaginationLinks & {
    reset: boolean
    filter?: ReadonlyArray<IndexSignature<string | string[]>>
    since?: string
  }) {
    return async (dispatch, api) => {
      const noCursor = !previous && !next
      const params: any = { limit: THINGS_LIMIT }
      const path =
        (previous && previous.href) || (next && next.href) || 'api/v2/things'

      if (typeof filter !== 'undefined' && noCursor) {
        params.filter = filters(filter)
      }

      if (since && noCursor) {
        params.since = since
        params.include = true
      }

      dispatch(AppActions.attachFetcher('fetchThings'))
      dispatch({ status: 'loading', previous, next })
      const things = await api({
        method: 'GET',
        params,
        path,
      })
      dispatch(AppActions.detachFetcher('fetchThings'))

      if (things.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: things.entity._embedded.items,
          links: things.entity._links,
          previous,
          next,
          reset,
        })
      } else {
        dispatch({ status: 'error', error: things.error })
      }
    }
  },

  setView(view) {
    return { payload: { view } }
  },

  setLastClicked(id) {
    return { payload: { id } }
  },
})
