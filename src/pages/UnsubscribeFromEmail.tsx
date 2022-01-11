import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import {
  Button,
  SimpleLayout,
  Icon,
  Form,
  ResourceProvider,
  Spacer,
  Text,
  View,
  ThemeProvider,
  FormCheckbox,
} from '@allthings/elements'
import { CustomTitleBar, TitleBarLabel } from 'components/TitleBar'
import withRequest, { IWithRequest } from 'containers/withRequest'
import Microapp from 'components/Microapp'
import WithAppIntro from './AppIntroContainer'

const MARGIN = 10
const MAX_WIDTH = 280
const MAX_WIDTH_DESKTOP = 350

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
  layout: css({
    background: ColorPalette.background.light,
    borderRadius: `${MARGIN / 2}px`,
  }),
  main: css({
    borderRadius: `${MARGIN}px`,
    padding: `${MARGIN * 4}px`,
  }),
  spaced: css({
    marginTop: `${MARGIN * 4}px`,
  }),
  titleBar: css({
    background: ColorPalette.lightBlueIntense,
    borderRadius: `${MARGIN / 2}px ${MARGIN / 2}px 0 0`,
    cursor: 'pointer',
    height: `${MARGIN * 4}px`,
  }),
  titleBarItems: css({
    margin: `${MARGIN}px`,
  }),
  wrapper: css({
    margin: `${MARGIN * 4}px`,
    WebkitOverflowScrolling: 'touch',
  }),
}

const messages = defineMessages({
  intro: {
    id: 'unsubscribe-email.intro',
    description: 'Unsubscribe from the following eMails',
    defaultMessage:
      'I want to Unsubscribe from the following transactional eMails',
  },
  digest: {
    id: 'unsubscribe-email.content.digest',
    description: 'Unsubscribe from APP digest eMails',
    defaultMessage: 'Digest eMails',
  },
  admin: {
    id: 'unsubscribe-email.content.admin',
    description: 'Unsubscribe from Admin eMails',
    defaultMessage: 'Admin generated eMails',
  },
  button: {
    id: 'unsubscribe-email.button',
    description: 'Unsubscribe button',
    defaultMessage: 'Unsubscribe me',
  },
  failure: {
    id: 'unsubscribe-email.failure',
    description: 'Failure message on unsubscribe',
    defaultMessage:
      'We are very sorry but something went wrong while updating your preferences.',
  },
  success: {
    id: 'unsubscribe-email.success',
    description: 'Success message on unsubscribe',
    defaultMessage: 'Thank you! We have saved your new preferences',
  },
  title: {
    id: 'unsubscribe-email.title',
    description: 'Unsubscribe TitleBar',
    defaultMessage: 'Unsubscribe from eMails',
  },
})

interface IProps {
  loggedIn?: boolean
  token: string
}

class UnsubscribeFromEmail extends React.Component<
  IProps &
    InjectedIntlProps &
    RouteComponentProps<{ token: string }> &
    IWithRequest
