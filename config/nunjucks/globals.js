const { isFunction } = require('lodash')

const { ASSETS_HOST, FEEDBACK_URL } = require('../')
const { manifest: manifestPath } = require('../paths')
const logger = require('../logger')

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
  SERVICE_NAME: 'Book a secure move',
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
