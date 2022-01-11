import {
  Form,
  HorizontalView,
  Inset,
  SimpleLayout,
  SquareIconButton,
  Text,
  View,
} from '@allthings/elements'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import { CustomTitleBar } from 'components/TitleBar'
import withRequest, { IWithRequest } from 'containers/withRequest'
import withStripePaymentSessionCreator, {
  IInjectedStripeCreator,
} from 'containers/withStripePaymentSessionCreator'
import isSameDay from 'date-fns/isSameDay'
import BookingHourPicker from 'microapps/booking/BookingHourPicker'
import React from 'react'
import { Gateway } from 'react-gateway'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BookingActions from 'store/actions/booking'
import { storeCookie } from 'utils/cookie'
import { adjustFrontendTimeToApiTime } from 'utils/date'
import getServiceHost from 'utils/getServiceHost'
import sendNativeEvent from 'utils/sendNativeEvent'
import { IAsset, IAvailability, TimeUnit } from '.'
import { PaymentStatus } from '../../enums'
import BookingConfirmation from './BookingConfirmation'
import BookingDayNightPicker from './BookingDayNightPicker'
import BookingFailure from './BookingFailure'
import BookingOverlaySubmitButton from './BookingOverlaySubmitButton'
import BookingQuarterHourPicker from './BookingQuarterHourPicker'
import BookingSuccess from './BookingSuccess'
import { messages as sharedMessages } from './messages'
import PaymentStarter from './PaymentStarter'
import PaymentWaiting from './PaymentWaiting'
import {
  AVAILABLES_FETCH_SIZE,
  getFirstDayOfVisibleCalendarMonth,
} from './Utils'

const messages = defineMessages({
  selectCheckoutDate: {
    id: 'booking-overlay.select-checkout-date',
    description: 'Select at least one more day for check-out.',
    defaultMessage: 'Select at least one more day for check-out.',
  },
  selectDates: {
    id: 'booking-overlay.select-dates',
    description: 'Select the dates you would like to book',
    defaultMessage: 'Select the dates you would like to book',
  },
  selectAtLeast: {
    id: 'booking-overlay.select-atleast',
    description: `Select at least {min} days for this asset`,
    defaultMessage: `Select at least {min} days for this asset`,
  },
  selectADate: {
    id: 'booking-overlay.select-a-date',
    description: 'Select a date to book',
    defaultMessage: 'Select a date to book',
  },
  selectTheHours: {
    id: 'booking-overlay.select-the-hours',
    description: 'Select the hours you would like to book',
    defaultMessage: 'Select the hours you would like to book',
  },
  selectAtLeastHours: {
    id: 'booking-overlay.select-at-least-hours',
    description: `Select at least {minTimeSlot} hours`,
    defaultMessage: `Select at least {minTimeSlot} hours`,
  },
  selectTheQuarterHours: {
    id: 'booking-overlay.select-the-quarter-hours',
    description: 'Select the quarter-hours you would like to book',
    defaultMessage: 'Select the quarter-hours you would like to book',
  },
  selectAtLeastQuarterHours: {
    id: 'booking-overlay.select-at-least-quarter-hours',
    description: `Select at least {minTimeSlot} quarter-hours`,
    defaultMessage: `Select at least {minTimeSlot} quarter-hours`,
  },
  bookThisTimeFrame: {
    id: 'booking-overlay.book-this-time-frame',
    description: `Book this timeframe`,
    defaultMessage: `Book this timeframe ({totalPrice})`,
  },
  payThisBooking: {
    id: 'booking-overlay.pay-now',
    description: `Label of the pay-now button`,
    defaultMessage: `Pay now ({totalPrice})`,
  },
  bookingForYou: {
    id: 'booking-overlay.booking-for-you',
    description: 'Booking for you…',
    defaultMessage: 'Booking for you…',
  },
  freeAssetPrice: {
    id: 'booking-overlay.asset-is-free',
    description: 'display free if asset has no fees',
    defaultMessage: 'free',
  },
})

interface IBookingFormFields {
  message: string
  phoneNumber: string
  bookedForSomeoneElse: string
  bookedForName: string
  bookedForEmail: string
  bookedForPhone: string
}

interface IBooking {
  id: string
  accessToken?: string
  dateFrom: Date
  dateTo: Date
  message: string
  phoneNumber: string
  bookedForSomeoneElse: boolean
  bookedFor: {
    name: string
    email: string
    phoneNumber: string
  }
}

