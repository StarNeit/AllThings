import React from 'react'
import IosStarIcon from '@allthings/react-ionicons/lib/IosStarIcon'
import IosStarHalfIcon from '@allthings/react-ionicons/lib/IosStarHalfIcon'
import IosStarOutlineIcon from '@allthings/react-ionicons/lib/IosStarOutlineIcon'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'

const styles = {
  star: css({
    fill: ColorPalette.yellowOrange,
    height: 24,
    width: 24,
  }),
}

interface IProps {
  maxRating?: number
  rating: number
}

export default class Ratingbar extends React.Component<IProps> {
  static defaultProps = {
    maxRating: 5,
  }

  getStarIcon = (type: string, index: number) => {
    switch (type) {
      case 'full':
        return <IosStarIcon {...styles.star} key={`ratingstar-${index}`} />
      case 'half':
        return <IosStarHalfIcon {...styles.star} key={`ratingstar-${index}`} />
      case 'empty':
      default:
        return (
          <IosStarOutlineIcon {...styles.star} key={`ratingstar-${index}`} />
        )
    }
  }

  renderStars = (rating: number, maxRating: number) => {
    const stars = []
    const intRating = parseInt((rating as unknown) as string, 10)
    for (let i = 0; i < maxRating; i++) {
      if (i >= rating) {
        stars.push(this.getStarIcon('empty', i))
      } else if (i < intRating && i !== rating) {
        stars.push(this.getStarIcon('full', i))
      } else {
        stars.push(this.getStarIcon('half', i))
      }
    }
    return stars
  }

  render() {
    const { rating, maxRating, children, ...restProps } = this.props
    return (
      <div title={rating + ' / ' + maxRating} {...restProps}>
        {this.renderStars(rating, maxRating)}
      </div>
    )
  }
}
