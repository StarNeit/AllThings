import { lazyLoadComponent } from 'utils/LazyRoutes'

const ContractList = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "my-contracts" */ './ContractList'
  ),
)

export default () => [{ path: '/my-contracts', component: ContractList }]
