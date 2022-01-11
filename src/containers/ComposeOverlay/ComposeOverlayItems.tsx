import React from 'react'
import { FormattedMessage } from 'react-intl'
import { push } from 'connected-react-router'
import { IConfig } from 'containers/ComposeOverlay/ComposeOverlayItem'

export enum ConfigId {
  'pinboard',
  'service-center',
  'marketplace',
  'borrowing',
  'services',
}

const ComposeOverlayItems: IConfig[] = [
  {
    id: ConfigId.pinboard,
    style: 'pinnwand',
    type: 'community-articles',
    icon: 'user-group-chat-filled',
    onClick: (dispatch: FunctionalDispatch) =>
      dispatch(push('/pinboard#create')),
    title: () => (
      <FormattedMessage
        id="compose.pinboard"
        description="Label for the post-on-pinboard button"
        defaultMessage="Post on pinboard"
      />
    ),
  },
  {
    id: ConfigId['service-center'],
    style: 'support',
    type: 'helpdesk',
    icon: 'user-chat-filled',
    onClick: (dispatch: FunctionalDispatch) =>
      dispatch(push('/service-center#create')),
    title: () => (
      <FormattedMessage
        id="compose.service-center"
        description="Label for the create-service-center-message button"
        defaultMessage="Create service center message"
      />
    ),
  },
  {
    id: ConfigId.marketplace,
    style: 'buying',
    type: 'marketplace',
    icon: 'shopping-cart-filled',
    onClick: (dispatch: FunctionalDispatch) =>
      dispatch(push('/marketplace#thing')),
    title: () => (
      <FormattedMessage
        id="compose.marketplace"
        description="Label for the sell-something button"
        defaultMessage="Sell something"
      />
    ),
  },
  {
    id: ConfigId.borrowing,
    style: 'borrowing',
    type: 'sharing',
    icon: 'sharetime-filled',
    onClick: (dispatch: FunctionalDispatch) => dispatch(push('/sharing#thing')),
    title: () => (
      <FormattedMessage
        id="compose.borrowing"
        description="Label for the lend-something button"
        defaultMessage="Lend something"
      />
    ),
  },
  {
    id: ConfigId.services,
    style: 'support',
    type: 'sharing',
    icon: 'sharetime-filled',
    onClick: (dispatch: FunctionalDispatch) => dispatch(push('/sharing#thing')),
    title: () => (
      <FormattedMessage
        id="compose.services"
        description="Label for offer-help button"
        defaultMessage="Offer help"
      />
    ),
  },
]

export default ComposeOverlayItems
