import { lazyLoadComponent } from 'utils/LazyRoutes'

const Sharing = lazyLoadComponent(() =>
  import(/* webpackPreload: true, webpackChunkName: "Sharing" */ './Sharing'),
)

export default () => [{ path: '/sharing', component: Sharing }]
