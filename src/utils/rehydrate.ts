import { rehydrate } from 'glamor'

if ((window as any)._glam) {
  rehydrate((window as any)._glam)
}
