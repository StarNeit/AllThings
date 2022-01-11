import React from 'react'
import { Text, ListItem } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import { getEllipsisTextParts } from 'utils/formatStrings'
import { CSSProperties } from 'glamor'
import View, { IViewProps } from '@allthings/elements/View'

interface IProps {
  highlight?: boolean
  icon: React.ComponentClass<{ style: CSSProperties }>
  info: string | number
  onClick?: (text: string, url?: string) => void
  size?: string
  text: string
  url?: string
}

class DocumentListItem extends React.Component<IProps & IViewProps> {
  static defaultProps = {
    size: '',
    highlight: false,
  }

  handleClick = () => {
    const { onClick, text, url } = this.props
    onClick && onClick(text, url)
  }

  render() {
    const { text, info, icon: Icon, size, highlight, ...restProps } = this.props
    const ellipsisParts = getEllipsisTextParts(text)

    return (
      <ListItem
        wrap="nowrap"
        alignV="center"
        {...restProps}
        onClick={this.handleClick}
      >
        <View flex="nogrow" style={{ overflow: 'hidden' }}>
          <Text
            style={{
              fontWeight: highlight ? 'bold' : null,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre',
            }}
          >
            {ellipsisParts.left}
          </Text>
        </View>
        <View flex="none" style={{ whiteSpace: 'pre' }}>
          <Text
            style={{
              fontWeight: highlight ? 'bold' : null,
            }}
          >
            {ellipsisParts.right}
          </Text>
        </View>
        <View flex="none">
          <Text color={ColorPalette.grey} style={{ paddingLeft: 5 }}>
            ({info})
          </Text>
        </View>
        <View
          flex="noshrink"
          direction="row"
          alignV="center"
          alignH="end"
          style={{ marginLeft: 5 }}
        >
          <Text color={ColorPalette.grey} style={{ paddingRight: 5 }}>
            {size}
          </Text>
          <Icon
            style={{
              fill: ColorPalette.lightGreyIntense,
              width: 32,
              height: 32,
              marginRight: -4,
            }}
          />
        </View>
      </ListItem>
    )
  }
}

export default DocumentListItem
