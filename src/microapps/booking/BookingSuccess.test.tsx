import React from 'react'
import BookingSuccess from './BookingSuccess'
import { render } from '@testing-library/react'
import { IAsset } from '.'

export const renderWithIntlMessages = (ui: JSX.Element, messages = {}) =>
  render(global.nodeWithIntlProvider(ui, messages))

describe('BookingSuccess', () => {
  const noop = (): void => undefined

  it('renders success message and matches snapshot when asset does not need approval', () => {
    const uuid = global.uuid()
    const messages = { 'booking.success.no-needs-approval': uuid }
    const { queryByText } = renderWithIntlMessages(
      <BookingSuccess
        asset={
          ({
            requiresApproval: false,
          } as unknown) as IAsset
        }
        goToMyBookings={noop}
        onClickBookAgain={noop}
        onClickAddToCalendar={noop}
      />,
      messages,
    )

    expect(queryByText(uuid)).not.toBeNull()
  })

  it('renders "needs approval" message and matches snapshot when asset needs approval', () => {
    const uuid = global.uuid()
    const messages = { 'booking.success.needs-approval': uuid }
    const { queryByText } = renderWithIntlMessages(
      <BookingSuccess
        asset={
          ({
            requiresApproval: true,
          } as unknown) as IAsset
        }
        goToMyBookings={noop}
        onClickBookAgain={noop}
        onClickAddToCalendar={noop}
      />,
      messages,
    )
    expect(queryByText(uuid)).not.toBeNull()
  })
})
