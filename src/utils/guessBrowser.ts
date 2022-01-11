// This is only for simple browser guess, nothing too fancy
export function guessBrowser(userAgent: string) {
  if (/(opera|opr)/i.test(userAgent)) {
    return 'opera'
  }
  if (/chrome/i.test(userAgent)) {
    return 'chrome'
  }
  if (/safari/i.test(userAgent)) {
    return 'safari'
  }
  if (/firefox/i.test(userAgent)) {
    return 'firefox'
  }
  if (/msie/i.test(userAgent)) {
    return 'ie'
  }
  if (/edge/i.test(userAgent)) {
    return 'edge'
  }

  return 'unknown'
}

// This is for detecting if we're on an iPhoneX*
export function isIphoneX() {
  if (typeof window === 'undefined') {
    return false
  }
  const ratio = window.devicePixelRatio || 1
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  }
  // TODO: weirdly wo don't have to do any height calc even tho we run in a webview?
  // We're checking for iPhone X + Xr + Xs Max -> https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
  if (
    (screen.width === 828 && screen.height === 1792) ||
    (screen.width === 1125 && screen.height === 2436) ||
    (screen.width === 1242 && screen.height === 2688)
  ) {
    return true
  } else {
    return false
  }
}

export function calculateHeightOfNativeApp() {
  return isIphoneX() ? 30 : 20
}

export function isIE10(userAgent: string) {
  return userAgent.length ? !!userAgent.match(/MSIE 10.0/) : false
}

export function isIE11(userAgent: string) {
  return userAgent.length ? !!userAgent.match(/Trident\/[7,8]/) : false
}

export function isWin(userAgent: string) {
  return userAgent.length ? !!userAgent.match(/Win/) : false
}
