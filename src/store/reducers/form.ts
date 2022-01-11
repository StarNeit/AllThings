import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import validate from 'validate.js'
import { MessageDescriptor } from 'react-intl'

interface IValidationState {
  readonly error: MessageDescriptor | null
  readonly valid: boolean
  readonly timestamp: number
}

interface IFormState {
  readonly fileUpload: {
    readonly files: ReadonlyArray<any>
    readonly isLoading: boolean
  }
  readonly elements: IndexSignature<string>
  readonly validation: IndexSignature<IValidationState>
  readonly invalidElement: string
  readonly status: string
}

interface ISignupState {
  readonly signup?: {
    readonly email?: string
    readonly password?: string
    readonly username?: string
  }
}

type State = IndexSignature<IFormState> & ISignupState

const defaultInitialState: IFormState = {
  fileUpload: {
    files: [],
    isLoading: false,
  },
  elements: {},
  validation: {},
  invalidElement: null,
  status: 'normal',
}

const initialState: State = {}

function getInvalidElements(formState: IFormState) {
  const invalidElements = []

  for (const key in formState.validation) {
    if (formState[key] && formState[key].valid === false) {
      invalidElements.push(key)
    }
  }

  return invalidElements
}

function errorsToValidation(errors: IndexSignature) {
  const elements = {}

  // tslint:disable:forin
  for (const elementName in errors) {
    elements[elementName] = {
      error: errors[elementName][0],
      valid: false,
    }
  }
  // tslint:enable:forin

  return elements
}

function validateInput(
  formData: IndexSignature,
  validateConstraints: IndexSignature,
  elementName: string,
) {
  let error

  if (validateConstraints) {
    error = validate(formData, validateConstraints)

    if (error && error[elementName] && error[elementName][0]) {
      error = error[elementName][0]
    } else {
      error = null
    }
  }

  return error
}

export default createReducers(initialState, {
  openForm(state, { payload }) {
    return {
      ...state,
      [payload.formName]: {
        ...defaultInitialState,
        elements: payload.initialValues || {},
      },
    } as State
  },

  blurElement(state, { meta }) {
    const { parentFormName, elementName } = meta
    const oldFormState = state[parentFormName]
    const skipValidation = !oldFormState.elements[elementName]
    const elementError = validateInput(
      oldFormState.elements,
      meta.validateConstraints,
      elementName,
    )
    const wasFormValid = getInvalidElements(oldFormState).length === 0
    const isElementValid = !elementError
    const isFormValid = wasFormValid && isElementValid

    let newFormState = {}

    // Skip validation if user leaves element without changing
    if (skipValidation) {
      newFormState = state
    } else {
      newFormState = {
        ...state,
        [parentFormName]: {
          ...defaultInitialState,
          ...oldFormState,
          invalidElement: isFormValid
            ? null
            : !isElementValid
            ? elementName
            : oldFormState.invalidElement,
          validation: {
            ...oldFormState.validation,
            [elementName]: {
              error: elementError,
              valid: isElementValid,
              timestamp: Date.now(),
            },
          },
        },
      }
    }

    return newFormState
  },

  setElementValue(state, { payload, meta }) {
    const { parentFormName, elementName, validateConstraints } = meta
    const oldFormState = state[parentFormName]
    const oldElementValidation =
      state[parentFormName].validation[elementName] || ({} as IValidationState)
    const newFormElements = {
      ...oldFormState.elements,
      [elementName]: payload.value,
    }
    const elementError = validateInput(
      newFormElements,
      validateConstraints,
      elementName,
    )
    const isElementValid = !elementError
    const oldInvalidElement = oldFormState.invalidElement

    const newState = {
      ...state,
      [parentFormName]: {
        ...defaultInitialState,
        ...oldFormState,
        elements: newFormElements,
        validation: {
          ...oldFormState.validation,
          [elementName]: {
            error:
              oldElementValidation.valid === false
                ? elementError
                : oldElementValidation.error,
            valid:
              oldElementValidation.valid === false
                ? isElementValid
                : oldElementValidation.valid,
          },
        },
      },
    }

    const invalidElements = getInvalidElements(newState[parentFormName])
    const elementChangedToValid =
      oldInvalidElement === elementName && isElementValid
    newState[parentFormName].invalidElement = elementChangedToValid
      ? invalidElements[0] || null
      : oldInvalidElement

    return newState as State
  },

  submitForm(state, { status, payload = {}, meta }) {
    if (status === 'invalid') {
      const errors = meta.errors
      const invalidElement = Object.keys(errors)[0]
      const validation = errorsToValidation(errors)
      return {
        ...state,
        [meta.formName]: {
          ...state[meta.formName],
          status,
          invalidElement,
          validation,
        },
      } as State
    } else {
      return merge(
        state,
        {},
        {
          [meta.formName]: {
            ...state[meta.formName],
            status,
            payload,
          },
        },
      )
    }
  },

  uploadFiles(state, { meta, payload, status }) {
    switch (status) {
      case 'loading':
        return merge({}, state, {
          [meta.formName]: {
            fileUpload: {
              files: state[meta.formName].fileUpload.files,
              isLoading: true,
            },
            error: null,
          },
        })

      case 'ok':
        return merge({}, state, {
          [meta.formName]: {
            fileUpload: {
              files: state[meta.formName].fileUpload.files.concat(payload),
              isLoading: false,
            },
            error: null,
          },
        })

      case 'error':
        return merge({}, state, {
          [meta.formName]: {
            fileUpload: {
              files: state[meta.formName].fileUpload.files,
              isLoading: false,
            },
            error: payload[0],
          },
        })
      default:
        return state
    }
  },

  appendFiles(state, { meta, payload }) {
    return merge({}, state, {
      [meta.formName]: {
        fileUpload: {
          files: state[meta.formName].fileUpload.files.concat(payload.files),
        },
      },
    })
  },

  deleteFile(state, { meta, payload }) {
    const files = [].concat(state[meta.formName].fileUpload.files)

    files.splice(payload.index, 1)

    return Object.assign({}, state, {
      [meta.formName]: {
        ...state[meta.formName],
        fileUpload: {
          files,
          isLoading: state[meta.formName].fileUpload.isLoading,
        },
      },
    })
  },

  reOrderFiles(state, { meta: { formName }, payload: { files } }) {
    return merge({}, state, {
      [formName]: {
        fileUpload: {
          files,
        },
      },
    })
  },

  setSignupCredentials(state, { meta: { email, password, username } }) {
    return {
      ...state,
      signup: {
        email:
          typeof email === 'undefined' && email !== ''
            ? state.signup && state.signup.email
            : email,
        password:
          typeof password === 'undefined' && password !== ''
            ? state.signup && state.signup.password
            : password,
        username:
          typeof username === 'undefined' && username !== ''
            ? state.signup && state.signup.username
            : username,
      },
    } as State
  },
})
