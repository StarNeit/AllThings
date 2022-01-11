import React from 'react'
import Link from 'components/Link'
import { FormattedMessage, injectIntl } from 'react-intl'
import { alpha, ColorPalette } from '@allthings/colors'
import { localizeDate } from 'components/DateString'
import CheckmarkIcon from '@allthings/react-ionicons/lib/CheckmarkIcon'
import { css } from 'glamor'
import { dateFromISO8601 } from 'utils/date'
import {
  Text,
  ListSpinner,
  View,
  GroupedCardList,
  ListItem,
  ChevronRightListItem,
} from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'
import useReactivate from 'utils/hooks/useReactivate'

const styles = {
  check: css({
    border: '1px solid rgb(236, 240, 241)',
    borderRadius: '50%',
    fontSize: '18px',
    height: '38px',
    left: '6px',
    paddingTop: '5px',
    position: 'absolute',
    textAlign: 'center',
    width: '38px',
  }),
  title: (loading = false) =>
    css({
      backgroundColor: loading
        ? alpha(ColorPalette.lightGrey, 0.75)
        : 'transparent',
      color: 'rgb(51, 51, 51)',
      height: loading ? '14px' : 'initial',
      margin: '0 0 .2em',
      overflow: 'hidden',
      paddingRight: '20px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '780px',
      width: loading ? 'calc(100vw - 490px)' : 'initial',
      [createMQ('mobile')]: {
        width: 'calc(100vw - 115px)',
      },
    }),
  link: css({
    padding: '10px 10px 15px 52px',
    position: 'relative',
  }),
  spinner: css({ height: 124, paddingTop: 20 }),
}

interface IProps {
  refetch?: () => void
  label: string
  loading: boolean
  tickets: ReadonlyArray<ITicket>
  type: 'opened' | 'closed'
}

const renderPresentTickets = ({
  tickets,
  type,
  intl,
}: {
  tickets: IProps['tickets']
  type: IProps['type']
} & InjectedIntlProps) =>
  tickets.map(ticket => (
    <ChevronRightListItem
      data-e2e={`service-center-overview-list-item-${ticket.id}`}
      flex="nogrow"
      key={ticket.id}
      innerStyle={{ maxWidth: 'calc(100% - 12px)' }}
    >
      <Link to={`/service-center/ticket/${ticket.id}`} {...styles.link}>
        <React.Fragment>
          <i {...styles.check}>
            <CheckmarkIcon
              style={{
                fill:
                  type === 'closed'
                    ? ColorPalette.greenIntense
                    : ColorPalette.lightGreyIntense,
                width: 16,
                height: 16,
              }}
            />
          </i>
          <Text {...styles.title()} block>
            {ticket.title}
          </Text>
          <Text block color={alpha(ColorPalette.text.primary, 0.75)} size="s">
            {localizeDate(dateFromISO8601(ticket.createdAt), intl)}
          </Text>
        </React.Fragment>
      </Link>
    </ChevronRightListItem>
  ))

const renderTicketList = ({
  tickets,
  loading,
  type,
  intl,
}: {
  loading: boolean
  tickets: IProps['tickets']
  type: IProps['type']
} & InjectedIntlProps) => {
  if (!loading && tickets.length === 0) {
    return (
      <ListItem>
        <Text block {...css({ padding: '12px', width: '100%' })}>
          <FormattedMessage
            id="service-center.list.empty-message"
            description="Text when no enquiries are available yet"
            defaultMessage="No enquiries available yet."
          />
        </Text>
      </ListItem>
    )
  } else if (loading && tickets.length === 0) {
    // render skeletons
    return [0, 1].map(item => (
      <ListItem key={item}>
        <div {...styles.link}>
          <i {...styles.check}>
            <CheckmarkIcon
              style={{
                fill:
                  type === 'closed'
                    ? ColorPalette.greenIntense
                    : ColorPalette.lightGreyIntense,
                width: 16,
                height: 16,
              }}
            />
          </i>
          <Text {...styles.title(true)} block />
          <Text
            block
            {...css({
              backgroundColor: alpha(ColorPalette.lightGrey, 0.75),
              height: '12px',
              width: '150px',
            })}
          />
        </div>
      </ListItem>
    ))
  } else if (loading && tickets.length !== 0) {
    return [
      ...renderPresentTickets({ tickets, type, intl }),
      <View key={0} direction="row" alignH="center" {...styles.spinner}>
        <ListSpinner />
      </View>,
    ]
  }

  return renderPresentTickets({ tickets, type, intl })
}

const ServiceCenterList: React.FunctionComponent<
  IProps & InjectedIntlProps
> = ({ label, type, tickets, refetch, loading, intl }) => {
  useReactivate(() => {
    refetch && refetch()
  })

  return (
    <GroupedCardList
      title={label}
      data-e2e={`service-center-overview-list-${type}`}
    >
      {renderTicketList({ loading, tickets, type, intl })}
    </GroupedCardList>
  )
}

export default injectIntl(ServiceCenterList)
