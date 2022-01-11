import readFileIntoString from './readFileIntoString'

export default (request: ParsedRequest, error: Error) => {
  let debugTemplate = readFileIntoString(
    __dirname,
    '../../../',
    `public/${
      process.env.NODE_ENV === 'development' ? 'debug' : 'hold-on'
    }.html`,
  )

  debugTemplate = debugTemplate.replace(
    /\$CDN_HOST_URL_PREFIX\$/g,
    process.env.CDN_HOST_URL_PREFIX || '',
  )

  if (process.env.NODE_ENV === 'development') {
    debugTemplate = debugTemplate
      .replace('$STACK$', error.stack)
      .replace('$STATE$', JSON.stringify(request.state, null, 2))
  }

  return debugTemplate
}
