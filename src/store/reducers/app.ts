import createReducers from 'store/createReducers'
import omit from 'lodash-es/omit'
import mergeWith from 'lodash-es/mergeWith'

import { Locale } from '../../enums'

interface IState {
  readonly config: Partial<{
    readonly appID: string
    readonly appName: string
    readonly appSubtitle: string | null
    readonly assetStructure: string
    readonly availableLocales: readonly Locale[]
    readonly country: string
    readonly clientID: string
    readonly iconURLs: IndexSignature<string> | null
    readonly logoURLs: IndexSignature<string> | null
    readonly backgroundImageURLs: IndexSignature<string> | null
    readonly theme: string | null
    readonly customSettings: {
      // TODO: enum?
      readonly uxSet: string
      // TODO: enum?
      readonly uxFileExtension: string
      readonly disableSocialMediaLogin?: boolean
      readonly uxSetFileExtension?: string
    }
    readonly welcomeMessagesDisabled?: boolean
    readonly appSubTitle?: string
    readonly slogan: Record<Locale, string>
    readonly appTitle: string
    readonly splashScreenImage: string
    readonly type: string
    readonly segment: 'residential' | 'commercial'
    readonly allowTenantInvites: boolean
    readonly loginMessage: Record<Locale, string>
    readonly signupMessage: Record<Locale, string>
  }>
  readonly microApps: readonly MicroAppProps[]
  readonly exceptions: string[]
  readonly userLoggedInBefore: boolean | null
  readonly fetchers: IndexSignature<boolean>
  readonly isFetching: boolean
  readonly locale: Locale
  readonly userAgent: string
  readonly connected: boolean
  readonly hostname: string | null
  readonly environment: string | null
  // FIXME: unused?
  readonly activeOverlay: string | null
  // FIXME: unused?
  readonly activeOverlayData: any
  readonly microAppsReady: boolean
  readonly embeddedLayout?: boolean
  readonly status?: string
  readonly configError?: number
}

const initialState: IState = {
  config: {},
  exceptions: [],
  userLoggedInBefore: null,
  fetchers: {},
  isFetching: false,
  locale: Locale.en_US,
  userAgent: '',
  connected: true,
  hostname: null,
  environment: null,
  activeOverlay: null, // overlay-type (string)
  activeOverlayData: null,
  microApps: [],
  microAppsReady: false,
}

export default createReducers(initialState, {
  initApp(state, { status, payload = {} }) {
    const { exception, config = {}, ...newPayload } = payload as any
    const exceptions = state.exceptions
    if (exception) {
      exceptions.push(exception.message)
    }
    // MicroApps are loaded now via api and therefore planned to be removed from the config.
    // To avoid having microApps twice in the state, the microApps are removed from the config.
    delete config.microApps

    return {
      ...state,
      error: null,
      status,
      ...newPayload,
      config: {
        ...config,
        // Hero Images rely on those 2 customSettings so we have to implement a
        // fallback right here and overwrite that fallback with existing cusomSettings from the API response
        customSettings: mergeWith(
          { uxSet: 'photo-resi', uxSetFileExtension: 'png' },
          config.customSettings,
          (a, b) => (b === null ? a : undefined),
        ),
      },
      exceptions,
    }
  },

  initMicroApps(state, { payload }) {
    const items = payload ? payload._embedded.items : []

    return {
      ...state,
      microApps: items,
      microAppsReady: true,
    }
  },

  setConnected(state, { payload }) {
    return {
      ...state,
      connected: payload.connected,
    }
  },

  chooseLanguage(state, { payload }) {
    return {
      ...state,
      locale: payload.locale,
    }
  },

  closeOverlay(state, { payload: { type } }) {
    if (type === state.activeOverlay) {
      return {
        ...state,
        activeOverlay: null,
      }
    }
    return {
      ...state,
    }
  },

  error(state, { payload: { exception } }) {
    return {
      ...state,
      exceptions: state.exceptions.concat(exception.stack || exception),
    }
  },

  attachFetcher(state, { payload }) {
    const fetchers = {
      ...state.fetchers,
      [payload.id]: true,
    }

    return {
      ...state,
      fetchers,
      isFetching: true,
    }
  },

  userLoggedInBefore(state, { payload: { userLoggedInBefore } }) {
    return {
      ...state,
      userLoggedInBefore,
    }
  },

  detachFetcher(state, { payload }) {
    const fetchers = omit(state.fetchers, payload.id)

    return {
      ...state,
      fetchers,
      isFetching: Object.keys(fetchers).length > 0,
    }
  },
})
