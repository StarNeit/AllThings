import React from 'react'
import LandingLayout from './LandingLayout'

import { CookieChecker } from 'containers/NoCookies'
import { View } from '@allthings/elements'

const LoginLandingPage = () => {
  return (
    <View direction="column">
      <CookieChecker />
      <View direction="column">
        <LandingLayout />
      </View>
    </View>
  )
}

export default LoginLandingPage
