const nunjucks = require('nunjucks')

function componentNameToMacroName(componentName) {
  const macroName = componentName
    .toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `app${macroName}`
}

function renderComponentToHtml(componentName, params) {
  const macroName = componentNameToMacroName(componentName)
  const macroParams = JSON.stringify(params, null, 2)
  const macroString = `
    {%- from "${componentName}/macro.njk" import ${macroName} -%}
    {{- ${macroName}(${macroParams}) -}}`.trim()

  return nunjucks.renderString(macroString)
}

module.exports = {
  renderComponentToHtml,
}
