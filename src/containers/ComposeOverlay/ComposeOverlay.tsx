import React from 'react'
import {
  Bar,
  BarTitle,
  ButtonGroup,
  CloseButton,
} from 'components/OverlayTitle'
import Overlay from 'components/Overlay'
import { FormattedMessage } from 'react-intl'
import ComposeOverlayItem, { IConfig } from './ComposeOverlayItem'
import { connect } from 'react-redux'
import OverlayBox from 'components/OverlayBox'
import ComposeOverlayItems from './ComposeOverlayItems'
import { Gateway } from 'react-gateway'
import { css } from 'glamor'

const containerStyle = css({
  '@media (max-width: 1024px)': {
    background: 'rgba(0,0,0,0.8)',
  },
})

type Props = ReturnType<typeof mapStateToProps> & {
  onRequestClose: () => void
}

interface IApp {
  readonly type: string
}

class ComposeOverlay extends React.Component<Props & DispatchProp> {
  checkComposableApps = (app: IApp) => {
    // tslint:disable:prefer-for-of
    for (let i = 0; i < this.props.microApps.length; i++) {
      if (this.props.microApps[i].type === app.type) {
        return false
      }
    }
    // tslint:enable:prefer-for-of
    return true
  }

  handleAddContentItemClick = (itemConfig: IConfig) => {
    itemConfig.onClick(this.props.dispatch, itemConfig)
    this.props.onRequestClose()
  }

  renderComposeItems = () => {
    return ComposeOverlayItems.map(config => (
      <ComposeOverlayItem
        key={config.id}
        config={config}
        disabled={this.checkComposableApps(config)}
        onClick={this.handleAddContentItemClick}
        microAppsThemes={this.props.microAppsThemes}
      />
    ))
  }

  render() {
    return (
      <Gateway into="root">
        <Overlay
          backgroundColor="transparent"
          containerStyle={containerStyle}
          onBackgroundClick={this.props.onRequestClose}
        >
          <OverlayBox left={140}>
            <Bar>
              <BarTitle>
                <FormattedMessage
                  id="compose-overlay.title"
                  description="Title of the compose overlay"
                  defaultMessage="Create new"
                />
              </BarTitle>
              <ButtonGroup>
                <CloseButton onClick={this.props.onRequestClose} />
              </ButtonGroup>
            </Bar>
            <div className="createList">
              <ul className="createList-list">{this.renderComposeItems()}</ul>
            </div>
          </OverlayBox>
        </Overlay>
      </Gateway>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  notifications: state.notifications,
  microApps: state.app.microApps,
  microAppsThemes: state.theme.microApps,
})
export default connect(mapStateToProps)(ComposeOverlay)
