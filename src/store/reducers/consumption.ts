import createReducers from 'store/createReducers'
import { dateFromISO8601 } from 'utils/date'
import find from 'lodash-es/find'

interface IData {
  readonly averages: {
    readonly electricity: number
  }
  readonly totals: {
    readonly electricity: number
  }
}
interface IState {
  readonly dateTo: string
  readonly demoData: boolean
  readonly loading: boolean
  readonly loadingAverages: boolean
  readonly loadingPrevious: boolean
  readonly outOfRange: boolean
  readonly immutableData: Partial<IData>
  readonly restData: ReadonlyArray<Partial<IData>>
}

const initialState: IState = {
  dateTo: null,
  demoData: false,
  immutableData: {},
  loading: true,
  loadingAverages: true,
  loadingPrevious: false,
  outOfRange: false,
  restData: [],
}

type Keys = 'electricity' | 'heating' | 'hotWater'

function getDummyData() {
  return {
    averages: { electricity: 750.87, heating: 2035, hotWater: 12.98 },
    dateFrom: '2016-06-01T00:00:00+0000',
    dateTo: '2017-06-01T00:00:00+0000',
    electricity: {
      total: [
        { date: '2016-06-01T00:00:00+0000', value: 23.410557184787 },
        { date: '2016-07-01T00:00:00+0000', value: 66.915461624016 },
        { date: '2016-08-01T00:00:00+0000', value: 58.977011494267 },
        { date: '2016-09-01T00:00:00+0000', value: 75.9583333333 },
        { date: '2016-10-01T00:00:00+0000', value: 71.665322580645 },
        { date: '2016-11-01T00:00:00+0000', value: 68.709677419355 },
        { date: '2016-12-01T00:00:00+0000', value: 72.333333333331 },
        { date: '2017-01-01T00:00:00+0000', value: 70.6666666667 },
        { date: '2017-02-01T00:00:00+0000', value: 60.94117647059 },
        { date: '2017-03-01T00:00:00+0000', value: 65.863701578181 },
        { date: '2017-04-01T00:00:00+0000', value: 59.268292682927 },
        { date: '2017-05-01T00:00:00+0000', value: 56.162123385952 },
      ],
      average: [
        { date: '2016-06-01T00:00:00+0000', value: 4.57184787 },
        { date: '2016-07-01T00:00:00+0000', value: 13.461624016 },
        { date: '2016-08-01T00:00:00+0000', value: 10.1494267 },
        { date: '2016-09-01T00:00:00+0000', value: 15.33333 },
        { date: '2016-10-01T00:00:00+0000', value: 13.2580645 },
        { date: '2016-11-01T00:00:00+0000', value: 12.77419355 },
        { date: '2016-12-01T00:00:00+0000', value: 14.3333331 },
        { date: '2017-01-01T00:00:00+0000', value: 14 },
        { date: '2017-02-01T00:00:00+0000', value: 12.647059 },
        { date: '2017-03-01T00:00:00+0000', value: 13.78181 },
        { date: '2017-04-01T00:00:00+0000', value: 11.682927 },
        { date: '2017-05-01T00:00:00+0000', value: 11.162123385952 },
      ],
    },
    heating: {
      total: [
        { date: '2016-06-01T00:00:00+0000', value: 0 },
        { date: '2016-07-01T00:00:00+0000', value: 0 },
        { date: '2016-08-01T00:00:00+0000', value: 0 },
        { date: '2016-09-01T00:00:00+0000', value: 0 },
        { date: '2016-10-01T00:00:00+0000', value: 0 },
        { date: '2016-11-01T00:00:00+0000', value: 140 },
        { date: '2016-12-01T00:00:00+0000', value: 485 },
        { date: '2017-01-01T00:00:00+0000', value: 606 },
        { date: '2017-02-01T00:00:00+0000', value: 425 },
        { date: '2017-03-01T00:00:00+0000', value: 316 },
        { date: '2017-04-01T00:00:00+0000', value: 63 },
        { date: '2017-05-01T00:00:00+0000', value: 0 },
      ],
      average: [
        { date: '2016-06-01T00:00:00+0000', value: 0 },
        { date: '2016-07-01T00:00:00+0000', value: 0 },
        { date: '2016-08-01T00:00:00+0000', value: 0 },
        { date: '2016-09-01T00:00:00+0000', value: 0 },
        { date: '2016-10-01T00:00:00+0000', value: 0 },
        { date: '2016-11-01T00:00:00+0000', value: 25 },
        { date: '2016-12-01T00:00:00+0000', value: 97 },
        { date: '2017-01-01T00:00:00+0000', value: 121.2 },
        { date: '2017-02-01T00:00:00+0000', value: 85 },
        { date: '2017-03-01T00:00:00+0000', value: 63.2 },
        { date: '2017-04-01T00:00:00+0000', value: 12.6 },
        { date: '2017-05-01T00:00:00+0000', value: 0 },
      ],
    },
    hotWater: {
      total: [
        { date: '2016-06-01T00:00:00+0000', value: 0.14 },
        { date: '2016-07-01T00:00:00+0000', value: 0.79 },
        { date: '2016-08-01T00:00:00+0000', value: 0.75 },
        { date: '2016-09-01T00:00:00+0000', value: 1.43 },
        { date: '2016-10-01T00:00:00+0000', value: 1.52 },
        { date: '2016-11-01T00:00:00+0000', value: 1.59 },
        { date: '2016-12-01T00:00:00+0000', value: 1.4 },
        { date: '2017-01-01T00:00:00+0000', value: 1.52 },
        { date: '2017-02-01T00:00:00+0000', value: 0.92 },
        { date: '2017-03-01T00:00:00+0000', value: 1.03 },
        { date: '2017-04-01T00:00:00+0000', value: 1.15 },
        { date: '2017-05-01T00:00:00+0000', value: 0.74 },
      ],
      average: [
        { date: '2016-06-01T00:00:00+0000', value: 0.028 },
        { date: '2016-07-01T00:00:00+0000', value: 0.158 },
        { date: '2016-08-01T00:00:00+0000', value: 0.158 },
        { date: '2016-09-01T00:00:00+0000', value: 0.286 },
        { date: '2016-10-01T00:00:00+0000', value: 0.304 },
        { date: '2016-11-01T00:00:00+0000', value: 0.318 },
        { date: '2016-12-01T00:00:00+0000', value: 0.35 },
        { date: '2017-01-01T00:00:00+0000', value: 0.304 },
        { date: '2017-02-01T00:00:00+0000', value: 0.184 },
        { date: '2017-03-01T00:00:00+0000', value: 0.206 },
        { date: '2017-04-01T00:00:00+0000', value: 0.23 },
        { date: '2017-05-01T00:00:00+0000', value: 0.15 },
      ],
    },
    interval: 'monthly',
    totals: { electricity: 750.87, heating: 2035, hotWater: 12.98 },
  }
}

