import React from 'react'
import { FormattedMessage, FormattedRelativeTime } from 'react-intl'
import { ColorPalette, alpha } from '@allthings/colors'
import { dateFromISO8601 } from 'utils/date'
import UserProfileImage from 'components/UserProfileImage'
import { View, Text } from '@allthings/elements'
import get from 'lodash-es/get'
import { MicroApps } from 'enums'
import { selectUnit } from '@formatjs/intl-utils'

const createdAt = (notification: INotification) =>
  notification.createdAt && (
    <View direction="row" wrap="wrap" style={{ marginLeft: '5px' }}>
      <Text size="s">
        <FormattedRelativeTime
          {...selectUnit(dateFromISO8601(notification.createdAt))}
        />
      </Text>
    </View>
  )

// Map notification-types to microApp-types.
const getAppColor = (
  microAppsThemes: IndexSignature,
  notification: INotification,
) => {
  switch (notification.type) {
    case 'clipboard-thing':
      switch (notification.category) {
        case 'new-things-to-give':
          return microAppsThemes[MicroApps.SHARING]

        default:
          return microAppsThemes[MicroApps.MARKETPLACE]
      }

    case 'community-article':
    case 'comment':
      return microAppsThemes[MicroApps.PINBOARD]

    case 'ticket-comment':
      return microAppsThemes[MicroApps.HELPDESK]

    case 'welcome-notification':
      return ColorPalette.lightGreyIntense

    case 'new-file':
      return microAppsThemes[MicroApps.DOCUMENTS]

    default:
      return microAppsThemes[MicroApps.PINBOARD]
  }
}

const getIndicator = (read: boolean) =>
  read ? alpha(ColorPalette.black, 0) : alpha(ColorPalette.black, 0.4)

const renderMessage = (author: Partial<IUser>, title: string, type: string) => {
  switch (type) {
    case 'comment':
      return (
        <FormattedMessage
          id="notification.comment"
          description="Greeting to welcome the user to the app"
          defaultMessage='{author} wrote a comment "{comment}"'
          values={{
            author: (
              <Text size="s" strong={true}>
                {author.username}
              </Text>
            ),
            comment: (
              <Text size="s" strong block={false}>
                {title}
              </Text>
            ),
          }}
        />
      )

    case 'community-article':
      return (
        <FormattedMessage
          id="notification.community-article"
          description="Greeting to welcome the user to the app"
          defaultMessage='{author} posted "{article}"'
          values={{
            author: (
              <Text size="s" strong={true}>
                {author.username}
              </Text>
            ),
            article: title,
          }}
        />
      )

    case 'ticket-comment':
      return (
        <FormattedMessage
          id="notification.ticket-comment"
          description="Greeting to welcome the user to the app"
          defaultMessage='{author} answered to your ticket "{comment}"'
          values={{
            author: (
              <Text size="s" strong={true}>
                {author.username}
              </Text>
            ),
            comment: title,
          }}
        />
      )

    case 'clipboard-thing':
      return (
        <FormattedMessage
          id="notification.clipboard-thing"
          description="Greeting to welcome the user to the app"
          defaultMessage='{author} now offers "{thing}"'
          values={{
            author: (
              <Text size="s" strong={true}>
                {author.username}
              </Text>
            ),
            thing: (
              <Text size="s" italic={true} block={false}>
                {title}
              </Text>
            ),
          }}
        />
      )

    case 'welcome-notification':
      return (
        <FormattedMessage
          id="notification.welcome"
          description="Greeting to welcome the user to the app"
          defaultMessage="You have no notifications right now."
          values={{
            author: (
              <Text size="s" strong={true}>
                {author.username}
              </Text>
            ),
          }}
        />
      )
    case 'new-file':
      return (
        <FormattedMessage
          id="notification.new-file"
          description="Notification if a new files was uploaded for the user"
          defaultMessage="You have a new file {filename}"
          values={{
            filename: (
              <Text size="s" strong={true}>
                {title}
              </Text>
            ),
          }}
        />
      )

    default:
      return (
        <FormattedMessage
          id="notification.default"
          description="Greeting to welcome the user to the app"
          defaultMessage='{author}: "{comment}"'
          values={{
            author: author.username,
            comment: title,
          }}
        />
      )
  }
}

interface IProps {
  microAppsThemes: object
  notification: INotification
  onClick?: (url: string, id: string) => void
}

export default function NotificationListItem({
  microAppsThemes,
  notification,
  onClick,
}: IProps) {
  const {
    _embedded: { author },
    category,
    id,
    objectID,
    read,
    referencedObjectID,
    title,
    type,
  } = notification
  const profileImage = get(author, '_embedded.profileImage')

  const handleClick = () => {
    let url = ''

    switch (type) {
      case 'comment':
        url = `/pinboard/post/${referencedObjectID}#comments`
        break

      case 'community-article':
        url = `/pinboard/post/${objectID}`
        break

      case 'new-file':
        url = `/documents`
        break

      case 'clipboard-thing':
        switch (category) {
          case 'new-things-to-give':
            url = `/sharing/show/${objectID}`
            break

          case 'new-things-for-sale':
            url = `/marketplace/show/${objectID}`
            break
        }
        break

      case 'ticket-comment':
        url = `/service-center/ticket/${referencedObjectID}`
        break
    }

    onClick(url, id)
  }

  return (
    <View
      direction="row"
      style={{
        backgroundColor: ColorPalette.white,
        minHeight: '50px',
      }}
      onClick={handleClick}
      data-e2e={`notification-item-${notification.category}`}
    >
      <View
        style={{
          backgroundColor: getAppColor(microAppsThemes, notification),
          color: getIndicator(read),
          fontSize: '12px',
          minWidth: '18px',
          paddingLeft: '5px',
          paddingTop: '7px',
        }}
      >
        ●
      </View>
      <View
        direction="row"
        flex="flex"
        style={{
          borderBottom: `1px solid ${ColorPalette.lightGrey}`,
          fontSize: '12px',
          margin: '0 5px',
          padding: '7px',
        }}
      >
        <UserProfileImage
          profileImage={profileImage}
          size="m"
          style={{ marginRight: '5px', width: '40px', height: '40px' }}
        />
        <View
          flex="flex"
          data-e2e={`notification-item-${notification.category}-content`}
        >
          {renderMessage(author, title, type)}
        </View>
        {createdAt(notification)}
      </View>
    </View>
  )
}
