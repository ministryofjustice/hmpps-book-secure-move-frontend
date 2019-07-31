const { kebabCase } = require('lodash')

const config = require('../../config')
const configPaths = require('../../config/paths')
const nunjucksConfig = require('../../config/nunjucks')

/**
 * Return a filename name for a macro
 * @param {string} macroName
 * @returns {string} returns naming convention based macro name
 */
function _macroNameToFilename(macroName) {
  return kebabCase(macroName.replace(/^\b(app|govuk)/, ''))
}

function getComponent(macroName, params) {
  const nunjucksEnv = nunjucksConfig(null, config, configPaths)
  const macroParams = JSON.stringify(params, null, 2)
  const filename = _macroNameToFilename(macroName)
  const macroString = `
    {%- from "${filename}/macro.njk" import ${macroName} -%}
    {{- ${macroName}(${macroParams}) -}}
  `

  return nunjucksEnv.renderString(macroString)
}

module.exports = {
  getComponent,
}
