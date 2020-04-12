const fs = require('fs')
const path = require('path')

const cheerio = require('cheerio')
const nunjucks = require('nunjucks')
const yaml = require('js-yaml')

const configPaths = require('../../config/paths')
const views = [
  configPaths.components,
  configPaths.govukFrontend,
  configPaths.mojFrontend,
]

nunjucks.configure(views, {
  trimBlocks: true,
  lstripBlocks: true,
})

/**
 * Return a macro name for a component
 * @param {string} componentName
 * @returns {string} returns naming convention based macro name
 */
function _componentNameToMacroName(componentName) {
  const macroName = componentName
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `app${macroName}`
}

/**
 * Render a component's macro for testing
 * @param {string} componentName
 * @param {string} params parameters that are used in the component macro
 * @param {any} children any child components or text, pass the children to the macro
 * @returns {function} returns cheerio (jQuery) instance of the macro for easy DOM querying
 */
function renderComponentHtmlToCheerio(componentName, params, children = false) {
  if (typeof params === 'undefined') {
    throw new Error(
      'Parameters passed to `render` should be an object but are undefined'
    )
  }

  const macroName = _componentNameToMacroName(componentName)
  const macroParams = JSON.stringify(params, null, 2)

  let macroString = `{%- from "${componentName}/macro.njk" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  if (children) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${children}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  const output = nunjucks.renderString(macroString)
  return cheerio.load(output)
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples(componentPath) {
  const file = fs.readFileSync(
    path.join(configPaths.components, componentPath, `${componentPath}.yaml`),
    'utf8'
  )

  const docs = yaml.safeLoad(file)

  const examples = {}

  for (const example of docs.examples) {
    examples[example.name] = example.data
  }

  return examples
}

module.exports = {
  renderComponentHtmlToCheerio,
  getExamples,
}
