const nunjucks = require('nunjucks')

const filters = require('./filters')
const templateGlobals = require('./globals')

module.exports = (app, { IS_DEV = false }, paths) => {
  const views = [
    paths.govukFrontend,
    paths.mojFrontend,
    paths.templates,
    paths.components,
    paths.app,
  ]
  const nunjucksConfiguration = {
    autoescape: true,
    express: app,
    lstripBlocks: true,
    noCache: IS_DEV,
    throwOnUndefined: false,
    trimBlocks: true,
    watch: IS_DEV,
  }

  // Initialise nunjucks environment
  const nunjucksEnvironment = nunjucks.configure(views, nunjucksConfiguration)

  // Custom filters
  Object.keys(filters).forEach(filter => {
    nunjucksEnvironment.addFilter(filter, filters[filter])
  })

  // Global variables
  Object.keys(templateGlobals).forEach(global => {
    nunjucksEnvironment.addGlobal(global, templateGlobals[global])
  })

  return nunjucksEnvironment
}
