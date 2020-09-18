const Sentry = require('@sentry/node')
const { kebabCase } = require('lodash')

const config = require('../../config')
const nunjucksConfig = require('../../config/nunjucks')
const configPaths = require('../../config/paths')

/**
 * Return a filename name for a macro
 * @param {string} macroName
 * @returns {string} returns naming convention based macro name
 */
function _macroNameToFilepath(macroName) {
  if (macroName.includes('govuk')) {
    return 'govuk/components/' + kebabCase(macroName.replace(/^\b(govuk)/, ''))
  }

  return kebabCase(macroName.replace(/^\b(app)/, ''))
}

function getComponent(macroName, params = {}) {
  try {
    const nunjucksEnv = nunjucksConfig(null, config, configPaths)
    const macroParams = JSON.stringify(params, null, 2)
    const filename = _macroNameToFilepath(macroName)
    const macroString = `
    {%- from "${filename}/macro.njk" import ${macroName} -%}
    {{- ${macroName}(${macroParams}) -}}
  `

    return nunjucksEnv.renderString(macroString)
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('macroName', macroName)
      scope.setExtra('keys', Object.keys(params))
      scope.setExtra('id', params.id)
      scope.setExtra('type', params.type)
      scope.setExtra('version', params.version)
      scope.setExtra('name', params.name)
      Sentry.captureException(error)
    })

    return ''
  }
}

module.exports = {
  getComponent,
}
