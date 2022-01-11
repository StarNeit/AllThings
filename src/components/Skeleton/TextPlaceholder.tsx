import React from 'react'
import merge from 'lodash-es/merge'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  style?: object
}

export class TextPlaceholder extends React.Component<IProps> {
  static defaultProps = {
    style: {},
  }

  render() {
    const style = merge(
      {},
      {
        height: 20,
        width: 100,
        backgroundColor: ColorPalette.lightGrey,
        position: 'relative',
        display: 'block',
      },
      this.props.style,
    )

    return <span style={style} />
  }
}

export default TextPlaceholder
