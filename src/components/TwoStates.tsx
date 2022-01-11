import React from 'react'
import { css } from 'glamor'

const container = css({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'all .2s .2s',
})

interface IProps {
  active: number
  children: React.ReactNodeArray
  style?: object
}

export default class TwoStates extends React.Component<IProps> {
  render() {
    const { active, children, ...restProps } = this.props
    const childPosition = (100 / children.length) * active

    return (
      <div
        {...css(container, { transform: `translateY(-${childPosition}%)` })}
        {...restProps}
      >
        {children}
      </div>
    )
  }
}
