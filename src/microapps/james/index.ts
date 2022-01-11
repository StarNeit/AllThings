export { default as JamesServiceList } from './JamesServiceList'
export { default as JamesServiceDetail } from './JamesServiceDetail'

export interface IMessage {
  readonly date: Date
  readonly isFromUser: boolean
  readonly text: string
}

export interface IService {
  _embedded: {
    files: ReadonlyArray<IFile>
    provider: {
      name: string
    }
  }
  description: IMessage
  id: string
  images: ReadonlyArray<IFile>
  name: IMessage
  rating: number
  subtitle: IMessage
  type:
    | 'brunch'
    | 'car-cleaning'
    | 'cleaning'
    | 'external'
    | 'flowers'
    | 'holiday-service'
    | 'post-service'
    | 'reservation'
    | 'tick'
    | 'troubleshooter'
    | 'veggies'
    | 'window-cleaning'
  url?: string
}
