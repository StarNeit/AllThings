// Extend the NodeJS global object.
declare namespace NodeJS {
  export interface Global {
    [key: string]: any
    document: any
    mockStore: any
    mount: any
    mountIntl: any
    render: any
    renderer: any
    shallow: any
    shallowIntl: any
  }
}

// Google Analytics
declare const ga: any

// Mixpanel
declare const mixpanel: any

// Shared types & interfaces.
type NoOpType = () => void

type OnClick = (event, ...args: any[]) => any

interface IndexSignature<V = any, K = any> {
  readonly [key: string]: V
}

// Microapp
interface MicroAppType {
  id: string
  defaultIcon: string
  name: string
  type: MicroApps
}

interface IMessage {
  [key: string]: any
}

interface IUser {
  id: string
  locale: import('./enums').Locale
  profileImage: {
    files: IFile['files']
  }
  deleted: boolean
  username: string
  createdAt: string
  type: string
  _embedded: any
  phoneNumber?: string
}

interface IAPIUser {
  _embedded: {
    company: {
      id: string
      name: string
    }
    externalAgentCompany: {
      id: string
      name: string
    }
    externalAgentCompany: {
      id: string
      name: string
    }
    organization: {
      id: string
      name: string
    }
  }
  _meta: {
    company: string
    hasPermissions: boolean
    permissionCount: number
  }
  createdAt: string
  deleted: boolean
  id: string
  locale: import('./enums').Locale
  phoneNumber?: string
  type: string
  username: string
}
interface Thing {
  id?: string
}

interface MicroAppProps {
  _embedded?: {
    type: MicroAppType
  }
  color: string
  customLogo?: string
  icon: string
  id?: string
  introText?: IndexSignature<string>
  label?: IMessage
  navigationHidden?: boolean
  order?: number
  state?: string
  type: MicroApps
  url?: string
  theme?: ITheme
}

// API Response Types

interface ImageFile {
  url: string
  size: number
  width: number
  height: number
}

interface ImageInterface {
  id?: string
  name: string
  type: string
  files: {
    original: ImageFile
    big: ImageFile
    small: ImageFile
    '32x32'?: ImageFile
    thumb: ImageFile
    medium: ImageFile
    '192x192'?: ImageFile
  }
}

// API Response interface
interface ApiResponse {
  entity: any
  status?: {
    code: number
  }
}

enum UnitFloors {
  'attic-1',
  'attic-2',
  'attic-3',
  'basement-0',
  'basement-1',
  'basement-2',
  'basement-3',
  'basement-4',
  'basement-5',
  'basement-6',
  'basement-7',
  'basement',
  'diverse',
  'floor-0',
  'floor-1',
  'floor-10',
  'floor-11',
  'floor-12',
  'floor-13',
  'floor-14',
  'floor-15',
  'floor-16',
  'floor-17',
  'floor-18',
  'floor-19',
  'floor-2',
  'floor-20',
  'floor-21',
  'floor-22',
  'floor-23',
  'floor-24',
  'floor-3',
  'floor-4',
  'floor-5',
  'floor-6',
  'floor-7',
  'floor-8',
  'floor-9',
  'free-zone',
  'inside',
  'mezzanine',
  'outside',
  'property',
  'raised-ground-floor',
  'roof',
}

// Units.
enum UnitObjectType {
  'adjoining-room',
  'advertising-space',
  'aerial',
  'apartment-building',
  'apartment',
  'atm-room',
  'atm',
  'attic-flat',
  'attic',
  'bank',
  'bike-shed',
  'building-law',
  'cafeteria',
  'caretaker-room',
  'carport',
  'cellar',
  'commercial-property',
  'common-room',
  'delivery-zone',
  'diverse',
  'double-parking-space',
  'easment',
  'engineering-room',
  'entertainment',
  'environment',
  'estate',
  'filling-station',
  'fitness-center',
  'flat',
  'free-zone',
  'garage',
  'garden-flat',
  'garden',
  'heating-facilities',
  'hotel',
  'incidental-rental-expenses',
  'industry',
  'kiosk',
  'kitchen',
  'loft',
  'machine',
  'maisonette',
  'medical-practice',
  'moped-shed',
  'motorcycle-parking-space',
  'office',
  'one-family-house',
  'parking-box',
  'parking-garage',
  'parking-space',
  'parking-spaces',
  'penthouse',
  'production-plant',
  'pub',
  'public-area',
  'restaurant',
  'retirement-home',
  'sales-floor',
  'school',
  'shelter',
  'storage',
  'store',
  'storeroom',
  'studio',
  'terrace',
  'toilets',
  'utility-room',
  'variable-parking-space',
  'variable-room',
  'visitor-parking-space',
  'workshop',
}

