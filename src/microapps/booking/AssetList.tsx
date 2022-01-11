import { ColorPalette } from '@allthings/colors'
import {
  Card,
  Collapsible,
  DateInput,
  Dropdown,
  FormCheckbox,
  Input,
  Inset,
  List,
  Relative,
  SimpleLayout,
  Spacer,
  Text,
  TimeInput,
  View,
} from '@allthings/elements'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { push } from 'connected-react-router'
import DataProvider, { IData } from 'containers/DataProvider'
import Localized from 'containers/Localized'
import PagedDataProvider from 'containers/PagedDataProvider'
import { css, keyframes } from 'glamor'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React from 'react'
import {
  defineMessages,
  FormattedMessage,
  FormattedNumber,
  injectIntl,
} from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import BookingActions from 'store/actions/booking'
import { adjustFrontendTimeToApiTime } from 'utils/date'
import filterify from 'utils/filters'
import { isIE11 } from 'utils/guessBrowser'
import { IAsset, renderAssetsOnFirstPage } from '.'
import AssetListItem from './AssetListItem'
import FormattedPrice from './FormattedPrice'
import { messages as sharedMessages } from './messages'
import TimeSlot from './TimeSlot'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import DateOverlay from 'components/DateOverlay'

const messages = defineMessages({
  filterTitle: {
    id: 'booking.filter.title',
    description: 'Filter this list',
    defaultMessage: 'Filter this list',
  },
  namePlaceholder: {
    id: 'booking.filter.name-placeholder',
    description: 'Name',
    defaultMessage: 'Name',
  },
  nameLabel: {
    id: 'booking.filter.name-label',
    description: 'Name',
    defaultMessage: 'Name',
  },
  categoryLabel: {
    id: 'booking.filter.category-label',
    description: 'Category',
    defaultMessage: 'Category',
  },
  categoryPlaceholder: {
    id: 'booking.filter.category-placeholder',
    description: 'Category',
    defaultMessage: 'Category',
  },
  from: {
    id: 'booking.filter.from',
    description: 'From',
    defaultMessage: 'From',
  },
  to: {
    id: 'booking.filter.to',
    description: 'To',
    defaultMessage: 'To',
  },
  selectADay: {
    id: 'booking.filter.select-a-day',
    description: 'Select a day',
    defaultMessage: 'Select a day',
  },
})

const ieFixer = (userAgent: string) =>
  isIE11(userAgent)
    ? {
        animation: keyframes({
          '0%': { width: '99%' },
          '100%': { width: '100%' },
        }),
      }
    : {}

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
type Props = ConnectedProps & InjectedIntlProps & Partial<RouteComponentProps>

interface IState {
  readonly nameFilter: string
  readonly categoryFilter: IndexSignature
  readonly dateFilter: Date
  readonly shouldRefetch: boolean
  readonly timeFrom: string
  readonly timeTo: string
  readonly showAlternativesToo: boolean
  readonly filterCleared: boolean
}

class AssetList extends React.Component<Props, IState> {
  state: IState = {
    nameFilter: '',
    categoryFilter: {},
    dateFilter: null,
    shouldRefetch: false,
    timeFrom: '00:00',
    timeTo: '23:59',
    showAlternativesToo: false,
    filterCleared: false,
  }

