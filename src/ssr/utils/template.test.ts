import parseRequest from './apiGatewayRequest'
import template from './template'

import testEvent from '../test/fixtures/requests/login-route.json'

it('should render the template', () => {
  const request = parseRequest(testEvent as any, null)

  /*  we need to set NODE_ENV to 'development' because we don't
      run tests with a webpack'd source. template() makes use of
      the webpack html-loader in non-development mode so that the
      template HTML file is bundled (thus not requiring a disk read
      on lambda—which improves response/invocation cold-start).
  */
  process.env.NODE_ENV = 'development'

  expect(() => {
    const result = template(request)

    expect(result).toBeTruthy()
    expect(result.match(/\$CDN_HOST_URL_PREFIX\$/g)).toBeNull()
    expect(result.match(/\$MAIN_BUNDLE\$/g)).toBeNull()
    expect(result.match(/\$VENDOR_BUNDLE\$/g)).toBeNull()
    expect(result.match(/\$VERSION\$/g)).toBeNull()
    expect(result.match(/\$MIXPANEL_TOKEN\$/g)).toBeNull()
  }).not.toThrow()
})
