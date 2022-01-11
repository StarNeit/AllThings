import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import CameraIcon from '@allthings/react-ionicons/lib/CameraIcon'
import get from 'lodash-es/get'
import { ProfileImage } from '@allthings/elements'

interface IProfileImageProps {
  _embedded: {
    files: IFiles
  }
}

export interface IFiles {
  big: object
  medium: object
  small: object
}

interface IProps {
  children?: React.ReactNodeArray
  editable?: boolean
  handleClick?: OnClick
  onClick?: OnClick
  profileImage?: IProfileImageProps
  // @TODO: should be coming from Elements as TS.
  size: 'xs' | 's' | 'm' | 'l'
  style?: object
  loading?: boolean
}

export default class UserProfileImage extends React.Component<IProps> {
  componentDidMount() {
    // tslint:disable:no-console
    this.props.handleClick &&
      console.warn(
        `handleClick prop in UserProfileImage is deprecated. Use onClick.`,
      )
    // tslint:enable:no-console
  }

  renderEditable = () => (
    <button className="profileImage-button">
      <i className="profileImage-button-icon">
        <CameraIcon
          style={{
            fill: ColorPalette.lightGreyIntense,
            width: 25,
            height: 25,
          }}
        />
      </i>
      <span className="profileImage-button-label">
        <FormattedMessage
          id="profile-image-editable"
          description="The label of the button for the editable profile image"
          defaultMessage="Change image"
        />
      </span>
    </button>
  )

  render() {
    const {
      profileImage,
      handleClick,
      onClick,
      editable,
      loading,
      ...rest
    } = this.props
    const userImage = loading
      ? ''
      : get(profileImage, '_embedded.files.medium.url')

    return (
      <ProfileImage
        image={userImage}
        onClick={onClick || handleClick}
        {...rest}
      >
        {editable && this.renderEditable()}
      </ProfileImage>
    )
  }
}