function getAverageVal(
  data: ReadonlyArray<{ date: string; value: number }>,
  ts: string,
  unitSize: number,
) {
  const i = find(data, item => {
    return item.date === ts
  })
  const val = i ? i.value : 0
  return parseInt((val * unitSize * 100) as any, 10) / 100
}

function extractConsumptionData(
  unitSize: number,
  av: {
    [key in Keys]: ReadonlyArray<{ date: string; value: number }>
  },
  data: ReturnType<typeof getDummyData>,
  previous: boolean,
  cb: () => void,
) {
  // Display dummy-data if total values are zero what means yet no data available.
  if (
    data.totals.electricity === 0 &&
    data.totals.heating === 0 &&
    data.totals.hotWater === 0 &&
    !previous
  ) {
    cb()
    data = getDummyData()
  }

  interface IItem {
    av: number
    monthNumber: string
    name: string
    total: number
    type: Keys
    year: number
  }
  const electricity: IItem[] = []
  const heating: IItem[] = []
  const hotWater: IItem[] = []

  data.heating.total.map((item, index) => {
    const ts = item.date
    const name = ts.split('-')[1]

    electricity.push({
      av: getAverageVal(av.electricity, ts, unitSize),
      monthNumber: name,
      name,
      total:
        parseInt((data.electricity.total[index].value * 100) as any, 10) / 100,
      type: 'electricity',
      year: new Date(dateFromISO8601(item.date)).getFullYear(),
    })
    heating.push({
      av: getAverageVal(av.heating, ts, unitSize),
      monthNumber: name,
      name,
      total: parseInt((data.heating.total[index].value * 100) as any, 10) / 100,
      type: 'heating',
      year: new Date(dateFromISO8601(item.date)).getFullYear(),
    })
    hotWater.push({
      av: getAverageVal(av.hotWater, ts, unitSize),
      monthNumber: name,
      name,
      total:
        parseInt((data.hotWater.total[index].value * 100) as any, 10) / 100,
      type: 'hotWater',
      year: new Date(dateFromISO8601(item.date)).getFullYear(),
    })
  })

  // Summarize averages.
  // If result is 0, average labels are not displayed.
  data.averages = {
    electricity: electricity.reduce((s, d) => {
      return s + d.av
    }, 0),
    heating: heating.reduce((s, d) => {
      return s + d.av
    }, 0),
    hotWater: hotWater.reduce((s, d) => {
      return s + d.av
    }, 0),
  }

  return [
    {
      averages: data.averages,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      electricity,
      heating,
      totals: data.totals,
      hotWater,
    },
  ]
}

export default createReducers(initialState, {
  fetchData(
    state,
    {
      status,
      dataPayload,
      averagePayload,
      dateTo,
      outOfRange,
      previous,
      unitSize,
    },
  ) {
    switch (status) {
      case 'pending':
        return {
          ...state,
          loading: !previous,
          loadingPrevious: previous,
        }

      case 'ok':
        let immutableData
        let restData: ReadonlyArray<Partial<IData>>
        let demoData = false
        const extractedData = extractConsumptionData(
          unitSize,
          averagePayload,
          dataPayload,
          previous,
          () => {
            demoData = true
            outOfRange = true
          },
        )

        if (!previous) {
          immutableData = extractedData[0]
          restData = []
        } else {
          immutableData = state.immutableData
          restData = state.restData.concat(extractedData)
        }
        return {
          ...state,
          dateTo,
          immutableData,
          loading: false,
          loadingPrevious: false,
          outOfRange,
          restData,
          demoData,
        }
      default:
        return state
    }
  },
})
