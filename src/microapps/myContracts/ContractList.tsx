import React from 'react'
import { connect } from 'react-redux'
import UtilisationPeriodActions from 'store/actions/utilisationPeriods'
import { AppTitle } from 'containers/App'
import { SimpleLayout, View, Inset } from '@allthings/elements'
import Microapp from 'components/Microapp'
import { ColorPalette, alpha } from '@allthings/colors'
import AndroidHomeIcon from '@allthings/react-ionicons/lib/AndroidHomeIcon'

import ContractItem from './ContractItem'
import ContractItemSkeleton from './ContractItemSkeleton'
import { injectIntl, defineMessages } from 'react-intl'
import { css } from 'glamor'
import { MicroApps } from 'enums'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'

const messages = defineMessages({
  emptyStateHeadline: {
    id: 'contracts.empty-state.headline',
    defaultMessage: 'No contracts yet',
  },
  emptyStateHint: {
    id: 'contracts.empty-state.hint',
    defaultMessage:
      "We don't have any contract data yet. If you don't see your contracts here within 48 h, please get in touch with our support at app.team@allthings.me.",
  },
  heroText: {
    id: 'contracts.hero-text',
    description: 'Text of the Contracts hero',
    defaultMessage: 'Welcome to your contracts',
  },
})

interface IProps {
  customSettings: IReduxState['app']['config']['customSettings']
  config: MicroAppProps
  loading: boolean
  utilisationPeriods: IReduxState['utilisationPeriods']['items']
}

class ContractList extends React.PureComponent<
  IProps & DispatchProp & InjectedIntlProps
> {
  componentDidMount() {
    this.props.dispatch(UtilisationPeriodActions.fetchUtilisationPeriods())
  }

  renderItems(items: IReduxState['utilisationPeriods']['items']) {
    return items.map((period, index: number) => (
      <ContractItem {...period} index={index} key={period.id} />
    ))
  }

  renderEmptyState() {
    const { formatMessage } = this.props.intl

    return (
      <View direction="row" alignH="center" alignV="center">
        <View
          direction="column"
          style={{ maxWidth: 300, textAlign: 'center', margin: '10%' }}
        >
          <AndroidHomeIcon
            style={{
              width: 160,
              height: 160,
              fill: ColorPalette.lightGrey,
              margin: '0 auto',
            }}
          />
          <span
            style={{
              color: ColorPalette.text.primary,
              fontSize: 20,
              marginBottom: 30,
            }}
          >
            {formatMessage(messages.emptyStateHeadline)}
          </span>
          <span style={{ color: ColorPalette.lightGreyIntense }}>
            {formatMessage(messages.emptyStateHint)}
          </span>
        </View>
      </View>
    )
  }

  renderContent() {
    const { loading } = this.props

    if (loading) {
      return (
        <View
          alignH="center"
          direction="row"
          wrap="wrap"
          style={{ padding: 15 }}
        >
          <ContractItemSkeleton />
        </View>
      )
    } else {
      const { utilisationPeriods } = this.props
      // 'grossRent = null' indicates, that the contracts data wasn't imported yet.
      const items = utilisationPeriods.filter(
        period => period.grossRent !== null && period.grossRent !== 0,
      )

      return items.length > 0 ? (
        <View
          alignH="center"
          direction="row"
          wrap="wrap"
          style={{ padding: 15 }}
        >
          {this.renderItems(items)}
        </View>
      ) : (
        this.renderEmptyState()
      )
    }
  }

  render() {
    const app = this.props.config

    return (
      <Microapp
        {...css({ background: alpha(app.color, 0.03), height: '100%' })}
      >
        <AppTitle>{app.label}</AppTitle>
        <SimpleLayout padded={'horizontal'}>
          <MicroappBigTitleBar type={MicroApps.MY_CONTRACTS} />
          <Inset vertical={true} />
          {this.renderContent()}
        </SimpleLayout>
      </Microapp>
    )
  }
}

export default connect((state: IReduxState) => ({
  customSettings: state.app.config.customSettings,
  loading: state.utilisationPeriods.loading,
  utilisationPeriods: state.utilisationPeriods.items,
}))(injectIntl(ContractList))
