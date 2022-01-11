import { lazyLoadComponent } from 'utils/LazyRoutes'
import { ITranslation } from 'containers/Translated'

const Booking = lazyLoadComponent(() =>
  import(/* webpackPreload: true, webpackChunkName: "booking" */ './Booking'),
)

export default () => [{ path: '/booking', component: Booking }]

export interface ITime {
  from: string
  to: string
}

export const FEW_ASSETS_LIMIT = 11
export interface IAvailability {
  availableTimes: ReadonlyArray<ITime>
  blockedTimes: ReadonlyArray<ITime>
  bookedTimes: ReadonlyArray<ITime>
  date: string
}

export enum BookingStatuses {
  CANCELED = 'canceled',
  CANCELLATION_REQUESTED = 'cancellation-requested',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  UNCONFIRMED = 'unconfirmed',
}

export interface IAsset {
  _embedded: {
    company: {
      paymentMethods: ReadonlyArray<{
        apiKey?: string
        id?: string
        name: string
        type: string
      }>
    }
    files: IFile[]
    contactPerson: IUser
  }
  accessControlUiUrl: string
  availableTimeSlots: {
    monday: ReadonlyArray<string>
    tuesday: ReadonlyArray<string>
    wednesday: ReadonlyArray<string>
    thursday: ReadonlyArray<string>
    friday: ReadonlyArray<string>
    saturday: ReadonlyArray<string>
    sunday: ReadonlyArray<string>
  }
  basePrice: number
  currency: string
  defaultLocale: string
  id: string
  minTimeSlot: number
  needsPayment: boolean
  pricePerTimeSlot: number
  requiresApproval: true
  requiresAccessControl: boolean
  taxRate: number
  timeSlotUnit: TimeUnit
  translations: ReadonlyArray<ITranslation>
  phoneNumberRequired: boolean
  cancellingRequiresApproval: boolean
  priceOnRequest: boolean
}

export interface IBooking {
  _embedded: {
    asset: IAsset
    payment: any
  }
  dateFrom: string
  dateTo: string
  grossTotal: number
  id: string
  status: BookingStatuses
  totalPrice: number
  additionalInformation: string
  accessToken: string
}

export interface ITimepickerChange {
  readonly start: Date
  readonly end: Date
  readonly slots: number
}

export type TimeUnit = 'day' | 'night' | 'hour' | 'quarter-hour'

export type TimeSlotType =
  | 'day'
  | 'quarter-hour'
  | 'hour'
  | 'night'
  | 'base'
  | 'baseParentheses'

export const renderAssetsOnFirstPage = ({
  numberOfAssets,
}: {
  readonly numberOfAssets: number
}) => numberOfAssets < FEW_ASSETS_LIMIT
