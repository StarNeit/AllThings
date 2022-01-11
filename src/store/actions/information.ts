import createActions from 'store/createActions'
import AppActions from './app'

export default createActions({
  fetchTopics() {
    return async (dispatch, api, state) => {
      const periodId = state.authentication.user.activePeriod.id

      dispatch(AppActions.attachFetcher('fetchTopics'))
      dispatch({ status: 'loading' })
      const topics = await api({
        method: 'GET',
        path: `api/v1/utilisation-periods/${periodId}/articles/topics`,
        params: {
          limit: -1,
        },
      })
      dispatch(AppActions.detachFetcher('fetchTopics'))

      if (topics.status.code === 200) {
        dispatch({ status: 'ok', payload: topics.entity })
      }
    }
  },

  fetchArticles(topic) {
    return async (dispatch, api, state) => {
      const periodId = state.authentication.user.activePeriod.id

      dispatch(AppActions.attachFetcher('fetchArticles'))
      dispatch({ status: 'loading' })
      const articles = await api({
        method: 'GET',
        path: `api/v1/utilisation-periods/${periodId}/articles?filter[category]=eq:${topic}`,
        params: {
          limit: -1,
          locale: state.app.locale,
        },
      })
      dispatch(AppActions.detachFetcher('fetchArticles'))

      if (articles.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: articles.entity._embedded.items,
          locale: state.app.locale,
        })
      } else {
        dispatch({ status: 'error', error: articles.error })
      }
    }
  },

  fetchArticle(id: string) {
    return async (dispatch, api, state) => {
      dispatch(AppActions.attachFetcher('fetchArticle'))
      dispatch({ status: 'loading' })
      const article = await api({
        method: 'GET',
        path: `api/v1/articles/${id}`,
        params: {
          locale: state.app.locale,
        },
      })
      dispatch(AppActions.detachFetcher('fetchArticle'))

      if (article.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: article.entity,
          locale: state.app.locale,
        })
      } else {
        dispatch({ status: 'error', error: article.error })
      }
    }
  },
})
