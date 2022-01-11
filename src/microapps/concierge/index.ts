import { lazyLoadComponent } from 'utils/LazyRoutes'

const Concierge = lazyLoadComponent(() =>
  import(/* webpackChunkName: "concierge-main" */ './Concierge'),
)

export default (config: { id: string; order: string }) => [
  { path: `/concierge/${config.id}`, component: Concierge },
  { path: `/concierge/${config.order}`, component: Concierge },
]
