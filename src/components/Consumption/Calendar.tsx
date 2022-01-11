import { ColorPalette } from '@allthings/colors'
import { View, Text } from '@allthings/elements'
import PlusCircledIcon from '@allthings/react-ionicons/lib/PlusCircledIcon'
import { css } from 'glamor'
import React from 'react'

const styles = {
  cell: (bold: boolean) =>
    css({
      display: 'table-cell',
      fontWeight: bold ? 'bold' : 'normal',
      padding: '4px',
      paddingLeft: '12px',
      verticalAlign: 'middle',
    }),

  loadPrevious: (color: string) =>
    css({
      fill: color,
      margin: '12px',
    }),
  loadPreviousContainer: css({
    ':hover': {
      background: '#f9f9f9',
      cursor: 'pointer',
    },
    borderTop: `1px solid ${ColorPalette.text.lightGray}`,
  }),
  row: (index: number) =>
    css({
      backgroundColor: index % 2 === 0 ? '#f9f9f9' : ColorPalette.white,
      display: 'table-row',
    }),
  separator: (index: number) =>
    css({
      color: ColorPalette.lightGreyIntense,
      padding: `${index === 0 ? 0 : 20}px 12px 4px 12px`,
      verticalAlign: 'middle',
    }),
  table: css({
    borderCollapse: 'collapse',
    display: 'table',
    width: '100%',
  }),
}

type DataItem = IReduxState['consumption']['immutableData']
interface ICalendarProps {
  readonly color: string
  readonly consumptionData: ReadonlyArray<DataItem>
  readonly detail?: string
  readonly formatMessage: (message: string) => string
  readonly getMonth: (name: string, long: boolean) => string
  readonly handleLoadPrevious: () => void
  readonly outOfRange: boolean
  readonly unit: 'cubicMeter' | 'kilowattPerHour'
}

export default function Calendar({
  color,
  consumptionData,
  detail,
  formatMessage,
  getMonth,
  handleLoadPrevious,
  outOfRange,
  unit,
}: ICalendarProps): JSX.Element {
  const withUnit = (value: string) => `${value} ${formatMessage(unit)}`

  return (
    <div>
      <div {...styles.table}>
        <div {...styles.row(0)}>
          <div {...styles.cell(false)} />
          <div {...styles.cell(true)}>
            <Text>{formatMessage('total')}</Text>
          </div>
          <div {...styles.cell(true)}>
            <Text>{formatMessage('average')}</Text>
          </div>
        </div>
        {consumptionData
          .reduce(
            (s, d) => s.concat([...d[detail]].reverse()),
            [] as DataItem[],
          )
          .reduce((s, d) => {
            const { year } = d as any

            if (s.length === 0 || s[s.length - 1].year > year) {
              s.push({ year })
            }

            return s.concat(d)
          }, [])
          .map((d: any, i: any) =>
            !d.name ? (
              <div key={i} {...styles.separator(i)}>
                <Text size="xl">{d.year}</Text>
              </div>
            ) : (
              <div {...styles.row(i)} key={i}>
                <div {...styles.cell(false)}>
                  <Text>{getMonth(d.name, true)}</Text>
                </div>
                <div {...styles.cell(false)}>
                  <Text>{withUnit(d.total)}</Text>
                </div>
                <div {...styles.cell(false)}>
                  <Text>{d.av ? withUnit(d.av) : '--'}</Text>
                </div>
              </div>
            ),
          )}
      </div>
      {!outOfRange && (
        <View
          direction="row"
          alignH="center"
          alignV="center"
          onClick={handleLoadPrevious}
          {...styles.loadPreviousContainer}
        >
          <PlusCircledIcon
            height="30"
            width="30"
            {...styles.loadPrevious(color)}
          />
          <Text>{formatMessage('loadPrevious')}</Text>
        </View>
      )}
    </div>
  )
}
