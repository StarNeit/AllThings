import React, { MouseEvent, ReactNode } from 'react'
import { CustomTitleBar } from 'components/TitleBar/index'
import { SquareIconButton, Text, View } from '@allthings/elements'
import { FormattedMessage } from 'react-intl'

export interface IProps {
  onBack: (event: MouseEvent) => void
  backText?: ReactNode
}

const DefaultBackText = (
  <FormattedMessage
    id="title-bar.generic-back-button"
    description="Generic title bar back button label"
    defaultMessage="Back"
  />
)

const GenericBackTitleBar = ({
  onBack,
  backText = DefaultBackText,
  ...props
}: IProps) => (
  <CustomTitleBar {...props}>
    <View
      data-e2e="back-button"
      direction="row"
      onClick={onBack}
      alignV="center"
    >
      <SquareIconButton icon="arrow-left-filled" iconSize="xs" />
      <Text weight="semi-bold">{backText}</Text>
    </View>
  </CustomTitleBar>
)

export default GenericBackTitleBar
