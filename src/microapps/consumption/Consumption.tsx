import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import { push } from 'connected-react-router'

import { AppTitle } from 'containers/App'
import ConsumptionActions, { IFetchDataParams } from 'store/actions/consumption'
import { SimpleLayout, ListSpinner } from '@allthings/elements'
import Microapp from 'components/Microapp'
import { dateFromISO8601, ISO8601FromDate } from 'utils/date'
import ChartCard from 'components/Consumption/ChartCard'
import subMonths from 'date-fns/subMonths'
import { RouteComponentProps } from 'react-router'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from 'enums'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const ELECTRICITY = 'turquoise'
const HEATING = 'red'
const WATER = 'blue'

const intl = defineMessages({
  electricityTotalLegend: {
    id: 'consumption.electricity-total-legend',
    defaultMessage: 'Total',
  },
  electricityAverageLegend: {
    id: 'consumption.electricity-average-legend',
    defaultMessage: 'Average',
  },
  heatingTotalLegend: {
    id: 'consumption.heating-total-legend',
    defaultMessage: 'Total',
  },
  heatingAverageLegend: {
    id: 'consumption.heating-average-legend',
    defaultMessage: 'Average',
  },
  hotWaterTotalLegend: {
    id: 'consumption.water-total-legend',
    defaultMessage: 'Total',
  },
  hotWaterAverageLegend: {
    id: 'consumption.water-average-legend',
    defaultMessage: 'Average',
  },
  electricityChartLabel: {
    id: 'consumption.electricity-chart-label',
    defaultMessage: 'Electricity',
  },
  heatingChartLabel: {
    id: 'consumption.heating-chart-label',
    defaultMessage: 'Heating',
  },
  hotWaterChartLabel: {
    id: 'consumption.water-chart-label',
    defaultMessage: 'Water',
  },
  details: {
    id: 'consumption.details-link-label',
    defaultMessage: 'Details',
  },
  month: {
    id: 'consumption.month-column-label',
    defaultMessage: 'Month',
  },
  total: {
    id: 'consumption.total-column-label',
    defaultMessage: 'Total',
  },
  average: {
    id: 'consumption.average-column-label',
    defaultMessage: 'Average',
  },
  kilowattPerHour: {
    id: 'consumption.kilowatt-per-hour-label',
    defaultMessage: 'kWh',
  },
  cubicMeter: {
    id: 'consumption.cubic-meter-label',
    defaultMessage: 'm\\u00b3',
  },
  loadPrevious: {
    id: 'consumption.load-previous-label',
    defaultMessage: 'Load previous consumption data',
  },
  demoLabel: {
    id: 'consumption.demo-label',
    defaultMessage: 'Demo-Data',
  },
  heroText: {
    id: 'consumption.hero-text',
    description: 'Text of the Consumption hero',
    defaultMessage: 'Welcome to your consumption data',
  },
})

// Here we have the chance to define the type of apps, the demo label
// is shown, when no consumption-data are defined.
// Currently the label is shown for all app-types.
// demoData && [null, 'demo_public', 'demo_customer'].indexOf(appType) > -1
const showDemoLabel = (demoData: boolean) => demoData

interface IOwnProps {
  readonly config: MicroAppProps
}
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
export class Consumption extends React.PureComponent<
  Props &
    InjectedIntlProps &
    RouteComponentProps<{ id: string }> &
    DispatchProp &
    IOwnProps
