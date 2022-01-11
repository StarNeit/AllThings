import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'components/Link'
import { View, Text } from '@allthings/elements'

const NotFound = () => (
  <View>
    <View flex="flex" direction="column" alignH="center" alignV="center">
      <View style={{ height: 15 }} />
      <Text
        style={{
          marginBottom: '20px',
          fontSize: '50px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: `0 1px 0 #ccc,
               0 2px 0 #c9c9c9,
               0 3px 0 #bbb,
               0 4px 0 #b9b9b9,
               0 5px 0 #aaa,
               0 6px 1px rgba(0,0,0,.1),
               0 0 5px rgba(0,0,0,.1),
               0 1px 3px rgba(0,0,0,.3),
               0 3px 5px rgba(0,0,0,.2)`,
        }}
      >
        <FormattedMessage
          id="not-found.title"
          description="The error title when the route is not found"
          defaultMessage="404"
        />
      </Text>
      <Text color="white" size="xl">
        <FormattedMessage
          id="page-not-found.message"
          description="The error message when the route is not found"
          defaultMessage="Sorry, the page you were looking for was not found."
        />
      </Text>
      <View style={{ height: 15 }} />
      <Link to="/" data-e2e="not-found-link">
        <Text color="white" size="xl">
          <FormattedMessage
            id="not-found.redirect-link"
            description="Label of the redirect link"
            defaultMessage="Return to home"
          />
        </Text>
      </Link>
    </View>
  </View>
)

export default NotFound
