import getServiceHost from './getServiceHost'

const SERVICE = 'foobar'

it('should use a default service value of "api"', () => {
  const actual = getServiceHost('app.allthings.me')
  const expected = 'api.allthings.me'

  expect(actual).toEqual(expected)
})
it('should return the right host for hostname', () => {
  const examples = [
    ['app.example.org', `${SERVICE}.allthings.me`],
    ['app.allthings.me', `${SERVICE}.allthings.me`],
    ['devils-advocate-prerelease.allthings.app', `${SERVICE}.allthings.me`],
    ['app.dev.allthings.me', `${SERVICE}.dev.allthings.me`],
    ['app.staging.allthings.me', `${SERVICE}.staging.allthings.me`],
    [
      'app.prerelease-red.allthings.me',
      `${SERVICE}.prerelease-red.allthings.me`,
    ],
    ['app.localhost', `${SERVICE}.allthings.me`],
    ['app.prerelease-red.localhost', `${SERVICE}.prerelease-red.allthings.me`],
    ['app.staging.localhost', `${SERVICE}.staging.allthings.me`],
  ]
  examples.map(([input, output]) =>
    expect(getServiceHost(input, SERVICE)).toBe(output),
  )
})
