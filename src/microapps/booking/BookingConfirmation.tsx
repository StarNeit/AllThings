import {
  CardList,
  FormCheckbox,
  GroupedCardList,
  ListItem,
  PhoneInput,
  Text,
  TextInput,
  View,
} from '@allthings/elements'
import { TextSizeType } from '@allthings/elements/Text'
import Translated from 'containers/Translated'
import get from 'lodash/get'
import { bignumber, MathType, multiply } from 'mathjs'
import React, { MutableRefObject } from 'react'
import {
  defineMessages,
  FormattedNumber,
  injectIntl,
  MessageDescriptor,
} from 'react-intl'
import { connect } from 'react-redux'
import { IAsset } from '.'
import { messages as sharedMessages } from './messages'
import TimeInterval from './TimeInterval'

const messages = defineMessages({
  anyComments: {
    id: 'booking-confirmation.any-comments',
    description: 'Additional comments',
    defaultMessage: 'Additional comments',
  },
  bookedForEmail: {
    id: 'booking.confirmation-booked-for-email',
    description: 'Email',
    defaultMessage: 'Email',
  },
  bookedForName: {
    id: 'booking.confirmation-booked-for-name',
    description: 'Name',
    defaultMessage: 'Name',
  },
  bookedForPhone: {
    id: 'booking.confirmation-booked-for-phone',
    description: 'Phone',
    defaultMessage: 'Phone',
  },
  bookForSomeoneElse: {
    id: 'booking.confirmation-book-for-someone-else',
    description: 'Book for someone else',
    defaultMessage: 'Book for someone else',
  },
  explanation: {
    id: 'booking.confirmation-explanation',
    description:
      'Please enter some information below about the person this booking is made for.',
    defaultMessage:
      'Please enter some information below about the person this booking is made for.',
  },
  labelAsset: {
    id: 'booking.confirmation-asset',
    description: 'Label of the asset in booking confirmation dialog',
    defaultMessage: 'Asset',
  },
  labelBasePrice: {
    id: 'booking.confirmation-base-fee',
    description: 'Label of the form that shows the total price of a booking',
    defaultMessage: 'Base fee',
  },
  labelDate: {
    id: 'booking.confirmation-date',
    description: 'Label of the date in booking confirmation dialog',
    defaultMessage: 'Date',
  },
  labelPrice: {
    id: 'booking.confirmation-price',
    description: 'Label of the form that shows the total price of a booking',
    defaultMessage: 'Price',
  },
  labelTax: {
    id: 'booking-confirmation.tax-label',
    description: 'Label for {taxRate} tax',
    defaultMessage: 'Tax ({taxRate}%)',
  },
  labelTotal: {
    id: 'booking.confirmation-total-price',
    description: 'Label of the form that shows the total price of a booking',
    defaultMessage: 'Total Price',
  },
  phoneNumber: {
    id: 'booking-confirmation.your-phone',
    description: 'Your phone',
    defaultMessage: 'Your phone',
  },
})

interface IProps {
  asset: IAsset
  containerRef: MutableRefObject<HTMLDivElement>
  end: Date
  slots: number
  start: Date
  userPhoneNumber?: string
}

interface IPriceInfo {
  readonly needsToBeDisplayed: number | boolean
  readonly label: MessageDescriptor
  readonly labelVariable?: IndexSignature
  readonly text: React.ReactElement<any> | string
  readonly textCustom?: {
    readonly color: string
    readonly size: TextSizeType
  }
}

class BookingConfirmation extends React.Component<IProps & InjectedIntlProps> {
  state = {
    bookedForSomeoneElse: false,
  }

  componentDidMount() {
    this.props.containerRef.current.scrollTop = 0
  }

  onClickBookForElse = () =>
    this.setState({ bookedForSomeoneElse: !this.state.bookedForSomeoneElse })

  formattedNumberComponent = (price: MathType) => (
    <FormattedNumber
      style="currency"
      value={price as number}
      currency={this.props.asset.currency}
    />
  )

  renderPriceBreakdown = ({
    needsToBeDisplayed,
    label,
    labelVariable,
    text,
    textCustom = { color: undefined, size: undefined },
  }: IPriceInfo) =>
    !!needsToBeDisplayed && (
      <ListItem
        data-e2e={
          get(text, 'props.style') === 'currency' &&
          get(label, 'id') === 'booking.confirmation-total-price'
            ? `total-price-${get(text, 'props.value')}-${get(
                text,
                'props.currency',
              )}`
            : ''
        }
      >
        <View flex={30}>
          <Text color="secondary">
            {this.props.intl.formatMessage(label, labelVariable)}
          </Text>
        </View>
        <View flex={70}>
          <Text color={textCustom.color} size={textCustom.size} strong>
            {text}
          </Text>
        </View>
      </ListItem>
    )

