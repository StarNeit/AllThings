import {
  Card,
  CardFooter,
  GroupTitle,
  List,
  ListSpinner,
  Responsive,
  SimpleLayout,
  Spacer,
  Text,
  View,
} from '@allthings/elements'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { push } from 'connected-react-router'
import DataProvider from 'containers/DataProvider'
import Translated from 'containers/Translated'
import { css } from 'glamor'
import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { adjustApiTimeToFrontendTime, dateFromISO8601 } from 'utils/date'
import { withTheme } from 'utils/withTheme'
import { BookingStatuses, IAsset, IBooking } from '.'
import Asset from './Asset'
import BookAgainButton from './BookAgainButton'
import BookingDetailListItem from './BookingDetailListItem'
import BookingOverlay from './BookingOverlay'
import BookingOverviewTabs from './BookingOverviewTabs'
import CancelBookingButton from './CancelBookingButton'
import FormattedPrice from './FormattedPrice'
import { messages as sharedMessages } from './messages'
import TimeInterval from './TimeInterval'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const messages = defineMessages({
  additionalInfoLabel: {
    id: 'booking.additional-information',
    description:
      'Label of additional information regarding the booking. Like f.e. access-code to the booked asset',
    defaultMessage: 'Additional info',
  },
  assetLabel: {
    id: 'booking.booking-asset',
    description: 'Label of the asset in booking detail screen',
    defaultMessage: 'Asset',
  },
  manageAccess: {
    id: 'booking.tab-label.manage-access',
    description: 'Label of the Manage Access tab in the booking detail screen.',
    defaultMessage: 'Manage Access',
  },
  objectDetails: {
    id: 'booking.tab-label.object-details',
    description: 'Label of the Asset details tab in the booking detail screen.',
    defaultMessage: 'Object Details',
  },
  dateLabel: {
    id: 'booking.booking-date',
    description: 'Label of the date in the booking detail screen',
    defaultMessage: 'Date',
  },
  statusLabel: {
    id: 'booking.booking-status',
    description: 'Label of the status in the booking detail screen',
    defaultMessage: 'Status',
  },
  totalLabel: {
    id: 'booking.booking-total-price',
    description: 'Label of the total price in booking detail screen',
    defaultMessage: 'Total',
  },
  // statuses of booking
  confirmed: {
    id: 'booking.statuses.confirmed',
    description: 'confirmed',
    defaultMessage: 'confirmed',
  },
  unconfirmed: {
    id: 'booking.statuses.unconfirmed',
    description: 'unconfirmed',
    defaultMessage: 'unconfirmed',
  },
  declined: {
    id: 'booking.statuses.declined',
    description: 'declined',
    defaultMessage: 'declined',
  },
  canceled: {
    id: 'booking.statuses.canceled',
    description: 'canceled',
    defaultMessage: 'canceled',
  },
  'cancellation-requested': {
    id: 'booking.statuses.cancellation-requested',
    description: 'cancellation-requested',
    defaultMessage: 'cancellation-requested',
  },
  explanation: {
    id: 'booking.statuses.cancellation-requested-explanation',
    description: 'explaining when the booking will be cancelled effectively.',
    defaultMessage:
      'Your request has been sent. Please note that the cancellation is only completed after being confirmed by the booking manager',
  },
  paid: {
    id: 'booking.statuses.paid',
    description: 'booking status when paid by credit card.',
    defaultMessage: 'paid',
  },
})

interface IProps {
  isNative: boolean
  hostname: string
  theme: ITheme
  navigateToBooking: (id: string) => void
  onAssetClick?: OnClick
  onBackButtonClick?: OnClick
  onProfileClick: (id: string) => void
  userAgent: string
}

class BookingDetails extends React.Component<
  IProps & InjectedIntlProps & RouteComponentProps<{ id: string }>
