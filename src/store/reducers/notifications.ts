import createReducers from 'store/createReducers'

const initialState: IState = {
  page: 0,
  pages: 0,
  items: {},
  hasUnread: false,
  unreadCount: 0,
}

interface IState {
  readonly items: IndexSignature<INotification>
  readonly page: number
  readonly pages: number
  hasUnread: boolean
  unreadCount: number
}

interface INotification {
  id: string
  read: boolean
}

export default createReducers(initialState, {
  refreshAll(state, { payload }) {
    const items = payload.entity ? payload.entity._embedded.items : []
    const { page, pages, metaData } = payload.entity
    const newItems = (items as INotification[]).reduce((prev, curr) => {
      prev[curr.id] = curr
      return prev
    }, {})

    const newState = {
      ...state,
      items: {
        ...newItems,
      },
      page: page !== state.page ? page : state.page,
      pages,
    }

    newState.unreadCount = metaData.unreadNotifications
    newState.hasUnread = newState.unreadCount > 0

    return newState
  },

  getNextPage(state, { payload }) {
    const items = payload.entity ? payload.entity._embedded.items : []
    const { page, pages, metaData } = payload.entity
    const oldItems = state.items
    const newItems = (items as INotification[]).reduce((prev, curr) => {
      prev[curr.id] = curr
      return prev
    }, {})

    const newState = {
      ...state,
      items: {
        ...oldItems,
        ...newItems,
      },
      page: page > state.page ? page : state.page,
      pages,
    }

    newState.unreadCount = metaData.unreadNotifications
    newState.hasUnread = newState.unreadCount > 0

    return newState
  },

  setRead(state, { payload }) {
    const notification = payload.entity
    let newState = state

    if (notification && notification.id) {
      newState = {
        ...state,
        items: {
          ...state.items,
          [notification.id]: notification,
        },
      }
    }

    newState.unreadCount = state.unreadCount - 1
    newState.hasUnread = newState.unreadCount > 0

    return newState
  },

  setAllRead(state: IState) {
    return {
      ...state,
      hasUnread: false,
      unreadCount: 0,
      items: Object.values(state.items)
        .map(item => ({
          ...item,
          read: true,
        }))
        .reduce((prev, curr) => {
          prev[curr.id] = curr
          return prev
        }, {}),
    }
  },
})
