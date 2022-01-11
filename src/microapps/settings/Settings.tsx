import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { ColorPalette } from '@allthings/colors'
import { defineMessages, injectIntl } from 'react-intl'
import validate from 'validate.js'
import Microapp from 'components/Microapp'
import UserProfileImage from 'components/UserProfileImage'
import SettingsListItem from './SettingsListItem'
import TextInput from 'components/TextInput'
import { AppTitle } from 'containers/App'
import CheckmarkIcon from '@allthings/react-ionicons/lib/CheckmarkIcon'
import sendNativeEvent from 'utils/sendNativeEvent'
import {
  ExpandingTextarea,
  GroupedCardList,
  SimpleLayout,
  SwitchList,
  Icon,
  Text,
  View,
  Spacer,
} from '@allthings/elements'
import authentication from 'store/actions/authentication'
import { css, keyframes } from 'glamor'
import DeleteAccountOverlay from './DeleteAccountOverlay'
import OverlayToggle from 'components/OverlayToggle'
import AvatarOverlay from './AvatarOverlay'
import ChangePasswordOverlay from './ChangePasswordOverlay'
import { Locale, MicroApps } from 'enums'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'

const MAX_DESC_CHARS = 500 // chars

const MAX_EMAIL_LENGTH = 70 // chars

const MAX_USERNAME_LENGTH = 70 // chars

const TICK_DISPLAY_TIMEOUT = 2000 // ms

const styles = {
  expTextarea: css({
    color: ColorPalette.text.secondary,
    fontSize: '14px',
    fontFamily: '"Open Sans"',
    padding: 0,
    '::placeholder': {
      color: ColorPalette.text.gray,
    },
  }),
  listItem: css({
    cursor: 'pointer',
  }),
}

const scaleoutAnim = keyframes('scaleout', {
  '0%': { transform: 'scale(0)' },
  '100%': { transform: 'scale(1)', opacity: 0 },
})

interface IScaleoutProps {
  size?: number
  color?: string
}

const Scaleout = ({ size = 40, color = '#333' }: IScaleoutProps) => (
  <View
    {...css({
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      animation: `${scaleoutAnim} 1.0s infinite ease-in-out`,
    })}
  />
)

