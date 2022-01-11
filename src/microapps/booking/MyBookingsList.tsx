import {
  GroupedCardList,
  ListSpinner,
  Relative,
  SimpleLayout,
} from '@allthings/elements'
import SlideIn from 'components/SlideIn'
import { push } from 'connected-react-router'
import PagedDataProvider, { IData } from 'containers/PagedDataProvider'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import parseISO from 'date-fns/parseISO'
import BookingListItem from 'microapps/booking/BookingListItem'
import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import BookingActions from 'store/actions/booking'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { IBooking } from '.'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const messages = defineMessages({
  upcomingBookings: {
    id: 'booking.my-booking-list.upcoming-bookings',
    description: 'Upcoming bookings',
    defaultMessage: 'Upcoming bookings',
  },
  pastBookings: {
    id: 'booking.my-booking-list.past-bookings',
    description: 'Past bookings',
    defaultMessage: 'Past bookings',
  },
})

interface IProps {
  id: string
  isLoadingMore?: () => void
  onBackButtonClick: OnClick
  onBookingClick: OnClick
  setNoRefetch?: () => void
  shouldRefetch?: boolean
  userId: string
}

class MyBookingsList extends React.Component<IProps & InjectedIntlProps> {
  groupByUpcomingAndPast = (pages: ReadonlyArray<IBooking>) =>
    pages
      .reduce((bookings, booking) => bookings.concat(booking), [])
      .reduce(
        (grouped, booking) => {
          if (
            isBefore(new Date(), parseISO(booking.dateFrom)) ||
            isSameDay(parseISO(booking.dateFrom), new Date())
          ) {
            grouped.upcoming.push(booking)
          } else {
            grouped.past.push(booking)
          }
          return grouped
        },
        { upcoming: [], past: [] },
      )

  renderList = (bookings: ReadonlyArray<IBooking>) =>
    bookings.map(booking => (
      <BookingListItem
        active={booking.id === this.props.id}
        key={booking.id}
        booking={booking}
        onBookingClick={this.props.onBookingClick}
      />
    ))

  renderContent = ({ pages, fetchNext, loading, refetch }: IData) => {
    const { upcoming, past } = this.groupByUpcomingAndPast(pages)
    const { formatMessage } = this.props.intl

    return (
      <SimpleLayout onScrollEnd={fetchNext} onPullDown={refetch}>
        <Relative>
          <SlideIn in={loading}>
            <ListSpinner />
          </SlideIn>
          {upcoming.length > 0 && (
            <GroupedCardList title={formatMessage(messages.upcomingBookings)}>
              {this.renderList(upcoming)}
            </GroupedCardList>
          )}
          {past.length > 0 && (
            <GroupedCardList title={formatMessage(messages.pastBookings)}>
              {this.renderList(past)}
            </GroupedCardList>
          )}
          {pages.length > 0 && loading && <ListSpinner />}
        </Relative>
      </SimpleLayout>
    )
  }

  render() {
    const { userId, onBackButtonClick } = this.props
    return (
      <HorizontalRouterMicroapp>
        <GenericBackTitleBar onBack={onBackButtonClick} />
        <PagedDataProvider
          path={`api/v1/users/${userId}/bookings`}
          params={{ 'sort-by': 'dateFrom', 'sort-direction': 'desc' }}
          onRefetch={this.props.setNoRefetch}
          shouldRefetch={this.props.shouldRefetch}
        >
          {this.renderContent}
        </PagedDataProvider>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  id: state.router.location.pathname.split('/')[3],
  userId: state.authentication.user.id,
  shouldRefetch: state.booking.shouldRefetch,
})
const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  onBackButtonClick: () => dispatch(push('/booking')),
  onBookingClick: (id: string) => dispatch(push(`/booking/my-bookings/${id}`)),
  setNoRefetch: () => dispatch(BookingActions.shouldRefetch(false)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(MyBookingsList))
