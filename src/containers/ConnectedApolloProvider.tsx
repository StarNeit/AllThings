import ApolloClient from 'apollo-boost'
import React, { useEffect, useState } from 'react'
import { ApolloProvider } from 'react-apollo'
import { connect } from 'react-redux'
import getServiceHost from 'utils/getServiceHost'

export const createClient = (token: string, hostname: string) =>
  new ApolloClient({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
    uri: `https://${getServiceHost(hostname, 'graphql')}`,
  })

const ConnectedApolloProvider = ({
  children,
  accessToken,
  hostname,
}: React.PropsWithChildren<{
  accessToken: string
  hostname: string
}>) => {
  const [client, setClient] = useState(createClient(accessToken, hostname))

  useEffect(() => {
    setClient(createClient(accessToken, hostname))
  }, [accessToken])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default connect(({ app, authentication }: IReduxState) => ({
  accessToken: authentication.accessToken,
  hostname: app.hostname,
}))(ConnectedApolloProvider)
