import React from 'react'
import { css } from 'glamor'
import CameraIcon from 'components/Icons/CameraIcon'
import FlexButton from 'components/FlexButton'
import { Text } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  onClick: OnClick
  text?: string
}

export default function AddImageButton({ onClick, text }: IProps) {
  return (
    <FlexButton onClick={onClick}>
      <CameraIcon
        height={17}
        width={28}
        {...css({
          fill: ColorPalette.lightGreyIntense,
          paddingRight: text ? 8 : 0,
        })}
      />
      {text && (
        <Text color="#626262" size="s" strong>
          {text}
        </Text>
      )}
    </FlexButton>
  )
}
