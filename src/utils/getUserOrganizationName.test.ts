import getUserOrganizationName from './getUserOrganizationName'

describe('getUserOrganizationName helper', () => {
  const user = (props: any = {}) => ({ _embedded: props } as IAPIUser)

  it('should return null if no organization is present in the user object', () => {
    expect(getUserOrganizationName(user())).toEqual(null)
  })

  it('should return the organization name', () => {
    expect(
      getUserOrganizationName(user({ organization: { name: 'foo' } })),
    ).toEqual('foo')
  })

  it('should return the external agent company name', () => {
    expect(
      getUserOrganizationName(user({ externalAgentCompany: { name: 'bar' } })),
    ).toEqual('bar')
  })

  it('should return the company name', () => {
    expect(getUserOrganizationName(user({ company: { name: 'lol' } }))).toEqual(
      'lol',
    )
  })

  it('should prioritize if multiple ones are present', () => {
    expect(
      getUserOrganizationName(
        user({
          organization: { name: 'foo' },
          externalAgentCompany: { name: 'bar' },
          company: { name: 'lol' },
        }),
      ),
    ).toEqual('foo')

    expect(
      getUserOrganizationName(
        user({
          externalAgentCompany: { name: 'bar' },
          company: { name: 'lol' },
        }),
      ),
    ).toEqual('bar')

    expect(
      getUserOrganizationName(
        user({
          organization: { name: 'foo' },
          company: { name: 'bar' },
        }),
      ),
    ).toEqual('foo')
  })
})
