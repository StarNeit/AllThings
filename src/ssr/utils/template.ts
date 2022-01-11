import mixpanel from 'mixpanel'

import readFileIntoString from './readFileIntoString'
import {
  APIAI_DEV_TOKEN,
  APIAI_PROD_TOKEN,
  ARCHILOGIC_TOKEN,
  MIXPANEL_DEV_TOKEN,
  MIXPANEL_PROD_TOKEN,
  IS_DEV,
} from '../constants'
import { version } from '../../../package.json'

const LEGACY_BUNDLE_QUERY_PARAMETER = 'force-legacy-bundle'
const UNSUPPORTED_BROWSER_QUERY_PARAMETER = 'force-unsupported-browser'

const [
  DEV_BUNDLES,
  PROD_BUNDLES,
  DEV_LEGACY_TEST_BUNDLE,
  PROD_LEGACY_TEST_BUNDLE,
] = [
  `
    <!-- Modern browsers -->
    <script async type="module" src="$CDN_HOST_URL_PREFIX$/static/js/dev/bundle-dev.main.js" data-e2e="modern-bundle-script"></script>
    <!-- Legacy browsers -->
    <script nomodule src="$CDN_HOST_URL_PREFIX$/static/js/dev/legacy-bundle-dev.main.js" data-e2e="legacy-bundle-script"></script>
  `,
  `
    <!-- Modern browsers -->
    <script async type="module" crossorigin="anonymous" src="$CDN_HOST_URL_PREFIX$/static/js/prod/$MAIN_BUNDLE$" data-e2e="modern-bundle-script"></script>
    <!-- Legacy browsers -->
    <script nomodule src="$CDN_HOST_URL_PREFIX$/static/js/prod/$LEGACY_BUNDLE$" data-e2e="legacy-bundle-script"></script>
  `,
  `
    <!-- Legacy for testing only -->
    <script src="$CDN_HOST_URL_PREFIX$/static/js/dev/legacy-bundle-dev.main.js" data-e2e="legacy-testing-bundle-script"></script>
  `,
  `
    <!-- Legacy for testing only -->
    <script async src="$CDN_HOST_URL_PREFIX$/static/js/prod/$LEGACY_BUNDLE$" data-e2e="legacy-testing-bundle-script"></script>
  `,
]

const templateCache = new Map()

export default (request: any = {}) => {
  const templateKey = request.queryString

  if (templateCache.has(templateKey)) {
    return templateCache.get(templateKey)
  }
  const rawTemplate = IS_DEV
    ? readFileIntoString(__dirname, '../../../', `public/index-dev.html`)
    : require('../../../public/index.html')

  const forceToDev = /(staging|prerelease)/.test(request.hostname)

  const token = forceToDev || IS_DEV ? MIXPANEL_DEV_TOKEN : MIXPANEL_PROD_TOKEN

  // Init Mixpanel on the server.
  mixpanel.init(token, { disable_cookie: true, disable_persistence: true })

  // Check if the request contains the legacy query parameter that can be
  // used as a switch to force the legacy bundle to be injected in the
  // template for testing purposes (CI or development).
  const isLegacyBundleTest =
    request.queryStringParameters &&
    request.queryStringParameters.hasOwnProperty(LEGACY_BUNDLE_QUERY_PARAMETER)

  // Check if the request contains the unsupported query parameter that can be
  // used as a switch to force the unsupported browser to be triggered in the
  // template for testing purposes (CI or development).
  const isUnsupportedBrowserTest =
    request.queryStringParameters &&
    request.queryStringParameters.hasOwnProperty(
      UNSUPPORTED_BROWSER_QUERY_PARAMETER,
    )

  let template = rawTemplate
    .replace(
      '$BUNDLE_SCRIPTS$',
      isLegacyBundleTest
        ? IS_DEV
          ? DEV_LEGACY_TEST_BUNDLE
          : PROD_LEGACY_TEST_BUNDLE
        : IS_DEV
        ? DEV_BUNDLES
        : PROD_BUNDLES,
    )
    .replace(
      '$UNSUPPORTED_BROWSER$',
      isUnsupportedBrowserTest
        ? '<script>delete window.WebSocket</script>'
        : '',
    )
    .replace(/\$CDN_HOST_URL_PREFIX\$/g, process.env.CDN_HOST_URL_PREFIX || '')
    .replace(/\$VERSION\$/g, version)
    .replace('$MIXPANEL_TOKEN$', token)
    .replace('$APIAI_TOKEN$', IS_DEV ? APIAI_DEV_TOKEN : APIAI_PROD_TOKEN)
    .replace('$ARCHILOGIC_TOKEN$', ARCHILOGIC_TOKEN)

  if (!IS_DEV) {
    const [{ main: legacy }, { main }, { vendor }] = [
      require('../../../public/static/js/manifests/legacy-assets.main.json'),
      require('../../../public/static/js/manifests/assets.main.json'),
      require('../../../public/static/js/manifests/assets.vendor.json'),
    ]

    template = template
      .replace('$LEGACY_BUNDLE$', legacy.js)
      .replace('$MAIN_BUNDLE$', main.js)
      .replace('$VENDOR_BUNDLE$', vendor.js)
  }

  templateCache.set(templateKey, template)

  return template
}
