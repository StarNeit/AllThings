import urlParamsToProps from './urlParamsToProps'

it('should convert params to props', () => {
  const params = {
    match: {
      params: {
        id: 1,
        hello: 'world',
        foo: 'bar',
      },
    },
  }

  expect(
    urlParamsToProps(params, [['id', 'testId'], ['hello', 'place']])
  ).toMatchObject({
    testId: 1,
    place: 'world',
  })
})
