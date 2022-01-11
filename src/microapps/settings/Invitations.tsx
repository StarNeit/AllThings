import React from 'react'
import { connect } from 'react-redux'
import { AppTitle } from 'containers/App'
import Microapp from 'components/Microapp'
import authentication from 'store/actions/authentication'
import withRequest, { IWithRequest } from 'containers/withRequest'
import { defineMessages, injectIntl } from 'react-intl'
import validate from 'validate.js'
import { ColorPalette } from '@allthings/colors'
import {
  View,
  Button,
  Text,
  SimpleLayout,
  GroupedCardList,
} from '@allthings/elements'
import { css } from 'glamor'
import { Locale } from 'enums'

import SettingsListItem from './SettingsListItem'
import {
  InvitationItemCreatedAtMessage,
  InvitationItemExpiresAtMessage,
} from './InvitationItem'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import { push } from 'connected-react-router'

const messages = defineMessages({
  mainTitle: {
    id: 'invitations.main-title',
    description: 'Label for main title in invitations',
    defaultMessage: 'Access to flat',
  },
  code: {
    id: 'invitations.current-invitations-code',
    description: 'Label for code display',
    defaultMessage: 'Invitation code: {code}',
  },
  currentInvitationsGroupTitle: {
    id: 'invitations.current-invitations-title',
    description:
      'Title of the current invitations group in the detail view of invitations',
    defaultMessage: 'Invited to my flat',
  },
  inviteButton: {
    id: 'invitations.invite-button',
    description: 'Text of the button next to the email address field',
    defaultMessage: 'Invite',
  },
  invitationGroupTitle: {
    id: 'invitations.invitation-title',
    description:
      'Title of the invitation group in the detail view of invitations',
    defaultMessage: 'Send an invitation',
  },
  emailDefaultValue: {
    id: 'invitations.invitation-email-default-value',
    description: 'Default value for new user invitation field',
    defaultMessage: 'Enter E-mail...',
  },
  emailLabel: {
    id: 'invitations.invitation-email-label',
    description: 'Label of the email edit text',
    defaultMessage: 'Invite new user',
  },
  emailValueInvalid: {
    id: 'invitations.invitation-email-error-message',
    description: 'Error message when e-mail value is invalid',
    defaultMessage: 'Invalid e-mail address',
  },
  inviteEmailPlaceholder: {
    id: 'invitations.invitation-email-placeholder',
    description: 'Placeholder for sending an invitation to an email adress',
    defaultMessage: 'Enter E-mail here',
  },
  emailAlreadyUsed: {
    id: 'invitations.email-already-used',
    description: 'Error message when e-mail value already exists on the app',
    defaultMessage:
      'This email address is already being used or has a pending invitation',
  },
  explanation: {
    id: 'invitations.invitation-explanation',
    description: 'Explain the user what the invited person will be able to do.',
    defaultMessage:
      'The invited person will receive an email with instructions for how to register. When they accept, they will have access to the same tools and information that you have.',
  },
})

interface IInvitation {
  code: string
  email: string
  expiresAt: string
  id: string
}

type Props = ReturnType<typeof mapStateToProps>

interface IState {
  inputValue: string
  emailValidity: EnumEmailValidityState
  invitations: ReadonlyArray<IInvitation>
  locale: Locale
}

enum EnumEmailValidityState {
  alreadyInvited,
  wrongFormat,
  valid,
}

class Invitations extends React.Component<
  Props &
    DispatchProp &
    InjectedIntlProps &
    IWithRequest & { config: MicroAppProps },
  IState
