const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')

const configPaths = require('../../config/paths')

/**
 * Return a macro name for a component
 * @param {string} componentName
 * @returns {string} returns naming convention based macro name
 */
function componentNameToMacroName(componentName) {
  const macroName = componentName
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `app${macroName}`
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples(componentName) {
  const docs = getConfig(componentName)

  const examples = {}

  for (const example of docs.examples) {
    examples[example.name] = example.data
  }

  return examples
}

/**
 * Return YAML configuration file for a component as an object
 * @param {string} componentName
 * @returns {object} returns object that contains the component configuration
 */
function getConfig(componentName) {
  const file = fs.readFileSync(
    path.join(configPaths.components, componentName, `${componentName}.yaml`),
    'utf8'
  )

  return yaml.safeLoad(file)
}

function mapComponentFolder(mountpath = '') {
  return ({ name }) => {
    return {
      name,
      url: `${mountpath}/${name}`,
      config: getConfig(name),
      macroName: componentNameToMacroName(name),
    }
  }
}

module.exports = {
  componentNameToMacroName,
  getExamples,
  getConfig,
  mapComponentFolder,
}
