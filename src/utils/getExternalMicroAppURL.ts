import getServiceHost from './getServiceHost'

const getExternalMicroAppURL = ({
  appId,
  hostname,
  url,
}: {
  appId: string
  hostname: string
  url: string
}): string => {
  const authorizationURL = getServiceHost(hostname, 'accounts')
  const OAuthClientRegEx = /auth\/authorize/
  const matchResult = url?.match(OAuthClientRegEx)

  if (matchResult) {
    const lastIndex = matchResult[0].length + matchResult.index

    return `https://${authorizationURL}/oauth/authorize${url.substring(
      lastIndex,
    )}`
  }

  // Inject the appId as a query parameter for external microapps whose oauth
  // flow is managed on their own - i.e. that are defined as direct access URL,
  // e.g. a lambda handler invocation URL.
  return `${url}?appId=${appId}`
}

export default getExternalMicroAppURL
