import { accountsBaseUrl } from 'utils/accountsOAuth'

const handleOAuthAuthorizeRedirect = (
  { httpMethod, path, hostname, queryString }: Partial<ParsedRequest>,
  response: { redirect: (url: string, status?: number) => void },
): boolean => {
  if (
    httpMethod !== 'GET' ||
    !path ||
    (!path.startsWith('/oauth/') && !path.startsWith('/auth/'))
  ) {
    return false
  }

  // tslint:disable-next-line:no-console
  console.warn(
    `OAuth client using deprecated resource [${path}]; ${queryString}`,
  )

  response.redirect(
    accountsBaseUrl(hostname) +
      path.replace(/^\/auth\//, '/oauth/') +
      (queryString || ''),
    301,
  )
  return true
}

export default handleOAuthAuthorizeRedirect
