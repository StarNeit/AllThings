import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { connect } from 'react-redux'
import {
  SimpleLayout,
  View,
  GroupedCardList,
  ListSpinner,
} from '@allthings/elements'
import { goBack } from 'connected-react-router'

import {
  EULA_URL,
  EXT,
  FALLBACK_COUNTRY,
  FALLBACK_LOCALE_RAW,
  FALLBACK_LOCALE,
  Item,
  MARGIN,
  MAX_WIDTH_DESKTOP,
  MAX_WIDTH,
  MLA_MICRO_APP_TYPES,
  MLA_URL,
  UNWANTED_MICRO_APPS,
} from 'components/TermsOfUse'
import Microapp from 'components/Microapp'
import getServiceHost from 'utils/getServiceHost'
import isFileAvailable from 'utils/isFileAvailable'
import BigTitleBar from 'components/TitleBar/BigTitleBar'

const styles = {
  container: (loggedIn: boolean) =>
    css({
      borderRadius: `${MARGIN / 2}px`,
      boxShadow: '0px 0px 14px 0px rgba(0,0,0,0.1)',
      height: '100%',
      maxWidth: loggedIn ? '100%' : `${MAX_WIDTH}px`,
      width: '100%',
      '@media all and (min-width: 880px)': {
        maxWidth: loggedIn ? '100%' : `${MAX_WIDTH_DESKTOP}px`,
      },
    }),
  mla: css({
    paddingBottom: `${MARGIN * 3}px`,
  }),
  layout: css({
    background: ColorPalette.background.light,
    borderRadius: `${MARGIN / 2}px`,
  }),
  spinner: css({
    marginTop: `${MARGIN}px`,
  }),
  wrapper: css({
    margin: `${MARGIN * 4}px`,
    WebkitOverflowScrolling: 'touch',
  }),
}

const messages = defineMessages({
  endUserLicenseAgreement: {
    id: 'terms-of-use.end-user-license-agreement',
    description: 'End user license agreement list item',
    defaultMessage: 'End User License Agreement',
  },
  microAppLicenseAgreements: {
    id: 'terms-of-use.micro-app-license-agreements',
    description: 'Micro app license agreements title',
    defaultMessage: 'Micro App License Agreements',
  },
  title: {
    id: 'terms-of-use.title',
    description: 'Terms of use title',
    defaultMessage: 'Terms of use',
  },
})

interface IProps {
  country: string
  goBack: () => void
  isNativeApp?: boolean
  locale: string
  loggedIn?: boolean
  microApps: ReadonlyArray<MicroAppProps>
}

interface IMicroappLicenseAgreement {
  readonly label: string
  readonly type: string
  readonly url: string
}

interface IState {
  readonly endUserLicenseAgreement: string
  readonly loadingEULA: boolean
  readonly loadingMLA: boolean
  readonly microApps: ReadonlyArray<MicroAppProps>
  readonly microAppLicenseAgreements: ReadonlyArray<IMicroappLicenseAgreement>
}

class TermsOfUse extends React.Component<IProps & InjectedIntlProps> {
  state: IState = {
    endUserLicenseAgreement: null,
    loadingEULA: true,
    loadingMLA: true,
    // The microApps property is only used when the user is not logged in.
    microApps: [],
    microAppLicenseAgreements: [],
  }

  async componentDidMount() {
    const { country, locale, loggedIn, microApps } = this.props
    // Fetch the app configuration if the user is not logged in yet.
    if (!loggedIn) {
      await this.fetchConfiguration()
    }
    // Get the EULA first.
    const endUserLicenseAgreement = await this.getEULA({ country, locale })
    this.setState({ loadingEULA: false, endUserLicenseAgreement })
    // Get the MLA afterward.
    const { microApps: rawMicroApps } = this.state
    const microAppLicenseAgreements = await this.getMLA({
      country,
      locale,
      microApps: loggedIn
        ? microApps
        : cleanAndSortMicroApps(rawMicroApps, locale),
    })
    this.setState({ loadingMLA: false, microAppLicenseAgreements })
  }

  fetchConfiguration = async () => {
    const { hostname } = window.location
    const JSONconfiguration = await fetch(
      `https://${getServiceHost(
        hostname,
      )}/api/v1/apps/${hostname}/configuration`,
    )
    if (JSONconfiguration.status === 200) {
      // Get the content from JSON.
      const { microApps } = await JSONconfiguration.json()
      return new Promise(resolve =>
        this.setState({ microApps }, resolve() as any),
      )
    } else {
      // @TODO: WHat should we do here?
      return null
    }
  }

  getMLA = async ({
    country,
    locale,
    microApps,
  }: {
    country: string
    locale: string
    microApps: ReadonlyArray<MicroAppProps>
  }) =>
    microApps.reduce(async (accPromise, { label, type }) => {
      const url =
        // Try to get the URL for the current locale + country code.
        (await this.isMicroAppAvailableForLocale({
          country,
          locale,
          type,
        })) ||
        // Use the fallback locale if different from the current locale.
        (locale !== FALLBACK_LOCALE
          ? await this.isMicroAppAvailableForLocale({
              country,
              locale: FALLBACK_LOCALE,
              type,
            })
          : false) ||
        // Use the fallback country and the current locale.
        (await this.isMicroAppAvailableForLocale({
          country: FALLBACK_COUNTRY,
          locale,
          type,
        })) ||
        // Finally try with both fallbacks.
        (await this.isMicroAppAvailableForLocale({
          country: FALLBACK_COUNTRY,
          locale: FALLBACK_LOCALE,
          type,
        }))
      return [...(url ? [{ label, type, url }] : []), ...(await accPromise)]
    }, Promise.resolve([]))