  renderBookingInfo = () => {
    const {
      asset: {
        basePrice,
        pricePerTimeSlot,
        priceOnRequest,
        taxRate,
        timeSlotUnit,
      },
      end,
      intl,
      slots,
      start,
    } = this.props
    const actualSlots = timeSlotUnit === 'night' ? slots - 1 : slots
    const priceOfAllSlots = actualSlots * pricePerTimeSlot
    const totalPriceBeforeTax = priceOfAllSlots + basePrice
    const taxRateWithPrecision = bignumber(taxRate)
    const taxPrice = multiply(totalPriceBeforeTax, taxRateWithPrecision)
    const totalPrice = totalPriceBeforeTax * (1 + taxRate)

    return [
      {
        label: messages.labelDate,
        needsToBeDisplayed: true,
        text: (
          <TimeInterval dateFrom={start} dateTo={end} type={timeSlotUnit} />
        ),
      },
      {
        label: messages.labelPrice,
        needsToBeDisplayed: priceOfAllSlots,
        text: this.formattedNumberComponent(priceOfAllSlots),
      },
      {
        label: messages.labelBasePrice,
        needsToBeDisplayed: basePrice,
        text: this.formattedNumberComponent(basePrice),
      },
      {
        label: messages.labelTax,
        labelVariable: {
          taxRate: multiply(100, taxRateWithPrecision).toString(),
        },
        needsToBeDisplayed: taxRate,
        text: this.formattedNumberComponent(taxPrice),
      },
      {
        label: messages.labelTotal,
        needsToBeDisplayed: true,
        text: priceOnRequest
          ? intl.formatMessage(sharedMessages.priceOnRequest)
          : this.formattedNumberComponent(totalPrice),
        textCustom: { color: 'primary', size: 'xl' as TextSizeType },
      },
    ].map((priceInfo: IPriceInfo) => this.renderPriceBreakdown(priceInfo))
  }

  renderBookForSomeoneElse = () => {
    if (!this.state.bookedForSomeoneElse) {
      return null
    }
    const phoneStyle = {
      color: '#000000',
    }
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <GroupedCardList title={formatMessage(messages.explanation)}>
        <TextInput
          required
          name="bookedForName"
          label={formatMessage(messages.bookedForName)}
          placeholder={formatMessage(messages.bookedForName)}
        />
        <TextInput
          required
          type="email"
          name="bookedForEmail"
          label={formatMessage(messages.bookedForEmail)}
          placeholder={formatMessage(messages.bookedForEmail)}
        />
        <PhoneInput
          required
          type="tel"
          name="bookedForPhone"
          placeholder={formatMessage(messages.bookedForPhone)}
          label={formatMessage(messages.bookedForPhone)}
          style={phoneStyle}
        />
      </GroupedCardList>
    )
  }

  render() {
    const {
      asset: { defaultLocale, translations, phoneNumberRequired },
      intl: { formatMessage },
      userPhoneNumber,
    } = this.props

    const phoneStyle = {
      color: '#000000',
    }

    return (
      <CardList>
        <ListItem>
          <View flex={30}>
            <Text color="secondary">{formatMessage(messages.labelAsset)}</Text>
          </View>
          <View flex={70}>
            <Translated values={translations} defaultLocale={defaultLocale}>
              {({ name }) => <Text strong>{name}</Text>}
            </Translated>
          </View>
        </ListItem>
        {this.renderBookingInfo()}
        <TextInput
          name="message"
          placeholder={formatMessage(messages.anyComments)}
          lines={6}
          data-e2e="booking-commends"
        />
        {phoneNumberRequired !== false && (
          <PhoneInput
            name="phoneNumber"
            type="tel"
            defaultValue={userPhoneNumber}
            data-e2e="booking-phonenumber"
            placeholder={formatMessage(messages.phoneNumber)}
            label={formatMessage(messages.phoneNumber)}
            style={phoneStyle}
            required
          />
        )}
        <FormCheckbox
          label={formatMessage(messages.bookForSomeoneElse)}
          name="bookedForSomeoneElse"
          onChange={this.onClickBookForElse}
          checked={this.state.bookedForSomeoneElse}
        />
        {this.renderBookForSomeoneElse()}
      </CardList>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  userPhoneNumber: state.authentication.user.phoneNumber,
})

export default connect(mapStateToProps)(injectIntl(BookingConfirmation))
