import { ColorPalette } from '@allthings/colors'
import { Button, SquareIconButton, Text, View } from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'
import ScalableTextContainer from 'components/ScalableTextContainer'
import { css } from 'glamor'
import React, { ReactNode } from 'react'

export interface IBigTitleBarProps {
  title: ReactNode
  subTitle?: ReactNode
  buttonText?: ReactNode
  onButtonClick?: () => void
  isTwoColumnLayout?: boolean
  showBackButton?: boolean
  onBackButtonClick?: () => void
}

const titleStyle = css({
  fontSize: 42,
  fontWeight: 'bold',
  lineHeight: '1em',
  marginBottom: 7,
  letterSpacing: -2,
  wordWrap: 'break-word',
})

const BigTitleBar = ({
  title,
  buttonText,
  onButtonClick,
  subTitle,
  isTwoColumnLayout = false,
  showBackButton = false,
  onBackButtonClick,
  ...props
}: IBigTitleBarProps) => (
  <View direction="row" {...props}>
    {showBackButton && (
      <SquareIconButton
        icon="arrow-left-filled"
        iconSize="s"
        onClick={onBackButtonClick}
        {...css({
          paddingTop: 20,
          paddingLeft: 10,
          marginRight: -3,
          transform: 'translateY(13px)',
        })}
      />
    )}
    <View
      flex="grow"
      {...css({
        minWidth: 0,
        width: '100%',
        padding: '20px 15px 0px',
        [createMQ('desktop', 'tablet')]: !isTwoColumnLayout && {
          padding: '20px 0 0 0',
        },
      })}
    >
      <View {...titleStyle}>
        <ScalableTextContainer>{title}</ScalableTextContainer>
      </View>
      {subTitle && (
        <Text color={ColorPalette.grey}>
          <ScalableTextContainer>{subTitle}</ScalableTextContainer>
        </Text>
      )}
    </View>
    {buttonText && (
      <View {...css({ float: 'right', margin: '20px 15px 0px' })}>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </View>
    )}
  </View>
)

export default BigTitleBar