  getEULA = async ({ country, locale }: { country: string; locale: string }) =>
    // Try to get the URL for the current locale + country code.
    (await this.isEULAAvailableForLocale({ country, locale })) ||
    // Use the fallback locale if different from the current locale.
    (locale !== FALLBACK_LOCALE
      ? await this.isEULAAvailableForLocale({
          country,
          locale: FALLBACK_LOCALE,
        })
      : false) ||
    // Use the fallback country and the current locale.
    (await this.isEULAAvailableForLocale({
      country: FALLBACK_COUNTRY,
      locale,
    })) ||
    // Finally try with both fallbacks.
    this.isEULAAvailableForLocale({
      country: FALLBACK_COUNTRY,
      locale: FALLBACK_LOCALE,
    })

  handleGoBack = () => this.props.goBack()

  isMicroAppAvailableForLocale = async ({
    country,
    locale,
    type,
  }: {
    country: string
    locale: string
    type: string
  }) => {
    const url = `${MLA_URL}/${type}_${locale.split('_')[0]}_${country}${EXT}`
    return (await isFileAvailable(url)) && url
  }

  isEULAAvailableForLocale = async ({
    country,
    locale,
  }: {
    country: string
    locale: string
  }) => {
    const url = `${EULA_URL}/eula_${locale.split('_')[0]}_${country}${EXT}`
    return (await isFileAvailable(url)) && url
  }

  renderContent = ({
    endUserLicenseAgreement,
    formatMessage,
    loadingEULA,
    loadingMLA,
    microAppLicenseAgreements,
  }: Partial<
    IState & { formatMessage: InjectedIntl['formatMessage'] }
  >): readonly any[] => [
    ...[
      loadingEULA && loadingMLA ? (
        <ListSpinner key="eula-spinner" {...styles.spinner} />
      ) : (
        []
      ),
    ],
    ...[
      !loadingEULA
        ? this.renderEULA({ endUserLicenseAgreement, formatMessage })
        : [],
    ],
    ...[
      !loadingMLA
        ? this.renderMLA({ formatMessage, microAppLicenseAgreements })
        : [],
    ],
  ]

  renderEULA = ({
    endUserLicenseAgreement,
    formatMessage,
  }: {
    endUserLicenseAgreement: string
    formatMessage: InjectedIntl['formatMessage']
  }) =>
    endUserLicenseAgreement && (
      <GroupedCardList title="" key="eula">
        <Item
          data-e2e-eula-url={endUserLicenseAgreement}
          message={formatMessage(messages.endUserLicenseAgreement)}
          url={endUserLicenseAgreement}
        />
      </GroupedCardList>
    )

  renderMLA = ({
    formatMessage,
    microAppLicenseAgreements,
  }: {
    formatMessage: InjectedIntl['formatMessage']
    microAppLicenseAgreements: ReadonlyArray<IMicroappLicenseAgreement>
  }) =>
    microAppLicenseAgreements.length > 0 && (
      <GroupedCardList
        key="licenses"
        title={formatMessage(messages.microAppLicenseAgreements)}
        {...styles.mla}
      >
        {microAppLicenseAgreements.map(({ label, type, url }) => {
          const e2e = { [`data-e2e-mla-${type}`]: url }
          return <Item {...e2e} key={label} message={label} url={url} />
        })}
      </GroupedCardList>
    )

  render() {
    const {
      intl: { formatMessage },
      loggedIn,
    } = this.props
    const Layout = loggedIn ? SimpleLayout : View
    const getStyles = (prop: string) => (loggedIn ? {} : styles[prop])
    const {
      endUserLicenseAgreement,
      loadingEULA,
      loadingMLA,
      microAppLicenseAgreements,
    } = this.state
    return (
      <Microapp alignH="center" alignV="center" {...getStyles('wrapper')}>
        <View {...styles.container(loggedIn)}>
          <Layout
            background={ColorPalette.background.light}
            {...getStyles('layout')}
          >
            <SimpleLayout padded={'horizontal'}>
              <BigTitleBar title={formatMessage(messages.title)} />
              {this.renderContent({
                endUserLicenseAgreement,
                formatMessage,
                loadingEULA,
                loadingMLA,
                microAppLicenseAgreements,
              })}
            </SimpleLayout>
          </Layout>
        </View>
      </Microapp>
    )
  }
}

const cleanAndSortMicroApps = (
  microApps: ReadonlyArray<MicroAppProps>,
  locale: string,
) =>
  microApps
    .reduce((acc, { label, type, _embedded: { type: { type: behavior } } }) => {
      return [
        ...(MLA_MICRO_APP_TYPES.includes(behavior) &&
        !UNWANTED_MICRO_APPS.includes(type)
          ? [{ label: label[locale] || label[FALLBACK_LOCALE_RAW], type }]
          : []),
        ...acc,
      ]
    }, [])
    .sort()

const mapStateToProps = ({
  app: {
    config: { country },
    embeddedLayout,
    locale,
    microApps,
  },
  authentication: { loggedIn },
}: IReduxState) => ({
  country: country.toLowerCase(),
  isNativeApp: embeddedLayout,
  locale,
  loggedIn,
  // Get the micro apps cleaned up and sorted.
  microApps: cleanAndSortMicroApps(microApps, locale),
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goBack: () => dispatch(goBack()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(TermsOfUse))
