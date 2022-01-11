import React from 'react'
import { css } from 'glamor'
import View, { IViewProps } from '@allthings/elements/View'

const commonStyle = css({
  marginBottom: 30,
})

interface IProps {
  children: React.ReactElement
}

const Row = ({ children, ...restProps }: IProps & IViewProps) => {
  if (React.Children.count(null) === 1) {
    // to save an extra wrapper, a single Component is cloned instead of wrapped with another View
    return React.cloneElement(children, { ...commonStyle, ...restProps })
  } else {
    return (
      <View {...commonStyle} {...restProps}>
        {children}
      </View>
    )
  }
}

export default Row
