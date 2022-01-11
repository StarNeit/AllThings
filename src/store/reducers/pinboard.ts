import createReducers from 'store/createReducers'
import get from 'lodash-es/get'
import has from 'lodash-es/has'
import merge from 'lodash-es/merge'
import { IPost } from 'microapps/pinboard'
import { COMMENT_FOLD_TRAILING_COUNT } from 'microapps/pinboard/global'
import { Locale } from 'enums'

interface IComment {
  readonly id: string
  readonly content: string
  readonly createdAt: string
  readonly published: true
  readonly sortHash: true
}
interface IState {
  readonly isSendingPost: boolean
  readonly isLoadingMore: boolean
  readonly feed: readonly string[]
  readonly pendingPosts: readonly string[]
  readonly upcomingPosts: readonly string[]
  readonly loadingMorePosts: boolean
  readonly morePostsAvailable: boolean
  readonly uploadingFilesPosts: readonly string[]
  readonly posts: IndexSignature<IPost>
  readonly comments: IndexSignature<
    {
      readonly pending?: boolean
      readonly total: number
      readonly items: ReadonlyArray<IComment>
    },
    string
  >
  readonly reportPostStatuses: {}
  readonly reportCommentStatuses: {}
  readonly visibilityScopes: ReadonlyArray<{
    readonly id: string
    readonly defaultLocale: Locale
    readonly channels: ReadonlyArray<string>
    readonly translations: ReadonlyArray<{
      readonly label: string
      readonly locale: Locale
    }>
  }>
  // OLD
  readonly currentPublicUser: {
    readonly loading: boolean
    readonly profile: {}
  }
}

const initialState: IState = {
  isSendingPost: false,
  isLoadingMore: false,
  feed: [],
  pendingPosts: [],
  upcomingPosts: [],
  loadingMorePosts: false,
  morePostsAvailable: false,
  uploadingFilesPosts: [],
  posts: {},
  comments: {},
  reportPostStatuses: {},
  reportCommentStatuses: {},
  visibilityScopes: [],
  // OLD
  currentPublicUser: {
    loading: true,
    profile: {},
  },
}

function updatePosts(
  posts: IndexSignature<IPost>,
  newPostsCollection: readonly IPost[],
) {
  return {
    ...posts,
    ...newPostsCollection.reduce((currentPosts, post) => {
      currentPosts[post.id] = post
      return currentPosts
    }, {}),
  }
}

function removeUserLikeFromPost(post: IPost) {
  return {
    ...post,
    likeCount: post._meta.likedByUser ? post.likeCount - 1 : post.likeCount,
    _meta: { ...post._meta, likedByUser: false },
  }
}

function addUserLikeToPost(post: IPost) {
  return {
    ...post,
    likeCount: post._meta.likedByUser ? post.likeCount : post.likeCount + 1,
    _meta: { ...post._meta, likedByUser: true },
  }
}

