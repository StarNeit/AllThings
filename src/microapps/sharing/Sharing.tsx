import React from 'react'
import ThingRouter from '../marketplace/ThingRouter'
import SharingPlaceholder from './SharingPlaceholder'

const renderPlaceholder = () => <SharingPlaceholder />

const Marketplace = () => (
  <ThingRouter type="sharing" renderPlaceholder={renderPlaceholder} />
)

export default Marketplace
