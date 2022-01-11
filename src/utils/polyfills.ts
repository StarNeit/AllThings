if (
  typeof window !== 'undefined' &&
  !(window as any).HTMLCanvasElement.prototype.toBlob
) {
  Object.defineProperty((window as any).HTMLCanvasElement.prototype, 'toBlob', {
    value(callback: OnClick, type: string, quality: string) {
      const binStr = window.atob(this.toDataURL(type, quality).split(',')[1])
      const len = binStr.length
      const arr = new Uint8Array(len)

      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i)
      }
      callback(new Blob([arr], { type: type || 'image/png' }))
    },
  })
}

/* tslint:disable:no-var-requires */
if (!(Intl as any).PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill')
  require('@formatjs/intl-pluralrules/dist/locale-data/de')
  require('@formatjs/intl-pluralrules/dist/locale-data/en')
  require('@formatjs/intl-pluralrules/dist/locale-data/fr')
  require('@formatjs/intl-pluralrules/dist/locale-data/it')
  require('@formatjs/intl-pluralrules/dist/locale-data/pt')
  require('@formatjs/intl-pluralrules/dist/locale-data/nl')
}

if (!(Intl as any).RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/de')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/fr')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/it')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/pt')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/nl')
}
/* tslint:enable:no-var-requires */
