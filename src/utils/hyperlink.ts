// Return string with links converted to Hyperlinks

const replaceRegex = (
  regex: RegExp,
  text: string,
  href: (text: string) => string,
) =>
  regex.test(text)
    ? text.replace(regex, email => `<a ${href(email)}>${email}</a>`)
    : text

export const addHyperlinksToText = (text: string) => {
  const emailRegex = /([^"(),:;<>@[\]\s\/]+)@([^"(),:;<>@[\]\s\/]+)\.([a-z\.]{2,6})/gi
  const urlRegex = /(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._()+~#&=\u00A0-\uFFFF]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._()+~#?&\/=\u00A0-\uFFFF]*)/gi

  const urlReplaced = replaceRegex(
    urlRegex,
    text,
    url => `href=${url} target="_blank"`,
  )
  const emailReplaced = replaceRegex(
    emailRegex,
    urlReplaced,
    email => `href="mailto:${email}"`,
  )

  return emailReplaced
}
