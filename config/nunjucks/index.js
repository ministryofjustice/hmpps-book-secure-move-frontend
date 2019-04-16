const nunjucks = require('nunjucks')

const templateGlobals = require('./globals')
const filters = require('./filters')

module.exports = (app, config) => {
  const env = nunjucks.configure([
    `${config.root}/node_modules/govuk-frontend`,
    `${config.root}/node_modules/govuk-frontend/components`,
    `${config.root}/common/templates`,
    `${config.root}/app`,
  ], {
    autoescape: true,
    express: app,
    watch: config.isDev,
    noCache: config.noCache,
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
