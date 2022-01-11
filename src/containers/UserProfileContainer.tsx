import React from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import {
  View,
  confirm as confirmWithUser,
  SimpleLayout,
  Text,
} from '@allthings/elements'
import Microapp from 'components/Microapp'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import MoreIcon from '@allthings/react-ionicons/lib/AndroidMoreVerticalIcon'
import get from 'lodash-es/get'
import DataProvider, {
  IData as IDataProviderResult,
} from 'containers/DataProvider'
import {
  Card,
  CardButton,
  CardFooter,
  CardContent,
  CardOverlayEditor,
  OverlayMenu,
} from '@allthings/elements'
import { sendSuccess } from '@allthings/elements/NotificationBubbleManager'
import UserProfileImage from 'components/UserProfileImage'
import { push, goBack } from 'connected-react-router'
import Auth from 'store/actions/authentication'
import AppActions from 'store/actions/app'
import NotFound from 'components/NetworkError/NotFound'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const styles = {
  container: css({
    padding: 20,
    position: 'relative',
  }),
  topColumn: css({
    width: '100%',
    position: 'relative',
    marginBottom: 30,
  }),
  profileImage: css({
    margin: 'auto',
  }),
  moreIcon: css({
    position: 'absolute',
    right: 0,
    top: 0,
    ':hover': {
      cursor: 'pointer',
    },
  }),
  nameContainer: css({ marginBottom: 20 }),
  nameSkeleton: css({
    height: 20,
    width: 160,
    backgroundColor: ColorPalette.whiteIntense,
  }),
  descriptionSkeleton: css({
    height: 100,
    width: 220,
    backgroundColor: ColorPalette.whiteIntense,
  }),
  emailButtonTextSkeleton: css({
    width: 60,
    height: 20,
  }),
}

const i18n = defineMessages({
  confirmHideProfileMessage: {
    id: 'user-profile.confirm-hide-profile',
    description: 'Confirmation message for hiding user profile.',
    defaultMessage:
      'Are you sure you want to hide your profile?\nNote, that you will not be found by your neighbours.',
  },
  yes: {
    id: 'user-profile.yes-hide-my-profile',
    description:
      'Yes button text for the confirmation window asking to confirm hiding their profile',
    defaultMessage: 'Yes',
  },
  hideMyProfile: {
    id: 'user-profile.hide-my-profile',
    description: 'Hide my profile text',
    defaultMessage: 'Hide my profile',
  },
  settings: {
    id: 'user-profile.settings',
    description: 'Settings text',
    defaultMessage: 'Settings',
  },
  sendEmail: {
    id: 'user-profile.send-email',
    description: 'Send email text',
    defaultMessage: 'Send email',
  },
  sentSuccess: {
    id: 'user-profile.sent-success',
    description: 'email was sent successfully',
    defaultMessage: 'Your message has been sent',
  },
  discardMessage: {
    id: 'user-profile.discard-message',
    description: 'Discard message text',
    defaultMessage: 'Discard message?',
  },
  cancelButtonText: {
    id: 'user-profile.cancel-button-text',
    description: 'Cancel text',
    defaultMessage: 'Cancel',
  },
  sendButtonText: {
    id: 'user-profile.send-button-text',
    description: 'Send text',
    defaultMessage: 'Send',
  },
  userNotFound: {
    id: 'user-profile.user-not-found',
    description: 'Error message shown if user was not found/does not exist',
    defaultMessage: `Sorry, we couldn't find this user.`,
  },
  userNotAllowed: {
    id: 'user-profile.user-not-allowed',
    description:
      'Error message shown if current user is not allowed to see requested user profile',
    defaultMessage: `Sorry, you're not allowed to see this user.`,
  },
})

interface IProps {
  userId: string
  viewerId?: string
  navigateToSettings?: () => void
  goBack?: () => void
  onBack: () => void
  hideProfile?: () => void
  sendMailToUser?: (id: string, text: string) => void
}

class UserProfileContainer extends React.Component<IProps & InjectedIntlProps> {
  state = {
    showMenu: false,
    showMailForm: false,
  }

  showMenu = () => this.setState({ showMenu: true })
  hideMenu = () => this.setState({ showMenu: false })

  showMailForm = () => this.setState({ showMailForm: true })
  hideMailForm = () => this.setState({ showMailForm: false })

  sendMail = (id: string, text: string) => {
    if (!text) {
      return
    }
    this.props.sendMailToUser(id, text)
    this.hideMailForm()
    sendSuccess(this.props.intl.formatMessage(i18n.sentSuccess))
  }

  goBack = () => this.props.goBack()

  renderLoading() {
    return (
      <HorizontalRouterMicroapp>
        <GenericBackTitleBar onBack={this.goBack} />
        <SimpleLayout padded="horizontal">
          <Card direction="column">
            <CardContent alignV="center" direction="column">
              <View
                direction="row"
                alignH="space-between"
                {...styles.topColumn}
              >
                <UserProfileImage
                  {...styles.profileImage}
                  size="l"
                  loading={true}
                />
              </View>
              <View {...styles.nameContainer}>
                <View {...styles.nameSkeleton} />
              </View>
              <View {...styles.descriptionSkeleton} />
            </CardContent>
            <CardFooter>
              <CardButton>
                <View {...styles.emailButtonTextSkeleton} />
              </CardButton>
            </CardFooter>
          </Card>
        </SimpleLayout>
      </HorizontalRouterMicroapp>
    )
  }

