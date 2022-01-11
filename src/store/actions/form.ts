import createActions from 'store/createActions'
import { IApiResponse, IApiRequest } from 'store/api'
import appActions from './app'
import validate from 'validate.js'
import { FileWithPreview } from 'utils/filePreviews'

export default createActions({
  openForm(formName, initialValues = {}) {
    return {
      payload: {
        formName,
        initialValues,
      },
    }
  },

  blurElement(parentFormName, elementName, validateConstraints) {
    return {
      payload: {},
      meta: { elementName, parentFormName, validateConstraints },
    }
  },

  touchElement(elementName, parentFormName, validateConstraints) {
    return {
      payload: {},
      meta: { elementName, parentFormName, validateConstraints },
    }
  },

  setElementValue(parentFormName, elementName, value, validateConstraints) {
    return {
      payload: { value },
      meta: {
        validateConstraints,
        elementName,
        parentFormName,
        value,
      },
    }
  },

  submitForm(
    formName: string,
    buildRequests: (...args: unknown[]) => IApiRequest[] | IApiRequest,
    onSuccess: (result: unknown) => void,
    onError: (result: unknown) => void,
    validateConstraints,
  ) {
    return async (dispatch, api, state) => {
      const formState = state.form[formName]
      const errors = validate(formState.elements, validateConstraints)

      if (errors) {
        dispatch({ status: 'invalid', meta: { formName, errors } })
      } else {
        let requests = buildRequests(formState.elements, formState.fileUpload)
        dispatch({ status: 'pending', meta: { formName } })
        dispatch(appActions.attachFetcher(formName))
        // Handle single and multiple requests in parallel
        requests = [].concat(requests)
        const promises = requests.map(api)
        let results = await Promise.all<IApiResponse>(promises)

        // Form is successful if all codes are < 300
        const success = results.reduce(
          (prev, curr) => prev && curr.status.code < 300,
          true,
        )

        if (success) {
          // If only one element was supplied then don't return an array
          results = results.map(result => result.entity)
          if (results.length === 1) {
            results = results[0] as any
          }
          dispatch({ status: 'ok', payload: results, meta: { formName } })
          onSuccess(results)
        } else {
          // If only one element was supplied then don't return an array
          if (results.length === 1) {
            results = results[0] as any
          }
          dispatch({ status: 'error', meta: { formName }, payload: results })
          onError(results)
        }
        dispatch(appActions.detachFetcher(formName))
      }
    }
  },

  uploadFiles(formName: string, file: FileWithPreview) {
    return async (dispatch, api) => {
      dispatch({ status: 'loading', meta: { formName } })
      const entity = new (window as any).FormData()
      entity.append('file', file)
      const response = await api({
        timeout: false,
        method: 'POST',
        path: 'api/v1/files',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        entity,
      })

      if (response.status.code === 201) {
        const { entity: currentEntity } = response
        const payload: any = {
          id: currentEntity.id,
          name: currentEntity.originalFilename,
        }

        if (currentEntity.type.substr(0, 5) === 'image') {
          const { preview } = file

          payload.type = 'image'
          payload.preview = preview
        } else {
          payload.type = 'file'
        }

        dispatch({
          status: 'ok',
          payload,
          meta: { formName },
        })
      } else {
        const {
          entity: {
            errors: { file: payload },
          },
        } = response

        dispatch({
          status: 'error',
          payload,
          meta: { formName },
        })
      }
    }
  },

  appendFiles(
    formName: string,
    files: ReadonlyArray<{
      files: { thumb: { url: string } }
      id: string
      originalFilename: string
      type: string
    }>,
  ) {
    return {
      payload: {
        files: files.map(file => {
          const type = file.type.substr(0, 5) === 'image' ? 'image' : 'file'
          const entity = {
            id: file.id,
            name: file.originalFilename,
            type,
          }

          if (type === 'image') {
            ;(entity as any).preview = file.files.thumb.url
          }

          return entity
        }),
      },
      meta: { formName },
    }
  },

  deleteFile(formName, id, index) {
    return async (dispatch, api) => {
      await api({
        method: 'DELETE',
        path: `api/v1/files/${id}`,
      })
      // We don't care about errors, this will be garbage collected by the API.
      dispatch({ payload: { index }, meta: { formName } })
    }
  },

  reOrderFiles(formName, files) {
    return {
      payload: { files },
      meta: { formName },
    }
  },

  setSignupCredentials({ email, password, username }) {
    return {
      payload: {},
      meta: { email, password, username },
    }
  },
})
