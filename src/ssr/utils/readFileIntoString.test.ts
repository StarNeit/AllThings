import readFileIntoString from './readFileIntoString'

const testFixture = '../test/fixtures/foobar.txt'

it('correctly read file', () => {
  const fileString = readFileIntoString(__dirname, testFixture)
  expect(fileString).toBe('foobar\n')
})
