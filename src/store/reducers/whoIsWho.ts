import createReducers from 'store/createReducers'

interface IState {
  readonly currentPageNum: number
  readonly totalPages: number | null
  readonly pages: ReadonlyArray<ReadonlyArray<IUser>>
  readonly profiles: {}
  readonly isLoadingNextPage: boolean
}

const initialState: IState = {
  currentPageNum: 0,
  totalPages: null,
  pages: [[]],
  profiles: {},
  isLoadingNextPage: false,
}

export default createReducers(initialState, {
  openUserList(state, { payload }) {
    return {
      ...state,
      currentPageNum: payload.users.page,
      totalPages: payload.users.pages,
      pages: [payload.users._embedded.items],
    }
  },

  fetchNextUserListPage(state, { status, payload }) {
    switch (status) {
      case 'loading':
        return {
          ...state,
          isLoadingNextPage: true,
        }
      case 'ok':
        return {
          ...state,
          isLoadingNextPage: false,
          currentPageNum: payload.page,
          pages: [...state.pages, payload._embedded.items],
        }
      default:
        return state
    }
  },

  openProfile(state, { payload }) {
    return {
      ...state,
      profiles: {
        ...state.profiles,
        [payload.userId]: payload.profile,
      },
    }
  },
})
