/*
  Used by Serverless during deployment.
  Provides API Gateway Response Templates to ~/serverless.yml
  File is not transpiled and must be directly executable by local
  Node.js runtime (e.g. no 'import/export' until .mjs lands in stable-Node)
*/
const fs = require('fs')
const path = require('path')
const {
  name: packageName,
  config: packageConfig,
} = require('../../../package.json')

module.exports = () => {
  const STAGE = process.env.STAGE || 'development'
  const STAGE_PREFIX = process.env.STAGE_PREFIX || 'development'
  const CDN_HOST_URL_PREFIX = `${packageConfig[STAGE_PREFIX].cdnHostUrl}/${packageName}/${STAGE}`
  const template = fs.readFileSync(
    path.resolve(__dirname, '../../../public/hold-on.html'),
    'utf-8',
  )

  return {
    DEFAULT_5XX: {
      'text/html': (() =>
        template
          .replace(/\$CDN_HOST_URL_PREFIX\$/g, CDN_HOST_URL_PREFIX)
          .replace(
            '<!-- $APIG_VELOCITY_TEMPLATE$ -->',
            `<div>
              <code>
                $context.error.responseType — $context.error.messageString
                <br/>
                Request ID $context.requestId
              </code>
            </div>`,
          ))(),
    },
  }
}
