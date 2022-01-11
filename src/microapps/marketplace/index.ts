import { lazyLoadComponent } from 'utils/LazyRoutes'

const Marketplace = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "marketplacex" */ './Marketplace'
  ),
)

export interface IThing {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly status: string
  readonly properties: any
  readonly _embedded: any
}

export default () => [{ path: '/marketplace', component: Marketplace }]
