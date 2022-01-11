import React from 'react'
import EyeIcon from '@allthings/react-ionicons/lib/IosEyeIcon'
import { View, Text } from '@allthings/elements'
import { PostOverlayMenu } from 'components/Pinboard'
import { css } from 'glamor'
import Translated from 'containers/Translated'
import { ColorPalette } from '@allthings/colors'

export interface IVisibilityScopeProps {
  id: string
  channels: ReadonlyArray<string>
  translations: ReadonlyArray<{
    label: string
    locale: string
  }>
  defaultLocale: string
}

interface IProps {
  selectedScopeId: string
  visibilityScopes: ReadonlyArray<IVisibilityScopeProps>
  onSelect: (id: string) => void
}

export default class VisibilitySelector extends React.PureComponent<IProps> {
  state = {
    showSelectChannelMenu: false,
  }

  hideSelectChannelMenu = () => this.setState({ showSelectChannelMenu: false })
  showSelectChannelMenu = () => this.setState({ showSelectChannelMenu: true })
  handleSelect = (id: string) => {
    this.props.onSelect(id)
    this.setState({ showSelectChannelMenu: false })
  }

  renderSelectChannelMenu = () => (
    <PostOverlayMenu onRequestClose={this.hideSelectChannelMenu}>
      {this.props.visibilityScopes.map(scope => (
        <Text
          key={scope.id}
          size="m"
          color="secondaryText"
          onClick={() => this.handleSelect(scope.id)}
        >
          <Translated
            values={scope.translations}
            defaultLocale={scope.defaultLocale}
          >
            {translated => translated.label}
          </Translated>
        </Text>
      ))}
    </PostOverlayMenu>
  )

  render() {
    const scope = this.props.visibilityScopes.find(
      s => s.id === this.props.selectedScopeId,
    )

    return (
      <View
        direction="row"
        alignH="end"
        {...css({ marginTop: 5, position: 'relative', zIndex: 1 })}
      >
        {this.state.showSelectChannelMenu && this.renderSelectChannelMenu()}
        <View
          direction="row"
          alignV="center"
          onClick={this.showSelectChannelMenu}
          {...css({ ':hover': { cursor: 'pointer' } })}
        >
          <EyeIcon
            width="18"
            height="18"
            style={{ fill: ColorPalette.lightGreyIntense, marginRight: 5 }}
          />
          <Text
            size="s"
            color={ColorPalette.lightGreyIntense}
            strong
            data-e2e="pinboard-contribution-visibility"
          >
            <Translated
              values={scope.translations}
              defaultLocale={scope.defaultLocale}
            >
              {translated => translated.label}
            </Translated>
          </Text>
        </View>
      </View>
    )
  }
}
