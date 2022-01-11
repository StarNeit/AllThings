import React from 'react'
import RecaptchaInput from 'components/RecaptchaInput'
import { View } from '@allthings/elements'

export const RECAPTCHA_SITEKEY = '6LcEnSIUAAAAAFum7anl-oFBB1YldeXfvqwT7RNW'

const Recaptcha = () => (
  <View direction="row" alignH="center">
    <RecaptchaInput
      data-e2e="login-recaptcha"
      name="recaptcha"
      siteKey={RECAPTCHA_SITEKEY}
    />
  </View>
)

export default Recaptcha