> {
  state: IState = {
    locale: null,
    inputValue: '',
    emailValidity: EnumEmailValidityState.valid,
    invitations: [],
  }

  async componentDidMount() {
    await this.getInvitations()
  }

  getInvitations = async () => {
    const {
      organizationId,
      createRequest,
      userId,
      utilisationPeriodId,
    } = this.props
    const invitationsUrl = organizationId
      ? `api/v1/organizations/${organizationId}/invitations?filter[createdBy]=${userId}`
      : `api/v1/utilisation-periods/${utilisationPeriodId}/invitations`
    const {
      entity,
      status: { code: responseCode },
    } = await createRequest({
      method: 'GET',
      path: invitationsUrl,
    })
    responseCode === 200 &&
      this.setState({ invitations: entity._embedded.items })
  }

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleClickInvite()
    }
  }

  submitEmail = async (email: string) => {
    const {
      createRequest,
      dispatch,
      organizationId,
      utilisationPeriodId,
    } = this.props
    const invitationsPath = organizationId
      ? `api/v1/organizations/${organizationId}/invitations`
      : `api/v1/utilisation-periods/${utilisationPeriodId}/invitations`
    const {
      status: { code: responseCode },
    } = await createRequest({
      method: 'POST',
      path: invitationsPath,
      entity: { recipients: [email] },
    })

    responseCode === 400
      ? this.setState({ emailValidity: EnumEmailValidityState.alreadyInvited })
      : dispatch(authentication.invite(responseCode)) &&
        this.setState({ inputValue: '' })
    this.getInvitations()
  }

  handleChange = ({
    target: { value: inputValue },
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue })
    this.validateEmail(inputValue) &&
      this.setState({ emailValidity: EnumEmailValidityState.valid })
  }

  handleClickInvite = () => {
    const isEmailValid = this.validateEmail(this.state.inputValue)
    this.setState({
      emailValidity: isEmailValid
        ? EnumEmailValidityState.valid
        : EnumEmailValidityState.wrongFormat,
    })
    isEmailValid && this.submitEmail(this.state.inputValue)
  }

  renderCreateInvitationGroup() {
    const { formatMessage } = this.props.intl
    const { emailValidity } = this.state
    const labelFor = 'emailField'
    const errorMessage =
      emailValidity === EnumEmailValidityState.wrongFormat
        ? messages.emailValueInvalid
        : messages.emailAlreadyUsed

    return (
      <GroupedCardList title={formatMessage(messages.invitationGroupTitle)}>
        <SettingsListItem labelFor={labelFor}>
          <View
            direction="column"
            alignH="space-between"
            flex={100}
            style={{ minHeight: '35px' }}
          >
            <View direction="row" flex={100}>
              <View flex="grow">
                <input
                  id={labelFor}
                  type="text"
                  placeholder={formatMessage(messages.inviteEmailPlaceholder)}
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                  {...css({
                    textOverflow: 'ellipsis',
                    fontSize: '14px !important',
                    border: 'none',
                    color: ColorPalette.text.secondary,
                    '::placeholder': {
                      color: ColorPalette.text.gray,
                    },
                  })}
                />
              </View>
              <View flex="none">
                <Button onClick={this.handleClickInvite}>
                  <Text size="m" color="contrast">
                    {formatMessage(messages.inviteButton)}
                  </Text>
                </Button>
              </View>
            </View>
            {emailValidity !== EnumEmailValidityState.valid && (
              <Text size="m" color={ColorPalette.red}>
                {formatMessage(errorMessage)}
              </Text>
            )}
          </View>
        </SettingsListItem>
      </GroupedCardList>
    )
  }

  renderCurrentInvitations() {
    const { formatMessage } = this.props.intl

    return (
      <GroupedCardList
        title={formatMessage(messages.currentInvitationsGroupTitle)}
      >
        {this.state.invitations.map(invitation => (
          <SettingsListItem
            key={invitation.id}
            title={invitation.email}
            wrap="wrap"
          >
            <View direction="column">
              <Text style={{ marginTop: '10px' }}>
                {formatMessage(messages.code, { code: invitation.code })}
              </Text>
              <InvitationItemCreatedAtMessage
                {...(invitation as any)}
                intl={this.props.intl}
              />
              <InvitationItemExpiresAtMessage {...invitation} />
            </View>
          </SettingsListItem>
        ))}
      </GroupedCardList>
    )
  }

  renderExplanation = () => (
    <View {...css({ padding: '30px' })}>
      <Text color="gray" align="center">
        {this.props.intl.formatMessage(messages.explanation)}
      </Text>
    </View>
  )

  renderContent = () => (
    <View>
      {this.renderCreateInvitationGroup()}
      {this.renderExplanation()}
      {this.state.invitations[0] && this.renderCurrentInvitations()}
    </View>
  )

  validateEmail(value: string) {
    const validateErrors = validate(
      { email: value },
      { email: { email: true } },
    )
    return !validateErrors
  }

  render() {
    const settings = this.props.config

    return (
      <Microapp>
        <AppTitle>{settings.label}</AppTitle>
        <GenericBackTitleBar
          onBack={() => this.props.dispatch(push('/settings'))}
        />
        <SimpleLayout padded="horizontal">{this.renderContent()}</SimpleLayout>
      </Microapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  invitations: state.authentication.user.invitations,
  locale: state.app.locale,
  userId: state.authentication.user.id,
  organizationId: state.authentication.user.organization
    ? state.authentication.user.organization.id
    : null,
  utilisationPeriodId: state.authentication.user.activePeriod.id,
})

export default connect(mapStateToProps)(withRequest(injectIntl(Invitations)))
