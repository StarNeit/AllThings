import React, { ReactNode } from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { connect } from 'react-redux'
import {
  Card,
  Icon,
  Inset,
  SimpleLayout,
  Text,
  ThemeProvider,
  View,
} from '@allthings/elements'
import { IconType } from '@allthings/elements/Icon'
import { goBack } from 'connected-react-router'
import TwitterIcon from 'components/Icons/TwitterIcon'
import Microapp from 'components/Microapp'
import WithAppIntro from './AppIntroContainer'
import BigTitleBar from 'components/TitleBar/BigTitleBar'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const EMAIL = 'support@allthings.me'
const MARGIN = 10
const REGISTER_NUMBER = 'CH-270.3.014.814-4'
const REGISTER_OFFICE = 'Basel'
const TAX_NUMBER = 'CHE-191.384.657 MWST'

const styles = {
  container: css({
    borderRadius: `${MARGIN / 2}px`,
    boxShadow: '0px 0px 14px 0px rgba(0,0,0,0.1)',
    height: '100%',
    maxWidth: '100%',
    width: '100%',
    '@media all and (min-width: 880px)': {
      maxWidth: '100%',
    },
  }),
  icon: css({
    marginRight: `${MARGIN}px`,
  }),
  layout: css({
    borderRadius: `${MARGIN / 2}px`,
  }),
  main: css({
    borderRadius: `${MARGIN}px`,
    padding: `${MARGIN * 4}px`,
  }),
  spaced: css({
    marginTop: `${MARGIN * 4}px`,
  }),
}

const messages = defineMessages({
  contact: {
    id: 'legal-disclosure.contact',
    description: 'Legal disclosure - contact title',
    defaultMessage: 'Contact',
  },
  registerNumber: {
    id: 'legal-disclosure.register-number',
    description: 'Legal disclosure - register number',
    defaultMessage: 'Register number: {number}',
  },
  registerOffice: {
    id: 'legal-disclosure.register-office',
    description: 'Legal disclosure - register office',
    defaultMessage: 'Register office: {city}',
  },
  representedBy: {
    id: 'legal-disclosure.represented-by',
    description: 'Legal disclosure - represented by title',
    defaultMessage: 'Represented by',
  },
  taxNumber: {
    id: 'legal-disclosure.tax-number',
    description: 'Legal disclosure - tax number title',
    defaultMessage: 'Tax number (Switzerland)',
  },
  title: {
    id: 'legal-disclosure.title',
    description: 'Legal disclosure title',
    defaultMessage: 'Legal disclosure',
  },
  tradeRegisterEntry: {
    id: 'legal-disclosure.trade-register-entry',
    description: 'Legal disclosure - trade register entry title',
    defaultMessage: 'Trade register entry',
  },
})

interface IProps {
  goBack: () => void
  loggedIn?: boolean
  isCheckedIn?: boolean
}

class LegalDisclosure extends React.Component<IProps & WrappedComponentProps> {
  handleGoBack = () => this.props.goBack()

  sections = () => {
    const { formatMessage } = this.props.intl
    return [
      {
        title: 'Allthings Technologies AG',
        lines: ['Lange Gasse 8', 'CH-4052 Basel', 'Schweiz'],
      },
      {
        title: 'Allthings GmbH',
        lines: [
          'Unicorn Village',
          'Richardstraße 85',
          'D-12043 Berlin',
          'Deutschland',
        ],
      },
      {
        title: formatMessage(messages.representedBy),
        lines: ['Stefan Zanetti'],
      },
      {
        title: formatMessage(messages.contact),
        lines: [
          this.renderIconSubSection({
            key: 'email',
            icon: 'email',
            text: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>,
          }),
          this.renderIconSubSection({
            key: 'phone',
            icon: 'phone',
            text: '+49 1511 003 22 54',
          }),
          this.renderIconSubSection({
            key: 'twitter',
            icon: (
              <TwitterIcon
                stroke={ColorPalette.greyIntense}
                height="21px"
                width="21px"
                {...styles.icon}
              />
            ),
            text: (
              <a
                href="https://twitter.com/allthings_here"
                rel="noopener"
                target="_blank"
              >
                allthings_here
              </a>
            ),
          }),
        ],
      },
      {
        title: formatMessage(messages.tradeRegisterEntry),
        lines: [
          formatMessage(messages.registerOffice, { city: REGISTER_OFFICE }),
          formatMessage(messages.registerNumber, { number: REGISTER_NUMBER }),
        ],
      },
      {
        title: formatMessage(messages.taxNumber),
        lines: [TAX_NUMBER],
      },
    ]
  }

  renderSection = (
    {
      title,
      lines,
    }: { title: string; lines: ReadonlyArray<JSX.Element | string> },
    index: number,
  ) => (
    <View key={title} {...(index === 0 ? {} : styles.spaced)}>
      <Text align="center" size="l" strong>
        {title}
      </Text>
      {lines.map(line =>
        typeof line === 'string' ? (
          <Text align="center" key={line} size="s">
            {line}
          </Text>
        ) : (
          line
        ),
      )}
    </View>
  )

  renderIconSubSection = ({
    icon,
    text,
    key,
  }: {
    icon: IconType | ReactNode
    text: ReactNode
    key: string
  }) => (
    <View alignH="center" direction="row" key={key}>
      {typeof icon === 'string' ? (
        <Icon
          color={ColorPalette.greyIntense}
          name={icon as IconType}
          size="s"
          {...styles.icon}
        />
      ) : (
        icon
      )}
      {typeof text === 'string' ? <Text>{text}</Text> : text}
    </View>
  )

  renderContent = () => (
    <View alignV="center" direction="column" {...styles.main}>
      {this.sections().map(this.renderSection)}
    </View>
  )

  render() {
    const { isCheckedIn, intl } = this.props
    const { formatMessage } = intl

    return (
      <ThemeProvider
        theme={{
          background: ColorPalette.none,
          primary: ColorPalette.lightBlueIntense,
        }}
      >
        {isCheckedIn ? (
          <Microapp style={{ alignH: 'center', alignV: 'center' }}>
            <SimpleLayout {...styles.layout} padded={'horizontal'}>
              <BigTitleBar
                data-e2e="legal-disclosure-title"
                title={formatMessage(messages.title)}
              />
              <Inset vertical={true} />
              <Card>{this.renderContent()}</Card>
            </SimpleLayout>
          </Microapp>
        ) : (
          <WithAppIntro>
            <GenericBackTitleBar onBack={this.handleGoBack} />
            {this.renderContent()}
          </WithAppIntro>
        )}
      </ThemeProvider>
    )
  }
}
const mapStateToProps = ({
  authentication: { loggedIn, isCheckedIn },
}: IReduxState) => ({
  loggedIn,
  isCheckedIn,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goBack: () => dispatch(goBack()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(LegalDisclosure))
