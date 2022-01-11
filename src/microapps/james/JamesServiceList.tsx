import React from 'react'
import get from 'lodash-es/get'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import AuthActions from 'store/actions/authentication'
import JamesWizard from './Wizard/JamesWizard'

import { AppTitle } from 'containers/App'
import { CustomTitleBar, TitleBarLabel } from 'components/TitleBar'
import { SimpleLayout, List } from '@allthings/elements'
import Microapp from 'components/Microapp'
import Actions from 'store/actions/james'
import JamesServiceListRow from './JamesServiceListRow'
import Localized, { getLocalized } from 'containers/Localized'
import LoadingSkeleton from './LoadingSkeleton'
import { IService } from '.'

const sortServices = (services: any, locale: string) => {
  return services.slice(0).sort((a: any, b: any) => {
    const nameA = a._embedded.category.name
    const nameB = b._embedded.category.name
    if (nameA === nameB) {
      return a.id < b.id
    } else {
      return getLocalized(nameA, locale).localeCompare(
        getLocalized(nameB, locale),
      )
    }
  })
}

interface IProps {
  appType: 'residential' | 'commercial'
  config: MicroAppProps
  username: string
  availableServices: ReadonlyArray<IService>
  conciergeWizardFinished: boolean
}

class JamesServiceList extends React.Component<IProps & DispatchProp> {
  state = {
    wizardPage: 0,
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchServices())
  }

  handleClick = (service: string) => {
    this.props.dispatch(push(`/e-concierge/${service}`))
  }

  handleWizardAdvance = () => {
    this.setState({ wizardPage: this.state.wizardPage + 1 })
  }

  handleWizardFinish = () => {
    // finish the wizard optimistically
    this.setState({ wizardPage: -1 })
    this.props.dispatch(
      AuthActions.changeDetails({
        properties: [
          {
            key: 'conciergeWizardFinished',
            value: 'true',
            type: 'boolean',
          },
        ],
      }),
    )
  }

  renderOnboardingWizard = () => {
    const {
      config: { color },
      username,
      appType,
    } = this.props

    return (
      <JamesWizard
        appType={appType}
        color={color}
        onAdvance={this.handleWizardAdvance}
        onFinish={this.handleWizardFinish}
        page={this.state.wizardPage}
        username={username}
      />
    )
  }

  renderServices = (services: ReadonlyArray<IService>) => {
    return services.map((service, i) => (
      <Localized messages={service.name} key={service.id}>
        {localizedName => (
          <JamesServiceListRow
            data-e2e={`james-service-${i}`}
            name={localizedName}
            provider={service._embedded.provider.name}
            id={service.id}
            onClick={this.handleClick}
          />
        )}
      </Localized>
    ))
  }

  render() {
    const { config, conciergeWizardFinished, availableServices } = this.props

    // wizardPage < 0 means that the wizard has been finished/skipped
    // we don't want to wait for the response from the API before skipping,
    // this would take some time and be bad UX
    return this.state.wizardPage < 0 || conciergeWizardFinished ? (
      <Microapp>
        <CustomTitleBar color={config.color}>
          <TitleBarLabel microAppType={config.type}>
            <Localized messages={config.label} />
          </TitleBarLabel>
        </CustomTitleBar>
        <AppTitle>{config._embedded.type.name}</AppTitle>
        <SimpleLayout>
          <List>
            {this.props.availableServices.length ? (
              this.renderServices(availableServices)
            ) : (
              <LoadingSkeleton titleHeight={0} rows={6} />
            )}
          </List>
        </SimpleLayout>
      </Microapp>
    ) : (
      this.renderOnboardingWizard()
    )
  }
}

export default connect((state: IReduxState) => ({
  appType: state.app.config.segment,
  username: state.authentication.user.username,
  availableServices: sortServices(state.james.services, state.app.locale),
  conciergeWizardFinished: get(
    state,
    'authentication.user.properties.conciergeWizardFinished',
    false,
  ),
}))(JamesServiceList)