> {
  state = {
    booking: false,
    cancelOverlay: false,
    iframeLoaded: false,
  }

  styles = {
    iframe: css({
      border: 'none',
      width: '100%',
      height: '100%',
      minHeight: 540,
    }),
  }

  openBooking = () => this.setState({ booking: true })

  closeBooking = () => this.setState({ booking: false })

  hideSpinner = () => this.setState({ iframeLoaded: true })

  renderBookingOverlay = (asset: IAsset) => (
    <BookingOverlay
      asset={asset}
      theme={this.props.theme}
      navigateToBooking={this.props.navigateToBooking}
      onRequestClose={this.closeBooking}
    />
  )

  renderBooking = (
    booking: IBooking,
    refetch: () => void,
    archived: boolean,
  ) => {
    const { formatMessage } = this.props.intl
    const {
      _embedded: { asset, payment },
      dateFrom,
      dateTo,
      id: bookingId,
      status,
    } = booking
    const {
      _embedded,
      accessControlUiUrl,
      cancellingRequiresApproval,
      currency,
      defaultLocale,
      timeSlotUnit,
      translations,
      priceOnRequest,
    } = asset
    const isPaid = payment && payment.outcome === 'success'
    const paidText = isPaid && ` (${formatMessage(messages.paid)})`
    const [adjustedDateFrom, adjustedDateTo] = [dateFrom, dateTo].map(date =>
      adjustApiTimeToFrontendTime(dateFromISO8601(date)),
    )
    const isPastBooking = adjustedDateFrom < new Date()
    const showCancelButton =
      (status === 'unconfirmed' || status === 'confirmed') && !isPastBooking

    const requiresAccessControl = typeof accessControlUiUrl === 'string'

    const bookingOverviewHeaders =
      status === 'confirmed' && requiresAccessControl
        ? [
            formatMessage(messages.manageAccess),
            formatMessage(messages.objectDetails),
          ]
        : [formatMessage(messages.objectDetails)]

    const bookingOverviewContent = [
      ...(status === 'confirmed' && requiresAccessControl
        ? [
            <Card>
              {!this.state.iframeLoaded && (
                <View>
                  <ListSpinner {...css({ alignItems: 'center' })} />
                </View>
              )}
              <iframe
                id="accessControlFrame"
                onLoad={this.hideSpinner}
                src={`${accessControlUiUrl}?id=${bookingId}`}
                {...this.styles.iframe}
              />
              <Spacer />
            </Card>,
          ]
        : []),
      <Card>
        <Translated values={translations} defaultLocale={defaultLocale}>
          {({ description, location, name, terms }) => (
            <Asset
              {...asset}
              needsPayment={false} // we don't like to show the pill on this screen, because its confusing
              contactPerson={_embedded.contactPerson}
              description={description}
              location={location}
              name={name}
              onProfileClick={this.props.onProfileClick}
              terms={terms}
            />
          )}
        </Translated>
        <Spacer />
      </Card>,
    ]

    return (
      <Translated values={translations} defaultLocale={defaultLocale}>
        {translation => (
          <SimpleLayout>
            <View {...css({ width: 'auto' })}>
              {this.state.booking && this.renderBookingOverlay(asset)}
              <GroupTitle>
                <FormattedMessage
                  id="booking.booking-title"
                  description="Title of the booking detail screen"
                  defaultMessage="Booking Details"
                />
              </GroupTitle>
              <Card>
                <List>
                  <BookingDetailListItem
                    categoryDetail={translation.name}
                    categoryName={formatMessage(messages.assetLabel)}
                  />
                  <BookingDetailListItem
                    categoryDetail={
                      <TimeInterval
                        dateFrom={adjustedDateFrom}
                        dateTo={adjustedDateTo}
                        type={timeSlotUnit}
                      />
                    }
                    categoryName={formatMessage(messages.dateLabel)}
                  />
                  <BookingDetailListItem
                    categoryDetail={
                      messages[status]
                        ? formatMessage(messages[status])
                        : status
                    }
                    categoryName={formatMessage(messages.statusLabel)}
                  />
                  <BookingDetailListItem
                    categoryDetail={
                      <Text color="primary" size="xl" strong>
                        {priceOnRequest ? (
                          formatMessage(sharedMessages.priceOnRequest)
                        ) : (
                          <>
                            <FormattedPrice
                              style="currency"
                              value={booking.grossTotal}
                              currency={currency}
                            />
                            {paidText}
                          </>
                        )}
                      </Text>
                    }
                    categoryName={formatMessage(messages.totalLabel)}
                    hideLine={!booking.additionalInformation}
                  />
                  {!!booking.additionalInformation && (
                    <BookingDetailListItem
                      categoryDetail={booking.additionalInformation}
                      categoryName={formatMessage(messages.additionalInfoLabel)}
                      hideLine
                    />
                  )}
                </List>
                <CardFooter>
                  {showCancelButton && (
                    <CancelBookingButton
                      refetch={refetch}
                      bookingId={booking.id}
                      newStatus={
                        status === 'confirmed' && !!cancellingRequiresApproval
                          ? BookingStatuses.CANCELLATION_REQUESTED
                          : BookingStatuses.CANCELED
                      }
                      needsConfirmation={cancellingRequiresApproval}
                    />
                  )}
                  <BookAgainButton
                    archived={archived}
                    onClick={this.openBooking}
                  />
                </CardFooter>
              </Card>
              {status === 'cancellation-requested' && (
                <View {...css({ padding: '10px' })}>
                  <Text color="gray" align="center" autoBreak>
                    {formatMessage(messages.explanation)}
                  </Text>
                </View>
              )}
            </View>
            <BookingOverviewTabs headers={bookingOverviewHeaders}>
              {bookingOverviewContent}
            </BookingOverviewTabs>
          </SimpleLayout>
        )}
      </Translated>
    )
  }

  renderLoading = () => (
    <SimpleLayout padded>
      <ListSpinner />
    </SimpleLayout>
  )

  render() {
    return (
      <HorizontalRouterMicroapp>
        <Responsive mobile>
          <GenericBackTitleBar onBack={this.props.onBackButtonClick} />
        </Responsive>
        <DataProvider
          key={this.props.match.params.id}
          request={{
            path: `api/v1/bookings/${this.props.match.params.id}`,
          }}
        >
          {({ isDone, result, refetch }) => {
            const { archived } = result
              ? result.entity._embedded.asset
              : { archived: null }

            return (
              <SimpleLayout>
                {isDone
                  ? this.renderBooking(result.entity, refetch, archived)
                  : this.renderLoading()}
              </SimpleLayout>
            )
          }}
        </DataProvider>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  navigateToBooking: (id: string) =>
    dispatch(push(`/booking/my-bookings/${id}`)),
  onAssetClick: (id: string) => dispatch(push(`/booking/assets/${id}`)),
  onBackButtonClick: () => dispatch(push('/booking/my-bookings')),
  onProfileClick: (id: string) => dispatch(push(`/booking/profile/${id}`)),
})

const mapStateToProps = (state: IReduxState) => ({
  userAgent: state.app.userAgent,
  isNative: state.app.embeddedLayout,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme()(injectIntl(BookingDetails)))