  handleHideProfileClick = async () => {
    const { formatMessage } = this.props.intl
    const customization = {
      acceptButtonLabel: formatMessage(i18n.yes),
      cancelButtonLabel: formatMessage(i18n.cancelButtonText),
      message: formatMessage(i18n.confirmHideProfileMessage),
      'data-e2e': 'confirm-hide-profile-dialog',
    }
    const userIsCertain = await confirmWithUser(customization)

    if (userIsCertain) {
      this.props.hideProfile()
    }
    this.setState({ showMenu: false })
  }

  // could be separate component: UserProfile
  renderProfile(result: IDataProviderResult['result']) {
    const profile = result.entity
    const isProfileOwner = profile.id === this.props.viewerId
    const isProfilePublic = profile.publicProfile
    const {
      intl: { formatMessage },
    } = this.props
    const street = get(profile, 'unit._embedded.address.street', '')

    return (
      <Microapp>
        <GenericBackTitleBar onBack={this.goBack} />
        <SimpleLayout padded="horizontal">
          <Card direction="column">
            <CardContent alignV="center" direction="column">
              <View
                direction="row"
                alignH="space-between"
                {...styles.topColumn}
              >
                <UserProfileImage
                  {...styles.profileImage}
                  size="l"
                  profileImage={profile._embedded.profileImage}
                  data-e2e="pinboard-profile-avatar"
                />
                {isProfileOwner && (
                  <MoreIcon
                    onClick={this.showMenu}
                    {...styles.moreIcon}
                    height={20}
                    width={20}
                    data-e2e="user-profile-settings-more-icon"
                  />
                )}
                {this.state.showMenu && (
                  <OverlayMenu onRequestClose={this.hideMenu}>
                    {isProfileOwner && isProfilePublic && (
                      <Text
                        size="m"
                        onClick={this.handleHideProfileClick}
                        color={ColorPalette.text.secondary}
                        data-e2e="user-profile-settings-hide-profile"
                      >
                        {formatMessage(i18n.hideMyProfile)}
                      </Text>
                    )}
                    <Text
                      size="m"
                      onClick={this.props.navigateToSettings}
                      color={ColorPalette.text.secondary}
                      data-e2e="user-profile-settings-settings"
                    >
                      {formatMessage(i18n.settings)}
                    </Text>
                  </OverlayMenu>
                )}
              </View>
              <View {...styles.nameContainer}>
                <Text
                  size="giant"
                  strong
                  align="center"
                  data-e2e="pinboard-profile-username"
                  color={ColorPalette.text.primary}
                  {...css({ maxWidth: 220 })}
                >
                  {profile.username}
                </Text>
                {street && (
                  <Text
                    size="l"
                    color={ColorPalette.text.secondary}
                    align="center"
                  >
                    {street && street}
                  </Text>
                )}
              </View>
              {profile.description && (
                <Text
                  size="s"
                  color={ColorPalette.text.secondary}
                  autoBreak
                  italic
                  align="center"
                  {...css({ maxWidth: 220 })}
                >
                  {profile.description}
                </Text>
              )}

              {this.state.showMailForm && (
                <View>
                  <CardOverlayEditor
                    onSave={(text: string) => this.sendMail(profile.id, text)}
                    onRequestClose={this.hideMailForm}
                    confirmText={formatMessage(i18n.discardMessage)}
                    cancelText={formatMessage(i18n.cancelButtonText)}
                    submitText={formatMessage(i18n.sendButtonText)}
                  />
                </View>
              )}
            </CardContent>
            {isProfilePublic && !isProfileOwner && (
              <CardFooter>
                <CardButton
                  onClick={this.showMailForm}
                  data-e2e="user-profile-send-email-button"
                >
                  <Text size="m" color={ColorPalette.text.secondary} strong>
                    {formatMessage(i18n.sendEmail)}
                  </Text>
                </CardButton>
              </CardFooter>
            )}
          </Card>
        </SimpleLayout>
      </Microapp>
    )
  }

  renderError = (errorCode: number) => (
    <Microapp>
      <GenericBackTitleBar onBack={this.goBack} />
      <SimpleLayout padded="horizontal">
        <View
          style={{ margin: 20 }}
          alignH="center"
          alignV="center"
          direction="column"
          data-e2e="user-error-page"
        >
          <NotFound />
          <Text style={{ margin: 20 }}>
            {this.props.intl.formatMessage(
              errorCode === 403 ? i18n.userNotAllowed : i18n.userNotFound,
            )}
          </Text>
        </View>
      </SimpleLayout>
    </Microapp>
  )

  render() {
    return (
      <DataProvider
        request={{
          method: 'GET',
          path: `api/v1/users/${this.props.userId}`,
        }}
      >
        {({ isDone, result }: IDataProviderResult) =>
          isDone
            ? result.status.code === 200
              ? this.renderProfile(result)
              : this.renderError(result.status.code)
            : this.renderLoading()
        }
      </DataProvider>
    )
  }
}

export default connect(
  (state: IReduxState, props: IProps) => ({
    viewerId: state.authentication.user.id,
    userId: props.userId || (get(props, 'match.params.id') as string),
  }),
  (dispatch: FunctionalDispatch, props) => ({
    navigateToSettings: () => dispatch(push('/settings')),
    hideProfile: async () => {
      await dispatch(Auth.changeDetails({ publicProfile: false }))
      dispatch(push('/who-is-who'))
    },
    goBack: () => (props.onBack ? props.onBack() : dispatch(goBack())),
    sendMailToUser: (userId: string, content: string) =>
      dispatch(AppActions.sendMailToUser(userId, content)),
  }),
)(injectIntl(UserProfileContainer))
