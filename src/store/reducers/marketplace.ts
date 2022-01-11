import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import uniqBy from 'lodash-es/uniqBy'

interface IState {
  readonly lastClicked: string | null
  readonly things: {
    readonly loading: boolean
    readonly loadingNext: boolean
    readonly loadingPrevious: boolean
    readonly items: ReadonlyArray<{
      readonly id: string
    }>
    readonly links?: IPaginationLinks
  }
  readonly view: string
}

const initialState: IState = {
  lastClicked: null,
  things: {
    loading: true,
    loadingNext: false,
    loadingPrevious: false,
    items: [],
    links: {},
  },
  view: 'discover',
}

export default createReducers(initialState, {
  createThing(state, { payload }) {
    const items = uniqBy([payload].concat(state.things.items), 'id')

    return Object.assign({}, state, {
      things: {
        loading: false,
        loadingNext: false,
        loadingPrevious: false,
        items,
        links: state.things.links,
      },
    })
  },

  deleteThing(state, { payload, status }) {
    switch (status) {
      case 'loading':
        return state

      case 'ok':
        const { id } = payload
        const items = state.things.items.filter(t => t.id !== id)

        return {
          ...state,
          things: {
            loading: false,
            loadingNext: false,
            loadingPrevious: false,
            items,
            links: state.things.links,
          },
        }

      case 'error':
        return merge({}, state, {
          things: {
            loading: false,
            loadingNext: false,
            loadingPrevious: false,
          },
        })

      default:
        return state
    }
  },

  fetchThing(state, { needsReFetch, payload, status }): IState {
    return this.fetchThings(state, { payload: [payload], status, needsReFetch })
  },

  fetchThings(
    state,
    { payload, status, links, previous, next, reset, needsReFetch },
  ) {
    switch (status) {
      case 'loading':
        const hasPrevious = typeof previous !== 'undefined'
        const hasNext = typeof next !== 'undefined'

        return merge({}, state, {
          things: {
            loading: !hasNext && !hasPrevious,
            loadingNext: hasNext,
            loadingPrevious: hasPrevious,
          },
        })

      case 'ok':
        let items
        const newLinks = Object.assign({}, links)

        if (next) {
          items = uniqBy(state.things.items.concat(payload), 'id')
        } else if (previous) {
          items = uniqBy(payload.concat(state.things.items), 'id')
        } else {
          items = payload
        }

        /*
         * We want to keep the previous link of the first post in the state
         * in order to be able to load them.
         */
        if (!reset && newLinks.hasOwnProperty('previous') && !previous) {
          newLinks.previous = state.things.links.previous
        }

        if (!reset && previous) {
          if (state.things.links.next) {
            newLinks.next = state.things.links.next
          } else {
            delete newLinks.next
          }
        }

        return {
          ...state,
          things: {
            loading: false,
            loadingNext: false,
            loadingPrevious: false,
            items,
            links: newLinks,
            needsReFetch,
          },
        }

      case 'error':
        return merge({}, state, {
          things: {
            loading: false,
            loadingNext: false,
            loadingPrevious: false,
          },
        })

      default:
        return state
    }
  },

  setView(state, { payload: { view } }) {
    return { ...state, view }
  },

  setLastClicked(state, { payload: { id: lastClicked } }) {
    return { ...state, lastClicked }
  },
})
