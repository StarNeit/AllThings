import isFileAvailable from 'utils/isFileAvailable'
import { Locale } from 'enums'

const DATA_PROTECTION_URL = 'https://docs.allthings.me/legal/privacy/privacy_'
const EXT = '.pdf'
const FALLBACK_COUNTRY = 'de'
const NOT_FOUND = '404'

const isDataProtectionAvailableForLocale = async ({
  country,
  locale,
}: {
  country: string
  locale: Locale
}) => {
  const url = `${DATA_PROTECTION_URL}${
    locale.toLowerCase().split('_')[0]
  }_${country}${EXT}`
  return (await isFileAvailable(url)) && url
}

const getDataProtectionURL = async ({
  country,
  locale,
  localeFallback,
}: {
  country: string
  locale: Locale
  localeFallback: Locale
}) =>
  // Try to get the URL for the current locale + country code.
  (await isDataProtectionAvailableForLocale({ country, locale })) ||
  // Use the fallback locale if different from the current locale.
  (locale !== localeFallback
    ? await isDataProtectionAvailableForLocale({
        country,
        locale: localeFallback,
      })
    : false) ||
  // Use the fallback country and the current locale.
  (await isDataProtectionAvailableForLocale({
    country: FALLBACK_COUNTRY,
    locale,
  })) ||
  // Finally try with both fallbacks.
  (await isDataProtectionAvailableForLocale({
    country: FALLBACK_COUNTRY,
    locale: localeFallback,
  })) ||
  // Finally return the NOT_FOUND route  if nothing was found, but this should
  // not occur in production!
  NOT_FOUND

export default getDataProtectionURL
