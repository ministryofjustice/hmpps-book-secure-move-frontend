import cheerio from 'cheerio'
import nunjucks from 'nunjucks'

// @ts-expect-error // TODO: convert to TS
import { componentNameToMacroName, getExamples } from '../../common/helpers/component'
import * as filters from '../../config/nunjucks/filters'
// @ts-expect-error // TODO: convert to TS
import templateGlobals from '../../config/nunjucks/globals'
// @ts-expect-error // TODO: convert to TS
import configPaths from '../../config/paths'

// eslint-disable-next-line no-process-env
process.env.TZ = 'Europe/London'

const views = [
  configPaths.components,
  configPaths.govukFrontend,
  configPaths.mojFrontend,
  configPaths.hmrcFrontend,
]

const nunjucksEnvironment = nunjucks.configure(views, {
  trimBlocks: true,
  lstripBlocks: true,
})

// Filters
Object.keys(filters).forEach(filter => {
  nunjucksEnvironment.addFilter(filter, (filters as any)[filter])
})

// Global variables
Object.keys(templateGlobals).forEach(global => {
  nunjucksEnvironment.addGlobal(global, templateGlobals[global])
})

/**
 * Render a component's macro for testing
 * @param {string} componentName
 * @param {string} params parameters that are used in the component macro
 * @param {any} children any child components or text, pass the children to the macro
 * @param {string} explicitMacroName Explicit macro name to use
 * @returns {function} returns cheerio (jQuery) instance of the macro for easy DOM querying
 */
function renderComponentHtmlToCheerio(
  componentName: string,
  params?: string,
  children = false,
  explicitMacroName?: string
) {
  if (typeof params === 'undefined') {
    throw new Error(
      'Parameters passed to `render` should be an object but are undefined'
    )
  }

  const macroName = explicitMacroName || componentNameToMacroName(componentName)
  const macroParams = JSON.stringify(params, null, 2)

  let macroString = `{%- from "${componentName}/macro.njk" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  if (children) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${children}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  const output = nunjucks.renderString(macroString, {})
  return cheerio.load(output)
}

export {
  renderComponentHtmlToCheerio,
  getExamples,
}
