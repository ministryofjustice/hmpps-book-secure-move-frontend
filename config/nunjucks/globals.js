const { isFunction } = require('lodash')

const {
  ANALYTICS,
  ASSETS_HOST,
  ENABLE_COMPONENTS_LIBRARY,
  ENABLE_DEVELOPMENT_TOOLS,
  FEEDBACK_URL,
  PERSON_ESCORT_RECORD_FEEDBACK_URL,
  SUPPORT_EMAIL,
} = require('../')
const { mountpath: componentsUrl } = require('../../app/components')
const {
  mountpath: toolsMountpath,
  routes: toolsRoutes,
} = require('../../app/tools')
const i18n = require('../i18n')
const logger = require('../logger')
const { manifest: manifestPath } = require('../paths')

let webpackManifest = {}
const footerItems = [
  {
    href: FEEDBACK_URL,
    text: i18n.t('feedback_link'),
  },
  {
    href: ENABLE_COMPONENTS_LIBRARY ? componentsUrl : undefined,
    text: i18n.t('components::title'),
  },
  {
    href: ENABLE_DEVELOPMENT_TOOLS
      ? `${toolsMountpath}${toolsRoutes.permissions}`
      : undefined,
    text: 'Set permissions (dev only)',
  },
]

try {
  webpackManifest = require(manifestPath)
} catch (error) {
  logger.error(
    new Error('Manifest file is not found. Ensure assets are built.')
  )
  logger.error(error)
}

module.exports = {
  GA_ID: ANALYTICS?.GA_ID,
  FOOTER_ITEMS: footerItems.filter(item => item.href),
  PERSON_ESCORT_RECORD_FEEDBACK_URL,
  SUPPORT_EMAIL,
  SERVICE_NAME: 'Book a secure move',
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
