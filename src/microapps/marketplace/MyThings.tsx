import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { defineMessages, useIntl } from 'react-intl'
import { AppTitle } from 'containers/App'
import { Card, GroupTitle, List, ListSpinner } from '@allthings/elements'
import ListThings, { IListThings } from './ListThings'
import SlideIn from 'components/SlideIn'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const messages = defineMessages({
  myOfferings: {
    id: 'marketplace.my-offerings',
    description: 'The title of my offerings',
    defaultMessage: 'My offerings',
  },
})

interface IProps {
  type: 'marketplace' | 'sharing'
  deletedThings: readonly string[]
}

const MyThings = ({ deletedThings, type }: IProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useDispatch()
  const userId = useSelector<IReduxState, string>(
    state => state.authentication.user.id,
  )

  const renderThings = ({ things, loading }: IListThings) => {
    return (
      <>
        <SlideIn in={loading}>
          <ListSpinner style={{ marginTop: 4 }} />
        </SlideIn>
        <GroupTitle>{formatMessage(messages.myOfferings)}</GroupTitle>
        <Card style={{ background: '#F3F5F7' }}>
          <List>{things}</List>
        </Card>
      </>
    )
  }

  return (
    <HorizontalRouterMicroapp>
      <GenericBackTitleBar
        onBack={() =>
          dispatch(push(type === 'sharing' ? '/sharing' : '/marketplace'))
        }
      />

      <AppTitle>{formatMessage(messages.myOfferings)}</AppTitle>
      <ListThings
        deletedThings={deletedThings}
        onClickThing={(id: string) => dispatch(push(`/${type}/me/${id}`))}
        filter={[
          {
            status: type === 'sharing' ? 'to-give' : 'for-sale',
            user: userId,
          },
        ]}
      >
        {renderThings}
      </ListThings>
    </HorizontalRouterMicroapp>
  )
}

export default MyThings
