import { lazyLoadComponent } from 'utils/LazyRoutes'

const WhoIsWho = lazyLoadComponent(() =>
  import(/* webpackChunkName: "who-is-who" */ './WhoIsWho'),
)

export default () => [{ path: '/who-is-who', component: WhoIsWho }]
