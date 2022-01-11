import { ColorPalette } from '@allthings/colors'
// tslint:disable-next-line:no-implicit-dependencies
import CustomTooltip from 'components/Consumption/CustomTooltip'
import React from 'react'
import Area from 'recharts/es6/cartesian/Area'
import Bar from 'recharts/es6/cartesian/Bar'
import CartesianGrid from 'recharts/es6/cartesian/CartesianGrid'
import Line from 'recharts/es6/cartesian/Line'
import XAxis from 'recharts/es6/cartesian/XAxis'
import YAxis from 'recharts/es6/cartesian/YAxis'
import ComposedChart from 'recharts/es6/chart/ComposedChart'
import Legend from 'recharts/es6/component/Legend'
import ResponsiveContainer from 'recharts/es6/component/ResponsiveContainer'
import Tooltip from 'recharts/es6/component/Tooltip'

const ANIMATION_DURATION = 200

const BAR_SIZE = 30 // in px

const normalize = (
  data: readonly unknown[],
  getMonth: (name: string, long?: boolean) => string,
) =>
  data.map((month: IndexSignature) => ({
    ...month,
    name: getMonth(month.name),
  }))

interface IProps {
  readonly config: {
    readonly areaDataKey?: string
    readonly areaDataLegend?: string
    readonly barDataKey?: string
    readonly barDataLegend?: string
    readonly lineDataKey?: string
    readonly lineDataLegend?: string
  }
  readonly data: ReadonlyArray<any>
  readonly formatMessage: (message: string) => string
  readonly getMonth: (name: string, long: boolean) => string
  readonly handleClick: OnClick
  readonly isAnimationActive: boolean
  readonly style: {
    readonly lineColor?: string
    readonly barColor?: string
  }
  readonly unit: string
  readonly yAxis: string
}

export default function Chart({
  config,
  data,
  formatMessage,
  getMonth,
  handleClick,
  isAnimationActive,
  style,
  unit,
  yAxis,
}: IProps): JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={normalize(data, getMonth)}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <XAxis dataKey="name" stroke={ColorPalette.lightGreyIntense} />
        <YAxis dataKey={yAxis} />
        <Tooltip
          content={
            <CustomTooltip
              formatMessage={formatMessage}
              getMonth={getMonth}
              unit={unit}
            />
          }
        />
        <Legend />
        <CartesianGrid stroke={ColorPalette.lightGrey} />
        {config.areaDataKey && (
          <Area
            dataKey={config.areaDataKey}
            fill={ColorPalette.lightGrey}
            stroke={ColorPalette.lightGreyIntense}
            type="monotone"
            name={config.areaDataLegend}
          />
        )}
        {config.barDataKey && (
          <Bar
            animationDuration={ANIMATION_DURATION}
            barSize={BAR_SIZE}
            dataKey={config.barDataKey}
            fill={style.barColor}
            isAnimationActive={isAnimationActive}
            name={config.barDataLegend}
            onClick={handleClick}
          />
        )}
        {config.lineDataKey && (
          <Line
            animationBegin={ANIMATION_DURATION}
            animationDuration={ANIMATION_DURATION * 2}
            dataKey={config.lineDataKey}
            isAnimationActive={isAnimationActive}
            name={config.lineDataLegend}
            stroke={style.lineColor}
            type="monotone"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
