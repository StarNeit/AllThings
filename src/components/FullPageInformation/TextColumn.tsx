import React from 'react'
import { css } from 'glamor'

const container = css({
  flexGrow: 100,
  flexShrink: 0,
  width: 280,
  maxWidth: 450,
})

interface IProps {
  children: React.ReactNodeArray
}

export default class TextColumn extends React.Component<IProps> {
  render() {
    return <div {...container}>{this.props.children}</div>
  }
}
