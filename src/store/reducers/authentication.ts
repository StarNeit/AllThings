import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import findIndex from 'lodash-es/findIndex'
import get from 'lodash-es/get'

import { Locale } from 'enums'

interface IProperty {
  readonly id: string
  readonly moderated: boolean
  readonly name: string
}

export interface IAddress {
  readonly id: string
  readonly key: string
}
interface IInvitation {
  readonly permanent: boolean
}
interface IUtilisationPeriod {
  readonly id: string
  readonly startDate: string
}
type ExtendedUser = IUser & {
  readonly property: Partial<IProperty>
  readonly addresses: ReadonlyArray<IAddress>
  readonly activePeriod: Partial<IUtilisationPeriod>
  readonly publicProfile: boolean
  readonly description: string | null
  readonly email: string
  readonly id: string
  readonly invitations: readonly IInvitation[]
  readonly locale: Locale
  readonly notificationSettings: IndexSignature<string>
  readonly organization: {
    readonly id: string
  }
  readonly passwordChanged: boolean
  readonly phoneNumber: string
  readonly profileImage: {
    readonly id: string
    readonly _embedded: {
      readonly files: {
        readonly big: {
          readonly url: string
        }
        readonly medium: {
          readonly url: string
        }
        readonly small: {
          readonly url: string
        }
      }
    }
  }
  readonly type: string
  // these are custom user properties (i.e. attributes)!
  readonly properties: {
    readonly createdPost: boolean
    readonly onboardingFinished: boolean
  }
  readonly unit: Partial<{
    readonly id: string
    readonly _embedded: {
      readonly address: {
        readonly city: string
        readonly country: string
        readonly houseNumber: string
        readonly postalCode: string
        readonly street: string
      }
      readonly group: {
        readonly id: string
      }
    }
  }>
  readonly updateSuccess: boolean
  readonly username: string
  readonly createdAt: string
  readonly company: string
}

interface IState {
  readonly accessToken: string | null
  readonly accessTokenExpires: number
  readonly accessTokenFetching: boolean
  readonly errors: IndexSignature<string[]>
  readonly loggedIn: boolean
  readonly sessionReady: boolean
  readonly isCheckedIn: boolean
  readonly oauthError: boolean
  readonly user: Partial<ExtendedUser>
  readonly redirectToAfterLogin: string
  readonly fieldStatuses: IndexSignature<string>
  readonly deprecatedUser?: IUser
  readonly refreshToken: string | null
  readonly isLoggingIn: boolean
}

const initialState: IState = {
  accessToken: null,
  accessTokenExpires: Date.now(),
  accessTokenFetching: false,
  errors: null,
  loggedIn: false,
  refreshToken: null,
  sessionReady: false,
  isCheckedIn: false,
  oauthError: false,
  user: {},
  redirectToAfterLogin: '/pinboard',
  fieldStatuses: {},
  isLoggingIn: false,
}

function isCheckedIn(user: ExtendedUser) {
  return user._embedded.utilisationPeriods.length > 0
}

function extractUser(
  user: Partial<ExtendedUser>,
  appID: string = null,
): Partial<ExtendedUser> {
  const {
    _embedded: {
      utilisationPeriods,
      organization,
      profileImage,
      notificationSettings,
      company,
    },
    description,
    email,
    id,
    locale,
    passwordChanged,
    phoneNumber,
    username,
    publicProfile,
    properties,
    type,
    createdAt,
  } = user
  let activePeriod = {}
  let invitations = []
  const addresses: IAddress[] = []
  let property = {}
  let unit = {}
  /*
   * When this function is called after login, we just need to pick the first
   * and only utilisationPeriod available. Otherwise, we need to filter the
   * utilisationPeriods by the appID.
   */
  const index = appID
    ? findIndex(
        utilisationPeriods,
        (utilisationPeriod: any) =>
          utilisationPeriod._embedded.app.id === appID,
      )
    : 0
  const firstPeriod = utilisationPeriods[index]

  if (firstPeriod) {
    const { id: firstPeriodId, startDate } = firstPeriod

    activePeriod = { id: firstPeriodId, startDate }
    invitations = firstPeriod._embedded.invitations.reverse().filter(
      // Remove the permanent ones.
      (invitation: IInvitation) => !invitation.permanent,
    )
    property = {
      id: firstPeriod._embedded.property.id,
      moderated: firstPeriod._embedded.property._embedded.app.moderated,
      name: firstPeriod._embedded.property.name,
    }
    unit = firstPeriod._embedded.unit
  }

  utilisationPeriods.forEach((utilisationPeriod: IUtilisationPeriod) => {
    const { name = '' } = get(utilisationPeriod, '_embedded.unit')
    const { city = '', street = '', houseNumber = '' } = get(
      utilisationPeriod,
      '_embedded.unit._embedded.address',
    )
    addresses.push({
      id: utilisationPeriod.id,
      key: `${street} ${houseNumber}, ${city} (${name})`.trim(),
    })
  })

  return {
    addresses,
    activePeriod,
    publicProfile,
    description,
    email,
    id,
    invitations,
    locale,
    notificationSettings,
    organization,
    passwordChanged,
    phoneNumber,
    profileImage,
    property,
    type,
    // these are custom user properties (i.e. attributes)!
    properties,
    unit,
    updateSuccess: true,
    username,
    createdAt,
    company,
  }
}

