import React from 'react'
import Localized from 'containers/Localized'
import {
  FormattedMessage,
  FormattedHTMLMessage,
  FormattedDate,
  FormattedNumber,
  injectIntl,
  defineMessages,
} from 'react-intl'
import FloorMap from './FloorMap'
import UnitTypeMap from './UnitTypesMap'
import { ColorPalette } from '@allthings/colors'
import { dateFromISO8601 } from 'utils/date'
import AndroidHomeIcon from '@allthings/react-ionicons/lib/AndroidHomeIcon'
import { Text, View } from '@allthings/elements'
import { css } from 'glamor'

const noticePeriodUnits = defineMessages({
  month: {
    id: 'contracts.notice-period-unit.month',
    defaultMessage: 'month',
  },
  months: {
    id: 'contracts.notice-period-unit.months',
    defaultMessage: 'months',
  },
})

interface IProps {
  // YYYY-MM-DD
  startDate: string
  netRent: number
  additionalCostsItems: ReadonlyArray<{
    amount: number
    key: string
    description: IMessage
  }>
  vat?: number
  grossRent?: number
  currency: string
  index?: number
  noticePeriod?: number
  noticePeriodUnit?: string
  noticePeriodDescription: IMessage
  _embedded: {
    unit: Unit
  }
}

class ContractItem extends React.Component<IProps & InjectedIntlProps> {
  getFullAddress() {
    const { address } = this.props._embedded.unit._embedded
    const street = []
    const city = []

    if (address.street !== null) {
      street.push(address.street)
    }
    if (address.houseNumber !== null) {
      street.push(address.houseNumber)
    }
    if (address.postalCode !== null) {
      city.push(address.postalCode)
    }
    if (address.city !== null) {
      city.push(address.city)
    }

    const returnArray = []

    if (street.length) {
      returnArray.push(street.join(' '))
    }
    if (city.length) {
      returnArray.push(city.join(' '))
    }

    return returnArray.join(', ')
  }

  getUnitData() {
    const { floors, roomCount, size } = this.props._embedded.unit
    const comps = []

    floors.map((floorKey, i) => {
      if (i > 0) {
        comps.push(', ')
      }
      comps.push(FloorMap.getMessage((floorKey as unknown) as string, i))
    })

    if (roomCount) {
      if (floors.length) {
        comps.push(', ')
      }
      comps.push(
        <FormattedMessage
          key={floors.length + 1}
          id="contracts.rooms"
          description="Label of rooms number"
          defaultMessage="{roomCount} rooms"
          values={{ roomCount }}
        />,
      )
    }

    if (size) {
      if (floors.length || roomCount) {
        comps.push(', ')
      }
      comps.push(
        <FormattedHTMLMessage
          key={floors.length + 2}
          id="contracts.unit-size"
          description="Label of unit size"
          defaultMessage="{size}m<sup>2</sup>"
          values={{ size }}
        />,
      )
    }

    return comps
  }

  wrapMessage(msg: React.ReactNode) {
    return <Text style={{ display: 'inline-block' }}>{msg}</Text>
  }

  renderAdditionalCosts() {
    const { currency, index } = this.props

    return this.props.additionalCostsItems.map(item => (
      <View
        key={item.key}
        direction="row"
        alignH="space-between"
        data-e2e={`contract-item-${index}-extra-${item.key}`}
        style={{ marginBottom: 4 }}
      >
        <Localized messages={item.description}>{this.wrapMessage}</Localized>
        <FormattedNumber
          style="currency"
          value={item.amount}
          currency={currency}
        />
      </View>
    ))
  }

