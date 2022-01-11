import React from 'react'
import { css } from 'glamor'
import View, { IViewProps } from '@allthings/elements/View'

interface IProps extends IViewProps {
  isActive?: boolean
  pageNum?: string
}

export default class ScrollWizardPage extends React.PureComponent<IProps> {
  render() {
    const { children, isActive, pageNum, ...restProps } = this.props
    const injectedChildren = React.Children.map(
      children,
      (child: React.ReactElement<any>) => {
        if (child) {
          const childProps = child.props || {}
          return React.cloneElement(child, { ...childProps, isActive })
        } else {
          return child
        }
      },
    )
    return (
      <View
        fill
        alignH="center"
        alignV="center"
        direction="column"
        {...restProps}
        {...css(isActive ? {} : { height: '0px', overflow: 'hidden' })}
      >
        {injectedChildren}
      </View>
    )
  }
}
