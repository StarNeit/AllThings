import React from 'react'
import { FormattedNumber, FormattedMessage } from 'react-intl'

const FormattedPrice = (assetInfo: IndexSignature & { value: any }) =>
  assetInfo.value ? (
    <FormattedNumber {...assetInfo} />
  ) : (
    <FormattedMessage
      id="booking.asset-is-free"
      description="display 'free' if asset has no fees"
      defaultMessage="free"
    />
  )

export default FormattedPrice