  componentWillUnmount() {
    this.props.setPreferredBookingTimes({
      date: null,
      timeFrom: null,
      timeTo: null,
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== undefined && this.props.id === undefined) {
      this.clearAllFilters()
      this.props.setPreferredBookingTimes({
        date: null,
        timeFrom: null,
        timeTo: null,
      })
    }
  }

  onNameChange = debounce(nameFilter => {
    this.setState({
      nameFilter,
      shouldRefetch: true,
    })
  }, 1000)

  onCategoryChange = (categoryFilter: IndexSignature) =>
    this.setState({
      categoryFilter,
      shouldRefetch: true,
    })

  onDateChange = (dateFilter: Date) => {
    this.setState({
      dateFilter,
      timeFrom: '00:00',
      timeTo: '23:59',
      shouldRefetch: true,
      showAlternativesToo: true,
    })
    this.props.setPreferredBookingTimes({
      date: dateFilter ? dateFilter : null,
      timeFrom: null,
      timeTo: null,
    })
  }

  getUrlCategoryParam = () => get(this, 'props.match.params.category')

  clearAllFilters = () => {
    this.setState(
      {
        nameFilter: '',
        categoryFilter: {},
        dateFilter: null,
        shouldRefetch: true,
        timeFrom: '00:00',
        timeTo: '23:59',
        showAlternativesToo: true,
        filterCleared: true,
      },
      // TODO: make dropdown controllable, then we dont need this
      () => this.setState({ filterCleared: false }),
    )
    this.props.setPreferredBookingTimes({
      date: null,
      timeFrom: null,
      timeTo: null,
    })
  }

  renderFilter = () => {
    const { dateFilter, timeFrom, timeTo, filterCleared } = this.state
    const {
      intl: { formatMessage },
    } = this.props
    return (
      <Inset
        vertical
        {...css({ backgroundColor: ColorPalette.whiteIntense })}
        data-e2e="booking-filter-parent"
      >
        <Collapsible
          title={formatMessage(messages.filterTitle)}
          onToggle={(isClosing: boolean) => isClosing && this.clearAllFilters()}
        >
          {!filterCleared && (
            <View direction="column">
              <Spacer background={ColorPalette.background.bright} height={1} />
              <Input
                icon="search"
                {...css({
                  fontSize: '14px !important',
                })}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  this.onNameChange(e.target.value)
                }
                placeholder={formatMessage(messages.namePlaceholder)}
                label={formatMessage(messages.nameLabel)}
                data-e2e="booking-filter-name"
              />
              {(this.getUrlCategoryParam() === 'all' ||
                !this.getUrlCategoryParam()) && (
                <>
                  <Spacer
                    background={ColorPalette.background.bright}
                    height={1}
                  />
                  <Dropdown
                    label={formatMessage(messages.categoryLabel)}
                    placeholder={formatMessage(messages.categoryPlaceholder)}
                    icon="list-bullets-filled"
                    items={this.props.categories.map(category => ({
                      label: category.name[this.props.locale],
                      value: category.id,
                    }))}
                    clearable
                    placement="bottom"
                    menuHeight={200}
                    onSelect={this.onCategoryChange}
                  />
                </>
              )}
              <Spacer background={ColorPalette.background.bright} height={1} />
              <DateInput
                placeholder={formatMessage(messages.selectADay)}
                minDate={new Date()}
                minDetail="year"
                name="date"
                onChange={this.onDateChange}
                value={dateFilter}
                tileContent={({ date, view }) =>
                  view === 'month' && date.getDate() % 3 === 0 ? (
                    <DateOverlay />
                  ) : null
                }
                locale={
                  this.props.locale.split &&
                  this.props.locale.split('_').join('-')
                }
              />
              {dateFilter && (
                <>
                  <Spacer
                    background={ColorPalette.background.bright}
                    height={1}
                  />
                  <View direction="row">
                    <TimeInput
                      name="from"
                      readOnly
                      label={formatMessage(messages.from)}
                      icon="sharetime"
                      minuteStep={15}
                      maxTime={this.state.timeTo}
                      onChange={(time: string) => {
                        this.props.setPreferredBookingTimes({
                          date: this.state.dateFilter,
                          timeFrom: time,
                          timeTo,
                        })
                        this.setState({
                          timeFrom: time,
                          showAlternativesToo:
                            time &&
                            time !== '00:00' &&
                            this.state.timeTo &&
                            this.state.timeTo !== '23:59'
                              ? false
                              : true,
                        })
                      }}
                    />
                    <Spacer
                      background={ColorPalette.background.bright}
                      width={1}
                      height="100%"
                    />
                    <TimeInput
                      name="to"
                      readOnly
                      label={formatMessage(messages.to)}
                      icon="sharetime"
                      minuteStep={15}
                      minTime={this.state.timeFrom}
                      onChange={(time: string) => {
                        this.props.setPreferredBookingTimes({
                          date: this.state.dateFilter,
                          timeFrom,
                          timeTo: time,
                        })
                        this.setState({
                          timeTo: time,
                          showAlternativesToo:
                            this.state.timeFrom &&
                            this.state.timeFrom !== '00:00' &&
                            time &&
                            time !== '23:59'
                              ? false
                              : true,
                        })
                      }}
                    />
                  </View>
                  <Spacer
                    background={ColorPalette.background.bright}
                    height={1}
                  />
                  {this.timeFromAndTimeToSupplied() && (
                    <FormattedMessage
                      id="booking.filter.show-alternatives-too"
                      description="Also alternative capacities between {timeFrom} and {timeTo}"
                      defaultMessage="Also alternative capacities between {timeFrom} and {timeTo}"
                      values={{ timeFrom, timeTo }}
                    >
                      {message => (
                        <FormCheckbox
                          name="showAlternatives"
                          label={message}
                          checked={this.state.showAlternativesToo}
                          onChange={() =>
                            this.setState(state => ({
                              showAlternativesToo: !state.showAlternativesToo,
                            }))
                          }
                        />
                      )}
                    </FormattedMessage>
                  )}
                </>
              )}
            </View>
          )}
        </Collapsible>
        <Spacer background={ColorPalette.background.bright} height={1} />
      </Inset>
    )
  }

