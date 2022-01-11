import React from 'react'
import { ColorPalette, alpha } from '@allthings/colors'
import SocialFacebookIcon from '@allthings/react-ionicons/lib/SocialFacebookIcon'
import SocialGoogleIcon from '@allthings/react-ionicons/lib/SocialGoogleIcon'

interface IProps {
  type: string
}

function OAuthButtonIcon(props: IProps) {
  const svgStyles = { fill: ColorPalette.white, width: 16, height: 16 }
  return (
    <em
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        paddingTop: '13px',
        width: '30px',
        height: '100%',
        backgroundColor: alpha(ColorPalette.white, 0.2),
      }}
    >
      {props.type === 'social-google' ? (
        <SocialGoogleIcon {...svgStyles} />
      ) : (
        <SocialFacebookIcon {...svgStyles} />
      )}
    </em>
  )
}

export default OAuthButtonIcon
