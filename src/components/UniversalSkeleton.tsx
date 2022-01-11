import React from 'react'
import { CustomTitleBar } from 'components/TitleBar'
import Microapp from 'components/Microapp'
import { View, Spinner } from '@allthings/elements'
import { useTheme } from '@allthings/elements/Theme'

const UniversalSkeleton = ({
  pastDelay = false,
  showTitle = true,
}: {
  pastDelay?: boolean
  showTitle?: boolean
}) => {
  const { theme } = useTheme()
  if (pastDelay) {
    return (
      <Microapp>
        {showTitle && <CustomTitleBar color="grey" />}
        <View
          direction="column"
          alignV="center"
          alignH="start"
          flex="flex"
          style={{
            background: theme.background,
            height: '100%',
            paddingTop: 10,
          }}
        >
          <Spinner />
        </View>
      </Microapp>
    )
  } else {
    return (
      <Microapp>
        {showTitle && <CustomTitleBar color="grey" />}
        <View
          direction="column"
          flex="flex"
          style={{
            background: theme.background,
            height: '100%',
          }}
        />
      </Microapp>
    )
  }
}

export default UniversalSkeleton