  getEmptyListExplanationText = () =>
    this.timeFromAndTimeToSupplied() && this.state.dateFilter ? (
      <View
        direction="row"
        alignH="center"
        alignV="stretch"
        {...css({
          width: '100%',
          backgroundColor: ColorPalette.whiteIntense,
        })}
      >
        {this.state.showAlternativesToo ? (
          <Text
            {...css({
              cursor: 'pointer',
              width: '70%',
              backgroundColor: ColorPalette.whiteIntense,
            })}
            onClick={() => this.setState({ showAlternativesToo: true })}
            align="center"
            color={ColorPalette.greyIntense}
            strong
          >
            <FormattedMessage
              id="booking.filter.broaden-the-range"
              description="Choose another timeframe to get some results"
              defaultMessage="Choose another timeframe to get some results"
            />
          </Text>
        ) : (
          <Text
            {...css({
              cursor: 'pointer',
              width: '70%',
              backgroundColor: ColorPalette.whiteIntense,
            })}
            onClick={() => this.setState({ showAlternativesToo: true })}
            align="center"
            color={ColorPalette.greyIntense}
            strong
          >
            <FormattedMessage
              id="booking.filter.try-alternatives"
              description="Choose another timeframe or see alternative capacities between {timeFrom} and {timeTo}"
              defaultMessage="Choose another timeframe or see alternative capacities between {timeFrom} and {timeTo}"
              values={{
                timeFrom: this.state.timeFrom,
                timeTo: this.state.timeTo,
              }}
            />
          </Text>
        )}
      </View>
    ) : null

  renderList = (pages: ReadonlyArray<any>, loading: boolean) => {
    const {
      intl: { formatMessage },
      numberOfAssets,
      userAgent,
    } = this.props
    const { dateFilter, timeFrom, timeTo } = this.state
    const assets = pages.reduce((assets2, page) => assets2.concat(page))

    return (
      <>
        <Card
          {...css({
            ...ieFixer(this.props.userAgent),
            ...(renderAssetsOnFirstPage({ numberOfAssets })
              ? css({ overflow: 'hidden' })
              : {}),
          })}
        >
          <List
            {...(isIE11(userAgent)
              ? css({
                  display: 'block',
                })
              : {})}
          >
            {assets.map((asset: IAsset) => {
              const {
                basePrice,
                currency,
                id,
                pricePerTimeSlot,
                timeSlotUnit,
                priceOnRequest,
              } = asset

              const mainPrice = pricePerTimeSlot || basePrice || 0
              const mainTimeSlot = pricePerTimeSlot
                ? timeSlotUnit
                : basePrice
                ? 'baseParentheses'
                : ''
              return (
                <AssetListItem
                  showSkeleton={loading}
                  active={id === this.props.id}
                  asset={asset}
                  onClick={assetId =>
                    this.props.onAssetClick({
                      id: assetId,
                      numberOfAssets,
                      date: dateFilter,
                      timeFrom,
                      timeTo,
                    } as any)
                  }
                  key={id}
                >
                  <View direction="row" alignV="center">
                    {priceOnRequest ? (
                      <Text size="xl" strong color="primary">
                        {formatMessage(sharedMessages.priceOnRequest)}
                      </Text>
                    ) : (
                      <>
                        <Text size="xl" strong color="primary">
                          <FormattedPrice
                            style="currency"
                            value={mainPrice}
                            currency={currency}
                          />
                          &nbsp;
                        </Text>
                        {!!mainPrice && (
                          <Relative top={3}>
                            <TimeSlot
                              strong
                              size="s"
                              color="grey"
                              timeSlot={mainTimeSlot}
                            />
                          </Relative>
                        )}
                      </>
                    )}
                  </View>
                  {!!pricePerTimeSlot && !!basePrice && (
                    <View direction="row" alignV="center">
                      <Text size="l" color={ColorPalette.greyIntense}>
                        <FormattedNumber
                          style="currency"
                          value={basePrice}
                          currency={currency}
                        />
                        &nbsp;
                      </Text>
                      <Relative top={1}>
                        <Text size="s" color={ColorPalette.greyIntense}>
                          <FormattedMessage
                            id="booking.asset-list"
                            description="Base fee"
                            defaultMessage="(base fee)"
                          />
                        </Text>
                      </Relative>
                    </View>
                  )}
                </AssetListItem>
              )
            })}
          </List>
        </Card>
        {assets.length < 1 && this.getEmptyListExplanationText()}
      </>
    )
  }

