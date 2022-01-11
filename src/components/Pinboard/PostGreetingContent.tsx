import React from 'react'
import { css } from 'glamor'
import { View, Text } from '@allthings/elements'

const styles = {
  wrapper: css({
    // Half profile picture height + border
    marginTop: -30,
    padding: 15,
  }),
}

interface IProps {
  children: React.ReactNode
}

export default function PostGreetingContent({ children }: IProps) {
  return (
    <View {...styles.wrapper}>
      <Text size="m" align="center" color="#626262" autoBreak>
        {children}
      </Text>
    </View>
  )
}
