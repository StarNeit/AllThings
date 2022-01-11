import React from 'react'
import Microapp from 'components/Microapp'
import UsersGroupedList from 'components/UsersGroupedList'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PagedDataProvider, { IData } from 'containers/PagedDataProvider'
import { css } from 'glamor'
import PinboardActions from 'store/actions/pinboard'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { sendSuccess } from '@allthings/elements/NotificationBubbleManager'
import {
  View,
  confirm as confirmWithUser,
  SimpleLayout,
  Text,
} from '@allthings/elements'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const i18n = defineMessages({
  yes: {
    id: 'user-profile.unmute-user-confirm-accept',
    description: 'Accept button "Do you want to unmute user?"',
    defaultMessage: 'Yes',
  },
  cancel: {
    id: 'user-profile.unmute-user-confirm-cancel',
    description: 'Cancel button to "Do you want to unmute user?"',
    defaultMessage: 'Cancel',
  },
  unmuteUserNow: {
    id: 'user-profile.unmute-user-confirm',
    description: 'Unmute User',
    defaultMessage: 'Would you like to unmute this user? ',
  },
  userUnmutedSuccess: {
    id: 'user-profile.unmute-user-success',
    description: 'Success bubble when a user is unmuted',
    defaultMessage: 'Unmuted {name} on Pinboard',
  },
  userUnmutedFailed: {
    id: 'user-profile.unmute-user-failed',
    description: 'Failure bubble when a user is unmuted',
    defaultMessage: 'Could not unmute {name} on Pinboard',
  },
})

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const MutedUsers = ({
  onUnmuteUser,
  selfUser: { id },
  navigateToSettings,
}: Props) => (
  <Microapp>
    <GenericBackTitleBar onBack={navigateToSettings} />
    <PagedDataProvider
      path={`api/v1/users/${id}/muted-users`}
      params={{
        'sort-by': 'transliteratedUsername',
        'sort-direction': 'asc',
        limit: '25',
      }}
    >
      {({ pages, loading, refetch, fetchNext }: IData) => (
        <SimpleLayout
          padded="horizontal"
          onScrollEnd={fetchNext}
          {...css({ paddingBottom: '25px' })}
        >
          {pages && pages[0] ? (
            pages[0].length > 0 ? (
              <UsersGroupedList
                pages={pages}
                isLoadingNextPage={loading}
                onClickUser={async (userId, name) => {
                  await onUnmuteUser(userId, name)
                  refetch()
                }}
              />
            ) : (
              <View {...css({ padding: '30px' })}>
                <Text color="gray" align="center">
                  <FormattedMessage
                    id="settings.muted-pinboard-users.no-user-muted"
                    description="No user is muted on your pinboard"
                    defaultMessage="No user is muted on your pinboard"
                  />
                </Text>
              </View>
            )
          ) : (
            undefined
          )}
        </SimpleLayout>
      )}
    </PagedDataProvider>
  </Microapp>
)

const mapStateToProps = (state: IReduxState) => ({
  selfUser: state.authentication.user,
})

const mapDispatchToProps = (
  dispatch: FunctionalDispatch,
  { intl }: InjectedIntlProps,
) => ({
  navigateToSettings: () => dispatch(push('/settings')),
  onUnmuteUser: async (userId: string, name: string) => {
    const customization = {
      acceptButtonLabel: intl.formatMessage(i18n.yes),
      cancelButtonLabel: intl.formatMessage(i18n.cancel),
      message: intl.formatMessage(i18n.unmuteUserNow),
    }
    const userIsCertain = await confirmWithUser(customization)

    if (userIsCertain) {
      const res = await dispatch(PinboardActions.unmuteUser(userId))
      if (res.status.code > 199 && res.status.code < 300) {
        sendSuccess(
          intl.formatMessage(i18n.userUnmutedSuccess, {
            name,
          }),
        )
      } else {
        sendSuccess(intl.formatMessage(i18n.userUnmutedFailed, { name }))
      }
    }
  },
})

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(MutedUsers),
)