> {
  state = {
    adminCheckboxChecked: false,
    digestCheckboxChecked: false,
    formFailed: false,
    formSent: false,
    isLoading: false,
  }

  private renderContent = () => {
    const { formatMessage } = this.props.intl
    const {
      adminCheckboxChecked,
      digestCheckboxChecked,
      isLoading,
    } = this.state
    return (
      <View
        alignV="center"
        data-e2e="unsubscribe-email-content"
        direction="column"
        {...styles.main}
      >
        <Form onSubmit={this.handleSubmit}>
          <Text align="center" size="l">
            {formatMessage(messages.intro)}
          </Text>
          <Spacer />
          <FormCheckbox
            data-e2e="unsubscribe-email-digestCheckbox"
            name="unsubscribeDigest"
            backgroundColor="transparent"
            checked={digestCheckboxChecked}
            label={formatMessage(messages.digest)}
            labelSize="s"
            onChange={() => this.handleCheckbox('digestCheckboxChecked')}
          />
          <FormCheckbox
            data-e2e="unsubscribe-email-adminCheckbox"
            name="unsubscribeAdmin"
            backgroundColor="transparent"
            checked={adminCheckboxChecked}
            label={formatMessage(messages.admin)}
            labelSize="s"
            onChange={() => this.handleCheckbox('adminCheckboxChecked')}
          />
          <Spacer />
          <View direction="column" alignH="center" fill>
            <Button
              type="submit"
              data-e2e="unsubscribe-email-submit"
              disabled={
                isLoading || (!adminCheckboxChecked && !digestCheckboxChecked)
              }
            >
              {formatMessage(messages.button)}
            </Button>
          </View>
        </Form>
      </View>
    )
  }

  private renderSuccessContent = () => {
    const { formatMessage } = this.props.intl
    return (
      <View
        alignV="center"
        data-e2e="unsubscribe-email-success"
        direction="column"
        {...styles.main}
      >
        <Icon size={60} name="check-filled" />
        <Text size="l" align="center" {...styles.spaced}>
          {formatMessage(messages.success)}
        </Text>
      </View>
    )
  }

  private renderFailureContent = () => {
    const { formatMessage } = this.props.intl
    return (
      <View
        alignV="center"
        data-e2e="unsubscribe-email-failure"
        direction="column"
        {...styles.main}
      >
        <Icon size={60} color={ColorPalette.red} name="remove-filled" />
        <Text size="l" align="center" {...styles.spaced}>
          {formatMessage(messages.failure)}
        </Text>
      </View>
    )
  }

  private renderTitleBarLoggedOut = () => {
    const { formatMessage } = this.props.intl
    return (
      <View
        alignH="space-between"
        alignV="center"
        data-e2e="unsubscribe-email-titlebar-loggedout"
        direction="row"
        {...styles.titleBar}
      >
        <Text
          color={ColorPalette.white}
          size="l"
          strong
          {...styles.titleBarItems}
        >
          {formatMessage(messages.title)}
        </Text>
      </View>
    )
  }

  private renderTitleBarLoggedIn = () => {
    const { formatMessage } = this.props.intl
    return (
      <CustomTitleBar data-e2e="unsubscribe-email-titlebar-loggedin">
        <TitleBarLabel>{formatMessage(messages.title)}</TitleBarLabel>
      </CustomTitleBar>
    )
  }

  private handleCheckbox = (checkbox: string) => {
    this.setState({
      [checkbox]: !this.state[checkbox],
    })
  }

  private handleSubmit = async (_: unknown, data: any) => {
    this.setState({ isLoading: true })
    const { token } = this.props.match.params
    const response = await this.props.createRequest({
      method: 'POST',
      path: `/api/v1/email/unsubscribe/${token}`,
      requiresCsrf: false,
      clientID: false,
      entity: {
        unsubscribeAdmin: data.unsubscribeAdmin,
        unsubscribeDigest: data.unsubscribeDigest,
      },
    })
    if (response.status.code !== 200) {
      this.setState({ formFailed: true, isLoading: false, formSent: true })
    } else {
      this.setState({
        formFailed: false,
        isLoading: false,
        formSent: true,
      })
    }
  }

  public render() {
    const { loggedIn } = this.props
    const { formSent, formFailed } = this.state
    const Layout = loggedIn ? SimpleLayout : View
    const maybeStyles = (prop: any) => styles[loggedIn ? {} : prop]
    return loggedIn ? (
      <ResourceProvider>
        <ThemeProvider theme={{ primary: ColorPalette.lightBlueIntense }}>
          <Microapp alignH="center" alignV="center" {...maybeStyles('wrapper')}>
            <View {...styles.container(loggedIn)}>
              <Layout
                background={ColorPalette.background.light}
                {...maybeStyles('layout')}
              >
                {!loggedIn
                  ? this.renderTitleBarLoggedOut()
                  : this.renderTitleBarLoggedIn()}
                {!formSent
                  ? this.renderContent()
                  : !formFailed
                  ? this.renderSuccessContent()
                  : this.renderFailureContent()}
              </Layout>
            </View>
          </Microapp>
        </ThemeProvider>
      </ResourceProvider>
    ) : (
      <WithAppIntro>
        <ThemeProvider theme={{ primary: ColorPalette.lightBlueIntense }}>
          {!formSent
            ? this.renderContent()
            : !formFailed
            ? this.renderSuccessContent()
            : this.renderFailureContent()}
        </ThemeProvider>
      </WithAppIntro>
    )
  }
}
const mapStateToProps = ({ authentication: { loggedIn } }: IReduxState) => ({
  loggedIn,
})

export default connect(
  mapStateToProps,
  null,
)(withRequest(injectIntl(UnsubscribeFromEmail)))