  render() {
    const { formatMessage } = this.props.intl
    const { currency, index } = this.props

    return (
      <View
        flex={100}
        className="contractItem"
        data-e2e={`contract-item-${index}`}
      >
        <View
          direction="row"
          alignH="space-between"
          alignV="center"
          className="contractItem-header"
        >
          <AndroidHomeIcon
            style={{ width: 35, height: 35, fill: ColorPalette.lightGrey }}
          />
          <View direction="column" alignV="center">
            <Text
              className="contractItem-header-label-type"
              data-e2e={`contract-item-${index}-heading-type`}
              size="l"
            >
              {UnitTypeMap.getMessage(this.props._embedded.unit
                .objectType as any)}
            </Text>
            <View direction="row" alignH="center">
              <Text
                className="contractItem-header-label-object"
                data-e2e={`contract-item-${index}-subheading-type`}
              >
                <FormattedMessage
                  id="contracts.object-label"
                  description="Label of object"
                  defaultMessage="Object"
                />
              </Text>
              <Text
                className="contractItem-header-label-id"
                data-e2e={`contract-item-${index}-subheading-id`}
              >
                {this.props._embedded.unit.name}
              </Text>
            </View>
          </View>
          <div className="contractItem-header-spacer" style={{ width: 35 }} />
        </View>
        <div className="contractItem-content">
          <Text strong data-e2e={`contract-item-${index}-address`}>
            {this.getFullAddress()}
          </Text>
          <div data-e2e={`contract-item-${index}-description`}>
            {this.getUnitData()}
          </div>
          <div className="contractItem-content-table">
            <View
              direction="row"
              alignH="space-between"
              style={{ marginBottom: 4 }}
            >
              {this.wrapMessage(
                <FormattedMessage
                  id="contracts.period-start"
                  description="Label of contract utilisation-period start"
                  defaultMessage="Start of utilisation-period"
                />,
              )}
              <Text
                data-e2e={`contract-item-${index}-start-date`}
                style={{ display: 'inline-block' }}
              >
                <FormattedDate
                  year="2-digit"
                  month="short"
                  day="2-digit"
                  value={dateFromISO8601(this.props.startDate)}
                />
              </Text>
            </View>
            <View
              direction="row"
              alignH="space-between"
              data-e2e={`contract-item-${index}-rent`}
              style={{ marginBottom: 4 }}
            >
              {this.wrapMessage(
                <FormattedMessage
                  id="contracts.net-rent"
                  description="Label for contract net rent"
                  defaultMessage="Net rent"
                />,
              )}
              <FormattedNumber
                style="currency"
                value={this.props.netRent}
                currency={currency}
              />
            </View>
            {this.renderAdditionalCosts()}
            <View
              direction="row"
              alignH="space-between"
              data-e2e={`contract-item-${index}-tax`}
              {...css({ marginBottom: 4, msFlexPack: 'space-between' })}
            >
              {this.wrapMessage(
                <FormattedMessage
                  id="contracts.vat"
                  description="Label for contract vat"
                  defaultMessage="VAT"
                />,
              )}
              <FormattedNumber
                style="currency"
                value={this.props.vat}
                currency={currency}
              />
            </View>
            <View
              direction="row"
              alignH="space-between"
              style={{ marginBottom: 4 }}
            >
              {this.wrapMessage(
                <Text strong>
                  <FormattedMessage
                    id="contracts.overall-costs"
                    description="Label for contract overall-costs"
                    defaultMessage="Overall costs"
                  />
                </Text>,
              )}
              <Text strong data-e2e={`contract-item-${index}-gross`}>
                <FormattedNumber
                  style="currency"
                  value={this.props.grossRent}
                  currency={currency}
                />
              </Text>
            </View>
          </div>
          <Text
            className="contractItem-content-cancellation-text"
            data-e2e={`contract-item-${index}-cancellation`}
            size="s"
            style={{ display: 'block' }}
          >
            <FormattedMessage
              id="contracts.notice-period"
              description="Contract period notice"
              defaultMessage="Notice period {number} {unit}"
              values={{
                number: this.props.noticePeriod,
                unit: formatMessage(
                  noticePeriodUnits[this.props.noticePeriodUnit],
                ),
              }}
            />
            , <Localized messages={this.props.noticePeriodDescription} />
          </Text>
        </div>
      </View>
    )
  }
}

export default injectIntl(ContractItem)
