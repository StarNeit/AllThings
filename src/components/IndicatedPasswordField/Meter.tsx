import React from 'react'
import { ColorPalette } from '@allthings/colors'

const containerStyle = {
  display: 'block',
  margin: '-7px 0px -1px 0px',
  backgroundColor: ColorPalette.white,
}

interface IProps {
  emptyColor: string
  highColor: string
  highValue: number
  indicatorCount: number
  lowColor: string
  lowValue: number
  mediumColor: string
  mediumValue: number
  score: number
}

export default class Meter extends React.Component<IProps> {
  static defaultProps = {
    score: 0,
    indicatorCount: 5,
    lowValue: 0,
    mediumValue: 3,
    highValue: 4,
    lowColor: ColorPalette.state.error,
    mediumColor: ColorPalette.state.warning,
    highColor: ColorPalette.state.success,
    emptyColor: ColorPalette.greyIntense,
  }

  computeIndicatorStyle = (indicatorIndex: number) => {
    let color
    const score = this.props.score
    if (score >= this.props.lowValue) {
      color = this.props.lowColor
    }
    if (score >= this.props.mediumValue) {
      color = this.props.mediumColor
    }
    if (score >= this.props.highValue) {
      color = this.props.highColor
    }
    if (score < indicatorIndex) {
      color = this.props.emptyColor
    }

    const width = 100 / this.props.indicatorCount

    return {
      display: 'inline-block',
      width: width + '%',
      height: '4px',
      background: color,
      borderRight:
        indicatorIndex === this.props.indicatorCount - 1
          ? 'none'
          : '1px solid white',
    }
  }

  render() {
    const indicators = []
    for (let i = 0; i < 5; i++) {
      indicators.push(<div style={this.computeIndicatorStyle(i)} key={i} />)
    }
    return <div style={containerStyle}>{indicators}</div>
  }
}