interface IProps {
  asset: IAsset
  availables: ReadonlyArray<IAvailability>
  clearAvailables: () => void
  fetchAvailables: (assetId: string, startDate: Date, nrOfDays: number) => void
  isLoading: boolean
  isNative: boolean
  locale: string
  navigateToBooking: (id: string) => void
  onRequestClose: () => void
  paymentLogoUrl?: string
  paymentTitle?: string
  refetchBookings: () => void
  storeAccessToken: string
  theme: ITheme
  appHostname: string
  preferredBookingRange: {
    date: Date
    timeFrom: string
    timeTo: string
  }
  paymentSessionId?: string
  stripePublishableKey?: string
  paymentStatus?: PaymentStatus
  paidBookingId?: string
  setPreferredBookingTimes: ({}) => void
}

interface IState {
  resetOverlayState: number
  showFeedbackScreen: boolean
  showConfirmation: boolean
  showTimePicker: boolean
  showPaymentWaiting: boolean
  showPaymentStarter: boolean
  start: Date
  end: Date
  slots: number
  saving: boolean
  hasError: boolean
  confirmationErrorMsg: string
  selectedDate: Date
  paymentStatus: PaymentStatus
  paymentSessionId: string
  stripePublishableKey: string
  /**
   * raise the red flags for the theoretically impossible scenario
   * which is us not being able to create a booking but still collecting the money from Stripe
   */
  redFlags: boolean
}
class BookingOverlay extends React.PureComponent<
  IProps &
    InjectedIntlProps &
    RouteComponentProps &
    IInjectedStripeCreator &
    IWithRequest,
  IState
