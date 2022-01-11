import React from 'react'
import { css } from 'glamor'
import { View, Text } from '@allthings/elements'
import { getEllipsisTextParts } from 'utils/formatStrings'
import IosDownloadOutlineIcon from '@allthings/react-ionicons/lib/IosDownloadOutlineIcon'

interface IProps {
  name: string
  onClick?: OnClick
  url: string
}

export default class PostAttachment extends React.Component<IProps> {
  render() {
    const { name, url, ...restProps } = this.props
    const ellipsizedName = getEllipsisTextParts(name)

    return (
      <View
        {...restProps}
        direction="row"
        wrap="nowrap"
        alignH="space-between"
        alignV="center"
        {...css({ padding: '8px 15px', cursor: 'pointer' })}
      >
        <View
          flex="nogrow"
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Text
            size="m"
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {ellipsizedName.left}
          </Text>
        </View>
        <View flex="none">
          <Text size="m">{ellipsizedName.right}</Text>
        </View>
        <View
          flex="noshrink"
          direction="row"
          alignH="end"
          {...css({ marginLeft: 15 })}
        >
          <IosDownloadOutlineIcon
            style={{ fill: '#626262', width: 24, height: 24 }}
          />
        </View>
      </View>
    )
  }
}
