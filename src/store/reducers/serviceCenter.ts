import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import uniqBy from 'lodash-es/uniqBy'
import { dateFromISO8601 } from 'utils/date'

export interface ICategory {
  readonly id: string
  readonly key: string
  readonly name: IndexSignature<string>
  readonly description: IndexSignature<string>
  readonly thirdPartyData: boolean
}

interface IState {
  readonly categories: {
    readonly loading: boolean
    readonly items: readonly ICategory[]
  }

  readonly tickets: {
    readonly loading: boolean
    readonly loadingNext: boolean
    readonly loadingPrevious?: boolean
    readonly items: ReadonlyArray<ITicket>
    readonly links?: IPaginationLinks
    readonly shouldFetchAll?: boolean
  }

  readonly currentConversation: {
    readonly id: string | null
    readonly addingComment: boolean
    readonly loading: boolean
    readonly items: ReadonlyArray<IConversationMessage>
  }
}

const initialState: IState = {
  categories: {
    loading: true,
    items: [],
  },
  tickets: {
    loading: true,
    loadingNext: false,
    items: [],
    shouldFetchAll: false,
  },
  currentConversation: {
    id: null,
    addingComment: false,
    loading: true,
    items: [],
  },
}

function sortTickets(a: ITicket, b: ITicket) {
  return (
    (dateFromISO8601(b.updatedAt) as any) -
    (dateFromISO8601(a.updatedAt) as any)
  )
}

function sortConversationMessages(a: ITicket, b: ITicket) {
  return (
    (dateFromISO8601(a.createdAt) as any) -
    (dateFromISO8601(b.createdAt) as any)
  )
}

export default createReducers(initialState, {
  submitForm(state, { meta, status, payload }) {
    if (meta.formName === 'serviceCenter' && status === 'ok') {
      const items = [...state.tickets.items, payload]
      items.sort(sortTickets)

      return {
        ...state,
        tickets: {
          ...state.tickets,
          loading: false,
          items,
        },
      }
    }

    return state
  },

  addTicketToList(state, { payload }): IState {
    // simulate a response from fetchTicket
    return this.fetchTicket(state, { status: 'ok', payload })
  },

  fetchTicket(state, { status, payload }): IState {
    switch (status) {
      case 'pending':
        return merge({}, state, {
          tickets: {
            loading: true,
          },
        })
      case 'ok':
        // simulate a response from fetchTickets
        return this.fetchTickets(state, {
          status: 'ok',
          payload: { items: [payload, ...state.tickets.items] },
          noSort: true,
          shouldFetchAll: true,
        })

      default:
        return state
    }
  },

  fetchTickets(
    state,
    { status, payload, links, previous, next, reset, shouldFetchAll },
  ) {
    switch (status) {
      case 'loading':
        const hasPrevious = typeof previous !== 'undefined'
        const hasNext = typeof next !== 'undefined'

        return merge({}, state, {
          tickets: {
            loading: !hasNext && !hasPrevious,
            loadingNext: hasNext,
            loadingPrevious: hasPrevious,
          },
        })

      case 'ok':
        const fetchedItems = payload.items as readonly ITicket[]
        let items = []
        const newLinks = Object.assign({}, links)

        if (next) {
          items = uniqBy(state.tickets.items.concat(fetchedItems), 'id')
        } else if (previous) {
          items = uniqBy(fetchedItems.concat(state.tickets.items), 'id')
        } else {
          items = uniqBy(fetchedItems, 'id')
        }

        /*
         * We want to keep the previous link of the first ticket in the state
         * in order to be able to load them.
         */
        if (!reset && newLinks.hasOwnProperty('previous') && !previous) {
          newLinks.previous = state.tickets.links.previous
        }

        if (!reset && previous) {
          if (state.tickets.links.next) {
            newLinks.next = state.tickets.links.next
          } else {
            delete newLinks.next
          }
        }

        return {
          ...state,
          tickets: {
            items,
            links: newLinks,
            loading: false,
            loadingNext: false,
            loadingPrevious: false,
            next,
            previous,
            reset,
            shouldFetchAll,
          },
        }

      case 'error':
        return merge({}, state, {
          tickets: { loading: false },
        })

      default:
        return state
    }
  },

  updateTicket(state, { status, payload }) {
    if (status === 'ok') {
      const items = state.tickets.items.map(ticket =>
        ticket.id === payload.id ? payload : ticket,
      )
      items.sort(sortTickets)

      return {
        ...state,
        tickets: {
          ...state.tickets,
          items,
        },
      }
    }

    return state
  },

  fetchConversationMessages(state, { status, payload, meta }) {
    switch (status) {
      case 'pending':
        return merge({}, state, {
          currentConversation: {
            loading: true,
          },
        })
      case 'ok':
        const items = payload._embedded.items.sort(sortConversationMessages)

        return merge({}, state, {
          currentConversation: {
            id: meta.id,
            loading: false,
            items,
          },
        })
      default:
        return state
    }
  },

  resetConversationMessages(state) {
    return {
      ...state,
      currentConversation: initialState.currentConversation,
    }
  },

  postConversationMessage(state, { status, payload, meta }) {
    switch (status) {
      case 'pending':
        return merge({}, state, {
          currentConversation: { addingComment: true },
        })
      case 'ok':
        // don't bother updating the state if the posted message is not in the current conversation
        if (meta.id !== state.currentConversation.id) {
          return state
        }

        const items = uniqBy(
          state.currentConversation.items.concat(payload),
          'id',
        )
        return merge({}, state, {
          currentConversation: {
            addingComment: false,
            items,
          },
        })
      case 'error':
        return merge({}, state, {
          currentConversation: { addingComment: false },
        })
    }

    return state
  },

  fetchTicketCategories(state, { status, payload }) {
    if (status === 'pending') {
      return {
        ...state,
        categories: { ...state.categories, loading: true },
      }
    } else if (status === 'ok') {
      return merge({}, state, {
        categories: { items: payload._embedded.items, loading: false },
      })
    }
    return state
  },
})
