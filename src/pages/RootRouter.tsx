import React from 'react'
import NoCookiesContainer from 'containers/NoCookies'
import NotFound from 'microapps/notFound'
import CheckIn from 'pages/LoggedIn/CheckIn'
import {
  PasswordRequest,
  PasswordReset,
  ChoosePassword,
  LogoutProxy,
  LandingPage,
} from 'pages/LoggedOut'
import { connect } from 'react-redux'
import {
  withRouter,
  Route,
  Switch,
  Redirect,
  RouteComponentProps,
} from 'react-router'
import qs from 'query-string'
import createMicroappLegacy from 'utils/createMicroappLegacy'
import RedirectWithParams from 'router/RedirectWithParams'
import AnonymousRoute from 'router/AnonymousRoute'
import PrivateRoute from 'router/PrivateRoute'
import { MicroApps } from 'enums'
import UniversalSkeleton from 'components/UniversalSkeleton'
import logBrowserError from 'utils/logBrowserError'
import {
  Archilogic,
  AuthorizedClients,
  MutedUsers,
  Cobot,
  Concierge,
  Consumption,
  Documents,
  Feedback,
  Forward,
  Invitations,
  JamesServiceDetail,
  JamesServiceList,
  LegalDisclosure,
  PaymentOutcome,
  Settings,
  StripeRedirect,
  TermsOfUse,
  UnsubscribeFromEmail,
  UserProfileContainer,
} from 'utils/LazyRoutes'
import { ThemeProvider } from '@allthings/elements'
import AccountsLoginRedirect from './LoggedOut/AccountsLoginRedirect'
import SignUpRedirect from './LoggedOut/SignUpRedirect'
import AddressLookUp from './LoggedIn/AddressLookUp'
import RedirectAfterAuth from './RedirectAfterAuth'
import get from 'lodash-es/get'

// The value represents the folder name under src/microapps.
// For example for booking following file will be loaded:
// src/microapps/booking/index.ts
const DynamicMicroappsMap = {
  [MicroApps.BOOKING]: 'booking',
  [MicroApps.CRAFTSPEOPLE]: 'craftspeople',
  [MicroApps.EXTERNAL_CONTENT]: 'externalContent',
  [MicroApps.HELPDESK]: 'serviceCenter',
  [MicroApps.MY_CONTRACTS]: 'myContracts',
  [MicroApps.PINBOARD]: 'pinboard',
  [MicroApps.PROJECT]: 'information',
  [MicroApps.WHO_IS_WHO]: 'whoIsWho',
  [MicroApps.SHARING]: 'sharing',
  [MicroApps.MARKETPLACE]: 'marketplace',
}

const externalMicroappTypes = ['external', 'internal']

const createMicroappRouter = (
  routerConfig: (
    config: MicroAppProps,
  ) => ReadonlyArray<{
    component: React.ComponentType<{ config: Partial<MicroAppProps> }>
  }>,
  microappConfig: MicroAppProps,
) =>
  routerConfig &&
  routerConfig(microappConfig).map(
    ({ component: Component, ...routeConfig }) => (
      <PrivateRoute
        key={microappConfig.id}
        render={(props: IndexSignature) => (
          <ThemeProvider theme={{ primary: microappConfig.color }}>
            <Component config={microappConfig} {...props} />
          </ThemeProvider>
        )}
        {...routeConfig}
      />
    ),
  )

const microappFilter = ({
  _embedded: {
    type: { type: behavior },
  },
  type,
}: MicroAppProps) =>
  type in DynamicMicroappsMap || externalMicroappTypes.includes(behavior)

type Props = ReturnType<typeof mapStateToProps>

interface IState {
  hasError: boolean
  ready: boolean
}

// Be careful not to place it in component prop of PrivateRoute because of
// https://github.com/supasate/connected-react-router/issues/205
// When this is fixed it should be safe again.
// @todo replace these with the new dynamic loaded microapps
// see
const NonDynamicMicroapps = {
  Documents: createMicroappLegacy('documents', Documents),
  James: createMicroappLegacy('concierge', Concierge),
  JamesServiceList: createMicroappLegacy('e-concierge', JamesServiceList),
  JamesServiceDetail: createMicroappLegacy('e-concierge', JamesServiceDetail),
  Cobot: createMicroappLegacy('cobot', Cobot),
  Settings: createMicroappLegacy('settings', Settings),
  Invitations: createMicroappLegacy('settings', Invitations),
  MutedUsers: createMicroappLegacy('settings', MutedUsers),
  AuthorizedClients: createMicroappLegacy('settings', AuthorizedClients),
  Archilogic: createMicroappLegacy('archilogic', Archilogic),
  Consumption: createMicroappLegacy('consumption', Consumption),
  UserProfileContainer: createMicroappLegacy('booking', UserProfileContainer),
}

