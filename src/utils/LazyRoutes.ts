import Loadable from 'react-loadable'
import UniversalSkeleton from 'components/UniversalSkeleton'
import ThrowError from 'components/ThrowError'

export const lazyLoadComponent = <P extends {}>(
  loader: () => Promise<{
    default: React.ComponentType<P>
  }>,
  Skeleton: React.ComponentType<any> = UniversalSkeleton,
): React.ComponentType<P> =>
  Loadable({
    loader,
    loading: ThrowError(Skeleton),
  })

export const UserProfileContainer = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "user-profile" */ 'containers/UserProfileContainer'
  ),
)

export const ServiceCenterOverview = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "service-center-overview-main" */ 'microapps/serviceCenter/ServiceCenterOverview'
  ),
)
export const ServiceCenterDetail = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "service-center-details" */ 'microapps/serviceCenter/ServiceCenterDetail'
  ),
)

export const ContractList = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "contract-list" */ 'microapps/myContracts/ContractList'
  ),
)

export const Settings = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "settings" */ 'microapps/settings/Settings'
  ),
)

export const Invitations = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "invitations" */ 'microapps/settings/Invitations'
  ),
)

export const MutedUsers = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "muted-pinboard-users" */ 'microapps/settings/MutedUsers'
  ),
)

export const AuthorizedClients = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "authorized-clients" */ 'microapps/settings/AuthorizedClients'
  ),
)

export const Documents = lazyLoadComponent(() =>
  import(
    /* webpackPreload: true, webpackChunkName: "documents" */ 'microapps/documents/Documents'
  ),
)

export const JamesServiceList = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "james-service-list" */ 'microapps/james/JamesServiceList'
  ),
)
export const JamesServiceDetail = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "james-service-detail" */ 'microapps/james/JamesServiceDetail'
  ),
)

export const Cobot = lazyLoadComponent(() =>
  import(/* webpackChunkName: "cobot" */ 'microapps/cobot/Cobot'),
)

export const Concierge = lazyLoadComponent(() =>
  import(/* webpackChunkName: "concierge" */ 'microapps/concierge/Concierge'),
)

export const Archilogic = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "archilogic" */ 'microapps/archilogic/Archilogic'
  ),
)

export const Consumption = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "consumption" */ 'microapps/consumption/Consumption'
  ),
)

export const Forward = lazyLoadComponent(() =>
  import(/* webpackChunkName: "forward" */ 'pages/Forward/Forward'),
)

export const LegalDisclosure = lazyLoadComponent(() =>
  import(/* webpackChunkName: "legal-disclosure" */ 'pages/LegalDisclosure'),
)

export const TermsOfUse = lazyLoadComponent(() =>
  import(/* webpackChunkName: "terms-of-use" */ 'pages/TermsOfUse'),
)

export const Feedback = lazyLoadComponent(() =>
  import(/* webpackChunkName: "feedback" */ 'microapps/feedback/Feedback'),
)

export const UnsubscribeFromEmail = lazyLoadComponent(() =>
  import(
    /* webpackChunkName: "unsubscribe-from-email" */ 'pages/UnsubscribeFromEmail'
  ),
)

export const PaymentOutcome = lazyLoadComponent(() =>
  import(/* webpackChunkName: "payment-outcome" */ 'pages/PaymentOutcome'),
)

export const StripeRedirect = lazyLoadComponent(() =>
  import(/* webpackChunkName: "stripe-redirect" */ 'pages/StripeRedirect'),
)