> {
  componentDidMount() {
    const now = ISO8601FromDate(new Date())[0].split('-')

    this.fetchData({ dateTo: `${now[0]}-${now[1]}` })
  }

  fetchData = (query: IFetchDataParams) =>
    this.props.dispatch(ConsumptionActions.fetchData(query))

  formatDate = (data: any) => {
    const { formatDate } = this.props.intl
    // dateTo, returned by API is one month to late, so we have to subtract one month
    return formatDate(subMonths(dateFromISO8601(data.dateTo), 1), {
      year: 'numeric',
      month: 'long',
    })
  }

  formatMessage = (key: string) => {
    const { formatMessage } = this.props.intl

    return formatMessage(intl[key])
  }

  getMonth = (num: string, long: boolean) => {
    const { formatDate } = this.props.intl
    // Month has to be initialized based on: jan = 0;
    // Also set day and hour to prevent midnight shift
    return formatDate(subMonths(new Date(0, num as any, 1, 12), 1), {
      month: long ? 'long' : 'short',
    })
  }

  handleClick = (payload: { readonly type: string }) =>
    !this.props.match.params.id &&
    this.props.dispatch(push(`/consumption/${payload.type}`))

  handleLoadPrevious = () => this.fetchData({ previous: true })

  renderContent() {
    const {
      demoData,
      immutableData,
      loadingPrevious,
      outOfRange,
      restData,
      match,
    } = this.props

    const detail = match.params.id
    const shouldDisplay = (energy: string) => {
      return (
        immutableData.totals[energy] > 0 &&
        ((detail && detail === energy) || !detail)
      )
    }

    return (
      <div>
        {shouldDisplay('electricity') && (
          <ChartCard
            barColor={ColorPalette[ELECTRICITY]}
            detail={detail}
            energyType="electricity"
            formatDate={this.formatDate}
            formatMessage={this.formatMessage}
            getMonth={this.getMonth}
            handleClick={this.handleClick}
            handleLoadPrevious={this.handleLoadPrevious}
            immutableData={immutableData}
            lineColor={ColorPalette[`${ELECTRICITY}Intense`]}
            loadingPrevious={loadingPrevious}
            outOfRange={outOfRange}
            restData={restData}
            showDemoLabel={showDemoLabel(demoData)}
            style={{ margin: 25 }}
            unit="kilowattPerHour"
          />
        )}
        {shouldDisplay('heating') && (
          <ChartCard
            barColor={ColorPalette[HEATING]}
            detail={detail}
            energyType="heating"
            formatDate={this.formatDate}
            formatMessage={this.formatMessage}
            getMonth={this.getMonth}
            handleClick={this.handleClick}
            handleLoadPrevious={this.handleLoadPrevious}
            immutableData={immutableData}
            lineColor={ColorPalette[`${HEATING}Intense`]}
            loadingPrevious={loadingPrevious}
            outOfRange={outOfRange}
            restData={restData}
            showDemoLabel={showDemoLabel(demoData)}
            unit="kilowattPerHour"
            style={{ margin: 25 }}
          />
        )}
        {shouldDisplay('hotWater') && (
          <ChartCard
            barColor={ColorPalette[WATER]}
            detail={detail}
            energyType="hotWater"
            formatDate={this.formatDate}
            formatMessage={this.formatMessage}
            getMonth={this.getMonth}
            handleClick={this.handleClick}
            handleLoadPrevious={this.handleLoadPrevious}
            immutableData={immutableData}
            lineColor={ColorPalette[`${WATER}Intense`]}
            loadingPrevious={loadingPrevious}
            outOfRange={outOfRange}
            restData={restData}
            showDemoLabel={showDemoLabel(demoData)}
            unit="cubicMeter"
            style={{ margin: 25 }}
          />
        )}
      </div>
    )
  }

  render() {
    const {
      config: app,
      loading,
      loadingPrevious,
      match,
      goToConsumption,
    } = this.props

    return (
      <Microapp>
        {match.params.id && <GenericBackTitleBar onBack={goToConsumption} />}
        <AppTitle>{app.label}</AppTitle>
        <SimpleLayout>
          {!match.params.id && (
            <MicroappBigTitleBar type={MicroApps.CONSUMPTION} />
          )}
          <div style={{ padding: 25 }}>
            {loading ? (
              <ChartCard
                barColor={''}
                detail={null}
                energyType="electricity"
                formatDate={this.formatDate}
                formatMessage={this.formatMessage}
                getMonth={this.getMonth}
                handleClick={this.handleClick}
                handleLoadPrevious={this.handleLoadPrevious}
                immutableData={{
                  averages: { electricity: 0 },
                  totals: { electricity: 0 },
                }}
                lineColor={''}
                loadingPrevious={false}
                outOfRange={false}
                restData={[]}
                showDemoLabel={false}
                skeleton={true}
                unit="cubicMeter"
              />
            ) : (
              this.renderContent()
            )}
          </div>
          {loadingPrevious && <ListSpinner />}
        </SimpleLayout>
      </Microapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  appType: state.app.config.type,
  customSettings: state.app.config.customSettings,
  demoData: state.consumption.demoData,
  immutableData: state.consumption.immutableData,
  loading: state.consumption.loading,
  loadingPrevious: state.consumption.loadingPrevious,
  locale: state.authentication.user.locale,
  outOfRange: state.consumption.outOfRange,
  restData: state.consumption.restData,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goToConsumption: () => dispatch(push('/consumption')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(Consumption))
