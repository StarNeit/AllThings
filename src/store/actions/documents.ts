import createActions from 'store/createActions'

export default createActions({
  fetchDocuments() {
    return async (dispatch, api, state) => {
      dispatch({ status: 'loading' })
      const documents = await api({
        method: 'GET',
        path: `api/v1/users/files/bucket-files`,
        params: {
          limit: -1,
          locale: state.app.locale,
        },
      })

      if (documents.status.code === 200) {
        dispatch({ status: 'ok', payload: documents.entity._embedded.items })
      }
    }
  },

  markRead(fileId) {
    return async (dispatch, api) => {
      try {
        await api({
          method: 'POST',
          path: `api/v1/files/seen`,
          entity: {
            fileIds: [fileId],
          },
        })

        dispatch({ payload: fileId })
      } catch {
        throw Error('File seen status was not set to API.')
      }
    }
  },

  changeDir(dir) {
    return { payload: dir }
  },
})
