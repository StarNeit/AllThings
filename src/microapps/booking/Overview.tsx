import React from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import { push } from 'connected-react-router'
import {
  View,
  Text,
  GroupTitle,
  SimpleLayout,
  GroupedCardList,
  ListIcon,
  Inset,
  ListSpinner,
  ChevronRightListItem,
} from '@allthings/elements'
import BookingActions from 'store/actions/booking'
import Localized from 'containers/Localized'
import CategoryListItem from 'microapps/booking/CategoryListItem'
import AssetList from './AssetList'
import { renderAssetsOnFirstPage } from 'microapps/booking'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { MicroApps } from '../../enums'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'

const i18n = defineMessages({
  myBookings: {
    id: 'booking.overview.my-bookings',
    description: 'My Bookings',
    defaultMessage: 'My Bookings',
  },
  heroText: {
    id: 'booking.overview.hero-text',
    description: 'Text of the booking hero.',
    defaultMessage: 'Book rooms and equipment close to you!',
  },
  bookByCategories: {
    id: 'booking.overview.book-by-categories',
    description: 'Book by categories',
    defaultMessage: 'Book by Categories',
  },
  allCategories: {
    id: 'booking.overview.all-categories',
    description: 'All Categories',
    defaultMessage: 'All Categories',
  },
})

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

class Overview extends React.Component<Props & InjectedIntlProps> {
  componentDidMount() {
    this.props.openOverview()
    this.props.fetchOneAsset()
  }

  renderMyBookings = () => (
    <GroupedCardList title="">
      <ChevronRightListItem onClick={this.props.onBookingsClick}>
        <View direction="row" alignV="center">
          <ListIcon iconColor="white" name="calendar-check" />
          <Inset>
            <Text>{this.props.intl.formatMessage(i18n.myBookings)}</Text>
          </Inset>
        </View>
      </ChevronRightListItem>
    </GroupedCardList>
  )
  renderTitleBar = () => (
    <MicroappBigTitleBar
      type={MicroApps.BOOKING}
      subTitle={this.props.intl.formatMessage(i18n.heroText)}
      isTwoColumnLayout
    />
  )

  renderFewAssetsView = () => (
    <SimpleLayout>
      {this.renderTitleBar()}
      {this.renderMyBookings()}
      <GroupTitle>
        <FormattedMessage
          id="booking.all-assets"
          description="All assets"
          defaultMessage="All assets"
        />
      </GroupTitle>
      <AssetList />
    </SimpleLayout>
  )

  renderDefaultView = () => {
    const {
      loading,
      categories,
      onAllAssetsClick,
      onCategoryClick,
    } = this.props
    return (
      <SimpleLayout>
        {this.renderTitleBar()}
        {this.renderMyBookings()}
        <GroupedCardList
          title={this.props.intl.formatMessage(i18n.bookByCategories)}
        >
          {!loading && categories.length > 1 && (
            <CategoryListItem
              data-e2e={`booking-category-all`}
              icon="list-bullets-filled"
              name={this.props.intl.formatMessage(i18n.allCategories)}
              onCategoryClick={onAllAssetsClick}
            />
          )}
          {!loading &&
            categories.map((category, i) => (
              <CategoryListItem
                data-e2e={`booking-category-${i}`}
                icon="list-bullets-filled"
                name={<Localized messages={category.name} />}
                key={category.id}
                categoryKey={category.id}
                onCategoryClick={onCategoryClick}
              />
            ))}
        </GroupedCardList>
        {loading && <ListSpinner />}
      </SimpleLayout>
    )
  }

  render() {
    const { loading, numberOfAssets } = this.props

    return (
      <HorizontalRouterMicroapp>
        <View direction="column" flex="flex">
          {loading ? (
            <SimpleLayout>
              <ListSpinner />
            </SimpleLayout>
          ) : renderAssetsOnFirstPage({ numberOfAssets }) ? (
            this.renderFewAssetsView()
          ) : (
            this.renderDefaultView()
          )}
        </View>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  customSettings: state.app.config.customSettings,
  categories: state.booking.categories.items,
  loading: state.booking.categories.loading,
  numberOfAssets: state.booking.numberOfAssets,
})
const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  fetchOneAsset: () => dispatch(BookingActions.fetchOneAsset()),
  openOverview: () => dispatch(BookingActions.openOverview()),
  onAllAssetsClick: () => dispatch(push('/booking/assets/all')),
  onCategoryClick: (category: string) =>
    dispatch(push(`/booking/assets/${category}`)),
  onBookingsClick: () => dispatch(push('/booking/my-bookings')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(Overview))
