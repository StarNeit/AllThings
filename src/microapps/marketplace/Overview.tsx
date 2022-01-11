import React from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { AppTitle } from 'containers/App'
import ListThings, { IListThings } from './ListThings'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import {
  ChevronRightListItem,
  GroupedCardList,
  Icon,
  Inset,
  ListIcon,
  ListItem,
  ListSpinner,
  Text,
  View,
} from '@allthings/elements'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from '../../enums'
import ThingOverlayToggle from 'microapps/marketplace/ThingOverlay/ThingOverlayToggle'

const marketplaceMessages = defineMessages({
  offeringsTitle: {
    id: 'marketplace.offerings-title',
    description: 'Title for the group of offerings',
    defaultMessage: 'Offerings',
  },
  heroText: {
    id: 'marketplace.hero-text',
    description: 'Text of the Marketplace hero',
    defaultMessage: 'Welcome to the marketplace',
  },
  newItemButton: {
    id: 'marketplace.new-item-button',
    description: 'Label of the button to create a new entry',
    defaultMessage: 'Sell now',
  },
})

const sharingMessages = defineMessages({
  heroText: {
    id: 'sharing.hero-text',
    description: 'Text of the Sharing Place hero',
    defaultMessage: 'Welcome to the sharing place',
  },
  offeringsTitle: {
    id: 'sharing.offerings-title',
    description: 'Title for the group of offerings',
    defaultMessage: 'Offerings',
  },
  newItemButton: {
    id: 'sharing.new-item-button',
    description: 'Label of the button to create a new entry',
    defaultMessage: 'Offer something',
  },
})

const messages = (type: string) =>
  type === 'sharing' ? sharingMessages : marketplaceMessages

interface IProps {
  type: 'marketplace' | 'sharing'
  deletedThings: readonly string[]
}

const Overview = ({ type, deletedThings }: IProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useDispatch()

  const onClickThing = (id: string) => dispatch(push(`/${type}/show/${id}`))
  const onClickMyOfferings = () => dispatch(push(`/${type}/me`))
  const onChange = ({ id }: { readonly id: string }) =>
    dispatch(push(`/${type}/me/${id}`))

  const renderListFn = ({ things, loading }: IListThings) => (
    <>
      <ThingOverlayToggle
        type={type === 'sharing' ? 'to-give' : 'for-sale'}
        onChange={onChange}
      >
        {({ open }) => (
          <MicroappBigTitleBar
            type={
              type === 'sharing' ? MicroApps.SHARING : MicroApps.MARKETPLACE
            }
            subTitle={formatMessage(messages(type).heroText)}
            buttonText={
              <Icon name="plus-light-filled" size="s" color="white" />
            }
            onButtonClick={open}
            isTwoColumnLayout
          />
        )}
      </ThingOverlayToggle>
      <GroupedCardList title="">
        <ChevronRightListItem
          data-e2e="marketplace-feed-me"
          onClick={onClickMyOfferings}
        >
          <View direction="row" alignV="center">
            <ListIcon
              iconColor="white"
              name={
                type === 'sharing' ? 'sharetime-filled' : 'shopping-cart-filled'
              }
            />
            <Inset>
              <Text>
                <FormattedMessage
                  id="marketplace.my-items-button-label"
                  defaultMessage={`My offerings`}
                />
              </Text>
            </Inset>
          </View>
        </ChevronRightListItem>
      </GroupedCardList>

      <GroupedCardList
        style={{ background: '#f9f9f9' }}
        title={formatMessage(messages(type).offeringsTitle)}
      >
        {loading && (
          <ListItem alignH="center">
            <ListSpinner />
          </ListItem>
        )}
        {things}
      </GroupedCardList>
    </>
  )

  const filter = []
  if (type === 'sharing') {
    filter.push({ status: ['services', 'to-give'] })
  } else {
    filter.push({ status: 'for-sale' })
  }

  return (
    <HorizontalRouterMicroapp>
      <AppTitle>{formatMessage(messages(type).offeringsTitle)}</AppTitle>
      <ListThings
        deletedThings={deletedThings}
        onClickThing={onClickThing}
        filter={filter}
      >
        {renderListFn}
      </ListThings>
    </HorizontalRouterMicroapp>
  )
}

export default Overview