class RootRouter extends React.Component<Props & RouteComponentProps, IState> {
  state = {
    hasError: false,
    ready: false,
  }

  componentIsMounted = false
  microappRoutes: IndexSignature = null

  loadMicroapps = async (microapps: IReduxState['app']['microApps']) => {
    this.setState({ ready: false })
    const apps = await Promise.all(
      microapps.filter(microappFilter).map(
        ({
          type,
          _embedded: {
            type: { type: behavior },
          },
        }) => {
          const appType = externalMicroappTypes.includes(behavior)
            ? MicroApps.EXTERNAL_CONTENT
            : type
          return import(
            `../microapps/${DynamicMicroappsMap[appType]}` /* webpackChunkName: "microapp/[request]" */
          ).then(module => ({
            [appType]: module.default,
          }))
        },
      ),
    )
    this.microappRoutes = apps.reduce((acc, val) => ({ ...acc, ...val }), {})
    this.componentIsMounted && this.setState({ ready: true })
  }

  renderMicroappRoutes = () =>
    this.props.microapps.filter(microappFilter).map(config => {
      const appType = externalMicroappTypes.includes(config._embedded.type.type)
        ? MicroApps.EXTERNAL_CONTENT
        : config.type
      return createMicroappRouter(this.microappRoutes[appType], config)
    })

  componentDidCatch(error: Error, info: unknown) {
    this.setState({ hasError: true })
    // tslint:disable:no-console
    console.error(error)
    info && console.info(info)
    // tslint:enable:no-console
    logBrowserError(error)
  }

  componentDidMount() {
    this.componentIsMounted = true
    this.loadMicroapps(this.props.microapps)
  }

  componentWillUnmount() {
    this.componentIsMounted = false
  }

  componentDidUpdate(prevProps: Props & RouteComponentProps) {
    if (this.props.location.key !== prevProps.location.key) {
      this.setState({ hasError: false })
    }
    if (this.props.microapps.length !== prevProps.microapps.length) {
      this.loadMicroapps(this.props.microapps)
    }
  }