  renderTitleText = (text: string | React.ReactElement<any>) => (
    <Text strong color="white">
      {text}
    </Text>
  )

  renderTitle = (category: string) => (
    <DataProvider request={{ path: `api/v1/terms/${category}` }}>
      {({ isDone, result }: IData) =>
        !isDone ? (
          this.renderTitleText('')
        ) : (
          <Localized messages={result.entity.name}>
            {name => this.renderTitleText(name)}
          </Localized>
        )
      }
    </DataProvider>
  )

  timeFromAndTimeToSupplied = () =>
    this.state.timeFrom &&
    this.state.timeFrom !== '00:00' &&
    this.state.timeTo &&
    this.state.timeTo !== '23:59'

  getFullyAvailableOrNotUrlModifier = () =>
    this.state.showAlternativesToo ? '' : '&onlyFullyAvailable=true'

  getCategoryFiltered = ({
    categoryFilter,
  }: {
    categoryFilter: IndexSignature
  }) =>
    categoryFilter
      ? {
          categories: categoryFilter.value,
        }
      : {}

  noCategoryFromUrl = () =>
    this.getUrlCategoryParam() === 'all' || !this.getUrlCategoryParam()

  render() {
    const {
      nameFilter,
      categoryFilter,
      shouldRefetch,
      dateFilter,
      timeFrom,
      timeTo,
    } = this.state
    const { appId, locale, numberOfAssets, onBackButtonClick } = this.props
    const urlCategory = this.getUrlCategoryParam()
    const paramsDataProvider = {
      filter: filterify([
        {
          ...(nameFilter && {
            'translations.name': nameFilter,
            'translations.locale': locale,
          }),
          ...(this.noCategoryFromUrl()
            ? this.getCategoryFiltered({ categoryFilter })
            : {
                categories: urlCategory,
              }),
        },
      ]),
    }

    return (
      <HorizontalRouterMicroapp>
        <View
          direction="column"
          {...(renderAssetsOnFirstPage({ numberOfAssets })
            ? {}
            : { flex: 'flex' })}
          style={
            renderAssetsOnFirstPage({ numberOfAssets })
              ? isIE11(this.props.userAgent)
                ? { height: '120%' }
                : { overflow: 'hidden' }
              : {
                  maxHeight: '100vh',
                  overflow: 'auto',
                  backgroundColor: ColorPalette.whiteIntense,
                }
          }
        >
          {!renderAssetsOnFirstPage({ numberOfAssets }) && (
            <GenericBackTitleBar onBack={onBackButtonClick} />
          )}
          <View>
            {this.renderFilter()}
            <PagedDataProvider
              limit={-1}
              path={`api/v1/assets/bookable?appFilter=${appId}${
                dateFilter
                  ? `&date=${
                      adjustFrontendTimeToApiTime(new Date(dateFilter))
                        .toISOString()
                        .split('T')[0]
                    }&timeFrom=${timeFrom || '00:00'}&timeTo=${timeTo ||
                      '23:59'}${this.getFullyAvailableOrNotUrlModifier()}`
                  : ''
              }`}
              params={paramsDataProvider}
              shouldRefetch={shouldRefetch}
              onRefetch={() => this.setState({ shouldRefetch: false })}
            >
              {({ loading, pages, fetchNext }) => (
                <SimpleLayout
                  onScrollEnd={fetchNext}
                  {...css({ overflow: 'hidden' })}
                >
                  {pages.length > 0 && this.renderList(pages, loading)}
                </SimpleLayout>
              )}
            </PagedDataProvider>
          </View>
        </View>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  appId: state.app.config.appID,
  id: state.router.location.pathname.split('/')[4],
  numberOfAssets: state.booking.numberOfAssets,
  locale: state.app.locale,
  userAgent: state.app.userAgent,
  categories: state.booking.categories.items,
})

const mapDispatchToProps = (
  dispatch: FunctionalDispatch,
  props: Partial<RouteComponentProps<{ category: string }>>,
) => ({
  onBackButtonClick: () => dispatch(push('/booking')),
  onAssetClick: ({
    id,
    numberOfAssets,
  }: {
    id: string
    numberOfAssets: number
  }) => {
    dispatch(
      push(
        `/booking/assets/${
          renderAssetsOnFirstPage({ numberOfAssets })
            ? 'all'
            : isEmpty(props)
            ? // if for some reason the params are still empty, show all
              'all'
            : props.match.params.category
        }/${id}`,
      ),
    )
  },
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
)(injectIntl(AssetList))
