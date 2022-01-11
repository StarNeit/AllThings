import { lazyLoadComponent } from 'utils/LazyRoutes'

const Craftspeople = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "craftspeople" */ './Craftspeople'
  ),
)

export default () => [{ path: '/craftspeople', component: Craftspeople }]
