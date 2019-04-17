const nunjucks = require('nunjucks')

const templateGlobals = require('./globals')
const filters = require('./filters')

module.exports = (app, { ROOT, IS_DEV, NO_CACHE }) => {
  const env = nunjucks.configure([
    `${ROOT}/node_modules/govuk-frontend`,
    `${ROOT}/node_modules/govuk-frontend/components`,
    `${ROOT}/common/templates`,
    `${ROOT}/app`,
  ], {
    autoescape: true,
    express: app,
    watch: IS_DEV,
    noCache: NO_CACHE,
  })

  // Custom filters
  Object.keys(filters).forEach((filter) => {
    env.addFilter(filter, filters[filter])
  })

  // Global variables
  Object.keys(templateGlobals).forEach((global) => {
    env.addGlobal(global, templateGlobals[global])
  })

  return env
}
