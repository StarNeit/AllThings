import React from 'react'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  height?: number
  rows?: number
  titleHeight?: number
}

class LoadingSkeleton extends React.PureComponent<IProps> {
  static defaultProps = {
    titleHeight: 19,
    height: 22,
    rows: 3,
  }

  renderSkeleton(height: number) {
    return (
      <div
        className="skeleton"
        style={{
          width: 150,
          height,
          background: ColorPalette.lightGrey,
          position: 'relative',
        }}
      />
    )
  }

  render() {
    return (
      <div className="contentList">
        <ul className="contentList-list">
          {Array.apply(null, new Array(this.props.rows)).map(
            (_: unknown, i: number) => (
              <li className="contentList-list-item" key={i}>
                <div className="contentList-list-item-link">
                  <h3 className="contentList-list-item-title">
                    {this.renderSkeleton(this.props.height)}
                  </h3>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    )
  }
}

export default LoadingSkeleton