interface Unit {
  _embedded: {
    address: {
      city?: string
      country?: string
      houseNumber?: string
      postalCode?: string
      street?: string
    }
  }
  floors: ReadonlyArray<UnitFloors>
  name?: string
  objectType: UnitObjectType
  roomCount?: number
  size: number
  externalLinks: {
    archilogic: string
  }
}

interface UtilisationPeriod {
  readonly id?: number
  readonly grossRent: number
}

interface FlipMoveAnimations {
  [name: string]: FlipMove.AnimationProp
}

type NonEmptyImageArray = [Image, ...Image[]]

interface IFileFormat {
  height: number
  size: number
  url: string
  width: number
}

interface IFile {
  category: string
  extension: string
  files: {
    big: IFileFormat
    medium: IFileFormat
    original: IFileFormat
    small: IFileFormat
    thumb: IFileFormat
  }
  id: string
  name: string
  originalFilename: string
  path: string
  seenByMe: boolean
  size: number
  type: string
  preview?: string
}

interface ITicket {
  category: string
  createdAt: string
  description: string
  files: readonly string[]
  id: string
  inputChannel: 'app' | 'craftsmen'
  phoneNumber: string
  status: import('./enums').TicketStatus
  title: string
  updatedAt: string
  _embedded: {
    assignedTo: {
      username: string
    }
    category: {
      description: IMessage
      key: string
      id: string
      name: IMessage
    }
    conversations: ReadonlyArray<{
      id: string
    }>
    createdBy: {
      id: string
      properties: {
        createdPost: boolean
        onboardingFinished: boolean
      }
      username: string
    }
    files: ReadonlyArray<IFile>
  }
}

interface IConversationMessage {
  _embedded: {
    createdBy: {
      deleted: boolean
      id: string
      profileImage: string
      username: string
    }
  }
  content: {
    _embedded: {
      files: ReadonlyArray<IFile>
    }
    content?: string
    description?: string
    files: ReadonlyArray<ImageInterface>
  }
  createdAt: string
  id: string
  internal: boolean
  read: boolean
  type: import('./enums').IConversationMessageType
}

declare module '@allthings/react-ionicons/lib/IosArrowForwardIcon'
declare module '@allthings/react-ionicons/lib/PlusCircledIcon'
declare module '@allthings/react-ionicons/lib/ArrowRightCIcon'
declare module '@allthings/react-ionicons/lib/ComposeIcon'
declare module '@allthings/react-ionicons/lib/AndroidNotificationsIcon'
declare module '@allthings/react-ionicons/lib/ChevronLeftIcon'
declare module '@allthings/react-ionicons/lib/IosEyeIcon'
declare module '@allthings/react-ionicons/lib/IosDownloadOutlineIcon'
declare module '@allthings/react-ionicons/lib/AndroidMoreVerticalIcon'
declare module '@allthings/react-ionicons/lib/IosArrowBackIcon'
declare module '@allthings/react-ionicons/lib/CloseIcon'
declare module '@allthings/react-ionicons/lib/SocialFacebookIcon'
declare module '@allthings/react-ionicons/lib/SocialGoogleIcon'
declare module '@allthings/react-ionicons/lib/AlertIcon'
declare module '@allthings/react-ionicons/lib/HelpIcon'
declare module '@allthings/react-ionicons/lib/BugIcon'
declare module '@allthings/react-ionicons/lib/CameraIcon'
declare module '@allthings/react-ionicons/lib/AndroidClipboardIcon'
declare module '@allthings/react-ionicons/lib/AndroidHomeIcon'
declare module '@allthings/react-ionicons/lib/AndroidOpenIcon'
declare module '@allthings/react-ionicons/lib/AndroidSettingsIcon'
declare module '@allthings/react-ionicons/lib/AndroidShareAltIcon'
declare module '@allthings/react-ionicons/lib/AndroidShareIcon'
declare module '@allthings/react-ionicons/lib/BagIcon'
declare module '@allthings/react-ionicons/lib/ClipboardIcon'
declare module '@allthings/react-ionicons/lib/FlashIcon'
declare module '@allthings/react-ionicons/lib/IosPaperOutlineIcon'
declare module '@allthings/react-ionicons/lib/IosPeopleOutlineIcon'
declare module '@allthings/react-ionicons/lib/WandIcon'
declare module '@allthings/react-ionicons/lib/AndroidDeleteIcon'
declare module '@allthings/react-ionicons/lib/DocumentIcon'
declare module '@allthings/react-ionicons/lib/UploadIcon'
declare module '@allthings/react-ionicons/lib/AndroidCloudIcon'
declare module '@allthings/react-ionicons/lib/IosFolderOutlineIcon'
declare module '@allthings/react-ionicons/lib/AndroidAttachIcon'
declare module '@allthings/react-ionicons/lib/ImageIcon'
declare module '@allthings/react-ionicons/lib/IosPaperplaneIcon'
declare module '@allthings/react-ionicons/lib/IosStarIcon'
declare module '@allthings/react-ionicons/lib/IosStarHalfIcon'
declare module '@allthings/react-ionicons/lib/IosStarOutlineIcon'
declare module '@allthings/react-ionicons/lib/ChevronRightIcon'
declare module '@allthings/react-ionicons/lib/IosClockOutlineIcon'
declare module '@allthings/react-ionicons/lib/IosHeartOutlineIcon'

