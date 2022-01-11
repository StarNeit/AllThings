import React from 'react'
import { connect } from 'react-redux'

import {
  injectIntl,
  defineMessages,
  FormattedNumber,
  FormattedMessage,
} from 'react-intl'
import { View, Inset, Pill, Spacer, Text } from '@allthings/elements'
import UserProfileImage from 'components/UserProfileImage'
import RichMediaHtmlContent from 'components/RichMediaHtmlContent'
import TimeSlot from './TimeSlot'
import FormattedPrice from './FormattedPrice'
import { css } from 'glamor'
import { TimeSlotType } from '.'
import BookingActions from 'store/actions/booking'
import {
  AVAILABLES_FETCH_SIZE,
  getFirstDayOfVisibleCalendarMonth,
} from './Utils'
import { adjustFrontendTimeToApiTime } from 'utils/date'

const messages = defineMessages({
  needsPayment: {
    id: 'asset.payment-required-pill',
    description: 'Label for pill that states payment is required',
    defaultMessage: 'Prepayment required',
  },
})

interface IOwnProps {
  readonly contactPerson: IUser
  readonly description: string
  readonly location?: string
  readonly name: string
  readonly onProfileClick: OnClick
  readonly terms?: string
  readonly pricePerTimeSlot: number
}

interface IAssetProps {
  readonly id: string
  readonly basePrice: number
  readonly currency: string
  readonly needsPayment?: boolean
  readonly timeSlotUnit: TimeSlotType
  readonly priceOnRequest: boolean
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  IOwnProps &
  IAssetProps &
  IAssetProps

class Asset extends React.Component<Props & InjectedIntlProps> {
  componentDidMount() {
    this.props.fetchAvailables(
      this.props.id,
      adjustFrontendTimeToApiTime(
        getFirstDayOfVisibleCalendarMonth(
          this.props.preferredBookingRange.date || new Date(),
        ),
      ),
      AVAILABLES_FETCH_SIZE,
    )
  }

  componentWillUnmount() {
    this.props.clearAvailables()
  }

  handleProfileClick = () =>
    this.props.onProfileClick(this.props.contactPerson.id)

  render() {
    const {
      basePrice,
      contactPerson,
      currency,
      description,
      intl: { formatMessage },
      location,
      name,
      needsPayment,
      pricePerTimeSlot,
      terms,
      timeSlotUnit,
      priceOnRequest,
    } = this.props
    const mainPrice = pricePerTimeSlot || basePrice || 0
    const mainTimeSlot = pricePerTimeSlot
      ? timeSlotUnit
      : basePrice
      ? 'base'
      : ''

    return (
      <Inset>
        <Spacer />
        <View direction="row" flex="flex">
          <View flex="flex" direction="column">
            <Text strong size="giant">
              <RichMediaHtmlContent html={name} />
            </Text>
            {needsPayment && (
              <View {...css({ marginTop: '10px' })}>
                <Pill label={formatMessage(messages.needsPayment)} />
              </View>
            )}
            <Spacer />
            <View direction="row" alignV="center">
              <UserProfileImage
                onClick={this.handleProfileClick}
                profileImage={contactPerson._embedded.profileImage}
                size="s"
                style={{ cursor: 'pointer' }}
              />
              <View style={{ paddingLeft: 8 }}>
                <Text strong size="s">
                  {contactPerson.username}
                </Text>
              </View>
            </View>
          </View>
          <View direction="column" alignV="end">
            {priceOnRequest ? (
              <Text strong size="giant" color="primary">
                <FormattedMessage
                  id="booking.asset.price-on-request"
                  description="Text to show when the asset's price is determined on request"
                  defaultMessage="on request"
                />
              </Text>
            ) : (
              <>
                <Text strong size="giant" color="primary">
                  <FormattedPrice
                    style="currency"
                    value={mainPrice}
                    currency={currency}
                  />
                </Text>
                {!!mainPrice && (
                  <TimeSlot
                    strong
                    size="s"
                    color="greyIntense"
                    timeSlot={mainTimeSlot}
                  />
                )}
              </>
            )}

            {!!pricePerTimeSlot && !!basePrice && (
              <>
                <Text strong size="xl" color="primary">
                  <FormattedNumber
                    style="currency"
                    value={basePrice}
                    currency={currency}
                  />
                </Text>
                <Text strong size="s" color="greyIntense">
                  <FormattedMessage
                    id="booking.asset.base-fee"
                    description="base fee of a bookable asset"
                    defaultMessage="base fee"
                  />
                </Text>
              </>
            )}
          </View>
        </View>
        <Spacer />
        <Text strong size="xl">
          <FormattedMessage
            id="booking.asset.description"
            description="Description"
            defaultMessage="Description"
          />
        </Text>
        <Text>
          <RichMediaHtmlContent html={description} />
        </Text>
        <Spacer />
        <Text strong size="xl">
          <FormattedMessage
            id="booking.asset.address"
            description="Address"
            defaultMessage="Address"
          />
        </Text>
        <Text>
          <RichMediaHtmlContent html={location} />
        </Text>
        {terms && (
          <View>
            <Spacer />
            <Text strong size="xl">
              <FormattedMessage
                id="booking.asset.conditions"
                description="Payment and terms"
                defaultMessage="Payment and terms"
              />
            </Text>
            <Text>
              <RichMediaHtmlContent html={terms} />
            </Text>
          </View>
        )}
      </Inset>
    )
  }
}

const mapStateToProps = ({ booking }: IReduxState) => ({
  preferredBookingRange: booking.preferredBookingRange,
})
const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  refetchBookings: () => dispatch(BookingActions.shouldRefetch(true)),
  fetchAvailables: (assetId: string, startDate: Date, nrOfDays: number) =>
    dispatch(BookingActions.fetchAvailables(assetId, startDate, nrOfDays)),
  clearAvailables: () => dispatch(BookingActions.clearAvailables()),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Asset))