export default createReducers(initialState, {
  login(state, { status, payload }) {
    if (status === 'ok') {
      return {
        ...state,
        oauthError: false,
        accessToken: payload.accessToken,
        accessTokenExpires: Date.now() + payload.accessTokenExpires * 1000,
        accessTokenFetching: false,
        sessionReady: true,
        loggedIn: true,
        ...(payload.refreshToken ? { refreshToken: payload.refreshToken } : {}),
        user: extractUser(payload.user),
        deprecatedUser: payload.user,
        isCheckedIn: isCheckedIn(payload.user),
        isLoggingIn: false,
      }
    } else {
      return {
        ...state,
        sessionReady: true,
      }
    }
  },

  redirectAfterLogin(state, { payload: { redirectTo } }) {
    return {
      ...state,
      redirectToAfterLogin: redirectTo,
    }
  },

  checkIn(state, { payload }) {
    const deprecatedUser = merge({}, state.deprecatedUser, {
      _embedded: {
        utilisationPeriods: [payload.utilisationPeriod],
      },
    })

    return {
      ...state,
      activePeriod: payload,
      isCheckedIn: true,
      deprecatedUser,
      user: extractUser(deprecatedUser),
    }
  },

  changeDetails(state, { status, payload, appID, affectedFields }) {
    const newFieldStatuses = { ...state.fieldStatuses }
    const setStatus = (s: string) =>
      affectedFields.forEach((f: string) => (newFieldStatuses[f] = s))

    switch (status) {
      case 'ok':
        setStatus('ok')
        return {
          ...state,
          user: extractUser(payload.user, appID),
          deprecatedUser: payload.user,
          fieldStatuses: newFieldStatuses,
          status,
        }

      case 'error':
        setStatus('error')
        return {
          ...state,
          fieldStatuses: newFieldStatuses,
          status,
          errors: payload,
        }

      case 'pending':
        setStatus('pending')
        return {
          ...state,
          fieldStatuses: newFieldStatuses,
          status,
        }

      default:
        return state
    }
  },

  updateAvatar(state, { status, payload }) {
    if (status === 'pending') {
      return {
        ...state,
        fieldStatuses: {
          ...state.fieldStatuses,
          profileImageUpload: 'pending',
        },
      }
    } else if (status === 'ok') {
      return {
        ...state,
        user: Object.assign({}, state.user, { profileImage: payload }),
        fieldStatuses: {
          ...state.fieldStatuses,
          profileImageUpload: 'ok',
        },
      }
    } else {
      return {
        ...state,
        fieldStatuses: {
          ...state.fieldStatuses,
          profileImageUpload: 'error',
        },
      }
    }
  },

  changeNotificationSettings(state, { status, payload }) {
    switch (status) {
      case 'ok':
        const user = merge({}, state.user, {
          notificationSettings: payload.notificationSettings,
        })
        return {
          ...state,
          user,
          fieldStatuses: { ...state.fieldStatuses, notificationSettings: 'ok' },
        }
      case 'pending':
        return {
          ...state,
          fieldStatuses: {
            ...state.fieldStatuses,
            notificationSettings: 'pending',
          },
        }
      case 'error':
        return {
          ...state,
          fieldStatuses: {
            ...state.fieldStatuses,
            notificationSettings: 'error',
          },
        }
      default:
        return state
    }
  },

  loggingIn(state) {
    return {
      ...state,
      isLoggingIn: true,
    }
  },

  sessionReady(state) {
    return {
      ...state,
      sessionReady: true,
    }
  },

  updateToken(state, { payload }) {
    return {
      ...state,
      accessToken: payload.accessToken,
    }
  },

  refreshToken(state, { status, payload }) {
    switch (status) {
      case 'pending':
        return {
          ...state,
          accessTokenFetching: true,
        }
      case 'ok':
        return {
          ...state,
          accessToken: payload.accessToken,
          accessTokenExpires: Date.now() + payload.accessTokenExpires * 1000,
          accessTokenFetching: false,
          ...(payload.refreshToken
            ? { refreshToken: payload.refreshToken }
            : {}),
        }
      case 'error':
        return {
          ...state,
          accessTokenFetching: false,
        }
      default:
        return state
    }
  },

  loginWithAuthenticationCode(state, { status }) {
    if (status === 'error') {
      return {
        ...state,
        oauthError: true,
        isLoggingIn: false,
      }
    }

    return state
  },

  logout(state, { status }) {
    if (status === 'ok') {
      return {
        ...initialState,
        sessionReady: true,
      }
    } else {
      return state
    }
  },

  invite(state, { status, payload }) {
    if (status === 'ok') {
      return {
        ...state,
        user: extractUser(payload.user),
      }
    } else {
      return state
    }
  },

  changePassword(state) {
    return {
      ...state,
      user: Object.assign({}, state.user, { passwordChanged: true }),
    }
  },
})
