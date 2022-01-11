import React from 'react'
import { css } from 'glamor'

const container = css({
  flexGrow: 1,
  flexShrink: 0,
  justifyContent: 'center',
  display: 'flex',
  position: 'relative',
  marginRight: 80,
  left: 40,
})

interface IProps {
  source?: string
}

export default class ImageColumn extends React.Component<IProps> {
  render() {
    return (
      <div {...container}>
        {this.props.source ? (
          <img src={this.props.source} width="128" height="128" />
        ) : (
          this.props.children
        )}
      </div>
    )
  }
}