export default createReducers(initialState, {
  openFeed(state, { payload }) {
    const { posts, visibilityScopes } = payload
    return {
      ...state,
      posts: updatePosts(state.posts, posts._embedded.items),
      pendingPosts: [],
      upcomingPosts: [],
      feed: (posts._embedded.items as readonly IPost[]).map(post => post.id),
      morePostsAvailable: has(payload, '_links.next.href'),
      visibilityScopes: visibilityScopes._embedded.items,
    }
  },

  muteUser(state, { payload }) {
    return {
      ...state,
      feed: state.feed.filter(postId => postId !== payload.postId),
    }
  },

  backgroundRefreshFeed(state, { payload }) {
    const newPosts = get(payload, '_embedded.items', [])
    if (newPosts.length === 0 || state.isSendingPost) {
      return state
    }
    if (state.feed.length === 0) {
      return {
        ...state,
        posts: updatePosts(state.posts, newPosts),
        feed: [
          ...(newPosts as readonly IPost[]).map(post => post.id),
          ...state.feed,
        ],
      }
    } else {
      return {
        ...state,
        posts: updatePosts(state.posts, newPosts),
        upcomingPosts: (newPosts as readonly IPost[])
          .map(post => post.id)
          .filter(postId => state.pendingPosts.indexOf(postId) === -1),
      }
    }
  },

  pressShowUpcomingButton(state) {
    return {
      ...state,
      feed: [...state.upcomingPosts, ...state.pendingPosts, ...state.feed],
      upcomingPosts: [],
      pendingPosts: [],
    }
  },

  requestMorePosts(state, { payload, status }) {
    if (status === 'pending') {
      return {
        ...state,
        loadingMorePosts: true,
      }
    } else {
      const newPosts = get(payload, '_embedded.items', [])
      return {
        ...state,
        posts: updatePosts(state.posts, newPosts),
        feed: [
          ...state.feed,
          ...(newPosts as readonly IPost[]).map(post => post.id),
        ],
        loadingMorePosts: false,
        morePostsAvailable: has(payload, '_links.next.href'),
      }
    }
  },

  deletePost(state, { payload, status }) {
    if (status === 'ok') {
      return {
        ...state,
        feed: state.feed.filter(post => post !== payload.id),
        pendingPosts: state.pendingPosts.filter(post => post !== payload.id),
        upcomingPosts: state.upcomingPosts.filter(post => post !== payload.id),
      }
    } else {
      // error
      return {
        ...state,
        feed: payload.feedToRestore,
      }
    }
  },

  changePostText(state, { payload }) {
    return {
      ...state,
      posts: {
        ...state.posts,
        [payload.id]: {
          ...state.posts[payload.id],
          translations: payload.translations,
        },
      },
    }
  },

  appendFilesToPost(state, { payload, status, meta }) {
    const { postId } = meta

    if (status === 'pending') {
      return {
        ...state,
        uploadingFilesPosts: state.uploadingFilesPosts.concat(postId),
      }
    } else if (status === 'ok') {
      return {
        ...state,
        uploadingFilesPosts: state.uploadingFilesPosts.filter(
          post => post !== postId,
        ),
        posts: {
          ...state.posts,
          [postId]: payload,
        },
      }
    }

    return state
  },

  likePost(state, { payload, status }) {
    const postModifier =
      status === 'ok' ? addUserLikeToPost : removeUserLikeFromPost
    return {
      ...state,
      posts: {
        ...state.posts,
        [payload.id]: postModifier(state.posts[payload.id]),
      },
    }
  },

  unlikePost(state, { payload, status }) {
    const postModifier =
      status === 'ok' ? removeUserLikeFromPost : addUserLikeToPost
    return {
      ...state,
      posts: {
        ...state.posts,
        [payload.id]: postModifier(state.posts[payload.id]),
      },
    }
  },

  showPostDetail(state, { payload, status }) {
    if (status === 'ok') {
      const { post, comments } = payload
      const total = comments[0].total
      // Hotfix until the API actually returns the requested limit (simply concat then and make item const)
      let items = comments[0]._embedded.items || []
      if (comments.length > 1) {
        items = items.concat(comments[1]._embedded.items.slice(1))
      }
      items.reverse() // API v2 does not support sorting
      const updatedPosts = updatePosts(state.posts, [post])

      return {
        ...state,
        posts: {
          ...updatedPosts,
          [post.id]: {
            ...updatedPosts[post.id],
            // We want to keep the currentLanguage if set before!
            currentLanguage:
              state.posts[post.id] && state.posts[post.id].currentLanguage,
          },
        },
        comments: {
          [post.id]: {
            items,
            total,
            pending: false,
          },
        },
      }
    }

    return state
  },

  fetchMoreComments(state, { payload, status }) {
    if (status === 'ok') {
      const { comments, id } = payload
      const items = [].concat(state.comments[id].items)

      const existentIds = items.map(item => item.id)
      const intersectComments = (comments._embedded
        .items as readonly IComment[])
        .filter(({ id: currentId }) => existentIds.indexOf(currentId) === -1)
        .reverse() // API v2 does not support sorting

      // Add the fetched items above the last items
      items.splice(COMMENT_FOLD_TRAILING_COUNT, 0, ...intersectComments)
      return {
        ...state,
        comments: {
          [id]: {
            total: comments.total,
            items,
          },
        },
      }
    }

    return state
  },

  addComment(state, { payload, status }) {
    if (status === 'pending') {
      return {
        ...state,
        comments: {
          [payload.id]: {
            ...state.comments[payload.id],
            pending: true,
          },
        },
      }
    } else if (status === 'ok') {
      const items = [].concat(state.comments[payload.id].items)
      items.push(payload.comment)

      return {
        ...state,
        comments: {
          [payload.id]: {
            ...state.comments[payload.id],
            total: get(
              payload.comment,
              '_embedded.communityArticle._meta.comments.publishedCount',
              0,
            ),
            items,
            pending: false,
          },
        },
      }
    }

    return state
  },

  createPost(state, { status, payload }) {
    if (status === 'pending') {
      return {
        ...state,
        isSendingPost: true,
      }
    } else {
      return {
        ...state,
        isSendingPost: false,
        posts: updatePosts(state.posts, [payload]),
        pendingPosts: [payload.id, ...state.pendingPosts],
      }
    }
  },

  reportPost(state, { status, postId }) {
    return {
      ...state,
      reportPostStatuses: {
        ...state.reportPostStatuses,
        [postId]: status,
      },
    }
  },

  reportComment(state, { status, commentId }) {
    return {
      ...state,
      reportCommentStatuses: {
        ...state.reportCommentStatuses,
        [commentId]: status,
      },
    }
  },

  setPostCurrentLanguage(state, { payload }) {
    return {
      ...state,
      posts: {
        ...state.posts,
        [payload.id]: {
          ...state.posts[payload.id],
          currentLanguage: payload.currentLanguage,
        },
      },
    }
  },

  // OLD
  fetchPublicUserProfile(state, { payload, status }) {
    switch (status) {
      case 'loading':
        return merge({}, state, { currentPublicUser: { loading: true } })

      case 'ok':
        return Object.assign({}, state, {
          currentPublicUser: { loading: false, profile: payload },
        })

      case 'error':
        return merge({}, state, { currentPublicUser: { loading: true } })
      default:
        return state
    }
  },
})
