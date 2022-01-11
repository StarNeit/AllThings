import { lazyLoadComponent } from 'utils/LazyRoutes'

const Cobot = lazyLoadComponent(() =>
  import(/* webpackChunkName: "cobot-main" */ 'microapps/cobot/Cobot'),
)

interface IConfig {
  readonly id: string
  readonly order: string
}

export default (config: IConfig) => [
  { path: `/cobot/${config.id}`, component: Cobot },
  { path: `/cobot/${config.order}`, component: Cobot },
]