declare module 'rest'
declare module 'rest/interceptor/mime'

declare module 'recharts/es6/cartesian/Area'
declare module 'recharts/es6/cartesian/Bar'
declare module 'recharts/es6/cartesian/CartesianGrid'
declare module 'recharts/es6/cartesian/Line'
declare module 'recharts/es6/cartesian/XAxis'
declare module 'recharts/es6/cartesian/YAxis'
declare module 'recharts/es6/chart/ComposedChart'
declare module 'recharts/es6/component/Legend'
declare module 'recharts/es6/component/ResponsiveContainer'
declare module 'recharts/es6/component/Tooltip'
declare module '@allthings/react-ionicons/lib/CheckmarkIcon'
declare module '@allthings/react-ionicons/lib/CheckmarkCircledIcon'
declare module '@allthings/react-ionicons/lib/HelpCircledIcon'
declare module '@allthings/js-sdk'
declare module 'glamor/server' {
  export function renderStaticOptimized(
    html: () => string,
  ): { html: string; css: string; ids: string[] }
}

declare module 'languages'
declare module 'kewler'
declare module 'react-load-script'
declare module 'aws-xray-sdk-core'
declare module 'query-string' {
  const defaultExport: {
    stringify(params: IndexSignature): string
    parse(input: string): IndexSignature<string>
    parseUrl(
      input: string,
    ): {
      url: string
      query: IndexSignature<string>
    }
  }
  export default defaultExport
}

interface ITheme {
  readonly primary?: string
  readonly text?: string
  readonly secondaryText?: string
  readonly titleColor?: string
  readonly contrast?: string
  readonly warn?: string
  readonly disabled?: string
  readonly background?: string
  readonly textOnBackground?: string
}

type IReduxState = import('./store/reducers').AppState

interface INotification {
  readonly id: string
  readonly type: string
  readonly category: string
  readonly title: string
  readonly createdAt: string
  readonly objectID: string
  readonly read: boolean
  readonly referencedObjectID: string
  readonly _embedded: {
    readonly author: IndexSignature
  }
}

type PagedData<T> = {
  readonly items: ReadonlyArray<T>
  readonly total: number
}

interface IToken {
  readonly access_token: string
  readonly expires_in?: number
}

interface IPaginationLinks {
  readonly self?: {
    readonly href: string
  }
  readonly first?: {
    readonly href: string
  }
  readonly last?: {
    readonly href: string
  }
  readonly previous?: {
    readonly href: string
  }
  readonly next?: {
    readonly href: string
  }
}

type InjectedIntlProps = import('react-intl').WrappedComponentProps
type InjectedIntl = InjectedIntlProps['intl']

type LocalizedMessage = {
  [key in import('./enums').Locale]: string | null
}

type InjectedSDK = ReturnType<typeof import('./store/api').default>

type SimpleAction = IndexSignature<any>

interface FunctionalDispatch {
  <TReturnType>(thunkAction: FunctionalAction<TReturnType>): TReturnType
  <A extends SimpleAction>(action: A): A
  // This overload is the union of the two above (see TS issue #14107).
  <TReturnType, TAction extends SimpleAction>(
    action: TAction | FunctionalAction<TReturnType>,
  ): TAction | TReturnType
}

interface DispatchProp {
  dispatch: FunctionalDispatch
}

type FunctionalAction<ReturnType = any> = (
  dispatch: FunctionalDispatch,
  sdk: InjectedSDK,
  state: IReduxState,
) => ReturnType

interface ParsedRequest extends AWSLambda.APIGatewayProxyEvent {
  readonly hostname: string
  readonly queryString?: string
  readonly cookies: IndexSignature<string>
  state?: IndexSignature
  body: IndexSignature | string
  isOffline?: boolean
  source?: string
}
