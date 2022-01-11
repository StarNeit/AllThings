const BP = 880
const minDesktopScreenWidth = 1024
const minTabletScreenWidth = 600

export const MOBILE = 'sm'
export const DESKTOP = 'md'

export function width() {
  if (typeof document === 'undefined') {
    return null
  }

  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  return w < BP ? MOBILE : DESKTOP
}

export function isMobile() {
  if (typeof window === 'undefined') {
    return null
  }
  const dim2Check = isLandscape() ? window.screen.height : window.screen.width

  return dim2Check < minTabletScreenWidth
}

export function isTablet() {
  if (typeof window === 'undefined') {
    return null
  }
  const dim2Check = isLandscape() ? window.screen.height : window.screen.width

  return dim2Check < minDesktopScreenWidth && dim2Check >= minTabletScreenWidth
}

export function isLandscape() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.screen.width > window.screen.height
}

export function isIPad() {
  if (typeof navigator === 'undefined') {
    return null
  }

  return !!navigator.userAgent.match(/iPad/i)
}
