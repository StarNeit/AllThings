import getExternalMicroAppURL from './getExternalMicroAppURL'

describe('getExternalMicroAppURL()', () => {
  const appId = '575027e58178f56a008b4568'

  it('should return a url with the appId', () => {
    const url = 'https://www.google.com'
    const actual = getExternalMicroAppURL({
      appId,
      hostname: 'https://app.dev.allthings.me',
      url,
    })

    expect(actual).toEqual(`${url}?appId=${appId}`)
  })

  it('should add accounts to a url that starts with /oauth/authorize', () => {
    const url = '/oauth/authorize/foobar'
    const actual = getExternalMicroAppURL({
      appId,
      hostname: 'https://office.allthings.app',
      url,
    })

    expect(actual).toEqual(`https://accounts.allthings.me${url}`)
  })

  it('should add accounts to a url that has /oauth/authorize somewhere', () => {
    const urlBefore = 'https://www3.my-foobar-app.allthings.app'
    const urlAfter = '/oauth/authorize/foobar'
    const url = urlBefore + urlAfter
    const actual = getExternalMicroAppURL({
      appId,
      hostname: 'https://office.allthings.app',
      url,
    })

    expect(actual).toEqual(`https://accounts.allthings.me${urlAfter}`)
  })

  it('should add accounts to a url that has /auth/authorize somewhere', () => {
    const url = 'https://www3.my-foobar-app.allthings.app/auth/authorize/foobar'
    const actual = getExternalMicroAppURL({
      appId,
      hostname: 'https://office.allthings.app',
      url,
    })

    expect(actual).toEqual(
      'https://accounts.allthings.me/oauth/authorize/foobar',
    )
  })

  it('should add accounts.dev in development', () => {
    const url = '/oauth/authorize/foobar'
    const actual = getExternalMicroAppURL({
      appId,
      hostname: 'https://app.dev.allthings.me',
      url,
    })

    expect(actual).toEqual(`https://accounts.dev.allthings.me${url}`)
  })
})
