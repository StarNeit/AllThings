import React from 'react'
import { ColorPalette } from '@allthings/colors'
import { Text, ListItem, View, Spacer, Pill, Image } from '@allthings/elements'
import { css } from 'glamor'
import { defineMessages, injectIntl } from 'react-intl'

const messages = defineMessages({
  borrowLabel: {
    id: 'marketplace-thing-row.borrow-label',
    description: 'The label for the borrow label.',
    defaultMessage: 'Borrow',
  },
  lendLabel: {
    id: 'marketplace-thing-row.lend-label',
    description: 'The label for the lend label.',
    defaultMessage: 'Lend',
  },
  servicesLabel: {
    id: 'marketplace-thing-row.services-label',
    description: 'The label for the services label.',
    defaultMessage: 'Inquire',
  },
  freeLabel: {
    id: 'marketplace-thing-row.free-item',
    description: 'The label for free items.',
    defaultMessage: 'Free',
  },
})

const styles = {
  image: css({
    background: ColorPalette.lightGrey,
    minHeight: 100,
    minWidth: 100,
  }),
}

interface IProps {
  coverImage?: string
  deleted?: boolean
  id: string
  images: ReadonlyArray<string>
  name: string
  onClick: (thingId: string) => void
  price: string
  status: string
}

class ThingListItem extends React.PureComponent<IProps & InjectedIntlProps> {
  state = {
    hidden: !!this.props.deleted,
  }

  getLabel = (status: string) => {
    const { formatMessage } = this.props.intl
    switch (status) {
      case 'to-give':
        return formatMessage(messages.borrowLabel)

      case 'given':
        return formatMessage(messages.lendLabel)

      case 'services':
        return formatMessage(messages.servicesLabel)

      default:
      case 'for-sale':
        return null
    }
  }

  renderPriceless = () => {
    const { formatMessage } = this.props.intl
    return formatMessage(messages.freeLabel)
  }

  handleClick = () => this.props.onClick(this.props.id)

  render() {
    if (this.state.hidden) {
      return null
    }
    const { coverImage, name, price, deleted, status } = this.props

    const image =
      coverImage ||
      `${process.env.CDN_HOST_URL_PREFIX || ''}/static/img/default/image.svg`
    const label = this.getLabel(status)

    return (
      <View
        direction="row"
        onClick={this.handleClick}
        style={{
          background: 'red',
          zIndex: deleted ? 100 : 200,
          transform: deleted ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'all 400ms cubic-bezier(0.770, 0.175, 0.260, 0.670)',
        }}
        onTransitionEnd={() => this.setState({ hidden: true })}
      >
        <View {...styles.image}>
          <Image
            src={image}
            size="cover"
            position="center"
            style={{ width: 100, height: 100 }}
          />
        </View>
        <ListItem flex="grow" alignV="start">
          <View alignV="stretch" direction="column" flex="flex">
            <Text size="l" data-e2e={`marketplace-thing-${name}`}>
              {label && (
                <Pill
                  label={label}
                  {...css({ float: 'right', marginLeft: 10 })}
                />
              )}
              {name}
            </Text>
            <Spacer />
            <Text size="xl" strong color="primary">
              {price ? price : this.renderPriceless()}
            </Text>
          </View>
        </ListItem>
      </View>
    )
  }
}

export default injectIntl(ThingListItem)