const messages = defineMessages({
  accountGroupTitle: {
    id: 'settings.account-profile-title',
    description: 'Title of the account and profile settings group',
    defaultMessage: 'Account and Profile',
  },
  invitationGroupTitle: {
    id: 'settings.invitation-title',
    description: 'Title of the invitation settings group',
    defaultMessage: 'Invitations to flat',
  },
  logout: {
    id: 'settings.logout',
    description: 'The label of the logout button',
    defaultMessage: 'Logout',
  },
  profilepicLabel: {
    id: 'settings.account-profile-profilepic-label',
    description: 'Label of the profilepic setting item',
    defaultMessage: 'Profile picture',
  },
  usernameLabel: {
    id: 'settings.account-profile-username-label',
    description: 'Label of the username setting editext',
    defaultMessage: 'Name',
  },
  usernamePlaceholderLabel: {
    id: 'settings.account-profile-username-placeholder-label',
    description: 'In case name is not filled, message is shown',
    defaultMessage: 'Your Name here',
  },
  usernameValueInvalid: {
    id: 'settings.account-profile-username-error-message',
    description: 'Error message when username value is invalid',
    defaultMessage: 'Invalid username',
  },
  emailLabel: {
    id: 'settings.account-profile-email-label',
    description: 'Label of the email setting editext',
    defaultMessage: 'E-Mail',
  },
  emailPlaceholderLabel: {
    id: 'settings.account-profile-email-placeholder-label',
    description: 'In case the email is not filled, message is shown',
    defaultMessage: 'your@email',
  },
  emailValueInvalid: {
    id: 'settings.account-profile-email-error-message',
    description: 'Error message when e-mail value is invalid',
    defaultMessage: 'Invalid e-mail address',
  },
  profiletextLabel: {
    id: 'settings.account-profile-profiletext-label',
    description: 'Label of the profile text setting editext',
    defaultMessage: 'Profile text',
  },
  profiletextPlaceholder: {
    id: 'settings.account-profile-profiletext-placeholder',
    description: 'Placeholder of the profile text',
    defaultMessage: 'Tell us something about yourself...',
  },
  emailGroupTitle: {
    id: 'settings.email-title',
    description: 'Title of the email settings group',
    defaultMessage: 'E-Mail Settings',
  },
  phoneNumberPlaceholderLabel: {
    id: 'settings.telephone-placeholder-label',
    description: 'in case telephone number is not filled, message is shown',
    defaultMessage: 'your phone',
  },
  notificationLabel: {
    id: 'settings.email-notification-label',
    description: 'Label of the notifications setting item',
    defaultMessage: 'Notifications',
  },
  summaryLabel: {
    id: 'settings.email-summary-label',
    description: 'Label of the notifications summary setting item',
    defaultMessage: 'Summary',
  },
  summaryInfoLabel: {
    id: 'settings.summary-info',
    description: 'The text to describe the notifications',
    defaultMessage:
      'We will send you summary, containing everything that happend on the platorm',
  },
  languageLabel: {
    id: 'settings.email-language-label',
    description: 'Label of the language setting item',
    defaultMessage: 'Language',
  },
  passwordTitle: {
    id: 'settings.password-change-title',
    description: 'Change password title',
    defaultMessage: 'Password',
  },
  phoneNumberLabel: {
    id: 'settings.phone-number-label',
    description: 'Label of the phone number setting item',
    defaultMessage: 'Phone number',
  },
  invitationLabel: {
    id: 'settings.invitation-label',
    description: 'Label of the invitation setting item',
    defaultMessage: 'Invitations to flat',
  },
  otherSettingsTitle: {
    id: 'settings.other-settings-title',
    description: 'title of the other settings group',
    defaultMessage: 'Other Settings',
  },
  dailyNotification: {
    id: 'settings.daily-notification-label',
    description: 'label on the switchlist',
    defaultMessage: 'daily',
  },
  weeklyNotification: {
    id: 'settings.weekly-notification-label',
    description: 'label on switchlist',
    defaultMessage: 'weekly',
  },
  neverNotification: {
    id: 'settings.never-notification-label',
    description: 'label on switchlist',
    defaultMessage: 'never',
  },
  enterEmailErrMsg: {
    id: 'settings.enter-email-err-msg',
    description: 'user forgets to enter email',
    defaultMessage: 'Please enter your email address',
  },
  invalidEmailErrMsg: {
    id: 'settings.invalid-email-err-msg',
    description: 'invalid email entered',
    defaultMessage: 'Invalid e-mail',
  },
  emailCharExceedErrMsg: {
    id: 'settings.email-char-exceed-err-msg',
    description: 'too long email entered',
    defaultMessage: `Cannot exceed {maxEmailLength} characters`,
  },
  pickUsernameErrMsg: {
    id: 'settings.pick-username-err-msg',
    description: 'user didnt enter username',
    defaultMessage: 'Please pick a username',
  },
  usernameCharExceedErrMsg: {
    id: 'settings.username-char-exceed-err-msg',
    description: 'too long username entered',
    defaultMessage: 'Cannot exceed {MAX_USERNAME_LENGTH} characters',
  },
  privacySettingsTitle: {
    id: 'settings.privacy-settings-title',
    description: 'title of the privacy settings area',
    defaultMessage: 'Privacy Settings',
  },
  mutedPinboardUsers: {
    id: 'settings.muted-pinboard-users',
    description: 'Muted Pinboard Users',
    defaultMessage: 'Muted Pinboard Users',
  },
  authorizedClients: {
    id: 'settings.authorized-clients',
    description: 'Authorized clients',
    defaultMessage: 'Authorized clients',
  },
  deleteAccount: {
    id: 'settings.delete-account',
    description: 'Delete my account',
    defaultMessage: 'Delete my account',
  },
  emailAlreadyUsed: {
    id: 'settings.email-already-used',
    description: 'Email already used',
    defaultMessage: 'Email already used',
  },
  userReadOnly: {
    id: 'settings.user-read-only',
    description: 'User is read only',
    defaultMessage:
      'This email address was imported from another system and therefore cannot be changed',
  },
})

const localeLabels = {
  de_DE: 'Deutsch',
  en_US: 'English',
  fr_FR: 'Français',
  it_IT: 'Italiano',
  nl_NL: 'Nederlands',
  pt_PT: 'Português',
}

type SettingsProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    config: MicroAppProps
  }

interface IState {
  deleteAccount: boolean
  description: string
  descriptionTick: boolean
  emailTick: boolean
  phoneNumber: string
  phoneNumberTick: boolean
  showCharsLeft: boolean
  usernameTick: boolean
}

class Settings extends React.Component<
  SettingsProps & InjectedIntlProps,
  IState
