const nunjucks = require('nunjucks')

const templateGlobals = require('./globals')
const filters = require('./filters')

module.exports = (app, { ROOT, IS_DEV, NO_CACHE }) => {
  const views = [
    `${ROOT}/node_modules/govuk-frontend`,
    `${ROOT}/node_modules/govuk-frontend/components`,
    `${ROOT}/common/templates`,
    `${ROOT}/common/components`,
    `${ROOT}/app`,
  ]
  const nunjucksConfiguration = {
    express: app,
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
    watch: IS_DEV,
    noCache: IS_DEV,
  }

  // Initialise nunjucks environment
  const nunjucksEnvironment = nunjucks.configure(views, nunjucksConfiguration)

  // Custom filters
  Object.keys(filters).forEach((filter) => {
    nunjucksEnvironment.addFilter(filter, filters[filter])
  })

  // Global variables
  Object.keys(templateGlobals).forEach((global) => {
    nunjucksEnvironment.addGlobal(global, templateGlobals[global])
  })

  return nunjucksEnvironment
}
