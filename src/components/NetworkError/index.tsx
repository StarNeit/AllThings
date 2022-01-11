import React from 'react'
import {
  View,
  SimpleLayout,
  Button,
  Text,
  Responsive,
} from '@allthings/elements'
import { FormattedMessage } from 'react-intl'

interface IProps {
  readonly refetch: () => unknown
  readonly compact?: boolean
}

const NetworkError = ({ refetch, compact = true }: IProps) => (
  <SimpleLayout onPullDown={refetch}>
    <View
      style={{ margin: 20 }}
      alignH="center"
      alignV="center"
      direction="column"
    >
      {!compact && (
        <Responsive mobile tablet>
          <img
            src={`${process.env.CDN_HOST_URL_PREFIX ||
              ''}/static/img/ux-illustrations/error.mobile.png`}
          />
        </Responsive>
      )}
      {!compact && (
        <Responsive desktop>
          <img
            src={`${process.env.CDN_HOST_URL_PREFIX ||
              ''}/static/img/ux-illustrations/error.desktop.png`}
          />
        </Responsive>
      )}
      <Text style={{ margin: 20 }}>
        <FormattedMessage
          id="network-error.message"
          description="Error message that explains that data could not get fetched"
          defaultMessage="Oops, something when wrong."
        />
      </Text>
      <Button onClick={refetch}>
        <FormattedMessage
          id="network-error.button"
          description="Label of the retry button in network error screen"
          defaultMessage="Retry"
        />
      </Button>
    </View>
  </SimpleLayout>
)

export default NetworkError
