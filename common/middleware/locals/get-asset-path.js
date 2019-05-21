const { manifest: manifestPath } = require('../../../config/paths')
const logger = require('../../../config/logger')
const { ASSETS_HOST } = require('../../../config')

module.exports = function getAssetPath (key, path = manifestPath) {
  try {
    const manifest = require(path)
    const assetPath = manifest[key] || key
    return `${ASSETS_HOST}/${assetPath}`
  } catch (err) {
    logger.error('Manifest file not found. Ensure assets are built.')
    return `${ASSETS_HOST}/${key}`
  }
}
