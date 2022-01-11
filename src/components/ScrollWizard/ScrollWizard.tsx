import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'

interface IProps {
  page: number
  children: React.ReactNodeArray
  injectActive?: boolean
  scrollDuration?: number
  containerStyle?: object
}

const ScrollWizard = ({
  children,
  page,
  containerStyle,
  scrollDuration = 500,
  ...props
}: IProps) => {
  const scrollStyle = {
    transition: `transform ${scrollDuration}ms ease-in-out`,
    transform: `translate3d(${page * -100}%, 0, 0)`,
  }

  const injectedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: React.ReactElement<any>, i) => {
      const childProps = child.props || {}
      return React.cloneElement(child, {
        ...childProps,
        isActive: i === page,
        pageNum: i,
      })
    })
  return (
    <View
      alignV="center"
      direction="row"
      {...css(scrollStyle, containerStyle)}
      {...props}
    >
      {injectedChildren}
    </View>
  )
}

export default ScrollWizard