  render() {
    const {
      loggedIn,
      location,
      microapps,
      isCheckedIn,
      userLoggedInBefore,
    } = this.props
    const { hasError, ready } = this.state

    if (hasError) {
      return null
    }

    const { referrer } = qs.parse(location.search)

    // @TODO: Added in emergency. Clean me up!
    const shouldForcePickFirstMicroApp = get(
      this.props.customSettings,
      'forcePickFirstMicroApp',
      '',
    )

    // Logic for default route:
    // If community-article micro app exists
    // -> redirect to its path
    // otherwise if the first microapp exists in microappRoutes
    // -> redirect to its path
    // otherwise if the type of the first microapp is internal or external
    // -> redirect to external-content microapp path
    // otherwise redirect to microapps[0].type
    const defaultRoute =
      microapps.length > 0 &&
      this.microappRoutes &&
      Object.keys(this.microappRoutes).length > 0
        ? this.microappRoutes['community-articles'] &&
          // @TODO: Added in emergency. Clean me up!
          shouldForcePickFirstMicroApp !== 'true'
          ? this.microappRoutes['community-articles']()[0].path
          : this.microappRoutes[microapps[0].type]
          ? this.microappRoutes[microapps[0].type](microapps[0])[0].path
          : externalMicroappTypes.includes(microapps[0]._embedded.type.type)
          ? this.microappRoutes['external-content'](microapps[0])[0].path
          : microapps[0].type
        : null

    return (
      <>
        <RedirectAfterAuth referrer={referrer} />
        <Switch>
          <Route path="/no-cookies" component={NoCookiesContainer} />
          <Route path="/404" component={NotFound} />
          <Route path="/legal" component={LegalDisclosure} />

          <Route path="/terms-of-use" component={TermsOfUse} />
          <Route path="/unsubscribe/:token" component={UnsubscribeFromEmail} />
          <AnonymousRoute
            path="/password/reset-request"
            component={PasswordRequest}
          />
          <AnonymousRoute
            path="/login-redirect"
            component={AccountsLoginRedirect}
          />

          <AnonymousRoute path="/signup" component={SignUpRedirect} />

          <AnonymousRoute
            exact
            path="/password/reset/:token"
            component={PasswordReset}
          />
          <AnonymousRoute
            exact
            path="/password/reset"
            component={PasswordReset}
          />
          <AnonymousRoute
            exact
            path="/password/create/:token"
            component={ChoosePassword} // after being registered by someone else, and being invited
          />
          <PrivateRoute path="/feedback" component={Feedback} />
          <Route path="/logout" component={LogoutProxy} />
          {isCheckedIn && <Redirect from="/check-in" to="/" />}
          <PrivateRoute
            path="/check-in"
            mustBeCheckedIn={false}
            component={CheckIn}
          />
          <PrivateRoute
            path="/request-code"
            mustBeCheckedIn={false}
            component={AddressLookUp}
          />
          <PrivateRoute path="/uid/:shortId" component={Forward} />
          <Redirect exact from="/project" to="/information" />
          <RedirectWithParams
            exact
            from="/project/:topic"
            to="/information/topic/:topic"
          />
          <RedirectWithParams
            exact
            from="/project/:topic/articles/:article"
            to="/information/article/:article"
          />
          <RedirectWithParams
            exact
            from="/clipboard/things/:id"
            to="/marketplace/show/:id"
          />
          <Redirect from="/helpdesk" to="/service-center" />
          <Route path="/payments" component={PaymentOutcome} />
          <Route path="/stripe-redirect" component={StripeRedirect} />
          <Redirect from="/contracts" to="/my-contracts" />
          <Redirect exact from="/community-articles" to="/pinboard" />
          <RedirectWithParams
            from="/community-articles/:id"
            to="/pinboard/post/:id"
          />
          <Redirect from="/clipboard" to="/marketplace" />
          <PrivateRoute
            path="/documents"
            component={NonDynamicMicroapps.Documents}
          />
          <PrivateRoute
            exact
            path="/e-concierge"
            component={NonDynamicMicroapps.JamesServiceList}
          />
          <PrivateRoute
            path="/e-concierge/:id"
            component={NonDynamicMicroapps.JamesServiceDetail}
          />
          <PrivateRoute
            exact
            path="/concierge"
            component={NonDynamicMicroapps.James}
          />
          <PrivateRoute
            exact
            path="/cobot"
            component={NonDynamicMicroapps.Cobot}
          />
          <PrivateRoute
            exact
            path="/settings"
            component={NonDynamicMicroapps.Settings}
          />
          <PrivateRoute
            path="/settings/invitations"
            component={NonDynamicMicroapps.Invitations}
          />
          <Redirect from="/settings/blocked-users" to="/settings/muted-users" />
          <PrivateRoute
            path="/settings/muted-users"
            component={NonDynamicMicroapps.MutedUsers}
          />
          <PrivateRoute
            path="/settings/authorized-clients"
            component={NonDynamicMicroapps.AuthorizedClients}
          />
          <PrivateRoute
            path="/archilogic"
            component={NonDynamicMicroapps.Archilogic}
          />
          <PrivateRoute
            exact
            path="/consumption"
            component={NonDynamicMicroapps.Consumption}
          />
          <PrivateRoute
            path="/consumption/:id"
            component={NonDynamicMicroapps.Consumption}
          />
          <PrivateRoute
            path="/booking/profile/:id"
            component={NonDynamicMicroapps.UserProfileContainer}
          />

          {loggedIn && defaultRoute && (
            <Redirect from="/" to={defaultRoute} exact />
          )}

          {!loggedIn && userLoggedInBefore && (
            <Redirect from="/" to="/login-redirect" exact />
          )}

          {!ready && (
            <Route component={() => <UniversalSkeleton showTitle={false} />} />
          )}

          <AnonymousRoute path="/login" component={LandingPage} />

          {!loggedIn && <Redirect from="/" to="/login" exact />}

          {!loggedIn && (
            <Redirect
              from="*"
              to={{
                pathname: '/login-redirect',
                search: `?referrer=${encodeURIComponent(location.pathname)}`,
              }}
            />
          )}
          {ready && this.renderMicroappRoutes()}
          {/*
          APP-3038: The route below is to catch the case if no microapp is available because
          they are all channeled and the user is not checked-in yet.
          We are utilizing the redirect of the PrivateRoute to redirect the user to the check-in
          screen. The whole construct is smelly if we need to do these kind of things.
          Good luck.
        */}
          {ready && loggedIn && !defaultRoute && <PrivateRoute />}
          {ready && <Route path="*" component={NotFound} />}
        </Switch>
      </>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  // https://allthings.atlassian.net/browse/APP-1268
  // Why do we need to pick the user locale here?
  // We need it in order to get connected components updating the localization
  // instantly, which is the case in the settings.
  // Some background:
  // https://github.com/yahoo/react-intl/issues/371
  // https://github.com/yahoo/react-intl/issues/1103
  customSettings: get(state, 'app.config.customSettings', {}),
  locale: state.authentication.user.locale,
  loggedIn: state.authentication.loggedIn,
  isCheckedIn: state.authentication.isCheckedIn,
  microapps: state.app.microApps,
  userLoggedInBefore: state.app.userLoggedInBefore,
})

export default withRouter(connect(mapStateToProps)(RootRouter))
