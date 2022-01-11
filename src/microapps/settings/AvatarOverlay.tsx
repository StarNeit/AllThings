import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { FormattedMessage } from 'react-intl'
import ProfileImageEditor from 'components/ProfileImageEditor'
import { connect } from 'react-redux'
import authentication from 'store/actions/authentication'
import get from 'lodash-es/get'
import { ColorPalette } from '@allthings/colors'
import {
  Button,
  FloatingButton,
  Inset,
  SquareIconButton,
  Text,
  View,
} from '@allthings/elements'
import { css } from 'glamor'
import { Gateway } from 'react-gateway'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import { CustomTitleBar } from 'components/TitleBar'
import { FileWithPreview } from 'utils/filePreviews'

interface IProps {
  profileImage?: FileWithPreview
  readonly theme: any
  onRequestClose: () => void
}

class AvatarOverlay extends React.Component<IProps & DispatchProp> {
  avatarEditor: AvatarEditor = null

  setAvatarEditor = (avatarEditor: AvatarEditor) =>
    (this.avatarEditor = avatarEditor)

  updateAvatar = (blob: Blob, name: string) => {
    this.props.dispatch(authentication.updateAvatar(blob, name))
    this.props.onRequestClose()
  }

  saveImage = () => {
    this.avatarEditor && (this.avatarEditor.getImage as any)(this.updateAvatar)
  }

  render() {
    return (
      <Gateway into="root">
        <Overlay
          theme={{ primary: this.props.theme }}
          direction="row"
          alignH="center"
          alignV="stretch"
          onBackgroundClick={this.props.onRequestClose}
        >
          <OverlayWindow
            {...css({
              background: ColorPalette.whiteIntense,
            })}
          >
            <CustomTitleBar alignH="space-between">
              <Inset horizontal data-e2e="cancel-overlay-title">
                <Text strong>
                  <FormattedMessage
                    id="profile-image-overlay.title"
                    description="The title of the profile image overlay"
                    defaultMessage="Profile image"
                  />
                </Text>
              </Inset>
              <SquareIconButton
                icon="remove-light-filled"
                iconSize="xs"
                data-e2e="cancel-overlay"
                onClick={this.props.onRequestClose}
              />
            </CustomTitleBar>
            <View
              {...css({
                padding: '20px 0 30px',
              })}
            >
              <Text size="giant" align="center">
                <FormattedMessage
                  id="profile-image.title"
                  description="The title of the profile image overlay"
                  defaultMessage="Show your face!"
                />
              </Text>
              <Text align="center" color={ColorPalette.grey}>
                <FormattedMessage
                  id="profile-image.text"
                  description="The text of the profile image overlay"
                  defaultMessage="Upload a profile picture to personalize your profile"
                />
              </Text>
              <ProfileImageEditor
                ref={this.setAvatarEditor as any}
                profileImage={this.props.profileImage}
              >
                {openFileDialog => (
                  <Button
                    backgroundColor={ColorPalette.grey}
                    onClick={openFileDialog}
                  >
                    <FormattedMessage
                      defaultMessage="Choose image"
                      description="The label of the button that let the user choose a new image"
                      id="profile-image.choose-image"
                    />
                  </Button>
                )}
              </ProfileImageEditor>
            </View>
            <FloatingButton
              onClick={this.saveImage}
              {...css({ backgroundColor: ColorPalette.grey })}
            >
              <Text strong color="white">
                <FormattedMessage
                  id="profile-image.save"
                  description="The save button label of the profile image overlay"
                  defaultMessage="Save"
                />
              </Text>
            </FloatingButton>
          </OverlayWindow>
        </Overlay>
      </Gateway>
    )
  }
}

export default connect((state: IReduxState) => ({
  profileImage: get(
    state.authentication.user,
    'profileImage._embedded.files.original.url',
  ),
  theme: state.theme.microApps.settings,
}))(AvatarOverlay)
