import React from 'react'
import { connect } from 'react-redux'
import { View } from '@allthings/elements'
import AppLayout from 'components/AppLayout'
import MicroappLayout from 'components/MicroappLayout'
import OnboardingContainer from 'containers/Onboarding/OnboardingContainer'

class EmbeddedLayout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <View style={{ height: '100%' }} direction="row">
        <OnboardingContainer />
        <AppLayout>
          <MicroappLayout active={false}>{children}</MicroappLayout>
        </AppLayout>
      </View>
    )
  }
}

const mapStateToProps = ({ app }: IReduxState) => ({
  locale: app.locale,
})

export default connect(mapStateToProps)(EmbeddedLayout)
