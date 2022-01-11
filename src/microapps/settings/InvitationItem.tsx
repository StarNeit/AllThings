import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import { Text } from '@allthings/elements'
import { dateFromISO8601 } from 'utils/date'
import { localizeDate } from 'components/DateString'
import { selectUnit } from '@formatjs/intl-utils'

const textSecondary = ColorPalette.text.secondary

interface IInvitationItemCreatedAtMessageProps {
  createdAt?: string
}

export function InvitationItemCreatedAtMessage({
  createdAt,
}: IInvitationItemCreatedAtMessageProps) {
  const intl = useIntl()
  const creationDate = dateFromISO8601(createdAt)

  return (
    <FormattedMessage
      id="invitations.current-invitation-invited-at-date"
      description="Starting label for invitation starting date"
      defaultMessage="Invited: {date}"
      values={{
        date: localizeDate(creationDate, intl),
      }}
    />
  )
}

interface IInvitationItemExpiresAtMessageProps {
  expiresAt?: string
}

export function InvitationItemExpiresAtMessage({
  expiresAt,
}: IInvitationItemExpiresAtMessageProps) {
  const { formatRelativeTime } = useIntl()
  const expirationDate = dateFromISO8601(expiresAt)

  const { value, unit } = selectUnit(expirationDate.getTime())

  if (!expiresAt) {
    return (
      <Text style={{ color: textSecondary }}>
        <FormattedMessage
          id="invitations.current-invitation-never-expires"
          description="Starting label for invitation expiration date (no expiration date)"
          defaultMessage="No expiration date"
        />
      </Text>
    )
  } else if (expirationDate.getTime() >= Date.now()) {
    return (
      <Text style={{ color: textSecondary }}>
        <FormattedMessage
          id="invitations.current-invitation-expires-at"
          description="Starting label for invitation expiration date (will expire)"
          defaultMessage="Expires {date}"
          values={{
            date: formatRelativeTime(value, unit),
          }}
        />
      </Text>
    )
  }

  return (
    <Text style={{ color: textSecondary }}>
      <FormattedMessage
        id="invitations.current-invitation-is-expired-at"
        description="Starting label for invitation expiration date (already expired)"
        defaultMessage="Expired {date}"
        values={{
          date: formatRelativeTime(value, unit),
        }}
      />
    </Text>
  )
}
