const { isFunction } = require('lodash')

const {
  ANALYTICS,
  ASSETS_HOST,
  FEEDBACK_URL,
  PERSON_ESCORT_RECORD_FEEDBACK_URL,
  SUPPORT_EMAIL,
} = require('../')
const i18n = require('../i18n')
const logger = require('../logger')
const { manifest: manifestPath } = require('../paths')

let webpackManifest = {}

try {
  webpackManifest = require(manifestPath)
} catch (error) {
  logger.error(
    new Error('Manifest file is not found. Ensure assets are built.')
  )
  logger.error(error)
}

module.exports = {
  FEEDBACK_URL,
  PERSON_ESCORT_RECORD_FEEDBACK_URL,
  SUPPORT_EMAIL,
  SERVICE_NAME: 'Book a secure move',
  GA_ID: ANALYTICS.GA_ID,
  t: (...args) => i18n.t(...args),
  callAsMacro(name) {
    const macro = this.ctx[name]

    if (!isFunction(macro)) {
      logger.warn(`'${name}' macro does not exist`)
      return () => ''
    }

    return macro
  },
  getAssetPath(asset) {
    const webpackAssetPath = webpackManifest[asset]

    if (webpackAssetPath) {
      return `${ASSETS_HOST}/${webpackAssetPath}`
    }

    return `${ASSETS_HOST}/${asset}`
  },
}
