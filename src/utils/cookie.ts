export function storeCookie(
  name: string,
  value: string | number,
  ttlMs = 365 * 24 * 60 * 60 * 1000,
) {
  try {
    let expires = ''
    if (ttlMs) {
      const d = new Date()
      d.setTime(d.getTime() + ttlMs)
      expires = ` expires=${d.toUTCString()};`
    }

    document.cookie = `${name}=${value};${expires} path=/`
    return true
  } catch (e) {
    // document is not available
    return false
  }
}

export function extractCookie(cookie: string, name: string) {
  if (!cookie) {
    return null
  }
  const localeRaw = cookie
    .split(';')
    .filter(
      currentCookie =>
        currentCookie.indexOf('=') >= 0 &&
        currentCookie.split('=')[0].trim() === `${name}`,
    )
  return localeRaw.length > 0
    ? localeRaw[0]
        .split('=')
        .slice(1)
        .join('=')
        .trim()
    : null
}
