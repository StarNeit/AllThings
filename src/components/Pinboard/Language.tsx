import React from 'react'
import languages from 'languages'
import { ColorPalette } from '@allthings/colors'
import { Text } from '@allthings/elements'

export default function getNativeName(locale: string) {
  return languages.getLanguageInfo(locale.substr(0, 2)).nativeName
}

interface IProps {
  onClick: OnClick
  locale: string
  index: number
  isActive: boolean
}

export const Language = ({
  onClick,
  locale,
  index,
  isActive = false,
}: IProps) => {
  const handleClick = () => {
    onClick(locale)
  }
  return (
    <Text
      color={ColorPalette.text.secondary}
      data-e2e={`pinboard-new-post-${index}-${locale}`}
      onClick={handleClick}
      size="m"
      strong={isActive}
    >
      {getNativeName(locale)}
    </Text>
  )
}
