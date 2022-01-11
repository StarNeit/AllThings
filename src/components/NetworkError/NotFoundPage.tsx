import React from 'react'
import { View, SimpleLayout, Text } from '@allthings/elements'
import { FormattedMessage } from 'react-intl'
import NotFound from './NotFound'

const NotFoundPage = () => (
  <SimpleLayout>
    <View
      style={{ margin: 20 }}
      alignH="center"
      alignV="center"
      direction="column"
    >
      <NotFound />
      <Text style={{ margin: 20 }}>
        <FormattedMessage
          id="network-error.not-found"
          description="Error message that explains that data could not get fetched"
          defaultMessage="We cannot find this thing."
        />
      </Text>
    </View>
  </SimpleLayout>
)

export default NotFoundPage
