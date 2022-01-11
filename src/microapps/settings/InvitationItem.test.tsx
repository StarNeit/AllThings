import { addYears, subYears } from 'date-fns/fp'
import React from 'react'
import {
  InvitationItemCreatedAtMessage,
  InvitationItemExpiresAtMessage,
} from './InvitationItem'

// Needed as localizeDate returns a different time on the CI!
jest.mock('../../components/DateString', () => ({
  localizeDate: jest.fn(() => 'February 15, 2017, 1:00 AM'),
}))

describe('Check invitation items', () => {
  it('should display one for created at', () => {
    const wrapper = global.mountIntl(
      <InvitationItemCreatedAtMessage createdAt={new Date().toISOString()} />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should display one for expires at - no expiration date', () => {
    const wrapper = global.mountIntl(<InvitationItemExpiresAtMessage />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should display one for expires at - past expiration date', () => {
    const invitation = {
      expiresAt: subYears(10)(new Date()).toISOString(),
    }
    const wrapper = global.mountIntl(
      <InvitationItemExpiresAtMessage {...invitation} />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should display one for expires at - future expiration date', () => {
    const invitation = {
      expiresAt: addYears(10)(new Date()).toISOString(),
    }
    const wrapper = global.mountIntl(
      <InvitationItemExpiresAtMessage {...invitation} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
