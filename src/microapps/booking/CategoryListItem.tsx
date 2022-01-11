import React from 'react'
import {
  View,
  ListIcon,
  Inset,
  Text,
  ChevronRightListItem,
} from '@allthings/elements'
import { IconType } from '@allthings/elements/Icon'

interface IProps {
  categoryKey?: string
  icon: IconType
  name: React.ReactElement | string
  onCategoryClick: OnClick
}

export default class CategoryListItem extends React.Component<IProps> {
  handleClick = () => this.props.onCategoryClick(this.props.categoryKey)

  render() {
    const { name, icon, categoryKey, onCategoryClick, ...props } = this.props
    return (
      <ChevronRightListItem onClick={this.handleClick} {...props}>
        <View direction="row" alignV="center">
          <ListIcon iconColor="white" name={icon} />
          <Inset>
            <Text>{name}</Text>
          </Inset>
        </View>
      </ChevronRightListItem>
    )
  }
}
