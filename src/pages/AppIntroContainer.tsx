import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'

const styles = {
  childWrapper: css({
    marginBottom: '20px',
  }),
}

interface IProps {
  children: React.ReactNode | React.ReactNodeArray
}

const AppIntroContainer = ({ children, ...props }: IProps) => (
  <View {...props}>
    <View {...styles.childWrapper}>{children}</View>
  </View>
)

export default AppIntroContainer
