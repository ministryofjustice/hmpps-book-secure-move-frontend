const { isFunction } = require('lodash')

const {
  ANALYTICS,
  ASSETS_HOST,
  AUTH_BASE_URL,
  ENABLE_COMPONENTS_LIBRARY,
  FEEDBACK_URL,
  SUPPORT_EMAIL,
  FEATURE_FLAGS,
  SUPPORT_URL,
} = require('../')
const { mountpath: componentsUrl } = require('../../app/components')
const i18n = require('../i18n').default
const logger = require('../logger')
const { manifest: manifestPath } = require('../paths')

let webpackManifest = {}

const footerItems = [
  {
    href: '/whats-new',
    text: "What's new",
  },
  {
    href: SUPPORT_URL,
    text: 'Support',
  },
  {
    href: '/help/accessibility-statement',
    text: 'Accessibility statement',
  },
  {
    href: ENABLE_COMPONENTS_LIBRARY ? componentsUrl : undefined,
    text: i18n.t('components::title'),
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
  SUPPORT_EMAIL,
  FEEDBACK_URL,
  AUTH_BASE_URL,
  FEATURE_FLAGS,
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