> {
  static defaultProps = {
    availableLocales: [Locale.de_DE, Locale.en_US, Locale.fr_FR],
  }

  state = {
    deleteAccount: false,
    description: this.props.user.description || '',
    descriptionTick: false,
    emailTick: false,
    phoneNumber: this.props.user.phoneNumber,
    phoneNumberTick: false,
    showCharsLeft: false,
    usernameTick: false,
  }

  timeout: NodeJS.Timeout = null

  componentDidUpdate(prevProps: SettingsProps) {
    const {
      description: prevDescription,
      email: prevEmail,
      phoneNumber: prevPhoneNumber,
      profileImage: prevProfileImage,
      username: prevUsername,
    } = prevProps.fieldStatuses
    const {
      description,
      email,
      profileImage,
      phoneNumber,
      username,
    } = this.props.fieldStatuses
    const setAndTick = (field: string) => {
      const fieldTick = `${field}Tick`

      this.setState({ [fieldTick]: true } as any, () =>
        setTimeout(
          () => this.setState({ [fieldTick]: false } as any),
          TICK_DISPLAY_TIMEOUT,
        ),
      )
    }

    if (prevDescription === 'pending' && description === 'ok') {
      setAndTick('description')
    }

    if (prevEmail === 'pending' && email === 'ok') {
      setAndTick('email')
    }

    if (prevPhoneNumber === 'pending' && phoneNumber === 'ok') {
      setAndTick('phoneNumber')
    }

    if (prevProfileImage === 'pending' && profileImage === 'ok') {
      setAndTick('profileImage')
    }

    if (prevUsername === 'pending' && username === 'ok') {
      setAndTick('username')
    }
  }

  fieldStatus = (fieldName: string) =>
    this.props.fieldStatuses && this.props.fieldStatuses[fieldName]

  handleChange = (key: string, value: string) =>
    this.props.fieldStatuses[key] !== 'pending' &&
    (this.props.user[key] !== value ||
      this.props.fieldStatuses[key] === 'error') &&
    this.props.updateUser({ [key]: value })

  handleNameChange = (value: string) => this.handleChange('username', value)

  handleEmailChange = (value: string) => this.handleChange('email', value)

  handlePhoneNumberChange = (value: string) =>
    this.handleChange('phoneNumber', value)

  // This breaks the pattern because textarea must be controlled from parent.
  handleDescriptionSubmit = () => {
    this.setState({ showCharsLeft: false })
    this.handleChange('description', this.state.description)
  }

  handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    clearTimeout(this.timeout)
    if (e.target.value.length > MAX_DESC_CHARS) {
      this.setState({ showCharsLeft: true })
    } else {
      this.setState({ description: e.target.value, showCharsLeft: true })
      this.timeout = setTimeout(this.noShowChars, 2000)
    }
  }

  handleActiveSummaryChange = (setting: 'daily' | 'weekly' | 'off') =>
    this.props.changeNotification(setting)

  handleActiveLocaleChange = (locale: string) => {
    this.handleChange('locale', locale)
    sendNativeEvent(this.props.accessToken, {
      name: 'locale-change',
      data: locale,
    })
  }

  languageOptions = () =>
    this.props.availableLocales.reduce(
      (s, l) => ({ ...s, [l]: localeLabels[l] || l }),
      {},
    )

  noShowChars = () => {
    this.setState({ showCharsLeft: false })
  }

  validateEmail = (value: string) => {
    const { formatMessage } = this.props.intl

    return validate(
      { email: value },
      {
        email: {
          presence: {
            message: formatMessage(messages.enterEmailErrMsg),
          },
          email: {
            message: formatMessage(messages.invalidEmailErrMsg),
          },
          length: {
            maximum: MAX_EMAIL_LENGTH,
            message: formatMessage(messages.emailCharExceedErrMsg, {
              maxEmailLength: MAX_EMAIL_LENGTH,
            }),
          },
        },
      },
    )
  }

  validateUsername = (value: string) => {
    const { formatMessage } = this.props.intl

    return validate(
      { username: value },
      {
        username: {
          presence: { message: formatMessage(messages.pickUsernameErrMsg) },
          length: {
            maximum: MAX_USERNAME_LENGTH,
            message: formatMessage(messages.usernameCharExceedErrMsg, {
              MAX_USERNAME_LENGTH,
            }),
          },
        },
      },
    )
  }

  renderContent = () => {
    const {
      embeddedLayout,
      goTo,
      handleClickLogout,
      intl: { formatMessage },
      user: { username, profileImage, email, company },
      fieldStatuses,
      errors,
    } = this.props
    const {
      description,
      descriptionTick,
      emailTick,
      phoneNumber,
      phoneNumberTick,
      deleteAccount,
      showCharsLeft,
    } = this.state
    return (
      <View>
        {deleteAccount && this.renderDeleteAccount()}
        <GroupedCardList title={formatMessage(messages.accountGroupTitle)}>
          <OverlayToggle overlay={AvatarOverlay} hashName="avatar">
            {({ open }) => (
              <SettingsListItem
                title={formatMessage(messages.profilepicLabel)}
                onClick={open}
              >
                {fieldStatuses.profileImageUpload === 'pending' ? (
                  <Scaleout size={40} />
                ) : (
                  <UserProfileImage
                    profileImage={profileImage}
                    size="m"
                    style={{ cursor: 'pointer', flexShrink: 0 }}
                  />
                )}
              </SettingsListItem>
            )}
          </OverlayToggle>
          <SettingsListItem title={formatMessage(messages.usernameLabel)}>
            <TextInput
              onBlur={this.handleNameChange}
              placeholder={formatMessage(messages.usernamePlaceholderLabel)}
              initialValue={username}
              data-e2e="settings-input-username"
              validateField={this.validateUsername}
              flex="grow"
            />
            {this.state.usernameTick && this.renderTick()}
          </SettingsListItem>
          <SettingsListItem title={formatMessage(messages.emailLabel)}>
            <View direction="row" alignV="end" flex={'auto'}>
              <TextInput
                onBlur={this.handleEmailChange}
                placeholder={formatMessage(messages.emailPlaceholderLabel)}
                initialValue={email}
                validateField={this.validateEmail}
                type="email"
                flex="grow"
              />
              {this.fieldStatus('email') === 'error' && (
                <Text size="m" color={ColorPalette.red} align="right">
                  {formatMessage(
                    errors?.email?.[0]?.includes('readOnly')
                      ? messages.userReadOnly
                      : messages.emailAlreadyUsed,
                  )}
                </Text>
              )}
            </View>
            {emailTick && this.renderTick()}
          </SettingsListItem>
          <SettingsListItem title={formatMessage(messages.phoneNumberLabel)}>
            <TextInput
              placeholder={formatMessage(messages.phoneNumberPlaceholderLabel)}
              initialValue={phoneNumber}
              data-e2e="settings-input-phonenumber"
              onBlur={this.handlePhoneNumberChange}
            />
            {phoneNumberTick && this.renderTick()}
          </SettingsListItem>
          <SettingsListItem
            title={formatMessage(messages.languageLabel)}
            alignTitle="top"
          >
            {this.renderLanguageSwitchList()}
          </SettingsListItem>
          <SettingsListItem
            title={formatMessage(messages.summaryLabel)}
            description={formatMessage(messages.summaryInfoLabel)}
            alignTitle="top"
          >
            {this.renderSummaryList({ formatMessage })}
          </SettingsListItem>
        </GroupedCardList>
        <GroupedCardList title={formatMessage(messages.profiletextLabel)}>
          <View direction="row">
            <ExpandingTextarea
              placeholder={formatMessage(messages.profiletextPlaceholder)}
              value={description}
              onChange={this.handleDescriptionChange}
              onBlur={this.handleDescriptionSubmit}
              containerStyle={{ padding: 14 }}
              {...styles.expTextarea}
            />
            {descriptionTick &&
              this.renderTick({}, { paddingTop: 16, paddingRight: 16 })}
            {showCharsLeft &&
              this.renderCharsLeft(MAX_DESC_CHARS - description.length)}
          </View>
        </GroupedCardList>

        <GroupedCardList title={formatMessage(messages.privacySettingsTitle)}>
          <SettingsListItem
            title={formatMessage(messages.mutedPinboardUsers)}
            onClick={goTo('muted-users')}
            {...styles.listItem}
          >
            <Icon name="arrow-right-filled" size="xs" />
          </SettingsListItem>
          <SettingsListItem
            data-e2e="authorized-clients"
            title={formatMessage(messages.authorizedClients)}
            onClick={goTo('authorized-clients')}
            {...styles.listItem}
          >
            <Icon name="arrow-right-filled" size="xs" />
          </SettingsListItem>
        </GroupedCardList>

        <GroupedCardList title={formatMessage(messages.otherSettingsTitle)}>
          <OverlayToggle overlay={ChangePasswordOverlay} hashName="password">
            {({ open }) => (
              <SettingsListItem
                title={formatMessage(messages.passwordTitle)}
                onClick={open}
                {...styles.listItem}
              >
                <Icon name="arrow-right-filled" size="xs" />
              </SettingsListItem>
            )}
          </OverlayToggle>
          {this.props.allowTenantInvites && (
            <SettingsListItem
              title={formatMessage(messages.invitationLabel)}
              onClick={goTo('invitations')}
              {...styles.listItem}
            >
              <Icon name="arrow-right-filled" size="xs" />
            </SettingsListItem>
          )}
          {!embeddedLayout && (
            <SettingsListItem
              title={formatMessage(messages.logout)}
              data-e2e="logout-button"
              onClick={handleClickLogout}
              {...styles.listItem}
            >
              <Icon name="arrow-right-filled" size="xs" />
            </SettingsListItem>
          )}
        </GroupedCardList>

        {!company && (
          <GroupedCardList title="">
            <SettingsListItem
              title={formatMessage(messages.deleteAccount)}
              data-e2e="delete-account-button"
              onClick={this.openDeleteAccount}
              {...styles.listItem}
            />
          </GroupedCardList>
        )}
        <Spacer height={10} />
      </View>
    )
  }

  openDeleteAccount = () => this.setState({ deleteAccount: true })

  closeDeleteAccount = () => this.setState({ deleteAccount: false })

  renderDeleteAccount = () => (
    <DeleteAccountOverlay
      onClose={this.closeDeleteAccount}
      email={this.props.user.email}
    />
  )

  renderSummaryList = ({ formatMessage }: Partial<InjectedIntl>) => (
    <View direction="row">
      <SwitchList
        disabled={this.fieldStatus('notificationSettings') === 'pending'}
        onChange={this.handleActiveSummaryChange}
        options={{
          daily: formatMessage(messages.dailyNotification),
          weekly: formatMessage(messages.weeklyNotification),
          never: formatMessage(messages.neverNotification),
        }}
        initialActive={this.props.user.notificationSettings['app-digest-email']}
        showSpinner={this.fieldStatus('notificationSettings') === 'pending'}
      />
    </View>
  )

  renderLanguageSwitchList = () => (
    <View direction="row">
      <SwitchList
        data-e2e={`settings-active-locale-${this.props.user.locale}`}
        disabled={this.fieldStatus('locale') === 'pending'}
        onChange={this.handleActiveLocaleChange}
        options={this.languageOptions()}
        initialActive={this.props.user.locale}
        showSpinner={this.fieldStatus('locale') === 'pending'}
      />
    </View>
  )

  renderCharsLeft = (charsLeft: number) => (
    <View
      direction="column"
      {...css({
        marginTop: 15,
        marginRight: 15,
        color: ColorPalette.text.gray,
      })}
    >
      {charsLeft}
    </View>
  )

  renderTick = (checkmarkStyle = {}, containerStyle = {}) => (
    <View
      data-e2e="settings-checkmark"
      style={{ display: 'inline', paddingTop: 2, ...containerStyle }}
    >
      <CheckmarkIcon
        {...css({
          fill: ColorPalette.state.success,
          width: 15,
          height: 15,
          marginLeft: 6,
          ...checkmarkStyle,
        })}
      />
    </View>
  )

  render() {
    const {
      config: { label },
    } = this.props
    return (
      <Microapp>
        <AppTitle>{label}</AppTitle>
        <SimpleLayout padded="horizontal">
          <MicroappBigTitleBar type={MicroApps.SETTINGS} />
          {this.renderContent()}
        </SimpleLayout>
      </Microapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  accessToken: state.authentication.accessToken,
  allowTenantInvites: state.app.config.allowTenantInvites,
  availableLocales: state.app.config.availableLocales,
  embeddedLayout: state.app.embeddedLayout,
  errors: state.authentication.errors,
  fieldStatuses: state.authentication.fieldStatuses,
  user: state.authentication.user,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  updateUser: (prop: Partial<IUser>) =>
    dispatch(authentication.changeDetails(prop)),
  handleClickDeleteAccount: () => dispatch(authentication.deleteAccount()),
  handleClickLogout: () => dispatch(push('/logout')),
  changeNotification: (setting: 'daily' | 'weekly' | 'off') =>
    dispatch(
      authentication.changeNotificationSettings({
        summary: setting,
      }),
    ),
  goTo: (settingsPath: string) => () =>
    dispatch(push(`settings/${settingsPath}`)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(Settings))
