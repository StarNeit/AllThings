import React from 'react'
import { css } from 'glamor'
import Logo from 'components/Logo'
import Header from 'components/Header'
import { View } from '@allthings/elements'
import NoOp from 'utils/noop'

const styles = {
  box: css({
    margin: 'auto',
    background: '#fff',
    maxWidth: 760,
    width: '100%',
    padding: 40,
    borderRadius: 2,
    wordBreak: 'break-word',
  }),
}

interface IProps {
  onLogoClick?: OnClick
  children: React.ReactNodeArray
}

function FullPageInformation({ children, onLogoClick = NoOp }: IProps) {
  return (
    <View style={{ height: '100%' }}>
      <Header>
        <Logo onClick={onLogoClick} />
      </Header>
      <View
        direction="row"
        alignH="space-around"
        alignV="start"
        wrap="wrap"
        {...styles.box}
      >
        {children}
      </View>
    </View>
  )
}

export default FullPageInformation
