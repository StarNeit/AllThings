import React from 'react'
import { View } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'

const height = 19

class DetailSkeleton extends React.PureComponent {
  renderTextBlock(lines: number, key: number) {
    return (
      <View
        style={{
          height: `${height * lines}px`,
          margin: '5px 0px',
          background: ColorPalette.lightGrey,
        }}
        key={key}
      />
    )
  }

  render() {
    return <View>{[1, 1, 5].map((l, k) => this.renderTextBlock(l, k))}</View>
  }
}

export default DetailSkeleton