> {
  getInitialState = (): IState => ({
    showFeedbackScreen: false,
    showConfirmation: false,
    showTimePicker: true,
    showPaymentStarter: false,
    showPaymentWaiting: false,
    start: undefined,
    end: undefined,
    slots: 0,
    saving: false,
    hasError: false,
    resetOverlayState: 0,
    confirmationErrorMsg: '',
    selectedDate: this.props.preferredBookingRange.date || new Date(),
    paymentStatus: PaymentStatus.PENDING_MANUAL,
    paymentSessionId: null,
    stripePublishableKey: null,
    redFlags: false,
  })

  state = this.getInitialState()
  containerRef = React.createRef<HTMLDivElement>()

  booking: IBooking = null

  componentDidMount() {
    if (this.props.paymentSessionId) {
      const isSuccessful = this.props.paymentStatus === PaymentStatus.SUCCESS

      if (isSuccessful) {
        this.onPaymentStatusChange(
          this.props.paidBookingId,
          this.props.paymentStatus,
        )
      } else {
        this.setState({
          paymentStatus: PaymentStatus.PENDING_STRIPE,
          showPaymentWaiting: true,
          paymentSessionId: this.props.paymentSessionId,
          stripePublishableKey: this.props.stripePublishableKey,
        })
      }

      return
    }

    this.props.fetchAvailables(
      this.props.asset.id,
      getFirstDayOfVisibleCalendarMonth(
        this.props.preferredBookingRange.date || new Date(),
      ),
      AVAILABLES_FETCH_SIZE,
    )
  }

  // tslint:disable:variable-name
  componentDidUpdate(_prevProps: IProps, prevState: IState) {
    if (
      !isSameDay(
        getFirstDayOfVisibleCalendarMonth(prevState.selectedDate),
        getFirstDayOfVisibleCalendarMonth(this.state.selectedDate),
      )
    ) {
      const { fetchAvailables } = this.props
      fetchAvailables(
        this.props.asset.id,
        getFirstDayOfVisibleCalendarMonth(this.state.selectedDate),
        AVAILABLES_FETCH_SIZE,
      )
    }
  }

  handleClose = () => {
    if (this.booking && this.booking.id) {
      this.props.navigateToBooking(this.booking.id)
      this.props.refetchBookings()
    }
    this.props.onRequestClose()
  }

  handleReset = () => {
    this.props.clearAvailables()
    this.props.fetchAvailables(
      this.props.asset.id,
      getFirstDayOfVisibleCalendarMonth(
        this.props.preferredBookingRange.date || new Date(),
      ),
      AVAILABLES_FETCH_SIZE,
    )
    this.props.setPreferredBookingTimes({
      date: this.isDailyOrNightly()
        ? null
        : this.props.preferredBookingRange.date,
      timeFrom: null,
      timeTo: null,
    })
    this.setState(state => ({
      ...this.getInitialState(),
      resetOverlayState: state.resetOverlayState + 1,
    }))
  }

  isDailyOrNightly = () =>
    this.props.asset.timeSlotUnit === 'day' ||
    this.props.asset.timeSlotUnit === 'night'
  isDaily = () => this.props.asset.timeSlotUnit === 'day'
  isNightly = () => this.props.asset.timeSlotUnit === 'night'
  isHourly = () => this.props.asset.timeSlotUnit === 'hour'
  isQuarterHourly = () => this.props.asset.timeSlotUnit === 'quarter-hour'

  handleClickConfirmationButton = (e: MouseEvent) => {
    const { showConfirmation } = this.state
    if (!showConfirmation) {
      e.preventDefault()
      this.setState({ showConfirmation: true })
      this.setState({ showTimePicker: false })
    }
  }

  handleBackButton = () => {
    if (this.state.showConfirmation) {
      this.setState({ showConfirmation: false })
      this.setState({ showTimePicker: true })
    }
  }

  createProcessBookingWithPayment = async (entity: Partial<IBooking>) => {
    const {
      sessionId,
      stripePublishableKey,
    } = await this.props.createStripeSession(
      'booking',
      this.props.asset.id,
      entity,
    )

    if (sessionId != null) {
      storeCookie(sessionId, `/booking/assets/all/${this.props.asset.id}`, 0)
      this.setState({
        showPaymentStarter: true,
        showConfirmation: false,
        paymentSessionId: sessionId,
        stripePublishableKey,
      })
    } else {
      this.setState({
        hasError: true,
        showConfirmation: false,
        showFeedbackScreen: true,
        saving: false,
      })
    }
  }

  processBooking = async (entity: Partial<IBooking>): Promise<void> => {
    const response = await this.props.createRequest({
      method: 'POST',
      path: `api/v1/assets/${this.props.asset.id}/bookings`,
      entity,
    })

    this.setState({
      hasError: response.status.code !== 201,
      showConfirmation: false,
      showFeedbackScreen: true,
      saving: false,
    })

    if (response.status.code === 201) {
      this.booking = response.entity
    }
  }

  handleFormSubmit = async (
    _: any,
    {
      message,
      phoneNumber,
      bookedForSomeoneElse,
      bookedForName,
      bookedForEmail,
      bookedForPhone,
    }: IBookingFormFields,
  ) => {
    if (this.state.saving) {
      return
    }

    this.setState({ saving: true })
    try {
      const entity = {
        dateFrom: adjustFrontendTimeToApiTime(this.state.start),
        dateTo: adjustFrontendTimeToApiTime(this.state.end),
        message,
        phoneNumber,
        bookedForSomeoneElse: bookedForSomeoneElse === 'true',
        bookedFor: {
          name: bookedForName,
          email: bookedForEmail,
          phoneNumber: bookedForPhone,
        },
      }

      await (this.props.asset.needsPayment
        ? this.createProcessBookingWithPayment
        : this.processBooking)(entity)
    } catch (e) {
      this.setState({
        saving: false,
        showConfirmation: true,
      })
    }
  }

  renderForm() {
    const bookingSteps = this.addStartPaymentStep(
      this.addPaymentWaitingStep(
        this.addErrorStep(
          this.addSuccessStep(
            this.addConfirmationStep(
              this.addPickerByType(this.props.asset.timeSlotUnit)([]),
            ),
          ),
        ),
      ),
    )

    return (
      <Form onSubmit={this.handleFormSubmit}>
        <HorizontalView alignV="start">
          {bookingSteps.map((step: JSX.Element) => (
            <View
              key={step.key}
              style={{
                height: '100%',
              }}
            >
              {step}
            </View>
          ))}
        </HorizontalView>
        {!this.state.showFeedbackScreen &&
          !this.state.showPaymentStarter &&
          !this.state.showPaymentWaiting &&
          this.renderConfirmationButton()}
      </Form>
    )
  }

  shouldDisableBookingButton = () => {
    const {
      asset: { minTimeSlot },
    } = this.props
    const { slots, showFeedbackScreen, saving } = this.state
    return (
      saving ||
      (!showFeedbackScreen && this.isDailyOrNightly()
        ? this.isNightly()
          ? slots === 0 || slots === 1 || slots < minTimeSlot + 1
          : // if daily asset
            slots === 0 || slots < minTimeSlot
        : this.isHourly() || this.isQuarterHourly()
        ? slots === 0 || slots < minTimeSlot
        : false)
    )
  }

  getValidationMessage = () => {
    const {
      asset: { minTimeSlot },
      intl: { formatMessage },
    } = this.props
    const { slots } = this.state
    const validationMessage = this.isDailyOrNightly()
      ? this.isNightly()
        ? slots === 0
          ? formatMessage(messages.selectDates)
          : slots === 1
          ? formatMessage(messages.selectCheckoutDate)
          : slots < minTimeSlot + 1
          ? formatMessage(messages.selectAtLeast, {
              min: minTimeSlot + 1,
            })
          : false
        : // if daily asset
        slots === 0
        ? formatMessage(messages.selectDates)
        : slots < minTimeSlot
        ? formatMessage(messages.selectAtLeast, {
            min: minTimeSlot,
          })
        : false
      : this.isHourly()
      ? this.validateHourlyQuarterly(slots, 'Hours')
      : this.isQuarterHourly()
      ? this.validateHourlyQuarterly(slots, 'QuarterHours')
      : false
    return validationMessage
  }

  validateHourlyQuarterly = (length: number, interval: string) => {
    const {
      asset: { minTimeSlot },
      intl: { formatMessage },
    } = this.props
    return !length
      ? formatMessage(messages[`selectThe${interval}`])
      : length < minTimeSlot
      ? formatMessage(messages[`selectAtLeast${interval}`], { minTimeSlot })
      : false
  }

  setConfirmationErrMsg = (confirmationErrorMsg: string) =>
    this.setState({ confirmationErrorMsg })

  handlePickerChange = ({
    start,
    end,
    slots,
  }: {
    start: Date
    end: Date
    slots: number
  }) => {
    this.setState({ start, end, slots })
  }

  calculatePrice = ({
    basePrice,
    pricePerTimeSlot,
    taxRate,
  }: {
    basePrice: number
    pricePerTimeSlot: number
    taxRate: number
  }) => {
    const { slots } = this.state
    const actualSlots = this.isNightly() ? slots - 1 : slots
    const priceBeforeTax = actualSlots * pricePerTimeSlot + basePrice
    const priceAfterTax = priceBeforeTax * (1 + taxRate)
    return priceAfterTax
  }

  formatPrice = (asset: IAsset) => {
    const {
      intl: { formatMessage, formatNumber },
      asset: { priceOnRequest },
    } = this.props
    const price = this.calculatePrice(asset)

    return priceOnRequest
      ? this.props.intl.formatMessage(sharedMessages.priceOnRequest)
      : price === 0
      ? formatMessage(messages.freeAssetPrice)
      : formatNumber(price, {
          style: 'currency',
          currency: asset.currency,
        })
  }

  renderConfirmationButton = () => {
    const {
      asset,
      asset: { needsPayment },
      intl: { formatMessage },
    } = this.props
    const { saving, showConfirmation } = this.state

    const bookingButtonMessage =
      this.getValidationMessage() ||
      formatMessage(
        needsPayment ? messages.payThisBooking : messages.bookThisTimeFrame,
        {
          totalPrice: this.formatPrice(asset),
        },
      )

    return (
      <BookingOverlaySubmitButton
        disabled={this.shouldDisableBookingButton()}
        type={showConfirmation ? 'submit' : 'button'}
        onClick={this.handleClickConfirmationButton}
        active={saving}
        activeLabel={formatMessage(messages.bookingForYou)}
        label={bookingButtonMessage}
      />
    )
  }

  getPickerByType = (type: string) => {
    switch (type) {
      case 'day':
      case 'night':
        return BookingDayNightPicker
      case 'hour':
        return BookingHourPicker
      case 'quarter-hour':
      default:
        return BookingQuarterHourPicker
    }
  }

  handleDateChange = (date: Date) => {
    this.setState({ selectedDate: date })
  }

  addPickerByType = (type: TimeUnit) => (steps: ReadonlyArray<JSX.Element>) => {
    if (this.state.showTimePicker) {
      const Picker = this.getPickerByType(type)

      return steps.concat(
        <Picker
          key="picker"
          availables={this.props.availables}
          availableTimeSlots={
            this.props.asset.availableTimeSlots as IndexSignature
          }
          onChange={this.handlePickerChange}
          initialDay={
            this.props.preferredBookingRange.date ||
            (this.isDailyOrNightly() ? null : new Date())
          }
          onDateChange={this.handleDateChange}
          isLoading={this.props.isLoading}
          type={type}
          preferredBookingRange={this.props.preferredBookingRange}
        />,
      )
    } else {
      return steps
    }
  }

  handleClickAddToCalendar = () => {
    const { id, accessToken } = this.booking
    const { appHostname, isNative, storeAccessToken } = this.props
    const host = getServiceHost(appHostname)
    if (isNative) {
      sendNativeEvent(storeAccessToken, {
        name: 'booking-calendar',
        data: this.booking,
      })
    } else {
      window.open(
        `https://${host}/api/v1/bookings/${id}/ical?booking_access_token=${accessToken}&inline=true`,
      )
    }
  }

  addSuccessStep = (steps: ReadonlyArray<JSX.Element>) => {
    if (this.state.showFeedbackScreen) {
      return steps.concat(
        <BookingSuccess
          asset={this.props.asset}
          goToMyBookings={this.handleClose}
          onClickAddToCalendar={this.handleClickAddToCalendar}
          onClickBookAgain={this.handleReset}
        />,
      )
    } else {
      return steps
    }
  }

  addErrorStep = (steps: ReadonlyArray<JSX.Element>) => {
    if (this.state.hasError) {
      return steps.concat(
        <BookingFailure
          restartDatePickerProcess={this.handleReset}
          redFlags={this.state.redFlags}
        />,
      )
    } else {
      return steps
    }
  }

  addConfirmationStep = (steps: ReadonlyArray<JSX.Element>) => {
    if (this.state.showConfirmation) {
      return steps.concat(
        <BookingConfirmation
          start={this.state.start}
          end={this.state.end}
          slots={this.state.slots}
          asset={this.props.asset}
          containerRef={this.containerRef}
        />,
      )
    } else {
      return steps
    }
  }

  onPaymentStart = () => {
    if (this.state.showPaymentStarter) {
      this.setState({
        paymentStatus: PaymentStatus.PENDING_STRIPE,
        showPaymentStarter: false,
        showPaymentWaiting: true,
      })
    }
  }

  addStartPaymentStep = (steps: readonly JSX.Element[]) => {
    if (this.state.showPaymentStarter) {
      return steps.concat(
        <PaymentStarter
          paymentSessionId={this.state.paymentSessionId}
          stripePublishableKey={this.state.stripePublishableKey}
          onPaymentStart={this.onPaymentStart}
        />,
      )
    } else {
      return steps
    }
  }

  onPaymentStatusChange = async (
    bookingId: string,
    paymentStatus: PaymentStatus,
  ) => {
    this.setState({
      paymentStatus,
      redFlags: paymentStatus === PaymentStatus.MANUAL_ACTION_NEEDED,
      hasError:
        paymentStatus === PaymentStatus.FAILURE ||
        paymentStatus === PaymentStatus.CANCELLED ||
        paymentStatus === PaymentStatus.ABANDONED ||
        paymentStatus === PaymentStatus.MANUAL_ACTION_NEEDED,
      showFeedbackScreen: paymentStatus === PaymentStatus.SUCCESS,
      showPaymentWaiting: false,
    })

    this.booking = (
      await this.props.createRequest({
        method: 'GET',
        path: `api/v1/bookings/${bookingId}`,
      })
    ).entity
  }

  addPaymentWaitingStep = (steps: readonly JSX.Element[]) => {
    if (this.state.showPaymentWaiting) {
      return steps.concat(
        <PaymentWaiting
          onStatusChange={this.onPaymentStatusChange}
          paymentStatus={this.state.paymentStatus}
          paymentSessionId={this.state.paymentSessionId}
          stripePublishableKey={this.state.stripePublishableKey}
          onBack={this.props.onRequestClose}
        />,
      )
    } else {
      return steps
    }
  }

  render() {
    const { slots } = this.state

    return (
      <Gateway into="root">
        <Overlay
          theme={this.props.theme}
          direction="row"
          alignH="center"
          alignV="stretch"
          onBackgroundClick={this.handleClose}
          key={this.state.resetOverlayState}
        >
          <OverlayWindow>
            <CustomTitleBar alignH="space-between">
              {this.state.showConfirmation && (
                <SquareIconButton
                  icon="arrow-left-filled"
                  iconSize={14}
                  onClick={this.handleBackButton}
                />
              )}
              <Inset>
                <Text strong>
                  {this.state.showFeedbackScreen ||
                  this.state.showPaymentStarter ||
                  this.state.showPaymentWaiting ? (
                    ''
                  ) : this.state.showConfirmation ? (
                    <FormattedMessage
                      id="booking.confirm-title"
                      description="Title of confirm booking overlay "
                      defaultMessage="Confirm your Booking"
                    />
                  ) : this.isNightly() ? (
                    slots === 0 ? (
                      <FormattedMessage
                        id="booking.date-title.select-checkin"
                        description="Title of date selector"
                        defaultMessage="Select your check-in day"
                      />
                    ) : slots === 1 ? (
                      <FormattedMessage
                        id="booking.date-title.select-checkout"
                        description="Title of date selector"
                        defaultMessage="Select your check-out day"
                      />
                    ) : (
                      <FormattedMessage
                        id="booking.date-title.modify-if-you-want"
                        description="Title of date selector"
                        defaultMessage="Modify the dates or proceed with the booking"
                      />
                    )
                  ) : this.isDaily() ? (
                    slots === 0 ? (
                      <FormattedMessage
                        id="booking.select-start-day"
                        description="Title of date selector"
                        defaultMessage="Select the first day"
                      />
                    ) : slots === 1 ? (
                      <FormattedMessage
                        id="booking.select-end-day"
                        description="Title of date selector"
                        defaultMessage="Select the last day"
                      />
                    ) : (
                      <FormattedMessage
                        id="booking.date-title.modify-if-you-want"
                        description="Title of date selector"
                        defaultMessage="Modify the dates or proceed with the booking"
                      />
                    )
                  ) : this.isHourly() ? (
                    <FormattedMessage
                      id="booking.date-title-2"
                      description="Title of hour selector"
                      defaultMessage="Select the hours"
                    />
                  ) : (
                    <FormattedMessage
                      id="booking.date-title-3"
                      description="Title of quarter-hour selector"
                      defaultMessage="Select the quarter-hours"
                    />
                  )}
                </Text>
              </Inset>
              <SquareIconButton
                icon="remove-light-filled"
                iconSize={14}
                onClick={this.handleClose}
              />
            </CustomTitleBar>
            <SimpleLayout
              backgroundColor={this.state.showTimePicker ? 'white' : undefined}
              ref={this.containerRef}
            >
              {this.renderForm()}
            </SimpleLayout>
          </OverlayWindow>
        </Overlay>
      </Gateway>
    )
  }
}

