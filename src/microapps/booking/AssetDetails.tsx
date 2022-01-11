import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { css, keyframes } from 'glamor'
import {
  View,
  SimpleLayout,
  Text,
  FloatingButton,
  Image,
  Icon,
  Responsive,
  ListSpinner,
} from '@allthings/elements'
import BookingOverlay from 'microapps/booking/BookingOverlay'
import DataProvider from 'containers/DataProvider'
import Translated from 'containers/Translated'
import Asset from './Asset'
import { FormattedMessage } from 'react-intl'
import get from 'lodash-es/get'
import ImageGalleryOverlay from 'components/ImageGalleryOverlay'
import { RouteComponentProps } from 'react-router'
import { IAsset, renderAssetsOnFirstPage } from '.'
import { isIE11 } from 'utils/guessBrowser'
import sendNativeEvent from 'utils/sendNativeEvent'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { PaymentStatus } from 'enums'
import { ITheme } from '@allthings/elements/ThemeProvider'
import { withTheme } from 'utils/withTheme'
import qs from 'query-string'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const slideUp = keyframes({
  '0%': {
    overflow: 'hidden',
    transform: 'translate3d(0, 100%, 0)',
  },
  '100%': {
    overflow: 'auto',
    transform: 'translate3d(0, 0, 0)',
  },
})

const styles = {
  mobileButton: css({
    bottom: 0,
    position: 'sticky',
    display: 'table-row', // Android hack. Otherwise element is floating.
  }),
  slideUp: css({
    animation: `${slideUp} 0.3s`,
  }),
  title: css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '260px',
  }),
}

interface IProps {
  accessToken: string
  embeddedLayout: boolean
  isLoadingMore?: () => void
  navigateToBooking: (id: string) => void
  onBackButtonClick: OnClick
  onProfileClick: OnClick
  theme: ITheme
  numberOfAssets: number
  userAgent: string
}

interface IState {
  booking: boolean
  showImageGallery: boolean
  paymentSessionId?: string
  stripePublishableKey?: string
  paymentStatus?: PaymentStatus
  paidBookingId?: string
}
class AssetDetails extends React.Component<
  IProps & RouteComponentProps<{ id: string }>,
  IState
> {
  state: IState = {
    booking: false,
    showImageGallery: false,
  }

  componentDidMount() {
    if (this.props.location.search) {
      const params = qs.parse(this.props.location.search)

      this.setState({
        paymentSessionId: params.paymentSessionId as string,
        stripePublishableKey: params.stripePublishableKey as string,
        paymentStatus: params.paymentStatus as PaymentStatus,
        paidBookingId: params.entityId as string,
      })
      this.openBooking()
    }
  }

  openBooking = () => this.setState({ booking: true })

  closeBooking = () => this.setState({ booking: false })

  renderBooking = (asset: IAsset) => (
    <BookingOverlay
      asset={asset}
      theme={this.props.theme}
      navigateToBooking={this.props.navigateToBooking}
      onRequestClose={this.closeBooking}
      paymentSessionId={this.state.paymentSessionId}
      stripePublishableKey={this.state.stripePublishableKey}
      paymentStatus={this.state.paymentStatus}
      paidBookingId={this.state.paidBookingId}
    />
  )

  openGallery = (images: IFile[]) => {
    if (!this.props.embeddedLayout) {
      this.setState({ showImageGallery: true })
    } else {
      sendNativeEvent(this.props.accessToken, {
        name: 'open-image-gallery',
        data: images.map(image => image.files.original),
      })
    }
  }

  closeGallery = () => this.setState({ showImageGallery: false })

  renderAsset = (asset: IAsset) => {
    const image = get(asset, '_embedded.files[0]._embedded.files.medium.url')
    return (
      <SimpleLayout backgroundColor="white">
        {this.state.booking && this.renderBooking(asset)}
        {image && (
          <Image
            position="center"
            src={image}
            size="cover"
            {...css({
              height: 230,
              ':hover': {
                cursor: 'pointer',
              },
            })}
            onClick={() => this.openGallery(asset._embedded.files)}
          />
        )}
        <Translated
          values={asset.translations}
          defaultLocale={asset.defaultLocale}
        >
          {({ description, location, name, terms }) => (
            <Asset
              {...asset}
              contactPerson={get(asset, '_embedded.contactPerson', {})}
              description={description}
              location={location}
              name={name}
              onProfileClick={this.props.onProfileClick}
              terms={terms}
            />
          )}
        </Translated>
        <View flex="flex" {...styles.mobileButton}>
          <Responsive mobile>
            <View {...styles.slideUp}>
              <FloatingButton onClick={this.openBooking}>
                {this.renderFloatingButtonContent()}
              </FloatingButton>
            </View>
          </Responsive>
        </View>
        <Responsive tablet desktop>
          <FloatingButton
            data-e2e="booking-book-asset-button"
            onClick={this.openBooking}
            {...(isIE11(this.props.userAgent)
              ? css({ padding: '14px 0px' })
              : {})}
          >
            {this.renderFloatingButtonContent()}
          </FloatingButton>
        </Responsive>
      </SimpleLayout>
    )
  }

  renderFloatingButtonContent = () => (
    <View direction="row">
      <Text strong color="white">
        <FormattedMessage
          id="booking.asset-detail-book-button-label"
          description="Label of the button that opens the booking process"
          defaultMessage="Select a date to book"
        />
      </Text>
      &nbsp;
      <Icon name="calendar-check" size="xs" color="white" />
    </View>
  )

  renderLoading = () => (
    <SimpleLayout padded>
      <ListSpinner />
    </SimpleLayout>
  )

  handleBackButtonClick = () => {
    const { numberOfAssets } = this.props
    this.props.onBackButtonClick({
      categoryId: get(this, 'props.match.params.category'),
      numberOfAssets,
    })
  }

  render() {
    return (
      <HorizontalRouterMicroapp>
        <Responsive mobile>
          <GenericBackTitleBar onBack={this.props.onBackButtonClick} />
        </Responsive>
        <DataProvider
          key={this.props.match.params.id}
          request={{
            path: `api/v1/assets/${this.props.match.params.id}`,
          }}
        >
          {({ isDone, result }) => (
            <SimpleLayout>
              {this.state.showImageGallery && (
                <ImageGalleryOverlay
                  onClose={this.closeGallery}
                  images={result.entity._embedded.files}
                />
              )}
              {isDone ? this.renderAsset(result.entity) : this.renderLoading()}
            </SimpleLayout>
          )}
        </DataProvider>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  onBackButtonClick: ({
    categoryId,
    numberOfAssets,
  }: {
    categoryId: string
    numberOfAssets: number
  }) =>
    dispatch(
      push(
        renderAssetsOnFirstPage({ numberOfAssets })
          ? '/booking'
          : `/booking/assets/${categoryId}`,
      ),
    ),
  onProfileClick: (id: string) => dispatch(push(`/booking/profile/${id}`)),
  navigateToBooking: (id: string) =>
    dispatch(push(`/booking/my-bookings/${id}`)),
})

const mapStateToProps = (state: IReduxState) => ({
  accessToken: state.authentication.accessToken,
  embeddedLayout: state.app.embeddedLayout,
  numberOfAssets: state.booking.numberOfAssets,
  userAgent: state.app.userAgent,
})

export default withTheme()(
  connect(mapStateToProps, mapDispatchToProps)(AssetDetails),
)
