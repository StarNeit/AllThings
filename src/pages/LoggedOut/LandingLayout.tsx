import React from 'react'
import { injectIntl } from 'react-intl'
import { css } from 'glamor'
import { View } from '@allthings/elements'

import { AppIntro } from 'containers/App'
import AccountsLoginView from './AccountsLoginView'

const styles = {
  loginView: css({
    paddingTop: '7vh',
    paddingBottom: '7vh',
  }),
}

const LandingLayout = () => {
  return (
    <View>
      <AppIntro />
      <View {...styles.loginView}>
        <AccountsLoginView />
      </View>
    </View>
  )
}

export default injectIntl(LandingLayout)
