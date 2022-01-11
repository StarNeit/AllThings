import { getAuthorizationUrlAndState } from './accountsOAuth'

describe('accountsOAuth', () => {
  it('getAuthorizationCodeUrl', () => {
    const { url, state } = getAuthorizationUrlAndState({
      hostname: 'app.dev.allthings.me',
      scope: 'user:profile',
      clientId: 'myClientId',
    })

    expect(url).toEqual(
      `https://accounts.dev.allthings.me/oauth/authorize?client_id=myClientId&redirect_uri=https%3A%2F%2Fapp.dev.allthings.me%2Flogin%3Fprovider%3Dallthings&response_type=code&scope=user%3Aprofile&state=${state}`,
    )
  })
  it('getAuthorizationCodeUrl with signup param', () => {
    const { url, state } = getAuthorizationUrlAndState({
      hostname: 'app.dev.allthings.me',
      scope: 'user:profile',
      clientId: 'myClientId',
      isSignup: true,
    })

    expect(url).toEqual(
      `https://accounts.dev.allthings.me/oauth/authorize?client_id=myClientId&redirect_uri=https%3A%2F%2Fapp.dev.allthings.me%2Flogin%3Fprovider%3Dallthings&response_type=code&scope=user%3Aprofile&signup=&state=${state}`,
    )
  })
})
