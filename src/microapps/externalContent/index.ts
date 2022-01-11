import { lazyLoadComponent } from 'utils/LazyRoutes'

const ExternalContent = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "external-content" */ './ExternalContent'
  ),
)

export default (config: { readonly id: string; readonly order: string }) => [
  { path: `/external-content/${config.id}`, component: ExternalContent },
  { path: `/external-content/${config.order}`, component: ExternalContent },
]
