import ServiceChooser from './ServiceChooser'
import { getStaticImage } from 'utils/getStaticImage'

export const customIconMap = {
  'my-tenancy': getStaticImage('my-tenancy.svg'),
}

export default ServiceChooser
export { default as ServiceChooserItem } from './ServiceChooserItem'
