import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { Text, Responsive } from '@allthings/elements'

import ServiceChooserItem from './ServiceChooserItem'
import Navigation from 'components/Navigation'
import NavigationItem from 'components/NavigationItem'
import NavigationTextItem from 'components/NavigationTextItem'
import NavigationHeader from 'components/NavigationHeader'
import NavigationDesktopBar from 'components/NavigationDesktopBar'
import NavigationDesktopBarItem from 'components/NavigationDesktopBarItem'
import NavigationItemSeparator from 'components/NavigationItemSeparator'
import getDataProtectionURL from 'utils/getDataProtectionURL'
import NoOp from 'utils/noop'
import OverlayToggle from 'components/OverlayToggle'
import ComposeOverlay from 'containers/ComposeOverlay'
import NotificationsOverlay from 'containers/Notifications'
import { Locale } from 'enums'
import { colorCode } from '@allthings/elements/utils/propTypes/color'

const FALLBACK_LOCALE = Locale.en_US
const SECONDARY_APPS = ['settings']
const TERTIARY_ITEMS = [
  { name: 'feedback', external: false },
  { name: 'legal', external: false },
  { name: 'terms-of-use', external: false },
  { name: 'data-protection', external: true },
]

const messages = defineMessages({
  'data-protection': {
    id: 'service-chooser.data-protection',
    description: 'Data protection item in the service chooser',
    defaultMessage: 'Data protection',
  },
  feedback: {
    id: 'service-chooser.feedback',
    description: 'Users can give app feedback from here',
    defaultMessage: 'Feedback',
  },
  legal: {
    id: 'service-chooser.legal-disclosure',
    description: 'Legal disclosure item in the service chooser',
    defaultMessage: 'Legal disclosure',
  },
  logout: {
    id: 'service-chooser.logout',
    description: 'Logout item in the service chooser',
    defaultMessage: 'Logout',
  },
  'terms-of-use': {
    id: 'service-chooser.terms-of-use',
    description: 'Terms of use item in the service chooser',
    defaultMessage: 'Terms of use',
  },
})

interface IServiceInfo {
  readonly url: string
  readonly openInNewWindow: boolean
}

interface IProps {
  chooserVisible: boolean
  country: string
  locale: Locale
  microApps: ReadonlyArray<MicroAppProps>
  onChooseService: ({
    openInNewWindow,
    url,
  }: {
    openInNewWindow: boolean
    url: string
  }) => void
  onGoTo: (path: string) => void
  onLogoutClick: () => void
  onMailClick?: () => void
  onSearchClick?: () => void
  subTitle?: string
  title: string
  unreadCount: number
}

class ServiceChooser extends React.Component<IProps & InjectedIntlProps> {
  static defaultProps = {
    microApps: [] as ReadonlyArray<MicroAppProps>,
    style: {},
  }

  state = { dataProtectionURL: '' }

  async componentDidMount() {
    await this.getDataProtection()
  }

  async componentDidUpdate({ locale: prevLocale }: IProps) {
    const { locale } = this.props
    if (locale !== prevLocale) {
      await this.getDataProtection()
    }
  }

  handleClick = (info: IServiceInfo) => this.props.onChooseService(info)
  handleGoTo = (path: string) => () => this.props.onGoTo(path)
  handleLogout = () => this.props.onLogoutClick()

  getDataProtection = async () => {
    const { country, locale } = this.props
    const dataProtectionURL = await getDataProtectionURL({
      country,
      locale,
      localeFallback: FALLBACK_LOCALE,
    })
    this.setState({ dataProtectionURL })
  }

  getMicroapps = (secondary = false) =>
    this.props.microApps.filter(({ type }) =>
      secondary
        ? SECONDARY_APPS.includes(type)
        : !SECONDARY_APPS.includes(type),
    )

  getSecondaryApps = () => this.getMicroapps(true)

  renderButtons = () =>
    this.getMicroapps().map(
      ({
        _embedded: {
          type: { type: behavior },
        },
        color,
        customLogo: customLogoUrl,
        id,
        icon,
        label,
        order,
        type,
        url,
      }) => (
        <ServiceChooserItem
          behavior={behavior}
          color={color}
          customLogoUrl={customLogoUrl}
          icon={icon}
          iconColor="textOnBackground"
          id={id}
          key={type + order}
          onClick={this.handleClick}
          textColor="contrast"
          type={type}
          url={url}
        >
          {label ? label[this.props.locale] || label[FALLBACK_LOCALE] : type}
        </ServiceChooserItem>
      ),
    )

  renderSecondaryButtons = ({
    formatMessage,
  }: {
    formatMessage: InjectedIntl['formatMessage']
  }) => [
    this.getSecondaryApps().map(
      ({
        _embedded: {
          type: { id: typeId },
        },
        icon,
        id,
        label,
        order,
        type,
      }) => (
        <ServiceChooserItem
          color="contrast"
          iconColor="contrast"
          icon={icon}
          id={id}
          key={type + order}
          onClick={this.handleClick}
          order={order} // @TODO: not used at all! Do we still need it?
          textColor="contrast"
          type={typeId}
        >
          {label ? label[this.props.locale] || label[FALLBACK_LOCALE] : type}
        </ServiceChooserItem>
      ),
    ),
    <NavigationItem
      color="contrast"
      textColor="contrast"
      icon="power"
      iconColor="contrast"
      onClick={this.handleLogout}
      key="logout"
    >
      {formatMessage(messages.logout)}
    </NavigationItem>,
  ]

  renderTertiaryButtons = ({
    dataProtectionURL,
    formatMessage,
  }: {
    dataProtectionURL: string
    formatMessage: InjectedIntl['formatMessage']
  }) =>
    TERTIARY_ITEMS.map(({ name, external }) => (
      <NavigationTextItem
        color="contrast"
        data-e2e={`service-chooser-${name}`}
        key={name}
        onClick={external ? NoOp : this.handleGoTo(name)}
        textColor="contrast"
      >
        {external ? (
          <a
            data-e2e-data-protection-url={dataProtectionURL}
            href={dataProtectionURL}
            rel="noopener"
            target="_blank"
          >
            <Text color={colorCode('contrast')} size="s">
              {formatMessage(messages[name])}
            </Text>
          </a>
        ) : (
          formatMessage(messages[name])
        )}
      </NavigationTextItem>
    ))

  render() {
    const {
      chooserVisible,
      intl: { formatMessage },
      subTitle,
      title,
      unreadCount,
    } = this.props
    const { dataProtectionURL } = this.state
    return (
      <Navigation active={chooserVisible}>
        <NavigationHeader title={title} subTitle={subTitle} />
        <Responsive desktop>
          <NavigationDesktopBar>
            <OverlayToggle overlay={NotificationsOverlay}>
              {({ open: openNotifications }) => (
                <NavigationDesktopBarItem
                  count={unreadCount}
                  data-e2e="notifications-button"
                  icon="alarm"
                  onClick={openNotifications}
                />
              )}
            </OverlayToggle>
            <OverlayToggle overlay={ComposeOverlay}>
              {({ open: openCompose }) => (
                <NavigationDesktopBarItem
                  data-e2e="compose-button"
                  icon="plus-light-filled"
                  onClick={openCompose}
                />
              )}
            </OverlayToggle>
          </NavigationDesktopBar>
        </Responsive>
        {this.renderButtons()}
        <NavigationItemSeparator />
        {this.renderSecondaryButtons({ formatMessage })}
        <NavigationItemSeparator />
        {this.renderTertiaryButtons({ dataProtectionURL, formatMessage })}
      </Navigation>
    )
  }
}

export default injectIntl(ServiceChooser)
