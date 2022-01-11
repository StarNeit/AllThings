import { lazyLoadComponent } from 'utils/LazyRoutes'

export interface IExtendedConversationMessage extends IConversationMessage {
  categoryId: string
  categoryName: string
  originalFilename: string
  title: string
  url: string
}

export const MESSAGE_MAX_WIDTH = 500 // px
export const MARGIN = 10 // px
export const LAST_CONVERSATION_MESSAGE = 'last-conversation-message'

const ServiceCenter = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "service-center" */ './ServiceCenterOverview'
  ),
)
const ServiceCenterDetail = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "service-center-detail" */ './ServiceCenterDetail'
  ),
)
const UserProfileContainer = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "service-center-profile" */ '../../containers/UserProfileContainer'
  ),
)

export default () => [
  { path: '/service-center', exact: true, component: ServiceCenter },
  {
    path: `/service-center/profile/:id`,
    component: UserProfileContainer,
  },
  {
    path: `/service-center/ticket/:id`,
    component: ServiceCenterDetail,
  },
]
