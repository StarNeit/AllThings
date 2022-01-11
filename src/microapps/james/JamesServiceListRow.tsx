import React from 'react'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { View, Text, ChevronRightListItem } from '@allthings/elements'

const styles = css({
  backgroundColor: ColorPalette.lightGreyIntense,
})

interface IProps {
  name: string
  provider: string
  id: string
  onClick: OnClick
}

class JamesServiceListRow extends React.Component<IProps> {
  handleClick = () => {
    this.props.onClick(this.props.id)
  }

  render() {
    const { name, provider, ...restProps } = this.props

    return (
      <ChevronRightListItem
        {...restProps}
        onClick={this.handleClick}
        alignV="center"
        {...styles}
      >
        <View {...styles.label}>
          <Text size="l" data-e2e="james-service-list-label">
            {name}
          </Text>
        </View>
        <View {...styles.description}>
          <Text size="s" color={ColorPalette.grey}>
            {provider}
          </Text>
        </View>
      </ChevronRightListItem>
    )
  }
}

export default JamesServiceListRow
