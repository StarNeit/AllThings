/* global FormData */
import createActions from 'store/createActions'
import {
  COMMENT_FOLD_LEADING_COUNT,
  COMMENT_FOLD_TRAILING_COUNT,
} from 'microapps/pinboard/global'
import get from 'lodash-es/get'
import { FileWithPreview } from 'utils/filePreviews'

function uploadFile(api: InjectedSDK, file: FileWithPreview) {
  const form = new FormData()
  form.append('file', file)
  return api({
    timeout: false,
    method: 'POST',
    path: 'api/v1/files',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    entity: form,
  })
}

export default createActions({
  openFeed() {
    return async (dispatch, api, state) => {
      const appId = state.app.config.appID
      const [posts, visibilityScopes] = await Promise.all([
        api({
          method: 'GET',
          path: `api/v2/community-articles?appFilter=${appId}`,
        }),
        api({
          method: 'GET',
          path: `api/v1/visibility-scopes?appFilter=${appId}`,
        }),
      ])

      dispatch({
        status: 'ok',
        payload: {
          posts: posts.entity,
          visibilityScopes: visibilityScopes.entity,
        },
      })
    }
  },

  muteUser(userId: string, mutedUserId: string, postId: string) {
    return async (dispatch, api) => {
      const mute = await api({
        method: 'POST',
        path: `api/v1/users/${userId}/muted-users`,
        entity: {
          mutedUserID: mutedUserId,
        },
      })
      dispatch({ status: 'ok', payload: { postId } })
      return mute
    }
  },

  unmuteUser(mutedUserId: string) {
    return async (_, api, state) => {
      const userId = state.authentication.user.id
      const mute = await api({
        method: 'DELETE',
        path: `api/v1/users/${userId}/muted-users/${mutedUserId}`,
      })
      return mute
    }
  },

  backgroundRefreshFeed() {
    return async (dispatch, api, state) => {
      const appId = state.app.config.appID
      const params: any = {}
      if (state.pinboard.feed.length > 0) {
        params.until = (state.pinboard.posts[
          state.pinboard.feed[0]
        ] as any).sortHash
      }

      const posts = await api({
        method: 'GET',
        path: `api/v2/community-articles?appFilter=${appId}`,
        params,
      })

      if (
        posts.status.code === 200 &&
        posts.entity._embedded.items.length > 0
      ) {
        dispatch({ status: 'ok', payload: posts.entity })
      }
    }
  },

  pressShowUpcomingButton() {
    return {}
  },

  requestMorePosts() {
    return async (dispatch, api, state) => {
      dispatch({ status: 'pending' })

      const appId = state.app.config.appID
      const posts = await api({
        method: 'GET',
        path: `api/v2/community-articles?appFilter=${appId}`,
        params: {
          since: (state.pinboard.posts[
            state.pinboard.feed.slice(-1).pop()
          ] as any).sortHash,
        },
      })

      dispatch({ status: 'ok', payload: posts.entity })
    }
  },

  likePost(id: string) {
    return async (dispatch, api) => {
      dispatch({ status: 'ok', payload: { id } })
      const like = await api({
        method: 'POST',
        path: `api/v1/community-articles/${id}/likes`,
      })
      if (like.status.code !== 204 && like.status.code !== 409) {
        dispatch({ status: 'error', payload: { id } })
      }
    }
  },

  unlikePost(id: string) {
    return async (dispatch, api) => {
      dispatch({ status: 'ok', payload: { id } })
      const unlike = await api({
        method: 'DELETE',
        path: `api/v1/community-articles/${id}/likes`,
      })
      if (unlike.status.code !== 204 && unlike.status.code !== 409) {
        dispatch({ status: 'error', payload: { id } })
      }
    }
  },

  deletePost(id: string) {
    return async (dispatch, api, state) => {
      const feedToRestore = [...state.pinboard.feed]
      dispatch({ status: 'ok', payload: { id } })
      const remove = await api({
        method: 'DELETE',
        path: `api/v1/community-articles/${id}`,
      })
      const removeStatus = get(remove, 'status.code')
      if (removeStatus < 200 || removeStatus > 299) {
        dispatch({ status: 'error', payload: { feedToRestore } })
      }
    }
  },

  appendFilesToPost(postId: string, attachedFiles: readonly FileWithPreview[]) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending', meta: { postId } })
      const uploads = await Promise.all(
        attachedFiles.map(file => uploadFile(api, file)),
      )
      const files = uploads
        .map((upload: any) => upload.entity.id)
        .filter(Boolean) // Filter out failed uploads
      const update = await api({
        entity: { files },
        method: 'PATCH',
        path: `api/v1/community-articles/${postId}`,
      })
      if (update.status.code === 200) {
        dispatch({ status: 'ok', payload: update.entity, meta: { postId } })
      }
    }
  },

  createPost(
    content: string,
    attachedFiles: readonly FileWithPreview[],
    channels: readonly string[],
    category = 'miscellaneous',
  ) {
    return async (dispatch, api, state) => {
      dispatch({ status: 'pending' })
      const {
        user: {
          id,
          locale,
          property: { id: propertyId },
        },
      } = state.authentication
      channels = channels || [`Property-${propertyId}`]

      const post = await api({
        entity: {
          category,
          channels,
          defaultLocale: locale,
          title: 'noTitle',
          translations: [
            {
              content,
              locale,
            },
          ],
        },
        method: 'POST',
        path: `api/v1/users/${id}/community-articles`,
      })

      if (post.status.code === 201) {
        dispatch({ status: 'ok', payload: post.entity })
        if (attachedFiles.length) {
          dispatch(this.appendFilesToPost(post.entity.id, attachedFiles))
        }
      }
    }
  },

  reportPost(postId, reason) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending', postId })
      const abuseReport = await api({
        entity: { reason },
        method: 'POST',
        path: `api/v1/community-articles/${postId}/abuse-reports`,
      })
      if (abuseReport.status.code === 201) {
        dispatch({ status: 'ok', postId })
      } else if (abuseReport.status.code === 409) {
        dispatch({ status: 'alreadyReported', postId })
      } else {
        dispatch({ status: 'failed', postId })
      }
    }
  },

  reportComment(commentId: string, reason) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending', commentId })
      const abuseReport = await api({
        entity: { reason },
        method: 'POST',
        path: `api/v1/comments/${commentId}/abuse-reports`,
      })
      if (abuseReport.status.code === 201) {
        dispatch({ status: 'ok', commentId })
      } else if (abuseReport.status.code === 409) {
        dispatch({ status: 'alreadyReported', commentId })
      } else {
        dispatch({ status: 'failed', commentId })
      }
    }
  },

  createWelcomePost(welcomeText) {
    return this.createPost(welcomeText, [], null, 'welcome-message')
  },

  addComment(id, content) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending', payload: { id } })

      const comment = await api({
        entity: { content },
        method: 'POST',
        path: `api/v1/community-articles/${id}/comments`,
      })

      if (comment.status.code === 201) {
        dispatch({ status: 'ok', payload: { id, comment: comment.entity } })
      } else {
        dispatch({ status: 'error', error: comment.error })
      }
    }
  },

  changePostText(id: string, content) {
    return async (dispatch, api, state) => {
      const {
        user: { locale },
      } = state.authentication
      const translations = [
        {
          locale,
          content,
        },
      ]
      dispatch({ status: 'ok', payload: { id, translations } })
      const update = await api({
        entity: { translations },
        method: 'PATCH',
        path: `api/v1/community-articles/${id}`,
      })

      if (update.status.code !== 200) {
        const { content: currentContent } = state.pinboard.posts[id]
        dispatch({ status: 'error', payload: { id, content: currentContent } })
      }
    }
  },

  showPostDetail(id: string, commentFoldThreshold: number = 5) {
    return async (dispatch, api, state) => {
      const [post, likes] = await Promise.all([
        api({
          method: 'GET',
          path: `api/v1/community-articles/${id}`,
        }),
        api({
          method: 'GET',
          path: `api/v1/community-articles/${id}/likes`,
        }),
      ])

      const currentlyLoadedCommentsCount = get(
        state.pinboard,
        `comments[${id}].items.length`,
        0,
      )
      const loadCommentCount = Math.max(
        commentFoldThreshold,
        currentlyLoadedCommentsCount,
      )

      let comments
      if (post.entity.commentCount > loadCommentCount) {
        const leadingLimit =
          currentlyLoadedCommentsCount - COMMENT_FOLD_LEADING_COUNT > 0
            ? currentlyLoadedCommentsCount - COMMENT_FOLD_TRAILING_COUNT
            : COMMENT_FOLD_TRAILING_COUNT
        comments = await Promise.all([
          // Most recent comments
          api({
            method: 'GET',
            path: `api/v2/community-articles/${id}/comments`,
            params: {
              limit: leadingLimit,
            },
          }),
          // Oldest comments
          api({
            method: 'GET',
            path: `api/v2/community-articles/${id}/comments`,
            params: {
              // this is a sortHash of the very first comment possible
              until: `0000000`,
              limit: COMMENT_FOLD_TRAILING_COUNT,
            },
          }),
        ])
      } else {
        comments = await Promise.all([
          api({
            method: 'GET',
            path: `api/v2/community-articles/${id}/comments`,
            params: {
              limit: loadCommentCount,
            },
          }),
        ])
      }
      comments = comments.map(comment => comment.entity)

      if (post.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: { post: post.entity, likes: likes.entity, comments },
        })
      } else {
        dispatch({ status: 'error', error: post })
      }
    }
  },

  fetchMoreComments(postId: string) {
    return async (dispatch, api, state) => {
      const stateComments = state.pinboard.comments[postId]
      if (stateComments && stateComments.total > stateComments.items.length) {
        const comments = await api({
          method: 'GET',
          path: `api/v2/community-articles/${postId}/comments`,
          params: {
            since: stateComments.items[COMMENT_FOLD_LEADING_COUNT].sortHash,
            /*
             * `until` is not specified because it flips the API response...
             * This may cause already existing entries to be fetched, which in turn
             * have to be filtered before rendering to avoid duplicate keys warnings
             */
          },
        })

        if (comments.status.code === 200) {
          dispatch({
            status: 'ok',
            payload: { id: postId, comments: comments.entity },
          })
        } else {
          dispatch({ status: 'error', error: comments.error })
        }
      }
    }
  },

  setPostCurrentLanguage(id: string, currentLanguage: string) {
    return { payload: { id, currentLanguage } }
  },

  // OLD
  fetchPublicUserProfile(id: string) {
    return async (dispatch, api) => {
      dispatch({ status: 'loading' })
      const user = await api({
        method: 'GET',
        path: `api/v1/users/${id}`,
      })

      if (user.status.code === 200) {
        dispatch({ status: 'ok', payload: user.entity })
      } else {
        dispatch({ status: 'error', error: user.error })
      }
    }
  },
})
