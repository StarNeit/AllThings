import React from 'react'

/**
 * Images make thing more interesting. They can be used
 * to display user image content and UI graphics.
 * If something goes wrong when loading the image, a placeholder will
 * be shown instead.
 */

interface IProps {
  // Alternative image to use
  alt: string
  // Deprecated
  className?: string
  // Deprecated
  handleClick?: OnClick
  // Will be called when the image is clicked
  onClick?: OnClick
  // The URL of the image
  src: string
  // The URL of the fallback image
  srcFallback?: string
  // Deprecated
  style?: object
}

export default class Image extends React.Component<IProps> {
  state = {
    useFallback: false,
  }

  componentDidMount() {
    if (this.props.handleClick) {
      // tslint:disable-next-line:no-console
      console.warn(
        'Please use onClick instead of deprecated handleClick for Image component',
      )
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.src !== this.props.src) {
      this.setState({ useFallback: false })
    }
  }

  onError = () => this.props.srcFallback && this.setState({ useFallback: true })

  render() {
    const { onClick, handleClick, srcFallback, src, ...props } = this.props

    if (this.state.useFallback && !srcFallback) {
      return null
    }

    return (
      <img
        onClick={onClick || handleClick}
        onError={this.onError}
        src={this.state.useFallback ? srcFallback : src}
        {...props}
      />
    )
  }
}
