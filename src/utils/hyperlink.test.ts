import { addHyperlinksToText } from './hyperlink'

it('should convert valid URLS to links already containing http', () => {
  ;[
    'http://foo.com/blah_(wikipedia)#cite-1',
    'http://foo.com/blah_(wikipedia)_blah#cite-1',
    'http://code.google.com/events/#&product=browser',
    'http://foo.bar/?q=Test%20URL-encoded%20stuff',
    'http://foo.com/(something)?after=parens',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://☺.damowmow.com/',
    'http://✪df.ws/123',
    'http://➡.ws/䨹',
    'http://⌘.ws',
    'http://⌘.ws/',
    'http://j.mp',
    'https://foo.com/blah_(wikipedia)#cite-1',
  ].forEach(link =>
    expect(addHyperlinksToText(link)).toBe(
      `<a href=${link} target="_blank">${link}</a>`,
    ),
  )
})

it('should ignore invalid urls', () => {
  ;[
    'http://',
    'http://.',
    'http://..',
    'http://../',
    'http://?',
    'http://??',
    'http://??/',
    'http://#',
    'http://##',
    'http://##/',
    '//',
    '//a',
    '///a',
    '///',
    'http:///a',
    'rdar://1234',
    'h://test',
    ':// should fail',
    'http://-error-.invalid/',
    'http://0.0.0.0',
    'http://10.1.1.0',
    'http://10.1.1.255',
    'http://224.1.1.1',
    'http://142.42.1.1/',
    'http://142.42.1.1:8080/',
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
    'http://10.1.1.1',
    'http://10.1.1.254',
    'http://مثال.إختبار',
    'http://例子.测试',
  ].forEach(link => expect(addHyperlinksToText(link)).toBe(link))
})

it('list of false positives', () => {
  ;[
    'http://.www.foo.bar/',
    'http://www.foo.bar./',
    'http://.www.foo.bar./',
    'http://a.b--c.de/',
    'http://-a.b.co',
    'http://a.b-.co',
  ].forEach(link =>
    expect(addHyperlinksToText(link)).toBe(
      `<a href=${link} target="_blank">${link}</a>`,
    ),
  )
})

it('should convert valid emails to links', () => {
  ;['foo@bar.com', 'foo.bar@foobar.com', 'foo.bar.foo@barfoo.foo'].forEach(
    link =>
      expect(addHyperlinksToText(link)).toBe(
        `<a href="mailto:${link}">${link}</a>`,
      ),
  )
})

it('should not convert valid emails to links', () => {
  ;['foo@bar', 'foo.bar.foobar.com', 'foo.bar.foo@', 'foo@bar.'].forEach(link =>
    expect(addHyperlinksToText(link)).toBe(link),
  )
})
