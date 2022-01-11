import React from 'react'
import { Text, Button } from '@allthings/elements'
import { css } from 'glamor'
import NoOp from 'utils/noop'

const styles = css({
  margin: '0',
  borderRadius: 0,
  border: 'none',
  cursor: 'pointer',
  lineHeight: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 15px',
  height: '100%',
  marginLeft: 2,
  '&:first-child': {
    margin: 0,
  },
})

interface IProps {
  active?: boolean
  label: string
  onClick: OnClick
  children?: React.ReactNodeArray
  style?: object
}

export default class TitleBarButton extends React.Component<IProps> {
  static defaultProps = {
    onClick: NoOp,
  }

  renderLabel = () => {
    const { label } = this.props
    if (label) {
      return (
        <Text color="textOnBackground" size="s">
          {label}
        </Text>
      )
    } else {
      const noLabelStyles = css({
        paddingRight: 0,
        display: 'none',
      })
      return <span {...noLabelStyles} />
    }
  }

  render() {
    const { active, label, children, style, ...restProps } = this.props
    const backgroundColor = active ? 'rgba(0, 0, 0, .30)' : 'rgba(0, 0, 0, .15)'

    return (
      <Button
        backgroundColor={backgroundColor}
        {...css(style, styles)}
        {...restProps}
      >
        {children}
        {this.renderLabel()}
      </Button>
    )
  }
}
