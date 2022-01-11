import { lazyLoadComponent } from 'utils/LazyRoutes'

const Pinboard = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "pinboard-main" */ './Pinboard'
  ),
)

export default () => [{ path: '/pinboard', component: Pinboard }]

export interface IPostTranslation {
  readonly locale: string
}
export interface IPost {
  readonly id: string
  readonly translations: ReadonlyArray<IPostTranslation>
  readonly category: string
  readonly content: string
  readonly likeCount: number
  readonly disableSocialMedia: boolean
  readonly currentLanguage: string
  readonly defaultLocale: string
  readonly _meta: any
  readonly _embedded: any
}

export interface IComment {
  readonly id: string
  readonly content: string
  readonly createdAt: string
  readonly _embedded: any
}
