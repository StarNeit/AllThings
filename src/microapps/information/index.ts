import { lazyLoadComponent } from 'utils/LazyRoutes'

const Information = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "information" */ './Information'
  ),
)

export default () => [{ path: '/information', component: Information }]
export const MICROAPP_NAME = 'project'

export interface IArticle {
  readonly id: string
  readonly _embedded: any
}
