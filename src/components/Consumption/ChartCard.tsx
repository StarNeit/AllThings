import { alpha, ColorPalette } from '@allthings/colors'
import { View, Card, Text } from '@allthings/elements'
import IosArrowForwardIcon from '@allthings/react-ionicons/lib/IosArrowForwardIcon'
// tslint:disable-next-line:no-implicit-dependencies
import { Calendar, Chart, Trend } from 'components/Consumption'
// tslint:disable-next-line:no-implicit-dependencies
import Link from 'components/Link'
import { css } from 'glamor'
import React from 'react'

type Formatter<T> = (data: T) => string

const styles = {
  card: (skeleton: boolean) =>
    css({
      padding: skeleton ? '12px' : 0,
    }),
  date: css({
    color: ColorPalette.text.secondary,
    padding: 0,
    paddingRight: '12px',
  }),
  details: css({
    ':hover': {
      background: '#f9f9f9',
      cursor: 'pointer',
    },
    borderTop: `1px solid ${ColorPalette.text.lightGray}`,
  }),
  energy: (skeleton: boolean) =>
    css({
      backgroundColor: skeleton
        ? alpha(ColorPalette.lightGrey, 0.75)
        : 'transparent',
      height: skeleton ? '18px' : 'initial',
      marginBottom: skeleton ? '12px' : 0,
      padding: skeleton ? 0 : '12px',
      width: skeleton ? '100px' : 'initial',
    }),
  icon: {
    fill: ColorPalette.text,
    height: 20,
    width: 20,
  },
  link: css({
    borderBottom: `1px solid ${ColorPalette.lightGrey}`,
    marginBottom: 20,
  }),
  skeletonChart: css({
    background: `repeating-linear-gradient(
      45deg,
      ${alpha(ColorPalette.lightGrey, 0.75)},
      ${alpha(ColorPalette.lightGrey, 0.75)} 10px,
      ${alpha(ColorPalette.lightGrey, 0.5)} 10px,
      ${alpha(ColorPalette.lightGrey, 0.5)} 20px
    )`,
    height: '300px',
    maxWidth: '100%',
  }),
  textDetails: css({
    padding: '12px',
  }),
}

const renderDate = (
  immutableData: IReduxState['consumption']['immutableData'],
  formatDate: Formatter<object>,
) => (
  <Text {...styles.date} size="l">
    {formatDate(immutableData)}
  </Text>
)

const renderDetailsLink = (chart: string, formatMessage: Formatter<string>) => (
  <div {...styles.link}>
    <Link
      to={`/consumption/${chart}`}
      className="consumption-chart-detail-link"
    >
      <View
        direction="row"
        alignH="space-between"
        alignV="center"
        {...styles.details}
      >
        <Text {...styles.textDetails}>{formatMessage('details')}</Text>
        <IosArrowForwardIcon style={styles.icon} />
      </View>
    </Link>
  </div>
)

const renderDemoLabel = (formatMessage: Formatter<string>) => (
  <div {...css({ position: 'relative' })}>
    <button
      {...css({
        backgroundColor: ColorPalette.orangeIntense,
        border: 'none',
        borderRadius: 2,
        cursor: 'initial',
        left: 100,
        padding: '10px 30px',
        position: 'absolute',
        top: 50,
        transform: 'rotate(-30deg)',
        whiteSpace: 'nowrap',
        zIndex: 9,
      })}
    >
      <Text size="l" color={ColorPalette.white}>
        {formatMessage('demoLabel')}
      </Text>
    </button>
  </div>
)

interface IProps {
  readonly appType?: string
  readonly barColor: string
  readonly detail: string
  readonly energyType: string
  readonly formatDate: (data: object) => string
  readonly formatMessage: (message: string) => string
  readonly getMonth: (name: string, long: boolean) => string
  readonly handleClick: OnClick
  readonly handleLoadPrevious: () => void
  readonly immutableData: IReduxState['consumption']['immutableData']
  readonly lineColor: string
  readonly loadingPrevious: boolean
  readonly outOfRange: boolean
  readonly restData: ReadonlyArray<any>
  readonly showDemoLabel: boolean
  readonly skeleton?: boolean
  readonly style?: object
  readonly unit: 'cubicMeter' | 'kilowattPerHour'
}

export default function ChartCard({
  barColor,
  detail,
  energyType,
  formatDate,
  formatMessage,
  getMonth,
  handleClick,
  handleLoadPrevious,
  immutableData,
  lineColor,
  loadingPrevious,
  outOfRange,
  restData,
  showDemoLabel,
  skeleton,
  unit,
}: IProps): JSX.Element {
  const energyData = immutableData[energyType]
  const yAxis =
    immutableData.averages[energyType] > immutableData.totals[energyType]
      ? 'av'
      : 'total'
  const style = {
    barColor,
    ...(immutableData.averages &&
      immutableData.averages[energyType] && {
        lineColor,
      }),
  }
  const config = {
    barDataKey: 'total',
    barDataLegend: formatMessage(`${energyType}TotalLegend`),
    ...(immutableData.averages &&
      immutableData.averages[energyType] && {
        lineDataKey: 'av',
        lineDataLegend: formatMessage(`${energyType}AverageLegend`),
      }),
  }

  return (
    <Card {...styles.card(skeleton)}>
      {!skeleton && showDemoLabel && renderDemoLabel(formatMessage)}
      <View direction="row" alignH="space-between">
        <Text size="xl" {...styles.energy(skeleton)}>
          {!skeleton && formatMessage(`${energyType}ChartLabel`)}
        </Text>
        {!skeleton && (
          <View direction="column" alignV="end">
            <Trend
              energyData={energyData}
              formatMessage={formatMessage}
              unit={unit}
            />
            {renderDate(immutableData, formatDate)}
          </View>
        )}
      </View>
      {skeleton ? (
        <div {...styles.skeletonChart} />
      ) : (
        <Chart
          config={config}
          data={energyData}
          formatMessage={formatMessage}
          getMonth={getMonth}
          handleClick={handleClick}
          isAnimationActive={restData.length === 0 && !loadingPrevious}
          style={style}
          unit={unit}
          yAxis={yAxis}
        />
      )}
      {!detail && !skeleton && renderDetailsLink(energyType, formatMessage)}
      {detail && (
        <Calendar
          color={barColor}
          consumptionData={[immutableData, ...restData]}
          detail={detail}
          formatMessage={formatMessage}
          getMonth={getMonth}
          handleLoadPrevious={handleLoadPrevious}
          outOfRange={outOfRange}
          unit={unit}
        />
      )}
    </Card>
  )
}
