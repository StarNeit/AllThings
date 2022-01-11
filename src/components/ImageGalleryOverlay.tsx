import React from 'react'
import { Gateway } from 'react-gateway'
import Overlay from 'components/Overlay'
import { ColorPalette } from '@allthings/colors'
import IosArrowBackIcon from '@allthings/react-ionicons/lib/IosArrowBackIcon'
import IosArrowForwardIcon from '@allthings/react-ionicons/lib/IosArrowForwardIcon'
import CloseIcon from '@allthings/react-ionicons/lib/CloseIcon'
import ReactSwipe from 'react-swipe'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import FittedImage from 'components/FittedImage'
import { connect } from 'react-redux'
import sendNativeEvent from 'utils/sendNativeEvent'

const ESCAPE_KEY_CODE = 27
const LEFT_ARROW_KEY_CODE = 37
const RIGHT_ARROW_KEY_CODE = 39

const iconStyle = {
  fill: ColorPalette.white,
  height: 50,
  width: 50,
}

interface IProps {
  images: ReadonlyArray<ImageInterface>
  // Id of the image which should be active.
  // If none is given the first will be used.
  imageId?: string
  onClose: (event?: React.SyntheticEvent) => void
  accessToken: string
  embeddedLayout: boolean
}

interface IState {
  startSlide: number
}

class ImageGalleryOverlay extends React.PureComponent<IProps, IState> {
  initialViewportContent: string = null

  reactSwipe: ReactSwipe = null

  state = {
    startSlide: 0,
  }

  componentDidMount() {
    // If we are in the native app, we close this overlay
    // but send an event with the images
    if (this.props.embeddedLayout) {
      sendNativeEvent(this.props.accessToken, {
        name: 'open-image-gallery',
        data: this.props.images.map(image => image.files.medium),
      })
      this.props.onClose()
    } else {
      document.addEventListener('keyup', this.handleKeyPress)

      this.setState({
        startSlide: this.props.imageId
          ? this.getImageIndex(this.props.imageId)
          : 0,
      })

      if (
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i)
      ) {
        const viewportMeta = document.querySelector('meta[name="viewport"]')

        this.initialViewportContent = (viewportMeta as any).content

        if (this.initialViewportContent) {
          const contentArray = this.initialViewportContent.split(',')
          const minScaleIndex = contentArray.findIndex(
            element =>
              element
                .trim()
                .split('=')[0]
                .trim() === 'minimum-scale',
          )
          const maxScaleIndex = contentArray.findIndex(
            element =>
              element
                .trim()
                .split('=')[0]
                .trim() === 'maximum-scale',
          )
          const userScalableIndex = contentArray.findIndex(
            element =>
              element
                .trim()
                .split('=')[0]
                .trim() === 'user-scalable',
          )

          if (minScaleIndex) {
            contentArray[minScaleIndex] = 'minimum-scale=1'
          }

          if (maxScaleIndex) {
            contentArray[maxScaleIndex] = 'maximum-scale=10'
          }

          if (userScalableIndex) {
            contentArray[userScalableIndex] = 'user-scalable=yes'
          }

          ;(viewportMeta as any).content = contentArray.join(', ')
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress)

    if (this.initialViewportContent) {
      ;(document.querySelector(
        'meta[name="viewport"]',
      ) as any).content = this.initialViewportContent
    }
  }

  setReactSwipe = (reactSwipe: ReactSwipe) => (this.reactSwipe = reactSwipe)

  getImageWithId = (id: string) =>
    this.props.images.filter(image => {
      return image.id === id
    })[0]

  getImageAtIndex = (index: number) => this.props.images[index]

  getImageIndex = (id: string) =>
    this.props.images.indexOf(this.getImageWithId(id))

  handleKeyPress = (event: KeyboardEvent) => {
    if (event.which === RIGHT_ARROW_KEY_CODE && this.hasNextImage()) {
      this.nextImage()
    }

    if (event.which === LEFT_ARROW_KEY_CODE && this.hasPreviousImage()) {
      this.previousImage()
    }

    if (event.which === ESCAPE_KEY_CODE) {
      this.props.onClose()
    }
  }

  hasPreviousImage = () => this.state.startSlide > 0

  hasNextImage = () => this.state.startSlide < this.props.images.length - 1

  previousImage = () => {
    if (this.reactSwipe) {
      this.reactSwipe.prev()
      this.setState(({ startSlide }) => ({ startSlide: startSlide - 1 }))
    }
  }

  nextImage = () => {
    if (this.reactSwipe) {
      this.reactSwipe.next()
      this.setState(({ startSlide }) => ({ startSlide: startSlide + 1 }))
    }
  }

  renderPreviousButton = () =>
    this.hasPreviousImage() && (
      <button
        data-e2e="image-gallery-previous-button"
        onClick={this.previousImage}
      >
        <IosArrowBackIcon style={iconStyle} />
      </button>
    )

  renderNextButton = () =>
    this.hasNextImage() && (
      <button data-e2e="image-gallery-next-button" onClick={this.nextImage}>
        <IosArrowForwardIcon style={iconStyle} />
      </button>
    )

  render() {
    // If we are in native, don't render anyting
    if (this.props.embeddedLayout) {
      return null
    }

    const paneNodes = this.props.images.map((currentImage, index) => (
      <div
        key={currentImage.id}
        {...css({ height: '70vh' })}
        data-e2e={`image-overlay-image-${index}`}
      >
        <FittedImage
          alt={currentImage.name}
          src={currentImage.files.original.url}
          fit="contain"
        />
      </div>
    ))
    return (
      <Gateway into="root">
        <Overlay
          direction="column"
          alignH="center"
          onBackgroundClick={this.props.onClose}
          {...css({ padding: 0 })}
        >
          <View alignH="end" direction="row">
            <div onClick={this.props.onClose} data-e2e="image-overlay-close">
              <CloseIcon
                style={{ margin: 10, width: 25, height: 25, fill: '#fff' }}
              />
            </div>
          </View>
          <div
            {...css({
              background: 'black',
              margin: 0,
              padding: '20px 10px',
              position: 'relative',
            })}
          >
            <ReactSwipe
              className="gallery"
              key={this.props.images.length}
              ref={this.setReactSwipe}
              swipeOptions={{
                startSlide: this.state.startSlide,
              }}
            >
              {paneNodes}
            </ReactSwipe>
            <div className="imageGallery-buttonContainer left">
              {this.renderPreviousButton()}
            </div>
            <div className="imageGallery-buttonContainer right">
              {this.renderNextButton()}
            </div>
          </div>
        </Overlay>
      </Gateway>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  accessToken: state.authentication.accessToken,
  embeddedLayout: state.app.embeddedLayout,
})

export default connect(
  mapStateToProps,
  null,
)(ImageGalleryOverlay)
