import React from 'react'
import ThingRouter from './ThingRouter'
import MyThingsPlaceholder from './MyThingsPlaceholder'

const renderPlaceholder = () => <MyThingsPlaceholder />
const Marketplace = () => (
  <ThingRouter type="marketplace" renderPlaceholder={renderPlaceholder} />
)

export default Marketplace