const mapStateToProps = ({ app, authentication, booking }: IReduxState) => ({
  isNative: app.embeddedLayout,
  paymentTitle: app.config.appName,
  paymentLogoUrl: app.config.logoURLs ? app.config.logoURLs.small : undefined,
  availables: booking.availables,
  isLoading: booking.availablesStatus === 'pending',
  locale: app.locale,
  storeAccessToken: authentication.accessToken,
  // withRequest will strip away `hostname`, thanks HOC
  appHostname: app.hostname,
  preferredBookingRange: booking.preferredBookingRange,
})
const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  refetchBookings: () => dispatch(BookingActions.shouldRefetch(true)),
  fetchAvailables: (assetId: string, startDate: Date, nrOfDays: number) =>
    dispatch(BookingActions.fetchAvailables(assetId, startDate, nrOfDays)),
  clearAvailables: () => dispatch(BookingActions.clearAvailables()),
  setPreferredBookingTimes: ({
    date,
    timeFrom,
    timeTo,
  }: {
    date: Date
    timeFrom: string
    timeTo: string
  }) =>
    dispatch(
      BookingActions.setPreferredBookingRange({ date, timeFrom, timeTo }),
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withStripePaymentSessionCreator(
    withRequest(injectIntl(withRouter(BookingOverlay))),
  ),
)
