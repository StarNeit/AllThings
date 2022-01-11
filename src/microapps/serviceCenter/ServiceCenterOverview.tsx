import React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { defineMessages, useIntl } from 'react-intl'
import {
  Button,
  Icon,
  ListSpinner,
  Responsive,
  SimpleLayout,
  Spacer,
} from '@allthings/elements'
import Microapp from 'components/Microapp'
import { AppTitle } from 'containers/App'
import ServiceCenterList from './ServiceCenterList'
import { MicroApps, TicketStatus } from 'enums'
import OverlayToggle from 'components/OverlayToggle'
import ServiceCenterCreateOverlay from './ServiceCenterCreateOverlay'
import PagedDataProvider from 'containers/PagedDataProvider'
import useMixpanel from 'utils/hooks/useMixpanel'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'

const messages = defineMessages({
  newRequestButton: {
    id: 'service-center.overview.titlebar.new',
    description: '"New" button in the app title bar',
    defaultMessage: 'New enquiry',
  },
  openedTitle: {
    id: 'service-center.overview.pending.title',
    description: 'Title of pending enquiries list',
    defaultMessage: 'Opened enquiries',
  },
  closedTitle: {
    id: 'service-center.overview.closed.title',
    description: 'Title of closed enquiries list',
    defaultMessage: 'Closed enquiries',
  },
  heroText: {
    id: 'service-center.hero-text',
    description: 'Text of the ServiceCenter hero',
    defaultMessage: 'Welcome to your service center',
  },
  loadingMoreTickets: {
    id: 'service-center.overview.load-more.label',
    description: 'Button to load more tickets',
    defaultMessage: 'Load more',
  },
})

interface IProps {
  userId: string
  config: MicroAppProps
  appId: string
}

const ServiceCenterOverview: React.FunctionComponent<IProps & DispatchProp> = ({
  config,
  userId,
  appId,
}) => {
  const { formatMessage } = useIntl()
  const mixpanel = useMixpanel()

  return (
    <Microapp>
      <AppTitle>{config.label}</AppTitle>
      <SimpleLayout padded="horizontal">
        <OverlayToggle overlay={ServiceCenterCreateOverlay} hashName="create">
          {({ open }) => (
            <MicroappBigTitleBar
              type={MicroApps.HELPDESK}
              subTitle={formatMessage(messages.heroText)}
              buttonText={
                <>
                  <Responsive mobile>
                    <Icon name="plus-light-filled" size="s" color="white" />
                  </Responsive>
                  <Responsive tablet desktop>
                    {formatMessage(messages.newRequestButton)}
                  </Responsive>
                </>
              }
              onButtonClick={() => {
                mixpanel('ticket.creation.started')
                open()
              }}
            />
          )}
        </OverlayToggle>
        <PagedDataProvider
          limit={20}
          path={`/api/v1/users/${userId}/tickets`}
          params={{
            appFilter: appId,
          }}
        >
          {({ loading, pages, refetch, fetchNext, hasNextPage }) => {
            const tickets: ITicket[] = pages.reduce(
              (allTicketPages: ITicket[], page: ITicket[]) =>
                allTicketPages.concat(page),
              [],
            )
            const openTickets = tickets.filter(
              ticket => ticket.status !== TicketStatus.CLOSED,
            )
            const closedTickets = tickets.filter(
              ticket => ticket.status === TicketStatus.CLOSED,
            )

            return (
              <SimpleLayout
                onPullDown={refetch}
                onScrollEnd={hasNextPage && fetchNext}
              >
                {openTickets.length > 0 && (
                  <ServiceCenterList
                    label={formatMessage(messages.openedTitle)}
                    loading={loading}
                    tickets={openTickets}
                    type={'opened'}
                  />
                )}
                {closedTickets.length > 0 && (
                  <ServiceCenterList
                    label={formatMessage(messages.closedTitle)}
                    loading={loading}
                    tickets={closedTickets}
                    type={'closed'}
                  />
                )}
                {loading ? <ListSpinner /> : <Spacer />}
                {hasNextPage && !loading && (
                  <Button onClick={fetchNext}>
                    {formatMessage(messages.loadingMoreTickets)}
                  </Button>
                )}
              </SimpleLayout>
            )
          }}
        </PagedDataProvider>
      </SimpleLayout>
    </Microapp>
  )
}

export default connect((state: IReduxState) => ({
  userId: state.authentication.user.id,
  appId: state.app.config.appID,
}))(ServiceCenterOverview)
